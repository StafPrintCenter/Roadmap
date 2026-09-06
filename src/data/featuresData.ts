export type Subdomain =
  | "stafprint.com"
  | "docs.stafprint.com"
  | "ai.stafprint.com"
  | "arcade.stafprint.com"
  | "go.stafprint.com"
  | "student.stafprint.com"
  | "instructor.stafprint.com"
  | "customer.stafprint.com";

export type FeatureStatus = "under-consideration" | "in-progress" | "in-beta" | "completed";

export type FeatureCategory =
  | "Impression & PAO"
  | "Formations"
  | "IA & Outils"
  | "Gamification"
  | "Infrastructure";

export type Quarter = "Q1 2026" | "Q2 2026" | "Q3 2026" | "Q4 2026";

export interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  subdomain: Subdomain;
  status: FeatureStatus;
  category: FeatureCategory;
  upvotes: number;
  progressPercentage: number;
  targetReleaseDate: string; // ISO string pour le calendrier
  quarter: Quarter;
}

export const SUBDOMAINS: Subdomain[] = [
  "stafprint.com",
  "docs.stafprint.com",
  "ai.stafprint.com",
  "arcade.stafprint.com",
  "go.stafprint.com",
  "student.stafprint.com",
  "instructor.stafprint.com",
  "customer.stafprint.com",
];

export const CATEGORIES: FeatureCategory[] = [
  "Impression & PAO",
  "Formations",
  "IA & Outils",
  "Gamification",
  "Infrastructure",
];

export const QUARTERS: Quarter[] = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"];

export const STATUS_META: Record<
  FeatureStatus,
  { label: string; emoji: string; color: string; soft: string; text: string }
> = {
  "under-consideration": {
    label: "Sous Étude",
    emoji: "💡",
    color: "bg-study",
    soft: "bg-study-soft",
    text: "text-study",
  },
  "in-progress": {
    label: "En Développement",
    emoji: "🛠️",
    color: "bg-dev",
    soft: "bg-dev-soft",
    text: "text-dev",
  },
  "in-beta": {
    label: "En Phase Bêta",
    emoji: "🧪",
    color: "bg-beta",
    soft: "bg-beta-soft",
    text: "text-beta",
  },
  completed: {
    label: "Déployé",
    emoji: "✅",
    color: "bg-done",
    soft: "bg-done-soft",
    text: "text-done",
  },
};

export const STATUS_ORDER: FeatureStatus[] = [
  "under-consideration",
  "in-progress",
  "in-beta",
  "completed",
];

