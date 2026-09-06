import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bug, Rocket, Zap } from "lucide-react";
import { RoadmapShell } from "@/components/RoadmapShell";
import { Pagination, usePageSlice } from "@/components/Pagination";
import { changelog } from "@/data/featuresData";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Notes de version — SPC Roadmap" },
      {
        name: "description",
        content:
          "Historique complet des versions de l'écosystème STAF PRINT CENTER : nouveautés, améliorations et correctifs par release.",
      },
      { property: "og:title", content: "Notes de version — SPC Roadmap" },
      {
        property: "og:description",
        content: "Toutes les nouveautés, améliorations et correctifs déployés chez STAF PRINT.",
      },
    ],
  }),
  component: ChangelogPage,
});

const TYPE_META = {
  new: { label: "Nouveauté", icon: Rocket, className: "bg-done-soft text-done" },
  improved: { label: "Amélioration", icon: Zap, className: "bg-dev-soft text-dev" },
  fixed: { label: "Correctif", icon: Bug, className: "bg-study-soft text-study" },
} as const;

function ChangelogPage() {
  const [page, setPage] = useState(1);
  const { slice, pageCount, safePage } = usePageSlice(changelog, page, 3);

  return (
    <RoadmapShell>
      <ol className="relative space-y-8 border-l border-border pl-6 sm:pl-8">
        {slice.map((release) => (
          <li key={release.version} className="relative">
            <span className="absolute -left-[2.05rem] grid size-7 place-items-center rounded-full bg-primary font-mono text-[9px] font-bold text-primary-foreground sm:-left-[2.55rem]">
              {release.version.replace("v", "")}
            </span>
            <article className="rounded-2xl border border-border bg-card p-5">
              <header className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-primary px-2.5 py-1 font-mono text-xs font-bold text-primary-foreground">
                  {release.version}
                </span>
                <h2 className="font-display text-lg font-bold">{release.title}</h2>
                <span className="font-mono text-xs text-muted-foreground">
                  {new Date(release.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </header>

              <ul className="mt-4 space-y-2.5">
                {release.items.map((item, i) => {
                  const meta = TYPE_META[item.type];
                  const Icon = meta.icon;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold ${meta.className}`}
                      >
                        <Icon className="size-3" />
                        {meta.label}
                      </span>
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
          </li>
        ))}
      </ol>

      <Pagination
        page={safePage}
        pageCount={pageCount}
        onChange={setPage}
        total={changelog.length}
        label="version"
      />
    </RoadmapShell>
  );
}
