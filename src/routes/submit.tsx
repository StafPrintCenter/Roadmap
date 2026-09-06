import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lightbulb, Send } from "lucide-react";
import { toast } from "sonner";
import { RoadmapShell } from "@/components/RoadmapShell";
import { StatusBadge, SubdomainTag } from "@/components/roadmap/FeatureBits";
import {
  CATEGORIES,
  QUARTERS,
  SUBDOMAINS,
  type FeatureCategory,
  type Quarter,
  type Subdomain,
} from "@/data/featuresData";
import { useSubmissions } from "@/hooks/useSubmissions";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Proposer une idée ou signaler un bug — SPC Roadmap" },
      {
        name: "description",
        content:
          "Soumettez une idée de fonctionnalité ou un bug pour l'écosystème STAF PRINT CENTER : votre proposition rejoint le backlog en statut Sous Étude.",
      },
      { property: "og:title", content: "Proposer une idée — SPC Roadmap" },
      {
        property: "og:description",
        content: "Votre retour alimente directement la roadmap publique de STAF PRINT CENTER.",
      },
    ],
  }),
  component: SubmitPage,
});

function SubmitPage() {
  const navigate = useNavigate();
  const { submissions, addSubmission } = useSubmissions();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subdomain, setSubdomain] = useState<Subdomain>("stafprint.com");
  const [category, setCategory] = useState<FeatureCategory>("Impression & PAO");
  const [quarter, setQuarter] = useState<Quarter>("Q3 2026");
  const [kind, setKind] = useState<"idea" | "bug">("idea");

  return (
    <RoadmapShell>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (title.trim().length < 4) {
              toast.error("Le titre doit contenir au moins 4 caractères.");
              return;
            }
            const id = `usr-${Date.now()}`;
            addSubmission({
              id,
              title: title.trim(),
              description:
                (kind === "bug" ? "[Bug signalé] " : "") +
                (description.trim() || "Aucune description fournie."),
              subdomain,
              status: "under-consideration",
              category,
              upvotes: 1,
              progressPercentage: 0,
              targetReleaseDate: new Date(
                `2026-${String(QUARTERS.indexOf(quarter) * 3 + 3).padStart(2, "0")}-15`,
              ).toISOString(),
              quarter,
            });
            toast.success("Proposition ajoutée au backlog en statut Sous Étude.");
            setTitle("");
            setDescription("");
            void navigate({ to: "/features/$featureId", params: { featureId: id } });
          }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex gap-2">
            {(
              [
                { id: "idea", label: "💡 Idée" },
                { id: "bug", label: "🐛 Bug" },
              ] as const
            ).map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setKind(k.id)}
                aria-pressed={kind === k.id}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  kind === k.id ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          <label className="mt-6 block text-sm font-semibold" htmlFor="title">
            {kind === "bug" ? "Résumé du bug" : "Titre de l'idée"}
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              kind === "bug"
                ? "Ex : Le téléversement d\u2019un PDF de plus de 50 Mo échoue"
                : "Ex : Export direct vers le format PDF/X-1a"
            }
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />

          <label className="mt-5 block text-sm font-semibold" htmlFor="description">
            {kind === "bug" ? "Étapes de reproduction & impact" : "Description du besoin"}
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder={
              kind === "bug"
                ? "1. Ce que vous faisiez\n2. Ce qui s\u2019est passé\n3. Ce que vous attendiez\nNavigateur / appareil, message d\u2019erreur\u2026"
                : "Décrivez le besoin, le contexte et le résultat attendu\u2026"
            }
            className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold" htmlFor="subdomain">
                Plateforme
              </label>
              <select
                id="subdomain"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value as Subdomain)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 font-mono text-xs"
              >
                {SUBDOMAINS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold" htmlFor="category">
                Catégorie
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as FeatureCategory)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold" htmlFor="quarter">
                {kind === "bug" ? "Correction souhaitée" : "Trimestre souhaité"}
              </label>
              <select
                id="quarter"
                value={quarter}
                onChange={(e) => setQuarter(e.target.value as Quarter)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 font-mono text-xs"
              >
                {QUARTERS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
          >
            <Send className="size-4" />{" "}
            {kind === "bug" ? "Signaler le bug" : "Soumettre l\u2019idée"}
          </button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold">
              <Lightbulb className="size-4 text-primary" /> Comment ça marche
            </h2>
            <ol className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>1. Votre proposition entre en statut « Sous Étude ».</li>
              <li>2. La communauté vote et commente.</li>
              <li>3. L'équipe produit qualifie et planifie un trimestre cible.</li>
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-base font-bold">Vos propositions</h2>
            <ul className="mt-3 space-y-3">
              {submissions.map((s) => (
                <li key={s.id} className="rounded-xl bg-secondary/60 p-3">
                  <p className="text-xs font-semibold leading-snug">{s.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <SubdomainTag value={s.subdomain} />
                    <StatusBadge status={s.status} />
                  </div>
                </li>
              ))}
              {submissions.length === 0 && (
                <li className="py-4 text-center text-xs text-muted-foreground">
                  Aucune proposition pour le moment.
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </RoadmapShell>
  );
}
