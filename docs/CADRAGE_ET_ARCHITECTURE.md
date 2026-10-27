# DOCUMENT DE RÉFÉRENCE — CADRAGE, AUDIT BUDGET 0 € ET ARCHITECTURE DÉTAILLÉE
## Plateforme Pédagogique d'Algorithmique et de Programmation C (1re année d'école d'ingénieurs)

---

## 1. AUDIT DE L'ENVIRONNEMENT INITIAL (PHASE 0)

L'inspection en lecture seule de l'environnement de travail (`c:\Users\auren.moyo\Documents\guide etudiant`) a établi les éléments suivants :

- **État du dépôt** : Répertoire vierge (aucun fichier préexistant). Le projet est créé *ex nihilo* (greenfield).
- **Système d'exploitation** : Windows (PowerShell `pwsh`).
- **Outils disponibles localement** :
  - `Node.js` : `v24.20.0`
  - `npm` : `11.19.0`
  - `git` : `2.55.0.windows.5`
- **Outils absents localement** :
  - Aucun compilateur C natif (`gcc`, `clang`, `msvc`, `mingw`) n'est installé sur le poste hôte.
  - `python` n'est présent que sous forme d'alias Windows Store non installé.
- **Conséquence structurante majeure** :
  - L'absence de compilateur C natif sur la machine hôte, combinée à la contrainte absolue d'un **budget de 0,00 €** et d'un déploiement en ligne sans serveur payant, impose une architecture de **compilation et d'exécution C 100 % côté client (navigateur / WebAssembly Linear Memory en Web Worker)**. Cela garantit que l'application fonctionne immédiatement en local (`npm run dev`) sans installation système tierce et en production sur n'importe quel hébergeur statique gratuit.

---

## 2. AUDIT DES COÛTS — GARANTIE BUDGET STRICTEMENT ÉGAL À 0,00 €

Toutes les briques technologiques retenues sont **100 % gratuites et open source**, sans carte bancaire requise, sans période d'essai expirante et sans facturation à l'usage.