export const features: RoadmapFeature[] = [
  {
    id: "spc-001",
    title: "Devis d'impression instantané",
    description:
      "Un moteur de calcul temps réel qui estime le coût d'un travail d'impression (format, papier, façonnage, quantité) directement depuis le site vitrine, avec export PDF du devis et envoi automatique par e-mail au client.",
    subdomain: "stafprint.com",
    status: "in-progress",
    category: "Impression & PAO",
    upvotes: 248,
    progressPercentage: 62,
    targetReleaseDate: "2026-02-18",
    quarter: "Q1 2026",
  },
  {
    id: "spc-002",
    title: "Assistant IA de préparation de fichiers",
    description:
      "Analyse automatique des fichiers envoyés (fonds perdus, profils colorimétriques, résolution) avec correction assistée par IA et rapport de conformité prépresse avant validation du bon à tirer.",
    subdomain: "ai.stafprint.com",
    status: "in-beta",
    category: "IA & Outils",
    upvotes: 412,
    progressPercentage: 85,
    targetReleaseDate: "2026-03-05",
    quarter: "Q1 2026",
  },
  {
    id: "spc-003",
    title: "Générateur de maquettes IA",
    description:
      "Génération de propositions graphiques (flyers, cartes de visite, bâches) à partir d'un brief textuel, avec déclinaisons éditables exportables vers les outils PAO de l'atelier.",
    subdomain: "ai.stafprint.com",
    status: "under-consideration",
    category: "IA & Outils",
    upvotes: 331,
    progressPercentage: 8,
    targetReleaseDate: "2026-07-20",
    quarter: "Q3 2026",
  },
  {
    id: "spc-004",
    title: "Parcours certifiants PAO",
    description:
      "Refonte complète des parcours de formation Illustrator / Photoshop / InDesign en modules certifiants, avec évaluations progressives et attestation vérifiable par QR code.",
    subdomain: "student.stafprint.com",
    status: "in-progress",
    category: "Formations",
    upvotes: 189,
    progressPercentage: 47,
    targetReleaseDate: "2026-04-12",
    quarter: "Q2 2026",
  },
  {
    id: "spc-005",
    title: "Tableau de bord formateur",
    description:
      "Espace dédié aux instructeurs : suivi de progression des apprenants, planification des sessions, correction des rendus et statistiques d'assiduité par cohorte.",
    subdomain: "instructor.stafprint.com",
    status: "in-progress",
    category: "Formations",
    upvotes: 154,
    progressPercentage: 38,
    targetReleaseDate: "2026-05-08",
    quarter: "Q2 2026",
  },
  {
    id: "spc-006",
    title: "Arcade : ligue mensuelle",
    description:
      "Classements saisonniers, défis hebdomadaires et badges déblocables sur les mini-jeux de l'arcade, reliés au profil apprenant pour convertir les points en réductions atelier.",
    subdomain: "arcade.stafprint.com",
    status: "in-beta",
    category: "Gamification",
    upvotes: 276,
    progressPercentage: 78,
    targetReleaseDate: "2026-03-22",
    quarter: "Q1 2026",
  },
  {
    id: "spc-007",
    title: "Documentation technique v2",
    description:
      "Nouvelle architecture de la documentation : recherche instantanée, guides pas-à-pas illustrés, versionnage des articles et mode hors-ligne pour les équipes en atelier.",
    subdomain: "docs.stafprint.com",
    status: "completed",
    category: "Infrastructure",
    upvotes: 143,
    progressPercentage: 100,
    targetReleaseDate: "2026-01-15",
    quarter: "Q1 2026",
  },
  {
    id: "spc-008",
    title: "Raccourcisseur de liens go.",
    description:
      "Service interne de liens courts avec statistiques de clics, QR codes personnalisés aux couleurs STAF PRINT et expiration programmée pour les campagnes imprimées.",
    subdomain: "go.stafprint.com",
    status: "completed",
    category: "Infrastructure",
    upvotes: 97,
    progressPercentage: 100,
    targetReleaseDate: "2026-01-06",
    quarter: "Q1 2026",
  },
  {
    id: "spc-009",
    title: "Espace client & suivi de commande",
    description:
      "Portail client avec historique des commandes, suivi de production en temps réel (prépresse, impression, façonnage, livraison) et validation des BAT en ligne.",
    subdomain: "customer.stafprint.com",
    status: "in-progress",
    category: "Impression & PAO",
    upvotes: 365,
    progressPercentage: 55,
    targetReleaseDate: "2026-06-02",
    quarter: "Q2 2026",
  },
  {
    id: "spc-010",
    title: "Paiement mobile intégré",
    description:
      "Encaissement direct via mobile money et carte bancaire depuis l'espace client, avec reçus automatiques et rapprochement comptable exportable.",
    subdomain: "customer.stafprint.com",
    status: "under-consideration",
    category: "Infrastructure",
    upvotes: 421,
    progressPercentage: 4,
    targetReleaseDate: "2026-10-14",
    quarter: "Q4 2026",
  },
  {
    id: "spc-011",
    title: "Bibliothèque de gabarits imprimables",
    description:
      "Catalogue de gabarits prêts à l'emploi (formats normalisés, gabarits de découpe, chartes) téléchargeables et directement injectables dans une commande.",
    subdomain: "stafprint.com",
    status: "in-beta",
    category: "Impression & PAO",
    upvotes: 208,
    progressPercentage: 72,
    targetReleaseDate: "2026-04-28",
    quarter: "Q2 2026",
  },
  {
    id: "spc-012",
    title: "Mode hors-ligne apprenant",
    description:
      "Téléchargement des modules de cours pour un suivi sans connexion, avec synchronisation automatique de la progression au retour en ligne.",
    subdomain: "student.stafprint.com",
    status: "under-consideration",
    category: "Formations",
    upvotes: 172,
    progressPercentage: 12,
    targetReleaseDate: "2026-09-09",
    quarter: "Q3 2026",
  },
  {
    id: "spc-013",
    title: "Ateliers live & replays",
    description:
      "Diffusion d'ateliers en direct depuis l'atelier d'impression, chat de questions, et mise à disposition des replays chapitrés dans l'espace apprenant.",
    subdomain: "instructor.stafprint.com",
    status: "under-consideration",
    category: "Formations",
    upvotes: 133,
    progressPercentage: 6,
    targetReleaseDate: "2026-08-18",
    quarter: "Q3 2026",
  },
  {
    id: "spc-014",
    title: "API publique écosystème",
    description:
      "API REST documentée permettant aux partenaires de créer des commandes, suivre la production et récupérer les catalogues produits de l'écosystème STAF PRINT.",
    subdomain: "docs.stafprint.com",
    status: "under-consideration",
    category: "Infrastructure",
    upvotes: 118,
    progressPercentage: 10,
    targetReleaseDate: "2026-11-25",
    quarter: "Q4 2026",
  },
  {
    id: "spc-015",
    title: "Quêtes d'onboarding gamifiées",
    description:
      "Un parcours de découverte de l'écosystème sous forme de quêtes : premier devis, premier fichier conforme, première formation suivie, récompensés par des points arcade.",
    subdomain: "arcade.stafprint.com",
    status: "under-consideration",
    category: "Gamification",
    upvotes: 88,
    progressPercentage: 3,
    targetReleaseDate: "2026-12-08",
    quarter: "Q4 2026",
  },
  {
    id: "spc-016",
    title: "Copilote support IA multilingue",
    description:
      "Assistant conversationnel formé sur la documentation STAF PRINT, capable de répondre en français et en anglais et d'escalader vers un conseiller humain.",
    subdomain: "ai.stafprint.com",
    status: "in-progress",
    category: "IA & Outils",
    upvotes: 295,
    progressPercentage: 41,
    targetReleaseDate: "2026-06-24",
    quarter: "Q2 2026",
  },
];

