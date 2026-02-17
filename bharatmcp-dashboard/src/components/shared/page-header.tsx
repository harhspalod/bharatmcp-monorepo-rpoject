interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-surface-900">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-surface-500">{description}</p>
      )}
    </div>
  );
}
