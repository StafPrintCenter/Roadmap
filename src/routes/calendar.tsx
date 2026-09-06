import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
  Flag,
  PartyPopper,
  Rocket,
} from "lucide-react";
import { RoadmapShell } from "@/components/RoadmapShell";
import { StatusBadge, SubdomainTag } from "@/components/roadmap/FeatureBits";
import {
  QUARTERS,
  SUBDOMAINS,
  features,
  milestones,
  type Milestone,
  type Quarter,
  type RoadmapFeature,
} from "@/data/featuresData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendrier & frise chronologique — SPC Roadmap" },
      {
        name: "description",
        content:
          "Échéances mensuelles, jalons bêta, ateliers live et releases majeures de l'écosystème STAF PRINT CENTER, filtrables par sous-domaine.",
      },
      { property: "og:title", content: "Calendrier & frise chronologique — SPC Roadmap" },
      {
        property: "og:description",
        content:
          "Visualisez les livraisons trimestrielles et les jalons de l'écosystème STAF PRINT CENTER.",
      },
    ],
  }),
  component: CalendarPage,
});

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const QUARTER_MONTHS: Record<Quarter, number[]> = {
  "Q1 2026": [0, 1, 2],
  "Q2 2026": [3, 4, 5],
  "Q3 2026": [6, 7, 8],
  "Q4 2026": [9, 10, 11],
};

const MILESTONE_ICON = {
  beta: PartyPopper,
  release: Rocket,
  workshop: Flag,
} as const;

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const quarterOfMonth = (m: number): Quarter => QUARTERS[Math.floor(m / 3)] ?? QUARTERS[0]!;