export interface Milestone {
  id: string;
  title: string;
  date: string;
  subdomain: Subdomain;
  type: "beta" | "release" | "workshop";
}

export const milestones: Milestone[] = [
  {
    id: "ms-1",
    title: "Ouverture bêta — Assistant prépresse IA",
    date: "2026-02-02",
    subdomain: "ai.stafprint.com",
    type: "beta",
  },
  {
    id: "ms-2",
    title: "Atelier live — Colorimétrie CMJN",
    date: "2026-03-11",
    subdomain: "instructor.stafprint.com",
    type: "workshop",
  },
  {
    id: "ms-3",
    title: "Release majeure v2.0 écosystème",
    date: "2026-05-20",
    subdomain: "stafprint.com",
    type: "release",
  },
  {
    id: "ms-4",
    title: "Bêta publique — Espace client",
    date: "2026-06-15",
    subdomain: "customer.stafprint.com",
    type: "beta",
  },
  {
    id: "ms-5",
    title: "Atelier live — Grands formats & bâches",
    date: "2026-09-24",
    subdomain: "student.stafprint.com",
    type: "workshop",
  },
  {
    id: "ms-6",
    title: "Release v2.5 — API partenaires",
    date: "2026-11-30",
    subdomain: "docs.stafprint.com",
    type: "release",
  },
];

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  items: { type: "new" | "improved" | "fixed"; text: string }[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "v2.0",
    date: "2026-01-28",
    title: "Refonte de l'écosystème",
    items: [
      { type: "new", text: "Nouvelle documentation technique avec recherche instantanée." },
      { type: "new", text: "Raccourcisseur de liens go.stafprint.com avec QR codes." },
      { type: "improved", text: "Navigation unifiée entre tous les sous-domaines." },
      { type: "fixed", text: "Correction des exports PDF en profil CMJN sur Safari." },
    ],
  },
  {
    version: "v1.6",
    date: "2025-12-10",
    title: "Arcade & gamification",
    items: [
      { type: "new", text: "Classements hebdomadaires sur arcade.stafprint.com." },
      { type: "improved", text: "Temps de chargement des mini-jeux réduit de 40%." },
      { type: "fixed", text: "Scores non enregistrés lors d'une déconnexion réseau." },
    ],
  },
  {
    version: "v1.2",
    date: "2025-10-02",
    title: "Espace apprenant",
    items: [
      { type: "new", text: "Suivi de progression par module pour les apprenants." },
      { type: "improved", text: "Lecteur vidéo avec reprise automatique." },
      { type: "fixed", text: "Attestations générées avec une date erronée." },
    ],
  },
  {
    version: "v1.0",
    date: "2025-07-15",
    title: "Lancement de la plateforme",
    items: [
      { type: "new", text: "Mise en ligne du site vitrine STAF PRINT CENTER." },
      { type: "new", text: "Catalogue des services d'impression et de formation." },
    ],
  },
];

