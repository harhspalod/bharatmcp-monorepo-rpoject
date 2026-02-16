import type { ToolParameter } from '@bharatmcp/types';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  parameter: string;
  message: string;
  code: ValidationErrorCode;
}

export type ValidationErrorCode =
  | 'REQUIRED'
  | 'TYPE_MISMATCH'
  | 'OUT_OF_RANGE'
  | 'PATTERN_MISMATCH'
  | 'INVALID_ENUM'
  | 'INVALID_STRUCTURE'
  | 'UNKNOWN_FIELD'
  | 'CONDITIONAL_REQUIRED'
  | 'CONFLICT';

export class ParameterValidator {

  validate(
    definitions: ToolParameter[],
    values: Record<string, unknown>,
    options?: { allowUnknownFields?: boolean }
  ): ValidationResult {

    const errors: ValidationError[] = [];
    const allowUnknown = options?.allowUnknownFields ?? false;

    // Check for unknown fields
    if (!allowUnknown) {
      for (const key of Object.keys(values)) {
        if (!definitions.some(d => d.name === key)) {
          errors.push({
            parameter: key,
            message: `"${key}" is not a valid parameter`,
            code: 'UNKNOWN_FIELD'
          });
        }
      }
    }

    for (const param of definitions) {
      const value = values[param.name];
      this.validateSingleParam(param, value, param.name, values, errors);
    }

    return { valid: errors.length === 0, errors };
  }

  applyDefaults(
    definitions: ToolParameter[],
    values: Record<string, unknown>
  ): Record<string, unknown> {

    const result = { ...values };

    for (const param of definitions) {
      if (result[param.name] === undefined && param.defaultValue !== undefined) {
        result[param.name] = param.defaultValue;
      }

      if (
        param.type === 'object' &&
        param.properties &&
        typeof result[param.name] === 'object' &&
        result[param.name] !== null
      ) {
        result[param.name] = this.applyDefaults(
          param.properties,
          result[param.name] as Record<string, unknown>
        );
      }
    }

    return result;
  }

  private validateSingleParam(
    param: ToolParameter,
    value: unknown,
    path: string,
    rootValues: Record<string, unknown>,
    errors: ValidationError[]
  ): void {

    // ----- RequiredIf -----
    if (param.validation?.requiredIf) {
      for (const cond of param.validation.requiredIf) {
        if (rootValues[cond.field] === cond.value && (value === undefined || value === null)) {
          errors.push({
            parameter: path,
            message: `"${param.label || param.name}" is required`,
            code: 'CONDITIONAL_REQUIRED'
          });
        }
      }
    }

    // ----- ForbiddenIf -----
    if (param.validation?.forbiddenIf) {
      for (const cond of param.validation.forbiddenIf) {
        if (rootValues[cond.field] === cond.value && value !== undefined) {
          errors.push({
            parameter: path,
            message: `"${param.label || param.name}" cannot be used when "${cond.field}" is ${cond.value}`,
            code: 'CONFLICT'
          });
        }
      }
    }

    // ----- Required -----
    if ((value === undefined || value === null) && param.required) {
      errors.push({
        parameter: path,
        message: `"${param.label || param.name}" is required`,
        code: 'REQUIRED'
      });
      return;
    }

    if (value === undefined || value === null) return;

    // ----- Type check -----
    if (!this.isCorrectType(param.type, value)) {
      errors.push({
        parameter: path,
        message: `"${param.label || param.name}" should be ${param.type}`,
        code: 'TYPE_MISMATCH'
      });
      return;
    }

    // ----- Enum check -----
    if (param.type === 'enum' && param.enumValues) {
      const allowed = param.enumValues.map(e => e.value);
      if (!allowed.includes(String(value))) {
        errors.push({
          parameter: path,
          message: `"${param.label || param.name}" must be one of: ${allowed.join(', ')}`,
          code: 'INVALID_ENUM'
        });
      }
    }

    // ----- String & Number rules -----
    if (param.validation) {
      this.checkValidationRules(param, value, path, errors);
    }

    // ----- Object recursion -----
    if (param.type === 'object' && param.properties && typeof value === 'object') {
      const obj = value as Record<string, unknown>;

      for (const nested of param.properties) {
        this.validateSingleParam(
          nested,
          obj[nested.name],
          `${path}.${nested.name}`,
          obj,
          errors
        );
      }
    }

    // ----- Array validation -----
    if (param.type === 'array' && Array.isArray(value)) {

      const rules = param.validation;

      if (rules?.minItems !== undefined && value.length < rules.minItems) {
        errors.push({
          parameter: path,
          message: `"${param.label || param.name}" must have at least ${rules.minItems} items`,
          code: 'OUT_OF_RANGE'
        });
      }

      if (rules?.maxItems !== undefined && value.length > rules.maxItems) {
        errors.push({
          parameter: path,
          message: `"${param.label || param.name}" must have at most ${rules.maxItems} items`,
          code: 'OUT_OF_RANGE'
        });
      }

      if (rules?.uniqueItems) {
        const set = new Set(value.map(v => JSON.stringify(v)));
        if (set.size !== value.length) {
          errors.push({
            parameter: path,
            message: `"${param.label || param.name}" items must be unique`,
            code: 'INVALID_STRUCTURE'
          });
        }
      }

      if (param.items) {
        for (let i = 0; i < value.length; i++) {
          this.validateSingleParam(
            param.items,
            value[i],
            `${path}[${i}]`,
            rootValues,
            errors
          );
        }
      }
    }
  }

  private isCorrectType(expectedType: string, value: unknown): boolean {
    switch (expectedType) {
      case 'string':  return typeof value === 'string';
      case 'number':  return typeof value === 'number' && !isNaN(value);
      case 'boolean': return typeof value === 'boolean';
      case 'object':  return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':   return Array.isArray(value);
      case 'enum':    return typeof value === 'string' || typeof value === 'number';
      case 'date':    return typeof value === 'string' && !isNaN(Date.parse(value));
      case 'file':    return true; // file validation handled elsewhere
      default:        return false;
    }
  }

  private checkValidationRules(
    param: ToolParameter,
    value: unknown,
    path: string,
    errors: ValidationError[]
  ): void {

    const rules = param.validation!;
    const label = param.label || param.name;

    if (typeof value === 'string') {
      if (rules.min !== undefined && value.length < rules.min) {
        errors.push({ parameter: path, message: `"${label}" must be at least ${rules.min} characters`, code: 'OUT_OF_RANGE' });
      }
      if (rules.max !== undefined && value.length > rules.max) {
        errors.push({ parameter: path, message: `"${label}" must be at most ${rules.max} characters`, code: 'OUT_OF_RANGE' });
      }
      if (rules.pattern) {
        try {
          const regex = new RegExp(rules.pattern);
          if (!regex.test(value)) {
            errors.push({ parameter: path, message: `"${label}" format is invalid`, code: 'PATTERN_MISMATCH' });
          }
        } catch {
          errors.push({ parameter: path, message: `"${label}" has invalid validation pattern`, code: 'INVALID_STRUCTURE' });
        }
      }
    }

    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push({ parameter: path, message: `"${label}" must be ≥ ${rules.min}`, code: 'OUT_OF_RANGE' });
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push({ parameter: path, message: `"${label}" must be ≤ ${rules.max}`, code: 'OUT_OF_RANGE' });
      }
    }
  }
}
