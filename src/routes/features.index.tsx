import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Activity, ArrowUpRight, Gauge, ThumbsUp, Timer } from "lucide-react";
import { RoadmapShell } from "@/components/RoadmapShell";
import { Pagination, usePageSlice } from "@/components/Pagination";
import { ProgressBar, StatusBadge, SubdomainTag } from "@/components/roadmap/FeatureBits";
import {
  CATEGORIES,
  STATUS_META,
  STATUS_ORDER,
  SUBDOMAINS,
  features as baseFeatures,
} from "@/data/featuresData";
import { useUpvotes } from "@/hooks/useUpvotes";
import { useSubmissions } from "@/hooks/useSubmissions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/features/")({
  head: () => ({
    meta: [
      { title: "Priorités & analyses du backlog — SPC Roadmap" },
      {
        name: "description",
        content:
          "Tableau de bord du backlog STAF PRINT : progression moyenne, répartition par plateforme et catégorie, classement des priorités votées par la communauté.",
      },
      { property: "og:title", content: "Priorités & analyses du backlog — SPC Roadmap" },
      {
        property: "og:description",
        content:
          "Chiffres clés, répartition et classement des priorités de l'écosystème STAF PRINT CENTER.",
      },
    ],
  }),
  component: FeaturesInsights,
});

const PER_PAGE = 8;

function FeaturesInsights() {
  const { bonus } = useUpvotes();
  const { submissions } = useSubmissions();
  const [page, setPage] = useState(1);

  const all = useMemo(() => [...submissions, ...baseFeatures], [submissions]);

  const votesOf = (id: string, base: number) => base + bonus(id);

  const kpis = useMemo(() => {
    const totalVotes = all.reduce((sum, f) => sum + votesOf(f.id, f.upvotes), 0);
    const avgProgress = Math.round(
      all.reduce((sum, f) => sum + f.progressPercentage, 0) / (all.length || 1),
    );
    const now = new Date();
    const next90 = all.filter((f) => {
      const d = new Date(f.targetReleaseDate);
      return d >= now && +d - +now <= 90 * 86400000;
    }).length;
    return { total: all.length, totalVotes, avgProgress, next90 };
  }, [all, bonus]);

  const bySubdomain = useMemo(
    () =>
      SUBDOMAINS.map((s) => ({
        key: s,
        count: all.filter((f) => f.subdomain === s).length,
      })).sort((a, b) => b.count - a.count),
    [all],
  );

  const byCategory = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        key: c,
        count: all.filter((f) => f.category === c).length,
      })).sort((a, b) => b.count - a.count),
    [all],
  );

  const ranking = useMemo(
    () =>
      [...all].sort((a, b) => votesOf(b.id, b.upvotes) - votesOf(a.id, a.upvotes)),
    [all, bonus],
  );

  const { slice, pageCount, safePage } = usePageSlice(ranking, page, PER_PAGE);
  const maxSub = Math.max(1, ...bySubdomain.map((s) => s.count));

  return (
    <RoadmapShell>
      {/* KPI */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Activity, label: "Fonctionnalités suivies", value: kpis.total },
          { icon: ThumbsUp, label: "Votes cumulés", value: kpis.totalVotes },
          { icon: Gauge, label: "Progression moyenne", value: `${kpis.avgProgress} %` },
          { icon: Timer, label: "Livraisons sous 90 jours", value: kpis.next90 },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-5">
            <k.icon className="size-4 text-primary" />
            <p className="mt-3 font-display text-3xl font-bold">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </section>

      {/* Répartitions */}
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-base font-bold">Charge par plateforme</h2>
          <ul className="mt-4 space-y-3">
            {bySubdomain.map((s) => (
              <li key={s.key} className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate font-mono text-[11px] text-muted-foreground">
                  {s.key}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${(s.count / maxSub) * 100}%` }}
                  />
                </span>
                <span className="w-6 shrink-0 text-right font-mono text-xs font-semibold">
                  {s.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-base font-bold">Avancement par statut</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {STATUS_ORDER.map((s) => {
              const items = all.filter((f) => f.status === s);
              const avg = Math.round(
                items.reduce((sum, f) => sum + f.progressPercentage, 0) / (items.length || 1),
              );
              return (
                <div key={s} className="rounded-xl border border-border bg-surface/50 p-3">
                  <StatusBadge status={s} />
                  <p className="mt-2 font-display text-xl font-bold">{items.length}</p>
                  <div className="mt-2"><ProgressBar value={avg} status={s} /></div>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {avg} % en moyenne · {STATUS_META[s].label}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {byCategory.map((c) => (
              <span
                key={c.key}
                className="rounded-full bg-secondary px-3 py-1.5 text-[11px] font-semibold"
              >
                {c.key} · {c.count}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Classement */}
      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold">Classement des priorités</h2>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            Explorer le backlog complet <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <ol className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          {slice.map((f, i) => (
            <li key={f.id}>
              <Link
                to="/features/$featureId"
                params={{ featureId: f.id }}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 transition-colors hover:bg-secondary/50",
                  i > 0 && "border-t border-border",
                )}
              >
                <span className="w-8 shrink-0 font-display text-lg font-bold text-muted-foreground">
                  {(safePage - 1) * PER_PAGE + i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{f.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <SubdomainTag value={f.subdomain} />
                    <StatusBadge status={f.status} />
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-display text-base font-bold">
                    {votesOf(f.id, f.upvotes)}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">votes</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <Pagination
          page={safePage}
          pageCount={pageCount}
          onChange={setPage}
          total={ranking.length}
          label="fonctionnalité"
        />
      </section>
    </RoadmapShell>
  );
}
