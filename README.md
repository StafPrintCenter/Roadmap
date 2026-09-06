# SPC Progress Hub

# PROMPT : DEVELOPPEMENT DE LA PLATEFORME "SPC ROADMAP" (`roadmap.stafprint.com`)

Tu es un développeur Full-Stack Senior & UI/UX Designer Expert React / TypeScript / Tailwind CSS / Framer Motion / TanStack Router.

Tu dois concevoir et développer une application web multi-pages moderne, fluide et interactive appelée **SPC Roadmap** (`roadmap.stafprint.com`). Elle sert de plateforme publique de transparence, de suivi des développements et de planification pour tout l'écosystème **STAF PRINT CENTER** (basé sur [https://stafprint.com/tools/ecosystem](https://stafprint.com/tools/ecosystem)).

---

## 🎨 1. DESIGN SYSTEM & CHARTE GRAPHIQUE

- **Palette de Couleurs STAF PRINT :**
  - **Background :** Off-white chaud (`#fdfbf7`) ou Slate très sombre (`#0f172a` / `#020617`) pour le mode sombre.
  - **Accentuation :** Orange Ambre signature (`#f97316` / `#ea580c`) pour les boutons d'action, indicateurs actifs et badges prioritaires.
  - **Badges de Statut :**
    - 💡 *Sous Étude* : Violet / Indigo
    - 🛠️ *En Développement* : Orange Ambre
    - 🧪 *En Phase Bêta* : Bleu Cyan
    - ✅ *Déployé / Lancé* : Vert Émeraude
- **Typographies :** **Space Grotesk** ou **Fraunces** (Titres), **Inter Tight** (Navigation et textes), **JetBrains Mono** (Badges, dates, sous-domaines).

---

## 🗺️ 2. ARCHITECTURE MULTI-PAGES & NAVIGATION (`TanStack Router`)

L'application doit intégrer une navigation multi-pages stricte :


roadmap.stafprint.com

├── / --> Page Principale (Explorateur avec Switcher de Vues)

├── /calendar --> Vue / Page Calendrier & Frise Chronologique

├── /features --> Catalogue Général & Recherches Avancées

├── /features/$featureId --> Page Détaillée d'une Fonctionnalité (+ Upvotes & Commentaires)

├── /changelog --> Journal des Notes de Version (Release Notes)

├── /submit --> Formulaire de Proposition d'Idée / Bug

└── /status --> État des Services & Disponibilité Écosystème (Uptime)


---

## 🎛️ 3. FONCTIONNALITES PAR PAGE

### A. Page d'Accueil (`/`) : Switcher Tri-Vues (Kanban / Liste / Grille)
Propose un sélecteur de vue dynamique permettant de basculer instantanément :
1. 📋 **Vue Kanban (Colonnes) :** 4 colonnes (*Sous Étude*, *En Développement*, *En Bêta*, *Déployé*).
2. 📜 **Vue Liste :** Format ultra-compact et densifié avec tris rapides (*Plus votés*, *Récents*, *Sous-domaines*).
3. 🔲 **Vue Grille (Cards) :** Cartes visuelles sous forme de Dashboard avec miniatures, barres de progression (%) et tags.

### B. Page Calendrier & Frise Chronologique (`/calendar`)
- **Vue Mensuelle & Trimestrielle (Q1, Q2, Q3, Q4) :** Affiche les dates d'échéance et livraisons prévues pour chaque sous-domaine (`ai.stafprint.com`, `student.stafprint.com`, `docs.stafprint.com`, etc.).
- **Jalons (*Milestones*) & Événements :** Marquage des phases Bêta, ateliers live, et releases majeures.
- **Filtres par Écosystème :** Masquer/Afficher les événements selon le sous-domaine sélectionné.

### C. Page Détaillée de Fonctionnalité (`/features/$featureId`)
- **Informations Clés :** Titre, Description complète, Sous-domaine rattaché, Trimestre cible, Progression en %.
- **Module d'Upvote (+1) :** Bouton interactif pour voter pour la fonctionnalité (enregistré en `localStorage`).
- **Section Échanges :** Zone de commentaires simulés et fil des mises à jour de la tâche.

### D. Journal des Notes de Version (`/changelog`)
- Timeline chronologique triée par versions (`v1.0`, `v1.2`, `v2.0`).
- Classification des ajouts : 🚀 *Nouveautés*, ⚡ *Améliorations*, 🐛 *Correctifs*.

### E. Formulaire de Proposition (`/submit`)
- Saisie d'une nouvelle idée ou bug avec choix de la plateforme rattachée.
- Ajout automatique dans la liste en statut *Sous Étude*.

### F. État des Services (`/status`)
- Monitoring visuel de la disponibilité (Uptime %) de chaque sous-domaine de l'écosystème STAF PRINT.

---

## 📊 4. STRUCTURE DES DONNEES (MOCK TYPESCRIPT)

Créer un fichier de mock `featuresData.ts` structuré avec le type suivant :

```typescript
export interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  subdomain: 'stafprint.com' | 'docs.stafprint.com' | 'ai.stafprint.com' | 'arcade.stafprint.com' | 'go.stafprint.com' | 'student.stafprint.com' | 'instructor.stafprint.com' | 'customer.stafprint.com';
  status: 'under-consideration' | 'in-progress' | 'in-beta' | 'completed';
  category: 'Impression & PAO' | 'Formations' | 'IA & Outils' | 'Gamification' | 'Infrastructure';
  upvotes: number;
  progressPercentage: number;
  targetReleaseDate: string; // ISO string pour le calendrier
  quarter: 'Q1 2026' | 'Q2 2026' | 'Q3 2026' | 'Q4 2026';
}


🎯 LIVRABLE ATTENDU

Génère le code TypeScript / React / Tailwind CSS complet pour STAF Roadmap (roadmap.stafprint.com), incluant TanStack Router pour toutes les routes, le switcher de vues (Kanban, Liste, Grille), la page Calendrier interactive, la page de détails des tâches, le Changelog et le formulaire de soumission.
***
NB : Thme sombre et claire (src\hooks\useTheme.tsx avec le clé spc-theme et composant themeToggle)
***
Composant pageHeader (fixe sur la page) dynamique selon la page si neccessaire, pageFooter, et roadmapShell pour envelloper dans toutes les pages

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ee355ecc-a5bc-47cb-94db-c7f76efffed3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
