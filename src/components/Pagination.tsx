import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function usePageSlice<T>(items: T[], page: number, perPage: number) {
  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), pageCount);
  return {
    pageCount,
    safePage,
    slice: items.slice((safePage - 1) * perPage, safePage * perPage),
  };
}

export function Pagination({
  page,
  pageCount,
  onChange,
  total,
  label = "élément",
  className,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  total?: number;
  label?: string;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  const pages: (number | "…")[] = [];
  for (let p = 1; p <= pageCount; p++) {
    if (p === 1 || p === pageCount || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn("mt-6 flex flex-wrap items-center justify-center gap-2", className)}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Page précédente"
        className="grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 font-mono text-xs text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "min-w-9 rounded-xl border px-3 py-2 font-mono text-xs font-semibold transition-colors",
              p === page
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        aria-label="Page suivante"
        className="grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>

      {total !== undefined && (
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">
          {total} {label}
          {total > 1 ? "s" : ""}
        </span>
      )}
    </nav>
  );
}
