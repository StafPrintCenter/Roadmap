import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Wrench } from "lucide-react";
import { RoadmapShell } from "@/components/RoadmapShell";
import { services } from "@/data/featuresData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "État des services — SPC Roadmap" },
      {
        name: "description",
        content:
          "Disponibilité et temps de réponse de chaque plateforme de l'écosystème STAF PRINT CENTER : site, docs, IA, arcade, espaces apprenant, formateur et client.",
      },
      { property: "og:title", content: "État des services — SPC Roadmap" },
      {
        property: "og:description",
        content: "Uptime en temps réel de tous les sous-domaines STAF PRINT CENTER.",
      },
    ],
  }),
  component: StatusPage,
});

const STATE_META = {
  operational: {
    label: "Opérationnel",
    icon: CheckCircle2,
    dot: "bg-done",
    pill: "bg-done-soft text-done",
  },
  degraded: {
    label: "Performances dégradées",
    icon: AlertTriangle,
    dot: "bg-dev",
    pill: "bg-dev-soft text-dev",
  },
  maintenance: {
    label: "Maintenance planifiée",
    icon: Wrench,
    dot: "bg-beta",
    pill: "bg-beta-soft text-beta",
  },
} as const;

function StatusPage() {
  const allOk = services.every((s) => s.state === "operational");
  const globalUptime = (
    services.reduce((acc, s) => acc + s.uptime, 0) / services.length
  ).toFixed(2);

  return (
    <RoadmapShell>
      <section
        className={cn(
          "flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-6",
          allOk ? "border-done/40 bg-done-soft" : "border-dev/40 bg-dev-soft",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative grid size-10 shrink-0 place-items-center">
            <span
              className={cn(
                "absolute size-10 animate-ping rounded-full opacity-30",
                allOk ? "bg-done" : "bg-dev",
              )}
            />
            <span className={cn("size-3.5 rounded-full", allOk ? "bg-done" : "bg-dev")} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-display text-lg font-bold">
              {allOk ? "Tous les services sont opérationnels" : "Incidents en cours sur certains services"}
            </h2>
            <p className="font-mono text-xs opacity-80">
              Disponibilité moyenne 30 jours · {globalUptime}%
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-background/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest">
          Mise à jour continue
        </span>
      </section>

      <div className="mt-6 space-y-3">
        {services.map((s) => {
          const meta = STATE_META[s.state];
          const Icon = meta.icon;
          return (
            <article
              key={s.subdomain}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={cn("size-2.5 shrink-0 rounded-full", meta.dot)} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{s.label}</p>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">
                      {s.subdomain}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                    {s.responseMs} ms
                  </span>
                  <span className="font-mono text-sm font-bold">{s.uptime}%</span>
                  <span
                    className={cn(
                      "hidden items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold md:inline-flex",
                      meta.pill,
                    )}
                  >
                    <Icon className="size-3" />
                    {meta.label}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-end gap-1">
                {s.history.map((h, i) => (
                  <span
                    key={i}
                    title={`Jour ${i + 1} — ${h}%`}
                    className={cn(
                      "h-8 flex-1 rounded-sm",
                      h >= 99.9 ? "bg-done" : h >= 99 ? "bg-dev" : "bg-destructive",
                    )}
                    style={{ opacity: 0.35 + (h - 97) / 4.6 }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>14 derniers jours</span>
                <span className="md:hidden">{meta.label}</span>
                <span>Aujourd'hui</span>
              </div>
            </article>
          );
        })}
      </div>
    </RoadmapShell>
  );
}