export interface ServiceStatus {
  subdomain: Subdomain;
  label: string;
  uptime: number;
  state: "operational" | "degraded" | "maintenance";
  responseMs: number;
  history: number[];
}

export const services: ServiceStatus[] = [
  {
    subdomain: "stafprint.com",
    label: "Site principal",
    uptime: 99.98,
    state: "operational",
    responseMs: 182,
    history: [100, 100, 99.9, 100, 100, 99.97, 100, 100, 100, 99.99, 100, 100, 100, 100],
  },
  {
    subdomain: "docs.stafprint.com",
    label: "Documentation",
    uptime: 99.95,
    state: "operational",
    responseMs: 148,
    history: [100, 99.8, 100, 100, 100, 100, 99.9, 100, 100, 100, 100, 99.95, 100, 100],
  },
  {
    subdomain: "ai.stafprint.com",
    label: "Outils IA",
    uptime: 99.42,
    state: "degraded",
    responseMs: 642,
    history: [100, 99.2, 98.4, 100, 99.5, 100, 100, 98.9, 99.6, 100, 99.1, 100, 99.4, 98.7],
  },
  {
    subdomain: "arcade.stafprint.com",
    label: "Arcade",
    uptime: 99.87,
    state: "operational",
    responseMs: 214,
    history: [100, 100, 100, 99.6, 100, 100, 100, 99.8, 100, 100, 100, 100, 99.9, 100],
  },
  {
    subdomain: "go.stafprint.com",
    label: "Liens courts",
    uptime: 100,
    state: "operational",
    responseMs: 76,
    history: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  },
  {
    subdomain: "student.stafprint.com",
    label: "Espace apprenant",
    uptime: 99.76,
    state: "operational",
    responseMs: 296,
    history: [100, 100, 99.4, 100, 100, 99.8, 100, 100, 99.9, 100, 100, 100, 99.7, 100],
  },
  {
    subdomain: "instructor.stafprint.com",
    label: "Espace formateur",
    uptime: 98.9,
    state: "maintenance",
    responseMs: 512,
    history: [100, 100, 100, 97.2, 98.1, 99.4, 100, 100, 98.8, 99.2, 100, 100, 99.5, 97.9],
  },
  {
    subdomain: "customer.stafprint.com",
    label: "Espace client",
    uptime: 99.68,
    state: "operational",
    responseMs: 331,
    history: [100, 99.5, 100, 100, 99.7, 100, 100, 100, 99.6, 100, 100, 99.8, 100, 100],
  },
];

export const comments: Record<string, { author: string; role: string; date: string; text: string }[]> = {
  default: [
    {
      author: "Aïcha K.",
      role: "Cliente pro",
      date: "2026-02-04",
      text: "Fonctionnalité très attendue de notre côté, cela nous ferait gagner un temps fou sur les allers-retours de validation.",
    },
    {
      author: "Rodrigue A.",
      role: "Formateur PAO",
      date: "2026-02-06",
      text: "Pensez à prévoir un export compatible avec nos gabarits internes, c'est le point qui bloque aujourd'hui.",
    },
    {
      author: "Équipe SPC",
      role: "Produit",
      date: "2026-02-09",
      text: "Merci pour les retours. L'export gabarit est bien inscrit au périmètre de la première itération.",
    },
  ],
};

export const updatesTimeline = [
  { date: "2026-02-09", text: "Périmètre validé avec l'équipe atelier." },
  { date: "2026-01-27", text: "Maquettes UI finalisées et revues." },
  { date: "2026-01-12", text: "Étude de faisabilité technique terminée." },
];
