import { Chapter } from '../types/curriculum';
import { cExample } from './projetHelpers';

// ============================================================================
// PARCOURS C — CONCEPTS DU MINI-PROJET SHOPFLOW (C06 à C10)
// ============================================================================

export const PROJET_CHAPTERS_PART2: Chapter[] = [
  // ==========================================================================
  // CHAPITRE C06 — FONCTIONS SUR STRUCTURES ET CALCUL EN CASCADE
  // ==========================================================================
  {
    id: 'C06',
    trackId: 'projet',
    number: 6,
    title: 'Règles métier et calcul en cascade',
    subtitle: 'Remise par paliers, TVA, frais de port et points de fidélité : Ligne → Commande → Client → Boutique.',
    estimatedMinutes: 55,
    prerequisites: ['B06', 'B12', 'C04'],
    relatedChapters: ['B06', 'B08', 'C09'],
    coreConcepts: ['passage par pointeur', 'const', 'paliers if / else if', 'calcul en cascade', 'float et arrondi', 'constantes #define'],
    successCriteria: [
      'Traduire la grille de remise du sujet en fonction tauxRemise',
      'Écrire calculerCommande(Commande *c) qui remplit tous les montants dans le bon ordre',
      'Savoir quand passer une structure par valeur, par pointeur ou par pointeur const',
    ],
    lesson: {
      objectives: [
        'Transformer une grille tarifaire en une chaîne if / else if sans trou ni chevauchement',
        'Respecter l’ordre de calcul imposé : brut → remise → HT → TVA → port → TTC → points',
        'Modifier une structure dans une fonction grâce à un pointeur (Commande *c)',
        'Utiliser const pour les fonctions qui ne font que lire (const Commande *c)',
        'Afficher des montants avec %.2f et éviter les comparaisons d’égalité sur des float',
      ],
      intuition: `Toutes les règles de facturation de ShopFlow s’appliquent dans un ordre précis, chaque résultat alimentant le suivant : c’est le **calcul en cascade**.

1. Chaque ligne : sousTotalHT = quantite × prixUnitaireHT.
2. La commande : montantBrutHT = somme des sous-totaux.
3. Le **palier** de remise se décide sur le brut : < 100 → 0 %, [100 ; 300[ → 5 %, [300 ; 600[ → 10 %, ≥ 600 → 15 %.
4. montantRemise = brut × taux / 100, puis montantHT = brut − remise.
5. montantTVA = 20 % du HT (après remise).
6. fraisPort = 5,90 €, **offerts dès 60 € de brut** (avant remise). Le port n’est pas soumis à la TVA.
7. montantTTC = HT + TVA + port.
8. Points de fidélité : 1 point par tranche de 10 € TTC.

Ensuite le chiffre d’affaires d’un client est la somme des TTC (ou HT) de ses commandes non annulées, et celui de la boutique la somme sur tous les clients.

Une seule fonction calculerCommande(Commande *c) doit faire tout cela : elle reçoit un **pointeur** pour pouvoir écrire dans les champs de la commande. On l’appelle après chaque modification (ajout ou suppression de ligne).`,
      formalDefinition: `- **Passage par valeur** : void f(Commande c) travaille sur une copie ; les modifications sont perdues et la copie coûte sizeof(Commande) octets.
- **Passage par pointeur** : void f(Commande *c) ; accès par c->champ ; les modifications sont visibles par l’appelant.
- **Pointeur constant** : float f(const Commande *c) : lecture seule, vérifiée par le compilateur. À utiliser pour toutes les fonctions d’affichage et de statistiques.
- **Paliers** : on teste dans l’ordre décroissant pour qu’une seule branche s’applique :
    if (brut >= 600) taux = 15; else if (brut >= 300) taux = 10; else if (brut >= 100) taux = 5; else taux = 0;
- **Constantes** (dans types.h) : #define TAUX_TVA 20.0f, #define FRAIS_PORT 5.90f, #define SEUIL_PORT_OFFERT 60.0f, #define EUROS_PAR_POINT 10.
- **Points** : (int)(montantTTC / EUROS_PAR_POINT) : la conversion en int tronque (47,18 € → 4 points).
- **Flottants** : 0.1f + 0.2f n’est pas exactement 0.3f. On n’écrit jamais if (a == b) sur des montants ; on compare à une tolérance (fabs(a - b) < 0.005f) ou on raisonne en centimes entiers. L’affichage %.2f arrondit au centime.
- **Codes de retour** : une fonction qui peut échouer renvoie un int (1 = succès, 0 = échec, ou un code d’erreur), et c’est l’appelant qui affiche le message.`,
      analogy: {
        title: 'La caisse enregistreuse',
        content: `La caissière scanne chaque article (sous-totaux), lit le total brut, regarde l’affiche des remises (palier), applique la remise, ajoute la TVA, ajoute le port si le panier est trop petit, puis imprime le ticket et crédite la carte de fidélité. Si elle appliquait la TVA avant la remise, ou le seuil de port sur le montant remisé, le ticket serait faux : l’ordre des étapes fait partie de la règle.`,
      },
      vocabulary: [
        { fr: 'Règle métier', en: 'Business rule', definition: 'Contrainte imposée par l’activité (remises, TVA, port) que le programme doit respecter exactement.' },
        { fr: 'Palier', en: 'Tier / Bracket', definition: 'Intervalle de valeurs auquel correspond un taux.' },
        { fr: 'Calcul en cascade', en: 'Cascading computation', definition: 'Suite de calculs où chaque résultat sert d’entrée au suivant.' },
        { fr: 'Hors taxes / Toutes taxes comprises', en: 'Excluding tax / Including tax (HT / TTC)', definition: 'Montant avant / après ajout de la TVA.' },
        { fr: 'Qualificateur const', en: 'const qualifier', definition: 'Interdit la modification d’une donnée via ce nom ou ce pointeur.' },
        { fr: 'Erreur d’arrondi', en: 'Rounding error', definition: 'Écart dû à la représentation binaire approchée des nombres décimaux.' },
      ],
      simpleExample: cExample(
        'La grille de remise en une fonction',
        'tauxRemise teste les paliers du plus haut au plus bas ; on vérifie les bornes exactes du sujet.',
        String.raw`#include <stdio.h>

float tauxRemise(float montantBrutHT) {
    if (montantBrutHT >= 600.0f) {
        return 15.0f;
    } else if (montantBrutHT >= 300.0f) {
        return 10.0f;
    } else if (montantBrutHT >= 100.0f) {
        return 5.0f;
    }
    return 0.0f;
}

int main(void) {
    float tests[6] = {99.99f, 100.0f, 299.99f, 300.0f, 599.99f, 600.0f};
    for (int i = 0; i < 6; i++) {
        printf("%7.2f EUR -> %2.0f %%\n", tests[i], tauxRemise(tests[i]));
    }
    return 0;
}`,
        `  99.99 EUR ->  0 %
 100.00 EUR ->  5 %
 299.99 EUR ->  5 %
 300.00 EUR -> 10 %
 599.99 EUR -> 10 %
 600.00 EUR -> 15 %`,
        [
          ['float tauxRemise(float montantBrutHT) {', 'Fonction pure : elle ne lit que son paramètre, on peut la tester isolément.'],
          ['if (montantBrutHT >= 600.0f) {', 'Palier le plus haut d’abord : « supérieur ou égal à 600 € ».'],
          ['} else if (montantBrutHT >= 300.0f) {', 'On sait déjà que brut < 600 : cette branche couvre [300 ; 600[.'],
          ['return 0.0f;', 'Tout le reste (< 100 €) : pas de remise.'],
          ['float tests[6] = {99.99f, 100.0f, 299.99f, 300.0f, 599.99f, 600.0f};', 'Les cas de test sont les BORNES des paliers : c’est là que se cachent les erreurs (> au lieu de >=).'],
          ['printf("%7.2f EUR -> %2.0f %%\\n"', '%7.2f aligne sur 7 caractères ; %% affiche le caractère %.'],
        ]
      ),
      intermediateExample: cExample(
        'calculerCommande : toute la cascade',
        'Deux commandes : la première atteint le palier de 10 % et le port offert, la seconde paie le port.',
        String.raw`#include <stdio.h>

#define TAUX_TVA 20.0f
#define FRAIS_PORT 5.90f
#define SEUIL_PORT_OFFERT 60.0f
#define EUROS_PAR_POINT 10

typedef struct { int quantite; float prixUnitaireHT; float sousTotalHT; } LigneCommande;
typedef struct {
    int numero;
    int nbLignes;
    LigneCommande lignes[5];
    float montantBrutHT, tauxRemise, montantRemise, montantHT;
    float montantTVA, fraisPort, montantTTC;
    int points;
} Commande;

float tauxRemise(float brut) {
    if (brut >= 600.0f) return 15.0f;
    if (brut >= 300.0f) return 10.0f;
    if (brut >= 100.0f) return 5.0f;
    return 0.0f;
}

void calculerCommande(Commande *c) {
    c->montantBrutHT = 0.0f;
    for (int i = 0; i < c->nbLignes; i++) {
        c->lignes[i].sousTotalHT = c->lignes[i].quantite * c->lignes[i].prixUnitaireHT;
        c->montantBrutHT += c->lignes[i].sousTotalHT;
    }
    c->tauxRemise = tauxRemise(c->montantBrutHT);
    c->montantRemise = c->montantBrutHT * c->tauxRemise / 100.0f;
    c->montantHT = c->montantBrutHT - c->montantRemise;
    c->montantTVA = c->montantHT * TAUX_TVA / 100.0f;
    c->fraisPort = (c->montantBrutHT >= SEUIL_PORT_OFFERT) ? 0.0f : FRAIS_PORT;
    c->montantTTC = c->montantHT + c->montantTVA + c->fraisPort;
    c->points = (int)(c->montantTTC / EUROS_PAR_POINT);
}

void afficherTotaux(const Commande *c) {
    printf("Commande %d : brut %.2f, remise %.0f%% (%.2f), HT %.2f, TVA %.2f, port %.2f, TTC %.2f, %d pts\n",
           c->numero, c->montantBrutHT, c->tauxRemise, c->montantRemise, c->montantHT,
           c->montantTVA, c->fraisPort, c->montantTTC, c->points);
}

int main(void) {
    Commande a = {1001, 3, {{2, 80.00f, 0}, {1, 120.00f, 0}, {4, 15.00f, 0}}};
    Commande b = {1002, 2, {{1, 24.50f, 0}, {1, 9.90f, 0}}};
    calculerCommande(&a);
    calculerCommande(&b);
    afficherTotaux(&a);
    afficherTotaux(&b);
    return 0;
}`,
        `Commande 1001 : brut 340.00, remise 10% (34.00), HT 306.00, TVA 61.20, port 0.00, TTC 367.20, 36 pts
Commande 1002 : brut 34.40, remise 0% (0.00), HT 34.40, TVA 6.88, port 5.90, TTC 47.18, 4 pts`,
        [
          ['#define TAUX_TVA 20.0f', 'Toutes les valeurs du sujet sont des constantes nommées : un changement de taux = une seule ligne à modifier.'],
          ['LigneCommande lignes[5];', 'Simplification pour l’exemple : dans ShopFlow, lignes est un tableau dynamique (C04).'],
          ['void calculerCommande(Commande *c) {', 'Pointeur : la fonction remplit les champs de la commande de l’appelant.'],
          ['c->montantBrutHT = 0.0f;', 'On repart de zéro : la fonction peut être rappelée après chaque ajout ou suppression de ligne.'],
          ['c->lignes[i].sousTotalHT = c->lignes[i].quantite * c->lignes[i].prixUnitaireHT;', 'Étape 1 de la cascade : chaque ligne.'],
          ['c->tauxRemise = tauxRemise(c->montantBrutHT);', 'Le palier se décide sur le BRUT.'],
          ['c->montantTVA = c->montantHT * TAUX_TVA / 100.0f;', 'La TVA porte sur le HT après remise.'],
          ['c->fraisPort = (c->montantBrutHT >= SEUIL_PORT_OFFERT) ? 0.0f : FRAIS_PORT;', 'Seuil de port évalué sur le brut avant remise ; le port n’entre pas dans la TVA.'],
          ['c->points = (int)(c->montantTTC / EUROS_PAR_POINT);', 'Une tranche de 10 € = 1 point : 367,20 € → 36 points (troncature).'],
          ['void afficherTotaux(const Commande *c) {', 'Lecture seule : const.'],
        ]
      ),
      commonMistakes: [
        {
          title: 'Paliers testés dans le mauvais ordre',
          wrongCode: `if (brut >= 100) taux = 5;
else if (brut >= 300) taux = 10;  /* jamais atteint */
else if (brut >= 600) taux = 15;  /* jamais atteint */`,
          rightCode: `if (brut >= 600) taux = 15;
else if (brut >= 300) taux = 10;
else if (brut >= 100) taux = 5;
else taux = 0;`,
          explanation: 'Une commande de 700 € satisfait déjà brut >= 100 : elle ne recevrait que 5 %. Avec else if, on teste du palier le plus haut au plus bas.',
          errorType: 'logique',
        },
        {
          title: 'Passer la commande par valeur à la fonction de calcul',
          wrongCode: `void calculerCommande(Commande c) {
    c.montantTTC = ...;   /* modifie une copie */
}
calculerCommande(cmd);    /* cmd.montantTTC inchange */`,
          rightCode: `void calculerCommande(Commande *c) {
    c->montantTTC = ...;
}
calculerCommande(&cmd);`,
          explanation: 'En C, tout est passé par copie. Pour modifier la commande, on transmet son adresse.',
          errorType: 'logique',
        },
        {
          title: 'Appliquer le seuil de port ou la TVA au mauvais montant',
          wrongCode: `c->fraisPort = (c->montantHT >= 60) ? 0 : 5.90f;      /* HT remise */
c->montantTVA = (c->montantHT + c->fraisPort) * 0.20f; /* port taxe */`,
          rightCode: `c->fraisPort = (c->montantBrutHT >= 60) ? 0 : 5.90f;
c->montantTVA = c->montantHT * 0.20f;`,
          explanation: 'Le sujet précise : port offert à partir de 60 € HT BRUT (avant remise), et port non soumis à la TVA.',
          errorType: 'logique',
        },
      ],
      summary: [
        'Ordre imposé : sous-totaux → brut → palier → remise → HT → TVA (sur HT) → port (seuil sur brut) → TTC → points.',
        'Paliers : du plus haut au plus bas avec else if ; tester les bornes 100, 300, 600 et 60.',
        'Fonction qui modifie : Commande * ; fonction qui lit : const Commande *.',
        'Toutes les valeurs du sujet en #define dans types.h.',
        'Jamais == entre float ; affichage %.2f.',
        'Rappeler calculerCommande après toute modification des lignes.',
      ],
      comprehensionQuestions: [
        {
          id: 'C06_Q1',
          question: 'Une commande a un brut de 62 €. Quels sont la remise et les frais de port ?',
          options: ['0 % et 5,90 €', '0 % et port offert', '5 % et port offert', '5 % et 5,90 €'],
          correctIndex: 1,
          explanation: '62 < 100 : pas de remise. 62 ≥ 60 : port offert (le seuil porte sur le brut).',
        },
        {
          id: 'C06_Q2',
          question: 'Pourquoi déclarer `void afficherCommande(const Commande *c)` plutôt que `void afficherCommande(Commande c)` ?',
          options: [
            'Parce que le C interdit de passer une structure par valeur',
            'Pour éviter la copie de toute la structure et garantir que la fonction ne la modifie pas',
            'Pour pouvoir modifier la commande',
            'Il n’y a aucune différence',
          ],
          correctIndex: 1,
          explanation: 'Le pointeur évite la copie ; const documente et vérifie la lecture seule.',
        },
        {
          id: 'C06_Q3',
          question: 'Un client paie 59,99 € TTC. Combien de points de fidélité gagne-t-il ?',
          options: ['6', '5', '0', '59'],
          correctIndex: 1,
          explanation: '59,99 / 10 = 5,999 ; la conversion (int) tronque : 5 tranches complètes de 10 €.',
        },
      ],
    },
    exercises: [
      {
        id: 'C06_E1',
        chapterId: 'C06',
        trackId: 'projet',
        title: 'Prédire les montants d’une commande',
        difficulty: 'debutant',
        category: 'prediction',
        testedSkill: 'Appliquer la cascade remise → TVA → port',
        prerequisites: ['C06'],
        statement: 'Quelle est la sortie exacte de ce programme ?',
        isCoreValidationExercise: true,
        codeSnippet: String.raw`#include <stdio.h>

int main(void) {
    float brut = 3 * 50.00f;
    float taux = 0.0f;
    if (brut >= 600) taux = 15;
    else if (brut >= 300) taux = 10;
    else if (brut >= 100) taux = 5;
    float ht = brut - brut * taux / 100;
    float tva = ht * 20 / 100;
    float port = (brut >= 60) ? 0.0f : 5.90f;
    printf("%.2f %.2f %.2f\n", ht, tva, ht + tva + port);
    return 0;
}`,
        expectedOutputAnswer: '142.50 28.50 171.00',
        hints: [
          'Le brut vaut 150 € : quel palier ?',
          'Remise de 5 % sur 150 € = 7,50 € ; HT = 142,50 €.',
          'TVA = 20 % de 142,50 ; le brut dépasse 60 € donc le port est offert.',
        ],
        detailedExplanation: 'brut = 150 → taux 5 % → HT = 150 − 7,50 = 142,50. TVA = 28,50. Port offert (150 ≥ 60). TTC = 142,50 + 28,50 = 171,00.',
      },
      {
        id: 'C06_E2',
        chapterId: 'C06',
        trackId: 'projet',
        title: 'Facturer une commande à partir de son montant brut',
        difficulty: 'intermediaire',
        category: 'c_code',
        testedSkill: 'Implémenter toutes les règles de facturation du sujet',
        prerequisites: ['C06'],
        statement: `Lisez le montant brut HT d’une commande (float) et affichez exactement :
    Taux remise : T%
    Remise : X.XX
    Montant HT : X.XX
    TVA : X.XX
    Frais de port : X.XX
    Total TTC : X.XX
    Points fidelite : N
(T est un entier : 0, 5, 10 ou 15.) Règles : paliers 100 / 300 / 600 sur le brut, TVA 20 % sur le HT après remise, port 5,90 € offert dès 60 € de brut, 1 point par tranche de 10 € TTC.`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>

#define TAUX_TVA 20.0f
#define FRAIS_PORT 5.90f
#define SEUIL_PORT_OFFERT 60.0f

int tauxRemise(float brut) {
    /* TODO : 0, 5, 10 ou 15 */
    return 0;
}

int main(void) {
    float brut = 0.0f;
    scanf("%f", &brut);
    /* TODO : cascade de calcul et affichage */
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>

#define TAUX_TVA 20.0f
#define FRAIS_PORT 5.90f
#define SEUIL_PORT_OFFERT 60.0f

int tauxRemise(float brut) {
    if (brut >= 600.0f) return 15;
    if (brut >= 300.0f) return 10;
    if (brut >= 100.0f) return 5;
    return 0;
}

int main(void) {
    float brut = 0.0f;
    scanf("%f", &brut);
    int taux = tauxRemise(brut);
    float remise = brut * taux / 100.0f;
    float ht = brut - remise;
    float tva = ht * TAUX_TVA / 100.0f;
    float port = (brut >= SEUIL_PORT_OFFERT) ? 0.0f : FRAIS_PORT;
    float ttc = ht + tva + port;
    int points = (int)(ttc / 10.0f);
    printf("Taux remise : %d%%\n", taux);
    printf("Remise : %.2f\n", remise);
    printf("Montant HT : %.2f\n", ht);
    printf("TVA : %.2f\n", tva);
    printf("Frais de port : %.2f\n", port);
    printf("Total TTC : %.2f\n", ttc);
    printf("Points fidelite : %d\n", points);
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Petit panier 50 € (port payant)', category: 'normal', stdin: '50\n', expectedStdout: 'Taux remise : 0%\nRemise : 0.00\nMontant HT : 50.00\nTVA : 10.00\nFrais de port : 5.90\nTotal TTC : 65.90\nPoints fidelite : 6', explanation: 'Aucune remise, port facturé.' },
          { id: 't2', label: 'Exactement 60 € (port offert)', category: 'limite', stdin: '60\n', expectedStdout: 'Taux remise : 0%\nRemise : 0.00\nMontant HT : 60.00\nTVA : 12.00\nFrais de port : 0.00\nTotal TTC : 72.00\nPoints fidelite : 7', explanation: '« à partir de 60 € » : la borne est incluse.' },
          { id: 't3', label: 'Exactement 100 € (5 %)', category: 'limite', stdin: '100\n', expectedStdout: 'Taux remise : 5%\nRemise : 5.00\nMontant HT : 95.00\nTVA : 19.00\nFrais de port : 0.00\nTotal TTC : 114.00\nPoints fidelite : 11', explanation: 'Borne basse du palier 5 %.' },
          { id: 't4', label: 'Exactement 300 € (10 %)', category: 'limite', stdin: '300\n', expectedStdout: 'Taux remise : 10%\nRemise : 30.00\nMontant HT : 270.00\nTVA : 54.00\nFrais de port : 0.00\nTotal TTC : 324.00\nPoints fidelite : 32', explanation: 'Borne basse du palier 10 %.' },
          { id: 't5', label: 'Exactement 600 € (15 %)', category: 'limite', stdin: '600\n', expectedStdout: 'Taux remise : 15%\nRemise : 90.00\nMontant HT : 510.00\nTVA : 102.00\nFrais de port : 0.00\nTotal TTC : 612.00\nPoints fidelite : 61', explanation: 'Palier maximal.' },
          { id: 't6', label: '59,90 € (juste sous le seuil de port)', category: 'limite', stdin: '59.90\n', expectedStdout: 'Taux remise : 0%\nRemise : 0.00\nMontant HT : 59.90\nTVA : 11.98\nFrais de port : 5.90\nTotal TTC : 77.78\nPoints fidelite : 7', explanation: 'Le port reste dû sous 60 €.' },
        ],
        hints: [
          'tauxRemise : testez 600, puis 300, puis 100, avec >=.',
          'remise = brut * taux / 100.0f ; ht = brut - remise ; tva = ht * TAUX_TVA / 100.0f.',
          'Le port dépend du brut ; points = (int)(ttc / 10.0f) ; pour afficher %, écrivez %% dans printf.',
        ],
        detailedExplanation: 'Les 4 cas limites (60, 100, 300, 600) vérifient l’usage de >= : avec >, chacun de ces montants tomberait dans le palier inférieur. 59,90 € vérifie que le seuil de port est bien appliqué au brut. Notez la division par 100.0f : avec taux entier et 100 entier, taux / 100 vaudrait 0.',
      },
      {
        id: 'C06_E3',
        chapterId: 'C06',
        trackId: 'projet',
        title: 'Corriger le cumul du chiffre d’affaires d’un client',
        difficulty: 'intermediaire',
        category: 'bugfix',
        testedSkill: 'Passage par pointeur et exclusion des commandes annulées',
        prerequisites: ['C06'],
        statement: `Le programme lit n commandes (montant TTC et un indicateur annulee 0/1) d’un client, met à jour son chiffre d’affaires puis l’affiche. Deux bugs :
1. \`ajouterAuCA\` reçoit le client **par valeur** : le CA reste à 0 ;
2. les commandes annulées sont comptées alors que le sujet les exclut du chiffre d’affaires.
Corrigez-les. Affichage attendu : « CA client 3 : X.XX (k commandes) » où k est le nombre de commandes comptées.`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>

typedef struct {
    int idClient;
    float chiffreAffaires;
    int nbCommandesComptees;
} Client;

void ajouterAuCA(Client c, float montantTTC, int annulee) {
    c.chiffreAffaires += montantTTC;
    c.nbCommandesComptees++;
}

int main(void) {
    Client cl = {3, 0.0f, 0};
    int n = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        float ttc = 0.0f;
        int annulee = 0;
        scanf("%f %d", &ttc, &annulee);
        ajouterAuCA(cl, ttc, annulee);
    }
    printf("CA client %d : %.2f (%d commandes)\n", cl.idClient, cl.chiffreAffaires, cl.nbCommandesComptees);
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>

typedef struct {
    int idClient;
    float chiffreAffaires;
    int nbCommandesComptees;
} Client;

void ajouterAuCA(Client *c, float montantTTC, int annulee) {
    if (annulee) {
        return;
    }
    c->chiffreAffaires += montantTTC;
    c->nbCommandesComptees++;
}

int main(void) {
    Client cl = {3, 0.0f, 0};
    int n = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        float ttc = 0.0f;
        int annulee = 0;
        scanf("%f %d", &ttc, &annulee);
        ajouterAuCA(&cl, ttc, annulee);
    }
    printf("CA client %d : %.2f (%d commandes)\n", cl.idClient, cl.chiffreAffaires, cl.nbCommandesComptees);
    return 0;
}
`,
        testCases: [
          { id: 't1', label: '3 commandes dont 1 annulée', category: 'normal', stdin: '3\n367.20 0\n47.18 1\n114.00 0\n', expectedStdout: 'CA client 3 : 481.20 (2 commandes)', explanation: '367,20 + 114,00 ; la commande annulée est ignorée.' },
          { id: 't2', label: 'Aucune annulation', category: 'normal', stdin: '2\n65.90 0\n72.00 0\n', expectedStdout: 'CA client 3 : 137.90 (2 commandes)', explanation: 'Les deux commandes comptent.' },
          { id: 't3', label: 'Toutes annulées', category: 'limite', stdin: '2\n100.00 1\n50.00 1\n', expectedStdout: 'CA client 3 : 0.00 (0 commandes)', explanation: 'Un client dont toutes les commandes sont annulées n’a généré aucun chiffre d’affaires.' },
        ],
        hints: [
          'Changez le paramètre en Client *c et utilisez c->champ dans la fonction.',
          'À l’appel : ajouterAuCA(&cl, ttc, annulee);',
          'Au début de la fonction : if (annulee) return;',
        ],
        detailedExplanation: 'Avec Client c, la fonction incrémente une copie détruite à sa sortie : le CA de cl reste 0. Avec Client *c, elle modifie le client du main. Le test sur annulee applique la règle du sujet : « le chiffre d’affaires et les deux palmarès excluent les commandes au statut ANNULEE ».',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE C07 — ÉNUMÉRATIONS ET MACHINE À ÉTATS DES COMMANDES
  // ==========================================================================
  {
    id: 'C07',
    trackId: 'projet',
    number: 7,
    title: 'Statuts de commande : énumérations et machine à états',
    subtitle: 'EN_COURS → EXPEDIEE → LIVREE, annulation possible seulement en cours : coder et contrôler les transitions.',
    estimatedMinutes: 45,
    prerequisites: ['B06', 'C03', 'C06'],
    relatedChapters: ['B06', 'C08'],
    coreConcepts: ['enum', 'switch', 'machine à états', 'transition autorisée', 'conversion texte ↔ statut', 'effets de bord d’une transition'],
    successCriteria: [
      'Représenter les 4 statuts par un enum ou par des chaînes contrôlées',
      'Écrire une fonction qui refuse toute transition interdite',
      'Lister les effets d’une annulation (stock réintégré, points retirés)',
    ],
    lesson: {
      objectives: [
        'Déclarer un type énuméré typedef enum { EN_COURS, EXPEDIEE, LIVREE, ANNULEE } Statut',
        'Convertir un statut en texte (switch) et un texte en statut (strcmp)',
        'Dessiner la machine à états des commandes et la traduire en code',
        'Centraliser les contrôles de transition dans une seule fonction qui renvoie 1 ou 0',
        'Déclencher les effets de bord d’une transition au bon endroit (annulation)',
      ],
      intuition: `Une commande passe par des **états** successifs. Le sujet n’autorise que trois transitions :
- EN_COURS → EXPEDIEE
- EXPEDIEE → LIVREE
- EN_COURS → ANNULEE
LIVREE et ANNULEE sont des **états finaux** : on n’en sort plus. Pas de retour en arrière (une commande livrée ne redevient pas expédiée).

C’est une **machine à états**. Le piège classique est de disperser les tests de statut un peu partout dans le programme. Mieux vaut une seule fonction, \`changerStatut\`, qui sait quelles transitions sont permises, et que tous les menus appellent.

Le sujet déclare statut comme char[20]. On peut garder ce champ texte (et comparer avec strcmp), ou — plus sûr — utiliser un **enum** en interne et ne convertir en texte qu’à l’affichage. Avec un enum, le compilateur refuse une faute de frappe comme EXPEDIE, alors que la chaîne "EXPEDIE" serait acceptée sans broncher.

Enfin, une transition peut avoir des **effets** : l’annulation réintègre le stock de chaque ligne et retire au client les points de fidélité gagnés avec cette commande.`,
      formalDefinition: `- **Énumération** :
    typedef enum { EN_COURS, EXPEDIEE, LIVREE, ANNULEE } Statut;
  Les constantes valent 0, 1, 2, 3. Une variable Statut s’utilise comme un int.
- **Vers texte** :
    const char *statutTexte(Statut s) { switch (s) { case EN_COURS: return "EN_COURS"; ... } }
- **Depuis texte** : boucle sur les libellés avec strcmp ; renvoyer -1 si inconnu.
- **Table des transitions** (ligne = statut actuel, colonne = statut demandé) :
                 EXPEDIEE  LIVREE  ANNULEE
    EN_COURS       oui      non     oui
    EXPEDIEE       non      oui     non
    LIVREE         non      non     non
    ANNULEE        non      non     non
- **Fonction de contrôle** :
    int transitionAutorisee(Statut actuel, Statut demande)
    int changerStatut(Commande *c, Statut demande)   /* 1 si fait, 0 si refusé */
- **Garde des autres opérations** : ajouter ou supprimer une ligne n’est possible que si statut == EN_COURS.
- **Effets de l’annulation** : pour chaque ligne, produit.quantiteStock += ligne.quantite ; client.pointsFidelite -= points de la commande ; la commande sort du CA et des palmarès.
- Si vous gardez char statut[20] comme dans le sujet, copiez toujours les libellés depuis des constantes (strcpy(c->statut, "EXPEDIEE")) et comparez avec strcmp.`,
      analogy: {
        title: 'Le suivi d’un colis',
        content: `Sur un site de suivi de colis, l’état avance toujours dans le même sens : « préparation », « expédié », « livré ». Le transporteur ne peut pas « dé-livrer » un colis, et on ne peut annuler l’envoi que tant qu’il est encore en préparation. Le guichet unique changerStatut joue le rôle du transporteur : c’est lui seul qui tamponne les changements d’état, et il refuse ceux qui ne sont pas dans son règlement.`,
      },
      vocabulary: [
        { fr: 'Énumération', en: 'Enumeration (enum)', definition: 'Type dont les valeurs sont des constantes entières nommées.' },
        { fr: 'Machine à états', en: 'State machine', definition: 'Modèle où un objet a un état courant et ne change d’état que par des transitions autorisées.' },
        { fr: 'Transition', en: 'Transition', definition: 'Passage d’un état à un autre.' },
        { fr: 'État final', en: 'Final / terminal state', definition: 'État dont on ne peut plus sortir (LIVREE, ANNULEE).' },
        { fr: 'Effet de bord', en: 'Side effect', definition: 'Modification d’autres données déclenchée par une opération (ex. stock réintégré).' },
        { fr: 'Aiguillage', en: 'switch statement', definition: 'Instruction qui choisit une branche selon une valeur entière.' },
      ],
      simpleExample: cExample(
        'Un enum Statut et sa conversion en texte',
        'Le compilateur vérifie les noms des statuts ; le switch ne sert qu’à l’affichage.',
        String.raw`#include <stdio.h>

typedef enum { EN_COURS, EXPEDIEE, LIVREE, ANNULEE } Statut;

const char *statutTexte(Statut s) {
    switch (s) {
        case EN_COURS: return "EN_COURS";
        case EXPEDIEE: return "EXPEDIEE";
        case LIVREE:   return "LIVREE";
        case ANNULEE:  return "ANNULEE";
    }
    return "INCONNU";
}

int main(void) {
    Statut s = EN_COURS;
    printf("Statut initial : %s (valeur %d)\n", statutTexte(s), s);
    s = EXPEDIEE;
    printf("Apres expedition : %s (valeur %d)\n", statutTexte(s), s);
    for (int i = EN_COURS; i <= ANNULEE; i++) {
        printf("%d=%s ", i, statutTexte(i));
    }
    printf("\n");
    return 0;
}`,
        `Statut initial : EN_COURS (valeur 0)
Apres expedition : EXPEDIEE (valeur 1)
0=EN_COURS 1=EXPEDIEE 2=LIVREE 3=ANNULEE `,
        [
          ['typedef enum { EN_COURS, EXPEDIEE, LIVREE, ANNULEE } Statut;', 'Quatre constantes : EN_COURS = 0, EXPEDIEE = 1, LIVREE = 2, ANNULEE = 3.'],
          ['const char *statutTexte(Statut s) {', 'Renvoie l’adresse d’une chaîne littérale (stockée en lecture seule) : pas besoin de malloc.'],
          ['case EN_COURS: return "EN_COURS";', 'return sort du switch : pas besoin de break.'],
          ['return "INCONNU";', 'Filet de sécurité si une valeur hors de l’enum arrivait.'],
          ['printf("Statut initial : %s (valeur %d)\\n", statutTexte(s), s);', 'Un enum s’affiche comme un entier avec %d.'],
          ['for (int i = EN_COURS; i <= ANNULEE; i++) {', 'Les valeurs étant consécutives, on peut parcourir tous les statuts.'],
        ]
      ),
      intermediateExample: cExample(
        'changerStatut : la seule porte d’entrée des transitions',
        'On rejoue un scénario : expédition, tentative d’annulation refusée, livraison, tentative de retour refusée.',
        String.raw`#include <stdio.h>

typedef enum { EN_COURS, EXPEDIEE, LIVREE, ANNULEE } Statut;
typedef struct { int numero; Statut statut; } Commande;

const char *statutTexte(Statut s) {
    switch (s) {
        case EN_COURS: return "EN_COURS";
        case EXPEDIEE: return "EXPEDIEE";
        case LIVREE:   return "LIVREE";
        default:       return "ANNULEE";
    }
}

int transitionAutorisee(Statut actuel, Statut demande) {
    switch (actuel) {
        case EN_COURS: return demande == EXPEDIEE || demande == ANNULEE;
        case EXPEDIEE: return demande == LIVREE;
        default:       return 0;
    }
}

int changerStatut(Commande *c, Statut demande) {
    if (!transitionAutorisee(c->statut, demande)) {
        printf("  REFUS : %s -> %s\n", statutTexte(c->statut), statutTexte(demande));
        return 0;
    }
    printf("  OK    : %s -> %s\n", statutTexte(c->statut), statutTexte(demande));
    c->statut = demande;
    return 1;
}

int main(void) {
    Commande c = {1003, EN_COURS};
    Statut scenario[4] = {EXPEDIEE, ANNULEE, LIVREE, EXPEDIEE};
    int reussies = 0;
    for (int i = 0; i < 4; i++) {
        reussies += changerStatut(&c, scenario[i]);
    }
    printf("Commande %d : %s (%d transitions acceptees)\n", c.numero, statutTexte(c.statut), reussies);
    return 0;
}`,
        `  OK    : EN_COURS -> EXPEDIEE
  REFUS : EXPEDIEE -> ANNULEE
  OK    : EXPEDIEE -> LIVREE
  REFUS : LIVREE -> EXPEDIEE
Commande 1003 : LIVREE (2 transitions acceptees)`,
        [
          ['int transitionAutorisee(Statut actuel, Statut demande) {', 'La table des transitions du sujet, codée une seule fois.'],
          ['case EN_COURS: return demande == EXPEDIEE || demande == ANNULEE;', 'Depuis EN_COURS : expédier ou annuler.'],
          ['case EXPEDIEE: return demande == LIVREE;', 'Une commande expédiée ne peut plus être annulée.'],
          ['default:       return 0;', 'LIVREE et ANNULEE sont des états finaux.'],
          ['int changerStatut(Commande *c, Statut demande) {', 'Tous les menus passent par ici : aucun autre code n’écrit c->statut.'],
          ['c->statut = demande;', 'La modification n’a lieu qu’après validation. C’est ici qu’on déclencherait aussi les effets de l’annulation.'],
          ['reussies += changerStatut(&c, scenario[i]);', 'Le code de retour 1/0 permet de compter les succès.'],
        ]
      ),
      commonMistakes: [
        {
          title: 'Comparer le statut texte avec ==',
          wrongCode: `if (c->statut == "EN_COURS") { /* jamais vrai */ }`,
          rightCode: `if (strcmp(c->statut, "EN_COURS") == 0) { ... }
/* ou mieux : Statut statut; if (c->statut == EN_COURS) */`,
          explanation: 'Avec char statut[20], == compare des adresses. Avec un enum, == compare des entiers et fonctionne.',
          errorType: 'logique',
        },
        {
          title: 'Autoriser l’annulation d’une commande expédiée',
          wrongCode: `if (c->statut != ANNULEE) {
    c->statut = ANNULEE;   /* accepte EXPEDIEE et LIVREE ! */
}`,
          rightCode: `if (c->statut == EN_COURS) {
    reintegrerStock(b, c);
    c->statut = ANNULEE;
}`,
          explanation: 'Le sujet : « l’annulation n’est possible qu’au statut EN_COURS ». Il faut tester l’état autorisé, pas l’état interdit.',
          errorType: 'logique',
        },
        {
          title: 'Oublier les effets de bord de l’annulation',
          wrongCode: `c->statut = ANNULEE;  /* le stock reste decremente,
                         les points restent credites */`,
          rightCode: `for (int i = 0; i < c->nbLignes; i++) {
    Produit *p = trouverProduit(b, c->lignes[i].refProduit);
    if (p != NULL) p->quantiteStock += c->lignes[i].quantite;
}
client->pointsFidelite -= pointsDeLaCommande(c);
c->statut = ANNULEE;`,
          explanation: 'Une annulation doit défaire tout ce que la création avait fait : cohérence du stock et des points de fidélité.',
          errorType: 'logique',
        },
      ],
      summary: [
        'typedef enum { EN_COURS, EXPEDIEE, LIVREE, ANNULEE } Statut; valeurs 0 à 3.',
        'Transitions autorisées : EN_COURS→EXPEDIEE, EXPEDIEE→LIVREE, EN_COURS→ANNULEE ; rien depuis LIVREE ou ANNULEE.',
        'Une seule fonction changerStatut contrôle et applique les transitions.',
        'Ajout/suppression de ligne seulement si statut == EN_COURS.',
        'Annulation : stock réintégré, points retirés, commande exclue du CA et des palmarès.',
        'Avec char statut[20] : strcpy pour écrire, strcmp pour comparer.',
      ],
      comprehensionQuestions: [
        {
          id: 'C07_Q1',
          question: 'Quelle transition est autorisée par le sujet ?',
          options: ['LIVREE → EXPEDIEE', 'EXPEDIEE → ANNULEE', 'EN_COURS → ANNULEE', 'ANNULEE → EN_COURS'],
          correctIndex: 2,
          explanation: 'L’annulation n’est possible qu’au statut EN_COURS ; aucun retour en arrière n’est permis.',
        },
        {
          id: 'C07_Q2',
          question: 'Avec `typedef enum { EN_COURS, EXPEDIEE, LIVREE, ANNULEE } Statut;`, que vaut LIVREE ?',
          options: ['1', '2', '3', '"LIVREE"'],
          correctIndex: 1,
          explanation: 'La numérotation commence à 0 : EN_COURS = 0, EXPEDIEE = 1, LIVREE = 2.',
        },
        {
          id: 'C07_Q3',
          question: 'Quel est l’intérêt principal d’un enum par rapport à des chaînes "EN_COURS", "EXPEDIEE"… ?',
          options: [
            'Il prend plus de place',
            'Le compilateur détecte les fautes de frappe et la comparaison se fait avec ==',
            'Il s’affiche automatiquement en texte avec printf',
            'Il empêche toute transition interdite tout seul',
          ],
          correctIndex: 1,
          explanation: 'Un enum est un entier nommé : comparaison simple et noms vérifiés. Mais il ne contrôle pas les transitions : c’est le rôle de changerStatut.',
        },
      ],
    },
    exercises: [
      {
        id: 'C07_E1',
        chapterId: 'C07',
        trackId: 'projet',
        title: 'Choisir le bon test pour autoriser l’annulation',
        difficulty: 'debutant',
        category: 'qcm',
        testedSkill: 'Traduire une règle de transition en condition',
        prerequisites: ['C07'],
        statement: 'Quelle condition autorise exactement l’annulation d’une commande, selon le sujet ?',
        isCoreValidationExercise: true,
        options: [
          'if (c->statut != ANNULEE)',
          'if (c->statut != LIVREE)',
          'if (c->statut == EN_COURS)',
          'if (c->statut <= LIVREE)',
        ],
        correctOptionIndex: 2,
        hints: [
          'Relisez la règle : « l’annulation n’est possible qu’au statut… ».',
          'Une commande EXPEDIEE peut-elle être annulée ?',
          'Testez l’unique état autorisé plutôt que d’exclure des états interdits.',
        ],
        detailedExplanation: 'Seul EN_COURS permet l’annulation. Les options 1, 2 et 4 laissent passer EXPEDIEE (et parfois LIVREE). Tester l’état autorisé est plus robuste : si un statut était ajouté plus tard, il serait refusé par défaut.',
      },
      {
        id: 'C07_E2',
        chapterId: 'C07',
        trackId: 'projet',
        title: 'Tracer un scénario de changements de statut',
        difficulty: 'debutant',
        category: 'trace',
        testedSkill: 'Dérouler une machine à états avec stock et points',
        prerequisites: ['C07'],
        statement: 'La commande 1005 contient 3 Casques audio : sa création a fait passer le stock du casque de 25 à 22, et elle a rapporté 32 points au client (qui en a maintenant 50). Complétez la table : statut, stock du casque et points du client après chaque demande. Une demande refusée ne change rien.',
        isCoreValidationExercise: true,
        traceSpec: {
          language: 'c',
          code: String.raw`/* Demandes successives sur la commande 1005 */
changerStatut(&c, EXPEDIEE);
annulerCommande(&b, &c);      /* refusee si statut != EN_COURS */
changerStatut(&c, LIVREE);
changerStatut(&c, EN_COURS);`,
          columns: ['Demande', 'Acceptée ?', 'statut', 'stock casque', 'points client'],
          prefilledRows: [
            { Demande: '(création)', 'Acceptée ?': '-', statut: 'EN_COURS', 'stock casque': '22', 'points client': '50' },
            { Demande: 'EXPEDIEE', 'Acceptée ?': 'oui', statut: '?', 'stock casque': '22', 'points client': '50' },
            { Demande: 'Annulation', 'Acceptée ?': '?', statut: 'EXPEDIEE', 'stock casque': '?', 'points client': '?' },
            { Demande: 'LIVREE', 'Acceptée ?': 'oui', statut: '?', 'stock casque': '22', 'points client': '50' },
            { Demande: 'EN_COURS', 'Acceptée ?': '?', statut: '?', 'stock casque': '22', 'points client': '50' },
          ],
          expectedAnswers: {
            '1:statut': 'EXPEDIEE',
            '2:Acceptée ?': 'non',
            '2:stock casque': '22',
            '2:points client': '50',
            '3:statut': 'LIVREE',
            '4:Acceptée ?': 'non',
            '4:statut': 'LIVREE',
          },
        },
        hints: [
          'Après l’expédition, la commande n’est plus EN_COURS.',
          'Une annulation refusée ne réintègre pas le stock et ne retire pas de points.',
          'LIVREE est un état final : aucun retour vers EN_COURS.',
        ],
        detailedExplanation: 'EXPEDIEE est accepté ; l’annulation est refusée (statut EXPEDIEE), donc stock 22 et 50 points inchangés ; LIVREE est accepté ; le retour à EN_COURS est refusé et la commande reste LIVREE. Si l’annulation avait eu lieu avant l’expédition, on aurait eu stock 25 et 18 points.',
      },
      {
        id: 'C07_E3',
        chapterId: 'C07',
        trackId: 'projet',
        title: 'Appliquer une action sur un statut lu au clavier',
        difficulty: 'intermediaire',
        category: 'c_code',
        testedSkill: 'Conversion texte → enum, table de transitions, messages',
        prerequisites: ['C07'],
        statement: `Le programme lit un statut actuel et une action (deux mots), par exemple « EN_COURS AVANCER ».
- AVANCER : EN_COURS → EXPEDIEE, EXPEDIEE → LIVREE ;
- ANNULER : EN_COURS → ANNULEE.
Affichez « Nouveau statut : X » si l’action est permise, sinon « REFUS : X est un statut final » pour LIVREE/ANNULEE ou « REFUS : action impossible depuis X » sinon. Si le statut n’est pas l’un des 4 libellés, affichez « STATUT INCONNU » ; si l’action n’est ni AVANCER ni ANNULER, « ACTION INCONNUE ».`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>
#include <string.h>

typedef enum { EN_COURS, EXPEDIEE, LIVREE, ANNULEE } Statut;

const char *LIBELLES[4] = {"EN_COURS", "EXPEDIEE", "LIVREE", "ANNULEE"};

int texteVersStatut(const char *texte) {
    /* TODO : renvoyer 0..3, ou -1 si inconnu */
    return -1;
}

int main(void) {
    char texte[20], action[20];
    scanf("%19s %19s", texte, action);
    /* TODO */
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <string.h>

typedef enum { EN_COURS, EXPEDIEE, LIVREE, ANNULEE } Statut;

const char *LIBELLES[4] = {"EN_COURS", "EXPEDIEE", "LIVREE", "ANNULEE"};

int texteVersStatut(const char *texte) {
    for (int i = 0; i < 4; i++) {
        if (strcmp(texte, LIBELLES[i]) == 0) {
            return i;
        }
    }
    return -1;
}

int main(void) {
    char texte[20], action[20];
    scanf("%19s %19s", texte, action);
    int s = texteVersStatut(texte);
    if (s < 0) {
        printf("STATUT INCONNU\n");
        return 0;
    }
    int avancer = strcmp(action, "AVANCER") == 0;
    int annuler = strcmp(action, "ANNULER") == 0;
    if (!avancer && !annuler) {
        printf("ACTION INCONNUE\n");
        return 0;
    }
    if (s == LIVREE || s == ANNULEE) {
        printf("REFUS : %s est un statut final\n", LIBELLES[s]);
        return 0;
    }
    int nouveau = -1;
    if (avancer) {
        nouveau = (s == EN_COURS) ? EXPEDIEE : LIVREE;
    } else if (s == EN_COURS) {
        nouveau = ANNULEE;
    }
    if (nouveau < 0) {
        printf("REFUS : action impossible depuis %s\n", LIBELLES[s]);
    } else {
        printf("Nouveau statut : %s\n", LIBELLES[nouveau]);
    }
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'EN_COURS AVANCER', category: 'normal', stdin: 'EN_COURS AVANCER\n', expectedStdout: 'Nouveau statut : EXPEDIEE', explanation: 'Première étape de progression.' },
          { id: 't2', label: 'EXPEDIEE AVANCER', category: 'normal', stdin: 'EXPEDIEE AVANCER\n', expectedStdout: 'Nouveau statut : LIVREE', explanation: 'Livraison.' },
          { id: 't3', label: 'EN_COURS ANNULER', category: 'normal', stdin: 'EN_COURS ANNULER\n', expectedStdout: 'Nouveau statut : ANNULEE', explanation: 'Seul cas d’annulation autorisé.' },
          { id: 't4', label: 'EXPEDIEE ANNULER', category: 'invalide', stdin: 'EXPEDIEE ANNULER\n', expectedStdout: 'REFUS : action impossible depuis EXPEDIEE', explanation: 'Trop tard pour annuler.' },
          { id: 't5', label: 'LIVREE AVANCER', category: 'limite', stdin: 'LIVREE AVANCER\n', expectedStdout: 'REFUS : LIVREE est un statut final', explanation: 'État final.' },
          { id: 't6', label: 'ANNULEE ANNULER', category: 'limite', stdin: 'ANNULEE ANNULER\n', expectedStdout: 'REFUS : ANNULEE est un statut final', explanation: 'On n’annule pas deux fois (le stock serait réintégré deux fois !).' },
          { id: 't7', label: 'Statut mal orthographié', category: 'invalide', stdin: 'EXPEDIE AVANCER\n', expectedStdout: 'STATUT INCONNU', explanation: 'Faute de frappe détectée.' },
          { id: 't8', label: 'Action inconnue', category: 'invalide', stdin: 'EN_COURS RETOUR\n', expectedStdout: 'ACTION INCONNUE', explanation: 'Seules deux actions existent.' },
        ],
        hints: [
          'texteVersStatut : boucle sur LIBELLES avec strcmp(texte, LIBELLES[i]) == 0.',
          'Traitez les erreurs dans l’ordre : statut inconnu, action inconnue, statut final.',
          'AVANCER : EN_COURS donne EXPEDIEE, EXPEDIEE donne LIVREE ; ANNULER n’est possible que depuis EN_COURS.',
        ],
        detailedExplanation: 'Le tableau LIBELLES sert dans les deux sens : l’indice i correspond à la valeur de l’enum, donc LIBELLES[s] donne le texte et la recherche par strcmp donne l’enum. Le test « ANNULEE ANNULER » montre pourquoi le contrôle des transitions est vital : sans lui, une double annulation réintégrerait deux fois le stock.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE C08 — RECHERCHE, UNICITÉ, SUPPRESSION LOGIQUE ET COHÉRENCE DU STOCK
  // ==========================================================================
  {
    id: 'C08',
    trackId: 'projet',
    number: 8,
    title: 'Recherche, unicité, suppression logique et cohérence du stock',
    subtitle: 'Identifiants attribués par compteur, références uniques, actif = 0, lignes fusionnées et stock toujours juste.',
    estimatedMinutes: 55,
    prerequisites: ['B13', 'C03', 'C04', 'C07'],
    relatedChapters: ['A12', 'C04', 'C07'],
    coreConcepts: ['recherche séquentielle', 'renvoi d’indice ou de pointeur', 'contrôle d’unicité', 'suppression logique', 'compteurs auto-incrémentés', 'intégrité référentielle', 'stock'],
    successCriteria: [
      'Écrire une fonction de recherche qui renvoie un indice (-1) ou un pointeur (NULL)',
      'Appliquer les contrôles d’unicité sur tous les enregistrements, actifs ou non',
      'Garder le stock cohérent lors de la création, de la suppression de ligne et de l’annulation',
    ],
    lesson: {
      objectives: [
        'Rechercher un produit par référence et un client par identifiant',
        'Choisir entre renvoyer un indice et renvoyer un pointeur (et connaître le piège du pointeur après realloc)',
        'Implémenter la suppression logique (actif = 0) et les refus de suppression imposés par le sujet',
        'Attribuer numéros de commande et identifiants clients par les compteurs de Boutique',
        'Fusionner deux lignes de même référence et contrôler le stock sur la quantité cumulée',
      ],
      intuition: `Dans une base de données, chaque enregistrement est identifié de façon **unique** : une référence produit, un email client, un numéro de commande. Les règles 7 à 10 du sujet en découlent toutes.

**Rechercher** : on parcourt le tableau et on compare la clé (strcmp pour une référence, == pour un id). On renvoie l’indice trouvé, ou -1.

**Unicité** : avant d’ajouter un produit, on vérifie qu’aucun produit — **même désactivé** — n’a déjà cette référence. Sinon, réactiver plus tard l’ancien produit créerait deux PRD-0001.

**Suppression logique** : on ne retire pas la case du tableau (les commandes passées référencent encore ce produit !) ; on passe actif à 0. Les affichages et les nouvelles commandes ignorent les inactifs. Le sujet refuse la suppression d’un produit présent dans une commande non annulée, et d’un client qui a des commandes non annulées.

**Compteurs** : numeroSuivant et idClientSuivant dans Boutique fournissent les identifiants ; on ne les demande jamais à l’utilisateur, et on ne les réutilise jamais.

**Stock** : créer une commande décrémente le stock de chaque ligne ; supprimer une ligne d’une commande EN_COURS ou annuler la commande le réintègre. Une commande ne contient jamais deux lignes de même référence : si l’utilisateur saisit deux fois PRD-0001, on additionne les quantités — et on vérifie le stock sur le **total**.`,
      formalDefinition: `- **Recherche par clé** (O(n)) :
    int indiceProduit(const Boutique *b, const char *ref) {
        for (int i = 0; i < b->nbProduits; i++)
            if (strcmp(b->produits[i].reference, ref) == 0) return i;
        return -1;
    }
  Variante : renvoyer Produit * (ou NULL). Attention : un pointeur vers une case devient invalide si le tableau est agrandi par realloc ; un indice reste valable.
- **Unicité** : la recherche porte sur TOUS les éléments, sans filtrer actif. Pour l’email : strcmp sur tous les clients.
- **Suppression logique** : p->actif = 0 ; aucune libération, aucun décalage. Les listes et les saisies de commande testent actif == 1.
- **Refus de suppression** : produit utilisé dans une ligne d’une commande dont statut != ANNULEE ; client possédant une commande dont statut != ANNULEE.
- **Compteurs** : c.numero = b->numeroSuivant++ ; nouveauClient.idClient = b->idClientSuivant++.
- **Intégrité référentielle** : toute LigneCommande.refProduit existe au catalogue ; toute Commande.idClient existe ; la désignation et le prix sont **figés** dans la ligne au moment de la vente.
- **Ligne unique par référence** : si la ligne existe, nouvelleQte = ligne.quantite + qte ; accepter seulement si nouvelleQte ≤ stock disponible (stock initial avant la commande).
- **Invariant du stock** : stock courant = stock initial − quantités des lignes des commandes non annulées.`,
      analogy: {
        title: 'La médiathèque',
        content: `Chaque livre a une cote unique, même celui qui est retiré des rayons pour réparation : on ne recycle pas sa cote, sinon les anciennes fiches d’emprunt deviendraient ambiguës. Retirer un livre du catalogue public, c’est le marquer « hors circulation » (actif = 0), pas déchirer sa fiche. Et le compteur de l’accueil distribue les numéros de carte d’adhérent : personne ne choisit le sien.`,
      },
      vocabulary: [
        { fr: 'Clé', en: 'Key', definition: 'Champ qui identifie un enregistrement de façon unique (référence, email, numéro).' },
        { fr: 'Recherche séquentielle', en: 'Linear search', definition: 'Parcours élément par élément jusqu’à trouver la clé ; O(n).' },
        { fr: 'Contrainte d’unicité', en: 'Uniqueness constraint', definition: 'Interdiction de deux enregistrements avec la même clé.' },
        { fr: 'Suppression logique', en: 'Soft delete', definition: 'Marquage d’un enregistrement comme inactif au lieu de l’effacer.' },
        { fr: 'Identifiant auto-incrémenté', en: 'Auto-increment ID', definition: 'Identifiant fourni par un compteur qui augmente à chaque création.' },
        { fr: 'Intégrité référentielle', en: 'Referential integrity', definition: 'Garantie qu’une référence (refProduit, idClient) désigne un élément existant.' },
        { fr: 'Invariant', en: 'Invariant', definition: 'Propriété toujours vraie entre deux opérations (ex. cohérence du stock).' },
      ],
      simpleExample: cExample(
        'Recherche, unicité et suppression logique dans le catalogue',
        'Un produit désactivé disparaît de la liste mais bloque toujours la réutilisation de sa référence.',
        String.raw`#include <stdio.h>
#include <string.h>

typedef struct {
    char reference[12];
    char designation[60];
    int actif;
} Produit;

int indiceProduit(const Produit cat[], int nb, const char *ref) {
    for (int i = 0; i < nb; i++) {
        if (strcmp(cat[i].reference, ref) == 0) {
            return i;
        }
    }
    return -1;
}

void afficherActifs(const Produit cat[], int nb) {
    for (int i = 0; i < nb; i++) {
        if (cat[i].actif) {
            printf("  %s %s\n", cat[i].reference, cat[i].designation);
        }
    }
}

int main(void) {
    Produit cat[3] = {
        {"PRD-0001", "Clavier mecanique", 1},
        {"PRD-0002", "Souris sans fil", 1},
        {"PRD-0003", "Ecran 27 pouces", 1}
    };
    int nb = 3;

    int i = indiceProduit(cat, nb, "PRD-0002");
    cat[i].actif = 0;
    printf("Catalogue apres suppression logique :\n");
    afficherActifs(cat, nb);

    if (indiceProduit(cat, nb, "PRD-0002") >= 0) {
        printf("Ajout de PRD-0002 refuse : reference deja utilisee\n");
    }
    printf("Recherche PRD-0009 : indice %d\n", indiceProduit(cat, nb, "PRD-0009"));
    return 0;
}`,
        `Catalogue apres suppression logique :
  PRD-0001 Clavier mecanique
  PRD-0003 Ecran 27 pouces
Ajout de PRD-0002 refuse : reference deja utilisee
Recherche PRD-0009 : indice -1`,
        [
          ['int indiceProduit(const Produit cat[], int nb, const char *ref) {', 'Recherche sur TOUS les produits : pas de test sur actif ici.'],
          ['if (strcmp(cat[i].reference, ref) == 0) {', 'Comparaison du contenu des chaînes.'],
          ['return -1;', 'Valeur sentinelle : -1 n’est jamais un indice valide.'],
          ['if (cat[i].actif) {', 'Seuls les affichages filtrent les produits désactivés.'],
          ['cat[i].actif = 0;', 'Suppression logique : la case reste, les commandes passées restent cohérentes.'],
          ['if (indiceProduit(cat, nb, "PRD-0002") >= 0) {', 'Le contrôle d’unicité voit encore le produit désactivé : ajout refusé.'],
        ]
      ),
      intermediateExample: cExample(
        'Lignes uniques et stock : création, fusion, suppression de ligne, annulation',
        'Le stock est décrémenté à chaque ligne acceptée et réintégré à la suppression de ligne et à l’annulation.',
        String.raw`#include <stdio.h>
#include <string.h>

typedef struct { char reference[12]; int quantiteStock; } Produit;
typedef struct { char refProduit[12]; int quantite; } LigneCommande;
typedef struct { int nbLignes; LigneCommande lignes[5]; } Commande;

int indiceProduit(const Produit cat[], int nb, const char *ref) {
    for (int i = 0; i < nb; i++) {
        if (strcmp(cat[i].reference, ref) == 0) return i;
    }
    return -1;
}

int ajouterLigne(Commande *c, Produit cat[], int nb, const char *ref, int qte) {
    int ip = indiceProduit(cat, nb, ref);
    if (ip < 0 || qte <= 0) return 0;
    for (int i = 0; i < c->nbLignes; i++) {
        if (strcmp(c->lignes[i].refProduit, ref) == 0) {
            if (qte > cat[ip].quantiteStock) return 0;
            c->lignes[i].quantite += qte;
            cat[ip].quantiteStock -= qte;
            return 1;
        }
    }
    if (qte > cat[ip].quantiteStock || c->nbLignes == 5) return 0;
    strcpy(c->lignes[c->nbLignes].refProduit, ref);
    c->lignes[c->nbLignes].quantite = qte;
    c->nbLignes++;
    cat[ip].quantiteStock -= qte;
    return 1;
}

void supprimerLigne(Commande *c, Produit cat[], int nb, int k) {
    int ip = indiceProduit(cat, nb, c->lignes[k].refProduit);
    cat[ip].quantiteStock += c->lignes[k].quantite;
    c->lignes[k] = c->lignes[c->nbLignes - 1];
    c->nbLignes--;
}

int main(void) {
    Produit cat[2] = {{"PRD-0004", 5}, {"PRD-0007", 4}};
    Commande c = {0};
    printf("ajout 3 x PRD-0004 : %d\n", ajouterLigne(&c, cat, 2, "PRD-0004", 3));
    printf("ajout 3 x PRD-0004 : %d\n", ajouterLigne(&c, cat, 2, "PRD-0004", 3));
    printf("ajout 2 x PRD-0004 : %d\n", ajouterLigne(&c, cat, 2, "PRD-0004", 2));
    printf("ajout 4 x PRD-0007 : %d\n", ajouterLigne(&c, cat, 2, "PRD-0007", 4));
    printf("%d lignes, PRD-0004 x %d, stocks %d / %d\n", c.nbLignes, c.lignes[0].quantite,
           cat[0].quantiteStock, cat[1].quantiteStock);
    supprimerLigne(&c, cat, 2, 1);
    printf("apres suppression de la ligne PRD-0007 : stocks %d / %d\n",
           cat[0].quantiteStock, cat[1].quantiteStock);
    supprimerLigne(&c, cat, 2, 0);
    printf("apres annulation (toutes les lignes) : stocks %d / %d\n",
           cat[0].quantiteStock, cat[1].quantiteStock);
    return 0;
}`,
        `ajout 3 x PRD-0004 : 1
ajout 3 x PRD-0004 : 0
ajout 2 x PRD-0004 : 1
ajout 4 x PRD-0007 : 1
2 lignes, PRD-0004 x 5, stocks 0 / 0
apres suppression de la ligne PRD-0007 : stocks 0 / 4
apres annulation (toutes les lignes) : stocks 5 / 4`,
        [
          ['if (ip < 0 || qte <= 0) return 0;', 'Intégrité : la référence doit exister ; la quantité doit être ≥ 1.'],
          ['if (strcmp(c->lignes[i].refProduit, ref) == 0) {', 'Règle 10 : la référence est déjà dans la commande → on fusionne au lieu de créer une 2e ligne.'],
          ['if (qte > cat[ip].quantiteStock) return 0;', 'Le stock a déjà été diminué des 3 premiers : comparer la quantité SUPPLÉMENTAIRE au stock restant revient à contrôler le cumul.'],
          ['cat[ip].quantiteStock -= qte;', 'Règle 7 : toute ligne acceptée décrémente le stock.'],
          ['void supprimerLigne(Commande *c, Produit cat[], int nb, int k) {', 'Uniquement pour une commande EN_COURS (contrôle fait par l’appelant, voir C07).'],
          ['cat[ip].quantiteStock += c->lignes[k].quantite;', 'Réintégration du stock.'],
          ['c->lignes[k] = c->lignes[c->nbLignes - 1];', 'Retrait en O(1) : la dernière ligne prend la place de la ligne supprimée (l’ordre des lignes n’a pas d’importance).'],
          ['printf("ajout 3 x PRD-0004 : %d\\n", ajouterLigne(&c, cat, 2, "PRD-0004", 3));', '2e demande : 3 + 3 = 6 > 5 en stock initial → refus, rien n’est modifié.'],
        ]
      ),
      commonMistakes: [
        {
          title: 'Contrôle d’unicité limité aux produits actifs',
          wrongCode: `for (int i = 0; i < b->nbProduits; i++)
    if (b->produits[i].actif &&
        strcmp(b->produits[i].reference, ref) == 0)
        return 1;  /* existe */`,
          rightCode: `for (int i = 0; i < b->nbProduits; i++)
    if (strcmp(b->produits[i].reference, ref) == 0)
        return 1;  /* existe, actif ou non */`,
          explanation: 'Règle 8 du sujet : « les contrôles d’unicité portent sur tous les enregistrements, y compris désactivés ».',
          errorType: 'logique',
        },
        {
          title: 'Saisir le numéro de commande au clavier',
          wrongCode: `printf("Numero de commande : ");
scanf("%d", &c.numero);   /* doublons possibles */`,
          rightCode: `c.numero = b->numeroSuivant;
b->numeroSuivant++;`,
          explanation: 'Règle 9 : les numéros et identifiants sont attribués par les compteurs de Boutique, jamais saisis à la main.',
          errorType: 'logique',
        },
        {
          title: 'Garder un pointeur vers un client pendant un realloc des clients',
          wrongCode: `Client *cl = &b->clients[0];
ajouterClient(b, nouveau);   /* realloc : le tableau peut bouger */
cl->pointsFidelite += 10;    /* pointeur pendant ! */`,
          rightCode: `int ic = 0;
ajouterClient(b, nouveau);
b->clients[ic].pointsFidelite += 10;   /* l'indice reste valable */`,
          explanation: 'realloc peut déplacer le bloc : les anciens pointeurs vers ses cases deviennent invalides. Mémorisez des indices, ou recherchez à nouveau après l’agrandissement.',
          errorType: 'execution',
        },
      ],
      summary: [
        'Recherche par clé : renvoyer l’indice (ou -1) ; strcmp pour les chaînes.',
        'Unicité (référence, email) contrôlée sur TOUS les enregistrements, actifs ou non.',
        'Suppression logique : actif = 0 ; refusée si l’élément est utilisé par une commande non annulée.',
        'Numéros et identifiants : b->numeroSuivant++ et b->idClientSuivant++.',
        'Une seule ligne par référence ; le stock est contrôlé sur la quantité cumulée.',
        'Création → stock décrémenté ; suppression de ligne ou annulation → stock réintégré.',
      ],
      comprehensionQuestions: [
        {
          id: 'C08_Q1',
          question: 'Le produit PRD-0003 a été supprimé logiquement. Un utilisateur veut créer un nouveau produit PRD-0003. Que faire ?',
          options: [
            'Accepter, puisque l’ancien est inactif',
            'Refuser : la référence existe encore (unicité sur tous les enregistrements)',
            'Écraser l’ancien produit',
            'Supprimer physiquement l’ancien puis accepter',
          ],
          correctIndex: 1,
          explanation: 'Les anciennes commandes référencent toujours PRD-0003 : deux produits de même référence rendraient ces lignes ambiguës.',
        },
        {
          id: 'C08_Q2',
          question: 'Stock du Hub USB-C : 4. Une commande contient déjà une ligne de 3 Hubs. L’utilisateur ajoute 2 Hubs. Que se passe-t-il ?',
          options: [
            'Une 2e ligne de 2 Hubs est créée',
            'La ligne passe à 5 Hubs',
            'Refus : la quantité cumulée 5 dépasse le stock 4',
            'La ligne passe à 2 Hubs',
          ],
          correctIndex: 2,
          explanation: 'Règle 10 : pas de doublon de référence, et contrôle du stock sur la quantité cumulée (3 + 2 = 5 > 4).',
        },
        {
          id: 'C08_Q3',
          question: 'Pourquoi préférer un indice à un pointeur pour mémoriser « le client courant » dans ShopFlow ?',
          options: [
            'Un indice prend moins de place',
            'Un pointeur ne peut pas désigner une structure',
            'Un realloc du tableau des clients peut déplacer le bloc et rendre le pointeur invalide, alors que l’indice reste correct',
            'Les indices sont plus rapides',
          ],
          correctIndex: 2,
          explanation: 'Après realloc, le tableau peut être à une autre adresse : un pointeur vers l’ancienne case est pendant.',
        },
      ],
    },
    exercises: [
      {
        id: 'C08_E1',
        chapterId: 'C08',
        trackId: 'projet',
        title: 'Repérer la faille du contrôle d’unicité',
        difficulty: 'debutant',
        category: 'error_spot',
        testedSkill: 'Unicité incluant les enregistrements désactivés',
        prerequisites: ['C08'],
        statement: `Cette fonction est appelée avant d’ajouter un client. Quelle règle du sujet viole-t-elle ?

    int emailDejaUtilise(const Boutique *b, const char *email) {
        for (int i = 0; i < b->nbClients; i++) {
            if (b->clients[i].actif == 1 &&
                strcmp(b->clients[i].email, email) == 0) {
                return 1;
            }
        }
        return 0;
    }`,
        isCoreValidationExercise: true,
        options: [
          'Aucune : un client désactivé n’existe plus',
          'L’unicité doit porter sur tous les clients, y compris désactivés : le test actif == 1 doit disparaître',
          'Il faudrait comparer avec == au lieu de strcmp',
          'La boucle devrait commencer à 1',
        ],
        correctOptionIndex: 1,
        errorClassificationTarget: 'logique',
        hints: [
          'Relisez la règle 8 de l’approche progressive.',
          'Que se passerait-il si on réactivait plus tard l’ancien client ?',
          'La suppression logique ne libère pas la clé.',
        ],
        detailedExplanation: 'Avec le filtre actif == 1, un nouveau client pourrait reprendre l’email d’un client désactivé : deux fiches auraient le même email, et l’historique des commandes deviendrait ambigu. Les contrôles d’unicité ignorent le champ actif.',
      },
      {
        id: 'C08_E2',
        chapterId: 'C08',
        trackId: 'projet',
        title: 'Saisir les lignes d’une commande avec fusion et contrôle du stock',
        difficulty: 'avance',
        category: 'c_code',
        testedSkill: 'Recherche, intégrité référentielle, unicité des lignes, stock cumulé',
        prerequisites: ['C08'],
        statement: `Le catalogue (déclaré dans le main) contient PRD-0001 (stock 5), PRD-0002 (stock 8) et PRD-0007 (stock 4). Le programme lit n puis n lignes « REF QTE ». Pour chaque saisie, affichez :
- « QUANTITE INVALIDE » si QTE ≤ 0 ;
- « REF INCONNUE : REF » si la référence n’existe pas ;
- « STOCK INSUFFISANT : REF » si la quantité cumulée pour cette référence dépasse le stock ;
- sinon « AJOUT : REF x QTE » pour une nouvelle ligne ou « FUSION : REF -> TOTAL » si la référence était déjà dans la commande.
Puis affichez « Commande : k ligne(s) » et chaque ligne « REF x QTE » dans l’ordre de création, puis « Stock PRD-0001/0002/0007 : a/b/c ».`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>
#include <string.h>

typedef struct { char reference[12]; int quantiteStock; } Produit;
typedef struct { char refProduit[12]; int quantite; } LigneCommande;

int main(void) {
    Produit cat[3] = {{"PRD-0001", 5}, {"PRD-0002", 8}, {"PRD-0007", 4}};
    LigneCommande lignes[10];
    int nbLignes = 0;
    int n = 0;
    scanf("%d", &n);
    for (int s = 0; s < n; s++) {
        char ref[12];
        int qte = 0;
        scanf("%11s %d", ref, &qte);
        /* TODO */
    }
    /* TODO : recapitulatif */
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <string.h>

typedef struct { char reference[12]; int quantiteStock; } Produit;
typedef struct { char refProduit[12]; int quantite; } LigneCommande;

int indiceProduit(const Produit cat[], int nb, const char *ref) {
    for (int i = 0; i < nb; i++) {
        if (strcmp(cat[i].reference, ref) == 0) return i;
    }
    return -1;
}

int indiceLigne(const LigneCommande lignes[], int nb, const char *ref) {
    for (int i = 0; i < nb; i++) {
        if (strcmp(lignes[i].refProduit, ref) == 0) return i;
    }
    return -1;
}

int main(void) {
    Produit cat[3] = {{"PRD-0001", 5}, {"PRD-0002", 8}, {"PRD-0007", 4}};
    LigneCommande lignes[10];
    int nbLignes = 0;
    int n = 0;
    scanf("%d", &n);
    for (int s = 0; s < n; s++) {
        char ref[12];
        int qte = 0;
        scanf("%11s %d", ref, &qte);
        if (qte <= 0) {
            printf("QUANTITE INVALIDE\n");
            continue;
        }
        int ip = indiceProduit(cat, 3, ref);
        if (ip < 0) {
            printf("REF INCONNUE : %s\n", ref);
            continue;
        }
        if (qte > cat[ip].quantiteStock) {
            printf("STOCK INSUFFISANT : %s\n", ref);
            continue;
        }
        int il = indiceLigne(lignes, nbLignes, ref);
        cat[ip].quantiteStock -= qte;
        if (il >= 0) {
            lignes[il].quantite += qte;
            printf("FUSION : %s -> %d\n", ref, lignes[il].quantite);
        } else {
            strcpy(lignes[nbLignes].refProduit, ref);
            lignes[nbLignes].quantite = qte;
            nbLignes++;
            printf("AJOUT : %s x %d\n", ref, qte);
        }
    }
    printf("Commande : %d ligne(s)\n", nbLignes);
    for (int i = 0; i < nbLignes; i++) {
        printf("%s x %d\n", lignes[i].refProduit, lignes[i].quantite);
    }
    printf("Stock PRD-0001/0002/0007 : %d/%d/%d\n",
           cat[0].quantiteStock, cat[1].quantiteStock, cat[2].quantiteStock);
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Deux produits sans conflit', category: 'normal', stdin: '2\nPRD-0001 2\nPRD-0007 1\n', expectedStdout: 'AJOUT : PRD-0001 x 2\nAJOUT : PRD-0007 x 1\nCommande : 2 ligne(s)\nPRD-0001 x 2\nPRD-0007 x 1\nStock PRD-0001/0002/0007 : 3/8/3', explanation: 'Cas simple.' },
          { id: 't2', label: 'Fusion d’une référence répétée', category: 'normal', stdin: '3\nPRD-0002 3\nPRD-0001 1\nPRD-0002 4\n', expectedStdout: 'AJOUT : PRD-0002 x 3\nAJOUT : PRD-0001 x 1\nFUSION : PRD-0002 -> 7\nCommande : 2 ligne(s)\nPRD-0002 x 7\nPRD-0001 x 1\nStock PRD-0001/0002/0007 : 4/1/4', explanation: 'Une seule ligne PRD-0002 de 7 articles.' },
          { id: 't3', label: 'Stock cumulé dépassé', category: 'limite', stdin: '3\nPRD-0007 3\nPRD-0007 2\nPRD-0007 1\n', expectedStdout: 'AJOUT : PRD-0007 x 3\nSTOCK INSUFFISANT : PRD-0007\nFUSION : PRD-0007 -> 4\nCommande : 1 ligne(s)\nPRD-0007 x 4\nStock PRD-0001/0002/0007 : 5/8/0', explanation: '3 + 2 = 5 > 4 refusé ; 3 + 1 = 4 accepté (égal au stock).' },
          { id: 't4', label: 'Saisies invalides', category: 'invalide', stdin: '3\nPRD-0099 1\nPRD-0001 0\nPRD-0002 -2\n', expectedStdout: 'REF INCONNUE : PRD-0099\nQUANTITE INVALIDE\nQUANTITE INVALIDE\nCommande : 0 ligne(s)\nStock PRD-0001/0002/0007 : 5/8/4', explanation: 'Aucune ligne créée, stock intact.' },
          { id: 't5', label: 'Quantité égale au stock', category: 'limite', stdin: '1\nPRD-0002 8\n', expectedStdout: 'AJOUT : PRD-0002 x 8\nCommande : 1 ligne(s)\nPRD-0002 x 8\nStock PRD-0001/0002/0007 : 5/0/4', explanation: '« 1 ≤ qté ≤ stock dispo » : l’égalité est permise.' },
        ],
        hints: [
          'Écrivez deux fonctions de recherche : indiceProduit dans le catalogue, indiceLigne dans la commande.',
          'Comme le stock est décrémenté à chaque ajout, comparer qte au stock RESTANT équivaut à contrôler le cumul.',
          'Ordre des contrôles : quantité, existence de la référence, stock ; puis fusion (ligne trouvée) ou ajout.',
        ],
        detailedExplanation: 'On décrémente le stock dès qu’une saisie est acceptée : le stock restant intègre alors ce qui est déjà dans la commande, et un simple qte > stock contrôle la quantité cumulée. Les saisies refusées ne modifient rien. Le cas t3 montre la différence entre « quantité cumulée > stock » (refus) et « = stock » (accepté).',
      },
      {
        id: 'C08_E3',
        chapterId: 'C08',
        trackId: 'projet',
        title: 'Prédire le stock et les compteurs après une série d’opérations',
        difficulty: 'intermediaire',
        category: 'prediction',
        testedSkill: 'Invariant du stock et compteurs auto-incrémentés',
        prerequisites: ['C08'],
        statement: 'Quelle est la sortie exacte de ce programme ?',
        isCoreValidationExercise: true,
        codeSnippet: String.raw`#include <stdio.h>

typedef struct { int numeroSuivant; int stock; } Boutique;

int creerCommande(Boutique *b, int qte) {
    if (qte > b->stock) return -1;
    b->stock -= qte;
    return b->numeroSuivant++;
}

void annuler(Boutique *b, int qte) {
    b->stock += qte;
}

int main(void) {
    Boutique b = {1007, 10};
    int c1 = creerCommande(&b, 4);
    int c2 = creerCommande(&b, 7);
    int c3 = creerCommande(&b, 6);
    annuler(&b, 4);
    int c4 = creerCommande(&b, 2);
    printf("%d %d %d %d\n", c1, c2, c3, c4);
    printf("stock=%d suivant=%d\n", b.stock, b.numeroSuivant);
    return 0;
}`,
        expectedOutputAnswer: '1007 -1 1008 1009\nstock=2 suivant=1010',
        hints: [
          'return b->numeroSuivant++ renvoie la valeur AVANT l’incrémentation.',
          'Une commande refusée ne consomme ni stock ni numéro.',
          'L’annulation réintègre le stock mais ne « rend » jamais le numéro 1007.',
        ],
        detailedExplanation: 'c1 : stock 10 → 6, numéro 1007. c2 : 7 > 6, refus (-1). c3 : stock 6 → 0, numéro 1008. annuler : stock 0 → 4. c4 : stock 4 → 2, numéro 1009. Les numéros ne sont jamais réutilisés, même après annulation : suivant = 1010.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE C09 — AGRÉGATION, TRI ET PALMARÈS
  // ==========================================================================
  {
    id: 'C09',
    trackId: 'projet',
    number: 9,
    title: 'Statistiques : agrégation, tri et palmarès',
    subtitle: 'Chiffre d’affaires par période, top 5 produits, classement des clients : agréger, filtrer, trier avec qsort.',
    estimatedMinutes: 60,
    prerequisites: ['A13', 'B13', 'C06', 'C07'],
    relatedChapters: ['A11', 'A13', 'C06'],
    coreConcepts: ['agrégation', 'filtrage', 'tri de structures', 'qsort', 'fonction de comparaison', 'tableau de travail', 'top N'],
    successCriteria: [
      'Agréger des quantités vendues par produit en excluant les commandes annulées',
      'Trier un tableau de structures par sélection et avec qsort',
      'Produire un top N sans modifier l’ordre du catalogue',
    ],
    lesson: {
      objectives: [
        'Parcourir les 3 niveaux client → commande → ligne pour cumuler des statistiques',
        'Filtrer selon le statut (exclure ANNULEE) et la période (mois, année)',
        'Construire un tableau de travail (référence, total) au lieu de trier le catalogue lui-même',
        'Écrire une fonction de comparaison int comparer(const void *a, const void *b) pour qsort',
        'Départager les ex æquo et limiter l’affichage à min(N, nombre d’éléments)',
      ],
      intuition: `Le module statistique répond à quatre questions : quel chiffre d’affaires (total, par mois, par année) ? quels produits se vendent le plus (top 5) ? quels clients rapportent le plus ? quels produits sont en alerte de stock ?

Toutes suivent le même schéma en trois temps :
1. **Agréger** : parcourir clients → commandes → lignes et cumuler (quantités par produit, CA par client), en **filtrant** les commandes ANNULEE et, si besoin, la période.
2. **Trier** le résultat selon le critère voulu (décroissant).
3. **Afficher** les N premiers.

Ne triez **jamais** le catalogue ou le répertoire eux-mêmes pour un affichage : vous changeriez l’ordre de référence, et les indices mémorisés ailleurs deviendraient faux. On construit un **tableau de travail** (une petite structure {reference, quantite} ou {idClient, ca}), on le trie, on l’affiche, puis on le libère.

Pour trier, deux options : écrire un tri par sélection (vu en A13), ou utiliser **qsort** de <stdlib.h>, qui trie n’importe quel tableau à condition de lui fournir une **fonction de comparaison**.`,
      formalDefinition: `- **Agrégation des quantités vendues** :
    pour chaque client, pour chaque commande non ANNULEE, pour chaque ligne :
        stat[indiceProduit(ligne.refProduit)].quantite += ligne.quantite
- **CA par période** : filtrer sur dateCommande.mois == m && dateCommande.annee == a (ou seulement l’année).
- **qsort** :
    void qsort(void *base, size_t nb, size_t taille, int (*cmp)(const void *, const void *));
    qsort(stats, nbStats, sizeof(StatProduit), comparerParQuantite);
- **Fonction de comparaison** : reçoit deux adresses d’éléments sous forme const void * ; on les convertit vers le vrai type, puis on renvoie < 0 si a doit venir avant b, > 0 si après, 0 si équivalents.
    int comparerParQuantite(const void *a, const void *b) {
        const StatProduit *x = (const StatProduit *)a;
        const StatProduit *y = (const StatProduit *)b;
        if (x->quantite != y->quantite) return y->quantite - x->quantite;   /* décroissant */
        return strcmp(x->reference, y->reference);                          /* départage */
    }
- **Pour des float**, ne pas renvoyer y - x (tronqué en int : 0,4 € d’écart donnerait 0) ; écrire : return (y->ca > x->ca) - (y->ca < x->ca);
- **Top N** : for (i = 0; i < nb && i < N; i++).
- **Alerte de stock** : produits actifs tels que quantiteStock <= seuilAlerte (pas de tri nécessaire).`,
      analogy: {
        title: 'Le podium sportif',
        content: `Pour établir un podium, on ne réordonne pas la liste officielle des inscrits : on recopie les résultats sur un tableau d’affichage, on le classe par score, puis on appelle les trois premiers. La fonction de comparaison, c’est l’arbitre : on lui présente deux athlètes à la fois et il dit lequel passe devant — et comment départager les ex æquo.`,
      },
      vocabulary: [
        { fr: 'Agrégation', en: 'Aggregation', definition: 'Calcul d’une valeur de synthèse (somme, compte) sur un ensemble de données.' },
        { fr: 'Filtrage', en: 'Filtering', definition: 'Sélection des seuls éléments respectant un critère (non annulé, mois donné).' },
        { fr: 'Fonction de comparaison', en: 'Comparator / comparison function', definition: 'Fonction qui indique l’ordre relatif de deux éléments.' },
        { fr: 'Pointeur générique', en: 'void pointer (void *)', definition: 'Pointeur sans type précis, à convertir avant usage ; utilisé par qsort.' },
        { fr: 'Départage', en: 'Tie-breaking', definition: 'Critère secondaire appliqué quand le critère principal est égal.' },
        { fr: 'Tableau de travail', en: 'Working array / scratch array', definition: 'Copie temporaire des données servant à un calcul, libérée ensuite.' },
      ],
      simpleExample: cExample(
        'Palmarès produits avec un tri par sélection',
        'On agrège les lignes non annulées dans un tableau de travail, on le trie par quantité décroissante, puis on affiche le top 3.',
        String.raw`#include <stdio.h>
#include <string.h>

typedef struct { char reference[12]; int quantite; } StatProduit;
typedef struct { char refProduit[12]; int quantite; int annulee; } LigneVendue;

int main(void) {
    LigneVendue ventes[6] = {
        {"PRD-0001", 2, 0}, {"PRD-0006", 5, 0}, {"PRD-0004", 1, 0},
        {"PRD-0001", 3, 0}, {"PRD-0004", 9, 1}, {"PRD-0008", 2, 0}
    };
    StatProduit stats[6];
    int nbStats = 0;

    for (int i = 0; i < 6; i++) {
        if (ventes[i].annulee) continue;
        int k = 0;
        while (k < nbStats && strcmp(stats[k].reference, ventes[i].refProduit) != 0) k++;
        if (k == nbStats) {
            strcpy(stats[k].reference, ventes[i].refProduit);
            stats[k].quantite = 0;
            nbStats++;
        }
        stats[k].quantite += ventes[i].quantite;
    }

    for (int i = 0; i < nbStats - 1; i++) {
        int best = i;
        for (int j = i + 1; j < nbStats; j++) {
            if (stats[j].quantite > stats[best].quantite) best = j;
        }
        StatProduit tmp = stats[i];
        stats[i] = stats[best];
        stats[best] = tmp;
    }

    for (int i = 0; i < nbStats && i < 3; i++) {
        printf("%d. %s : %d vendus\n", i + 1, stats[i].reference, stats[i].quantite);
    }
    return 0;
}`,
        `1. PRD-0001 : 5 vendus
2. PRD-0006 : 5 vendus
3. PRD-0008 : 2 vendus`,
        [
          ['typedef struct { char reference[12]; int quantite; } StatProduit;', 'Tableau de travail : une case par produit vendu.'],
          ['if (ventes[i].annulee) continue;', 'Filtre du sujet : les lignes de commandes annulées ne comptent pas (les 9 casques).'],
          ['while (k < nbStats && strcmp(stats[k].reference, ventes[i].refProduit) != 0) k++;', 'Recherche du produit dans le tableau de travail.'],
          ['if (k == nbStats) {', 'Pas encore présent : on crée sa case avec un total à 0.'],
          ['stats[k].quantite += ventes[i].quantite;', 'Agrégation : PRD-0001 cumule 2 + 3 = 5.'],
          ['if (stats[j].quantite > stats[best].quantite) best = j;', 'Tri par sélection décroissant ; > strict garde le premier rencontré en cas d’égalité.'],
          ['StatProduit tmp = stats[i];', 'Échange de deux structures entières par affectation.'],
          ['for (int i = 0; i < nbStats && i < 3; i++) {', 'Top N robuste : s’il n’y a que 2 produits vendus, on n’en affiche que 2.'],
        ]
      ),
      intermediateExample: cExample(
        'Palmarès clients avec qsort et départage',
        'Tri décroissant sur un float (sans soustraction tronquée), puis ordre alphabétique en cas d’égalité.',
        String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int idClient;
    char nom[50];
    float chiffreAffaires;
} StatClient;

int comparerClients(const void *a, const void *b) {
    const StatClient *x = (const StatClient *)a;
    const StatClient *y = (const StatClient *)b;
    if (x->chiffreAffaires != y->chiffreAffaires) {
        return (y->chiffreAffaires > x->chiffreAffaires) - (y->chiffreAffaires < x->chiffreAffaires);
    }
    return strcmp(x->nom, y->nom);
}

int main(void) {
    int nb = 5;
    StatClient *stats = malloc(nb * sizeof(StatClient));
    if (stats == NULL) return 1;
    StatClient donnees[5] = {
        {1, "Martin", 367.20f}, {2, "Durand", 47.18f}, {3, "Bernard", 612.00f},
        {4, "Petit", 367.60f}, {5, "Moreau", 367.20f}
    };
    for (int i = 0; i < nb; i++) stats[i] = donnees[i];

    qsort(stats, nb, sizeof(StatClient), comparerClients);

    for (int i = 0; i < nb; i++) {
        printf("%d. %-8s (#%d) %8.2f EUR\n", i + 1, stats[i].nom, stats[i].idClient, stats[i].chiffreAffaires);
    }
    free(stats);
    return 0;
}`,
        `1. Bernard  (#3)   612.00 EUR
2. Petit    (#4)   367.60 EUR
3. Martin   (#1)   367.20 EUR
4. Moreau   (#5)   367.20 EUR
5. Durand   (#2)    47.18 EUR`,
        [
          ['int comparerClients(const void *a, const void *b) {', 'Signature imposée par qsort : deux adresses génériques d’éléments.'],
          ['const StatClient *x = (const StatClient *)a;', 'On convertit vers le vrai type pour accéder aux champs.'],
          ['return (y->chiffreAffaires > x->chiffreAffaires) - (y->chiffreAffaires < x->chiffreAffaires);', 'Renvoie 1, 0 ou -1 sans perte : avec (int)(y - x), Petit (367,60) et Martin (367,20) seraient jugés égaux (0,40 tronqué en 0).'],
          ['return strcmp(x->nom, y->nom);', 'Départage alphabétique des ex æquo : Martin avant Moreau.'],
          ['StatClient *stats = malloc(nb * sizeof(StatClient));', 'Tableau de travail alloué : le répertoire des clients reste dans son ordre d’origine.'],
          ['qsort(stats, nb, sizeof(StatClient), comparerClients);', 'On passe le NOM de la fonction (sans parenthèses) : qsort l’appellera autant de fois que nécessaire.'],
          ['%-8s', 'Aligné à gauche sur 8 caractères ; %8.2f aligne les montants à droite.'],
          ['free(stats);', 'Le tableau de travail est libéré après l’affichage.'],
        ]
      ),
      commonMistakes: [
        {
          title: 'Trier directement le catalogue pour afficher le palmarès',
          wrongCode: `qsort(b->produits, b->nbProduits,
      sizeof(Produit), comparerVentes);
/* le catalogue n'est plus dans son ordre ! */`,
          rightCode: `StatProduit *stats = malloc(b->nbProduits * sizeof *stats);
/* ... remplir, trier stats, afficher ... */
free(stats);`,
          explanation: 'Le catalogue sert de référence à tout le programme : on travaille sur une copie dédiée aux statistiques.',
          errorType: 'logique',
        },
        {
          title: 'Comparer des float par soustraction',
          wrongCode: `int cmp(const void *a, const void *b) {
    return (int)(((StatClient *)b)->ca - ((StatClient *)a)->ca);
}  /* 0,40 EUR d'ecart -> 0 : ordre faux */`,
          rightCode: `int cmp(const void *a, const void *b) {
    float x = ((const StatClient *)a)->ca;
    float y = ((const StatClient *)b)->ca;
    return (y > x) - (y < x);
}`,
          explanation: 'La conversion en int tronque les écarts inférieurs à 1 € : des clients différents seraient jugés égaux.',
          errorType: 'logique',
        },
        {
          title: 'Compter les commandes annulées dans les statistiques',
          wrongCode: `for (int j = 0; j < cl->nbCommandes; j++)
    ca += cl->commandes[j].montantTTC;`,
          rightCode: `for (int j = 0; j < cl->nbCommandes; j++)
    if (cl->commandes[j].statut != ANNULEE)
        ca += cl->commandes[j].montantTTC;`,
          explanation: 'Le sujet : « le chiffre d’affaires et les deux palmarès excluent les commandes au statut ANNULEE ».',
          errorType: 'logique',
        },
      ],
      summary: [
        'Statistique = agréger (en filtrant ANNULEE et la période) → trier → afficher les N premiers.',
        'Trier un tableau de travail, jamais le catalogue ni le répertoire.',
        'qsort(tab, nb, sizeof(T), cmp) ; cmp renvoie < 0, 0 ou > 0.',
        'Décroissant : comparer b à a ; float : (y > x) - (y < x).',
        'Prévoir un critère de départage pour un affichage stable.',
        'Top N : i < nb && i < N.',
      ],
      comprehensionQuestions: [
        {
          id: 'C09_Q1',
          question: 'Pour un classement DÉCROISSANT par quantité (entiers), que doit renvoyer la fonction de comparaison ?',
          options: ['x->quantite - y->quantite', 'y->quantite - x->quantite', 'x->quantite > y->quantite', '0'],
          correctIndex: 1,
          explanation: 'Si y a plus de ventes que x, le résultat est positif : x passe après y.',
        },
        {
          id: 'C09_Q2',
          question: 'Comment passe-t-on la fonction de comparaison à qsort ?',
          options: [
            'qsort(t, n, sizeof(T), comparer());',
            'qsort(t, n, sizeof(T), comparer);',
            'qsort(t, n, sizeof(T), "comparer");',
            'qsort(t, n, comparer, sizeof(T));',
          ],
          correctIndex: 1,
          explanation: 'Le nom de la fonction sans parenthèses désigne la fonction elle-même ; avec des parenthèses on l’appellerait.',
        },
        {
          id: 'C09_Q3',
          question: 'Une commande ANNULEE contient 9 casques. Combien en compte le palmarès produits ?',
          options: ['9', '0', '4,5', 'Cela dépend du stock'],
          correctIndex: 1,
          explanation: 'Les quantités vendues ne portent que sur les lignes des commandes non annulées.',
        },
      ],
    },
    exercises: [
      {
        id: 'C09_E1',
        chapterId: 'C09',
        trackId: 'projet',
        title: 'Compléter la fonction de comparaison du palmarès produits',
        difficulty: 'intermediaire',
        category: 'completion',
        testedSkill: 'Écrire un comparateur qsort décroissant avec départage',
        prerequisites: ['C09'],
        statement: 'Complétez le comparateur : quantité décroissante, puis référence croissante en cas d’égalité.',
        isCoreValidationExercise: true,
        templateWithGaps: String.raw`int comparerVentes(const void *a, const void *b) {
    const StatProduit *x = ({{GAP_1}})a;
    const StatProduit *y = (const StatProduit *)b;
    if (x->quantite != y->quantite) {
        return {{GAP_2}};
    }
    return {{GAP_3}};
}

qsort(stats, nbStats, sizeof(StatProduit), {{GAP_4}});`,
        gaps: [
          { id: 'GAP_1', placeholder: 'conversion', acceptedAnswers: ['const StatProduit *', 'const StatProduit*', 'StatProduit *', 'StatProduit*'], explanation: 'On convertit le pointeur générique vers le type réel des éléments.' },
          { id: 'GAP_2', placeholder: 'ordre décroissant', acceptedAnswers: ['y->quantite - x->quantite', 'y->quantite-x->quantite'], explanation: 'Positif quand y a vendu plus que x : x passe après y.' },
          { id: 'GAP_3', placeholder: 'départage', acceptedAnswers: ['strcmp(x->reference, y->reference)', 'strcmp(x->reference,y->reference)'], explanation: 'Ordre alphabétique croissant des références.' },
          { id: 'GAP_4', placeholder: 'comparateur', acceptedAnswers: ['comparerVentes', '&comparerVentes'], explanation: 'On passe le nom de la fonction, sans parenthèses.' },
        ],
        hints: [
          'Recopiez la conversion de la ligne suivante.',
          'Décroissant : on soustrait dans l’ordre « y moins x ».',
          'Le départage compare les références avec la fonction de <string.h> qui renvoie < 0, 0 ou > 0.',
        ],
        detailedExplanation: `const StatProduit *x = (const StatProduit *)a;
return y->quantite - x->quantite;
return strcmp(x->reference, y->reference);
qsort(stats, nbStats, sizeof(StatProduit), comparerVentes);
Pour des entiers de taille raisonnable, la soustraction est sûre ; pour des float, préférez (y > x) - (y < x).`,
      },
      {
        id: 'C09_E2',
        chapterId: 'C09',
        trackId: 'projet',
        title: 'Palmarès produits : top 3 des ventes',
        difficulty: 'avance',
        category: 'c_code',
        testedSkill: 'Agrégation filtrée puis tri de structures',
        prerequisites: ['C09'],
        statement: `Le programme lit n puis n lignes de commandes « REF QTE STATUT » (STATUT ∈ EN_COURS, EXPEDIEE, LIVREE, ANNULEE).
Cumulez les quantités par référence **en ignorant les lignes ANNULEE**, triez par quantité décroissante puis par référence croissante, et affichez au plus 3 lignes « 1. REF : Q ». S’il n’y a aucune vente, affichez « Aucune vente ». (qsort ou tri manuel, au choix ; au plus 20 références différentes.)`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { char reference[12]; int quantite; } StatProduit;

int main(void) {
    StatProduit stats[20];
    int nbStats = 0;
    int n = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        char ref[12], statut[20];
        int qte = 0;
        scanf("%11s %d %19s", ref, &qte, statut);
        /* TODO : agreger */
    }
    /* TODO : trier et afficher le top 3 */
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { char reference[12]; int quantite; } StatProduit;

int comparerVentes(const void *a, const void *b) {
    const StatProduit *x = (const StatProduit *)a;
    const StatProduit *y = (const StatProduit *)b;
    if (x->quantite != y->quantite) {
        return y->quantite - x->quantite;
    }
    return strcmp(x->reference, y->reference);
}

int main(void) {
    StatProduit stats[20];
    int nbStats = 0;
    int n = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        char ref[12], statut[20];
        int qte = 0;
        scanf("%11s %d %19s", ref, &qte, statut);
        if (strcmp(statut, "ANNULEE") == 0) {
            continue;
        }
        int k = 0;
        while (k < nbStats && strcmp(stats[k].reference, ref) != 0) {
            k++;
        }
        if (k == nbStats) {
            strcpy(stats[k].reference, ref);
            stats[k].quantite = 0;
            nbStats++;
        }
        stats[k].quantite += qte;
    }
    if (nbStats == 0) {
        printf("Aucune vente\n");
        return 0;
    }
    qsort(stats, nbStats, sizeof(StatProduit), comparerVentes);
    for (int i = 0; i < nbStats && i < 3; i++) {
        printf("%d. %s : %d\n", i + 1, stats[i].reference, stats[i].quantite);
    }
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Agrégation simple', category: 'normal', stdin: '5\nPRD-0001 2 LIVREE\nPRD-0006 5 EXPEDIEE\nPRD-0001 4 EN_COURS\nPRD-0004 1 LIVREE\nPRD-0008 2 LIVREE\n', expectedStdout: '1. PRD-0001 : 6\n2. PRD-0006 : 5\n3. PRD-0008 : 2', explanation: 'PRD-0001 cumule 6 ; PRD-0004 (1) est 4e et n’est pas affiché.' },
          { id: 't2', label: 'Lignes annulées exclues', category: 'normal', stdin: '4\nPRD-0004 9 ANNULEE\nPRD-0002 3 LIVREE\nPRD-0004 1 LIVREE\nPRD-0007 2 EN_COURS\n', expectedStdout: '1. PRD-0002 : 3\n2. PRD-0007 : 2\n3. PRD-0004 : 1', explanation: 'Les 9 casques annulés ne comptent pas.' },
          { id: 't3', label: 'Ex æquo départagés par référence', category: 'limite', stdin: '3\nPRD-0005 2 LIVREE\nPRD-0003 2 LIVREE\nPRD-0009 2 LIVREE\n', expectedStdout: '1. PRD-0003 : 2\n2. PRD-0005 : 2\n3. PRD-0009 : 2', explanation: 'Même quantité : ordre alphabétique.' },
          { id: 't4', label: 'Moins de 3 produits vendus', category: 'limite', stdin: '2\nPRD-0001 1 LIVREE\nPRD-0001 1 EXPEDIEE\n', expectedStdout: '1. PRD-0001 : 2', explanation: 'Un seul produit : une seule ligne.' },
          { id: 't5', label: 'Uniquement des annulations', category: 'limite', stdin: '2\nPRD-0001 3 ANNULEE\nPRD-0002 1 ANNULEE\n', expectedStdout: 'Aucune vente', explanation: 'Rien à classer.' },
        ],
        hints: [
          'Ignorez la ligne si strcmp(statut, "ANNULEE") == 0.',
          'Cherchez ref dans stats (boucle while + strcmp) ; créez la case si elle n’existe pas, puis ajoutez qte.',
          'Triez avec qsort et un comparateur « quantité décroissante puis référence croissante » ; affichez i < nbStats && i < 3.',
        ],
        detailedExplanation: 'C’est exactement l’algorithme du palmarès produits de ShopFlow, appliqué à une liste de lignes au lieu du parcours clients → commandes → lignes. Le départage par référence rend la sortie déterministe, et le cas « moins de 3 produits » vérifie qu’on ne lit pas de cases non remplies.',
      },
      {
        id: 'C09_E3',
        chapterId: 'C09',
        trackId: 'projet',
        title: 'Chiffre d’affaires par mois ou par année',
        difficulty: 'intermediaire',
        category: 'c_code',
        testedSkill: 'Filtrer par date imbriquée et par statut',
        prerequisites: ['C02', 'C09'],
        statement: `Le programme lit n puis n commandes « jour mois annee montantTTC statut », puis une période « mois annee ».
- si mois vaut 0, affichez le CA de toute l’année : « CA TTC 2026 : X.XX (k commandes) » ;
- sinon, le CA du mois : « CA TTC 03/2026 : X.XX (k commandes) ».
Les commandes ANNULEE sont exclues ; k est le nombre de commandes comptées.`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>
#include <string.h>

typedef struct { int jour; int mois; int annee; } Date;
typedef struct { Date dateCommande; float montantTTC; char statut[20]; } Commande;

int main(void) {
    Commande cmds[20];
    int n = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d %d %d %f %19s", &cmds[i].dateCommande.jour, &cmds[i].dateCommande.mois,
              &cmds[i].dateCommande.annee, &cmds[i].montantTTC, cmds[i].statut);
    }
    int mois = 0, annee = 0;
    scanf("%d %d", &mois, &annee);
    /* TODO */
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <string.h>

typedef struct { int jour; int mois; int annee; } Date;
typedef struct { Date dateCommande; float montantTTC; char statut[20]; } Commande;

int estDansPeriode(Date d, int mois, int annee) {
    if (d.annee != annee) return 0;
    return mois == 0 || d.mois == mois;
}

int main(void) {
    Commande cmds[20];
    int n = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d %d %d %f %19s", &cmds[i].dateCommande.jour, &cmds[i].dateCommande.mois,
              &cmds[i].dateCommande.annee, &cmds[i].montantTTC, cmds[i].statut);
    }
    int mois = 0, annee = 0;
    scanf("%d %d", &mois, &annee);
    float ca = 0.0f;
    int k = 0;
    for (int i = 0; i < n; i++) {
        if (strcmp(cmds[i].statut, "ANNULEE") == 0) continue;
        if (!estDansPeriode(cmds[i].dateCommande, mois, annee)) continue;
        ca += cmds[i].montantTTC;
        k++;
    }
    if (mois == 0) {
        printf("CA TTC %d : %.2f (%d commandes)\n", annee, ca, k);
    } else {
        printf("CA TTC %02d/%d : %.2f (%d commandes)\n", mois, annee, ca, k);
    }
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Mois de mars 2026', category: 'normal', stdin: '4\n12 3 2026 367.20 LIVREE\n20 3 2026 47.18 ANNULEE\n2 4 2026 114.00 EXPEDIEE\n28 3 2026 72.00 EN_COURS\n3 2026\n', expectedStdout: 'CA TTC 03/2026 : 439.20 (2 commandes)', explanation: 'Commandes du 12/03 et du 28/03 ; celle du 20/03 est annulée.' },
          { id: 't2', label: 'Année entière', category: 'normal', stdin: '4\n12 3 2026 367.20 LIVREE\n20 3 2026 47.18 ANNULEE\n2 4 2026 114.00 EXPEDIEE\n5 1 2025 65.90 LIVREE\n0 2026\n', expectedStdout: 'CA TTC 2026 : 481.20 (2 commandes)', explanation: 'La commande de 2025 est hors période.' },
          { id: 't3', label: 'Même mois, autre année', category: 'limite', stdin: '2\n10 3 2025 100.00 LIVREE\n10 3 2026 50.00 LIVREE\n3 2025\n', expectedStdout: 'CA TTC 03/2025 : 100.00 (1 commandes)', explanation: 'Il faut comparer le mois ET l’année.' },
          { id: 't4', label: 'Aucune commande dans la période', category: 'limite', stdin: '1\n10 3 2026 50.00 LIVREE\n12 2026\n', expectedStdout: 'CA TTC 12/2026 : 0.00 (0 commandes)', explanation: 'CA nul.' },
        ],
        hints: [
          'Écrivez une fonction estDansPeriode(Date d, int mois, int annee) : même année, et (mois == 0 ou même mois).',
          'Dans la boucle, continue pour les commandes ANNULEE et hors période.',
          'Format du mois sur deux chiffres : %02d.',
        ],
        detailedExplanation: 'Le filtre combine le statut et la date imbriquée (cmds[i].dateCommande.mois). Mettre le test de période dans une fonction la rend réutilisable pour tous les affichages par période de ShopFlow. Le cas t3 rappelle qu’un mois seul ne définit pas une période.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE C10 — SYNTHÈSE : ARCHITECTURE ET BOUCLE PRINCIPALE DE SHOPFLOW
  // ==========================================================================
  {
    id: 'C10',
    trackId: 'projet',
    number: 10,
    title: 'Synthèse : architecture, menu et cycle de vie de ShopFlow',
    subtitle: 'main.c, menu en boucle, données de démonstration, détruireBoutique : assembler tous les concepts.',
    estimatedMinutes: 75,
    prerequisites: ['C01', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09'],
    relatedChapters: ['B16', 'C01', 'C05'],
    coreConcepts: ['boucle de menu', 'switch', 'saisie robuste d’un choix', 'initialisation des données', 'cycle de vie mémoire', 'gcc -Wall -Wextra', 'valgrind'],
    successCriteria: [
      'Écrire une boucle de menu robuste face aux saisies invalides',
      'Organiser main.c : initialiser, boucler, détruire',
      'Enchaîner création de commande, calcul, annulation et libération sans fuite',
    ],
    lesson: {
      objectives: [
        'Structurer main.c en trois phases : initialiserDonneesTest, boucle du menu, detruireBoutique',
        'Lire un choix de menu de façon robuste (valeur de retour de scanf, vidage du tampon)',
        'Relier chaque option du menu à une fonction d’un module',
        'Dérouler un scénario complet : commande → stock → montants → annulation → libération',
        'Préparer la soutenance : compilation sans avertissement, valgrind propre, données de démonstration cohérentes',
      ],
      intuition: `Tous les chapitres précédents sont des pièces du puzzle. main.c les assemble et doit rester **court** :
1. déclarer la Boutique et appeler initialiserDonneesTest(&b) (8 produits, 5 clients, 6 commandes, comme l’exige la section 7 du sujet) ;
2. boucler sur un menu : afficher, lire un choix, appeler la fonction du module correspondant ;
3. à la sortie, appeler detruireBoutique(&b).

La boucle de menu est l’endroit où l’utilisateur peut tout casser : taper une lettre au lieu d’un chiffre, appuyer sur Entrée, saisir 42. Si scanf("%d") échoue, le caractère fautif reste dans le tampon et la boucle tourne à l’infini. On teste donc la **valeur de retour** de scanf et on **vide le tampon**.

Enfin, le sujet exige deux fonctionnalités créatives (export CSV, code promo, statistiques par catégorie, historique, mode démonstration…). Une architecture modulaire propre rend leur ajout facile : un module de plus, une option de menu de plus.`,
      formalDefinition: `- **Squelette de main.c** :
    int main(void) {
        Boutique b;
        initialiserDonneesTest(&b);
        int choix;
        do {
            afficherMenu();
            choix = lireEntier(0, 9);
            switch (choix) { case 1: menuProduits(&b); break; ... case 0: break; }
        } while (choix != 0);
        detruireBoutique(&b);
        return 0;
    }
- **Saisie robuste d’un entier** :
    int lireEntier(int min, int max) {
        int x, c;
        while (scanf("%d", &x) != 1 || x < min || x > max) {
            while ((c = getchar()) != '\\n' && c != EOF) {}   /* vider */
            if (c == EOF) return min;
            printf("Choix invalide, recommencez : ");
        }
        return x;
    }
- **Initialisation** : capacités initiales, malloc vérifiés, données cohérentes (références existantes, clients existants, stock suffisant), compteurs numeroSuivant et idClientSuivant positionnés après les données de test.
- **Compilation** (Makefile) : CFLAGS = -Wall -Wextra -std=c99 ; cible clean.
- **Vérification mémoire** : valgrind --leak-check=full ./shopflow → « All heap blocks were freed ».
- **Contraintes** : mémoire uniquement (aucune sauvegarde fichier), langage C exclusivement, chaque malloc/realloc testé.`,
      analogy: {
        title: 'Le chef d’orchestre',
        content: `main.c est le chef d’orchestre : il ne joue d’aucun instrument. Il installe les musiciens (initialisation), donne le départ de chaque morceau selon le programme demandé par le public (menu), puis range la salle à la fin du concert (libération). Si le chef se met à jouer du violon lui-même, plus personne ne dirige : un main de 800 lignes est le signe qu’il manque des modules.`,
      },
      vocabulary: [
        { fr: 'Boucle principale', en: 'Main loop', definition: 'Boucle qui affiche le menu et traite les choix jusqu’à la sortie.' },
        { fr: 'Point d’entrée', en: 'Entry point', definition: 'Fonction main, première fonction exécutée.' },
        { fr: 'Données de démonstration', en: 'Seed / test fixtures', definition: 'Jeu de données chargé au démarrage pour tester et présenter.' },
        { fr: 'Cycle de vie', en: 'Lifecycle', definition: 'Création, utilisation puis destruction d’une ressource.' },
        { fr: 'Vider le tampon', en: 'Flush the input buffer', definition: 'Consommer les caractères restants jusqu’au \\n.' },
        { fr: 'Avertissement du compilateur', en: 'Compiler warning', definition: 'Message signalant un code suspect ; le sujet en exige zéro avec -Wall -Wextra.' },
      ],
      simpleExample: cExample(
        'Une boucle de menu qui résiste aux saisies invalides',
        'L’entrée contient une lettre, un choix hors limites, puis des choix valides et 0 pour quitter.',
        String.raw`#include <stdio.h>

int lireEntier(int min, int max) {
    int x = 0, c = 0;
    while (scanf("%d", &x) != 1 || x < min || x > max) {
        while ((c = getchar()) != '\n' && c != EOF) {
        }
        if (c == EOF) {
            return min;
        }
        printf("Choix invalide, recommencez\n");
    }
    return x;
}

int main(void) {
    int choix = 0;
    int nbAffichages = 0;
    do {
        printf("[1] Catalogue [2] Clients [0] Quitter > ");
        choix = lireEntier(0, 2);
        printf("%d\n", choix);
        switch (choix) {
            case 1: printf("-> affichage du catalogue\n"); nbAffichages++; break;
            case 2: printf("-> affichage des clients\n"); nbAffichages++; break;
            case 0: printf("-> au revoir\n"); break;
        }
    } while (choix != 0);
    printf("%d affichages\n", nbAffichages);
    return 0;
}`,
        `[1] Catalogue [2] Clients [0] Quitter > Choix invalide, recommencez
Choix invalide, recommencez
1
-> affichage du catalogue
[1] Catalogue [2] Clients [0] Quitter > 2
-> affichage des clients
[1] Catalogue [2] Clients [0] Quitter > 0
-> au revoir
2 affichages`,
        [
          ['while (scanf("%d", &x) != 1 || x < min || x > max) {', 'Deux échecs possibles : ce n’est pas un nombre (scanf renvoie 0), ou le nombre est hors limites.'],
          ['while ((c = getchar()) != \'\\n\' && c != EOF) {', 'On jette le reste de la ligne (ici la lettre « a ») ; sinon scanf la relirait indéfiniment.'],
          ['if (c == EOF) {', 'Fin de l’entrée : on renvoie min (0 = Quitter) pour éviter une boucle infinie.'],
          ['choix = lireEntier(0, 2);', 'Le main ne reçoit que des choix valides.'],
          ['switch (choix) {', 'Un case par option, chacun appelant une fonction de module dans le vrai projet.'],
          ['} while (choix != 0);', 'do…while : le menu s’affiche au moins une fois.'],
        ],
        'a\n7\n1\n2\n0\n'
      ),
      intermediateExample: cExample(
        'Mini-ShopFlow : un scénario complet de bout en bout',
        'Initialisation dynamique, commande à lignes dynamiques, calcul en cascade, annulation avec réintégration du stock, libération complète.',
        String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef enum { EN_COURS, EXPEDIEE, LIVREE, ANNULEE } Statut;
typedef struct { char reference[12]; float prixUnitaireHT; int quantiteStock; } Produit;
typedef struct { char refProduit[12]; int quantite; float prixUnitaireHT; } LigneCommande;
typedef struct {
    int numero; Statut statut;
    int nbLignes, capaciteLignes; LigneCommande *lignes;
    float montantBrutHT, montantTTC;
} Commande;
typedef struct { Produit *produits; int nbProduits; int numeroSuivant; } Boutique;

int initialiser(Boutique *b) {
    b->produits = malloc(3 * sizeof(Produit));
    if (b->produits == NULL) return 0;
    Produit modele[3] = {{"PRD-0001", 79.90f, 42}, {"PRD-0004", 89.90f, 25}, {"PRD-0006", 9.90f, 120}};
    for (int i = 0; i < 3; i++) b->produits[i] = modele[i];
    b->nbProduits = 3;
    b->numeroSuivant = 1007;
    return 1;
}

Produit *trouverProduit(Boutique *b, const char *ref) {
    for (int i = 0; i < b->nbProduits; i++)
        if (strcmp(b->produits[i].reference, ref) == 0) return &b->produits[i];
    return NULL;
}

int ajouterLigne(Boutique *b, Commande *c, const char *ref, int qte) {
    Produit *p = trouverProduit(b, ref);
    if (p == NULL || qte <= 0 || qte > p->quantiteStock || c->statut != EN_COURS) return 0;
    if (c->nbLignes == c->capaciteLignes) {
        int cap = c->capaciteLignes == 0 ? 2 : 2 * c->capaciteLignes;
        LigneCommande *tmp = realloc(c->lignes, cap * sizeof(LigneCommande));
        if (tmp == NULL) return 0;
        c->lignes = tmp;
        c->capaciteLignes = cap;
    }
    LigneCommande *l = &c->lignes[c->nbLignes++];
    strcpy(l->refProduit, ref);
    l->quantite = qte;
    l->prixUnitaireHT = p->prixUnitaireHT;
    p->quantiteStock -= qte;
    return 1;
}

void calculer(Commande *c) {
    c->montantBrutHT = 0.0f;
    for (int i = 0; i < c->nbLignes; i++) c->montantBrutHT += c->lignes[i].quantite * c->lignes[i].prixUnitaireHT;
    float taux = c->montantBrutHT >= 600 ? 15 : c->montantBrutHT >= 300 ? 10 : c->montantBrutHT >= 100 ? 5 : 0;
    float ht = c->montantBrutHT * (1 - taux / 100);
    c->montantTTC = ht * 1.20f + (c->montantBrutHT >= 60 ? 0.0f : 5.90f);
}

int annuler(Boutique *b, Commande *c) {
    if (c->statut != EN_COURS) return 0;
    for (int i = 0; i < c->nbLignes; i++) trouverProduit(b, c->lignes[i].refProduit)->quantiteStock += c->lignes[i].quantite;
    c->statut = ANNULEE;
    return 1;
}

int main(void) {
    Boutique b;
    if (!initialiser(&b)) return 1;
    Commande c = {b.numeroSuivant++, EN_COURS, 0, 0, NULL, 0.0f, 0.0f};
    ajouterLigne(&b, &c, "PRD-0001", 2);
    ajouterLigne(&b, &c, "PRD-0004", 3);
    ajouterLigne(&b, &c, "PRD-0006", 10);
    calculer(&c);
    printf("Commande %d : %d lignes (capacite %d), brut %.2f, TTC %.2f\n",
           c.numero, c.nbLignes, c.capaciteLignes, c.montantBrutHT, c.montantTTC);
    printf("Stocks apres commande : %d %d %d\n", b.produits[0].quantiteStock,
           b.produits[1].quantiteStock, b.produits[2].quantiteStock);
    printf("Annulation : %s\n", annuler(&b, &c) ? "OK" : "refusee");
    printf("Stocks apres annulation : %d %d %d\n", b.produits[0].quantiteStock,
           b.produits[1].quantiteStock, b.produits[2].quantiteStock);
    printf("2e annulation : %s\n", annuler(&b, &c) ? "OK" : "refusee");
    free(c.lignes);
    free(b.produits);
    return 0;
}`,
        `Commande 1007 : 3 lignes (capacite 4), brut 528.50, TTC 570.78
Stocks apres commande : 40 22 110
Annulation : OK
Stocks apres annulation : 42 25 120
2e annulation : refusee`,
        [
          ['int initialiser(Boutique *b) {', 'Rôle de initialisation.c : allocation vérifiée et données cohérentes.'],
          ['b->numeroSuivant = 1007;', 'Le compteur démarre après les numéros des commandes de démonstration.'],
          ['if (p == NULL || qte <= 0 || qte > p->quantiteStock || c->statut != EN_COURS) return 0;', 'Tous les contrôles avant toute modification : intégrité, quantité, stock, statut.'],
          ['LigneCommande *tmp = realloc(c->lignes, cap * sizeof(LigneCommande));', 'Les lignes forment un tableau dynamique (C04).'],
          ['l->prixUnitaireHT = p->prixUnitaireHT;', 'Prix figé au moment de la vente : une hausse de prix ultérieure ne modifie pas la commande.'],
          ['p->quantiteStock -= qte;', 'Cohérence du stock (C08).'],
          ['float taux = c->montantBrutHT >= 600 ? 15 : c->montantBrutHT >= 300 ? 10 : c->montantBrutHT >= 100 ? 5 : 0;', 'Paliers (C06) : 528,50 € → 10 %.'],
          ['if (c->statut != EN_COURS) return 0;', 'Machine à états (C07) : la 2e annulation est refusée, le stock n’est pas réintégré deux fois.'],
          ['free(c.lignes);', 'Libération complète (C05) : lignes, puis produits.'],
        ]
      ),
      commonMistakes: [
        {
          title: 'Boucle de menu infinie après une lettre',
          wrongCode: `do {
    scanf("%d", &choix);   /* "a" reste dans le tampon */
    ...
} while (choix != 0);`,
          rightCode: `do {
    choix = lireEntier(0, 9);  /* teste le retour de scanf
                                  et vide le tampon */
    ...
} while (choix != 0);`,
          explanation: 'scanf("%d") échoue sur « a » sans le consommer : chaque tour relit le même « a ». La valeur de choix reste l’ancienne et la boucle ne s’arrête jamais.',
          errorType: 'execution',
        },
        {
          title: 'Quitter sans libérer la boutique',
          wrongCode: `case 0:
    printf("Au revoir\\n");
    exit(0);     /* detruireBoutique jamais appele */`,
          rightCode: `case 0:
    printf("Au revoir\\n");
    break;
}
} while (choix != 0);
detruireBoutique(&b);
return 0;`,
          explanation: 'valgrind signalerait toute la mémoire comme non libérée. On sort de la boucle normalement et on détruit avant return.',
          errorType: 'execution',
        },
        {
          title: 'Données de démonstration incohérentes',
          wrongCode: `/* commande 1004 : client 9 (inexistant),
   ligne PRD-0012 (inexistante),
   numeroSuivant = 1001 (deja utilise) */`,
          rightCode: `/* clients 1..5, references PRD-0001..PRD-0008,
   stock decremente pour chaque commande non annulee,
   numeroSuivant = 1007, idClientSuivant = 6 */`,
          explanation: 'La section 7 du sujet exige des données cohérentes : références valides, clients existants, stock suffisant, et 6 commandes couvrant les 4 statuts.',
          errorType: 'logique',
        },
      ],
      summary: [
        'main.c : initialiserDonneesTest → boucle do/while + switch → detruireBoutique.',
        'Saisie de choix : tester le retour de scanf, vider le tampon, gérer EOF.',
        'Une option de menu = un appel de fonction d’un module.',
        'Données de test : 8 produits (3 catégories, 2 en alerte), 5 clients, 6 commandes (4 statuts, deux de 3 lignes ou plus, une ≥ 600 € HT).',
        'Compiler avec -Wall -Wextra sans avertissement ; valgrind sans fuite.',
        'Deux fonctionnalités créatives à ajouter, chacune dans son module.',
      ],
      comprehensionQuestions: [
        {
          id: 'C10_Q1',
          question: 'Que renvoie scanf("%d", &x) si l’utilisateur tape « abc » ?',
          options: ['-1', '0 (aucune conversion réussie) et « abc » reste dans le tampon', '3', 'x vaut 0'],
          correctIndex: 1,
          explanation: 'scanf renvoie le nombre de conversions réussies : 0. Les caractères non lus restent en attente, d’où la nécessité de vider le tampon.',
        },
        {
          id: 'C10_Q2',
          question: 'À quel endroit appeler detruireBoutique ?',
          options: [
            'Dans chaque case du switch',
            'Une seule fois, après la boucle du menu, juste avant return 0',
            'Avant la boucle du menu',
            'Jamais : le système libère la mémoire à la fin',
          ],
          correctIndex: 1,
          explanation: 'La Boutique vit pendant toute la boucle ; on la détruit une seule fois à la fin. Le sujet sanctionne toute fuite détectée par valgrind.',
        },
        {
          id: 'C10_Q3',
          question: 'Quelle commande de démonstration est INDISPENSABLE d’après la section 7 du sujet ?',
          options: [
            'Une commande sans ligne',
            'Une commande dépassant le palier de 600 € HT',
            'Une commande d’un client inexistant',
            'Une commande avec deux lignes de même référence',
          ],
          correctIndex: 1,
          explanation: 'Il faut au moins une commande ≥ 600 € HT (palier 15 %), deux commandes de 3 lignes ou plus et les 4 statuts représentés.',
        },
      ],
    },
    exercises: [
      {
        id: 'C10_E1',
        chapterId: 'C10',
        trackId: 'projet',
        title: 'Reconstituer le main de ShopFlow',
        difficulty: 'intermediaire',
        category: 'ordering',
        testedSkill: 'Cycle de vie : initialisation, boucle de menu, destruction',
        prerequisites: ['C10'],
        statement: 'Remettez les lignes de main.c dans l’ordre.',
        isCoreValidationExercise: true,
        scrambledLines: [
          '    } while (choix != 0);',
          '    detruireBoutique(&b);',
          '    int choix = 0;',
          'int main(void) {',
          '        traiterChoix(&b, choix);',
          '    initialiserDonneesTest(&b);',
          '    return 0;',
          '    do {',
          '    Boutique b;',
          '        afficherMenu();',
          '}',
          '        choix = lireEntier(0, 9);',
        ],
        correctOrderIndices: [3, 8, 5, 2, 7, 9, 11, 4, 0, 1, 6, 10],
        hints: [
          'On déclare la Boutique avant de pouvoir l’initialiser.',
          'Dans la boucle : afficher, lire, traiter.',
          'La destruction vient après la boucle et avant return 0.',
        ],
        detailedExplanation: `int main(void) {
    Boutique b;
    initialiserDonneesTest(&b);
    int choix = 0;
    do {
        afficherMenu();
        choix = lireEntier(0, 9);
        traiterChoix(&b, choix);
    } while (choix != 0);
    detruireBoutique(&b);
    return 0;
}
(int choix peut aussi être déclaré avant l’initialisation : les deux ordres sont corrects en C99, mais l’ordre ci-dessus est celui attendu.)`,
      },
      {
        id: 'C10_E2',
        chapterId: 'C10',
        trackId: 'projet',
        title: 'Synthèse : traiter une commande complète',
        difficulty: 'synthese',
        category: 'synthesis',
        testedSkill: 'Combiner tableau dynamique, stock, cascade de calcul, statut et libération',
        prerequisites: ['C04', 'C05', 'C06', 'C07', 'C08'],
        statement: `Catalogue fixe : PRD-0001 Clavier 79.90 € (stock 10), PRD-0004 Casque 89.90 € (stock 5), PRD-0006 Cable 9.90 € (stock 50).
Le programme lit n, puis n saisies « REF QTE », puis une action VALIDER ou ANNULER.
1. Les lignes sont stockées dans un **tableau dynamique** (realloc). Une saisie est refusée (« Ligne refusee : REF ») si la référence est inconnue, si QTE ≤ 0 ou si la quantité cumulée dépasse le stock ; une référence déjà présente est fusionnée. Le stock est décrémenté à chaque saisie acceptée.
2. Si aucune ligne n’est acceptée : afficher « Commande vide » puis les stocks.
3. Sinon afficher (2 décimales, % entier) :
    Brut HT : X
    Remise (T%) : X
    HT : X
    TVA : X
    Port : X
    TTC : X
    Points : N
4. ANNULER : réintégrer le stock, afficher « Statut : ANNULEE » et « Points credites : 0 ». VALIDER : « Statut : EN_COURS » et « Points credites : N ».
5. Afficher « PRD-0001 : s1 | PRD-0004 : s2 | PRD-0006 : s3 », puis libérer toute la mémoire.`,
        isCoreValidationExercise: true,
        starterCode: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { char reference[12]; float prixUnitaireHT; int quantiteStock; } Produit;
typedef struct { char refProduit[12]; int quantite; float prixUnitaireHT; } LigneCommande;
typedef struct { int nbLignes; int capaciteLignes; LigneCommande *lignes; } Commande;

int main(void) {
    Produit cat[3] = {
        {"PRD-0001", 79.90f, 10},
        {"PRD-0004", 89.90f, 5},
        {"PRD-0006", 9.90f, 50}
    };
    Commande c = {0, 0, NULL};
    int n = 0;
    scanf("%d", &n);
    for (int s = 0; s < n; s++) {
        char ref[12];
        int qte = 0;
        scanf("%11s %d", ref, &qte);
        /* TODO */
    }
    char action[12];
    scanf("%11s", action);
    /* TODO */
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { char reference[12]; float prixUnitaireHT; int quantiteStock; } Produit;
typedef struct { char refProduit[12]; int quantite; float prixUnitaireHT; } LigneCommande;
typedef struct { int nbLignes; int capaciteLignes; LigneCommande *lignes; } Commande;

int indiceProduit(const Produit cat[], int nb, const char *ref) {
    for (int i = 0; i < nb; i++) {
        if (strcmp(cat[i].reference, ref) == 0) return i;
    }
    return -1;
}

int ajouterLigne(Commande *c, Produit cat[], int nb, const char *ref, int qte) {
    int ip = indiceProduit(cat, nb, ref);
    if (ip < 0 || qte <= 0 || qte > cat[ip].quantiteStock) return 0;
    for (int i = 0; i < c->nbLignes; i++) {
        if (strcmp(c->lignes[i].refProduit, ref) == 0) {
            c->lignes[i].quantite += qte;
            cat[ip].quantiteStock -= qte;
            return 1;
        }
    }
    if (c->nbLignes == c->capaciteLignes) {
        int cap = (c->capaciteLignes == 0) ? 1 : 2 * c->capaciteLignes;
        LigneCommande *tmp = realloc(c->lignes, cap * sizeof(LigneCommande));
        if (tmp == NULL) return 0;
        c->lignes = tmp;
        c->capaciteLignes = cap;
    }
    LigneCommande *l = &c->lignes[c->nbLignes];
    strcpy(l->refProduit, ref);
    l->quantite = qte;
    l->prixUnitaireHT = cat[ip].prixUnitaireHT;
    c->nbLignes++;
    cat[ip].quantiteStock -= qte;
    return 1;
}

int tauxRemise(float brut) {
    if (brut >= 600.0f) return 15;
    if (brut >= 300.0f) return 10;
    if (brut >= 100.0f) return 5;
    return 0;
}

void afficherStocks(const Produit cat[]) {
    printf("PRD-0001 : %d | PRD-0004 : %d | PRD-0006 : %d\n",
           cat[0].quantiteStock, cat[1].quantiteStock, cat[2].quantiteStock);
}

int main(void) {
    Produit cat[3] = {
        {"PRD-0001", 79.90f, 10},
        {"PRD-0004", 89.90f, 5},
        {"PRD-0006", 9.90f, 50}
    };
    Commande c = {0, 0, NULL};
    int n = 0;
    scanf("%d", &n);
    for (int s = 0; s < n; s++) {
        char ref[12];
        int qte = 0;
        scanf("%11s %d", ref, &qte);
        if (!ajouterLigne(&c, cat, 3, ref, qte)) {
            printf("Ligne refusee : %s\n", ref);
        }
    }
    char action[12];
    scanf("%11s", action);

    if (c.nbLignes == 0) {
        printf("Commande vide\n");
        afficherStocks(cat);
        free(c.lignes);
        return 0;
    }

    float brut = 0.0f;
    for (int i = 0; i < c.nbLignes; i++) {
        brut += c.lignes[i].quantite * c.lignes[i].prixUnitaireHT;
    }
    int taux = tauxRemise(brut);
    float remise = brut * taux / 100.0f;
    float ht = brut - remise;
    float tva = ht * 20.0f / 100.0f;
    float port = (brut >= 60.0f) ? 0.0f : 5.90f;
    float ttc = ht + tva + port;
    int points = (int)(ttc / 10.0f);
    printf("Brut HT : %.2f\n", brut);
    printf("Remise (%d%%) : %.2f\n", taux, remise);
    printf("HT : %.2f\n", ht);
    printf("TVA : %.2f\n", tva);
    printf("Port : %.2f\n", port);
    printf("TTC : %.2f\n", ttc);
    printf("Points : %d\n", points);

    if (strcmp(action, "ANNULER") == 0) {
        for (int i = 0; i < c.nbLignes; i++) {
            int ip = indiceProduit(cat, 3, c.lignes[i].refProduit);
            cat[ip].quantiteStock += c.lignes[i].quantite;
        }
        printf("Statut : ANNULEE\n");
        printf("Points credites : 0\n");
    } else {
        printf("Statut : EN_COURS\n");
        printf("Points credites : %d\n", points);
    }
    afficherStocks(cat);
    free(c.lignes);
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Palier 10 %, validée', category: 'normal', stdin: '2\nPRD-0001 2\nPRD-0004 2\nVALIDER\n', expectedStdout: 'Brut HT : 339.60\nRemise (10%) : 33.96\nHT : 305.64\nTVA : 61.13\nPort : 0.00\nTTC : 366.77\nPoints : 36\nStatut : EN_COURS\nPoints credites : 36\nPRD-0001 : 8 | PRD-0004 : 3 | PRD-0006 : 50', explanation: '2 claviers + 2 casques.', mustContainConstructs: ['realloc'], forbidMemoryLeaks: true },
          { id: 't2', label: 'Petit panier annulé (port payant)', category: 'normal', stdin: '1\nPRD-0006 3\nANNULER\n', expectedStdout: 'Brut HT : 29.70\nRemise (0%) : 0.00\nHT : 29.70\nTVA : 5.94\nPort : 5.90\nTTC : 41.54\nPoints : 4\nStatut : ANNULEE\nPoints credites : 0\nPRD-0001 : 10 | PRD-0004 : 5 | PRD-0006 : 50', explanation: 'L’annulation réintègre les 3 câbles.', mustContainConstructs: ['realloc'], forbidMemoryLeaks: true },
          { id: 't3', label: 'Palier 15 % avec fusion et refus', category: 'limite', stdin: '5\nPRD-0004 3\nPRD-0001 3\nPRD-0004 2\nPRD-0009 1\nPRD-0004 1\nVALIDER\n', expectedStdout: 'Ligne refusee : PRD-0009\nLigne refusee : PRD-0004\nBrut HT : 689.20\nRemise (15%) : 103.38\nHT : 585.82\nTVA : 117.16\nPort : 0.00\nTTC : 702.98\nPoints : 70\nStatut : EN_COURS\nPoints credites : 70\nPRD-0001 : 7 | PRD-0004 : 0 | PRD-0006 : 50', explanation: 'Casques fusionnés à 5 (= stock) ; le 6e est refusé ; PRD-0009 est inconnu.', mustContainConstructs: ['realloc'], forbidMemoryLeaks: true },
          { id: 't4', label: 'Palier 5 % (12 câbles)', category: 'normal', stdin: '1\nPRD-0006 12\nVALIDER\n', expectedStdout: 'Brut HT : 118.80\nRemise (5%) : 5.94\nHT : 112.86\nTVA : 22.57\nPort : 0.00\nTTC : 135.43\nPoints : 13\nStatut : EN_COURS\nPoints credites : 13\nPRD-0001 : 10 | PRD-0004 : 5 | PRD-0006 : 38', explanation: 'Port offert car brut ≥ 60.', forbidMemoryLeaks: true },
          { id: 't5', label: 'Toutes les lignes refusées', category: 'invalide', stdin: '2\nPRD-0004 6\nPRD-0001 0\nVALIDER\n', expectedStdout: 'Ligne refusee : PRD-0004\nLigne refusee : PRD-0001\nCommande vide\nPRD-0001 : 10 | PRD-0004 : 5 | PRD-0006 : 50', explanation: 'Une commande doit avoir au moins une ligne.', forbidMemoryLeaks: true },
        ],
        hints: [
          'Écrivez d’abord indiceProduit et ajouterLigne (recherche, contrôles, fusion, realloc, décrément du stock) en reprenant C04 et C08.',
          'Puis la cascade de C06 : brut, taux, remise, HT, TVA, port (seuil sur le brut), TTC, points.',
          'ANNULER : boucle sur les lignes pour réintégrer le stock ; terminez dans tous les cas par free(c.lignes).',
        ],
        detailedExplanation: 'Ce programme est un ShopFlow miniature : tableau dynamique de lignes (C04), libération (C05), cascade de calcul (C06), statut et effet de l’annulation (C07), recherche, fusion et stock cumulé (C08). Dans le vrai projet, chaque fonction irait dans son module (commande.c pour ajouterLigne et le calcul, produit.c pour indiceProduit) et la commande serait rattachée au tableau commandes du client.',
      },
      {
        id: 'C10_E3',
        chapterId: 'C10',
        trackId: 'projet',
        title: 'Lire un rapport valgrind avant la soutenance',
        difficulty: 'intermediaire',
        category: 'qcm',
        testedSkill: 'Interpréter les diagnostics mémoire',
        prerequisites: ['C05', 'C10'],
        statement: `Vous lancez valgrind --leak-check=full ./shopflow, vous créez une commande puis vous quittez. Le rapport se termine par :

    HEAP SUMMARY:
        in use at exit: 48 bytes in 1 blocks
    48 bytes in 1 blocks are definitely lost in loss record 1 of 1
       at 0x...: realloc
       by 0x...: ajouterLigne (commande.c:57)
       by 0x...: creerCommande (commande.c:112)

Quelle est l’explication la plus probable ?`,
        isCoreValidationExercise: true,
        options: [
          'Un double free dans detruireBoutique',
          'Le tableau de lignes de la nouvelle commande n’est jamais libéré : la commande n’a pas été rattachée au client (ou detruireBoutique ne libère pas ses lignes)',
          'Une division par zéro dans le calcul de la TVA',
          'Le catalogue des produits est trop grand',
        ],
        correctOptionIndex: 1,
        hints: [
          '« definitely lost » signifie que plus aucun pointeur ne désigne ce bloc.',
          'La pile d’appels indique où le bloc a été ALLOUÉ : dans ajouterLigne, par realloc.',
          'Quel tableau ajouterLigne alloue-t-elle ? Qui est censé le libérer ?',
        ],
        detailedExplanation: 'valgrind montre l’endroit de l’allocation, pas celui de l’oubli. Le bloc vient du realloc des lignes : soit la commande créée n’a jamais été ajoutée au tableau commandes du client (ses lignes sont alors inaccessibles pour detruireBoutique), soit detruireBoutique oublie le niveau des lignes. Un double free apparaîtrait comme « Invalid free() ».',
      },
    ],
  },
];
