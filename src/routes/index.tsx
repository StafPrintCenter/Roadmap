import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Columns3, LayoutGrid, List, Sparkles } from "lucide-react";
import { RoadmapShell } from "@/components/RoadmapShell";
import { Pagination, usePageSlice } from "@/components/Pagination";
import { FeatureCard, StatusBadge } from "@/components/roadmap/FeatureBits";
import {
  STATUS_META,
  STATUS_ORDER,
  SUBDOMAINS,
  features as baseFeatures,
  type FeatureStatus,
} from "@/data/featuresData";
import { useUpvotes } from "@/hooks/useUpvotes";
import { useSubmissions } from "@/hooks/useSubmissions";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

const PAGE_TITLE = `SPC Roadmap | ${SITE.name}`;
const PAGE_DESC = `Suivi public des développements, jalons et versions de l'écosystème ${SITE.name}.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: "SPC Roadmap — Explorateur de l'écosystème STAF PRINT" },
      {
        property: "og:description",
        content:
          "Suivez la construction de l'écosystème STAF PRINT CENTER : Kanban, liste et grille de toutes les évolutions produit.",
      },
    ],
  }),
  component: Index,
});

type ViewMode = "kanban" | "list" | "grid";
type SortMode = "votes" | "recent" | "subdomain";

function Index() {
  const [view, setView] = useState<ViewMode>("kanban");
  const [sort, setSort] = useState<SortMode>("votes");
  const [subdomain, setSubdomain] = useState<string>("all");
  const [page, setPage] = useState(1);
  const { toggleVote, hasVoted, bonus } = useUpvotes();
  const { submissions } = useSubmissions();

  const all = useMemo(() => [...submissions, ...baseFeatures], [submissions]);

  const filtered = useMemo(() => {
    const list = all.filter((f) => subdomain === "all" || f.subdomain === subdomain);
    return [...list].sort((a, b) => {
      if (sort === "votes") return b.upvotes + bonus(b.id) - (a.upvotes + bonus(a.id));
      if (sort === "recent")
        return +new Date(a.targetReleaseDate) - +new Date(b.targetReleaseDate);
      return a.subdomain.localeCompare(b.subdomain);
    });
  }, [all, subdomain, sort, bonus]);

  const {
    slice: paged,
    pageCount,
    safePage,
  } = usePageSlice(filtered, page, view === "kanban" ? 16 : 9);

  const stats = useMemo(() => {
    const by = (s: FeatureStatus) => all.filter((f) => f.status === s).length;
    return STATUS_ORDER.map((s) => ({ status: s, count: by(s) }));
  }, [all]);

  return (
    <RoadmapShell>
      {/* Hero */}
      <section className="grid-bg relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10">
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-foreground">
            <Sparkles className="size-3" /> Transparence produit
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">
            Ce que nous construisons pour{" "}
            <span className="text-primary">STAF PRINT CENTER</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Impression, formation, IA, gamification et infrastructure : suivez chaque évolution de
            l'écosystème, votez pour vos priorités et proposez vos idées.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/submit"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
            >
              Proposer une idée
            </Link>
            <Link
              to="/calendar"
              className="rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Voir le calendrier
            </Link>
          </div>
        </div>
        <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.status} className="rounded-2xl border border-border bg-background p-4">
              <div className="font-display text-2xl font-bold">{s.count}</div>
              <StatusBadge status={s.status} className="mt-2" />
            </div>
          ))}
        </div>
      </section>

      {/* Controls */}
      <section className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <select
            value={subdomain}
            onChange={(e) => {
              setSubdomain(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-border bg-card px-3 py-2 font-mono text-xs"
          >
            <option value="all">Tous les sous-domaines</option>
            {SUBDOMAINS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium"
          >
            <option value="votes">Plus votés</option>
            <option value="recent">Prochaines livraisons</option>
            <option value="subdomain">Par sous-domaine</option>
          </select>
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-xl border border-border bg-card p-1">
          {(
            [
              { id: "kanban", icon: Columns3, label: "Kanban" },
              { id: "list", icon: List, label: "Liste" },
              { id: "grid", icon: LayoutGrid, label: "Grille" },
            ] as const
          ).map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setView(v.id);
                setPage(1);
              }}
              aria-pressed={view === v.id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                view === v.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <v.icon className="size-3.5" />
              <span className="hidden sm:inline">{v.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Views */}
      <section className="mt-6">
        {view === "kanban" && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {STATUS_ORDER.map((status) => {
              const items = paged.filter((f) => f.status === status);
              return (
                <div key={status} className="rounded-2xl border border-border bg-surface/60 p-3">
                  <div className="flex items-center justify-between gap-2 px-1 pb-3">
                    <StatusBadge status={status} />
                    <span className="font-mono text-xs text-muted-foreground">{items.length}</span>
                  </div>
                  <div className="space-y-3">
                    {items.map((f) => (
                      <FeatureCard
                        key={f.id}
                        feature={f}
                        variant="kanban"
                        votes={f.upvotes + bonus(f.id)}
                        voted={hasVoted(f.id)}
                        onVote={() => toggleVote(f.id)}
                      />
                    ))}
                    {items.length === 0 && (
                      <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                        Aucune fonctionnalité
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "list" && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {paged.map((f) => (
              <FeatureCard
                key={f.id}
                feature={f}
                variant="list"
                votes={f.upvotes + bonus(f.id)}
                voted={hasVoted(f.id)}
                onVote={() => toggleVote(f.id)}
              />
            ))}
          </div>
        )}

        {view === "grid" && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paged.map((f) => (
              <FeatureCard
                key={f.id}
                feature={f}
                votes={f.upvotes + bonus(f.id)}
                voted={hasVoted(f.id)}
                onVote={() => toggleVote(f.id)}
              />
            ))}
          </div>
        )}
        <Pagination
          page={safePage}
          pageCount={pageCount}
          onChange={setPage}
          total={filtered.length}
          label="fonctionnalité"
        />
      </section>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {filtered.length} fonctionnalité{filtered.length > 1 ? "s" : ""} affichée
        {filtered.length > 1 ? "s" : ""} · statuts :{" "}
        {STATUS_ORDER.map((s) => STATUS_META[s].label).join(" · ")}
      </p>
    </RoadmapShell>
  );
}
