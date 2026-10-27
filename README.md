# Plateforme Pédagogique d'Algorithmique & de Programmation C (C99)
**Parcours d'apprentissage complet et autonome — 1re année d'École d'Ingénieurs (Débutant absolu)**

---

## 1. Vision et Périmètre du Produit

Cette application web est une plateforme d'apprentissage interactive, déterministe et 100 % autonome conçue pour accompagner un étudiant débutant absolu de première année d'école d'ingénieurs de zéro jusqu'à la maîtrise des fondamentaux de l'algorithmique et de la programmation structurée en langage C (standard ISO C99).

### Caractéristiques clés
- **Double Parcours Complet (32 Chapitres rédigés intégralement)** :
  - **Parcours A — Algorithmique & Pseudo-code (`A01` à `A16`)** : Résolution de problèmes, variables et types, expressions (`DIV`, `MOD`), entrées/sorties, conditions simples et imbriquées, choix multiples (`SELON`), boucles (`POUR`, `TANT QUE`, `REPETER`), fonctions et procédures, passage par valeur et par référence, tableaux 1D/2D, algorithmes statistiques (somme, moyenne, min/max), recherche séquentielle et dichotomique, tris élémentaires (sélection, insertion) avec invariants et complexité $\mathcal{O}(N^2)$, tables de trace d'exécution, tests et débogage logique, récursivité et problèmes de synthèse.
  - **Parcours B — Programmation en Langage C ISO C99 (`B01` à `B16`)** : Structure d'un programme C et `main`, chaîne de compilation (`cpp`, `cc1`, `as`, `ld`), types primitifs et `sizeof`, conversions implicites et *casts* explicites, `printf` et `scanf` (avec vérification de retour et d'adresse `&`), structures conditionnelles et `switch`, boucles, fonctions et prototypes, pile d'appels (*Call Stack*) et portée des variables, tableaux contigus en mémoire, chaînes de caractères ASCIIZ (`'\0'`, `<string.h>`), pointeurs (`*`, `&`, `NULL`, arithmétique), structures (`struct`, `typedef`, `->`), débogage méthodique, allocation dynamique sur le Tas (`malloc`, `calloc`, `free`) et projets de synthèse.
