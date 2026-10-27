# 🎓 Guide d'Utilisation Complet (de A à Z)
**Plateforme Pédagogique d'Algorithmique & de Programmation en Langage C (ISO C99)**  
*Manuel destiné à l'utilisateur final (Étudiant en 1re année d'École d'Ingénieurs / Débutant absolu)*

---

## 📋 Sommaire du Guide

1. [Présentation générale : Comment tirer le meilleur parti de la plateforme](#1-présentation-générale--comment-tirer-le-meilleur-parti-de-la-plateforme)
2. [Démarrage & Prise en main de l'interface](#2-démarrage--prise-en-main-de-linterface)
3. [Le Tableau de Bord : Piloter son apprentissage](#3-le-tableau-de-bord--piloter-son-apprentissage)
4. [Organiser son parcours : Parcours A (Algo), Parcours B (Langage C) et Passerelles](#4-organiser-son-parcours--parcours-a-algo-parcours-b-langage-c-et-passerelles)
5. [Étudier un Chapitre de Cours de A à Z](#5-étudier-un-chapitre-de-cours-de-a-à-z)
6. [Résoudre les 10 Types d'Exercices Interactifs](#6-résoudre-les-10-types-dexercices-interactifs)
7. [Utiliser l'Éditeur de Code et Comprendre les Tests Automatisés](#7-utiliser-léditeur-de-code-et-comprendre-les-tests-automatisés)
8. [Lire l'Inspecteur d'Exécution : Console, Diagnostics, Mémoire (Pile/Tas) et Trace](#8-lire-linspecteur-dexécution--console-diagnostics-mémoire-piletas-et-trace)
9. [Le Laboratoire Libre C99 & Pseudo-code](#9-le-laboratoire-libre-c99--pseudo-code)
10. [Règles de Validation des Chapitres & Bilan des Acquis](#10-règles-de-validation-des-chapitres--bilan-des-acquis)
11. [Sauvegarde Locale, Export / Import JSON et Paramètres](#11-sauvegarde-locale-export--import-json-et-paramètres)
12. [Aide-Mémoire Rapide (Pseudo-code & C99) et Questions Fréquentes (FAQ)](#12-aide-mémoire-rapide-pseudo-code--c99-et-questions-fréquentes-faq)

---

## 1. Présentation générale : Comment tirer le meilleur parti de la plateforme

Bienvenue sur votre plateforme d'apprentissage ! Cette application a été conçue spécifiquement pour vous accompagner **de zéro** (aucun prérequis en programmation) jusqu'à la maîtrise des fondamentaux exigés en première année d'école d'ingénieurs :
- **Construire un raisonnement algorithmique** structuré et l'écrire en **pseudo-code**.
- **Tracer à la main** l'exécution d'un algorithme étape par étape.
- **Traduire cette logique en langage C (norme ISO C99)**, compiler, exécuter, observer la mémoire (Pile et Tas) et corriger vos erreurs en autonomie.

### Fonctionnement 100 % autonome et hors-ligne
- **Aucun compte ni mot de passe requis** : tout fonctionne directement dans votre navigateur.
- **Vrai compilateur C99 et interpréteur Pseudo-code intégrés** : vos programmes sont réellement compilés et exécutés dans un bac à sable sécurisé (*sandbox*).
- **Évaluation 100 % déterministe** : aucune intelligence artificielle approximative n'intervient dans la correction. Vos exercices sont validés par de véritables jeux de tests (cas normaux, cas limites et cas d'erreur).

---

## 2. Démarrage & Prise en main de l'interface

### 2.1. Ouvrir la plateforme
- **Si la plateforme est déployée en ligne** : ouvrez simplement l'adresse web dans votre navigateur habituel (Chrome, Edge, Firefox, Safari).
- **Si vous l'utilisez sur votre ordinateur en local** :
  1. Ouvrez un terminal dans le dossier du projet.
  2. Lancez `npm run dev`.
  3. Cliquez sur le lien affiché (généralement `http://localhost:5173`).

### 2.2. Les 3 zones de l'écran
L'interface est divisée en trois zones sobres et permanentes :

1. **La Barre Supérieure (En-tête fixe)** :
   - **Logo « Algo & Langage C99 »** (à gauche) : cliquez dessus à tout moment pour revenir au **Tableau de bord**.
   - **Menu déroulant d'accès rapide aux 32 chapitres** (au centre-droit) : permet de sauter instantanément vers n'importe quel chapitre (`A01` à `A16` ou `B01` à `B16`). Les chapitres déjà validés sont marqués d'une coche `✓`.
   - **Badge de progression globale** (`X / 32 validés`) : indique en temps réel votre avancement.
   - **Bouton Thème Clair / Sombre** (icône Soleil ☀️ / Lune 🌙) : bascule instantanément l'affichage en mode clair ou sombre selon votre confort visuel.

2. **Le Menu Latéral Gauche (Navigation principale)** :
   - Sur ordinateur, il est toujours visible à gauche. Sur téléphone ou tablette, cliquez sur l'icône **Menu (☰)** en haut à gauche pour l'ouvrir.
   - Il contient **7 entrées principales** :
     1. **Tableau de bord** : vue d'ensemble et reprise rapide.
     2. **Parcours A — Algorithmique** : accès aux 16 chapitres d'algorithmique (`A01` à `A16`).
     3. **Parcours B — Langage C99** : accès aux 16 chapitres de programmation C (`B01` à `B16`).
     4. **Passerelles Algo $\to$ C** : les 6 ponts méthodologiques entre le pseudo-code et le C.
     5. **Laboratoire C99 & Pseudo-code** : espace d'expérimentation libre.
     6. **Bilan & Acquis** : rapport détaillé de vos réussites chapitre par chapitre.
     7. **Sauvegarde & Paramètres** : préférences d'affichage et export/import de votre sauvegarde `.json`.
   - En bas du menu latéral se trouve également l'**arborescence rapide des 32 chapitres** pour naviguer en un clic.

3. **La Zone Centrale de Travail** :
   - C'est ici que s'affichent vos cours, vos exemples exécutables, vos exercices et votre laboratoire de code.

---

## 3. Le Tableau de Bord : Piloter son apprentissage

Lorsque vous ouvrez la plateforme, vous arrivez sur le **Tableau de bord** :

- **Bouton principal « Reprendre : [Chapitre] »** :
  - La plateforme mémorise automatiquement le dernier écran, chapitre ou exercice que vous consultiez. Cliquez sur ce bouton bleu pour reprendre votre séance exactement là où vous l'aviez laissée.
- **Les 4 Cartes d'Indicateurs (KPI)** :
  1. **Chapitres validés (`/ 32`)** : nombre total de chapitres dont vous avez validé à la fois le cours et les exercices.
  2. **Exercices résolus** : nombre total d'exercices réussis sur l'ensemble de la plateforme.
  3. **Parcours A — Algorithmique (`%`)** : jauge de progression sur les 16 chapitres Algo.
  4. **Parcours B — Langage C (`%`)** : jauge de progression sur les 16 chapitres C.
- **Cartes « Prochaine étape recommandée »** :
  - Pour chaque parcours (A et B), la plateforme identifie automatiquement le premier chapitre non encore validé et vous propose un bouton direct **« Étudier Axx »** ou **« Étudier Bxx »**.

---

## 4. Organiser son parcours : Parcours A (Algo), Parcours B (Langage C) et Passerelles

### 4.1. Faut-il terminer tout le Parcours A avant de commencer le Parcours B ?
**Non !** Les deux parcours sont volontairement libres d'accès. Toutefois, si vous débutez complètement, nous vous recommandons **l'apprentissage croisé par paliers** à l'aide des **6 Passerelles Algo $\to$ C** :

| Palier | Étape 1 : Étudier en Algorithmique (Parcours A) | Étape 2 : Mettre en pratique en C (Parcours B) | Passerelle associée |
| :---: | :--- | :--- | :--- |
| **Palier 1** | `A01` (Introduction), `A02` (Variables), `A03` (Calculs `DIV`/`MOD`) | `B01` (`main`), `B02` (Compilation), `B03` (Types), `B04` (Conversions/Casts) | **Passerelle 1** |
| **Palier 2** | `A04` (Entrées `LIRE` et Sorties `AFFICHER`) | `B05` (`printf` et `scanf` avec l'adresse `&`) | **Passerelle 2** |
| **Palier 3** | `A05` (Conditions `SI`), `A06` (`SELON`), `A07` (Boucles `POUR`/`TANT QUE`) | `B06` (`if/else`, `switch`), `B07` (`for`, `while`, `do...while`) | **Passerelle 3** |
| **Palier 4** | `A08` (Fonctions/Procédures), `A09` (Paramètres & Récursivité) | `B08` (Fonctions & Prototypes), `B09` (Portée & Pile d'appels) | **Passerelle 4** |
| **Palier 5** | `A10` (Tableaux), `A11` (Somme/Min/Max), `A12` (Recherche), `A13` (Tris) | `B10` (Tableaux), `B11` (Chaînes `\0`), `B12` (Pointeurs `*` et `&`) | **Passerelle 5** |
| **Palier 6** | `A14` (Traces), `A15` (Tests & Débogage), `A16` (Synthèse Algo) | `B13` (`struct`), `B14` (Débogage), `B15` (`malloc`/`free`), `B16` (Synthèse C) | **Passerelle 6** |

### 4.2. Explorer la liste des chapitres (`Parcours A` ou `Parcours B`)
En cliquant sur **Parcours A** ou **Parcours B** dans le menu latéral :
- Vous pouvez **filtrer les chapitres** grâce aux boutons en haut à droite :
  - `Tous (16)` : affiche les 16 chapitres dans l'ordre logique.
  - `Validés` : affiche uniquement les chapitres terminés et validés.
  - `En cours` : affiche les chapitres que vous avez commencé à lire ou dont vous avez tenté au moins un exercice.
  - `À étudier` : affiche les chapitres que vous n'avez pas encore ouverts.
- Vous pouvez **rechercher un concept** dans la barre de recherche (ex. : `pointeur`, `dichotomie`, `scanf`, `boucle`, `malloc`).
- Sur chaque carte de chapitre, vous voyez :
  - Sa durée estimée (ex. `~45 min`), ses **prérequis** et ses **concepts clés**.
  - Un bouton **« Étudier la leçon »** pour ouvrir le cours.
  - Des boutons rapides **`Ex 1`**, **`Ex 2`**, **`Ex 3`** pour accéder directement à chaque exercice du chapitre (`✓` indique un exercice déjà réussi).

### 4.3. Utiliser la vue « Passerelles Algo $\to$ C »
En cliquant sur **Passerelles Algo $\to$ C** dans le menu :
- Vous retrouvez **la méthode d'ingénieur en 7 étapes** : *1. Comprendre $\to$ 2. Pseudo-code $\to$ 3. Tracer $\to$ 4. Traduire en C $\to$ 5. Compiler $\to$ 6. Tester $\to$ 7. Expliquer*.
- Les **6 cartes de passerelles** vous permettent d'ouvrir côte à côte le cours/exercice d'algorithmique et son jumeau exact en langage C.

---

## 5. Étudier un Chapitre de Cours de A à Z

Lorsque vous cliquez sur **« Étudier la leçon »**, la page de cours est structurée en **6 étapes progressives** conçues pour ne jamais vous submerger :

### Étape 1 : Objectifs, Prérequis et Passerelles (En-tête du cours)
- Vérifiez les **Objectifs d'apprentissage** (ce que vous saurez faire à la fin du chapitre).
- Si un **Prérequis** est affiché (ex. `Prérequis : B03`), vous pouvez cliquer dessus si vous avez besoin d'une révision.
- Les boutons verts **`↔ Chapitres liés / Passerelles`** vous permettent de basculer vers le chapitre correspondant dans l'autre parcours.

### Étape 2 : Compréhension intuitive, Définition formelle et Analogie concrète
- **1. Comprendre intuitivement la notion** : explique *pourquoi* la notion existe et quel problème concret elle résout, sans jargon inutile.
- **2. Définition rigoureuse & Règles formelles** : donne la règle exacte (syntaxe, comportement mémoire, règles de typage).
- **Encadré jaune « Analogie concrète »** (à droite) : relie la notion informatique à une image du monde physique (ex. boîtes aux lettres numérotées pour la mémoire RAM, poupées russes pour la récursivité, formulaire administratif pour les structures).

### Étape 3 : Table du Vocabulaire Technique Français / Anglais
- En informatique, les compilateurs (`gcc`, `clang`) et les documentations techniques utilisent des termes anglais.
- Ce tableau vous donne pour chaque concept le **Terme Français**, le **Terme Anglais** (ex. *Stack overflow*, *Pointer dereferencing*, *Off-by-one error*) et sa **Définition opérationnelle**.

### Étape 4 : Les 2 Exemples Annotés et Exécutables en Direct
Chaque leçon comporte un **Exemple Fondamental (Pas à pas)** et un **Exemple Intermédiaire (Mise en situation)** :
1. **À gauche** : le code complet numéroté, l'entrée standard éventuelle (`stdin`) et le résultat attendu (`stdout`).
2. **À droite** : **l'explication ligne par ligne** (`L.1`, `L.2`, etc.) qui décortique le rôle exact de chaque instruction.
3. **Bouton vert « Exécuter cet exemple »** : cliquez dessus pour compiler et exécuter réellement l'exemple sans quitter votre leçon ! L'inspecteur s'ouvre juste en dessous pour vous montrer la sortie console, l'état de la mémoire (Pile/Tas en C) et la table de trace.
4. **Bouton « Ouvrir dans le Laboratoire »** : envoie une copie de cet exemple dans le Laboratoire libre si vous souhaitez modifier des valeurs et tester vos propres idées.

### Étape 5 : Les Erreurs Classiques à Éviter & L'Essentiel à Retenir
- **4. Erreurs classiques à éviter absolument** : présente côte à côte le **`✗ Code incorrect`** (en rouge) et le **`✓ Code correct`** (en vert), avec la catégorie d'erreur (`syntaxe`, `compilation`, `exécution` ou `logique`) et l'explication du piège.
- **5. L'essentiel à retenir** : liste synthétique des points clés à mémoriser avant de faire le quiz.

### Étape 6 : Le Quiz de Vérification de Compréhension
En bas de chaque leçon se trouve un **Quiz interactif** :
1. Cochez une réponse pour chaque question.
2. Cliquez sur **« Vérifier mes réponses au quiz »**.
3. Une explication détaillée s'affiche immédiatement sous chaque question :
   - Si toutes vos réponses sont exactes, le badge vert **« Quiz de leçon validé »** est débloqué !
   - S'il y a une erreur, lisez l'explication affichée, modifiez votre choix et cliquez à nouveau sur **« Vérifier mes réponses au quiz »**.
4. Cliquez ensuite sur le bouton vert **« Commencer l'Exercice 1 »** en bas à droite.

---

## 6. Résoudre les 10 Types d'Exercices Interactifs

La plateforme propose **10 catégories d'exercices** pour entraîner toutes les facettes du raisonnement d'ingénieur. Voici comment utiliser chacune d'elles :

### Catégorie 1 : QCM Conceptuel (`qcm`) & Catégorie 2 : Détection d'Erreur (`error_spot`)
- Lisez l'énoncé et, s'il y en a un, l'extrait de code affiché dans l'encadré sombre.
- Sélectionnez la proposition qui identifie la bonne réponse ou l'erreur exacte (ligne et nature du bug).
- Cliquez sur **« Valider ma réponse »**.

### Catégorie 3 : Prédiction de Résultat (`prediction`)
- Vous devez jouer le rôle de l'ordinateur : déroulez mentalement (ou sur brouillon) le code affiché en tenant compte de l'entrée `stdin` éventuelle.
- Saisissez dans la zone de texte la sortie exacte que le programme va afficher.
- Cliquez sur **« Vérifier ma prédiction »**.

### Catégorie 4 : Table de Trace d'Exécution (`trace`)
- À gauche s'affiche l'algorithme ou le programme C.
- À droite s'affiche la **Table de Trace** dont certaines cellules sont pré-remplies et d'autres contiennent un champ de saisie **`?`**.
- Remplissez chaque case **`?`** avec la valeur exacte de la variable à l'étape demandée.
- Cliquez sur **« Vérifier la table de trace »**. La plateforme vous indique combien de cellules sont exactes.

### Catégorie 5 : Remise en Ordre d'Instructions (`ordering`)
- Les lignes d'un algorithme ou d'un programme C ont été mélangées.
- Utilisez les boutons fléchés **Haut (`↑`)** et **Bas (`↓`)** à droite de chaque ligne pour rétablir l'ordre logique d'exécution (déclarations $\to$ initialisations $\to$ lecture $\to$ traitement $\to$ affichage $\to$ `return 0;`).
- Cliquez sur **« Vérifier l'ordre des instructions »**.

### Catégorie 6 : Complétion de Code (`completion`)
- Un modèle de code contenant des emplacements à compléter (soit sous forme de champs `GAP_1`, `GAP_2`, soit directement dans l'éditeur de code) vous est proposé.
- Complétez les expressions manquantes et cliquez sur **« Vérifier le code complété »** (ou **« Valider mon programme »**).

### Catégories 7, 8, 9 et 10 : Correction de Bug (`bugfix`), Écriture de Pseudo-code (`pseudocode`), Programmation C (`c_code`) et Problèmes de Synthèse (`synthesis`)
Ces exercices utilisent **l'Éditeur de code complet** et le **Moteur de tests automatisés** détaillés à la section suivante.

---

## 7. Utiliser l'Éditeur de Code et Comprendre les Tests Automatisés

Dans tous les exercices d'écriture ou de correction de code, vous disposez d'un environnement de développement complet :

### 7.1. Fonctionnalités de l'Éditeur de Code
- **Badge de langage** (en haut à gauche de l'éditeur) : indique clairement si vous devez écrire en **`C99 (ISO Standard)`** ou en **`Pseudo-code Algorithmique`**.
- **Numérotation des lignes & Surlignage des erreurs** :
  - Si votre code comporte une **erreur de compilation ou d'exécution**, le numéro de la ligne fautive s'allume en **rouge**.
  - Si le linter détecte un **avertissement pédagogique** (ex. variable suspecte), le numéro de la ligne s'allume en **orange**.
- **Raccourcis clavier utiles** :
  - Touche **`Tab`** : insère une indentation propre de 4 espaces.
  - **`Ctrl + Entrée`** (ou `Cmd + Entrée` sur Mac) : compile et exécute immédiatement votre code.
- **Sauvegarde automatique du brouillon** : chaque caractère tapé dans l'éditeur est sauvegardé instantanément dans votre navigateur. Si vous changez de page et revenez, vous retrouverez votre code intact.
- **Bouton « Réinitialiser »** (en haut à droite de l'éditeur) : remet le code de départ (`starterCode`) si vous souhaitez repartir de zéro.

### 7.2. Différence entre « Tester avec cette entrée » et « Valider mon programme »
Sous l'éditeur se trouvent une zone **`Entrée standard de test libre (stdin)`** et deux boutons d'action :

1. **Bouton gris « Tester avec cette entrée »** :
   - Compile et exécute votre programme **uniquement avec l'entrée `stdin` que vous avez écrite dans la boîte à gauche**.
   - Idéal pour mettre au point votre programme, observer la sortie console, inspecter vos variables en mémoire ou vérifier votre table de trace sans enregistrer d'échec.

2. **Bouton bleu « Valider mon programme (N tests) »** :
   - Lance l'**évaluation officielle** de l'exercice.
   - Votre programme est compilé puis exécuté automatiquement contre **tous les cas de tests de l'exercice** :
     - **Cas normaux** : valeurs typiques de l'énoncé.
     - **Cas limites (*edge cases*)** : `0`, valeurs négatives, tableaux à 1 élément, bornes exactes.
     - **Cas invalides** : entrées erronées que votre programme doit rejeter ou gérer proprement.
   - Vérifie également les **contraintes structurelles** éventuelles de l'énoncé (ex. présence obligatoire d'une boucle `for` ou d'une fonction récursive) ainsi que l'absence de fuite mémoire ou de dépassement de tableau.
   - **Tous les tests doivent passer au vert (`✓`)** pour que l'exercice soit validé.

### 7.3. Utiliser les Indices Progressifs et la Correction Détaillée
En bas de chaque page d'exercice se trouve l'encadré **« Accompagnement progressif : Indices (0/3) & Correction commentée »** :
- **Bouton « Débloquer l'indice 1/3 » (puis `2/3` et `3/3`)** :
  - **Indice 1** : rappelle le principe ou la formule à utiliser sans donner la réponse.
  - **Indice 2** : précise la structure algorithmique ou la syntaxe C attendue.
  - **Indice 3** : guide directement vers la résolution du point bloquant.
- **Bouton « Afficher la correction détaillée »** :
  - Devient accessible dès que vous avez réussi l'exercice, ou après **2 tentatives** / **2 indices débloqués** si vous êtes réellement bloqué.
  - Affiche l'explication pédagogique complète ainsi que le **Code de référence** commenté.

---

## 8. Lire l'Inspecteur d'Exécution : Console, Diagnostics, Mémoire (Pile/Tas) et Trace

Après chaque exécution (dans un cours, un exercice ou le laboratoire), le panneau **Inspecteur** affiche une bannière d'état (verte si succès, rouge si erreur de compilation, orange si erreur d'exécution) ainsi que **4 onglets spécialisés** :

### Onglet 1 : `Sortie Console (stdout / stderr)`
- **Sortie Standard (`stdout`)** : affiche exactement ce que vos instructions `printf(...)` (en C) ou `AFFICHER(...)` (en pseudo-code) ont écrit à l'écran.
- **Sortie d'Erreur (`stderr / Sanitizers`)** : s'affiche en rouge si une erreur critique survient pendant l'exécution (division par zéro, déréférencement de pointeur `NULL`, débordement de tableau hors bornes détecté par l'AddressSanitizer, ou arrêt par le *watchdog* après 2,8 secondes en cas de boucle infinie).

### Onglet 2 : `Diagnostics Pédagogiques`
Chaque erreur ou avertissement est présenté dans une fiche claire contenant :
1. **Le numéro de ligne et le titre en français** (ex. `Ligne 12 : Oubli de l'opérateur d'adresse '&' dans scanf`).
2. **La catégorie d'erreur** :
   - `SYNTAXE` : oubli de `;`, accolade non fermée, mot-clé mal orthographié.
   - `COMPILATION` : variable non déclarée, incompatibilité de types.
   - `EXECUTION` : division par zéro, accès hors bornes d'un tableau, pointeur `NULL`, fuite mémoire.
   - `LOGIQUE` : le programme compile et ne plante pas, mais produit un calcul faux (ex. affectation `if (a = 5)` au lieu de `if (a == 5)`, ou division entière `5 / 2` donnant `2` au lieu de `2.5`).
3. **Le message `gcc` authentique en anglais** : pour vous habituer à lire les vrais compilateurs professionnels.
4. **L'explication pédagogique en français** et le **Conseil de correction (`💡 Conseil`)**.

### Onglet 3 : `Inspecteur Mémoire (Pile & Tas)` *(Disponible en mode Langage C99)*
C'est l'outil idéal pour comprendre visuellement les **pointeurs**, les **tableaux**, les **structures** et **l'allocation dynamique** :
- **Section 1 : Pile d'exécution (*Call Stack*)** :
  - Affiche chaque fonction active (ex. `main()`, `echanger()`) avec son adresse de base hexadécimale.
  - Pour chaque variable locale, un tableau indique :
    - **Adresse** en hexadécimal (ex. `0x4004`, `0x4008`).
    - **Nom** de la variable (ex. `note1`, `ptrX`).
    - **Type** C99 (ex. `int`, `int *`, `int[5]`).
    - **Taille** en octets (ex. `4 o` pour un `int`).
    - **Valeur en mémoire** : si la variable est un pointeur, un badge violet **`→ pointe vers 0x4004`** vous montre visuellement quelle case mémoire il cible !
- **Section 2 : Tas (*Heap* — Allocations dynamiques `malloc` / `calloc` / `free`)** :
  - Liste chaque bloc mémoire réservé dynamiquement avec son adresse sur le Tas (ex. `0x8000`), sa taille en octets, la ligne du `malloc`, son contenu actuel et son état :
    - Badge vert **`Libéré (free ligne X)`** si vous avez bien appelé `free(ptr)`.
    - Badge orange **`Actif / Non libéré`** + alerte **Fuite mémoire** si vous avez oublié de libérer le bloc avant la fin du programme.

### Onglet 4 : `Table de Trace (N étapes)`
- Affiche dans un tableau chronologique chacune des instructions exécutées par votre programme :
  - `Étape #1, #2...`
  - `Ligne (L.x)` exécutée
  - `Opération exécutée` (affectation, test de condition, entrée, affichage, retour de fonction)
  - `État des variables` après l'instruction (ex. `i=2, somme=15`)
  - `Affichage produit` à cette étape précise.

---

## 9. Le Laboratoire Libre C99 & Pseudo-code

Accessible à tout moment via **Laboratoire C99 & Pseudo-code** dans le menu latéral, le Laboratoire est votre terrain d'entraînement personnel :

1. **Choisir le langage** (en haut à droite) :
   - Cliquez sur **`Mode Langage C (C99)`** ou sur **`Mode Pseudo-code`**.
2. **Charger un modèle pédagogique prêt à exécuter** :
   - Cliquez sur l'un des 4 boutons de modèles en haut à gauche :
     - *C99 — Pointeurs, Pile (Stack) & Tas (malloc/free)*
     - *C99 — Structures, Tableaux & Recherche du Major*
     - *Pseudo-code — Recherche Dichotomique & Table de Trace*
     - *Pseudo-code — Récursivité (PGCD d'Euclide)*
3. **Fournir des entrées (`stdin`)** :
   - Si votre programme utilise `scanf(...)` ou `LIRE(...)`, écrivez les valeurs d'entrée dans la zone **`Flux d'entrée standard (stdin)`** située sous l'éditeur (une valeur par ligne ou séparées par un espace) *avant* de cliquer sur **Compiler & Exécuter**.
4. **Sauvegarder vos propres programmes** :
   - Donnez un titre à votre programme dans le champ texte au-dessus de l'éditeur.
   - Cliquez sur **« Sauvegarder »**. Votre programme apparaît immédiatement dans l'encadré **« Mes programmes sauvegardés »** en haut à droite. Vous pouvez le recharger en un clic ou le supprimer avec l'icône corbeille 🗑️.

---

## 10. Règles de Validation des Chapitres & Bilan des Acquis

### 10.1. Comment un chapitre passe-t-il au statut « Chapitre Validé » ?
La plateforme applique le principe fondamental n°7 : **« La progression correspond aux acquis réels, pas aux pages simplement consultées »**.  
Pour qu'un chapitre (`A01`..`A16` ou `B01`..`B16`) obtienne le badge vert **« Chapitre Validé »**, **3 conditions cumulatives** doivent être réunies :
1. **Quiz de cours réussi** : vous avez répondu correctement à 100 % des questions du quiz de compréhension en bas de la leçon.
2. **Exercices fondamentaux validés** : tous les exercices du chapitre marqués du badge *« Requis pour valider le chapitre »* sont réussis.
3. **Taux de réussite $\ge 75\%$** : au moins 75 % de l'ensemble des exercices du chapitre sont validés.

> 💡 **Bon à savoir** : Une fois qu'un chapitre ou un exercice est validé, il reste validé même si vous revenez plus tard refaire l'exercice ou tester d'autres solutions !

### 10.2. Consulter la page « Bilan & Acquis »
En cliquant sur **Bilan & Acquis** dans le menu latéral :
- Vous visualisez en un coup d'œil vos **3 compteurs globaux** (Chapitres validés `/32`, Exercices réussis et Nombre total de tentatives soumises).
- Vous disposez de la **matrice complète des 32 chapitres** (Parcours A à gauche, Parcours B à droite) :
  - Chaque chapitre affiche l'état de son quiz de leçon (`✓ Validé` ou `Non validé`) et des petits carrés numérotés `1`, `2`, `3` pour chacun de ses exercices (verts si réussis, gris si restants à faire).
  - Cliquez directement sur le titre d'un chapitre ou sur le numéro d'un exercice pour vous y rendre immédiatement.

---

## 11. Sauvegarde Locale, Export / Import JSON et Paramètres

En cliquant sur **Sauvegarde & Paramètres** dans le menu latéral, vous accédez à trois sections essentielles :

### 11.1. Préférences d'affichage et du compilateur
- **Thème visuel** : basculez entre le mode **Clair** et le mode **Sombre**.
- **Taille de police de l'éditeur** : choisissez entre **`SM`** (petite, idéale pour voir beaucoup de lignes), **`MD`** (moyenne, par défaut) ou **`LG`** (grande, confort maximal).
- **Avertissements pédagogiques du compilateur (`-Wall`)** : laissez cette case cochée (recommandé) pour que le compilateur C99 vous signale les pièges classiques (`if (a = b)`, oubli de `&` dans `scanf`, division entière implicite).

### 11.2. Exporter et Importer votre Sauvegarde (`.json`)
Votre progression est enregistrée automatiquement dans votre navigateur (`IndexedDB` et `localStorage`).  
Cependant, **le stockage local d'un navigateur a des limites techniques importantes** :
- Il est effacé si vous utilisez la **navigation privée** ou si vous videz les données de sites de votre navigateur.
- Il n'est pas partagé automatiquement si vous changez de navigateur ou d'ordinateur.

**Pour ne jamais perdre votre travail :**
1. **Exporter votre progression** :
   - Cliquez sur le bouton bleu **« Exporter ma sauvegarde (.json) »**.
   - Un fichier nommé `sauvegarde-algo-c-AAAA-MM-JJ.json` est téléchargé sur votre ordinateur. Conservez-le sur votre disque dur, votre clé USB ou votre espace cloud personnel.
2. **Restaurer (Importer) votre progression sur un autre appareil ou navigateur** :
   - Cliquez sur **« Importer un fichier de sauvegarde (.json) »** et sélectionnez votre fichier `.json` (ou collez directement le texte JSON dans la zone dédiée puis cliquez sur **« Valider et restaurer ce JSON »**).
   - La plateforme vérifie l'intégrité du fichier et restaure instantanément tous vos chapitres validés, vos exercices réussis, vos codes en cours et vos programmes du laboratoire.

### 11.3. Réinitialisation complète
- Si vous souhaitez remettre toute la plateforme à zéro, cliquez sur **« Réinitialiser toute ma progression... »** puis confirmez avec **« Oui, tout effacer »** (pensez à exporter une sauvegarde `.json` avant si vous souhaitez conserver une archive).

---

## 12. Aide-Mémoire Rapide (Pseudo-code & C99) et Questions Fréquentes (FAQ)

### 12.1. Aide-mémoire de la syntaxe Pseudo-code supportée par la plateforme

```text
ALGORITHME NomDeMonAlgorithme
VARIABLES
    n, i, somme : ENTIER
    moyenne : REEL
    estValide : BOOLEEN
    tab : TABLEAU[10] DE ENTIER
DEBUT
    LIRE(n)
    somme <- 0

    POUR i DE 1 A n FAIRE
        somme <- somme + i
    FINPOUR

    SI n > 0 ALORS
        moyenne <- somme / n
        AFFICHER("Moyenne =", moyenne)
    SINON
        AFFICHER("Erreur : n doit etre positif")
    FINSI
FIN
```
- **Opérateurs en pseudo-code** : Affectation `<-`, Division entière `DIV`, Reste entier `MOD`, Logique `ET`, `OU`, `NON`, Comparaisons `==` (ou `=`), `!=` (ou `<>`), `<`, `<=`, `>`, `>=`.
- **Fonctions et Procédures** : `FONCTION nom(a : ENTIER) : ENTIER ... RETOURNER res ... FINFONCTION`.

### 12.2. Aide-mémoire de la syntaxe Langage C (ISO C99) supportée

```c
#include <stdio.h>
#include <stdlib.h>

int calculerSomme(const int tab[], int taille) {
    int s = 0;
    for (int i = 0; i < taille; i++) {
        s += tab[i];
    }
    return s;
}

int main(void) {
    int n = 0;
    if (scanf("%d", &n) != 1 || n <= 0) {
        printf("Entree invalide\n");
        return 1;
    }

    int *valeurs = malloc(n * sizeof(int));
    if (valeurs == NULL) {
        return 1;
    }

    for (int i = 0; i < n; i++) {
        scanf("%d", &valeurs[i]);
    }

    printf("Somme = %d\n", calculerSomme(valeurs, n));

    free(valeurs);
    return 0;
}
```
- **En-têtes standard disponibles** : `<stdio.h>`, `<stdlib.h>`, `<stdbool.h>`, `<string.h>`, `<math.h>`, `<ctype.h>`, `<limits.h>`, `<assert.h>`.

---

### 12.3. Questions Fréquentes (FAQ) & Dépannage

1. **« Mon programme affiche le bon nombre, mais le test automatique échoue ! Pourquoi ? »**
   - Comparez attentivement dans la carte du test la boîte **`Attendu`** et la boîte **`Obtenu`**.
   - Vérifiez que vous n'avez pas ajouté du texte superflu dans votre `printf` (par exemple `printf("Entrez un entier : ");` alors que le test attend uniquement le résultat `42\n`).

2. **« Mon programme s'arrête avec le message `Temps limite dépassé (Timeout > 2.8s)` »**
   - Votre programme contient très probablement une **boucle infinie** (ex. vous avez oublié d'incrémenter la variable de boucle dans un `while`, ou la condition d'arrêt n'est jamais atteinte) ou une récursivité sans cas de base. Ouvrez l'onglet **Table de Trace** pour voir sur quelle ligne le programme tourne en boucle.

3. **« Comment donner plusieurs valeurs à `scanf` ou `LIRE` ? »**
   - Dans la boîte **`stdin`**, écrivez toutes les valeurs à l'avance, séparées par un espace ou un retour à la ligne (ex. : `15 42` ou `15` sur la première ligne et `42` sur la seconde ligne), puis cliquez sur **Exécuter**.

4. **« Pourquoi ai-je une alerte `Fuite mémoire : X octets non libérés` ? »**
   - Votre programme C a appelé `malloc(...)` ou `calloc(...)` sur le Tas (*Heap*), mais s'est terminé (`return 0;`) sans appeler `free(pointeur)` sur chaque bloc alloué. Ouvrez l'onglet **Inspecteur Mémoire (Pile & Tas)** pour voir quelle ligne d'allocation n'a pas été libérée.