| Solution retenue | Rôle dans le projet | Coût réel | Limites de l'offre gratuite | Carte bancaire requise ? | Risque de dépassement payant | Alternative gratuite immédiate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **React + TypeScript + Vite** | Framework UI, typage statique et bundler de production | **0,00 €** (Open Source MIT) | Aucune (exécution locale et build statique) | Non | Aucun (0 %) | Preact / Vanilla TS |
| **Tailwind CSS + Lucide React** | Système de design sobre, accessible et responsive | **0,00 €** (Open Source MIT / ISC) | Aucune | Non | Aucun (0 %) | CSS Modules natifs |
| **Moteur C99 & WebAssembly Memory (`C99Engine` + Web Worker)** | Préprocesseur, Lexer, Parser AST, Analyseur sémantique `-Wall`, VM à mémoire linéaire `WebAssembly.Memory` + ASan pédagogique | **0,00 €** (Embarqué dans le bundle client) | Limité uniquement par la RAM de l'onglet du navigateur (largement suffisant pour tous les programmes de 1re année) | Non | Aucun (0 %) — aucun appel réseau | Exécution locale CLI via `gcc` si installé sur le poste |
| **Moteur Pseudo-Code (`AlgoEngine`)** | Interpréteur et générateur de table de trace pas-à-pas pour le pseudo-code algorithmique français | **0,00 €** (Embarqué dans le bundle client) | Aucune | Non | Aucun (0 %) | Trace manuelle guidée |
| **IndexedDB + localStorage** | Persistance locale de la progression, des codes sources, des tentatives et des préférences + Export/Import JSON | **0,00 €** (API standard W3C du navigateur) | Quota navigateur (> 50 Mo à plusieurs Go, alors que la sauvegarde pèse < 500 Ko) | Non | Aucun (0 %) | Export/Import de fichier `.json` sur le disque local |
| **Vitest** | Tests unitaires, tests du compilateur C, tests de l'interpréteur pseudo-code et validation de tous les exercices | **0,00 €** (Open Source MIT) | Aucune | Non | Aucun (0 %) | Node.js native test runner (`node --test`) |
| **GitHub Pages / Cloudflare Pages / Vercel (Hobby) / Netlify** | Hébergement statique en ligne avec HTTPS automatique et sous-domaine gratuit | **0,00 €** | GitHub Pages : 1 Go stockage, 100 Go/mois bande passante. Cloudflare Pages : bande passante illimitée, 500 builds/mois | **Non** | **Aucun** (blocage ou throttling en cas d'abus extrême, jamais de facturation sans CB) | Surge.sh, Render Static, GitLab Pages |

---

## 3. COMPARAISON OBLIGATOIRE DES SOLUTIONS DE COMPILATION C

### Option A — Compilation et exécution dans le navigateur (WebAssembly Linear Memory + Web Worker isolé)
Le code source C est préprocessé, analysé lexicalement et syntaxiquement (AST), vérifié sémantiquement (types, prototypes, erreurs `-Wall`), puis compilé et exécuté dans une mémoire linéaire réelle (`WebAssembly.Memory` / `ArrayBuffer` segmenté en Text, Data, Stack et Heap) au sein d'un **Web Worker** isolé.

### Option B — Compilation et exécution côté serveur dans un environnement isolé (Docker / Sandbox / API externe type Judge0 / Piston)
Le navigateur envoie le code C via HTTP à un serveur distant (ou un conteneur Docker local) qui appelle `gcc`/`clang` dans une prison `seccomp`/`nsjail` et renvoie `stdout`/`stderr`.

### Matrice comparative détaillée

| Critère d'analyse | Option A : Navigateur (WASM Linear Memory + Web Worker) | Option B : Serveur isolé (Backend Docker / API externe) |
| :--- | :--- | :--- |
| **Coût d'exploitation & Hébergement** | **0,00 € garanti à vie**. Hébergeable sur un simple serveur de fichiers statiques (GitHub Pages, Cloudflare Pages). | **Payant ou précaire**. Un serveur exécutant Docker/GCC coûte 5 à 20 €/mois minimum. Les offres gratuites (Judge0 gratuit, Piston public) ont des quotas stricts, tombent en panne ou ferment leurs accès publics. |
| **Fonctionnement local immédiat** | **100 % immédiat** (`npm run dev`), même sur ce poste Windows où `gcc` et `clang` ne sont pas installés. | **Impossible sur ce poste sans installation lourde** (nécessite Docker Desktop ou MSYS2/MinGW + serveur Node backend). |
| **Compatibilité C standard (1re année)** | **Complète pour le programme de 1re année** : types primitifs, opérateurs, casts, `printf`/`scanf`, conditions, boucles, fonctions, récursivité, tableaux 1D/2D, chaînes `<string.h>`, pointeurs `*`/`&`, arithmétique de pointeurs, `struct`, `typedef`, `malloc`/`calloc`/`free`, `<math.h>`, `<ctype.h>`. | Complète (C99/C11/C17 complet + extensions POSIX), mais disproportionnée pour des exercices de 1re année. |
| **Qualité pédagogique des diagnostics** | **Exceptionnelle** : messages d'erreur en français + format GCC avec ligne/colonne, détection pédagogique de `scanf` sans `&`, de `if (a = b)`, des variables non initialisées, des dépassements de tableaux (ASan intégré), des fuites mémoire (`malloc` sans `free`) et inspection visuelle de la mémoire (pile/tas/pointeurs). | Messages bruts de `gcc`/`clang` en anglais, souvent déroutants pour un débutant absolu, et comportements indéfinis silencieux (Undefined Behavior) sur les variables non initialisées ou débordements légers. |
| **Prise en charge des entrées/sorties (`stdin`/`stdout`)** | **Complète** : flux `stdin` configurable avant exécution (avec cas de tests automatiques), `stdout` et `stderr` capturés avec précision. | Complète (mode batch via `stdin`), complexe en mode interactif (nécessite WebSockets + PTY). |
| **Sécurité** | **Maximale par conception** : exécution dans la sandbox du Web Worker du navigateur. Aucun accès au système de fichiers hôte, aucun accès réseau, aucun secret serveur. Boucles infinies tuées proprement via `worker.terminate()` et compteur d'instructions. | **Critique et complexe** : exécuter du code C arbitraire sur un serveur expose à des évasions de conteneur, fork bombs (`while(1) fork()`), saturation disque/CPU, lecture de `/proc` ou requêtes réseau malveillantes. |
| **Performances & Latence** | **Instantanée (< 15 ms)** : aucune latence réseau, compilation et exécution immédiates sur le CPU client. | Latence réseau (200 ms à 3 s par exécution) + files d'attente en cas de charge. |
| **Fonctionnement hors ligne (Offline)** | **Oui (100 % fonctionnel hors connexion)** une fois la page chargée. | **Non** : inutilisable dès que la connexion Internet est coupée. |
| **Maintenance** | Très faible : code TypeScript testé par Vitest dans le même dépôt, zéro infrastructure serveur à maintenir ou patcher. | Élevée : mises à jour de sécurité Linux/Docker, surveillance d'uptime, renouvellement de clés ou quotas API. |

### Recommandation retenue et validée
**L'Option A (Compilateur C99 + Machine Virtuelle à mémoire linéaire `WebAssembly.Memory` isolée dans un Web Worker)** est retenue sans ambiguïté. Elle respecte simultanément la contrainte de **0,00 €**, l'absence de `gcc` sur la machine hôte, la sécurité absolue, le déploiement sur hébergement statique et offre en prime un **diagnostic pédagogique et une visualisation mémoire** impossibles avec un binaire `gcc` standard non instrumenté.

---

## 4. CAHIER DES CHARGES PÉDAGOGIQUE CONSOLIDÉ

### Public cible et philosophie
- **Public** : Étudiant de 1re année d'école d'ingénieurs (classe préparatoire intégrée ou tronc commun), débutant absolu en programmation.
- **Approche** : Zéro jargon non expliqué. Chaque concept suit le cycle :
  1. *Intuition & Analogie concrète* (comprendre le « pourquoi » avant le « comment »).
  2. *Définition formelle & Vocabulaire FR/EN* (ex. Tableau / *Array*, Pointeur / *Pointer*, Pile d'exécution / *Call Stack*).
  3. *Exemple simple commenté ligne par ligne* avec sortie attendue.
  4. *Exemple intermédiaire* mettant la notion en situation réelle.
  5. *Erreurs classiques (Pièges)* et comment les éviter.
  6. *Questions de vérification immédiate & Exercices gradués* (QCM, prédiction, trace, remise en ordre, complétion, correction de bug, écriture de code).

### Arbitrage sur les notions avancées (Section 5 du cahier des charges)
- **Dans le Parcours A (Algorithmique)** :
  - **Traces d'exécution et Invariants de boucle** : Inclus (Chapitre A14) car indispensables en 1re année d'école d'ingénieurs pour prouver qu'une boucle termine et calcule le bon résultat.
  - **Complexité élémentaire $\mathcal{O}(1), \mathcal{O}(\log n), \mathcal{O}(n), \mathcal{O}(n^2)$** : Incluse dans les chapitres de recherche (A12 — recherche séquentielle vs dichotomique) et de tri (A13) ainsi qu'en synthèse, de façon intuitive (nombre d'opérations en fonction de $n$).
  - **Récursivité élémentaire** : Introduite clairement dans les fonctions (A9 & B8) avec l'exemple de la factorielle et de la pile d'appels (cas de base + appel récursif).
- **Dans le Parcours B (Langage C)** :
  - **Allocation dynamique (`malloc`, `calloc`, `free`)** : Incluse dans le Chapitre B12 (Pointeurs et gestion mémoire) et B16 (Synthèse) car essentielle pour comprendre le tas (*Heap*) face à la pile (*Stack*).
  - **Fichiers (`FILE*`, `fopen`, `fprintf`, `fscanf`, `fclose`)** : Expliqués conceptuellement et illustrés dans le chapitre d'entrées/sorties et de synthèse, avec support dans l'environnement mémoire virtuel.

### Structure complète des 32 Chapitres (16 Algorithmique + 16 Langage C)

#### PARCOURS A — ALGORITHMIQUE (16 Chapitres)
- **A01** : Introduction à l'algorithmique et résolution de problèmes (Qu'est-ce qu'un algorithme, séquentialité, décomposition Entrées $\to$ Traitement $\to$ Sorties, structure d'un pseudo-code).
- **A02** : Variables, constantes, types et affectations (Boîtes mémoire, nommage, types `Entier`, `Réel`, `Caractère`, `Chaîne`, `Booléen`, affectation $\leftarrow$, échange de deux variables avec variable temporaire).
- **A03** : Expressions, opérateurs et calculs (Priorité des opérateurs, division entière `DIV` vs réelle `/`, reste `MOD` / modulo, expressions booléennes, évaluation court-circuit).
- **A04** : Entrées et sorties (Dialogue homme-machine, `Lire`, `Afficher`, messages d'invite clairs, formatage des résultats).
- **A05** : Conditions simples et imbriquées (`Si ... Alors ... Sinon ... FinSi`, conditions composées `ET`, `OU`, `NON`, arbres de décision, conditions imbriquées).
- **A06** : Choix multiples (`Selon ... Cas ... Autrement ... FinSelon`, menus d'options, lisibilité face aux `Si/SinonSi` en cascade).
- **A07** : Boucles et structures répétitives (`Pour i de ... à ...`, `TantQue ... Faire`, `Répéter ... Jusqu'à`, choix de la bonne boucle, risque de boucle infinie, accumulateurs et compteurs).
- **A08** : Fonctions et procédures (Modularité, principe DRY, différence entre procédure sans retour et fonction avec `Retourner`, lisibilité).
- **A09** : Paramètres, valeurs de retour, décomposition et récursivité (Paramètres formels vs effectifs, passage par valeur vs référence, variables locales, initiation à la récursivité et cas d'arrêt).
- **A10** : Tableaux et parcours de données (Indice commençant à 0, taille fixe, déclaration, lecture/écriture par indice, parcours complet avec `Pour`, tableaux 2D / matrices).
- **A11** : Algorithmes classiques sur tableaux : Somme, moyenne, comptage, minimum et maximum (Initialisation correcte du min/max sur le premier élément, comptage conditionnel).
- **A12** : Recherche dans des collections (Recherche séquentielle avec arrêt anticipé, recherche dichotomique sur tableau trié, comparaison intuitive $\mathcal{O}(n)$ vs $\mathcal{O}(\log_2 n)$).
- **A13** : Tris élémentaires (Tri par sélection du minimum, tri à bulles, tri par insertion, coût quadratique $\mathcal{O}(n^2)$, stabilité).
- **A14** : Traces d'exécution et invariants de boucle (Construire une table de trace colonne par colonne, prédire l'état final, notion d'invariant et de variant d'arrêt).
- **A15** : Tests, cas limites et débogage logique (Jeux d'essai : cas normal, cas aux limites $n=0, n=1$, valeurs négatives, doublons ; localisation d'un bug logique par dichotomie).
- **A16** : Problèmes de synthèse algorithmique (Analyse de relevés de capteurs, gestion de notes d'une promotion, vérification de palindrome, passerelle vers le C).

#### PARCOURS B — LANGAGE C (16 Chapitres)
- **B01** : Structure d'un programme C et fonction `main` (`#include <stdio.h>`, `int main(void)`, blocs `{ }`, point-virgule `;`, `return 0;`, commentaires `//` et `/* */`).
- **B02** : Compilation et premier programme (Du code source `.c` à l'exécutable : préprocesseur, compilateur, éditeur de liens ; `printf`, séquences `\n`, `\t`, lecture des messages d'erreur).
- **B03** : Variables, constantes, types et opérateurs en C (`int`, `double`, `float`, `char`, `bool`, `size_t`, `const`, `#define`, opérateurs arithmétiques, relationnels, logiques `&&` `||` `!`, incrémentation `++`/`--`, `sizeof`).
- **B04** : Conversions de types et pièges numériques (Piège classique `5 / 2 == 2`, promotion implicite, cast explicite `(double)`, débordement d'entier *overflow*, précision flottante).
- **B05** : Affichage et lecture de données (`printf` et `scanf`) (Spécificateurs `%d`, `%f`, `%.2f`, `%lf`, `%c`, `%s`, `%p` ; le rôle vital du `&` dans `scanf("%d", &age)` ; vérification du retour de `scanf`).
- **B06** : Structures conditionnelles en C (`if`, `else if`, `else`, le piège mortel `if (x = 0)` vs `if (x == 0)`, `switch / case / default`, oubli du `break`, opérateur ternaire `? :`).
- **B07** : Boucles en C (`for`, `while`, `do ... while`, usage de `break` et `continue`, boucles imbriquées, erreurs d'indice d'un cran *off-by-one*).
- **B08** : Fonctions, prototypes et récursivité (Déclaration / prototype en haut de fichier, définition, pile d'appels, passage par valeur en C, fonctions récursives).
- **B09** : Portée, visibilité et durée de vie des variables (Variables locales de bloc, masquage *shadowing*, variables globales à éviter, mot-clé `static`).
- **B10** : Tableaux en C (Déclaration `int tab[5]`, initialisation `{1, 2, 3}`, absence de vérification native des bornes, passage d'un tableau et de sa taille `int n` à une fonction, matrices 2D).
- **B11** : Chaînes de caractères en C (Tableau de `char` terminé par la sentinelle `'\0'`, différence `'a'` vs `"a"`, bibliothèque `<string.h>` : `strlen`, `strcpy`, `strcmp`, `strcat`).
- **B12** : Pointeurs, adresses mémoire et allocation dynamique (Mémoire linéaire, adresse `&x`, déclaration `int *p`, déréférencement `*p`, `NULL`, passage par adresse `echanger(int *a, int *b)`, lien tableau/pointeur, `malloc`/`free`).
- **B13** : Structures (`struct`) et types personnalisés (`typedef`) (Regrouper des données hétérogènes, `typedef struct`, accès par point `.`, pointeur sur structure et opérateur flèche `->`).
- **B14** : Méthodologie de débogage en C (Traces d'exécution avec `printf`, assertions `assert()`, inspection de la mémoire et des pointeurs, isoler une fonction fautive).
- **B15** : Erreurs de compilation et d'exécution (Décoder les messages du compilateur, avertissements `-Wall`, Segmentation Fault / déréférencement NULL, dépassement de tableau, division par zéro, fuite mémoire).
- **B16** : Petits projets de synthèse et passerelles Algo $\to$ C (Gestionnaire de notes d'étudiants avec `struct`, analyseur statistique et tri en C, chiffrement de César et manipulation de chaînes, jeu du juste prix / recherche dichotomique).

---

## 5. RÈGLES DE VALIDATION ET MODÈLE DE PROGRESSION LOCALE

### Définitions strictes de la progression (Section 10)
1. **Consulter un chapitre (`consulted`)** : L'étudiant a ouvert la leçon du chapitre. *Ne valide jamais le chapitre.*
2. **Terminer une leçon (`lessonCompleted`)** : L'étudiant a lu la leçon ET a répondu correctement aux questions de compréhension intégrées (mini-quiz de vérification de lecture en bas de leçon).
3. **Réussir un exercice (`exercisePassed`)** : L'étudiant a soumis une réponse ou un programme qui passe 100 % des critères déterministes ou de la suite de tests automatisés de l'exercice.
4. **Valider un chapitre (`chapterValidated`)** :
   - La leçon du chapitre est terminée (`lessonCompleted === true`), **ET**
   - Au moins **75 % des exercices du chapitre** (dont obligatoirement l'exercice d'application/programmation principal) sont réussis (`exercisePassed === true`).
5. **Navigation libre et guidée** :
   - Tous les chapitres sont consultables pour ne jamais bloquer artificiellement un étudiant qui souhaite réviser une notion précise (conformément à la règle : *« Ne bloque pas artificiellement tout le parcours C derrière la validation intégrale du parcours algorithmique »*).
   - Toutefois, chaque chapitre affiche clairement ses **prérequis** (validés ou non) et le tableau de bord recommande l'**étape suivante logique** du parcours.

### Architecture de stockage local
- **`localStorage` (`algo_c_platform_prefs_v1`)** : Préférences légères (thème clair/sombre, taille de police de l'éditeur, dernier écran consulté, panneau d'aide).
- **`IndexedDB` (`AlgoCPlatformDB`, version `1`, store `progression`)** + miroir synchrone sécurisé :
  - Stocke l'état complet structuré (`StudentProgressState` v1) :
    - `schemaVersion: 1`
    - `startedAt`, `lastActivityAt`
    - `lastLocation` (parcours, chapitre, onglet)
    - `chapters`: statut par chapitre (`consultedAt`, `lessonQuizPassed`, `lessonCompletedAt`, `validatedAt`)
    - `exercises`: dictionnaire par `exerciseId` (`attemptsCount`, `passed`, `bestScore`, `lastSubmittedAnswer`, `savedCode`, `hintsUnlocked`, `lastAttemptAt`, `errorHistory`)
    - `labSnippets`: programmes C et pseudo-codes sauvegardés dans le laboratoire libre.
- **Export / Import JSON** :
  - Export en un clic d'un fichier `sauvegarde-progression-algo-c-YYYY-MM-DD.json` signé avec un numéro de version de schéma (`schemaVersion: 1`) et une somme de contrôle/validation structurelle.
  - Import avec validation stricte du schéma (types, identifiants, intégrité) pour éviter toute corruption en cas de fichier invalide.

---

## 6. LISTE DES ÉCRANS DE L'INTERFACE (SECTION 9)

1. **Accueil & Tableau de bord (`DashboardView`)** :
   - Bandeau de reprise rapide (« Reprendre là où vous vous êtes arrêté »).
   - Vue synthétique de la progression globale (Parcours A Algorithmique, Parcours B Langage C, Passerelles Algo $\to$ C).
   - Prochaine étape recommandée, statistiques d'acquis (chapitres validés, exercices réussis, notions à consolider).
2. **Vue des deux parcours & Passerelles (`TracksOverviewView`)** :
   - Présentation comparée du Parcours A (Algorithmique & Pseudo-code) et du Parcours B (Programmation C), ainsi que des exercices passerelles.
   - Filtres par état (Tous, À faire, En cours, Validés, À revoir) et recherche par mot-clé/notion.
3. **Navigation par chapitres (`ChapterListView` & Barre latérale persistante)** :
   - Carte structurée des 16 chapitres A et 16 chapitres B avec indicateurs d'état (Non commencé, Consulté, Leçon terminée, Chapitre validé), prérequis et objectifs.
4. **Page de leçon (`LessonView`)** :
   - Objectifs, prérequis (avec liens cliquables), intuition & analogie, définition formelle, tableau du vocabulaire FR/EN, exemple simple expliqué ligne par ligne, exemple intermédiaire, bouton « Ouvrir dans le Laboratoire » pour tester chaque exemple, erreurs classiques à éviter, résumé synthétique, et **Mini-évaluation de validation de la leçon**.
5. **Page d'exercice (`ExerciseView`)** :
   - Navigation entre les exercices du chapitre (QCM, Prédiction de sortie, Trace d'exécution interactive, Remise en ordre d'instructions, Complétion de code, Détection/Correction de bug, Écriture de pseudo-code avec exécution réelle, Programmation C avec compilation et batterie de tests unitaires).
   - Système d'indices progressifs (Indice 1, Indice 2, Indice 3) sans dévoiler immédiatement la solution.
   - Correction explicative détaillée après réussite ou après plusieurs tentatives infructueuses.
6. **Laboratoire de programmation C & Pseudo-code (`LabView`)** :
   - Éditeur de code complet (coloration syntaxique, numéros de lignes, raccourcis clavier, modèles de départ / *templates*, sauvegarde automatique locale).
   - Mode **Langage C (Compilateur C99 + Inspecteur Mémoire Pile/Tas/Pointeurs)** et Mode **Pseudo-Code Algorithmique (Interpréteur + Table de trace automatique)**.
   - Panneau d'entrées standard (`stdin`), bouton **Compiler**, bouton **Exécuter**, console de sortie (`stdout`/`stderr`), liste des diagnostics (erreurs/avertissements avec ligne et explication pédagogique), et **Visualiseur Mémoire & Pile d'appels** en temps réel.
7. **Bilan et progression détaillée (`ProgressReportView`)** :
   - Matrice de maîtrise par chapitre et par compétence (Variables, Conditions, Boucles, Fonctions, Tableaux, Chaînes, Pointeurs, Structures, Débogage).
   - Identification automatique des **notions à revoir** (exercices échoués à plusieurs reprises ou chapitres consultés mais non validés).
   - Historique des activités récentes.
8. **Paramètres et gestion de la sauvegarde locale (`SettingsView`)** :
   - Préférences d'affichage (thème clair/sombre, taille de police du code, affichage des avertissements `-Wall`).
   - Explication transparente du fonctionnement de la sauvegarde locale (`IndexedDB` / `localStorage`) et de ses limites (navigation privée, changement d'appareil, effacement du cache).
   - Boutons **Exporter ma progression (.json)**, **Importer une sauvegarde (.json)** et **Réinitialiser la progression** (avec confirmation de sécurité).

---

## 7. RISQUES IDENTIFIÉS ET MESURES DE PRÉVENTION

| Risque | Impact | Mesure de prévention implémentée |
| :--- | :--- | :--- |
| **Boucle infinie écrite par l'étudiant (`while(1)`)** | Gel de l'onglet du navigateur et perte du travail en cours | Sauvegarde automatique du code dans `IndexedDB`/`localStorage` **avant** chaque exécution + Exécution isolée dans un Web Worker avec timeout strict (2,5 s) et compteur maximal d'instructions (500 000 opérations) permettant un arrêt propre avec message pédagogique. |
| **Perte de progression (cache navigateur vidé)** | Frustration de l'étudiant | Double persistance (`IndexedDB` + miroir `localStorage`) + module d'Export/Import JSON accessible depuis la barre supérieure et l'écran Paramètres, avec rappel régulier d'exporter sa sauvegarde. |
| **Messages d'erreur C incompréhensibles pour un novice** | Découragement et blocage | Chaque diagnostic du compilateur C associe le message technique standard (ligne, colonne, code) à une **explication pédagogique en français** et un conseil de correction ciblé (ex. oubli de `;`, oubli de `&` dans `scanf`, `=` au lieu de `==`). |
| **Comportements indéfinis en C (Undefined Behavior)** | Résultats incohérents ou incompréhensibles (pointeur fou, dépassement de tableau, variable non initialisée) | Intégration d'une mémoire linéaire contrôlée (ASan pédagogique) qui détecte et explique immédiatement les lectures de variables non initialisées, les débordements de tableaux, les déréférencements de `NULL` et les fuites mémoire. |

---

## 8. PLAN DE DÉVELOPPEMENT ET DE LIVRAISON (EXÉCUTION EN AUTONOMIE TOTALE)

1. **Étape 1 (Terminée)** : Audit de l'environnement, audit budget 0 € et rédaction du document de cadrage et d'architecture.
2. **Étape 2** : Initialisation du socle technique (Vite + React + TypeScript + Tailwind CSS + Vitest) et de la couche de persistance locale (`IndexedDB` + `localStorage` + Export/Import JSON).
3. **Étape 3** : Développement et test unitaire complet du **Compilateur et Runtime C99 à mémoire linéaire (`C99Engine`)** et de l'**Interpréteur et Traceur de Pseudo-Code (`AlgoEngine`)**.
4. **Étape 4** : Rédaction intégrale et structurée des **16 chapitres du Parcours A (Algorithmique)** (cours complets, analogies, vocabulaire FR/EN, exemples commentés, pièges, quiz de leçon et exercices variés avec tests).
5. **Étape 5** : Rédaction intégrale et structurée des **16 chapitres du Parcours B (Langage C)** et des **Passerelles Algo $\to$ C** (cours complets, exemples compilables, exercices progressifs et problèmes de synthèse avec suites de tests automatisées).
6. **Étape 6** : Développement des 8 écrans de l'interface utilisateur, du Laboratoire C/Algo avec inspecteur mémoire et table de trace, et intégration complète.
7. **Étape 7** : Exécution de la suite de tests automatisés (Vitest : tests du compilateur C, de l'interpréteur pseudo-code, de la persistance, et **test automatisé des solutions de référence de tous les exercices des 32 chapitres**), build de production et rédaction de la documentation complète de livraison et de déploiement gratuit.
