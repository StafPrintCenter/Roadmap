import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { to: "/", label: "Explorateur" },
  { to: "/calendar", label: "Calendrier" },
  { to: "/features", label: "Priorités" },
  { to: "/changelog", label: "Changelog" },
  { to: "/status", label: "Statut" },
] as const;

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Explorateur de roadmap",
    subtitle: "Tout ce que nous construisons pour l'écosystème STAF PRINT CENTER.",
  },
  "/calendar": {
    title: "Calendrier & frise",
    subtitle: "Échéances, jalons et livraisons trimestrielles par sous-domaine.",
  },
  "/features": {
    title: "Priorités & analyses",
    subtitle: "Chiffres clés du backlog et classement des fonctionnalités les plus votées.",
  },
  "/changelog": {
    title: "Notes de version",
    subtitle: "Historique des nouveautés, améliorations et correctifs déployés.",
  },
  "/submit": {
    title: "Proposer une idée",
    subtitle: "Une suggestion, un bug ? Votre retour entre directement dans le backlog.",
  },
  "/status": {
    title: "État des services",
    subtitle: "Disponibilité en temps réel de chaque plateforme de l'écosystème.",
  },
};

export function PageHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const meta = PAGE_META[pathname] ?? {
    title: "Détail de la fonctionnalité",
    subtitle: "Suivi détaillé, votes et échanges autour de cette évolution.",
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">
              SPC
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-bold leading-tight">
                SPC Roadmap
              </span>
              <span className="block truncate font-mono text-[10px] text-muted-foreground">
                roadmap.stafprint.com
              </span>
            </span>
          </Link>
          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/submit"
            className="hidden rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep sm:inline-flex"
          >
            Proposer une idée
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="grid size-10 place-items-center rounded-xl border border-border bg-card lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {[...NAV, { to: "/submit", label: "Proposer une idée" } as const].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="rounded-lg px-3 py-2.5 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <div className="border-t border-border bg-surface/60">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <h1 className="truncate text-base font-bold sm:text-lg">{meta.title}</h1>
          <p className="truncate text-xs text-muted-foreground sm:text-sm">{meta.subtitle}</p>
        </div>
      </div>
    </header>
  );
}