- **Parcours C — Concepts du mini-projet ShopFlow (`C01` à `C10`)** : programmation modulaire (`.h`/`.c`, gardes d'inclusion, `types.h`, Makefile), structures imbriquées (`Date`, `Adresse`), saisie sécurisée (`fgets`, `strcspn`, validations), tableaux dynamiques (`malloc`/`realloc`, capacité), allocation à 4 niveaux et libération sans fuite (copie superficielle/profonde, valgrind), règles métier en cascade (remise par paliers, TVA, port, fidélité), machine à états des commandes (`enum`, transitions), recherche/unicité/suppression logique/cohérence du stock, statistiques et palmarès (`qsort`), synthèse ShopFlow. Même pédagogie que les parcours A et B : leçon en 6 étapes, 2 exemples exécutables, erreurs classiques, quiz et 3 exercices par chapitre.
- **6 Passerelles Méthodologiques Algo $\leftrightarrow$ C** : Navigation libre entre les deux parcours avec 6 passerelles dédiées reliant l'écriture du pseudo-code, la table de trace et la traduction en programme C99.
- **10 Catégories d'Exercices Déterministes** : QCM conceptuels (`qcm`), détection d'erreurs (`error_spot`), prédiction de sortie (`prediction`), tables de trace interactives (`trace`), remise en ordre d'instructions (`ordering`), complétion de code (`completion`), correction de bugs (`bugfix`), écriture de pseudo-code (`pseudocode`), programmation C (`c_code`) et problèmes de synthèse (`synthesis`).
- **Compilateur C99 & Interpréteur Pseudo-code Intégrés (Bac à Sable Navigateur)** :
  - Préprocesseur, analyseur lexical, parseur AST C99, linter pédagogique `-Wall` (détection de `if (a = b)`, oubli de `&` dans `scanf`, division entière implicite, variable non initialisée).
  - Exécution en mémoire linéaire `WebAssembly.Memory` segmentée (`0x1000` `.rodata`, `0x2000` `.data`, `0x4000` Pile / *Stack*, `0x8000` Tas / *Heap*).
  - **AddressSanitizer (ASan) pédagogique intégré** : détection immédiate des débordements de tableaux (*buffer overflow*), du déréférencement de pointeur `NULL`, de la division par zéro, du *double free* et des fuites mémoire (*memory leaks*).
  - **Isolation Web Worker** avec *watchdog* matériel de `2,8 secondes` interrompant automatiquement toute boucle infinie sans bloquer l'interface.
- **Sauvegarde Locale & Export/Import JSON** : Persistance automatique via `IndexedDB` + miroir synchrone `localStorage`, sans compte ni base de données externe, avec export/import de fichier `.json` versionné.

---

## 2. Garantie Budget 0,00 € (Zéro Coût, Zéro API Externe, Zéro IA)

| Composant | Technologie retenue | Coût | Dépendance externe / Carte bancaire |
| :--- | :--- | :---: | :---: |
| **Framework UI** | React 19 + TypeScript 5 + Vite 6 + Tailwind CSS 4 | **0,00 €** | Aucune (Open Source MIT) |
| **Compilateur C99 & VM Mémoire** | Moteur C99 AST + `WebAssembly.Memory` + Web Worker | **0,00 €** | Aucune (Exécution 100 % navigateur) |
| **Interpréteur Pseudo-code** | Moteur Algorithmique FR + Générateur de Trace | **0,00 €** | Aucune (Exécution 100 % navigateur) |
| **Correction & Pédagogie** | Règles déterministes, suites de tests & indices pré-rédigés | **0,00 €** | **Aucune API d'IA requise** |
| **Sauvegarde & Progression** | `IndexedDB` + `localStorage` + Export/Import `.json` | **0,00 €** | Aucune base de données cloud |
| **Hébergement Production** | GitHub Pages / Cloudflare Pages (Statique) | **0,00 €** | Aucune carte bancaire requise |

---

## 3. Installation, Exécution Locale et Tests Automatisés

### Prérequis
- **Node.js** version `18+` (ou `20+` LTS) et `npm`.

### Installation des dépendances
```bash
npm install
```

### Lancer le serveur de développement local
```bash
npm run dev
```
Ouvrez ensuite l'URL affichée dans le terminal (par défaut `http://localhost:5173`).

### Exécuter la suite de tests automatisés (Vitest)
La suite de tests vérifie automatiquement :
1. Le moteur d'exécution Pseudo-code (`src/engines/__tests__/engines.test.ts`).
2. Le compilateur C99, la gestion des pointeurs, `malloc`/`free`, les diagnostics d'erreurs et l'AddressSanitizer (`src/engines/__tests__/engines.test.ts`).
3. La validité structurelle des **32 chapitres (`A01`–`A16` et `B01`–`B16`)** ainsi que l'exécution réelle de **toutes les solutions de référence (`referenceSolution`)** contre l'intégralité des jeux de tests (`testCases`) (`src/data/__tests__/curriculum.test.ts`).
4. Les règles de validation des acquis et l'export/import JSON (`src/services/__tests__/storageService.test.ts`).

```bash
npm test
```

### Générer le build de production
```bash
npm run build
```
Les fichiers statiques optimisés sont générés dans le dossier `dist/`. Vous pouvez prévisualiser le build de production localement avec :
```bash
npm run preview
```

---

## 4. Déploiement Gratuit en Production (0,00 €)

L'application étant compilée en un bundle statique autonome (`dist/`) avec `base: './'` dans `vite.config.ts`, elle fonctionne sur n'importe quel hébergeur statique gratuit sans serveur backend :

### Option A — GitHub Pages (0,00 €)
1. Poussez ce dépôt sur un dépôt GitHub.
2. Exécutez `npm run build` et publiez le dossier `dist/` sur la branche `gh-pages` (ou activez GitHub Actions avec le workflow standard *Deploy static content to Pages*).

### Option B — Cloudflare Pages (0,00 €)
1. Connectez votre dépôt Git à Cloudflare Pages (plan gratuit sans carte bancaire).
2. Paramètres de build :
   - **Commande de build** : `npm run build`
   - **Dossier de sortie** : `dist`

---

## 5. Architecture du Projet

```text
├── docs/
│   └── CADRAGE_ET_ARCHITECTURE.md     # Document complet de cadrage (Phase 0 & Phase 1)
├── src/
│   ├── types/
│   │   └── curriculum.ts              # Modèles TypeScript (Chapitres, 10 types d'exercices, Mémoire, Progression)
│   ├── engines/
│   │   ├── algoEngine.ts              # Compilateur & interpréteur Pseudo-code FR + générateur de trace
│   │   ├── c99Types.ts                # Types AST, mémoire linéaire et diagnostics C99
│   │   ├── c99LexerParser.ts          # Préprocesseur, Lexer, Parseur AST C99 & Linter pédagogique -Wall
│   │   ├── c99Engine.ts               # Exécuteur C99 sur WebAssembly.Memory, libc, ASan & suite de tests
│   │   ├── compilerWorker.ts          # Web Worker isolé d'exécution
│   │   ├── workerClient.ts            # Client avec watchdog de sécurité (timeout 2.8s)
│   │   └── __tests__/engines.test.ts  # Tests unitaires des moteurs d'exécution C99 et Pseudo-code
│   ├── data/
│   │   ├── algoChaptersPart1.ts       # Chapitres A01 à A08 (Algorithmique)
│   │   ├── algoChaptersPart2.ts       # Chapitres A09 à A16 (Algorithmique)
│   │   ├── cChaptersPart1.ts          # Chapitres B01 à B08 (Langage C99)
│   │   ├── cChaptersPart2.ts          # Chapitres B09 à B16 (Langage C99)
│   │   ├── projetChaptersPart1.ts     # Chapitres C01 à C05 (Concepts du projet ShopFlow)
│   │   ├── projetChaptersPart2.ts     # Chapitres C06 à C10 (Concepts du projet ShopFlow)
│   │   ├── projetHelpers.ts           # Construction des exemples annotés du Parcours C
│   │   ├── curriculumIndex.ts         # Index unifié des 32 chapitres, 6 passerelles et modèles Labo
│   │   ├── __tests__/curriculum.test.ts # Validation automatisée des 42 chapitres et solutions de référence
│   │   └── __tests__/projet.test.ts   # Exemples, solutions, prédictions et cohérence du Parcours C
│   ├── services/
│   │   ├── storageService.ts          # Persistance IndexedDB + localStorage, validation chapitres, Export/Import JSON
│   │   └── __tests__/storageService.test.ts # Tests unitaires de persistance et règles de progression
│   ├── components/
│   │   ├── CodeEditorWithLines.tsx    # Éditeur de code numéroté avec surlignage d'erreurs et raccourcis
│   │   ├── MemoryAndTraceInspector.tsx# Inspecteur Pile (Stack), Tas (Heap), Diagnostics GCC/FR et Table de Trace
│   │   ├── DashboardAndTracksViews.tsx# Tableau de bord, Passerelles Algo->C et listes de chapitres
│   │   ├── LessonView.tsx             # Vue cours interactive avec exécution directe des exemples et quiz
│   │   ├── ExerciseView.tsx           # Espace d'exercice (10 catégories), tests déterministes et indices
│   │   └── LabProgressSettingsViews.tsx # Laboratoire C99/Algo, Bilan des acquis et Sauvegarde JSON
│   ├── App.tsx                        # Routeur principal et synchronisation d'état
│   ├── main.tsx                       # Point d'entrée React
│   └── index.css                      # Configuration Tailwind CSS v4 (clair/sombre)
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
