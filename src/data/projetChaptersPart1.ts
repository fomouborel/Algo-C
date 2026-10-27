import { Chapter } from '../types/curriculum';
import { cExample } from './projetHelpers';

// ============================================================================
// PARCOURS C — CONCEPTS DU MINI-PROJET SHOPFLOW (C01 à C05)
// Chaque chapitre isole une notion indispensable au projet « ShopFlow —
// Gestion des commandes d'une boutique en ligne » et la relie aux structures
// Date, Adresse, Produit, LigneCommande, Commande, Client et Boutique.
// ============================================================================

export const PROJET_CHAPTERS_PART1: Chapter[] = [
  // ==========================================================================
  // CHAPITRE C01 — PROGRAMMATION MODULAIRE : .h, .c, types.h ET MAKEFILE
  // ==========================================================================
  {
    id: 'C01',
    trackId: 'projet',
    number: 1,
    title: 'Programmation modulaire : fichiers .h, .c et Makefile',
    subtitle: 'Découper ShopFlow en modules (produit, client, commande, statistique, utils, initialisation) sans inclusions circulaires.',
    estimatedMinutes: 50,
    prerequisites: ['B08', 'B13'],
    relatedChapters: ['B02', 'B08', 'C10'],
    coreConcepts: ['module', 'fichier en-tête .h', 'prototype', 'garde d’inclusion', 'types.h', 'Makefile', 'static'],
    successCriteria: [
      'Savoir ce qui doit aller dans un .h (interface) et dans un .c (implémentation)',
      'Écrire une garde d’inclusion #ifndef / #define / #endif',
      'Expliquer pourquoi ShopFlow centralise ses structures dans types.h',
    ],
    lesson: {
      objectives: [
        'Distinguer l’interface publique d’un module (fichier .h) de son implémentation (fichier .c)',
        'Protéger un en-tête contre la double inclusion avec une garde #ifndef',
        'Comprendre comment types.h évite l’inclusion circulaire entre client.h et commande.h',
        'Compiler plusieurs fichiers séparément puis les lier, à la main ou avec un Makefile (gcc -Wall -Wextra)',
        'Rendre une fonction utilitaire privée à son module avec le mot-clé static',
      ],
      intuition: `Le projet ShopFlow fera facilement 1 500 à 2 000 lignes. Tout écrire dans main.c serait comme ranger toute une maison dans une seule pièce : impossible de retrouver quoi que ce soit, et chaque modification risque de casser autre chose.

La programmation modulaire découpe le programme en **modules** spécialisés. Chaque module = **2 fichiers** :
- un fichier **.h** (*header*, en-tête) : ce que le module **propose** aux autres (les prototypes, les constantes) ;
- un fichier **.c** (source) : **comment** il le fait (le corps des fonctions).

Pour ShopFlow, le sujet impose 6 modules : produit, client, commande, statistique, utils, initialisation, plus main.c qui orchestre le tout et un fichier types.h qui contient toutes les structures partagées.

Un autre module qui veut utiliser une fonction écrit simplement \`#include "produit.h"\` : il voit le prototype, le compilateur peut vérifier l’appel, et l’éditeur de liens retrouvera le corps de la fonction dans produit.o.`,
      formalDefinition: `Règles de découpage :
- **Fichier .h** : gardes d’inclusion, #include nécessaires, constantes #define, déclarations de types (typedef struct), **prototypes** de fonctions. Jamais de corps de fonction ni de définition de variable.
- **Fichier .c** : \`#include "son_propre.h"\` en premier, puis les **définitions** des fonctions. Les fonctions internes au module sont déclarées **static** (invisibles depuis les autres fichiers).
- **Garde d’inclusion** :
    #ifndef PRODUIT_H
    #define PRODUIT_H
    ... contenu ...
    #endif
  Si le fichier est inclus deux fois dans la même unité de compilation, la 2e fois le préprocesseur saute tout le contenu.
- **types.h** : client.h a besoin du type Commande et commande.h du type Client. S’ils s’incluaient mutuellement, on obtiendrait une boucle. Solution : toutes les structures dans types.h, que tous les modules incluent.
- **#include "fichier.h"** (guillemets) cherche d’abord dans le dossier du projet ; **#include <stdio.h>** (chevrons) cherche dans les en-têtes du système.
- **Compilation séparée** :
    gcc -Wall -Wextra -c produit.c      → produit.o
    gcc -Wall -Wextra -c main.c         → main.o
    gcc produit.o main.o -o shopflow    → édition de liens
- **Makefile** : décrit les dépendances (shopflow dépend de main.o produit.o … ; produit.o dépend de produit.c produit.h types.h). La commande make ne recompile que ce qui a changé.

Remarque : le bac à sable de cette plateforme compile un seul fichier. Dans les exemples, les modules sont donc simulés par des sections commentées /* ===== produit.h ===== */ dans un même fichier : l’ordre (prototypes d’abord, corps ensuite) est exactement celui que produit le préprocesseur quand il remplace un #include.`,
      analogy: {
        title: 'Le menu et la cuisine d’un restaurant',
        content: `Le fichier .h est le **menu** affiché en salle : il annonce les plats disponibles (les prototypes) sans dire comment ils sont cuisinés. Le fichier .c est la **cuisine** : la recette exacte de chaque plat. Le client (un autre module) n’a besoin que du menu pour commander. Une fonction static, c’est la sauce maison préparée en cuisine qui n’apparaît pas au menu. Et types.h, c’est la liste des ingrédients communs à toutes les cuisines du groupe.`,
      },
      vocabulary: [
        { fr: 'Module', en: 'Module / Compilation unit', definition: 'Couple .h + .c regroupant les fonctions d’une même responsabilité (ex. le catalogue produits).' },
        { fr: 'Fichier d’en-tête', en: 'Header file', definition: 'Fichier .h contenant l’interface publique : types, constantes et prototypes.' },
        { fr: 'Prototype (déclaration)', en: 'Function prototype / declaration', definition: 'Signature d’une fonction terminée par « ; » : type de retour, nom, types des paramètres.' },
        { fr: 'Garde d’inclusion', en: 'Include guard', definition: 'Trio #ifndef X_H / #define X_H / #endif empêchant d’inclure deux fois le même contenu.' },
        { fr: 'Inclusion circulaire', en: 'Circular include', definition: 'Deux en-têtes qui s’incluent mutuellement ; résolu en isolant les types dans types.h.' },
        { fr: 'Fichier objet', en: 'Object file (.o)', definition: 'Résultat de la compilation d’un seul .c, pas encore exécutable.' },
        { fr: 'Édition de liens', en: 'Linking', definition: 'Assemblage de tous les .o en un exécutable ; c’est là qu’on détecte « undefined reference » ou « multiple definition ».' },
        { fr: 'Fonction privée au fichier', en: 'Static function (internal linkage)', definition: 'Fonction déclarée static : visible seulement dans son propre .c.' },
      ],
      simpleExample: cExample(
        'Un module « produit » simulé : prototypes d’abord, corps ensuite',
        'Ce fichier unique reproduit ce que voit le compilateur après l’inclusion de produit.h dans main.c : les prototypes en tête, puis main, puis l’implémentation de produit.c.',
        String.raw`#include <stdio.h>

/* ===== produit.h : interface publique ===== */
float valeurStock(float prixUnitaireHT, int quantiteStock);
int estEnAlerte(int quantiteStock, int seuilAlerte);

/* ===== main.c : utilise le module ===== */
int main(void) {
    float valeur = valeurStock(24.50f, 8);
    printf("Valeur du stock : %.2f EUR\n", valeur);
    if (estEnAlerte(8, 15)) {
        printf("Alerte : reapprovisionner\n");
    }
    return 0;
}

/* ===== produit.c : implementation ===== */
float valeurStock(float prixUnitaireHT, int quantiteStock) {
    return prixUnitaireHT * quantiteStock;
}

int estEnAlerte(int quantiteStock, int seuilAlerte) {
    return quantiteStock <= seuilAlerte;
}`,
        `Valeur du stock : 196.00 EUR
Alerte : reapprovisionner`,
        [
          ['float valeurStock(float prixUnitaireHT, int quantiteStock);', 'Prototype (se termine par ;). C’est tout ce que main.c a besoin de connaître pour appeler la fonction.'],
          ['int estEnAlerte(', 'Deuxième prototype exposé par le module produit.'],
          ['float valeur = valeurStock(24.50f, 8);', 'Grâce au prototype, le compilateur vérifie le nombre et le type des arguments, même si le corps est défini plus bas (ou dans un autre fichier).'],
          ['if (estEnAlerte(8, 15)) {', 'La fonction renvoie 1 (vrai) car 8 ≤ 15 : le produit est sous son seuil d’alerte.'],
          ['float valeurStock(float prixUnitaireHT, int quantiteStock) {', 'Définition (corps) : c’est elle qui irait dans produit.c.'],
          ['return quantiteStock <= seuilAlerte;', 'Une comparaison vaut 1 ou 0 en C : on peut la renvoyer directement.'],
        ]
      ),
      intermediateExample: cExample(
        'types.h, garde d’inclusion, constantes et fonction static',
        'On simule types.h (avec sa garde), le module commande et une fonction privée. La deuxième « inclusion » de types.h est neutralisée par la garde.',
        String.raw`#include <stdio.h>

/* ===== types.h ===== */
#ifndef TYPES_H
#define TYPES_H
#define TAUX_TVA 20.0f
#define FRAIS_PORT 5.90f
typedef struct {
    int numero;
    float montantHT;
} Commande;
#endif

/* ===== 2e inclusion (par commande.h) : ignoree grace a la garde ===== */
#ifndef TYPES_H
#define TYPES_H
typedef struct { int numero; } Commande;
#endif

/* ===== commande.h ===== */
float montantTVA(const Commande *c);

/* ===== commande.c ===== */
static float pourcentage(float montant, float taux) {
    return montant * taux / 100.0f;
}

float montantTVA(const Commande *c) {
    return pourcentage(c->montantHT, TAUX_TVA);
}

/* ===== main.c ===== */
int main(void) {
    Commande c = {1001, 150.00f};
    printf("Commande %d : TVA = %.2f\n", c.numero, montantTVA(&c));
    printf("Port standard = %.2f\n", FRAIS_PORT);
    return 0;
}`,
        `Commande 1001 : TVA = 30.00
Port standard = 5.90`,
        [
          ['#ifndef TYPES_H', 'Si le symbole TYPES_H n’est pas encore défini (première inclusion)…'],
          ['#define TYPES_H', '… on le définit immédiatement, puis on lit le contenu.'],
          ['#define TAUX_TVA 20.0f', 'Constante symbolique : on n’écrit jamais 20 « en dur » au milieu du code.'],
          ['#endif', 'Fin de la zone protégée.'],
          ['#ifndef TYPES_H', 'Deuxième inclusion : TYPES_H existe déjà, tout jusqu’au #endif est sauté. Sans garde, Commande serait défini deux fois → erreur « redefinition ».'],
          ['float montantTVA(const Commande *c);', 'Prototype public du module commande. const promet que la fonction ne modifie pas la commande.'],
          ['static float pourcentage(', 'static : fonction utilitaire privée au fichier commande.c, invisible pour main.c.'],
          ['printf("Commande %d : TVA = %.2f\\n"', '150 × 20 / 100 = 30.00.'],
        ]
      ),
      commonMistakes: [
        {
          title: 'Écrire le corps d’une fonction dans un fichier .h',
          wrongCode: `/* produit.h */
int estEnAlerte(int stock, int seuil) {
    return stock <= seuil;
}
/* inclus par main.c ET produit.c
   -> multiple definition of 'estEnAlerte' */`,
          rightCode: `/* produit.h */
int estEnAlerte(int stock, int seuil);

/* produit.c */
int estEnAlerte(int stock, int seuil) {
    return stock <= seuil;
}`,
          explanation: 'Chaque .c qui inclut le .h recevrait sa propre copie du corps : à l’édition de liens, la fonction existe deux fois. Le .h ne contient que le prototype.',
          errorType: 'compilation',
        },
        {
          title: 'Oublier la garde d’inclusion',
          wrongCode: `/* types.h sans garde */
typedef struct { int jour, mois, annee; } Date;
/* client.h et commande.h incluent types.h
   -> error: conflicting types for 'Date' */`,
          rightCode: `#ifndef TYPES_H
#define TYPES_H
typedef struct { int jour, mois, annee; } Date;
#endif`,
          explanation: 'main.c inclut client.h et commande.h, qui incluent tous deux types.h : sans garde, la structure est déclarée deux fois dans la même unité de compilation.',
          errorType: 'compilation',
        },
        {
          title: 'Inclusion circulaire entre client.h et commande.h',
          wrongCode: `/* client.h */
#include "commande.h"   /* besoin de Commande */
/* commande.h */
#include "client.h"     /* besoin de Client */`,
          rightCode: `/* types.h : Date, Adresse, Produit, LigneCommande,
   Commande, Client, Boutique */
/* client.h */   #include "types.h"
/* commande.h */ #include "types.h"`,
          explanation: 'Avec des gardes, l’un des deux fichiers sera lu en premier et utilisera un type pas encore déclaré (« unknown type name »). Le sujet impose types.h exactement pour casser ce cycle.',
          errorType: 'compilation',
        },
      ],
      summary: [
        '.h = interface (types, constantes, prototypes) ; .c = implémentation (corps des fonctions).',
        'Toujours une garde #ifndef X_H / #define X_H / #endif dans chaque .h.',
        'types.h regroupe les 7 structures de ShopFlow et est inclus par tous les modules.',
        'Un .c inclut d’abord son propre .h ; les fonctions internes sont static.',
        'Compiler avec gcc -Wall -Wextra : le sujet exige zéro avertissement.',
        'Un Makefile recompile uniquement les fichiers modifiés.',
      ],
      comprehensionQuestions: [
        {
          id: 'C01_Q1',
          question: 'Que doit contenir le fichier produit.h de ShopFlow ?',
          options: [
            'Le corps de toutes les fonctions du catalogue',
            'Les prototypes des fonctions du catalogue, protégés par une garde d’inclusion',
            'La fonction main',
            'Les données de démonstration des 8 produits',
          ],
          correctIndex: 1,
          explanation: 'Le .h expose l’interface : prototypes (et éventuellement constantes). Les corps vont dans produit.c, les données de test dans initialisation.c.',
        },
        {
          id: 'C01_Q2',
          question: 'Pourquoi le sujet demande-t-il un fichier types.h ?',
          options: [
            'Pour accélérer l’exécution',
            'Parce que gcc refuse plus de 5 fichiers .h',
            'Pour déclarer une seule fois les structures partagées et éviter l’inclusion circulaire client.h ↔ commande.h',
            'Pour y mettre la fonction main',
          ],
          correctIndex: 2,
          explanation: 'Client contient un tableau de Commande, et les fonctions de commande manipulent des Client : centraliser les types casse la dépendance mutuelle.',
        },
        {
          id: 'C01_Q3',
          question: 'Quel message obtient-on à l’édition de liens si une fonction est déclarée (prototype) mais jamais définie ?',
          options: [
            'undefined reference to ‘fonction’',
            'multiple definition of ‘fonction’',
            'expected ‘;’ before ‘}’',
            'segmentation fault',
          ],
          correctIndex: 0,
          explanation: 'Le compilateur accepte l’appel grâce au prototype, mais l’éditeur de liens ne trouve aucun .o contenant le corps : « undefined reference ».',
        },
      ],
    },
    exercises: [
      {
        id: 'C01_E1',
        chapterId: 'C01',
        trackId: 'projet',
        title: 'Ranger chaque élément dans le bon fichier',
        difficulty: 'debutant',
        category: 'qcm',
        testedSkill: 'Répartir déclarations et définitions entre .h et .c',
        prerequisites: ['B08'],
        statement: `Dans ShopFlow, où faut-il écrire la ligne suivante ?

    int rechercherProduit(const Boutique *b, const char *reference);`,
        isCoreValidationExercise: true,
        options: [
          'Dans types.h, car elle mentionne le type Boutique',
          'Dans produit.h : c’est un prototype de fonction du module catalogue',
          'Dans produit.c uniquement, juste avant le corps de la fonction',
          'Dans main.c, avant la fonction main',
        ],
        correctOptionIndex: 1,
        hints: [
          'Cette ligne se termine par un point-virgule : est-ce une déclaration ou une définition ?',
          'Les autres modules (commande.c, main.c) doivent pouvoir appeler cette fonction.',
          'Les prototypes publics d’un module vont dans son en-tête, ici celui du catalogue produits.',
        ],
        detailedExplanation: 'C’est un prototype (pas de corps, se termine par ;). Il appartient à l’interface du module catalogue, donc à produit.h. types.h ne contient que les structures et constantes partagées ; produit.c contiendra le corps de la fonction.',
      },
      {
        id: 'C01_E2',
        chapterId: 'C01',
        trackId: 'projet',
        title: 'Reconstituer l’en-tête commande.h',
        difficulty: 'debutant',
        category: 'ordering',
        testedSkill: 'Structure canonique d’un fichier d’en-tête avec garde d’inclusion',
        prerequisites: ['C01'],
        statement: 'Remettez les lignes de commande.h dans l’ordre correct : garde d’inclusion, inclusion de types.h, prototypes, fin de garde.',
        isCoreValidationExercise: true,
        scrambledLines: [
          'int ajouterLigne(Commande *c, const Produit *p, int quantite);',
          '#endif',
          '#define COMMANDE_H',
          '#include "types.h"',
          '#ifndef COMMANDE_H',
          'void calculerCommande(Commande *c);',
        ],
        correctOrderIndices: [4, 2, 3, 0, 5, 1],
        hints: [
          'La toute première ligne teste si le symbole COMMANDE_H existe déjà.',
          'Juste après le test, on définit ce symbole, puis on inclut les types dont les prototypes ont besoin.',
          'Ordre : #ifndef, #define, #include "types.h", les deux prototypes, puis #endif tout à la fin.',
        ],
        detailedExplanation: `#ifndef COMMANDE_H
#define COMMANDE_H
#include "types.h"
int ajouterLigne(Commande *c, const Produit *p, int quantite);
void calculerCommande(Commande *c);
#endif
L’inclusion de types.h doit précéder les prototypes, qui utilisent Commande et Produit.`,
      },
      {
        id: 'C01_E3',
        chapterId: 'C01',
        trackId: 'projet',
        title: 'Écrire le module « produit » : prototypes et implémentation',
        difficulty: 'intermediaire',
        category: 'c_code',
        testedSkill: 'Séparer prototypes et définitions ; appeler les fonctions d’un module',
        prerequisites: ['C01'],
        statement: `Complétez le module produit simulé :
1. Dans la section produit.h, écrivez les prototypes de \`float valeurStock(float prix, int stock)\` et \`int estEnAlerte(int stock, int seuil)\`.
2. Dans la section produit.c, écrivez leurs corps : valeurStock renvoie prix × stock ; estEnAlerte renvoie 1 si stock ≤ seuil, 0 sinon.
Le main (déjà écrit) lit le prix, le stock et le seuil, puis affiche la valeur du stock avec 2 décimales et « ALERTE » ou « OK ».`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>

/* ===== produit.h ===== */
/* TODO : les deux prototypes */

/* ===== main.c ===== */
int main(void) {
    float prix = 0.0f;
    int stock = 0, seuil = 0;
    scanf("%f %d %d", &prix, &stock, &seuil);
    printf("Valeur : %.2f\n", valeurStock(prix, stock));
    if (estEnAlerte(stock, seuil)) {
        printf("ALERTE\n");
    } else {
        printf("OK\n");
    }
    return 0;
}

/* ===== produit.c ===== */
/* TODO : les deux definitions */
`,
        referenceSolution: String.raw`#include <stdio.h>

/* ===== produit.h ===== */
float valeurStock(float prix, int stock);
int estEnAlerte(int stock, int seuil);

/* ===== main.c ===== */
int main(void) {
    float prix = 0.0f;
    int stock = 0, seuil = 0;
    scanf("%f %d %d", &prix, &stock, &seuil);
    printf("Valeur : %.2f\n", valeurStock(prix, stock));
    if (estEnAlerte(stock, seuil)) {
        printf("ALERTE\n");
    } else {
        printf("OK\n");
    }
    return 0;
}

/* ===== produit.c ===== */
float valeurStock(float prix, int stock) {
    return prix * stock;
}

int estEnAlerte(int stock, int seuil) {
    return stock <= seuil;
}
`,
        testCases: [
          { id: 't1', label: 'Clavier : 79.90 × 42, seuil 10', category: 'normal', stdin: '79.90 42 10\n', expectedStdout: 'Valeur : 3355.80\nOK', explanation: 'Stock largement au-dessus du seuil.' },
          { id: 't2', label: 'Souris : 24.50 × 8, seuil 15', category: 'normal', stdin: '24.50 8 15\n', expectedStdout: 'Valeur : 196.00\nALERTE', explanation: '8 ≤ 15 : produit en alerte.' },
          { id: 't3', label: 'Stock égal au seuil', category: 'limite', stdin: '9.90 30 30\n', expectedStdout: 'Valeur : 297.00\nALERTE', explanation: 'Le sujet dit « inférieur ou égal » au seuil : l’égalité déclenche l’alerte.' },
          { id: 't4', label: 'Stock nul', category: 'limite', stdin: '49.90 0 10\n', expectedStdout: 'Valeur : 0.00\nALERTE', explanation: 'Un stock vide vaut 0 et est évidemment en alerte.' },
        ],
        hints: [
          'Un prototype est la première ligne de la fonction suivie d’un point-virgule.',
          'valeurStock : return prix * stock;',
          'estEnAlerte : return stock <= seuil; (une comparaison vaut déjà 0 ou 1).',
        ],
        detailedExplanation: 'Les prototypes placés avant main permettent d’appeler des fonctions définies plus bas — exactement ce qui se passe quand main.c inclut produit.h et que les corps sont compilés à part dans produit.c. Attention au cas limite : « stock inférieur ou égal au seuil » s’écrit <=.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE C02 — STRUCTURES IMBRIQUÉES ET COMPOSITION
  // ==========================================================================
  {
    id: 'C02',
    trackId: 'projet',
    number: 2,
    title: 'Structures imbriquées et composition (Date, Adresse)',
    subtitle: 'Une Commande contient une Date, un Client contient une Adresse : accès en chaîne, copie et validation.',
    estimatedMinutes: 50,
    prerequisites: ['B13', 'C01'],
    relatedChapters: ['B13', 'C03'],
    coreConcepts: ['struct imbriquée', 'composition', 'opérateurs . et ->', 'copie de structure', 'littéral composé', 'année bissextile'],
    successCriteria: [
      'Déclarer et initialiser une structure contenant une autre structure',
      'Accéder à un champ imbriqué par c.adresse.ville et par p->adresse.ville',
      'Expliquer pourquoi une copie de structure fige un instantané de l’adresse',
      'Valider une Date (jours par mois, années bissextiles)',
    ],
    lesson: {
      objectives: [
        'Modéliser une relation de composition : un Client « possède » une Adresse, une Commande « possède » une Date',
        'Enchaîner les opérateurs . et -> pour atteindre un champ imbriqué',
        'Initialiser une structure imbriquée avec des accolades imbriquées ou un littéral composé (Date){12, 3, 2026}',
        'Comprendre que l’affectation d’une structure copie tous ses octets (y compris les tableaux char[])',
        'Écrire les fonctions de validation estBissextile et estDateValide',
      ],
      intuition: `Dans ShopFlow, certaines informations n’ont pas de sens seules : une rue sans ville, un jour sans mois. On les regroupe dans de petites structures (Date, Adresse) que l’on **place à l’intérieur** de structures plus grandes. C’est la **composition** : l’Adresse fait partie du Client, elle naît et meurt avec lui.

Pour y accéder, on enchaîne les points : \`client.adresse.ville\`. Si on manipule un pointeur vers le client, la première flèche remplace le premier point : \`pc->adresse.ville\` (pc est un pointeur, mais adresse est une vraie structure, pas un pointeur).

Point clé du sujet : quand on crée une commande, on **recopie** l’adresse du client dans \`commande.adresseLivraison\`. Si le client déménage ensuite, l’ancienne commande garde l’adresse où elle a réellement été livrée. Une simple affectation \`cmd.adresseLivraison = client.adresse;\` suffit, car affecter une structure copie tout son contenu.`,
      formalDefinition: `- **Déclaration** : un champ peut être de n’importe quel type déjà déclaré, y compris une structure :
    typedef struct { int jour; int mois; int annee; } Date;
    typedef struct { int numero; Date dateCommande; } Commande;
  Date doit être déclarée **avant** Commande.
- **Accès** : variable.champ.sousChamp ; pointeur->champ.sousChamp ; (*pointeur).champ.sousChamp est équivalent.
- **Initialisation** : accolades imbriquées dans l’ordre des champs :
    Commande c = {1001, {12, 3, 2026}};
  ou, en C99, littéral composé pour affecter après coup :
    c.dateCommande = (Date){12, 3, 2026};
- **Affectation / passage par valeur** : copie **membre à membre** de tous les octets. Les tableaux char[] internes sont recopiés ; un pointeur interne, lui, n’est copié qu’en tant qu’adresse (voir C05).
- **Comparaison** : == est interdit entre structures ; on compare champ par champ.
- **Validation de Date** (contraintes du sujet : 1 ≤ mois ≤ 12, 2000 ≤ annee ≤ 2100, jour valide selon le mois) :
    bissextile ⇔ (annee % 4 == 0 && annee % 100 != 0) || annee % 400 == 0
    jours par mois : 31 sauf avril, juin, septembre, novembre (30) et février (28 ou 29).`,
      analogy: {
        title: 'Les poupées russes et la photocopie',
        content: `Une structure imbriquée est une poupée russe : la poupée Client contient la poupée Adresse, qui contient les chaînes rue, ville, codePostal, pays. Pour atteindre la plus petite, on ouvre les poupées une à une avec des points.
Recopier l’adresse dans la commande, c’est faire une **photocopie** du formulaire d’adresse et l’agrafer au bon de commande : si le client corrige son formulaire original plus tard, la photocopie agrafée ne change pas.`,
      },
      vocabulary: [
        { fr: 'Structure imbriquée', en: 'Nested struct', definition: 'Structure dont un champ est lui-même une structure.' },
        { fr: 'Composition', en: 'Composition', definition: 'Relation « fait partie de » : la sous-structure est stockée à l’intérieur et partage la durée de vie du tout.' },
        { fr: 'Opérateur point', en: 'Member access operator (.)', definition: 'Accède à un champ d’une variable structure.' },
        { fr: 'Opérateur flèche', en: 'Arrow operator (->)', definition: 'Accède à un champ via un pointeur : p->x équivaut à (*p).x.' },
        { fr: 'Littéral composé', en: 'Compound literal', definition: 'Valeur de structure anonyme écrite (Type){...} (C99).' },
        { fr: 'Copie membre à membre', en: 'Memberwise copy', definition: 'Ce que fait l’affectation de structures : chaque octet est recopié.' },
        { fr: 'Année bissextile', en: 'Leap year', definition: 'Année de 366 jours : divisible par 4 mais pas par 100, ou divisible par 400.' },
      ],
      simpleExample: cExample(
        'Fiche client : un Client composé d’une Adresse',
        'Initialisation avec accolades imbriquées, accès par . puis par -> avec un pointeur.',
        String.raw`#include <stdio.h>

typedef struct {
    char rue[80];
    char ville[50];
    char codePostal[6];
    char pays[50];
} Adresse;

typedef struct {
    int idClient;
    char nom[50];
    char prenom[50];
    Adresse adresse;
} Client;

void afficherFiche(const Client *pc) {
    printf("#%d %s %s\n", pc->idClient, pc->prenom, pc->nom);
    printf("%s, %s %s (%s)\n", pc->adresse.rue, pc->adresse.codePostal,
           pc->adresse.ville, pc->adresse.pays);
}

int main(void) {
    Client julie = {3, "Bernard", "Julie",
                    {"12 rue de la Paix", "Paris", "75002", "France"}};
    printf("Ville : %s\n", julie.adresse.ville);
    afficherFiche(&julie);
    return 0;
}`,
        `Ville : Paris
#3 Julie Bernard
12 rue de la Paix, 75002 Paris (France)`,
        [
          ['typedef struct {', 'Adresse est déclarée en premier : Client en a besoin.'],
          ['char codePostal[6];', '5 chiffres + 1 case pour le caractère de fin \'\\0\'.'],
          ['Adresse adresse;', 'Composition : une vraie Adresse (pas un pointeur) est stockée dans chaque Client.'],
          ['void afficherFiche(const Client *pc) {', 'On passe l’adresse du client (pas de copie) ; const interdit de le modifier.'],
          ['pc->adresse.rue', 'Flèche car pc est un pointeur, puis point car adresse est une structure.'],
          ['{"12 rue de la Paix", "Paris", "75002", "France"}};', 'Accolades internes = initialisation du champ adresse, dans l’ordre des champs.'],
          ['julie.adresse.ville', 'julie est une variable : deux points successifs.'],
        ]
      ),
      intermediateExample: cExample(
        'Instantané de l’adresse de livraison et littéral composé',
        'À la création de la commande, l’adresse du client est recopiée. Le client déménage ensuite : la commande conserve l’adresse d’origine.',
        String.raw`#include <stdio.h>
#include <string.h>

typedef struct { int jour; int mois; int annee; } Date;
typedef struct { char rue[80]; char ville[50]; } Adresse;
typedef struct { int idClient; Adresse adresse; } Client;
typedef struct {
    int numero;
    int idClient;
    Date dateCommande;
    Adresse adresseLivraison;
} Commande;

int main(void) {
    Client cl = {1, {"5 avenue Foch", "Lyon"}};
    Commande cmd;
    cmd.numero = 1001;
    cmd.idClient = cl.idClient;
    cmd.dateCommande = (Date){12, 3, 2026};
    cmd.adresseLivraison = cl.adresse;

    strcpy(cl.adresse.rue, "8 quai Rambaud");

    printf("Client   : %s, %s\n", cl.adresse.rue, cl.adresse.ville);
    printf("Commande %d du %02d/%02d/%d livree a : %s, %s\n",
           cmd.numero, cmd.dateCommande.jour, cmd.dateCommande.mois,
           cmd.dateCommande.annee, cmd.adresseLivraison.rue,
           cmd.adresseLivraison.ville);
    return 0;
}`,
        `Client   : 8 quai Rambaud, Lyon
Commande 1001 du 12/03/2026 livree a : 5 avenue Foch, Lyon`,
        [
          ['Date dateCommande;', 'Composition : la date fait partie de la commande.'],
          ['cmd.idClient = cl.idClient;', 'Association : la commande ne contient pas le client, seulement son identifiant.'],
          ['cmd.dateCommande = (Date){12, 3, 2026};', 'Littéral composé C99 : une Date anonyme construite puis copiée dans le champ.'],
          ['cmd.adresseLivraison = cl.adresse;', 'Affectation de structure : les 130 octets de l’adresse sont recopiés (rue et ville comprises).'],
          ['strcpy(cl.adresse.rue, "8 quai Rambaud");', 'Le client déménage : seule SA copie change.'],
          ['%02d/%02d/%d', '%02d complète avec un zéro à gauche : 3 devient 03.'],
        ]
      ),
      commonMistakes: [
        {
          title: 'Utiliser une flèche sur la structure interne',
          wrongCode: `Client *pc = &julie;
printf("%s", pc->adresse->ville);`,
          rightCode: `Client *pc = &julie;
printf("%s", pc->adresse.ville);`,
          explanation: 'adresse n’est pas un pointeur mais une structure stockée dans le client : seule la première étape (pc) utilise ->.',
          errorType: 'compilation',
        },
        {
          title: 'Comparer deux structures avec ==',
          wrongCode: `if (d1 == d2) { ... }   /* error: invalid operands */`,
          rightCode: `if (d1.jour == d2.jour && d1.mois == d2.mois
    && d1.annee == d2.annee) { ... }`,
          explanation: 'Le C ne définit pas == pour les structures. Écrivez une fonction memeDate(Date a, Date b) qui compare champ par champ.',
          errorType: 'compilation',
        },
        {
          title: 'Oublier le cas de février dans la validation de date',
          wrongCode: `int estDateValide(Date d) {
    return d.jour >= 1 && d.jour <= 31
        && d.mois >= 1 && d.mois <= 12;
}  /* accepte le 31/02/2026 ! */`,
          rightCode: `int estDateValide(Date d) {
    if (d.mois < 1 || d.mois > 12) return 0;
    if (d.annee < 2000 || d.annee > 2100) return 0;
    return d.jour >= 1
        && d.jour <= joursDansMois(d.mois, d.annee);
}`,
          explanation: 'Le sujet exige un jour « validé selon le mois » avec gestion des années bissextiles : on calcule le nombre de jours du mois.',
          errorType: 'logique',
        },
      ],
      summary: [
        'Composition = une structure placée à l’intérieur d’une autre (Date dans Commande, Adresse dans Client).',
        'Accès en chaîne : var.a.b ou ptr->a.b (flèche seulement pour le pointeur).',
        'Déclarer les petites structures avant celles qui les contiennent (ou tout mettre dans types.h dans le bon ordre).',
        'L’affectation de structure copie tout : c’est ainsi qu’on fige l’adresse de livraison.',
        'Pas de == entre structures : comparer champ par champ.',
        'Bissextile : (a % 4 == 0 && a % 100 != 0) || a % 400 == 0.',
      ],
      comprehensionQuestions: [
        {
          id: 'C02_Q1',
          question: 'Avec `Commande *pc`, comment lire le mois de la date de commande ?',
          options: ['pc.dateCommande.mois', 'pc->dateCommande->mois', 'pc->dateCommande.mois', '*pc.dateCommande.mois'],
          correctIndex: 2,
          explanation: 'pc est un pointeur (→ flèche), dateCommande est une structure (→ point).',
        },
        {
          id: 'C02_Q2',
          question: 'Après `cmd.adresseLivraison = client.adresse;` puis une modification de `client.adresse.ville`, que vaut `cmd.adresseLivraison.ville` ?',
          options: [
            'La nouvelle ville, car les deux partagent la même mémoire',
            'L’ancienne ville : l’affectation a copié les caractères',
            'Une chaîne vide',
            'Le programme ne compile pas : il faut strcpy pour copier une structure',
          ],
          correctIndex: 1,
          explanation: 'Les tableaux char[] internes sont copiés octet par octet : la commande possède sa propre copie.',
        },
        {
          id: 'C02_Q3',
          question: 'L’année 2100 est-elle bissextile ?',
          options: ['Oui, car divisible par 4', 'Non, car divisible par 100 sans l’être par 400', 'Oui, car divisible par 100', 'On ne peut pas savoir'],
          correctIndex: 1,
          explanation: '2100 % 100 == 0 et 2100 % 400 != 0 : ce n’est pas une année bissextile (février a 28 jours). 2000, elle, l’était.',
        },
      ],
    },
    exercises: [
      {
        id: 'C02_E1',
        chapterId: 'C02',
        trackId: 'projet',
        title: 'Prédire l’effet d’une copie de structure',
        difficulty: 'debutant',
        category: 'prediction',
        testedSkill: 'Copie membre à membre d’une structure imbriquée',
        prerequisites: ['C02'],
        statement: 'Quelle est la sortie exacte de ce programme ?',
        isCoreValidationExercise: true,
        codeSnippet: String.raw`#include <stdio.h>
#include <string.h>

typedef struct { char ville[50]; char codePostal[6]; } Adresse;
typedef struct { int id; Adresse adresse; } Client;

int main(void) {
    Client a = {1, {"Paris", "75002"}};
    Client b = a;
    strcpy(b.adresse.ville, "Nantes");
    b.id = 2;
    printf("%d %s\n", a.id, a.adresse.ville);
    printf("%d %s\n", b.id, b.adresse.ville);
    return 0;
}`,
        expectedOutputAnswer: '1 Paris\n2 Nantes',
        hints: [
          'Client b = a; crée une deuxième variable indépendante.',
          'Le tableau ville fait partie de la structure : il est recopié, pas partagé.',
          'Modifier b ne touche pas a.',
        ],
        detailedExplanation: 'b est une copie complète de a, tableau ville compris. Les modifications de b (id = 2, ville = Nantes) laissent a intact : « 1 Paris » puis « 2 Nantes ».',
      },
      {
        id: 'C02_E2',
        chapterId: 'C02',
        trackId: 'projet',
        title: 'Compléter les accès aux champs imbriqués',
        difficulty: 'debutant',
        category: 'completion',
        testedSkill: 'Choisir entre . et -> dans une chaîne d’accès',
        prerequisites: ['C02'],
        statement: 'Complétez les trous pour que la fonction affiche la ville de livraison et l’année de la commande pointée par pc.',
        isCoreValidationExercise: true,
        templateWithGaps: String.raw`void afficherResume(const Commande *pc) {
    printf("Livraison : %s\n", pc{{GAP_1}}adresseLivraison{{GAP_2}}ville);
    printf("Annee : %d\n", {{GAP_3}}.annee);
}`,
        gaps: [
          { id: 'GAP_1', placeholder: 'opérateur', acceptedAnswers: ['->'], explanation: 'pc est un pointeur vers Commande : on utilise ->.' },
          { id: 'GAP_2', placeholder: 'opérateur', acceptedAnswers: ['.'], explanation: 'adresseLivraison est une structure Adresse, pas un pointeur : on utilise un point.' },
          { id: 'GAP_3', placeholder: 'expression', acceptedAnswers: ['pc->dateCommande', '(*pc).dateCommande'], explanation: 'On atteint d’abord la Date de la commande via le pointeur.' },
        ],
        hints: [
          'Quel est le type de pc ? Celui de adresseLivraison ?',
          'La flèche ne s’utilise qu’à gauche d’un champ atteint depuis un pointeur.',
          'La date s’appelle dateCommande dans la structure Commande.',
        ],
        detailedExplanation: 'pc->adresseLivraison.ville et pc->dateCommande.annee : flèche pour le pointeur, puis point pour les structures internes. (*pc).dateCommande est équivalent mais moins lisible.',
      },
      {
        id: 'C02_E3',
        chapterId: 'C02',
        trackId: 'projet',
        title: 'Valider la Date d’une commande (années bissextiles)',
        difficulty: 'intermediaire',
        category: 'c_code',
        testedSkill: 'Fonctions de validation sur une structure Date',
        prerequisites: ['C02'],
        statement: `Écrivez trois fonctions :
- \`int estBissextile(int annee)\` ;
- \`int joursDansMois(int mois, int annee)\` (28/29 pour février, 30 pour avril, juin, septembre, novembre, 31 sinon) ;
- \`int estDateValide(Date d)\` qui applique les contraintes du sujet : 1 ≤ mois ≤ 12, 2000 ≤ annee ≤ 2100, 1 ≤ jour ≤ joursDansMois.
Le main lit une date « jour mois annee » et affiche « VALIDE » ou « INVALIDE ».`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>

typedef struct { int jour; int mois; int annee; } Date;

int estBissextile(int annee) {
    /* TODO */
    return 0;
}

int joursDansMois(int mois, int annee) {
    /* TODO */
    return 31;
}

int estDateValide(Date d) {
    /* TODO */
    return 1;
}

int main(void) {
    Date d;
    scanf("%d %d %d", &d.jour, &d.mois, &d.annee);
    if (estDateValide(d)) {
        printf("VALIDE\n");
    } else {
        printf("INVALIDE\n");
    }
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>

typedef struct { int jour; int mois; int annee; } Date;

int estBissextile(int annee) {
    return (annee % 4 == 0 && annee % 100 != 0) || annee % 400 == 0;
}

int joursDansMois(int mois, int annee) {
    if (mois == 2) {
        return estBissextile(annee) ? 29 : 28;
    }
    if (mois == 4 || mois == 6 || mois == 9 || mois == 11) {
        return 30;
    }
    return 31;
}

int estDateValide(Date d) {
    if (d.mois < 1 || d.mois > 12) return 0;
    if (d.annee < 2000 || d.annee > 2100) return 0;
    return d.jour >= 1 && d.jour <= joursDansMois(d.mois, d.annee);
}

int main(void) {
    Date d;
    scanf("%d %d %d", &d.jour, &d.mois, &d.annee);
    if (estDateValide(d)) {
        printf("VALIDE\n");
    } else {
        printf("INVALIDE\n");
    }
    return 0;
}
`,
        testCases: [
          { id: 't1', label: '12/03/2026', category: 'normal', stdin: '12 3 2026\n', expectedStdout: 'VALIDE', explanation: 'Date ordinaire.' },
          { id: 't2', label: '29/02/2024 (bissextile)', category: 'limite', stdin: '29 2 2024\n', expectedStdout: 'VALIDE', explanation: '2024 est divisible par 4 et pas par 100.' },
          { id: 't3', label: '29/02/2026', category: 'invalide', stdin: '29 2 2026\n', expectedStdout: 'INVALIDE', explanation: '2026 n’est pas bissextile.' },
          { id: 't4', label: '29/02/2100', category: 'limite', stdin: '29 2 2100\n', expectedStdout: 'INVALIDE', explanation: '2100 est divisible par 100 mais pas par 400.' },
          { id: 't5', label: '29/02/2000', category: 'limite', stdin: '29 2 2000\n', expectedStdout: 'VALIDE', explanation: '2000 est divisible par 400.' },
          { id: 't6', label: '31/04/2026', category: 'invalide', stdin: '31 4 2026\n', expectedStdout: 'INVALIDE', explanation: 'Avril n’a que 30 jours.' },
          { id: 't7', label: 'Mois 13', category: 'invalide', stdin: '10 13 2026\n', expectedStdout: 'INVALIDE', explanation: 'Mois hors de [1, 12].' },
          { id: 't8', label: 'Année 1999', category: 'invalide', stdin: '1 1 1999\n', expectedStdout: 'INVALIDE', explanation: 'Le sujet impose 2000 ≤ annee ≤ 2100.' },
          { id: 't9', label: 'Jour 0', category: 'invalide', stdin: '0 5 2026\n', expectedStdout: 'INVALIDE', explanation: 'Un jour commence à 1.' },
        ],
        hints: [
          'Bissextile : (annee % 4 == 0 && annee % 100 != 0) || annee % 400 == 0.',
          'Dans joursDansMois, traitez février en premier, puis les 4 mois de 30 jours.',
          'Dans estDateValide, testez le mois AVANT d’appeler joursDansMois, et n’oubliez pas les bornes de l’année.',
        ],
        detailedExplanation: 'On vérifie d’abord le mois et l’année (sinon joursDansMois serait appelé avec un mois absurde), puis on borne le jour par le nombre de jours du mois. Les cas 2000 (bissextile) et 2100 (non bissextile) sont exactement les bornes de l’intervalle imposé par le sujet : ce sont des cas de test incontournables.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE C03 — SAISIE SÉCURISÉE ET VALIDATION DES CHAÎNES
  // ==========================================================================
  {
    id: 'C03',
    trackId: 'projet',
    number: 3,
    title: 'Saisie sécurisée et validation des chaînes',
    subtitle: 'fgets, nettoyage du \\n, strcmp, strncpy, strstr : saisir et contrôler noms, emails, codes postaux et téléphones.',
    estimatedMinutes: 55,
    prerequisites: ['B11', 'C02'],
    relatedChapters: ['B05', 'B11', 'C08'],
    coreConcepts: ['fgets', 'strcspn', 'strcmp', 'strncpy', 'strstr', 'strchr', 'isdigit', 'validation'],
    successCriteria: [
      'Lire une ligne complète (avec espaces) sans débordement',
      'Écrire des fonctions de validation qui renvoient 1 ou 0',
      'Comparer et rechercher des chaînes avec les fonctions de <string.h>',
    ],
    lesson: {
      objectives: [
        'Lire une ligne avec fgets et retirer le \\n final avec strcspn',
        'Comprendre pourquoi scanf("%s") est dangereux pour « 12 rue de la Paix »',
        'Copier une chaîne dans un champ de taille fixe avec strncpy sans oublier le \\0',
        'Écrire les validations de ShopFlow : champ non vide, code postal à 5 chiffres, téléphone à 10 chiffres, email contenant « @ »',
        'Rechercher un mot-clé dans une désignation avec strstr',
      ],
      intuition: `Le sujet exige une « saisie sécurisée » et une « validation des saisies utilisateur ». Deux problèmes classiques :
1. **Déborder** : si l’utilisateur tape 100 caractères dans un champ char nom[50], scanf("%s") écrit au-delà du tableau et écrase la mémoire voisine.
2. **Les espaces** : scanf("%s") s’arrête au premier espace. « 12 rue de la Paix » deviendrait « 12 ».

La solution : **fgets(buffer, taille, stdin)** lit une ligne entière, espaces compris, sans jamais dépasser taille - 1 caractères. Elle garde le \\n final qu’on supprime ensuite.

Ensuite on **valide** : chaque règle du sujet devient une petite fonction qui renvoie 1 (valide) ou 0 (invalide). Le module utils.c regroupe ces fonctions, et les modules produit/client les appellent en boucle tant que la saisie est incorrecte.`,
      formalDefinition: `- **fgets(buf, n, stdin)** : lit au plus n - 1 caractères, s’arrête après un \\n (qu’elle conserve), ajoute \\0. Renvoie NULL en fin d’entrée.
- **Retirer le \\n** : buf[strcspn(buf, "\\n")] = '\\0';  (strcspn renvoie l’indice du premier \\n, ou la longueur s’il n’y en a pas).
- **Mélange scanf / fgets** : après scanf("%d", &x), le \\n tapé reste dans le tampon et le fgets suivant lit une ligne vide. On lit donc tout en fgets puis on convertit avec sscanf(buf, "%d", &x), ou on vide le tampon : while ((c = getchar()) != '\\n' && c != EOF) {}.
- **Comparer** : strcmp(a, b) renvoie 0 si identiques, < 0 si a avant b, > 0 sinon. Jamais a == b (compare les adresses).
- **Copier dans un champ fixe** : strncpy(dest, src, TAILLE - 1); dest[TAILLE - 1] = '\\0';  (strncpy n’ajoute pas \\0 si src est trop longue).
- **Rechercher** : strchr(s, '@') renvoie un pointeur sur le premier '@' ou NULL ; strstr(s, "meca") renvoie un pointeur sur la première occurrence ou NULL.
- **Caractères** (<ctype.h>) : isdigit(c), isalpha(c), tolower(c), toupper(c).
- **Validations du sujet** : rue/ville/pays/nom non vides ; codePostal = exactement 5 chiffres ; telephone = exactement 10 chiffres ; email contient « @ » (et doit être unique, voir C08).`,
      analogy: {
        title: 'Le guichet avec un formulaire à cases',
        content: `fgets est un guichetier qui découpe le formulaire à la bonne taille : si vous écrivez trop long, il coupe proprement au lieu de déborder sur le formulaire voisin (scanf("%s"), lui, écrirait sur le bureau du collègue). Les fonctions de validation sont le contrôle du formulaire : « code postal : 5 chiffres exactement, sinon recommencez ».`,
      },
      vocabulary: [
        { fr: 'Débordement de tampon', en: 'Buffer overflow', definition: 'Écriture au-delà de la fin d’un tableau ; comportement indéfini.' },
        { fr: 'Tampon d’entrée', en: 'Input buffer', definition: 'Zone où s’accumulent les caractères tapés, y compris le \\n, avant d’être lus.' },
        { fr: 'Caractère de fin de chaîne', en: 'Null terminator', definition: '\\0, marque la fin d’une chaîne C.' },
        { fr: 'Comparaison lexicographique', en: 'Lexicographic comparison', definition: 'Ordre « du dictionnaire » calculé par strcmp.' },
        { fr: 'Sous-chaîne', en: 'Substring', definition: 'Suite de caractères contenue dans une autre chaîne (recherchée par strstr).' },
        { fr: 'Saisie défensive', en: 'Defensive input handling', definition: 'Ne jamais faire confiance à l’utilisateur : vérifier chaque valeur avant de l’utiliser.' },
      ],
      simpleExample: cExample(
        'Lire une adresse complète avec fgets',
        'fgets accepte les espaces ; strcspn retire le \\n ; on refuse une saisie vide.',
        String.raw`#include <stdio.h>
#include <string.h>

int main(void) {
    char rue[80];
    if (fgets(rue, sizeof(rue), stdin) == NULL) {
        return 1;
    }
    rue[strcspn(rue, "\n")] = '\0';
    if (strlen(rue) == 0) {
        printf("Rue vide : saisie refusee\n");
    } else {
        printf("Rue : [%s] (%d caracteres)\n", rue, (int)strlen(rue));
    }
    return 0;
}`,
        `Rue : [12 rue de la Paix] (17 caracteres)`,
        [
          ['char rue[80];', 'Taille du sujet : 79 caractères utiles + \\0.'],
          ['if (fgets(rue, sizeof(rue), stdin) == NULL) {', 'Lit au plus 79 caractères ; NULL signifie qu’il n’y avait plus rien à lire.'],
          ['rue[strcspn(rue, "\\n")] = \'\\0\';', 'Remplace le \\n final par la fin de chaîne. Sans cela, [12 rue de la Paix\\n] contiendrait un retour à la ligne.'],
          ['if (strlen(rue) == 0) {', 'Règle du sujet : « non vide ».'],
          ['printf("Rue : [%s] (%d caracteres)\\n"', 'Les crochets montrent qu’il ne reste ni espace parasite ni \\n.'],
        ],
        '12 rue de la Paix\n'
      ),
      intermediateExample: cExample(
        'Bibliothèque de validation (utils.c)',
        'Chaque règle de saisie est une fonction 1/0. Le main teste plusieurs saisies lues ligne par ligne.',
        String.raw`#include <stdio.h>
#include <string.h>
#include <ctype.h>

int estNumerique(const char *s, int longueurAttendue) {
    if ((int)strlen(s) != longueurAttendue) return 0;
    for (int i = 0; s[i] != '\0'; i++) {
        if (!isdigit(s[i])) return 0;
    }
    return 1;
}

int estCodePostalValide(const char *s) { return estNumerique(s, 5); }
int estTelephoneValide(const char *s) { return estNumerique(s, 10); }

void lireLigne(char *buf, int taille) {
    if (fgets(buf, taille, stdin) == NULL) {
        buf[0] = '\0';
        return;
    }
    buf[strcspn(buf, "\n")] = '\0';
}

int main(void) {
    char cp[20], tel[20];
    lireLigne(cp, sizeof(cp));
    lireLigne(tel, sizeof(tel));
    printf("Code postal %s : %s\n", cp, estCodePostalValide(cp) ? "OK" : "REFUSE");
    printf("Telephone %s : %s\n", tel, estTelephoneValide(tel) ? "OK" : "REFUSE");
    return 0;
}`,
        `Code postal 75002 : OK
Telephone 06123456 : REFUSE`,
        [
          ['int estNumerique(const char *s, int longueurAttendue) {', 'Fonction générique réutilisée par deux validations : on évite de dupliquer le code.'],
          ['if ((int)strlen(s) != longueurAttendue) return 0;', 'Mauvaise longueur → refus immédiat.'],
          ['if (!isdigit(s[i])) return 0;', 'Un seul caractère non chiffre suffit à refuser (ex. « 75O02 » avec la lettre O).'],
          ['int estCodePostalValide(const char *s) { return estNumerique(s, 5); }', 'Règle du sujet : 5 chiffres.'],
          ['void lireLigne(char *buf, int taille) {', 'Fonction de saisie sécurisée réutilisable partout dans ShopFlow.'],
          ['buf[0] = \'\\0\';', 'En fin d’entrée, on renvoie une chaîne vide plutôt que des octets non initialisés.'],
          ['char cp[20], tel[20];', 'Tampons plus grands que les champs finaux : on valide AVANT de recopier dans codePostal[6].'],
          ['printf("Telephone %s : %s\\n"', '06123456 n’a que 8 chiffres : refusé.'],
        ],
        '75002\n06123456\n'
      ),
      commonMistakes: [
        {
          title: 'Comparer deux chaînes avec ==',
          wrongCode: `if (c->email == saisie) {
    printf("Email deja utilise\\n");
}`,
          rightCode: `if (strcmp(c->email, saisie) == 0) {
    printf("Email deja utilise\\n");
}`,
          explanation: '== compare les adresses des deux tableaux, qui sont toujours différentes : le contrôle d’unicité ne détecterait jamais de doublon.',
          errorType: 'logique',
        },
        {
          title: 'strncpy sans \\0 final',
          wrongCode: `strncpy(p.reference, saisie, 12);
/* si saisie fait 12 caracteres ou plus :
   pas de '\\0' -> chaine non terminee */`,
          rightCode: `strncpy(p.reference, saisie, sizeof(p.reference) - 1);
p.reference[sizeof(p.reference) - 1] = '\\0';`,
          explanation: 'strncpy n’ajoute pas de \\0 quand la source remplit tout l’espace. On copie au plus taille - 1 caractères et on pose le \\0 soi-même.',
          errorType: 'execution',
        },
        {
          title: 'fgets juste après scanf("%d")',
          wrongCode: `scanf("%d", &quantite);
fgets(nom, sizeof(nom), stdin);  /* lit "\\n" : nom vide ! */`,
          rightCode: `char ligne[32];
fgets(ligne, sizeof(ligne), stdin);
sscanf(ligne, "%d", &quantite);
fgets(nom, sizeof(nom), stdin);`,
          explanation: 'scanf laisse le \\n dans le tampon. Lire toutes les saisies avec fgets puis convertir avec sscanf rend le comportement prévisible.',
          errorType: 'logique',
        },
      ],
      summary: [
        'fgets(buf, sizeof(buf), stdin) pour toute saisie de texte ; puis buf[strcspn(buf, "\\n")] = \'\\0\'.',
        'Jamais scanf("%s") pour une adresse ou un nom composé.',
        'strcmp(a, b) == 0 pour tester l’égalité ; jamais a == b.',
        'strncpy(dest, src, N - 1) puis dest[N - 1] = \'\\0\'.',
        'Une règle de validation = une fonction qui renvoie 1 ou 0, rangée dans utils.c.',
        'strchr cherche un caractère, strstr une sous-chaîne ; les deux renvoient NULL si absent.',
      ],
      comprehensionQuestions: [
        {
          id: 'C03_Q1',
          question: 'Que lit scanf("%s", rue) si l’utilisateur tape « 12 rue de la Paix » ?',
          options: ['12 rue de la Paix', '12', 'rue', 'Rien, scanf échoue'],
          correctIndex: 1,
          explanation: '%s s’arrête au premier espace. Il faut fgets pour lire une ligne entière.',
        },
        {
          id: 'C03_Q2',
          question: 'Que renvoie strcmp("PRD-0001", "PRD-0001") ?',
          options: ['1', '0', '-1', 'L’adresse de la première chaîne'],
          correctIndex: 1,
          explanation: 'strcmp renvoie 0 quand les chaînes sont identiques. if (strcmp(a, b)) est donc vrai quand elles sont DIFFÉRENTES.',
        },
        {
          id: 'C03_Q3',
          question: 'Pour rechercher les produits dont la désignation contient « usb », quelle fonction utiliser ?',
          options: ['strcmp', 'strlen', 'strstr', 'strcpy'],
          correctIndex: 2,
          explanation: 'strstr(designation, motCle) != NULL indique que le mot-clé apparaît dans la désignation.',
        },
      ],
    },
    exercises: [
      {
        id: 'C03_E1',
        chapterId: 'C03',
        trackId: 'projet',
        title: 'Repérer le bug du contrôle d’unicité de l’email',
        difficulty: 'debutant',
        category: 'error_spot',
        testedSkill: 'Comparer des chaînes avec strcmp',
        prerequisites: ['C03'],
        statement: `Cette fonction doit renvoyer 1 si l’email existe déjà dans le répertoire. Elle renvoie toujours 0, même pour un doublon. Pourquoi ?

    int emailExiste(const Client clients[], int nb, const char *email) {
        for (int i = 0; i < nb; i++) {
            if (clients[i].email == email) {
                return 1;
            }
        }
        return 0;
    }`,
        isCoreValidationExercise: true,
        options: [
          'La boucle devrait aller jusqu’à i <= nb',
          'clients[i].email == email compare deux adresses mémoire et non les caractères : il faut strcmp(clients[i].email, email) == 0',
          'Il faut écrire clients[i]->email',
          'return 1 sort trop tôt de la boucle',
        ],
        correctOptionIndex: 1,
        errorClassificationTarget: 'logique',
        hints: [
          'Que représente le nom d’un tableau char[] quand on l’utilise dans une expression ?',
          'Deux tableaux différents ont toujours des adresses différentes.',
          'La fonction de <string.h> qui compare le contenu renvoie 0 en cas d’égalité.',
        ],
        detailedExplanation: 'Dans une expression, un tableau se convertit en l’adresse de son premier élément : == compare deux adresses, toujours différentes. La bonne condition est strcmp(clients[i].email, email) == 0. C’est une erreur logique : le programme compile et s’exécute, mais le résultat est faux.',
      },
      {
        id: 'C03_E2',
        chapterId: 'C03',
        trackId: 'projet',
        title: 'Valider une adresse électronique',
        difficulty: 'intermediaire',
        category: 'c_code',
        testedSkill: 'Parcourir une chaîne et appliquer plusieurs règles de validation',
        prerequisites: ['C03'],
        statement: `Écrivez \`int estEmailValide(const char *email)\` qui renvoie 1 si et seulement si :
- l’email contient **exactement un** caractère « @ » ;
- le « @ » n’est **ni le premier ni le dernier** caractère ;
- il y a au moins un « . » **après** le « @ » (pas juste après le « @ » et pas en dernier caractère).
Le main lit une ligne avec fgets et affiche « EMAIL VALIDE » ou « EMAIL INVALIDE ».`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>
#include <string.h>

int estEmailValide(const char *email) {
    /* TODO */
    return 0;
}

int main(void) {
    char email[80];
    if (fgets(email, sizeof(email), stdin) == NULL) {
        email[0] = '\0';
    }
    email[strcspn(email, "\n")] = '\0';
    printf(estEmailValide(email) ? "EMAIL VALIDE\n" : "EMAIL INVALIDE\n");
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <string.h>

int estEmailValide(const char *email) {
    int n = (int)strlen(email);
    int nbArobases = 0;
    int posArobase = -1;
    for (int i = 0; i < n; i++) {
        if (email[i] == '@') {
            nbArobases++;
            posArobase = i;
        }
    }
    if (nbArobases != 1 || posArobase == 0 || posArobase == n - 1) {
        return 0;
    }
    for (int i = posArobase + 2; i < n - 1; i++) {
        if (email[i] == '.') {
            return 1;
        }
    }
    return 0;
}

int main(void) {
    char email[80];
    if (fgets(email, sizeof(email), stdin) == NULL) {
        email[0] = '\0';
    }
    email[strcspn(email, "\n")] = '\0';
    printf(estEmailValide(email) ? "EMAIL VALIDE\n" : "EMAIL INVALIDE\n");
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'j.bernard@mail.fr', category: 'normal', stdin: 'j.bernard@mail.fr\n', expectedStdout: 'EMAIL VALIDE', explanation: 'Exemple du sujet.' },
          { id: 't2', label: 'Sans @', category: 'invalide', stdin: 'julie.mail.fr\n', expectedStdout: 'EMAIL INVALIDE', explanation: 'Aucun @.' },
          { id: 't3', label: 'Deux @', category: 'invalide', stdin: 'a@b@mail.fr\n', expectedStdout: 'EMAIL INVALIDE', explanation: 'Il faut exactement un @.' },
          { id: 't4', label: '@ en premier', category: 'invalide', stdin: '@mail.fr\n', expectedStdout: 'EMAIL INVALIDE', explanation: 'Partie locale vide.' },
          { id: 't5', label: 'Pas de point après @', category: 'invalide', stdin: 'julie.b@mailfr\n', expectedStdout: 'EMAIL INVALIDE', explanation: 'Le point de « julie.b » est avant le @ : il ne compte pas.' },
          { id: 't6', label: 'Point collé au @', category: 'limite', stdin: 'julie@.fr\n', expectedStdout: 'EMAIL INVALIDE', explanation: 'Le domaine ne peut pas commencer par un point.' },
          { id: 't7', label: 'Point en dernier', category: 'limite', stdin: 'julie@mail.\n', expectedStdout: 'EMAIL INVALIDE', explanation: 'Extension vide.' },
          { id: 't8', label: 'Saisie vide', category: 'invalide', stdin: '\n', expectedStdout: 'EMAIL INVALIDE', explanation: 'Une chaîne vide n’est jamais valide.' },
          { id: 't9', label: 'Domaine court a@b.c', category: 'limite', stdin: 'a@b.c\n', expectedStdout: 'EMAIL VALIDE', explanation: 'Le plus petit email accepté par nos règles.' },
        ],
        hints: [
          'Première boucle : comptez les @ et mémorisez la position du dernier rencontré.',
          'Refusez si nbArobases != 1, ou si la position vaut 0 ou n - 1.',
          'Deuxième boucle : cherchez un point entre posArobase + 2 et n - 2 inclus.',
        ],
        detailedExplanation: 'On sépare le problème en deux parcours simples : un comptage (exactement un @, bien placé), puis une recherche du point dans le domaine. Le point doit être au moins à posArobase + 2 (au moins un caractère entre @ et .) et au plus à n - 2 (au moins un caractère après). Le sujet n’exige que la présence du @, mais un contrôle plus strict évite des fiches clients inutilisables.',
      },
      {
        id: 'C03_E3',
        chapterId: 'C03',
        trackId: 'projet',
        title: 'Rechercher un produit par mot-clé (insensible à la casse)',
        difficulty: 'intermediaire',
        category: 'c_code',
        testedSkill: 'strstr, tolower, copie locale d’une chaîne',
        prerequisites: ['C03'],
        statement: `Le catalogue est déjà déclaré dans le main. Écrivez \`int contientMotCle(const char *designation, const char *motCle)\` qui renvoie 1 si motCle apparaît dans designation **sans tenir compte des majuscules/minuscules**.
Le main lit le mot-clé avec fgets, puis affiche la référence et la désignation de chaque produit trouvé (« PRD-0001 Clavier mecanique »). Si aucun produit ne correspond, il affiche « Aucun produit ».`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>
#include <string.h>
#include <ctype.h>

typedef struct {
    char reference[12];
    char designation[60];
} Produit;

int contientMotCle(const char *designation, const char *motCle) {
    /* TODO : copier les deux chaines en minuscules puis utiliser strstr */
    return 0;
}

int main(void) {
    Produit catalogue[5] = {
        {"PRD-0001", "Clavier mecanique"},
        {"PRD-0002", "Souris sans fil"},
        {"PRD-0005", "Enceinte Bluetooth"},
        {"PRD-0006", "Cable HDMI 2 m"},
        {"PRD-0007", "Hub USB-C 7 ports"}
    };
    char motCle[60];
    if (fgets(motCle, sizeof(motCle), stdin) == NULL) {
        motCle[0] = '\0';
    }
    motCle[strcspn(motCle, "\n")] = '\0';
    int trouves = 0;
    for (int i = 0; i < 5; i++) {
        if (contientMotCle(catalogue[i].designation, motCle)) {
            printf("%s %s\n", catalogue[i].reference, catalogue[i].designation);
            trouves++;
        }
    }
    if (trouves == 0) {
        printf("Aucun produit\n");
    }
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <string.h>
#include <ctype.h>

typedef struct {
    char reference[12];
    char designation[60];
} Produit;

void enMinuscules(const char *src, char *dest, int taille) {
    int i = 0;
    while (src[i] != '\0' && i < taille - 1) {
        dest[i] = (char)tolower(src[i]);
        i++;
    }
    dest[i] = '\0';
}

int contientMotCle(const char *designation, const char *motCle) {
    char d[60], m[60];
    enMinuscules(designation, d, 60);
    enMinuscules(motCle, m, 60);
    return strstr(d, m) != NULL;
}

int main(void) {
    Produit catalogue[5] = {
        {"PRD-0001", "Clavier mecanique"},
        {"PRD-0002", "Souris sans fil"},
        {"PRD-0005", "Enceinte Bluetooth"},
        {"PRD-0006", "Cable HDMI 2 m"},
        {"PRD-0007", "Hub USB-C 7 ports"}
    };
    char motCle[60];
    if (fgets(motCle, sizeof(motCle), stdin) == NULL) {
        motCle[0] = '\0';
    }
    motCle[strcspn(motCle, "\n")] = '\0';
    int trouves = 0;
    for (int i = 0; i < 5; i++) {
        if (contientMotCle(catalogue[i].designation, motCle)) {
            printf("%s %s\n", catalogue[i].reference, catalogue[i].designation);
            trouves++;
        }
    }
    if (trouves == 0) {
        printf("Aucun produit\n");
    }
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Mot-clé « usb » (minuscules)', category: 'normal', stdin: 'usb\n', expectedStdout: 'PRD-0007 Hub USB-C 7 ports', explanation: 'La désignation contient USB en majuscules.' },
          { id: 't2', label: 'Mot-clé « SANS FIL »', category: 'normal', stdin: 'SANS FIL\n', expectedStdout: 'PRD-0002 Souris sans fil', explanation: 'Le mot-clé est en majuscules.' },
          { id: 't3', label: 'Mot-clé « EN » au début d’un mot', category: 'normal', stdin: 'EN\n', expectedStdout: 'PRD-0005 Enceinte Bluetooth', explanation: 'Seule « Enceinte » contient « en ».' },
          { id: 't4', label: 'Plusieurs résultats « ca »', category: 'normal', stdin: 'ca\n', expectedStdout: 'PRD-0001 Clavier mecanique\nPRD-0006 Cable HDMI 2 m', explanation: '« meCAnique » et « CAble ».' },
          { id: 't5', label: 'Aucun résultat', category: 'limite', stdin: 'ecran\n', expectedStdout: 'Aucun produit', explanation: 'Aucune désignation ne contient « ecran ».' },
        ],
        hints: [
          'Écrivez une fonction auxiliaire qui copie une chaîne en appliquant tolower à chaque caractère, sans oublier le \\0 final.',
          'Comparez les deux copies en minuscules avec strstr.',
          'return strstr(d, m) != NULL;',
        ],
        detailedExplanation: 'strstr est sensible à la casse. On travaille donc sur des copies locales mises en minuscules, ce qui ne modifie pas le catalogue (paramètres const). La fonction enMinuscules borne la copie à taille - 1 et termine toujours la chaîne : c’est la même discipline que strncpy + \\0.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE C04 — TABLEAUX DYNAMIQUES : malloc, realloc, CAPACITÉ
  // ==========================================================================
  {
    id: 'C04',
    trackId: 'projet',
    number: 4,
    title: 'Tableaux dynamiques : malloc, realloc et capacité',
    subtitle: 'La contrainte structurante de ShopFlow : des collections qui grandissent (produits, clients, commandes, lignes).',
    estimatedMinutes: 60,
    prerequisites: ['B12', 'B15', 'C02'],
    relatedChapters: ['B15', 'C05'],
    coreConcepts: ['malloc', 'realloc', 'free', 'nb / capacite', 'doublement de capacité', 'pointeur temporaire', 'contrôle de NULL'],
    successCriteria: [
      'Gérer le couple (nombre d’éléments, capacité allouée) d’un tableau dynamique',
      'Agrandir un tableau avec realloc sans perdre le bloc en cas d’échec',
      'Vérifier systématiquement le retour de malloc et realloc',
    ],
    lesson: {
      objectives: [
        'Expliquer pourquoi un tableau statique Produit catalogue[100] ne convient pas au sujet',
        'Allouer un tableau de structures avec malloc(capacite * sizeof(Produit))',
        'Implémenter une fonction d’ajout qui double la capacité avec realloc quand le tableau est plein',
        'Utiliser un pointeur temporaire pour ne pas perdre le bloc si realloc renvoie NULL',
        'Remonter un code d’erreur (0/1) jusqu’à l’appelant',
      ],
      intuition: `Le sujet le dit clairement : « le nombre de produits, de clients et de lignes par commande n’est pas connu à l’avance : c’est la contrainte structurante du projet ».

Un tableau statique de 100 cases gaspille de la mémoire s’il y a 8 produits, et plante s’il y en a 101. On utilise donc un **tableau dynamique** alloué sur le tas, décrit par **trois** informations :
- le **pointeur** vers le premier élément (Produit *produits) ;
- le **nombre** d’éléments réellement utilisés (nbProduits) ;
- la **capacité** allouée (capaciteProduits).

Tant que nb < capacite, on ajoute dans la case libre produits[nb] puis on incrémente nb. Quand nb == capacite, on **agrandit** avec realloc — en général en doublant la capacité, pour ne pas réallouer à chaque ajout.

Ce même schéma apparaît **quatre fois** dans ShopFlow : produits et clients dans Boutique, commandes dans Client, lignes dans Commande. Maîtriser une seule fonction d’ajout, c’est maîtriser tout le projet.`,
      formalDefinition: `- **Allocation** : T *tab = malloc(capacite * sizeof(T));  → NULL si échec.
- **Agrandissement** : realloc(ancien, nouvelleTaille) réserve un bloc plus grand, **recopie** le contenu, libère l’ancien et renvoie la nouvelle adresse (qui peut être différente). En cas d’échec il renvoie NULL **et l’ancien bloc reste valide**.
- **Motif obligatoire** :
    T *tmp = realloc(tab, nouvelleCap * sizeof(T));
    if (tmp == NULL) return 0;      /* tab est toujours utilisable */
    tab = tmp;
    capacite = nouvelleCap;
- **realloc(NULL, n)** se comporte comme malloc(n) : on peut démarrer avec un pointeur NULL et une capacité 0.
- **Stratégie de croissance** : nouvelleCap = (capacite == 0) ? valeurInitiale : capacite * 2. Avec le doublement, n ajouts coûtent O(n) copies au total (coût amorti constant par ajout).
- **Invariant** à maintenir : 0 ≤ nb ≤ capacite, et seules les cases 0..nb-1 contiennent des données valides.
- **Passer le tableau à une fonction qui peut l’agrandir** : il faut transmettre l’adresse de la structure qui le contient (Boutique *b) pour que la fonction mette à jour b->produits, b->nbProduits et b->capaciteProduits.
- **Libération** : free(tab) une seule fois, quand on n’en a plus besoin.`,
      analogy: {
        title: 'Le classeur à intercalaires',
        content: `Vous rangez des fiches produits dans un classeur de 4 pochettes (capacité 4). Tant qu’il reste des pochettes vides, vous ajoutez. Quand le classeur est plein, vous achetez un classeur de 8 pochettes, vous y transférez les 4 fiches, puis vous jetez l’ancien : c’est exactement realloc. Et si le magasin n’a plus de classeur (realloc renvoie NULL), vous gardez précieusement l’ancien plein — surtout ne le jetez pas avant d’avoir le nouveau en main (le pointeur temporaire).`,
      },
      vocabulary: [
        { fr: 'Tableau dynamique', en: 'Dynamic array', definition: 'Tableau alloué sur le tas dont la taille peut changer pendant l’exécution.' },
        { fr: 'Capacité', en: 'Capacity', definition: 'Nombre de cases allouées, toujours ≥ au nombre d’éléments.' },
        { fr: 'Réallocation', en: 'Reallocation', definition: 'Changement de la taille d’un bloc du tas avec realloc.' },
        { fr: 'Coût amorti', en: 'Amortized cost', definition: 'Coût moyen d’une opération sur une longue série ; constant pour l’ajout avec doublement.' },
        { fr: 'Pointeur temporaire', en: 'Temporary pointer', definition: 'Variable recevant le résultat de realloc avant de l’affecter au vrai pointeur.' },
        { fr: 'Tas', en: 'Heap', definition: 'Zone mémoire des allocations dynamiques, gérée par malloc/realloc/free.' },
      ],
      simpleExample: cExample(
        'Observer nb et capacité pendant les ajouts',
        'On lit des quantités jusqu’à 0 et on les stocke dans un tableau qui double sa capacité.',
        String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *quantites = NULL;
    int nb = 0;
    int capacite = 0;
    int valeur = 0;

    while (scanf("%d", &valeur) == 1 && valeur != 0) {
        if (nb == capacite) {
            int nouvelleCap = (capacite == 0) ? 2 : capacite * 2;
            int *tmp = realloc(quantites, nouvelleCap * sizeof(int));
            if (tmp == NULL) {
                free(quantites);
                return 1;
            }
            quantites = tmp;
            capacite = nouvelleCap;
            printf("-> capacite agrandie a %d\n", capacite);
        }
        quantites[nb] = valeur;
        nb++;
    }

    printf("%d valeurs, capacite %d, derniere = %d\n", nb, capacite, quantites[nb - 1]);
    free(quantites);
    return 0;
}`,
        `-> capacite agrandie a 2
-> capacite agrandie a 4
-> capacite agrandie a 8
5 valeurs, capacite 8, derniere = 7`,
        [
          ['int *quantites = NULL;', 'Aucun bloc au départ : realloc(NULL, …) se comportera comme malloc.'],
          ['int capacite = 0;', 'Invariant : nb ≤ capacite, ici 0 ≤ 0.'],
          ['if (nb == capacite) {', 'Tableau plein : il faut agrandir AVANT d’écrire.'],
          ['int nouvelleCap = (capacite == 0) ? 2 : capacite * 2;', 'Stratégie de doublement : 2, 4, 8, 16…'],
          ['int *tmp = realloc(quantites, nouvelleCap * sizeof(int));', 'Taille en OCTETS : nombre de cases × taille d’une case.'],
          ['if (tmp == NULL) {', 'Échec : quantites pointe toujours vers l’ancien bloc, qu’on libère proprement.'],
          ['quantites = tmp;', 'Succès seulement : on adopte le nouveau bloc.'],
          ['quantites[nb] = valeur;', 'La première case libre est toujours à l’indice nb.'],
          ['free(quantites);', 'Une allocation (même agrandie plusieurs fois) = un seul free final.'],
        ],
        '4 8 15 16 7 0\n'
      ),
      intermediateExample: cExample(
        'ajouterProduit : le catalogue de la Boutique',
        'La fonction reçoit l’adresse de la Boutique pour pouvoir modifier son pointeur, son nombre et sa capacité. Elle renvoie 1 en cas de succès, 0 en cas d’échec mémoire.',
        String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char reference[12];
    float prixUnitaireHT;
    int quantiteStock;
} Produit;

typedef struct {
    Produit *produits;
    int nbProduits;
    int capaciteProduits;
} Boutique;

int ajouterProduit(Boutique *b, Produit p) {
    if (b->nbProduits == b->capaciteProduits) {
        int nouvelleCap = (b->capaciteProduits == 0) ? 4 : b->capaciteProduits * 2;
        Produit *tmp = realloc(b->produits, nouvelleCap * sizeof(Produit));
        if (tmp == NULL) {
            return 0;
        }
        b->produits = tmp;
        b->capaciteProduits = nouvelleCap;
    }
    b->produits[b->nbProduits] = p;
    b->nbProduits++;
    return 1;
}

int main(void) {
    Boutique b = {NULL, 0, 0};
    Produit p = {"PRD-0000", 10.0f, 5};
    for (int i = 1; i <= 5; i++) {
        snprintf(p.reference, sizeof(p.reference), "PRD-%04d", i);
        p.prixUnitaireHT = 10.0f * i;
        if (!ajouterProduit(&b, p)) {
            printf("Memoire insuffisante\n");
        }
    }
    printf("%d produits (capacite %d)\n", b.nbProduits, b.capaciteProduits);
    printf("Dernier : %s a %.2f\n", b.produits[4].reference, b.produits[4].prixUnitaireHT);
    free(b.produits);
    return 0;
}`,
        `5 produits (capacite 8)
Dernier : PRD-0005 a 50.00`,
        [
          ['Produit *produits;', 'Le catalogue : un pointeur vers un tableau de Produit sur le tas.'],
          ['int ajouterProduit(Boutique *b, Produit p) {', 'Pointeur vers Boutique : sinon la fonction modifierait une copie et le main ne verrait jamais le nouveau tableau.'],
          ['Produit *tmp = realloc(b->produits, nouvelleCap * sizeof(Produit));', 'sizeof(Produit), pas sizeof(Produit *) : on alloue des structures, pas des pointeurs.'],
          ['return 0;', 'Code d’erreur : l’appelant décide quoi afficher. Le catalogue existant est intact.'],
          ['b->produits[b->nbProduits] = p;', 'Copie de la structure p dans la première case libre.'],
          ['Boutique b = {NULL, 0, 0};', 'Boutique vide : pointeur NULL, nombre 0, capacité 0.'],
          ['snprintf(p.reference, sizeof(p.reference), "PRD-%04d", i);', 'Fabrique PRD-0001, PRD-0002… sans risque de débordement.'],
          ['printf("%d produits (capacite %d)\\n"', '4 cases au premier agrandissement, puis 8 quand on ajoute le 5e produit.'],
        ]
      ),
      commonMistakes: [
        {
          title: 'Affecter directement le résultat de realloc',
          wrongCode: `b->produits = realloc(b->produits,
                      nouvelleCap * sizeof(Produit));
/* si NULL : l'ancien catalogue est perdu
   (fuite) et b->produits vaut NULL */`,
          rightCode: `Produit *tmp = realloc(b->produits,
                       nouvelleCap * sizeof(Produit));
if (tmp == NULL) return 0;
b->produits = tmp;`,
          explanation: 'En cas d’échec, realloc renvoie NULL mais ne libère pas l’ancien bloc. En écrasant le pointeur, on perd sa seule référence : fuite mémoire et crash au prochain accès.',
          errorType: 'execution',
        },
        {
          title: 'sizeof du pointeur au lieu de sizeof de la structure',
          wrongCode: `Produit *t = malloc(10 * sizeof(Produit *));
/* 10 x 8 octets au lieu de 10 x sizeof(Produit) */`,
          rightCode: `Produit *t = malloc(10 * sizeof(Produit));
/* ou : malloc(10 * sizeof *t); */`,
          explanation: 'Un pointeur fait 8 octets, un Produit bien plus : on écrit hors du bloc dès le premier produit. Astuce : sizeof *t s’adapte automatiquement au type pointé.',
          errorType: 'execution',
        },
        {
          title: 'Oublier de mettre à jour la capacité',
          wrongCode: `Produit *tmp = realloc(b->produits, 2 * cap * sizeof(Produit));
if (tmp == NULL) return 0;
b->produits = tmp;
/* b->capaciteProduits non modifiee ! */`,
          rightCode: `Produit *tmp = realloc(b->produits, 2 * cap * sizeof(Produit));
if (tmp == NULL) return 0;
b->produits = tmp;
b->capaciteProduits = 2 * cap;`,
          explanation: 'Sans mise à jour, le programme réalloue à chaque ajout (lent) ou, pire, croit avoir moins de place qu’en réalité et l’invariant nb ≤ capacite devient faux.',
          errorType: 'logique',
        },
      ],
      summary: [
        'Un tableau dynamique = (pointeur, nb, capacite) ; invariant 0 ≤ nb ≤ capacite.',
        'Ajout : si nb == capacite, agrandir (doublement) ; puis tab[nb++] = element.',
        'Toujours : tmp = realloc(…) ; if (tmp == NULL) gérer l’erreur ; tab = tmp ; capacite = nouvelleCap.',
        'Taille en octets : nombre × sizeof(Type) (ou sizeof *tab).',
        'La fonction d’ajout reçoit un pointeur sur la structure propriétaire (Boutique *, Client *, Commande *).',
        'Vérifier chaque malloc/realloc : c’est une exigence explicite du sujet.',
      ],
      comprehensionQuestions: [
        {
          id: 'C04_Q1',
          question: 'Que se passe-t-il pour l’ancien bloc si realloc échoue et renvoie NULL ?',
          options: [
            'Il est libéré automatiquement',
            'Il reste alloué et intact : c’est au programme de le conserver ou de le libérer',
            'Son contenu est effacé',
            'Le programme s’arrête',
          ],
          correctIndex: 1,
          explanation: 'C’est précisément pourquoi on passe par un pointeur temporaire : l’ancien bloc reste utilisable.',
        },
        {
          id: 'C04_Q2',
          question: 'Une commande a nbLignes = 4 et capaciteLignes = 4. On ajoute une ligne avec la stratégie du doublement. Que valent ensuite nbLignes et capaciteLignes ?',
          options: ['5 et 5', '5 et 8', '4 et 8', '5 et 4'],
          correctIndex: 1,
          explanation: 'Le tableau était plein : la capacité double (8), puis la ligne est ajoutée (5).',
        },
        {
          id: 'C04_Q3',
          question: 'Pourquoi ajouterProduit reçoit-elle un Boutique * plutôt qu’une Boutique ?',
          options: [
            'Pour aller plus vite uniquement',
            'Parce qu’on ne peut pas passer de structure par valeur en C',
            'Pour que les modifications de produits, nbProduits et capaciteProduits soient visibles par l’appelant',
            'Parce que Boutique contient un pointeur',
          ],
          correctIndex: 2,
          explanation: 'Passée par valeur, la fonction modifierait une copie locale : le main garderait l’ancien pointeur (peut-être libéré par realloc) et l’ancien nombre.',
        },
      ],
    },
    exercises: [
      {
        id: 'C04_E1',
        chapterId: 'C04',
        trackId: 'projet',
        title: 'Tracer l’évolution de nbLignes et capaciteLignes',
        difficulty: 'debutant',
        category: 'trace',
        testedSkill: 'Dérouler l’algorithme d’ajout avec doublement de capacité',
        prerequisites: ['C04'],
        statement: 'Une commande démarre avec lignes = NULL, nbLignes = 0, capaciteLignes = 0. Chaque ajout applique : si nb == cap alors cap ← (cap == 0 ? 1 : cap × 2) avec realloc ; puis nb ← nb + 1. Complétez les cases « ? ». La colonne realloc ? vaut « oui » ou « non ».',
        isCoreValidationExercise: true,
        traceSpec: {
          language: 'c',
          code: String.raw`if (c->nbLignes == c->capaciteLignes) {
    int cap = (c->capaciteLignes == 0) ? 1 : c->capaciteLignes * 2;
    LigneCommande *tmp = realloc(c->lignes, cap * sizeof(LigneCommande));
    if (tmp == NULL) return 0;
    c->lignes = tmp;
    c->capaciteLignes = cap;
}
c->lignes[c->nbLignes] = ligne;
c->nbLignes++;`,
          columns: ['Ajout', 'realloc ?', 'nbLignes', 'capaciteLignes'],
          prefilledRows: [
            { Ajout: '1re ligne', 'realloc ?': 'oui', nbLignes: '1', capaciteLignes: '1' },
            { Ajout: '2e ligne', 'realloc ?': '?', nbLignes: '2', capaciteLignes: '?' },
            { Ajout: '3e ligne', 'realloc ?': 'oui', nbLignes: '?', capaciteLignes: '4' },
            { Ajout: '4e ligne', 'realloc ?': '?', nbLignes: '4', capaciteLignes: '?' },
            { Ajout: '5e ligne', 'realloc ?': '?', nbLignes: '?', capaciteLignes: '?' },
          ],
          expectedAnswers: {
            '1:realloc ?': 'oui',
            '1:capaciteLignes': '2',
            '2:nbLignes': '3',
            '3:realloc ?': 'non',
            '3:capaciteLignes': '4',
            '4:realloc ?': 'oui',
            '4:nbLignes': '5',
            '4:capaciteLignes': '8',
          },
        },
        hints: [
          'Avant le 2e ajout : nb = 1 et cap = 1 → le tableau est plein.',
          'Avant le 4e ajout : nb = 3 et cap = 4 → il reste une place, pas de realloc.',
          'Avant le 5e ajout : nb = 4 et cap = 4 → plein, la capacité double.',
        ],
        detailedExplanation: 'La capacité suit 1, 2, 4, 4, 8 : on ne réalloue qu’aux ajouts 1, 2, 3 et 5. Sur un grand nombre d’ajouts, les réallocations deviennent de plus en plus rares, d’où le coût amorti constant.',
      },
      {
        id: 'C04_E2',
        chapterId: 'C04',
        trackId: 'projet',
        title: 'Corriger la fonction d’ajout d’un client',
        difficulty: 'intermediaire',
        category: 'bugfix',
        testedSkill: 'Motif realloc sûr, mise à jour de la capacité, libération',
        prerequisites: ['C04'],
        statement: `Ce programme lit des identifiants clients jusqu’à 0 et les stocke dans un répertoire dynamique, puis affiche le nombre de clients, la capacité et le dernier identifiant. Il contient **3 bugs** :
1. le résultat de realloc est affecté directement au pointeur ;
2. la capacité n’est jamais mise à jour ;
3. le répertoire n’est jamais libéré.
Corrigez-les (la sortie doit indiquer la bonne capacité, avec doublement à partir de 2).`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int idClient;
} Client;

typedef struct {
    Client *clients;
    int nbClients;
    int capaciteClients;
} Boutique;

int ajouterClient(Boutique *b, int id) {
    if (b->nbClients == b->capaciteClients) {
        int nouvelleCap = (b->capaciteClients == 0) ? 2 : b->capaciteClients * 2;
        b->clients = realloc(b->clients, nouvelleCap * sizeof(Client));
        if (b->clients == NULL) {
            return 0;
        }
    }
    b->clients[b->nbClients].idClient = id;
    b->nbClients++;
    return 1;
}

int main(void) {
    Boutique b = {NULL, 0, 0};
    int id = 0;
    while (scanf("%d", &id) == 1 && id != 0) {
        if (!ajouterClient(&b, id)) {
            printf("Erreur memoire\n");
            return 1;
        }
    }
    printf("%d clients, capacite %d\n", b.nbClients, b.capaciteClients);
    if (b.nbClients > 0) {
        printf("Dernier id : %d\n", b.clients[b.nbClients - 1].idClient);
    }
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int idClient;
} Client;

typedef struct {
    Client *clients;
    int nbClients;
    int capaciteClients;
} Boutique;

int ajouterClient(Boutique *b, int id) {
    if (b->nbClients == b->capaciteClients) {
        int nouvelleCap = (b->capaciteClients == 0) ? 2 : b->capaciteClients * 2;
        Client *tmp = realloc(b->clients, nouvelleCap * sizeof(Client));
        if (tmp == NULL) {
            return 0;
        }
        b->clients = tmp;
        b->capaciteClients = nouvelleCap;
    }
    b->clients[b->nbClients].idClient = id;
    b->nbClients++;
    return 1;
}

int main(void) {
    Boutique b = {NULL, 0, 0};
    int id = 0;
    while (scanf("%d", &id) == 1 && id != 0) {
        if (!ajouterClient(&b, id)) {
            printf("Erreur memoire\n");
            free(b.clients);
            return 1;
        }
    }
    printf("%d clients, capacite %d\n", b.nbClients, b.capaciteClients);
    if (b.nbClients > 0) {
        printf("Dernier id : %d\n", b.clients[b.nbClients - 1].idClient);
    }
    free(b.clients);
    return 0;
}
`,
        testCases: [
          { id: 't1', label: '5 clients', category: 'normal', stdin: '1 2 3 4 5 0\n', expectedStdout: '5 clients, capacite 8\nDernier id : 5', explanation: 'Capacités successives 2, 4, 8.', mustContainConstructs: ['tmp'], forbidMemoryLeaks: true },
          { id: 't2', label: '2 clients (pile la capacité)', category: 'limite', stdin: '7 9 0\n', expectedStdout: '2 clients, capacite 2\nDernier id : 9', explanation: 'Le tableau est plein mais pas encore agrandi.', forbidMemoryLeaks: true },
          { id: 't3', label: 'Aucun client', category: 'limite', stdin: '0\n', expectedStdout: '0 clients, capacite 0', explanation: 'Aucune allocation : free(NULL) est autorisé.', forbidMemoryLeaks: true },
        ],
        hints: [
          'Introduisez Client *tmp = realloc(…); et testez tmp avant de l’affecter.',
          'Après b->clients = tmp; ajoutez b->capaciteClients = nouvelleCap;',
          'Ajoutez free(b.clients); avant chaque return du main.',
        ],
        detailedExplanation: 'Sans mise à jour de la capacité, nb n’est égal à capacite qu’une seule fois… puis on écrit hors du bloc dès le 3e client. Le pointeur temporaire protège l’ancien bloc en cas d’échec, et le free final supprime la fuite détectée par valgrind (et ici par le LeakSanitizer de la plateforme).',
      },
      {
        id: 'C04_E3',
        chapterId: 'C04',
        trackId: 'projet',
        title: 'Stocker un nombre inconnu de prix et calculer le panier',
        difficulty: 'intermediaire',
        category: 'c_code',
        testedSkill: 'Écrire de bout en bout un tableau dynamique avec realloc',
        prerequisites: ['C04'],
        statement: `Lisez des prix (float) jusqu’à la valeur 0 et stockez-les dans un **tableau dynamique** (capacité initiale 2, doublement avec realloc). Affichez ensuite :
- « Articles : N » ;
- « Total : T » (2 décimales) ;
- « Plus cher : P » (2 décimales) — ligne absente s’il n’y a aucun article.
Libérez la mémoire avant de terminer.`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    float *prix = NULL;
    int nb = 0;
    int capacite = 0;
    float valeur = 0.0f;

    /* TODO : lecture jusqu'a 0 avec agrandissement par realloc */

    /* TODO : affichages */

    /* TODO : liberation */
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    float *prix = NULL;
    int nb = 0;
    int capacite = 0;
    float valeur = 0.0f;

    while (scanf("%f", &valeur) == 1 && valeur != 0.0f) {
        if (nb == capacite) {
            int nouvelleCap = (capacite == 0) ? 2 : capacite * 2;
            float *tmp = realloc(prix, nouvelleCap * sizeof(float));
            if (tmp == NULL) {
                free(prix);
                return 1;
            }
            prix = tmp;
            capacite = nouvelleCap;
        }
        prix[nb] = valeur;
        nb++;
    }

    float total = 0.0f;
    for (int i = 0; i < nb; i++) {
        total += prix[i];
    }
    printf("Articles : %d\n", nb);
    printf("Total : %.2f\n", total);
    if (nb > 0) {
        float max = prix[0];
        for (int i = 1; i < nb; i++) {
            if (prix[i] > max) {
                max = prix[i];
            }
        }
        printf("Plus cher : %.2f\n", max);
    }
    free(prix);
    return 0;
}
`,
        testCases: [
          { id: 't1', label: '3 articles', category: 'normal', stdin: '79.90 24.50 199.00 0\n', expectedStdout: 'Articles : 3\nTotal : 303.40\nPlus cher : 199.00', explanation: 'Clavier, souris, écran.', mustContainConstructs: ['realloc'], forbidMemoryLeaks: true },
          { id: 't2', label: '6 articles (2 agrandissements)', category: 'normal', stdin: '9.90 9.90 9.90 49.90 10 20 0\n', expectedStdout: 'Articles : 6\nTotal : 109.60\nPlus cher : 49.90', explanation: 'Capacités 2, 4, 8.', mustContainConstructs: ['realloc'], forbidMemoryLeaks: true },
          { id: 't3', label: 'Panier vide', category: 'limite', stdin: '0\n', expectedStdout: 'Articles : 0\nTotal : 0.00', explanation: 'Aucun article : pas de ligne « Plus cher ».', forbidMemoryLeaks: true },
        ],
        hints: [
          'Reprenez la boucle while (scanf("%f", &valeur) == 1 && valeur != 0.0f) de l’exemple.',
          'Dans la boucle : si nb == capacite, agrandissez via un pointeur temporaire, puis prix[nb++] = valeur.',
          'Le maximum se cherche seulement si nb > 0 ; terminez par free(prix).',
        ],
        detailedExplanation: 'C’est le squelette exact de toutes les collections de ShopFlow. Le cas « panier vide » vérifie qu’on ne lit pas prix[0] quand le tableau n’existe pas (prix vaut NULL) et que free(NULL) ne pose aucun problème.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE C05 — ALLOCATION À PLUSIEURS NIVEAUX ET LIBÉRATION COMPLÈTE
  // ==========================================================================
  {
    id: 'C05',
    trackId: 'projet',
    number: 5,
    title: 'Allocation à 4 niveaux et libération sans fuite',
    subtitle: 'Boutique → clients → commandes → lignes : propriété, ordre des free, copie superficielle et valgrind.',
    estimatedMinutes: 60,
    prerequisites: ['C04'],
    relatedChapters: ['B15', 'C04', 'C10'],
    coreConcepts: ['structures à pointeurs internes', 'ordre de libération', 'propriété mémoire', 'copie superficielle', 'copie profonde', 'double free', 'valgrind'],
    successCriteria: [
      'Écrire la fonction detruireBoutique qui libère les 4 niveaux sans fuite',
      'Expliquer pourquoi copier une Commande ne copie pas ses lignes',
      'Lire un rapport valgrind --leak-check=full',
    ],
    lesson: {
      objectives: [
        'Visualiser l’arbre des allocations de ShopFlow : Boutique, Client, Commande, LigneCommande',
        'Libérer de l’intérieur vers l’extérieur (les lignes avant les commandes, les commandes avant les clients)',
        'Distinguer copie superficielle (le pointeur est partagé) et copie profonde (le bloc est dupliqué)',
        'Éviter le double free et l’utilisation après libération (use-after-free)',
        'Interpréter « definitely lost » dans un rapport valgrind',
      ],
      intuition: `Le sujet parle de « quatre niveaux d’allocation dynamique » : la Boutique possède un tableau de clients ; chaque client possède un tableau de commandes ; chaque commande possède un tableau de lignes.

Chaque tableau est un bloc séparé sur le tas. Le bloc des clients contient, pour chaque client, l’**adresse** du bloc de ses commandes — pas les commandes elles-mêmes. Conséquence directe : si on libère d’abord le tableau des clients, on perd ces adresses, et les commandes deviennent **impossibles à libérer** (fuite mémoire). Il faut donc libérer **du plus profond vers la racine**.

Deuxième conséquence : copier une Commande (cmd2 = cmd1) copie le **pointeur** lignes, pas les lignes. Les deux commandes partagent alors le même bloc ; libérer l’une puis l’autre provoque un **double free**. Quand on a besoin d’une vraie copie (par exemple pour trier une copie des commandes, ou pour dupliquer une commande), il faut faire une **copie profonde**.

Le sujet est sévère : « une seule fuite mémoire est sanctionnée » et il faut passer valgrind --leak-check=full sans erreur.`,
      formalDefinition: `- **Arbre de propriété** de ShopFlow :
    Boutique
     ├─ produits   (1 bloc : Produit[capaciteProduits])
     └─ clients    (1 bloc : Client[capaciteClients])
          └─ clients[i].commandes   (1 bloc par client)
                └─ commandes[j].lignes   (1 bloc par commande)
- **Règle de libération** : pour chaque bloc, libérer d’abord tous les blocs dont il contient l’adresse, puis lui-même.
    pour chaque client i :
        pour chaque commande j de i : free(lignes)
        free(commandes)
    free(clients) ; free(produits)
- **Après free** : mettre le pointeur à NULL et le compteur à 0 évite le use-after-free et rend un second free inoffensif (free(NULL) ne fait rien).
- **Copie superficielle** (*shallow copy*) : affectation de structure ; les pointeurs internes sont copiés tels quels → blocs partagés.
- **Copie profonde** (*deep copy*) : on copie la structure, puis on alloue un nouveau bloc et on y recopie le contenu (memcpy ou boucle).
- **Ne pas libérer** : un tableau local, une adresse obtenue par &, ou un pointeur au milieu d’un bloc (&tab[2]).
- **valgrind --leak-check=full ./shopflow** : « definitely lost : N bytes in K blocks » = fuite certaine ; « Invalid free » = double free ou free d’une adresse non allouée ; « Invalid read » = accès après free ou hors du bloc. Objectif : « All heap blocks were freed -- no leaks are possible ».`,
      analogy: {
        title: 'Les clés d’un immeuble',
        content: `Le gardien (Boutique) a un trousseau avec les clés de chaque appartement (clients). Dans chaque appartement, une boîte contient les clés des caves (commandes), et chaque cave contient la clé d’un casier (lignes). Si le gardien jette son trousseau en premier, plus personne ne peut ouvrir les appartements pour récupérer les clés des caves : elles sont perdues (fuite). On rend donc les clés du casier, puis de la cave, puis de l’appartement, et enfin le trousseau.
Une copie superficielle, c’est donner un double de la clé de la cave : deux personnes croient chacune posséder la cave, et chacune va vouloir la rendre (double free).`,
      },
      vocabulary: [
        { fr: 'Fuite mémoire', en: 'Memory leak', definition: 'Bloc alloué dont on a perdu l’adresse sans l’avoir libéré.' },
        { fr: 'Double libération', en: 'Double free', definition: 'Deuxième appel à free sur un bloc déjà libéré ; corrompt le tas.' },
        { fr: 'Utilisation après libération', en: 'Use-after-free', definition: 'Lecture ou écriture via un pointeur dont le bloc a été libéré.' },
        { fr: 'Pointeur pendant', en: 'Dangling pointer', definition: 'Pointeur qui contient encore l’adresse d’un bloc libéré.' },
        { fr: 'Copie superficielle', en: 'Shallow copy', definition: 'Copie qui duplique les pointeurs mais pas les blocs pointés.' },
        { fr: 'Copie profonde', en: 'Deep copy', definition: 'Copie qui duplique aussi les blocs pointés.' },
        { fr: 'Propriétaire d’un bloc', en: 'Owner', definition: 'Unique structure responsable de libérer un bloc.' },
      ],
      simpleExample: cExample(
        'Construire puis détruire 3 niveaux : clients → commandes → lignes',
        'Chaque niveau est alloué séparément ; la destruction parcourt l’arbre de l’intérieur vers l’extérieur. Aucune fuite n’est signalée.',
        String.raw`#include <stdio.h>
#include <stdlib.h>

typedef struct { int quantite; } LigneCommande;
typedef struct { int numero; int nbLignes; LigneCommande *lignes; } Commande;
typedef struct { int idClient; int nbCommandes; Commande *commandes; } Client;

int main(void) {
    int nbClients = 2;
    Client *clients = malloc(nbClients * sizeof(Client));
    if (clients == NULL) return 1;

    for (int i = 0; i < nbClients; i++) {
        clients[i].idClient = i + 1;
        clients[i].nbCommandes = 2;
        clients[i].commandes = malloc(2 * sizeof(Commande));
        for (int j = 0; j < 2; j++) {
            Commande *c = &clients[i].commandes[j];
            c->numero = 1000 + 10 * i + j;
            c->nbLignes = 3;
            c->lignes = malloc(3 * sizeof(LigneCommande));
            for (int k = 0; k < 3; k++) {
                c->lignes[k].quantite = k + 1;
            }
        }
    }
    printf("Commande %d, ligne 3 : qte %d\n",
           clients[1].commandes[1].numero,
           clients[1].commandes[1].lignes[2].quantite);

    for (int i = 0; i < nbClients; i++) {
        for (int j = 0; j < clients[i].nbCommandes; j++) {
            free(clients[i].commandes[j].lignes);
        }
        free(clients[i].commandes);
    }
    free(clients);
    printf("Memoire liberee : 1 + 2 + 4 = 7 blocs\n");
    return 0;
}`,
        `Commande 1011, ligne 3 : qte 3
Memoire liberee : 1 + 2 + 4 = 7 blocs`,
        [
          ['Client *clients = malloc(nbClients * sizeof(Client));', 'Niveau 1 : 1 bloc pour le répertoire.'],
          ['clients[i].commandes = malloc(2 * sizeof(Commande));', 'Niveau 2 : 1 bloc par client (2 blocs).'],
          ['Commande *c = &clients[i].commandes[j];', 'Raccourci : un pointeur vers la commande évite de répéter clients[i].commandes[j].'],
          ['c->lignes = malloc(3 * sizeof(LigneCommande));', 'Niveau 3 : 1 bloc par commande (4 blocs). (Dans un vrai programme : tester chaque retour !)'],
          ['clients[1].commandes[1].lignes[2].quantite', 'Chemin complet : 2e client, 2e commande, 3e ligne.'],
          ['free(clients[i].commandes[j].lignes);', 'On commence par les feuilles de l’arbre : les lignes.'],
          ['free(clients[i].commandes);', 'Puis le tableau des commandes du client : ses lignes sont déjà libérées.'],
          ['free(clients);', 'Enfin la racine. Inverser l’ordre rendrait les adresses internes inaccessibles.'],
        ]
      ),
      intermediateExample: cExample(
        'Copie superficielle contre copie profonde d’une commande',
        'dupliquerCommande alloue un nouveau tableau de lignes : modifier la copie ne touche plus l’original, et chaque commande libère son propre bloc.',
        String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { char refProduit[12]; int quantite; } LigneCommande;
typedef struct { int numero; int nbLignes; LigneCommande *lignes; } Commande;

int dupliquerCommande(const Commande *src, Commande *dest) {
    *dest = *src;
    dest->lignes = malloc(src->nbLignes * sizeof(LigneCommande));
    if (dest->lignes == NULL) {
        return 0;
    }
    memcpy(dest->lignes, src->lignes, src->nbLignes * sizeof(LigneCommande));
    return 1;
}

int main(void) {
    Commande a = {1001, 2, NULL};
    a.lignes = malloc(2 * sizeof(LigneCommande));
    if (a.lignes == NULL) return 1;
    strcpy(a.lignes[0].refProduit, "PRD-0001");
    a.lignes[0].quantite = 2;
    strcpy(a.lignes[1].refProduit, "PRD-0004");
    a.lignes[1].quantite = 1;

    Commande superficielle = a;
    printf("Partage du bloc : %s\n", superficielle.lignes == a.lignes ? "oui" : "non");

    Commande profonde;
    if (!dupliquerCommande(&a, &profonde)) {
        free(a.lignes);
        return 1;
    }
    profonde.numero = 1002;
    profonde.lignes[0].quantite = 10;
    printf("Partage du bloc : %s\n", profonde.lignes == a.lignes ? "oui" : "non");
    printf("Original %d : qte %d / Copie %d : qte %d\n",
           a.numero, a.lignes[0].quantite, profonde.numero, profonde.lignes[0].quantite);

    free(profonde.lignes);
    free(a.lignes);
    return 0;
}`,
        `Partage du bloc : oui
Partage du bloc : non
Original 1001 : qte 2 / Copie 1002 : qte 10`,
        [
          ['*dest = *src;', 'Étape 1 : copie de tous les champs (numéro, nbLignes… et le pointeur lignes, encore partagé).'],
          ['dest->lignes = malloc(src->nbLignes * sizeof(LigneCommande));', 'Étape 2 : la copie reçoit son PROPRE bloc.'],
          ['memcpy(dest->lignes, src->lignes, src->nbLignes * sizeof(LigneCommande));', 'Étape 3 : on recopie le contenu des lignes octet par octet.'],
          ['Commande superficielle = a;', 'Copie superficielle : superficielle.lignes == a.lignes. NE JAMAIS libérer les deux.'],
          ['profonde.lignes[0].quantite = 10;', 'Ne modifie que la copie.'],
          ['free(profonde.lignes);', 'Deux blocs distincts → deux free. Le bloc partagé par « superficielle » n’est libéré qu’une fois, via a.lignes.'],
        ]
      ),
      commonMistakes: [
        {
          title: 'Libérer la racine avant les niveaux internes',
          wrongCode: `free(b->clients);
for (int i = 0; i < b->nbClients; i++) {
    free(b->clients[i].commandes); /* lecture d'un bloc libere ! */
}`,
          rightCode: `for (int i = 0; i < b->nbClients; i++) {
    for (int j = 0; j < b->clients[i].nbCommandes; j++)
        free(b->clients[i].commandes[j].lignes);
    free(b->clients[i].commandes);
}
free(b->clients);`,
          explanation: 'Après free(b->clients), lire b->clients[i] est un use-after-free (valgrind : « Invalid read »). Et si on ne lit pas, les commandes fuient.',
          errorType: 'execution',
        },
        {
          title: 'Libérer deux fois un bloc partagé par copie superficielle',
          wrongCode: `Commande copie = clients[0].commandes[0];
/* ... */
free(copie.lignes);
free(clients[0].commandes[0].lignes); /* double free */`,
          rightCode: `/* Une copie superficielle n'est qu'une VUE :
   elle ne possede pas ses lignes, on ne la libere pas. */
Commande copie = clients[0].commandes[0];
/* ... lecture seule ... */
free(clients[0].commandes[0].lignes); /* le proprietaire */`,
          explanation: 'Un bloc = un seul propriétaire = un seul free. Si la copie doit vivre indépendamment, faites une copie profonde.',
          errorType: 'execution',
        },
        {
          title: 'Supprimer une commande sans libérer ses lignes',
          wrongCode: `/* retrait de la commande j par decalage */
for (int k = j; k < c->nbCommandes - 1; k++)
    c->commandes[k] = c->commandes[k + 1];
c->nbCommandes--;   /* lignes de l'ancienne commande j perdues */`,
          rightCode: `free(c->commandes[j].lignes);
for (int k = j; k < c->nbCommandes - 1; k++)
    c->commandes[k] = c->commandes[k + 1];
c->nbCommandes--;`,
          explanation: 'Écraser une structure qui contient un pointeur fait perdre l’adresse de son bloc. (Dans ShopFlow, on préfère d’ailleurs la suppression logique, voir C08.)',
          errorType: 'execution',
        },
      ],
      summary: [
        'ShopFlow a 4 niveaux : Boutique → clients → commandes → lignes (+ produits).',
        'On libère des feuilles vers la racine : lignes, puis commandes, puis clients et produits.',
        'Affecter une structure qui contient un pointeur = copie superficielle : le bloc est partagé.',
        'Un bloc n’a qu’un propriétaire, qui le libère une seule fois.',
        'Après free : pointeur = NULL, compteur = 0.',
        'Objectif valgrind : « All heap blocks were freed -- no leaks are possible ».',
      ],
      comprehensionQuestions: [
        {
          id: 'C05_Q1',
          question: 'Une boutique a 5 clients ; chacun a 2 commandes. Combien de free faut-il pour clients, commandes et lignes (sans compter produits) ?',
          options: ['3', '5 + 2 = 7', '1 + 5 + 10 = 16', '10'],
          correctIndex: 2,
          explanation: '1 bloc pour le tableau des clients, 5 blocs de commandes (un par client), 10 blocs de lignes (un par commande) : 16 free.',
        },
        {
          id: 'C05_Q2',
          question: 'Après `Commande copie = cmd;`, que vaut `copie.lignes == cmd.lignes` ?',
          options: ['0 (faux) : les lignes ont été dupliquées', '1 (vrai) : les deux commandes partagent le même tableau de lignes', 'Erreur de compilation', 'Cela dépend de nbLignes'],
          correctIndex: 1,
          explanation: 'L’affectation copie la valeur du pointeur, pas le bloc pointé.',
        },
        {
          id: 'C05_Q3',
          question: 'valgrind affiche « definitely lost: 96 bytes in 2 blocks ». Que faut-il chercher ?',
          options: [
            'Un free appelé deux fois',
            'Deux blocs alloués dont l’adresse a été perdue sans free (souvent un niveau interne oublié)',
            'Une division par zéro',
            'Un tableau local trop grand',
          ],
          correctIndex: 1,
          explanation: '« definitely lost » = fuite certaine. Par exemple deux commandes dont on a oublié de libérer les lignes.',
        },
      ],
    },
    exercises: [
      {
        id: 'C05_E1',
        chapterId: 'C05',
        trackId: 'projet',
        title: 'Remettre en ordre detruireBoutique',
        difficulty: 'intermediaire',
        category: 'ordering',
        testedSkill: 'Ordre de libération des 4 niveaux de ShopFlow',
        prerequisites: ['C05'],
        statement: 'Réordonnez les lignes de la fonction de destruction pour libérer toute la mémoire sans fuite ni accès à un bloc déjà libéré.',
        isCoreValidationExercise: true,
        scrambledLines: [
          '    free(b->clients);',
          '            free(b->clients[i].commandes[j].lignes);',
          'void detruireBoutique(Boutique *b) {',
          '        free(b->clients[i].commandes);',
          '    free(b->produits);',
          '    for (int i = 0; i < b->nbClients; i++) {',
          '}',
          '        for (int j = 0; j < b->clients[i].nbCommandes; j++)',
          '    }',
        ],
        correctOrderIndices: [2, 5, 7, 1, 3, 8, 0, 4, 6],
        hints: [
          'La signature vient en premier, l’accolade fermante en dernier.',
          'Les deux boucles imbriquées (clients puis commandes) précèdent tout free de tableau englobant.',
          'Ordre : lignes (boucle interne), commandes (fin de la boucle externe), puis clients et produits.',
        ],
        detailedExplanation: `void detruireBoutique(Boutique *b) {
    for (int i = 0; i < b->nbClients; i++) {
        for (int j = 0; j < b->clients[i].nbCommandes; j++)
            free(b->clients[i].commandes[j].lignes);
        free(b->clients[i].commandes);
    }
    free(b->clients);
    free(b->produits);
}
C’est la fonction donnée dans le sujet. produits ne contient aucun pointeur interne : on peut le libérer avant ou après clients.`,
      },
      {
        id: 'C05_E2',
        chapterId: 'C05',
        trackId: 'projet',
        title: 'Repérer le double free',
        difficulty: 'intermediaire',
        category: 'error_spot',
        testedSkill: 'Identifier un bloc partagé par copie superficielle',
        prerequisites: ['C05'],
        statement: `Ce programme plante à la fin avec « double free detected ». Quelle ligne est en cause ?

    Commande archive = client.commandes[0];        /* ligne A */
    archive.numero = 9001;                          /* ligne B */
    free(client.commandes[0].lignes);               /* ligne C */
    free(client.commandes);                         /* ligne D */
    free(archive.lignes);                           /* ligne E */`,
        isCoreValidationExercise: true,
        options: [
          'Ligne B : on ne peut pas modifier le numéro d’une copie',
          'Ligne D : il faut libérer client.commandes avant les lignes',
          'Ligne E : archive.lignes pointe vers le même bloc que client.commandes[0].lignes, déjà libéré ligne C',
          'Ligne A : on ne peut pas copier une structure contenant un pointeur',
        ],
        correctOptionIndex: 2,
        errorClassificationTarget: 'execution',
        hints: [
          'Que copie exactement la ligne A pour le champ lignes ?',
          'Combien de blocs de lignes existent réellement ?',
          'Deux free sur la même adresse = double free.',
        ],
        detailedExplanation: 'La ligne A est une copie superficielle : archive.lignes contient la même adresse que client.commandes[0].lignes. La ligne C libère ce bloc ; la ligne E le libère une seconde fois. Solution : ne pas libérer archive.lignes (archive n’est pas propriétaire), ou faire une copie profonde si l’archive doit survivre à la commande.',
      },
      {
        id: 'C05_E3',
        chapterId: 'C05',
        trackId: 'projet',
        title: 'Supprimer toutes les fuites d’un client',
        difficulty: 'avance',
        category: 'bugfix',
        testedSkill: 'Écrire une fonction de libération récursive en profondeur',
        prerequisites: ['C05'],
        statement: `Le programme construit un client dont le nombre de commandes et de lignes est lu en entrée, puis affiche le total d’articles. La fonction \`detruireClient\` ne libère que le tableau des commandes : toutes les lignes fuient.
Corrigez detruireClient pour libérer **toutes** les lignes puis le tableau des commandes, et remettre le pointeur à NULL et nbCommandes à 0. Le test échoue s’il reste la moindre fuite.`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>
#include <stdlib.h>

typedef struct { int quantite; } LigneCommande;
typedef struct { int nbLignes; LigneCommande *lignes; } Commande;
typedef struct { int nbCommandes; Commande *commandes; } Client;

void detruireClient(Client *c) {
    free(c->commandes);
}

int main(void) {
    Client c = {0, NULL};
    int nbCmd = 0;
    scanf("%d", &nbCmd);
    if (nbCmd > 0) {
        c.commandes = malloc(nbCmd * sizeof(Commande));
        if (c.commandes == NULL) return 1;
    }
    int total = 0;
    for (int j = 0; j < nbCmd; j++) {
        Commande *cmd = &c.commandes[j];
        scanf("%d", &cmd->nbLignes);
        cmd->lignes = malloc(cmd->nbLignes * sizeof(LigneCommande));
        for (int k = 0; k < cmd->nbLignes; k++) {
            scanf("%d", &cmd->lignes[k].quantite);
            total += cmd->lignes[k].quantite;
        }
        c.nbCommandes++;
    }
    printf("%d commandes, %d articles\n", c.nbCommandes, total);
    detruireClient(&c);
    printf("Pointeur commandes : %s\n", c.commandes == NULL ? "NULL" : "non NULL");
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <stdlib.h>

typedef struct { int quantite; } LigneCommande;
typedef struct { int nbLignes; LigneCommande *lignes; } Commande;
typedef struct { int nbCommandes; Commande *commandes; } Client;

void detruireClient(Client *c) {
    for (int j = 0; j < c->nbCommandes; j++) {
        free(c->commandes[j].lignes);
    }
    free(c->commandes);
    c->commandes = NULL;
    c->nbCommandes = 0;
}

int main(void) {
    Client c = {0, NULL};
    int nbCmd = 0;
    scanf("%d", &nbCmd);
    if (nbCmd > 0) {
        c.commandes = malloc(nbCmd * sizeof(Commande));
        if (c.commandes == NULL) return 1;
    }
    int total = 0;
    for (int j = 0; j < nbCmd; j++) {
        Commande *cmd = &c.commandes[j];
        scanf("%d", &cmd->nbLignes);
        cmd->lignes = malloc(cmd->nbLignes * sizeof(LigneCommande));
        for (int k = 0; k < cmd->nbLignes; k++) {
            scanf("%d", &cmd->lignes[k].quantite);
            total += cmd->lignes[k].quantite;
        }
        c.nbCommandes++;
    }
    printf("%d commandes, %d articles\n", c.nbCommandes, total);
    detruireClient(&c);
    printf("Pointeur commandes : %s\n", c.commandes == NULL ? "NULL" : "non NULL");
    return 0;
}
`,
        testCases: [
          { id: 't1', label: '2 commandes (3 et 1 lignes)', category: 'normal', stdin: '2\n3 2 1 5\n1 4\n', expectedStdout: '2 commandes, 12 articles\nPointeur commandes : NULL', explanation: '3 blocs à libérer : 2 tableaux de lignes + 1 tableau de commandes.', forbidMemoryLeaks: true },
          { id: 't2', label: '3 commandes d’une ligne', category: 'normal', stdin: '3\n1 1\n1 2\n1 3\n', expectedStdout: '3 commandes, 6 articles\nPointeur commandes : NULL', explanation: '4 blocs.', forbidMemoryLeaks: true },
          { id: 't3', label: 'Client sans commande', category: 'limite', stdin: '0\n', expectedStdout: '0 commandes, 0 articles\nPointeur commandes : NULL', explanation: 'free(NULL) est sans effet ; le pointeur reste NULL.', forbidMemoryLeaks: true },
        ],
        hints: [
          'Avant free(c->commandes), parcourez les commandes de 0 à c->nbCommandes - 1.',
          'Dans la boucle : free(c->commandes[j].lignes);',
          'Après le free du tableau : c->commandes = NULL; c->nbCommandes = 0;',
        ],
        detailedExplanation: 'On applique la règle « feuilles d’abord » : chaque tableau de lignes, puis le tableau des commandes. Remettre le pointeur à NULL et le compteur à 0 laisse le client dans un état cohérent : un second appel à detruireClient ne ferait rien de dangereux. detruireBoutique appellera simplement detruireClient pour chaque client.',
      },
    ],
  },
];
