import { Link } from "@tanstack/react-router";
import { SUBDOMAINS } from "@/data/featuresData";

export function PageFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">
              SPC
            </span>
            <span className="font-display text-sm font-bold">SPC Roadmap</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            La plateforme publique de transparence et de planification de l'écosystème STAF PRINT
            CENTER.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Navigation
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/", label: "Explorateur" },
              { to: "/calendar", label: "Calendrier" },
              { to: "/features", label: "Catalogue" },
              { to: "/changelog", label: "Changelog" },
              { to: "/submit", label: "Proposer une idée" },
              { to: "/status", label: "État des services" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Écosystème
          </h2>
          <ul className="mt-4 grid gap-2 font-mono text-xs text-muted-foreground">
            {SUBDOMAINS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 font-mono text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} STAF PRINT CENTER — roadmap.stafprint.com
        </p>
      </div>
    </footer>
  );
}
