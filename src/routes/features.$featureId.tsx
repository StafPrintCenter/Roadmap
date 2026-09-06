import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { RoadmapShell } from "@/components/RoadmapShell";
import {
  ProgressBar,
  StatusBadge,
  SubdomainTag,
  VoteButton,
} from "@/components/roadmap/FeatureBits";
import {
  comments as mockComments,
  features as baseFeatures,
  updatesTimeline,
  type RoadmapFeature,
} from "@/data/featuresData";
import { useUpvotes } from "@/hooks/useUpvotes";
import { useSubmissions } from "@/hooks/useSubmissions";

export const Route = createFileRoute("/features/$featureId")({
  loader: ({ params }) => {
    const feature = baseFeatures.find((f) => f.id === params.featureId);
    // Les propositions utilisateur vivent côté client : on ne 404 que si l'id
    // ne ressemble pas à une soumission locale.
    if (!feature && !params.featureId.startsWith("usr-")) throw notFound();
    return { feature: feature ?? null };
  },
  head: ({ loaderData }) => {
    const f = loaderData?.feature;
    if (!f) {
      return {
        meta: [
          { title: "Fonctionnalité indisponible — SPC Roadmap" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        { title: `${f.title} — SPC Roadmap` },
        { name: "description", content: f.description.slice(0, 155) },
        { property: "og:title", content: `${f.title} — SPC Roadmap` },
        { property: "og:description", content: f.description.slice(0, 155) },
      ],
    };
  },
  component: FeatureDetail,
  errorComponent: () => (
    <RoadmapShell>
      <p className="py-20 text-center text-sm text-muted-foreground">
        Impossible de charger cette fonctionnalité.
      </p>
    </RoadmapShell>
  ),
  notFoundComponent: FeatureNotFound,
});

function FeatureNotFound() {
  return (
    <RoadmapShell>
      <div className="py-20 text-center">
        <h2 className="font-display text-2xl font-bold">Fonctionnalité introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette entrée de roadmap n'existe pas ou a été retirée.
        </p>
        <Link
          to="/features"
          className="mt-6 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Voir le catalogue
        </Link>
      </div>
    </RoadmapShell>
  );
}

function FeatureDetail() {
  const { featureId } = Route.useParams();
  const { feature: loaded } = Route.useLoaderData();
  const { submissions } = useSubmissions();
  const { toggleVote, hasVoted, bonus } = useUpvotes();
  const [draft, setDraft] = useState("");
  const [posted, setPosted] = useState<{ author: string; role: string; date: string; text: string }[]>(
    [],
  );

  const feature: RoadmapFeature | null = useMemo(
    () => loaded ?? submissions.find((f) => f.id === featureId) ?? null,
    [loaded, submissions, featureId],
  );

  if (!feature) return <FeatureNotFound />;

  const votes = feature.upvotes + bonus(feature.id);
  const thread = [...(mockComments["default"] ?? []), ...posted];

  return (
    <RoadmapShell>
      <Link
        to="/features"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-3.5" /> Retour au catalogue
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <article className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={feature.status} />
              <SubdomainTag value={feature.subdomain} />
              <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                {feature.category}
              </span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{feature.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span>Progression</span>
                <span>{feature.progressPercentage}%</span>
              </div>
              <ProgressBar value={feature.progressPercentage} status={feature.status} />
            </div>
          </article>

          <section className="mt-6 rounded-2xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold">
              <MessageSquare className="size-4 text-primary" /> Échanges
            </h3>
            <ul className="mt-4 space-y-4">
              {thread.map((c, i) => (
                <li key={i} className="rounded-xl bg-secondary/60 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{c.author}</span>
                    <span className="rounded-md bg-card px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {c.role}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {new Date(c.date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
                </li>
              ))}
            </ul>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.trim()) return;
                setPosted((p) => [
                  ...p,
                  {
                    author: "Vous",
                    role: "Communauté",
                    date: new Date().toISOString(),
                    text: draft.trim(),
                  },
                ]);
                setDraft("");
              }}
              className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] gap-2"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ajouter un commentaire…"
                className="min-w-0 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
              >
                <Send className="size-4" />
                <span className="hidden sm:inline">Envoyer</span>
              </button>
            </form>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Soutenir
            </p>
            <div className="mt-3 flex items-center gap-3">
              <VoteButton
                size="lg"
                count={votes}
                voted={hasVoted(feature.id)}
                onClick={() => toggleVote(feature.id)}
              />
              <p className="text-xs text-muted-foreground">
                {hasVoted(feature.id)
                  ? "Merci ! Votre vote est enregistré."
                  : "Votez pour faire monter cette évolution dans les priorités."}
              </p>
            </div>
          </div>

          <dl className="rounded-2xl border border-border bg-card p-5 text-sm">
            {[
              ["Sous-domaine", feature.subdomain],
              ["Trimestre cible", feature.quarter],
              [
                "Livraison prévue",
                new Date(feature.targetReleaseDate).toLocaleDateString("fr-FR"),
              ],
              ["Catégorie", feature.category],
              ["Identifiant", feature.id],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-3 border-b border-border py-2.5 last:border-0">
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="text-right font-mono text-xs font-semibold">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Mises à jour
            </p>
            <ol className="mt-4 space-y-3 border-l border-border pl-4">
              {updatesTimeline.map((u) => (
                <li key={u.date} className="relative">
                  <span className="absolute -left-[1.32rem] mt-1.5 size-2 rounded-full bg-primary" />
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {new Date(u.date).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-xs">{u.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </RoadmapShell>
  );
}
