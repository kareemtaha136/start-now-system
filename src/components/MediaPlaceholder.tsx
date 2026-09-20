import { ImageIcon } from "lucide-react";

type MediaPlaceholderProps = {
  label: string;
  className?: string;
  compact?: boolean;
};

export function MediaPlaceholder({ label, className = "", compact = false }: MediaPlaceholderProps) {
  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-lg border border-dashed border-placeholder-border bg-placeholder text-center ${compact ? "min-h-44" : "min-h-72"} ${className}`}
      role="img"
      aria-label={`${label} placeholder`}
    >
      <div className="relative z-10 max-w-52 px-5 py-8">
        <ImageIcon className="mx-auto size-6 text-primary" aria-hidden="true" />
        <p className="mt-3 text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">Real marketing asset goes here</p>
      </div>
    </div>
  );
}