function CalendarPage() {
  const today = useMemo(() => new Date(), []);
  const [mode, setMode] = useState<"quarter" | "month" | "day">("day");
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState<string>(toISODate(today));
  const [subdomain, setSubdomain] = useState<string>("all");

  const visibleFeatures = useMemo(
    () => features.filter((f) => subdomain === "all" || f.subdomain === subdomain),
    [subdomain],
  );
  const visibleMilestones = useMemo(
    () => milestones.filter((m) => subdomain === "all" || m.subdomain === subdomain),
    [subdomain],
  );

  const goToDate = (iso: string) => {
    if (!iso) return;
    const parts = iso.split("-").map(Number);
    const y = parts[0];
    const m = parts[1];
    if (!y || !m) return;
    setSelectedDate(iso);
    setCursor({ year: y, month: m - 1 });
  };

  const activeQuarter = quarterOfMonth(cursor.month);

  return (
    <RoadmapShell>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between">
        <select
          value={subdomain}
          onChange={(e) => setSubdomain(e.target.value)}
          className="min-w-0 rounded-xl border border-border bg-card px-3 py-2 font-mono text-xs"
        >
          <option value="all">Tout l'écosystème</option>
          {SUBDOMAINS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex shrink-0 items-center gap-1 rounded-xl border border-border bg-card p-1">
          {(
            [
              { id: "quarter", label: "Trimestres" },
              { id: "month", label: "Mensuel" },
              { id: "day", label: "Jour" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                mode === m.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aller à une date / un élément */}
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3">
        <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Aller à
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => goToDate(e.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 font-mono text-xs outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={() => goToDate(toISODate(today))}
          className="rounded-xl bg-secondary px-3 py-2 text-xs font-semibold transition-colors hover:bg-secondary/70"
        >
          Aujourd'hui
        </button>
        <select
          value=""
          onChange={(e) => {
            const f = features.find((x) => x.id === e.target.value);
            if (f) goToDate(f.targetReleaseDate.slice(0, 10));
          }}
          className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs"
        >
          <option value="">Aller à une fonctionnalité…</option>
          {features.map((f) => (
            <option key={f.id} value={f.id}>
              {new Date(f.targetReleaseDate).toLocaleDateString("fr-FR")} — {f.title}
            </option>
          ))}
        </select>
      </div>

      {mode === "quarter" ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {QUARTERS.map((q) => {
            const items = visibleFeatures.filter((f) => f.quarter === q);
            return (
              <section
                key={q}
                className={cn(
                  "rounded-2xl border border-border bg-surface/60 p-4",
                  q === activeQuarter && "border-primary",
                )}
              >
                <header className="flex items-center justify-between">
                  <h2 className="font-mono text-sm font-bold text-primary">{q}</h2>
                  <span className="font-mono text-xs text-muted-foreground">{items.length}</span>
                </header>
                <div className="mt-4 space-y-3">
                  {items.map((f) => (
                    <Link
                      key={f.id}
                      to="/features/$featureId"
                      params={{ featureId: f.id }}
                      className="block rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary"
                    >
                      <p className="text-sm font-semibold leading-snug">{f.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <SubdomainTag value={f.subdomain} />
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {new Date(f.targetReleaseDate).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <StatusBadge status={f.status} className="mt-2" />
                    </Link>
                  ))}
                  {items.length === 0 && (
                    <p className="py-6 text-center text-xs text-muted-foreground">
                      Aucune livraison prévue
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : mode === "month" ? (
        <div className="mt-6 space-y-4">
          {QUARTERS.map((q) => (
            <section key={q}>
              <h2 className="mb-3 font-mono text-sm font-bold text-primary">{q}</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {QUARTER_MONTHS[q].map((monthIndex) => {
                  const monthFeatures = visibleFeatures.filter(
                    (f) => new Date(f.targetReleaseDate).getMonth() === monthIndex,
                  );
                  const monthMilestones = visibleMilestones.filter(
                    (m) => new Date(m.date).getMonth() === monthIndex,
                  );
                  return (
                    <div
                      key={monthIndex}
                      className={cn(
                        "rounded-2xl border border-border bg-card p-4",
                        monthIndex === cursor.month && "border-primary",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-primary" />
                        <h3 className="text-sm font-bold">{MONTHS[monthIndex]} 2026</h3>
                      </div>
                      <ul className="mt-3 space-y-2">
                        {monthFeatures.map((f) => (
                          <li key={f.id}>
                            <Link
                              to="/features/$featureId"
                              params={{ featureId: f.id }}
                              className="block rounded-lg bg-secondary/60 px-3 py-2 transition-colors hover:bg-secondary"
                            >
                              <p className="text-xs font-semibold leading-snug">{f.title}</p>
                              <p className="font-mono text-[10px] text-muted-foreground">
                                {new Date(f.targetReleaseDate).toLocaleDateString("fr-FR")} ·{" "}
                                {f.subdomain}
                              </p>
                            </Link>
                          </li>
                        ))}
                        {monthMilestones.map((m) => {
                          const Icon = MILESTONE_ICON[m.type];
                          return (
                            <li
                              key={m.id}
                              className="flex items-start gap-2 rounded-lg border border-dashed border-primary/50 px-3 py-2"
                            >
                              <Icon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                              <span>
                                <span className="block text-xs font-semibold leading-snug">
                                  {m.title}
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  {new Date(m.date).toLocaleDateString("fr-FR")}
                                </span>
                              </span>
                            </li>
                          );
                        })}
                        {monthFeatures.length === 0 && monthMilestones.length === 0 && (
                          <li className="py-4 text-center text-xs text-muted-foreground">
                            Rien de planifié
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <DayCalendar
          year={cursor.year}
          monthIndex={cursor.month}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onNavigate={(year, month) => setCursor({ year, month })}
          features={visibleFeatures}
          milestones={visibleMilestones}
        />
      )}

      {/* Frise des jalons */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">Jalons & événements</h2>
        <ol className="mt-5 space-y-4 border-l border-border pl-6">
          {visibleMilestones
            .slice()
            .sort((a, b) => +new Date(a.date) - +new Date(b.date))
            .map((m) => {
              const Icon = MILESTONE_ICON[m.type];
              return (
                <li key={m.id} className="relative">
                  <span className="absolute -left-[1.9rem] grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-3" />
                  </span>
                  <p className="text-sm font-semibold">{m.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[10px] text-muted-foreground">
                    <span>{new Date(m.date).toLocaleDateString("fr-FR")}</span>
                    <SubdomainTag value={m.subdomain} />
                  </p>
                </li>
              );
            })}
        </ol>
      </section>
    </RoadmapShell>
  );
}

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function DayCalendar({
  year,
  monthIndex,
  selectedDate,
  onSelectDate,
  onNavigate,
  features: items,
  milestones: marks,
}: {
  year: number;
  monthIndex: number;
  selectedDate: string;
  onSelectDate: (iso: string) => void;
  onNavigate: (year: number, month: number) => void;
  features: RoadmapFeature[];
  milestones: Milestone[];
}) {
  const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const sameDay = (iso: string, day: number) => {
    const d = new Date(iso);
    return d.getFullYear() === year && d.getMonth() === monthIndex && d.getDate() === day;
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex;

  const prev = () => onNavigate(monthIndex === 0 ? year - 1 : year, (monthIndex + 11) % 12);
  const next = () => onNavigate(monthIndex === 11 ? year + 1 : year, (monthIndex + 1) % 12);

  const selectedDay = sameDay(selectedDate, new Date(selectedDate).getDate())
    ? new Date(selectedDate).getDate()
    : null;

  const dayFeatures = selectedDay
    ? items.filter((f) => sameDay(f.targetReleaseDate, selectedDay))
    : [];
  const dayMilestones = selectedDay ? marks.filter((m) => sameDay(m.date, selectedDay)) : [];

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Mois précédent"
          className="grid size-9 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
        <h2 className="font-display text-lg font-bold">
          {MONTHS[monthIndex]} {year}
        </h2>
        <button
          type="button"
          onClick={next}
          aria-label="Mois suivant"
          className="grid size-9 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="bg-secondary/70 py-2 text-center font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="min-h-20 bg-surface/40 sm:min-h-28" />;
          }
          const cellFeatures = items.filter((f) => sameDay(f.targetReleaseDate, day));
          const cellMilestones = marks.filter((m) => sameDay(m.date, day));
          const isToday = isCurrentMonth && today.getDate() === day;
          const isSelected = selectedDay === day;
          return (
            <button
              type="button"
              key={day}
              onClick={() =>
                onSelectDate(
                  `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                )
              }
              className={cn(
                "min-h-20 bg-card p-1.5 text-left transition-colors hover:bg-secondary/40 sm:min-h-28 sm:p-2",
                isToday && "bg-primary/5",
                isSelected && "ring-2 ring-inset ring-primary",
              )}
            >
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full font-mono text-[11px] text-muted-foreground",
                  isToday && "bg-primary font-bold text-primary-foreground",
                )}
              >
                {day}
              </span>
              <div className="mt-1 space-y-1">
                {cellMilestones.map((m) => {
                  const Icon = MILESTONE_ICON[m.type];
                  return (
                    <div
                      key={m.id}
                      title={m.title}
                      className="flex items-center gap-1 rounded-md border border-dashed border-primary/50 px-1.5 py-1"
                    >
                      <Icon className="size-3 shrink-0 text-primary" />
                      <span className="hidden truncate text-[10px] font-semibold leading-tight sm:block">
                        {m.title}
                      </span>
                    </div>
                  );
                })}
                {cellFeatures.map((f) => (
                  <span
                    key={f.id}
                    title={f.title}
                    className="block rounded-md bg-secondary px-1.5 py-1"
                  >
                    <span className="hidden truncate text-[10px] font-semibold leading-tight sm:block">
                      {f.title}
                    </span>
                    <span className="block h-1.5 w-full rounded-full bg-primary/70 sm:hidden" />
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Détail du jour sélectionné */}
      <div className="mt-5 rounded-xl border border-border bg-surface/50 p-4">
        <h3 className="font-display text-sm font-bold">
          {new Date(selectedDate).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h3>
        <ul className="mt-3 space-y-2">
          {dayMilestones.map((m) => {
            const Icon = MILESTONE_ICON[m.type];
            return (
              <li key={m.id} className="flex items-center gap-2 text-xs">
                <Icon className="size-3.5 text-primary" /> {m.title}
              </li>
            );
          })}
          {dayFeatures.map((f) => (
            <li key={f.id}>
              <Link
                to="/features/$featureId"
                params={{ featureId: f.id }}
                className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-xs font-semibold transition-colors hover:text-primary"
              >
                <CornerDownRight className="size-3.5 text-primary" />
                {f.title}
                <SubdomainTag value={f.subdomain} />
              </Link>
            </li>
          ))}
          {dayFeatures.length === 0 && dayMilestones.length === 0 && (
            <li className="text-xs text-muted-foreground">Rien de planifié ce jour-là.</li>
          )}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-full bg-primary/70" /> Livraison prévue
        </span>
        <span className="flex items-center gap-1.5">
          <Flag className="size-3 text-primary" /> Jalon / événement
        </span>
      </div>
    </section>
  );
}
