"use client";

import { useState } from "react";

export function AdvancedForm() {
  const [showReasoning, setShowReasoning] = useState(true);
  const [rememberAnonymous, setRememberAnonymous] = useState(true);
  const [model, setModel] = useState("claude-4.5");
  const [extendedThinking, setExtendedThinking] = useState(true);
  const [temperature, setTemperature] = useState(1.0);

  const handleReset = () => {
    setShowReasoning(false);
    setRememberAnonymous(false);
    setModel("claude-4.5");
    setExtendedThinking(false);
    setTemperature(0.7);
  };

  return (
    <div className="space-y-6">

      {/* Show Reasoning */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-surface-900">
              Show Reasoning
            </p>
            <p className="mt-1 text-xs text-surface-500">
              Show AI thinking process to users in the widget. When enabled,
              users can see reasoning steps and tool calls.
            </p>
          </div>

          <Toggle
            enabled={showReasoning}
            setEnabled={setShowReasoning}
          />
        </div>
      </Card>

      {/* Remember Anonymous */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-surface-900">
              Remember Anonymous Conversations
            </p>
            <p className="mt-1 text-xs text-surface-500">
              Keep conversation history for anonymous users on page refresh.
              When disabled, refreshing starts a new conversation.
            </p>
          </div>

          <Toggle
            enabled={rememberAnonymous}
            setEnabled={setRememberAnonymous}
          />
        </div>
      </Card>

      {/* AI Model */}
      <Card>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-surface-900">
            AI Model
          </p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-surface-700">
              Select the AI model
            </span>

            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="rounded-md border border-surface-200 px-3 py-1 text-sm"
            >
              <option value="claude-4.5">
                Claude Sonnet 4.5 (Anthropic)
              </option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
            </select>
          </div>

          <p className="text-xs text-surface-500">
            Claude Sonnet 4.5: Best for complex reasoning. GPT-4o:
            Faster responses.
          </p>
        </div>
      </Card>

      {/* Extended Thinking */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-surface-900">
              Extended Thinking
            </p>
            <p className="mt-1 text-xs text-surface-500">
              Enable deeper reasoning for complex queries. Locks
              temperature to 1.0 when enabled (Anthropic requirement).
            </p>
          </div>

          <Toggle
            enabled={extendedThinking}
            setEnabled={(val) => {
              setExtendedThinking(val);
              if (val) setTemperature(1.0);
            }}
          />
        </div>
      </Card>

      {/* Model Temperature */}
      <Card>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-surface-900">
              Model Temperature
            </p>
            <span className="text-sm font-medium text-surface-800">
              {temperature.toFixed(1)}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            disabled={extendedThinking}
            onChange={(e) =>
              setTemperature(Number(e.target.value))
            }
            className="w-full"
          />

          <p className="text-xs text-surface-500">
            Temperature is locked to 1.0 when extended thinking is enabled.
          </p>
        </div>
      </Card>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handleReset}
          className="text-sm text-surface-600 hover:text-black"
        >
          Reset to Default
        </button>

        <button className="rounded-md bg-surface-800 px-5 py-2 text-sm font-medium text-white">
          Save Changes
        </button>
      </div>

    </div>
  );
}

/* ---------- Card Wrapper ---------- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
      {children}
    </div>
  );
}

/* ---------- Toggle ---------- */

function Toggle({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
        enabled ? "bg-surface-900" : "bg-surface-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

