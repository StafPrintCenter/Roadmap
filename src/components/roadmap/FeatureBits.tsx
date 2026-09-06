import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronUp } from "lucide-react";
import { STATUS_META, type RoadmapFeature } from "@/data/featuresData";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: RoadmapFeature["status"]; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide",
        meta.soft,
        meta.text,
        className,
      )}
    >
      <span aria-hidden>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}

export function SubdomainTag({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] text-secondary-foreground">
      {value}
    </span>
  );
}

export function ProgressBar({ value, status }: { value: number; status: RoadmapFeature["status"] }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={cn("h-full rounded-full transition-all duration-700", STATUS_META[status].color)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function VoteButton({
  count,
  voted,
  onClick,
  size = "sm",
}: {
  count: number;
  voted: boolean;
  onClick: () => void;
  size?: "sm" | "lg";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={voted}
      className={cn(
        "inline-flex shrink-0 flex-col items-center justify-center rounded-xl border transition-all",
        voted
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
        size === "lg" ? "min-w-16 px-3 py-2.5" : "min-w-11 px-2 py-1.5",
      )}
    >
      <ChevronUp className={size === "lg" ? "size-5" : "size-4"} />
      <span className={cn("font-mono font-bold", size === "lg" ? "text-base" : "text-xs")}>
        {count}
      </span>
    </button>
  );
}

export function FeatureCard({
  feature,
  votes,
  voted,
  onVote,
  variant = "grid",
}: {
  feature: RoadmapFeature;
  votes: number;
  voted: boolean;
  onVote: () => void;
  variant?: "grid" | "kanban" | "list";
}) {
  if (variant === "list") {
    return (
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-3 py-3 transition-colors last:border-0 hover:bg-secondary/50">
        <VoteButton count={votes} voted={voted} onClick={onVote} />
        <div className="min-w-0">
          <Link
            to="/features/$featureId"
            params={{ featureId: feature.id }}
            className="block truncate text-sm font-semibold hover:text-primary"
          >
            {feature.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <SubdomainTag value={feature.subdomain} />
            <span className="font-mono text-[10px] text-muted-foreground">{feature.quarter}</span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {feature.progressPercentage}%
            </span>
          </div>
        </div>
        <StatusBadge status={feature.status} className="hidden sm:inline-flex" />
      </div>
    );
  }

  return (
    <article
      className={cn(
        "group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg",
        variant === "kanban" && "p-3.5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <StatusBadge status={feature.status} />
        <span className="font-mono text-[10px] text-muted-foreground">{feature.quarter}</span>
      </div>

      <Link
        to="/features/$featureId"
        params={{ featureId: feature.id }}
        className="font-display text-base font-bold leading-snug transition-colors group-hover:text-primary"
      >
        {feature.title}
      </Link>

      <p className="line-clamp-3 text-sm text-muted-foreground">{feature.description}</p>

      <div className="flex flex-wrap items-center gap-2">
        <SubdomainTag value={feature.subdomain} />
        <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
          {feature.category}
        </span>
      </div>

      <div className="mt-auto space-y-2 pt-1">
        <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
          <span>Progression</span>
          <span>{feature.progressPercentage}%</span>
        </div>
        <ProgressBar value={feature.progressPercentage} status={feature.status} />
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <VoteButton count={votes} voted={voted} onClick={onVote} />
        <Link
          to="/features/$featureId"
          params={{ featureId: feature.id }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          Détails <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
