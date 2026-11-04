import { Chapter } from '../types/curriculum';
import { cExample } from './projetHelpers';

// ============================================================================
// PARCOURS D — DÉFIS D'APPROFONDISSEMENT SHOPFLOW (D01 à D04)
// Même pédagogie que les parcours A à C, avec en plus une section
// « Pour aller plus loin » (deepDive), une démarche guidée par exercice
// (guidedSteps) et le lien explicite avec le code du projet (projectLink).
// ============================================================================

export const DEFI_CHAPTERS_DATA: Chapter[] = [
  // ==========================================================================
  // CHAPITRE D01 — strstr, strcmp, strtol, strtof : RÔLES ET DIFFÉRENCES
  // ==========================================================================
  {
    id: 'D01',
    trackId: 'defi',
    number: 1,
    title: 'strstr, strcmp, strtol, strtof : à quoi servent-elles et en quoi diffèrent-elles ?',
    subtitle: 'Comparer, chercher, convertir : choisir la bonne fonction et l’utiliser sans faille dans ShopFlow.',
    estimatedMinutes: 75,
    prerequisites: ['B11', 'B12', 'C03'],
    relatedChapters: ['C03', 'C08', 'D04'],
    coreConcepts: ['strcmp', 'strncmp', 'strstr', 'strtol', 'strtof', 'endptr', 'atoi vs strtol', 'validation de saisie'],
    successCriteria: [
      'Dire pour chacune des 4 fonctions ce qu’elle reçoit, ce qu’elle renvoie et ce que vaut son « échec »',
      'Écrire une conversion texte → nombre qui refuse « 3x », « abc », « » et les valeurs hors bornes',
      'Choisir la bonne fonction pour chaque besoin du projet (unicité, recherche, saisie)',
    ],
    lesson: {
      objectives: [
        'Distinguer les deux familles : comparer/chercher dans du texte (strcmp, strstr) et convertir du texte en nombre (strtol, strtof)',
        'Lire correctement les valeurs de retour : entier signé pour strcmp, pointeur ou NULL pour strstr, nombre + position d’arrêt pour strtol/strtof',
        'Comprendre le rôle du pointeur de fin (endptr) et pourquoi atoi / atof ne suffisent pas',
        'Écrire une fonction de saisie numérique robuste pour les quantités, prix et choix de menu',
        'Éviter les 6 pièges classiques (if (strcmp(...)), strstr non testé, atoi silencieux…)',
      ],
      intuition: `Ces quatre fonctions ont des noms proches mais des **métiers** très différents.

**strcmp(a, b)** — « Ces deux textes sont-ils identiques ? Lequel vient avant dans le dictionnaire ? »
Elle compare deux chaînes **entières** et renvoie un entier : **0** si elles sont identiques, un nombre **négatif** si a vient avant b, **positif** sinon. Dans ShopFlow : vérifier qu’une référence ou un email existe déjà, trier des noms.

**strstr(texte, motif)** — « Le motif apparaît-il quelque part dans le texte ? Où ? »
Elle cherche un **morceau** à l’intérieur d’une chaîne et renvoie un **pointeur** vers l’endroit trouvé, ou **NULL**. Dans ShopFlow : la recherche d’un produit par mot-clé (« usb » dans « Hub USB-C 7 ports »).

**strtol(texte, &fin, base)** — « Quel entier est écrit au début de ce texte, et où s’arrête-t-il ? »
Elle **convertit** du texte en long et indique, grâce à fin, le premier caractère qu’elle n’a pas pu lire. Dans ShopFlow : quantités, stocks, choix de menu, identifiants.

**strtof(texte, &fin)** — la même chose pour un **nombre à virgule** (float) : les prix.

Le point commun de strtol et strtof, c’est le **pointeur de fin**. C’est lui qui permet de savoir si la saisie était correcte : si fin n’a pas bougé, rien n’a été lu ; s’il reste des caractères après le nombre (« 3x »), la saisie est invalide. atoi et atof, elles, renvoient 0 en silence : impossible de distinguer « 0 » de « abc ».`,
      formalDefinition: `Prototypes (<string.h> pour les deux premières, <stdlib.h> pour les deux autres) :
    int    strcmp(const char *a, const char *b);
    int    strncmp(const char *a, const char *b, size_t n);   /* n premiers caractères */
    char  *strstr(const char *texte, const char *motif);
    long   strtol(const char *texte, char **fin, int base);
    float  strtof(const char *texte, char **fin);

Tableau de différences :
    Fonction  Rôle                    Renvoie                      « Échec » signalé par
    strcmp    comparer 2 chaînes      int (<0, 0, >0)              — (pas d’échec : 0 = égales)
    strstr    chercher un motif       char * (début trouvé)        NULL
    strtol    convertir en entier     long                         *fin == texte (rien lu)
    strtof    convertir en réel       float                        *fin == texte (rien lu)

Règles précises :
- strcmp compare caractère par caractère (valeur numérique des octets) jusqu’à la première différence ou au \\0. Le signe compte, **pas la valeur** : ne testez jamais == -1 ou == 1. Elle est sensible à la casse : "PRD" ≠ "prd".
- strstr("abc", "") renvoie "abc" (le motif vide est partout). La position se calcule par différence de pointeurs : p - texte.
- strtol saute les espaces initiaux, accepte un signe + ou -, puis lit les chiffres de la base (10 pour nous). Base 0 : détecte 0x (hexa) et 0 (octal). Dépassement : renvoie LONG_MAX/LONG_MIN et met errno à ERANGE.
- strtof lit aussi « 1e3 » et « .5 ». Elle s’arrête au premier caractère impossible : dans « 79,90 », la virgule arrête la lecture à 79.
- Saisie valide = **4 contrôles** : quelque chose a été lu (fin != texte), il ne reste que des espaces (*fin == '\\0' après les espaces), pas de dépassement (errno), valeur dans les bornes du métier (1 ≤ qté ≤ 999, prix > 0).`,
      analogy: {
        title: 'Quatre employés d’un entrepôt',
        content: `**strcmp** est le contrôleur qui pose deux étiquettes côte à côte et dit « identiques » ou « celle-ci se range avant ». **strstr** est le magasinier qui cherche un mot sur une étiquette et pose le doigt dessus (ou dit « absent »). **strtol** et **strtof** sont les comptables qui lisent un montant écrit à la main : ils lisent les chiffres, s’arrêtent au premier gribouillis et vous montrent du doigt où ils se sont arrêtés. atoi, c’est le comptable distrait qui, devant un gribouillis, écrit 0 sans rien dire.`,
      },
      vocabulary: [
        { fr: 'Comparaison lexicographique', en: 'Lexicographic comparison', definition: 'Ordre du dictionnaire calculé caractère par caractère (strcmp).' },
        { fr: 'Sous-chaîne / motif', en: 'Substring / needle', definition: 'Morceau recherché dans une chaîne plus longue (le « haystack ») par strstr.' },
        { fr: 'Pointeur de fin', en: 'End pointer (endptr)', definition: 'Adresse du premier caractère non converti, écrite par strtol/strtof dans *fin.' },
        { fr: 'Base de numération', en: 'Radix / base', definition: 'Système de chiffres utilisé par strtol : 10 décimal, 16 hexadécimal, 0 = automatique.' },
        { fr: 'Conversion silencieuse', en: 'Silent conversion failure', definition: 'Erreur non signalée (atoi("abc") renvoie 0 comme atoi("0")).' },
        { fr: 'Dépassement de capacité', en: 'Range error / overflow', definition: 'Nombre trop grand pour le type ; strtol le signale par errno == ERANGE.' },
        { fr: 'Sensible à la casse', en: 'Case-sensitive', definition: 'Qui distingue majuscules et minuscules (strcmp, strstr).' },
      ],
      deepDive: [
        {
          title: 'Pourquoi strcmp ne renvoie pas forcément -1, 0 ou 1',
          content: `strcmp renvoie souvent la **différence des deux premiers caractères différents** (en unsigned char). strcmp("PRD-0002", "PRD-0010") compare 'P'='P', 'R'='R', … puis '0' contre '1' en 7e position : résultat négatif (souvent -1, mais ce pourrait être -49 sur une autre bibliothèque). La norme ne garantit que le **signe**. Conséquences :
- if (strcmp(a, b) == 0) → égales (le seul test d’égalité correct) ;
- if (strcmp(a, b)) → **différentes** (piège : se lit « si strcmp » mais signifie « si différentes ») ;
- dans un comparateur qsort, renvoyez directement strcmp(...) : son signe suffit.
Attention aussi : strcmp("PRD-10", "PRD-9") < 0, car '1' < '9'. Les références de ShopFlow ont une largeur fixe (PRD-0009, PRD-0010) précisément pour que l’ordre alphabétique corresponde à l’ordre numérique.`,
        },
        {
          title: 'strstr renvoie un pointeur : position, occurrences multiples, insensibilité à la casse',
          content: `Le pointeur renvoyé désigne un caractère **dans la chaîne d’origine** (pas une copie). On en tire :
- la position : (int)(p - texte) ;
- l’occurrence suivante : strstr(p + 1, motif) ;
- le reste du texte après le motif : p + strlen(motif).
strstr est sensible à la casse ; pour la recherche par mot-clé du catalogue, on compare des **copies en minuscules** (tolower), sans modifier le catalogue.`,
          code: `int compterOccurrences(const char *texte, const char *motif) {
    int n = 0;
    const char *p = strstr(texte, motif);
    while (p != NULL) {
        n++;
        p = strstr(p + 1, motif);
    }
    return n;
}`,
        },
        {
          title: 'Ce que fait strtol, caractère par caractère',
          content: `Pour la saisie « ··42xy » (deux espaces) :
1. saute les espaces → position 2 ;
2. lit un signe éventuel (aucun ici) ;
3. lit « 4 » puis « 2 » → valeur 42 ;
4. s’arrête sur « x » (pas un chiffre) et écrit dans *fin l’adresse de ce « x ».
Si la saisie est « abc », aucune lecture : la valeur est 0 et *fin vaut **le début de la chaîne**. C’est la seule façon fiable de distinguer « 0 » (fin avance d’un caractère) de « abc » (fin ne bouge pas).
Le paramètre fin est un **char \\*\\*** : strtol a besoin de l’adresse de VOTRE pointeur pour pouvoir le modifier — c’est le même mécanisme que le passage par adresse de scanf("%d", &x), un niveau plus haut.`,
        },
        {
          title: 'La conversion sûre complète (avec errno)',
          content: `Le bac à sable ne gère pas errno ; dans votre projet compilé avec gcc, ajoutez ce contrôle de dépassement :`,
          code: `#include <errno.h>
#include <ctype.h>
#include <stdlib.h>

int convertirEntier(const char *texte, long min, long max, long *resultat) {
    char *fin = NULL;
    errno = 0;
    long v = strtol(texte, &fin, 10);
    if (fin == texte) return 0;               /* rien n'a ete lu       */
    if (errno == ERANGE) return 0;            /* trop grand / petit    */
    while (isspace((unsigned char)*fin)) fin++;
    if (*fin != '\\0') return 0;               /* caracteres en trop    */
    if (v < min || v > max) return 0;         /* regle metier          */
    *resultat = v;
    return 1;
}`,
        },
        {
          title: 'atoi, atof, sscanf, strtol : tableau de décision',
          content: `    Saisie      atoi    sscanf("%d")      strtol + contrôles
    "12"        12      1 conversion, 12   valide, 12
    "12abc"     12      1 conversion, 12   REFUSÉ (reste "abc")
    "abc"       0       0 conversion       REFUSÉ (fin == texte)
    ""          0       -1 (EOF)           REFUSÉ
    "0"         0       1 conversion, 0    valide, 0 (puis bornes)
Conclusion : atoi/atof seulement pour des données **déjà sûres** (constantes du programme). Pour tout ce que tape l’utilisateur de ShopFlow : strtol/strtof avec les contrôles.`,
        },
        {
          title: 'strtof et les prix : virgule, précision, unités',
          content: `strtof suit la convention C : le séparateur décimal est le **point**. « 79,90 » est lu 79 avec fin sur la virgule : avec le contrôle *fin == '\\0', la saisie est refusée au lieu d’enregistrer un prix faux — exactement ce qu’on veut. Vous pouvez aussi, avant la conversion, remplacer la virgule par un point pour être tolérant.
Un float n’a qu’environ 7 chiffres significatifs : 79.90 est stocké 79.9000015… C’est sans conséquence pour l’affichage %.2f, mais ne comparez jamais deux prix avec ==.`,
        },
      ],
      simpleExample: cExample(
        'Les quatre fonctions côte à côte sur des données ShopFlow',
        'On observe ce que renvoie chaque fonction, y compris dans les cas « d’échec ».',
        String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    /* 1. strcmp : comparer deux chaines entieres */
    printf("strcmp egal    : %d\n", strcmp("PRD-0001", "PRD-0001") == 0);
    printf("strcmp ordre   : %d\n", strcmp("PRD-0002", "PRD-0010") < 0);
    printf("strcmp casse   : %d\n", strcmp("prd-0001", "PRD-0001") == 0);

    /* 2. strstr : chercher un motif dans une chaine */
    const char *designation = "Hub USB-C 7 ports";
    char *p = strstr(designation, "USB");
    printf("strstr trouve  : position %d, reste [%s]\n", (int)(p - designation), p);
    printf("strstr absent  : %s\n", strstr(designation, "HDMI") == NULL ? "NULL" : "trouve");

    /* 3. strtol : convertir en entier et savoir ou on s'arrete */
    char *fin = NULL;
    const char *saisie = "  12 pieces";
    long qte = strtol(saisie, &fin, 10);
    printf("strtol         : %ld, reste [%s]\n", qte, fin);
    const char *mauvaise = "abc";
    qte = strtol(mauvaise, &fin, 10);
    printf("strtol echec   : %ld, rien lu ? %d\n", qte, fin == mauvaise);

    /* 4. strtof : convertir en reel */
    float prix = strtof("79.90", &fin);
    printf("strtof         : %.2f, tout lu ? %d\n", prix, *fin == '\0');
    prix = strtof("79,90", &fin);
    printf("strtof virgule : %.2f, reste [%s]\n", prix, fin);

    /* atoi ne signale rien */
    printf("atoi(\"abc\") = %d, atoi(\"0\") = %d\n", atoi("abc"), atoi("0"));
    return 0;
}`,
        `strcmp egal    : 1
strcmp ordre   : 1
strcmp casse   : 0
strstr trouve  : position 4, reste [USB-C 7 ports]
strstr absent  : NULL
strtol         : 12, reste [ pieces]
strtol echec   : 0, rien lu ? 1
strtof         : 79.90, tout lu ? 1
strtof virgule : 79.00, reste [,90]
atoi("abc") = 0, atoi("0") = 0`,
        [
          ['printf("strcmp egal    : %d\\n", strcmp("PRD-0001", "PRD-0001") == 0);', 'Égalité = strcmp renvoie 0. On teste toujours == 0.'],
          ['strcmp("PRD-0002", "PRD-0010") < 0', 'Seul le signe compte : négatif = la première chaîne se range avant.'],
          ['strcmp("prd-0001", "PRD-0001") == 0', 'Sensible à la casse : minuscules ≠ majuscules → 0 (faux).'],
          ['char *p = strstr(designation, "USB");', 'p pointe DANS designation, sur le « U » de USB.'],
          ['(int)(p - designation)', 'Différence de deux pointeurs = nombre de caractères entre eux : 4.'],
          ['strstr(designation, "HDMI") == NULL', 'Motif absent : NULL. Ne jamais déréférencer le résultat sans ce test.'],
          ['long qte = strtol(saisie, &fin, 10);', 'Saute les espaces, lit 12, s’arrête sur l’espace avant « pieces ». &fin : strtol modifie NOTRE pointeur.'],
          ['printf("strtol echec   : %ld, rien lu ? %d\\n", qte, fin == mauvaise);', 'Rien lu : la valeur 0 est un leurre, c’est fin == début qui révèle l’échec.'],
          ['printf("strtof         : %.2f, tout lu ? %d\\n", prix, *fin == \'\\0\');', '*fin == \'\\0\' : toute la chaîne a été consommée, la saisie est propre.'],
          ['prix = strtof("79,90", &fin);', 'La virgule n’est pas un séparateur décimal en C : lecture de 79 seulement.'],
          ['atoi("abc"), atoi("0")', 'Même résultat 0 : atoi ne permet pas de détecter une saisie invalide.'],
        ]
      ),
      intermediateExample: cExample(
        'Une saisie numérique robuste pour ShopFlow',
        'convertirEntier et convertirPrix appliquent les contrôles (rien lu, reste, bornes) sur plusieurs saisies lues avec fgets.',
        String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

int convertirEntier(const char *texte, long min, long max, long *resultat) {
    char *fin = NULL;
    long v = strtol(texte, &fin, 10);
    if (fin == texte) return 0;
    while (isspace((unsigned char)*fin)) fin++;
    if (*fin != '\0') return 0;
    if (v < min || v > max) return 0;
    *resultat = v;
    return 1;
}

int convertirPrix(const char *texte, float *prix) {
    char *fin = NULL;
    float v = strtof(texte, &fin);
    if (fin == texte) return 0;
    while (isspace((unsigned char)*fin)) fin++;
    if (*fin != '\0' || v <= 0.0f) return 0;
    *prix = v;
    return 1;
}

int main(void) {
    char ligne[64];
    while (fgets(ligne, sizeof(ligne), stdin) != NULL) {
        ligne[strcspn(ligne, "\n")] = '\0';
        long qte = 0;
        float prix = 0.0f;
        if (convertirEntier(ligne, 1, 999, &qte)) {
            printf("[%s] quantite %ld\n", ligne, qte);
        } else if (convertirPrix(ligne, &prix)) {
            printf("[%s] prix %.2f\n", ligne, prix);
        } else {
            printf("[%s] REFUSE\n", ligne);
        }
    }
    return 0;
}`,
        `[12] quantite 12
[  7 ] quantite 7
[3x] REFUSE
[0] REFUSE
[24.50] prix 24.50
[79,90] REFUSE
[] REFUSE`,
        [
          ['int convertirEntier(const char *texte, long min, long max, long *resultat) {', 'Renvoie 1/0 et écrit la valeur via un pointeur : l’appelant sait SI la conversion a réussi ET la valeur.'],
          ['if (fin == texte) return 0;', 'Contrôle 1 : au moins un chiffre a été lu.'],
          ['while (isspace((unsigned char)*fin)) fin++;', 'On tolère des espaces (ou le \\n) après le nombre ; le cast évite un comportement indéfini sur les caractères accentués.'],
          ['if (*fin != \'\\0\') return 0;', 'Contrôle 2 : plus rien après le nombre (« 3x » est refusé).'],
          ['if (v < min || v > max) return 0;', 'Contrôle 3 : règle métier (une quantité de 0 est refusée).'],
          ['if (*fin != \'\\0\' || v <= 0.0f) return 0;', 'Un prix doit être strictement positif ; « 79,90 » est refusé car il reste « ,90 ».'],
          ['if (convertirEntier(ligne, 1, 999, &qte)) {', '« 24.50 » échoue ici (reste « .50 ») puis réussit comme prix : l’ordre des essais compte.'],
          ['printf("[%s] REFUSE\\n", ligne);', 'Une ligne vide est refusée par les deux fonctions (fin == texte).'],
        ],
        '12\n  7 \n3x\n0\n24.50\n79,90\n\n'
      ),
      commonMistakes: [
        {
          title: 'Lire if (strcmp(a, b)) comme « si égales »',
          wrongCode: `if (strcmp(p->reference, ref)) {
    return i;   /* renvoie le premier produit DIFFERENT ! */
}`,
          rightCode: `if (strcmp(p->reference, ref) == 0) {
    return i;
}`,
          explanation: 'strcmp renvoie 0 (faux) quand les chaînes sont égales. Sans == 0, la condition est vraie pour toute référence différente.',
          errorType: 'logique',
        },
        {
          title: 'Utiliser le résultat de strstr sans tester NULL',
          wrongCode: `char *p = strstr(c->email, "@");
printf("Domaine : %s\\n", p + 1);   /* crash si pas de @ */`,
          rightCode: `char *p = strstr(c->email, "@");
if (p != NULL) {
    printf("Domaine : %s\\n", p + 1);
}`,
          explanation: 'Quand le motif est absent, strstr renvoie NULL : p + 1 vaut l’adresse 1, et son affichage provoque une erreur de segmentation.',
          errorType: 'execution',
        },
        {
          title: 'Valider une quantité avec atoi',
          wrongCode: `int qte = atoi(saisie);
if (qte <= 0) printf("Quantite invalide\\n");
/* "3x" -> 3 accepte ; "abc" -> 0 : message trompeur */`,
          rightCode: `long qte = 0;
if (!convertirEntier(saisie, 1, 999, &qte)) {
    printf("Quantite invalide\\n");
}`,
          explanation: 'atoi ignore les caractères en trop et renvoie 0 sans signaler d’erreur. strtol + pointeur de fin détecte les deux cas.',
          errorType: 'logique',
        },
        {
          title: 'Oublier le & devant le pointeur de fin',
          wrongCode: `char *fin;
long v = strtol(saisie, fin, 10);   /* passe la VALEUR (indeterminee) de fin */`,
          rightCode: `char *fin = NULL;
long v = strtol(saisie, &fin, 10);  /* passe l'ADRESSE de fin */`,
          explanation: 'strtol attend un char ** : l’adresse d’une variable pointeur qu’elle va remplir. gcc -Wall le signale (« incompatible pointer type »).',
          errorType: 'compilation',
        },
        {
          title: 'Comparer une chaîne à un caractère',
          wrongCode: `if (strcmp(choix, 'O') == 0)   /* 'O' est un int, pas une chaine */`,
          rightCode: `if (choix[0] == 'O' && choix[1] == '\\0')
/* ou */
if (strcmp(choix, "O") == 0)`,
          explanation: 'Les guillemets simples désignent UN caractère (un entier), les guillemets doubles une chaîne terminée par \\0.',
          errorType: 'compilation',
        },
      ],
      summary: [
        'strcmp : compare 2 chaînes entières → int ; égalité ⇔ == 0 ; seul le signe compte.',
        'strstr : cherche un motif → pointeur dans la chaîne ou NULL ; position = p - texte.',
        'strtol / strtof : convertissent → nombre + position d’arrêt dans *fin (passer &fin).',
        'Saisie valide : fin != texte, rien après le nombre (hors espaces), pas d’ERANGE, bornes métier.',
        'atoi / atof : jamais pour une saisie utilisateur (échec silencieux).',
        'Toutes sont sensibles à la casse ; strtof veut un point décimal.',
      ],
      comprehensionQuestions: [
        {
          id: 'D01_Q1',
          question: 'Quelle fonction utiliser pour savoir si l’email saisi existe déjà dans le répertoire ?',
          options: ['strstr', 'strcmp', 'strtol', 'strtof'],
          correctIndex: 1,
          explanation: 'On compare deux chaînes entières : strcmp(clients[i].email, saisie) == 0. strstr accepterait « a@b.fr » comme doublon de « la@b.fr ».',
        },
        {
          id: 'D01_Q2',
          question: 'Après `long v = strtol("abc", &fin, 10);`, que valent v et fin ?',
          options: [
            'v = 0 et fin pointe sur le « a » (début de la chaîne)',
            'v = 0 et fin vaut NULL',
            'v = -1 et fin pointe sur la fin',
            'Le programme plante',
          ],
          correctIndex: 0,
          explanation: 'Aucun chiffre lu : la valeur est 0 et *fin reçoit l’adresse de départ. C’est le signal d’échec.',
        },
        {
          id: 'D01_Q3',
          question: 'Que signifie `if (strcmp(a, b))` ?',
          options: ['Si a et b sont égales', 'Si a et b sont différentes', 'Si a est plus courte que b', 'Si a contient b'],
          correctIndex: 1,
          explanation: 'Toute valeur non nulle est vraie : la condition est vraie quand strcmp ne renvoie pas 0, donc quand les chaînes diffèrent.',
        },
        {
          id: 'D01_Q4',
          question: 'Pourquoi strtol prend-elle un `char **` et non un `char *` comme 2e paramètre ?',
          options: [
            'Pour lire deux chaînes',
            'Parce qu’elle doit modifier un pointeur de l’appelant : il faut donc l’adresse de ce pointeur',
            'Pour renvoyer un tableau',
            'C’est une erreur historique sans importance',
          ],
          correctIndex: 1,
          explanation: 'Pour modifier une variable de l’appelant, on passe son adresse. La variable étant un char *, son adresse est un char **.',
        },
      ],
    },
    exercises: [
      {
        id: 'D01_E1',
        chapterId: 'D01',
        trackId: 'defi',
        title: 'Choisir la fonction qui détecte une quantité « 3x »',
        difficulty: 'debutant',
        category: 'qcm',
        testedSkill: 'Différence entre atoi et strtol',
        prerequisites: ['D01'],
        projectLink: 'saisie des quantités dans le module commande (« Créer une commande : saisie de N lignes de produits »).',
        statement: 'L’utilisateur tape « 3x » comme quantité. Quelle approche permet de REFUSER cette saisie ?',
        isCoreValidationExercise: true,
        options: [
          'qte = atoi(saisie); if (qte > 0) accepter',
          'v = strtol(saisie, &fin, 10); accepter seulement si fin != saisie et *fin == \'\\0\'',
          'if (strcmp(saisie, "3") == 0) accepter',
          'if (strstr(saisie, "x") == NULL) accepter, puis atoi',
        ],
        correctOptionIndex: 1,
        hints: [
          'Que renvoie atoi("3x") ?',
          'Laquelle de ces fonctions indique où la lecture s’est arrêtée ?',
          'Avec « 3x », strtol lit 3 et laisse fin sur « x ».',
        ],
        detailedExplanation: 'atoi("3x") renvoie 3 sans rien signaler. strtol renvoie aussi 3 mais fin pointe sur « x » : *fin != \'\\0\' révèle les caractères en trop. L’option 3 n’accepte que la chaîne exacte « 3 ». L’option 4 bloque « x » mais laisse passer « 3y » ou « 3 4 ».',
      },
      {
        id: 'D01_E2',
        chapterId: 'D01',
        trackId: 'defi',
        title: 'Prédire les résultats des quatre fonctions',
        difficulty: 'intermediaire',
        category: 'prediction',
        testedSkill: 'Valeurs de retour de strcmp, strstr, strtol, strtof et atoi',
        prerequisites: ['D01'],
        statement: 'Quelle est la sortie exacte de ce programme ?',
        isCoreValidationExercise: true,
        codeSnippet: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    printf("%d\n", strcmp("PRD-0002", "PRD-0010") < 0);
    const char *d = "Cable HDMI 2 m";
    char *p = strstr(d, "HDMI");
    printf("%d\n", p == NULL ? -1 : (int)(p - d));
    char *fin = NULL;
    long n = strtol("15 pieces", &fin, 10);
    printf("%ld [%s]\n", n, fin);
    const char *s = "abc";
    float f = strtof(s, &fin);
    printf("%.1f %d\n", f, fin == s);
    printf("%d\n", atoi("12abc"));
    return 0;
}`,
        expectedOutputAnswer: '1\n6\n15 [ pieces]\n0.0 1\n12',
        ignoreWhitespaceInPrediction: false,
        hints: [
          'strcmp : à quelle position « PRD-0002 » et « PRD-0010 » diffèrent-ils ?',
          'Comptez les caractères avant « HDMI » (espace compris).',
          'strtol s’arrête sur l’espace qui précède « pieces » ; strtof("abc") ne lit rien ; atoi s’arrête au « a ».',
        ],
        detailedExplanation: 'strcmp : premières différences « 0 » contre « 1 » → négatif → 1. strstr : « Cable » + espace = 6 caractères → 6. strtol lit 15, fin = " pieces" (avec l’espace initial). strtof("abc") → 0.0 et fin == s → 1. atoi("12abc") → 12, sans erreur. Attention aux espaces : l’espace dans [ pieces] fait partie de la réponse.',
      },
      {
        id: 'D01_E3',
        chapterId: 'D01',
        trackId: 'defi',
        title: 'Tracer strtol sur six saisies',
        difficulty: 'intermediaire',
        category: 'trace',
        testedSkill: 'Comprendre le pointeur de fin et les contrôles de validité',
        prerequisites: ['D01'],
        projectLink: 'la fonction convertirEntier de utils.c, appelée pour chaque quantité et chaque choix de menu.',
        statement: 'Pour chaque saisie, complétez la valeur renvoyée par strtol(saisie, &fin, 10), le texte restant pointé par fin (écrivez « (vide) » s’il ne reste rien) et le verdict de convertirEntier(saisie, 1, 999, &q) : « oui » ou « non ».',
        isCoreValidationExercise: true,
        traceSpec: {
          language: 'c',
          code: String.raw`long v = strtol(saisie, &fin, 10);
if (fin == saisie) return 0;
while (isspace((unsigned char)*fin)) fin++;
if (*fin != '\0') return 0;
if (v < 1 || v > 999) return 0;
return 1;`,
          columns: ['saisie', 'valeur v', 'reste (fin)', 'valide ?'],
          prefilledRows: [
            { saisie: '"42"', 'valeur v': '42', 'reste (fin)': '(vide)', 'valide ?': 'oui' },
            { saisie: '"  7"', 'valeur v': '?', 'reste (fin)': '(vide)', 'valide ?': '?' },
            { saisie: '"3x"', 'valeur v': '3', 'reste (fin)': '?', 'valide ?': '?' },
            { saisie: '"abc"', 'valeur v': '?', 'reste (fin)': 'abc', 'valide ?': 'non' },
            { saisie: '"-5"', 'valeur v': '?', 'reste (fin)': '(vide)', 'valide ?': '?' },
            { saisie: '"1000"', 'valeur v': '1000', 'reste (fin)': '(vide)', 'valide ?': '?' },
          ],
          expectedAnswers: {
            '1:valeur v': '7',
            '1:valide ?': 'oui',
            '2:reste (fin)': 'x',
            '2:valide ?': 'non',
            '3:valeur v': '0',
            '4:valeur v': '-5',
            '4:valide ?': 'non',
            '5:valide ?': 'non',
          },
        },
        hints: [
          'strtol saute les espaces initiaux : « ··7 » se lit 7.',
          'Avec « abc », rien n’est lu : la valeur est 0 et fin reste au début.',
          '« -5 » et « 1000 » sont lus en entier, mais la règle métier 1 ≤ q ≤ 999 les refuse.',
        ],
        detailedExplanation: 'Quatre motifs de refus différents apparaissent : caractères en trop (« 3x »), rien lu (« abc »), valeur hors bornes (« -5 », « 1000 »). Seuls « 42 » et « ··7 » passent. Remarquez que strtol réussit techniquement sur « -5 » et « 1000 » : c’est la règle métier, pas la conversion, qui les refuse.',
      },
      {
        id: 'D01_E4',
        chapterId: 'D01',
        trackId: 'defi',
        title: 'Écrire convertirQuantite avec strtol',
        difficulty: 'intermediaire',
        category: 'c_code',
        testedSkill: 'Conversion texte → entier entièrement contrôlée',
        prerequisites: ['D01'],
        projectLink: 'à placer dans utils.c et à réutiliser pour toute saisie d’entier (quantité, stock, seuil, choix de menu).',
        statement: `Écrivez \`int convertirQuantite(const char *texte, int *qte)\` qui renvoie 1 et écrit la quantité dans *qte si texte contient un entier entre 1 et 999 (espaces autorisés avant et après), et 0 sinon.
Le main (fourni) lit des lignes jusqu’à la fin de l’entrée et affiche « OK q » ou « REFUS [texte] ».`,
        isCoreValidationExercise: true,
        guidedSteps: [
          'Déclarez char *fin = NULL; puis appelez long v = strtol(texte, &fin, 10);',
          'Si fin == texte, rien n’a été lu : renvoyez 0.',
          'Avancez fin tant que isspace((unsigned char)*fin) est vrai.',
          'Si *fin != \'\\0\', il reste des caractères : renvoyez 0.',
          'Vérifiez 1 ≤ v ≤ 999, puis écrivez *qte = (int)v; et renvoyez 1.',
        ],
        starterCode: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

int convertirQuantite(const char *texte, int *qte) {
    /* TODO */
    return 0;
}

int main(void) {
    char ligne[64];
    while (fgets(ligne, sizeof(ligne), stdin) != NULL) {
        ligne[strcspn(ligne, "\n")] = '\0';
        int q = 0;
        if (convertirQuantite(ligne, &q)) {
            printf("OK %d\n", q);
        } else {
            printf("REFUS [%s]\n", ligne);
        }
    }
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

int convertirQuantite(const char *texte, int *qte) {
    char *fin = NULL;
    long v = strtol(texte, &fin, 10);
    if (fin == texte) {
        return 0;
    }
    while (isspace((unsigned char)*fin)) {
        fin++;
    }
    if (*fin != '\0') {
        return 0;
    }
    if (v < 1 || v > 999) {
        return 0;
    }
    *qte = (int)v;
    return 1;
}

int main(void) {
    char ligne[64];
    while (fgets(ligne, sizeof(ligne), stdin) != NULL) {
        ligne[strcspn(ligne, "\n")] = '\0';
        int q = 0;
        if (convertirQuantite(ligne, &q)) {
            printf("OK %d\n", q);
        } else {
            printf("REFUS [%s]\n", ligne);
        }
    }
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Saisies valides', category: 'normal', stdin: '12\n  7\n999\n1\n', expectedStdout: 'OK 12\nOK 7\nOK 999\nOK 1', explanation: 'Bornes 1 et 999 incluses, espaces initiaux tolérés.', mustContainConstructs: ['strtol'] },
          { id: 't2', label: 'Caractères en trop', category: 'invalide', stdin: '3x\n12abc\n4 5\n', expectedStdout: 'REFUS [3x]\nREFUS [12abc]\nREFUS [4 5]', explanation: '« 4 5 » : après les espaces il reste « 5 ».', mustContainConstructs: ['strtol'] },
          { id: 't3', label: 'Rien de numérique', category: 'invalide', stdin: 'abc\n\n   \n', expectedStdout: 'REFUS [abc]\nREFUS []\nREFUS [   ]', explanation: 'fin == texte dans les trois cas.', mustContainConstructs: ['strtol'] },
          { id: 't4', label: 'Hors bornes', category: 'limite', stdin: '0\n-5\n1000\n', expectedStdout: 'REFUS [0]\nREFUS [-5]\nREFUS [1000]', explanation: 'La règle métier refuse 0, les négatifs et plus de 999.', mustContainConstructs: ['strtol'] },
          { id: 't5', label: 'Espaces après le nombre', category: 'limite', stdin: '8   \n', expectedStdout: 'OK 8', explanation: 'Les espaces finaux sont tolérés.', mustContainConstructs: ['strtol'] },
        ],
        hints: [
          'Suivez la démarche guidée dans l’ordre : chaque étape correspond à un cas de test.',
          'Pour « ··· » (espaces seulement), strtol ne lit rien : fin == texte.',
          'N’utilisez pas atoi : il est impossible de détecter « 3x » avec elle.',
        ],
        detailedExplanation: 'Chaque contrôle correspond à un cas de test : fin == texte (abc, vide, espaces), reste non vide (3x, 12abc, 4 5), bornes (0, -5, 1000). Les espaces avant sont sautés par strtol lui-même, ceux d’après par la boucle isspace. Dans le projet compilé avec gcc, ajoutez errno = 0 avant l’appel et le test errno == ERANGE.',
      },
      {
        id: 'D01_E5',
        chapterId: 'D01',
        trackId: 'defi',
        title: 'Analyser une ligne « REF;PRIX;STOCK »',
        difficulty: 'avance',
        category: 'c_code',
        testedSkill: 'Combiner strchr, strncmp, strtof et strtol sur une même ligne',
        prerequisites: ['D01'],
        projectLink: 'ajout rapide d’un produit au catalogue, ou import de produits — une des idées de fonctionnalité créative du sujet.',
        statement: `Chaque ligne d’entrée décrit un produit au format « REF;PRIX;STOCK », par exemple « PRD-0001;79.90;42 ». Pour chaque ligne, affichez :
- « Produit REF : PRIX EUR, stock STOCK » (prix avec 2 décimales) si tout est valide ;
- « ERREUR format » s’il n’y a pas exactement deux « ; » ;
- sinon « ERREUR reference » si la référence ne commence pas par « PRD- » ou fait plus de 11 caractères ;
- sinon « ERREUR prix » si le prix n’est pas un réel > 0 occupant tout le champ ;
- sinon « ERREUR stock » si le stock n’est pas un entier ≥ 0 occupant tout le champ.`,
        isCoreValidationExercise: true,
        guidedSteps: [
          'Repérez le premier « ; » avec strchr(ligne, \';\'), puis le second avec strchr(p1 + 1, \';\'). Un troisième « ; » (strchr(p2 + 1, \';\') != NULL) rend aussi le format invalide.',
          'La référence occupe p1 - ligne caractères : vérifiez 1 ≤ longueur ≤ 11 et strncmp(ligne, "PRD-", 4) == 0, puis copiez-la avec strncpy + \'\\0\'.',
          'Le prix commence en p1 + 1 : avec strtof(p1 + 1, &fin), il doit être lu (fin != p1 + 1), s’arrêter exactement sur le second « ; » (fin == p2) et être > 0.',
          'Le stock commence en p2 + 1 : avec strtol(p2 + 1, &fin, 10), il doit être lu, aller jusqu’au \'\\0\' et être ≥ 0.',
        ],
        starterCode: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char ligne[128];
    while (fgets(ligne, sizeof(ligne), stdin) != NULL) {
        ligne[strcspn(ligne, "\n")] = '\0';
        /* TODO */
    }
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void analyserLigne(const char *ligne) {
    const char *p1 = strchr(ligne, ';');
    const char *p2 = (p1 != NULL) ? strchr(p1 + 1, ';') : NULL;
    if (p1 == NULL || p2 == NULL || strchr(p2 + 1, ';') != NULL) {
        printf("ERREUR format\n");
        return;
    }
    int longueurRef = (int)(p1 - ligne);
    if (longueurRef < 1 || longueurRef > 11 || strncmp(ligne, "PRD-", 4) != 0) {
        printf("ERREUR reference\n");
        return;
    }
    char reference[12];
    strncpy(reference, ligne, longueurRef);
    reference[longueurRef] = '\0';

    char *fin = NULL;
    float prix = strtof(p1 + 1, &fin);
    if (fin == p1 + 1 || fin != p2 || prix <= 0.0f) {
        printf("ERREUR prix\n");
        return;
    }
    long stock = strtol(p2 + 1, &fin, 10);
    if (fin == p2 + 1 || *fin != '\0' || stock < 0) {
        printf("ERREUR stock\n");
        return;
    }
    printf("Produit %s : %.2f EUR, stock %ld\n", reference, prix, stock);
}

int main(void) {
    char ligne[128];
    while (fgets(ligne, sizeof(ligne), stdin) != NULL) {
        ligne[strcspn(ligne, "\n")] = '\0';
        analyserLigne(ligne);
    }
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Deux lignes valides', category: 'normal', stdin: 'PRD-0001;79.90;42\nPRD-0007;49.90;4\n', expectedStdout: 'Produit PRD-0001 : 79.90 EUR, stock 42\nProduit PRD-0007 : 49.90 EUR, stock 4', explanation: 'Format nominal.', mustContainConstructs: ['strtof', 'strtol'] },
          { id: 't2', label: 'Erreurs de format', category: 'invalide', stdin: 'PRD-0001;79.90\nPRD-0001;79.90;4;2\nsans separateur\n', expectedStdout: 'ERREUR format\nERREUR format\nERREUR format', explanation: 'Il faut exactement deux « ; ».', mustContainConstructs: ['strtof', 'strtol'] },
          { id: 't3', label: 'Références invalides', category: 'invalide', stdin: 'ABC-0001;10;1\n;10;1\nPRD-000000001;10;1\n', expectedStdout: 'ERREUR reference\nERREUR reference\nERREUR reference', explanation: 'Préfixe, vide, trop longue (13 caractères).', mustContainConstructs: ['strtof', 'strtol'] },
          { id: 't4', label: 'Prix invalides', category: 'invalide', stdin: 'PRD-0002;79,90;5\nPRD-0002;;5\nPRD-0002;-3;5\nPRD-0002;0;5\n', expectedStdout: 'ERREUR prix\nERREUR prix\nERREUR prix\nERREUR prix', explanation: 'Virgule, vide, négatif, nul.', mustContainConstructs: ['strtof', 'strtol'] },
          { id: 't5', label: 'Stocks invalides et stock nul', category: 'limite', stdin: 'PRD-0003;199;\nPRD-0003;199;6x\nPRD-0003;199;-1\nPRD-0003;199;0\n', expectedStdout: 'ERREUR stock\nERREUR stock\nERREUR stock\nProduit PRD-0003 : 199.00 EUR, stock 0', explanation: 'Un stock de 0 est valide (≥ 0).', mustContainConstructs: ['strtof', 'strtol'] },
        ],
        hints: [
          'Mettez l’analyse dans une fonction void analyserLigne(const char *ligne) : chaque return y termine le traitement de la ligne.',
          'Pour le prix, le test décisif est fin == p2 : strtof doit s’arrêter pile sur le second « ; ».',
          'Une référence de longueur L se copie avec strncpy(reference, ligne, L); reference[L] = \'\\0\';',
        ],
        detailedExplanation: 'Les trois champs sont délimités par des pointeurs (p1, p2) au lieu d’être recopiés : strtof et strtol travaillent directement au milieu de la ligne, et leur pointeur de fin dit s’ils ont consommé exactement leur champ. C’est la différence majeure avec sscanf("%[^;];%f;%ld"), qui accepterait « 79.90abc ». Le contrôle du troisième « ; » évite d’accepter « 42;2 » comme stock.',
      },
      {
        id: 'D01_E6',
        chapterId: 'D01',
        trackId: 'defi',
        title: 'Corriger la recherche et la saisie de quantité',
        difficulty: 'intermediaire',
        category: 'bugfix',
        testedSkill: 'Détecter un mauvais test de strstr et une conversion atoi',
        prerequisites: ['D01'],
        projectLink: 'menu « Rechercher un produit » puis « Ajouter une ligne » du module commande.',
        statement: `Le programme lit un mot-clé puis une quantité. Il doit afficher les produits dont la désignation contient le mot-clé (« Trouve : REF »), puis, s’il y en a au moins un, ajouter la quantité au premier trouvé : « Ajout de Q x REF » si 1 ≤ Q ≤ stock, sinon « Quantite invalide ». S’il n’y en a aucun : « Aucun produit ».
Il contient **2 bugs** : la condition sur strstr est inversée, et la quantité est convertie avec atoi (« 2x » est accepté). Corrigez-les (utilisez strtol).`,
        isCoreValidationExercise: true,
        guidedSteps: [
          'Lancez « Tester avec cette entrée » avec « USB » puis « 2 » : quels produits s’affichent ? Ce sont exactement ceux qui NE contiennent PAS USB.',
          'Rappel : strstr renvoie NULL quand le motif est ABSENT. Quelle comparaison faut-il pour « présent » ?',
          'Remplacez atoi par strtol avec un pointeur de fin, et refusez si rien n’est lu ou s’il reste des caractères.',
        ],
        starterCode: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char reference[12];
    char designation[60];
    int quantiteStock;
} Produit;

int main(void) {
    Produit cat[4] = {
        {"PRD-0001", "Clavier mecanique", 42},
        {"PRD-0006", "Cable HDMI 2 m", 120},
        {"PRD-0007", "Hub USB-C 7 ports", 4},
        {"PRD-0009", "Cle USB 64 Go", 30}
    };
    char mot[60], saisie[32];
    if (fgets(mot, sizeof(mot), stdin) == NULL) return 0;
    if (fgets(saisie, sizeof(saisie), stdin) == NULL) saisie[0] = '\0';
    mot[strcspn(mot, "\n")] = '\0';
    saisie[strcspn(saisie, "\n")] = '\0';

    int premier = -1;
    for (int i = 0; i < 4; i++) {
        if (strstr(cat[i].designation, mot) == NULL) {
            printf("Trouve : %s\n", cat[i].reference);
            if (premier < 0) premier = i;
        }
    }
    if (premier < 0) {
        printf("Aucun produit\n");
        return 0;
    }
    int q = atoi(saisie);
    if (q >= 1 && q <= cat[premier].quantiteStock) {
        printf("Ajout de %d x %s\n", q, cat[premier].reference);
    } else {
        printf("Quantite invalide\n");
    }
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char reference[12];
    char designation[60];
    int quantiteStock;
} Produit;

int main(void) {
    Produit cat[4] = {
        {"PRD-0001", "Clavier mecanique", 42},
        {"PRD-0006", "Cable HDMI 2 m", 120},
        {"PRD-0007", "Hub USB-C 7 ports", 4},
        {"PRD-0009", "Cle USB 64 Go", 30}
    };
    char mot[60], saisie[32];
    if (fgets(mot, sizeof(mot), stdin) == NULL) return 0;
    if (fgets(saisie, sizeof(saisie), stdin) == NULL) saisie[0] = '\0';
    mot[strcspn(mot, "\n")] = '\0';
    saisie[strcspn(saisie, "\n")] = '\0';

    int premier = -1;
    for (int i = 0; i < 4; i++) {
        if (strstr(cat[i].designation, mot) != NULL) {
            printf("Trouve : %s\n", cat[i].reference);
            if (premier < 0) premier = i;
        }
    }
    if (premier < 0) {
        printf("Aucun produit\n");
        return 0;
    }
    char *fin = NULL;
    long q = strtol(saisie, &fin, 10);
    if (fin != saisie && *fin == '\0' && q >= 1 && q <= cat[premier].quantiteStock) {
        printf("Ajout de %ld x %s\n", q, cat[premier].reference);
    } else {
        printf("Quantite invalide\n");
    }
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'USB, quantité 2', category: 'normal', stdin: 'USB\n2\n', expectedStdout: 'Trouve : PRD-0007\nTrouve : PRD-0009\nAjout de 2 x PRD-0007', explanation: 'Deux produits contiennent USB ; on ajoute au premier.' },
          { id: 't2', label: 'Quantité « 2x »', category: 'invalide', stdin: 'HDMI\n2x\n', expectedStdout: 'Trouve : PRD-0006\nQuantite invalide', explanation: 'atoi acceptait 2.' },
          { id: 't3', label: 'Quantité au-delà du stock', category: 'limite', stdin: 'Hub\n5\n', expectedStdout: 'Trouve : PRD-0007\nQuantite invalide', explanation: 'Stock du Hub : 4.' },
          { id: 't4', label: 'Aucun résultat', category: 'limite', stdin: 'Ecran\n1\n', expectedStdout: 'Aucun produit', explanation: 'Aucune désignation ne contient « Ecran ».' },
          { id: 't5', label: 'Quantité vide', category: 'invalide', stdin: 'Clavier\n\n', expectedStdout: 'Trouve : PRD-0001\nQuantite invalide', explanation: 'Rien n’est lu : refus.' },
        ],
        hints: [
          'Un motif est présent quand strstr(...) != NULL.',
          'char *fin = NULL; long q = strtol(saisie, &fin, 10);',
          'Acceptez seulement si fin != saisie && *fin == \'\\0\' && 1 <= q <= stock.',
        ],
        detailedExplanation: 'Le premier bug est une inversion logique : == NULL sélectionne les produits où le mot est absent. Le second est une conversion silencieuse : atoi("2x") vaut 2. Les deux bugs passent la compilation sans avertissement — seuls des tests ciblés (« 2x », mot présent/absent) les révèlent.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE D02 — ALLOCATION DYNAMIQUE ET realloc : UTILISATION ET MANIPULATION
  // ==========================================================================
  {
    id: 'D02',
    trackId: 'defi',
    number: 2,
    title: 'Allocation dynamique et realloc : utilisation et manipulation',
    subtitle: 'Insérer, supprimer, compacter, garder un tableau trié : manipuler les collections de ShopFlow sans fuite ni pointeur pendant.',
    estimatedMinutes: 90,
    prerequisites: ['B12', 'B15', 'C04', 'C05'],
    relatedChapters: ['C04', 'C05', 'D04'],
    coreConcepts: ['realloc en détail', 'pointeur de pointeur', 'assurerCapacite', 'memmove', 'insertion à une position', 'suppression ordonnée', 'compactage', 'pointeur invalidé'],
    successCriteria: [
      'Expliquer les trois issues possibles d’un realloc et leurs conséquences',
      'Insérer et supprimer au milieu d’un tableau dynamique en conservant l’ordre',
      'Réduire la capacité d’un tableau et le libérer quand il devient vide',
    ],
    lesson: {
      objectives: [
        'Décrire précisément ce que fait realloc (sur place, déplacement + copie, échec)',
        'Écrire une fonction générique assurerCapacite qui reçoit l’adresse du pointeur (T **)',
        'Insérer à une position donnée et supprimer en gardant l’ordre avec memmove',
        'Compacter (réduire la capacité) et gérer le cas du tableau vide',
        'Ne jamais conserver un pointeur vers une case à travers un realloc',
      ],
      intuition: `Au chapitre C04, on savait **ajouter à la fin** d’un tableau dynamique. Mais ShopFlow demande plus :
- supprimer une ligne d’une commande EN_COURS **sans changer l’ordre** des autres lignes ;
- garder le catalogue **trié par référence** (insérer au bon endroit) ;
- ne pas garder 1 000 cases réservées pour une commande qui n’a plus que 2 lignes.

Pour **insérer** à la position k, on décale d’une case vers la droite tout ce qui est après k, puis on écrit dans la case libérée. Pour **supprimer** la case k, on décale vers la gauche tout ce qui suit. Ces décalages de blocs qui se chevauchent se font avec **memmove**.

Et il faut bien comprendre realloc. Il peut agrandir le bloc **sur place**, ou réserver un **nouveau bloc ailleurs**, y recopier les données et **libérer l’ancien**. Dans le second cas, tout pointeur qui désignait une case de l’ancien bloc devient **pendant** (*dangling*) : l’utiliser est un use-after-free. On travaille donc avec des **indices**, qui restent valables.`,
      formalDefinition: `- **realloc(p, n)** :
    p == NULL            → équivaut à malloc(n)
    bloc agrandissable   → même adresse, contenu conservé, zone ajoutée NON initialisée
    sinon                → nouveau bloc, copie de min(ancienne, n) octets, free(ancien), nouvelle adresse
    échec                → renvoie NULL, l’ancien bloc reste valide et intact
    réduction (n plus petit) → contenu tronqué, peut aussi déplacer le bloc
- **Pointeur de pointeur** : pour qu’une fonction remplace le pointeur de l’appelant, elle reçoit son adresse :
    int assurerCapacite(Produit **tab, int *capacite, int besoin);
    assurerCapacite(&b->produits, &b->capaciteProduits, b->nbProduits + 1);
- **memmove(dest, src, octets)** copie correctement même si les zones se chevauchent (memcpy ne le garantit pas).
- **Insertion en position k** (0 ≤ k ≤ nb) :
    memmove(&t[k + 1], &t[k], (nb - k) * sizeof(T)); t[k] = x; nb++;
- **Suppression en position k** (0 ≤ k < nb) :
    memmove(&t[k], &t[k + 1], (nb - k - 1) * sizeof(T)); nb--;
- **Compactage** : si nb == 0 → free(t), t = NULL, cap = 0 ; sinon si nb ≤ cap / 4 → cap = cap / 2 et realloc. (Seuil à 1/4 et non 1/2 pour éviter d’alterner agrandissement/réduction à chaque ajout/suppression.)
- **Invariants** : 0 ≤ nb ≤ cap ; (t == NULL) ⇔ (cap == 0) ; seules les cases 0..nb-1 sont significatives.
- **Coût** : insertion/suppression au milieu O(n) (décalage) ; ajout en fin O(1) amorti avec doublement.`,
      analogy: {
        title: 'Une rangée de casiers numérotés',
        content: `Vos produits sont dans une rangée de casiers. Insérer au milieu, c’est décaler d’un casier vers la droite tous les produits qui suivent pour libérer la place (memmove). Supprimer, c’est refermer le trou en décalant vers la gauche. Quand la rangée est pleine, le gérant vous attribue parfois les casiers voisins (realloc sur place)… ou une nouvelle rangée dans un autre couloir, où il déménage tout (realloc qui déplace). Si vous aviez noté « le clavier est dans le 3e casier de la rangée B », votre note devient fausse ; si vous aviez noté « 3e casier », sans couloir, elle reste vraie : c’est l’indice.`,
      },
      vocabulary: [
        { fr: 'Pointeur pendant', en: 'Dangling pointer', definition: 'Pointeur vers une zone libérée ou déplacée.' },
        { fr: 'Pointeur de pointeur', en: 'Pointer to pointer (T **)', definition: 'Adresse d’une variable pointeur ; permet à une fonction de la modifier.' },
        { fr: 'Chevauchement', en: 'Overlap', definition: 'Zones source et destination qui partagent des octets ; nécessite memmove.' },
        { fr: 'Compactage', en: 'Shrink-to-fit', definition: 'Réduction de la capacité allouée au plus près du nombre d’éléments.' },
        { fr: 'Hystérésis', en: 'Hysteresis', definition: 'Seuils différents pour agrandir (plein) et réduire (1/4) afin d’éviter les oscillations.' },
        { fr: 'Insertion triée', en: 'Sorted insertion', definition: 'Insertion à la position qui conserve l’ordre du tableau.' },
      ],
      deepDive: [
        {
          title: 'Ce qui se passe vraiment dans un realloc',
          content: `Imaginons un catalogue de 4 produits (capacité 4) à l’adresse A, et un ajout qui demande 8 cases :
    Avant  : A : [P1][P2][P3][P4]            (bloc voisin occupé)
    realloc: B : [P1][P2][P3][P4][ ? ][ ? ][ ? ][ ? ]   copie de 4 cases
             A : libéré
    Après  : b->produits == B
Les 4 cases ajoutées contiennent des valeurs **indéterminées** (realloc n’initialise pas). Tout pointeur qui valait &A[2] désigne maintenant une zone libérée. Le bac à sable de la plateforme déplace systématiquement le bloc : il révèle donc tous les pointeurs pendants que gcc laisserait passer « par chance » quand le bloc grandit sur place.`,
        },
        {
          title: 'Doubler la capacité : le calcul du coût',
          content: `Ajouter n éléments en agrandissant de **+1** à chaque fois coûte 1 + 2 + … + n ≈ n²/2 copies : pour 10 000 lignes, 50 millions de copies.
En **doublant**, on copie 1 + 2 + 4 + … + n/2 < n éléments au total, soit moins de 1 copie par ajout en moyenne : coût **amorti O(1)**. Le prix à payer : jusqu’à 50 % de cases réservées mais inutilisées, d’où l’intérêt du compactage quand le tableau se vide.`,
        },
        {
          title: 'Pourquoi un T ** dans assurerCapacite',
          content: `En C, tout est passé par copie. Une fonction qui reçoit Produit *tab reçoit une **copie du pointeur** : si elle y affecte le résultat de realloc, l’appelant garde l’ancienne adresse… que realloc vient peut-être de libérer. Il faut donc lui donner l’adresse du pointeur (Produit **tab) et écrire *tab = tmp. C’est exactement pourquoi, dans ShopFlow, les fonctions d’ajout reçoivent Boutique *b ou Commande *c : elles modifient b->produits ou c->lignes à travers la structure.`,
          code: `int assurerCapacite(Produit **tab, int *capacite, int besoin) {
    if (besoin <= *capacite) return 1;
    int nouvelleCap = (*capacite == 0) ? 2 : *capacite;
    while (nouvelleCap < besoin) nouvelleCap *= 2;
    Produit *tmp = realloc(*tab, nouvelleCap * sizeof(Produit));
    if (tmp == NULL) return 0;
    *tab = tmp;
    *capacite = nouvelleCap;
    return 1;
}`,
        },
        {
          title: 'memmove plutôt qu’une boucle (et plutôt que memcpy)',
          content: `Le décalage pour insérer à la position k peut s’écrire avec une boucle **qui part de la fin** (sinon on écrase les données avant de les copier) :
    for (int i = nb; i > k; i--) t[i] = t[i - 1];
memmove fait la même chose en un appel, quel que soit le sens, car il gère le chevauchement. memcpy, lui, a un comportement indéfini si les zones se chevauchent : à réserver aux copies entre deux blocs distincts (copie profonde, tableau de travail des statistiques).
Le nombre d’octets à décaler est (nombre d’éléments déplacés) × sizeof(T) : (nb - k) éléments pour une insertion, (nb - k - 1) pour une suppression.`,
        },
        {
          title: 'Supprimer : garder l’ordre ou aller vite ?',
          content: `Deux techniques :
- **Décalage** (memmove) : O(n), l’ordre est conservé — indispensable pour un catalogue trié ou pour afficher les lignes dans l’ordre de saisie.
- **Échange avec le dernier** (t[k] = t[nb - 1]; nb--) : O(1), mais l’ordre change.
Dans ShopFlow, la **suppression logique** (actif = 0) évite même tout décalage pour les produits et clients ; le décalage reste nécessaire pour les lignes d’une commande EN_COURS. Si l’élément supprimé possède lui-même un bloc (une commande et ses lignes), libérez ce bloc AVANT de l’écraser par le décalage.`,
        },
        {
          title: 'realloc pour réduire, et le cas de la taille 0',
          content: `realloc(p, plusPetit) est autorisé et peut rendre de la mémoire au système. Mais realloc(p, 0) a un comportement qui dépend de l’implémentation (il peut renvoyer NULL **et** libérer p, ou renvoyer un petit bloc) : ne l’utilisez jamais. Quand le tableau devient vide, écrivez explicitement :
    free(t); t = NULL; cap = 0;
Et comme pour l’agrandissement, passez par un pointeur temporaire : une réduction peut, en théorie, échouer.`,
        },
        {
          title: 'calloc, malloc et l’initialisation',
          content: `malloc et realloc rendent des octets **non initialisés** ; calloc(n, taille) rend des octets à 0. Pour un tableau de structures que vous remplissez entièrement avant de le lire, malloc suffit. Mais si vous lisez une case avant de l’avoir remplie (un compteur cumulé dans un tableau de statistiques, par exemple), utilisez calloc ou un memset — et souvenez-vous que la partie ajoutée par realloc n’est **jamais** remise à 0.`,
        },
      ],
      simpleExample: cExample(
        'Insérer et supprimer au milieu d’un tableau dynamique',
        'assurerCapacite reçoit l’adresse du pointeur ; memmove décale les éléments pour insérer en position 1 puis supprimer la position 0.',
        String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int assurerCapacite(int **tab, int *cap, int besoin) {
    if (besoin <= *cap) return 1;
    int nouvelleCap = (*cap == 0) ? 2 : *cap;
    while (nouvelleCap < besoin) nouvelleCap *= 2;
    int *tmp = realloc(*tab, nouvelleCap * sizeof(int));
    if (tmp == NULL) return 0;
    *tab = tmp;
    *cap = nouvelleCap;
    return 1;
}

int insererA(int **tab, int *nb, int *cap, int k, int valeur) {
    if (k < 0 || k > *nb) return 0;
    if (!assurerCapacite(tab, cap, *nb + 1)) return 0;
    memmove(&(*tab)[k + 1], &(*tab)[k], (*nb - k) * sizeof(int));
    (*tab)[k] = valeur;
    (*nb)++;
    return 1;
}

void supprimerA(int *tab, int *nb, int k) {
    memmove(&tab[k], &tab[k + 1], (*nb - k - 1) * sizeof(int));
    (*nb)--;
}

void afficher(const int *tab, int nb, int cap) {
    printf("nb=%d cap=%d :", nb, cap);
    for (int i = 0; i < nb; i++) printf(" %d", tab[i]);
    printf("\n");
}

int main(void) {
    int *quantites = NULL;
    int nb = 0, cap = 0;
    insererA(&quantites, &nb, &cap, 0, 10);
    insererA(&quantites, &nb, &cap, 1, 30);
    insererA(&quantites, &nb, &cap, 1, 20);
    afficher(quantites, nb, cap);
    supprimerA(quantites, &nb, 0);
    afficher(quantites, nb, cap);
    free(quantites);
    return 0;
}`,
        `nb=3 cap=4 : 10 20 30
nb=2 cap=4 : 20 30`,
        [
          ['int assurerCapacite(int **tab, int *cap, int besoin) {', 'int ** : l’adresse du pointeur de l’appelant, pour pouvoir le remplacer.'],
          ['while (nouvelleCap < besoin) nouvelleCap *= 2;', 'Doublement jusqu’à couvrir le besoin (utile si on demande plusieurs cases d’un coup).'],
          ['*tab = tmp;', 'On modifie le pointeur de main (quantites) et non une copie locale.'],
          ['if (k < 0 || k > *nb) return 0;', 'k == nb est autorisé : c’est l’insertion en fin.'],
          ['memmove(&(*tab)[k + 1], &(*tab)[k], (*nb - k) * sizeof(int));', 'Décale les nb - k derniers éléments d’une case vers la droite (zones qui se chevauchent → memmove).'],
          ['(*nb)++;', 'Les parenthèses sont obligatoires : *nb++ incrémenterait le pointeur, pas l’entier.'],
          ['memmove(&tab[k], &tab[k + 1], (*nb - k - 1) * sizeof(int));', 'Suppression : les éléments après k glissent d’une case vers la gauche, l’ordre est conservé.'],
          ['insererA(&quantites, &nb, &cap, 1, 20);', '20 s’insère entre 10 et 30 : il faut décaler 30.'],
        ]
      ),
      intermediateExample: cExample(
        'Les lignes d’une commande : ajout, suppression ordonnée et compactage',
        'Une commande perd des lignes ; sa capacité est divisée par 2 quand elle n’est plus remplie qu’au quart, et le tableau est libéré quand il est vide.',
        String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { char refProduit[12]; int quantite; } LigneCommande;
typedef struct { int nbLignes; int capaciteLignes; LigneCommande *lignes; } Commande;

int ajouterLigne(Commande *c, const char *ref, int qte) {
    if (c->nbLignes == c->capaciteLignes) {
        int cap = (c->capaciteLignes == 0) ? 1 : 2 * c->capaciteLignes;
        LigneCommande *tmp = realloc(c->lignes, cap * sizeof(LigneCommande));
        if (tmp == NULL) return 0;
        c->lignes = tmp;
        c->capaciteLignes = cap;
    }
    strcpy(c->lignes[c->nbLignes].refProduit, ref);
    c->lignes[c->nbLignes].quantite = qte;
    c->nbLignes++;
    return 1;
}

void compacter(Commande *c) {
    if (c->nbLignes == 0) {
        free(c->lignes);
        c->lignes = NULL;
        c->capaciteLignes = 0;
    } else if (c->nbLignes <= c->capaciteLignes / 4) {
        int cap = c->capaciteLignes / 2;
        LigneCommande *tmp = realloc(c->lignes, cap * sizeof(LigneCommande));
        if (tmp != NULL) {
            c->lignes = tmp;
            c->capaciteLignes = cap;
        }
    }
}

int supprimerLigne(Commande *c, int k) {
    if (k < 0 || k >= c->nbLignes) return 0;
    memmove(&c->lignes[k], &c->lignes[k + 1], (c->nbLignes - k - 1) * sizeof(LigneCommande));
    c->nbLignes--;
    compacter(c);
    return 1;
}

void afficher(const Commande *c) {
    printf("%d ligne(s), capacite %d :", c->nbLignes, c->capaciteLignes);
    for (int i = 0; i < c->nbLignes; i++) {
        printf(" %s x%d", c->lignes[i].refProduit, c->lignes[i].quantite);
    }
    printf("\n");
}

int main(void) {
    Commande c = {0, 0, NULL};
    const char *refs[5] = {"PRD-0001", "PRD-0002", "PRD-0004", "PRD-0006", "PRD-0008"};
    for (int i = 0; i < 5; i++) ajouterLigne(&c, refs[i], i + 1);
    afficher(&c);
    supprimerLigne(&c, 1);
    supprimerLigne(&c, 1);
    afficher(&c);
    supprimerLigne(&c, 0);
    afficher(&c);
    supprimerLigne(&c, 0);
    supprimerLigne(&c, 0);
    afficher(&c);
    printf("Suppression hors limites : %d\n", supprimerLigne(&c, 0));
    return 0;
}`,
        `5 ligne(s), capacite 8 : PRD-0001 x1 PRD-0002 x2 PRD-0004 x3 PRD-0006 x4 PRD-0008 x5
3 ligne(s), capacite 8 : PRD-0001 x1 PRD-0006 x4 PRD-0008 x5
2 ligne(s), capacite 4 : PRD-0006 x4 PRD-0008 x5
0 ligne(s), capacite 0 :
Suppression hors limites : 0`,
        [
          ['int cap = (c->capaciteLignes == 0) ? 1 : 2 * c->capaciteLignes;', 'Capacités successives 1, 2, 4, 8 pour 5 lignes.'],
          ['if (c->nbLignes == 0) {', 'Tableau vide : on libère explicitement (jamais realloc(p, 0)).'],
          ['} else if (c->nbLignes <= c->capaciteLignes / 4) {', 'Seuil du quart : 2 lignes pour 8 cases → on passe à 4 cases.'],
          ['if (tmp != NULL) {', 'Si la réduction échoue, on garde simplement le grand bloc : pas d’erreur à remonter.'],
          ['memmove(&c->lignes[k], &c->lignes[k + 1], (c->nbLignes - k - 1) * sizeof(LigneCommande));', 'Suppression ordonnée : les lignes restent dans l’ordre de saisie.'],
          ['compacter(c);', 'Appelée après chaque suppression : la mémoire suit le nombre de lignes.'],
          ['supprimerLigne(&c, 1);', 'Deux suppressions à l’indice 1 retirent PRD-0002 puis PRD-0004 (qui a glissé en position 1).'],
          ['printf("Suppression hors limites : %d\\n", supprimerLigne(&c, 0));', 'Commande vide : l’indice 0 n’existe pas, refus. Aucun bloc à libérer à la fin : lignes vaut NULL.'],
        ]
      ),
      commonMistakes: [
        {
          title: 'Garder un pointeur vers une case pendant un ajout',
          wrongCode: `Produit *clavier = &b->produits[0];
ajouterProduit(b, nouveau);        /* realloc : le bloc peut bouger */
clavier->quantiteStock -= 2;       /* use-after-free */`,
          rightCode: `int iClavier = 0;
ajouterProduit(b, nouveau);
b->produits[iClavier].quantiteStock -= 2;`,
          explanation: 'Après un realloc qui déplace le bloc, l’ancien est libéré. Un indice reste valable, un pointeur non.',
          errorType: 'execution',
        },
        {
          title: 'Fonction qui réalloue une copie du pointeur',
          wrongCode: `int agrandir(int *tab, int *cap) {
    int *tmp = realloc(tab, 2 * *cap * sizeof(int));
    if (!tmp) return 0;
    tab = tmp;            /* modifie la copie locale */
    *cap *= 2;
    return 1;
}`,
          rightCode: `int agrandir(int **tab, int *cap) {
    int *tmp = realloc(*tab, 2 * *cap * sizeof(int));
    if (!tmp) return 0;
    *tab = tmp;           /* modifie le pointeur de l'appelant */
    *cap *= 2;
    return 1;
}`,
          explanation: 'L’appelant garde l’ancienne adresse, que realloc vient de libérer : son prochain accès est un use-after-free.',
          errorType: 'execution',
        },
        {
          title: 'Décaler avec une boucle dans le mauvais sens',
          wrongCode: `/* insertion en k : boucle croissante */
for (int i = k; i < nb; i++)
    t[i + 1] = t[i];      /* recopie t[k] partout */`,
          rightCode: `for (int i = nb; i > k; i--)
    t[i] = t[i - 1];
/* ou memmove(&t[k + 1], &t[k], (nb - k) * sizeof *t); */`,
          explanation: 'En partant du début, chaque copie écrase la case suivante avant qu’elle soit déplacée : tous les éléments deviennent égaux à t[k].',
          errorType: 'logique',
        },
        {
          title: 'Oublier sizeof dans memmove ou realloc',
          wrongCode: `memmove(&t[k], &t[k + 1], nb - k - 1);
/* deplace des OCTETS, pas des Produit */`,
          rightCode: `memmove(&t[k], &t[k + 1], (nb - k - 1) * sizeof(Produit));`,
          explanation: 'memmove, memcpy, malloc et realloc comptent en octets : multipliez toujours par sizeof(T).',
          errorType: 'execution',
        },
      ],
      summary: [
        'realloc : sur place, ou déplacement + copie + free de l’ancien, ou NULL (ancien intact).',
        'Après un realloc, tout pointeur vers l’ancien bloc est invalide : mémorisez des indices.',
        'Pour qu’une fonction remplace un pointeur : lui passer son adresse (T **) ou la structure qui le contient.',
        'Insertion en k : memmove(&t[k+1], &t[k], (nb-k)·sizeof) ; suppression : memmove(&t[k], &t[k+1], (nb-k-1)·sizeof).',
        'Compacter : vide → free + NULL + 0 ; nb ≤ cap/4 → cap/2.',
        'Tailles toujours en octets : × sizeof(T).',
      ],
      comprehensionQuestions: [
        {
          id: 'D02_Q1',
          question: 'realloc renvoie une adresse différente de l’ancienne. Que devient l’ancien bloc ?',
          options: ['Il reste alloué, il faut le libérer', 'Il a été libéré par realloc', 'Il contient désormais des zéros', 'Il est partagé avec le nouveau'],
          correctIndex: 1,
          explanation: 'realloc a copié le contenu puis libéré l’ancien bloc : le libérer à nouveau serait un double free, y accéder un use-after-free.',
        },
        {
          id: 'D02_Q2',
          question: 'Tableau de nb = 6 éléments. Combien d’éléments memmove doit-il déplacer pour supprimer l’indice 2 en gardant l’ordre ?',
          options: ['2', '3', '4', '6'],
          correctIndex: 1,
          explanation: 'Les éléments d’indices 3, 4 et 5 glissent d’une case : nb - k - 1 = 6 - 2 - 1 = 3.',
        },
        {
          id: 'D02_Q3',
          question: 'Pourquoi réduire la capacité quand nb ≤ cap / 4 plutôt que nb ≤ cap / 2 ?',
          options: [
            'Parce que realloc refuse de diviser par 2',
            'Pour éviter qu’une alternance ajout/suppression autour de la moitié ne provoque un realloc à chaque opération',
            'Pour économiser plus de mémoire',
            'C’est imposé par la norme C',
          ],
          correctIndex: 1,
          explanation: 'Avec le seuil 1/2, un tableau plein à 50 % se réduirait puis se ré-agrandirait sans cesse. L’écart entre les deux seuils (hystérésis) garantit un coût amorti constant.',
        },
      ],
    },
    exercises: [
      {
        id: 'D02_E1',
        chapterId: 'D02',
        trackId: 'defi',
        title: 'Quels pointeurs sont encore valides après realloc ?',
        difficulty: 'intermediaire',
        category: 'qcm',
        testedSkill: 'Invalidation des pointeurs par realloc',
        prerequisites: ['D02'],
        projectLink: 'toute fonction qui mémorise « le produit courant » ou « le client courant » pendant qu’on ajoute des éléments.',
        statement: `Avec b->nbProduits == b->capaciteProduits :

    Produit *p = &b->produits[2];
    int i = 2;
    Produit *ancien = b->produits;
    ajouterProduit(b, nouveau);   /* appelle realloc et met a jour b->produits */

Après l’appel, lesquels peut-on utiliser sans risque ?`,
        isCoreValidationExercise: true,
        options: [
          'p, i et ancien',
          'Seulement p',
          'Seulement i (avec b->produits[i]) ; p et ancien peuvent désigner un bloc libéré',
          'Aucun : il faut recréer le catalogue',
        ],
        correctOptionIndex: 2,
        hints: [
          'Le tableau était plein : realloc va s’exécuter.',
          'Si le bloc est déplacé, que devient l’ancienne adresse ?',
          'Un indice ne dépend pas de l’adresse du bloc.',
        ],
        detailedExplanation: 'Si realloc déplace le bloc, l’ancien est libéré : p (adresse d’une case de l’ancien bloc) et ancien sont pendants. L’indice i, combiné au pointeur à jour b->produits, désigne toujours le même produit. Même si le bloc n’a pas bougé cette fois, rien ne le garantit : on considère p et ancien comme invalides.',
      },
      {
        id: 'D02_E2',
        chapterId: 'D02',
        trackId: 'defi',
        title: 'Tracer insertions, suppressions et compactage',
        difficulty: 'intermediaire',
        category: 'trace',
        testedSkill: 'Dérouler nb, capacité et contenu d’un tableau dynamique',
        prerequisites: ['D02'],
        statement: 'Règles : ajout en fin avec capacité 0 → 2 puis doublement ; suppression ordonnée ; après chaque suppression, compactage (vide → capacité 0 ; nb ≤ cap / 4 → cap / 2). Écrivez le contenu en séparant les valeurs par des espaces (« vide » si le tableau est vide).',
        isCoreValidationExercise: true,
        traceSpec: {
          language: 'c',
          code: String.raw`ajouter(5); ajouter(8); ajouter(3); ajouter(9); ajouter(1);
supprimer(indice 0);
supprimer(indice 1);
supprimer(indice 1);
supprimer(indice 0);
supprimer(indice 0);`,
          columns: ['Opération', 'nb', 'cap', 'contenu'],
          prefilledRows: [
            { 'Opération': 'après les 5 ajouts', nb: '5', cap: '?', contenu: '5 8 3 9 1' },
            { 'Opération': 'supprimer(0)', nb: '4', cap: '8', contenu: '?' },
            { 'Opération': 'supprimer(1)', nb: '?', cap: '8', contenu: '8 9 1' },
            { 'Opération': 'supprimer(1)', nb: '2', cap: '?', contenu: '?' },
            { 'Opération': 'supprimer(0)', nb: '1', cap: '?', contenu: '1' },
            { 'Opération': 'supprimer(0)', nb: '0', cap: '?', contenu: 'vide' },
          ],
          expectedAnswers: {
            '0:cap': '8',
            '1:contenu': '8 3 9 1',
            '2:nb': '3',
            '3:cap': '4',
            '3:contenu': '8 1',
            '4:cap': '2',
            '5:cap': '0',
          },
        },
        hints: [
          'Capacités pendant les ajouts : 2, 2, 4, 4, 8.',
          'Après une suppression, comparez nb à cap / 4 (division entière).',
          '2 ≤ 8/4 → cap 4 ; 1 ≤ 4/4 → cap 2 ; vide → 0.',
        ],
        detailedExplanation: 'Les suppressions conservent l’ordre (5 disparaît, puis 3, puis 9). La capacité ne baisse qu’à partir de nb = 2 (2 ≤ 8/4), puis à nb = 1 (1 ≤ 4/4), et le tableau est libéré quand il est vide. Remarquez qu’à nb = 3 et 4, la capacité 8 est conservée : c’est l’hystérésis.',
      },
      {
        id: 'D02_E3',
        chapterId: 'D02',
        trackId: 'defi',
        title: 'Compléter assurerCapacite avec un pointeur de pointeur',
        difficulty: 'intermediaire',
        category: 'completion',
        testedSkill: 'Modifier un pointeur de l’appelant à travers un T **',
        prerequisites: ['D02'],
        projectLink: 'une seule fonction réutilisable pour produits, clients, commandes et lignes (avec le type adapté).',
        statement: 'Complétez la fonction et son appel depuis ajouterProduit.',
        isCoreValidationExercise: true,
        templateWithGaps: String.raw`int assurerCapacite(Produit **tab, int *capacite, int besoin) {
    if (besoin <= *capacite) return 1;
    int nouvelleCap = (*capacite == 0) ? 2 : *capacite;
    while (nouvelleCap < besoin) nouvelleCap *= 2;
    Produit *tmp = realloc({{GAP_1}}, nouvelleCap * sizeof(Produit));
    if (tmp == NULL) return 0;
    {{GAP_2}} = tmp;
    {{GAP_3}} = nouvelleCap;
    return 1;
}

/* dans ajouterProduit(Boutique *b, Produit p) : */
if (!assurerCapacite({{GAP_4}}, &b->capaciteProduits, b->nbProduits + 1)) return 0;`,
        gaps: [
          { id: 'GAP_1', placeholder: 'ancien bloc', acceptedAnswers: ['*tab'], explanation: 'realloc reçoit l’ancien bloc, c’est-à-dire le pointeur désigné par tab.' },
          { id: 'GAP_2', placeholder: 'pointeur à mettre à jour', acceptedAnswers: ['*tab'], explanation: 'On remplace le pointeur de l’appelant.' },
          { id: 'GAP_3', placeholder: 'capacité à mettre à jour', acceptedAnswers: ['*capacite'], explanation: 'La capacité de l’appelant, elle aussi passée par adresse.' },
          { id: 'GAP_4', placeholder: 'adresse du pointeur', acceptedAnswers: ['&b->produits', '&(b->produits)'], explanation: 'On transmet l’adresse du champ produits de la boutique.' },
        ],
        hints: [
          'tab est l’adresse d’un pointeur : *tab est ce pointeur.',
          'Les deux mises à jour passent par une étoile.',
          'Pour obtenir un Produit ** depuis b, prenez l’adresse du champ : &b->produits.',
        ],
        detailedExplanation: 'realloc(*tab, …) agrandit le bloc courant ; *tab = tmp et *capacite = nouvelleCap modifient les variables de l’appelant ; &b->produits fournit l’adresse du champ. Sans les étoiles, la fonction ne modifierait que ses copies locales et la boutique garderait un pointeur vers un bloc libéré.',
      },
      {
        id: 'D02_E4',
        chapterId: 'D02',
        trackId: 'defi',
        title: 'Supprimer des lignes en gardant l’ordre et compacter',
        difficulty: 'avance',
        category: 'c_code',
        testedSkill: 'memmove, compactage et libération du tableau vide',
        prerequisites: ['D02'],
        projectLink: 'fonction « supprimer une ligne d’une commande EN_COURS » du module commande.',
        statement: `Le programme lit n puis n quantités, ajoutées en fin (capacité 0 → 1 puis doublement). Il lit ensuite k puis k indices à supprimer. Pour chaque indice :
- s’il est invalide : « Indice invalide : i » ;
- sinon : suppression **en gardant l’ordre** (memmove), puis compactage (nb == 0 → libérer, NULL, capacité 0 ; sinon nb ≤ cap / 4 → cap / 2 avec realloc), puis affichage « nb=X cap=Y : v1 v2 … » (« nb=0 cap=0 : vide » si vide).
Aucune fuite n’est tolérée.`,
        isCoreValidationExercise: true,
        guidedSteps: [
          'Écrivez d’abord l’ajout en fin (reprise de C04) et vérifiez avec n = 5 que la capacité finale vaut 8.',
          'Dans supprimer : testez 0 ≤ i < nb, puis memmove(&t[i], &t[i + 1], (nb - i - 1) * sizeof(int)); nb--;',
          'Compactage : si nb == 0 → free(t); t = NULL; cap = 0; sinon si nb <= cap / 4 → realloc via un pointeur temporaire vers cap / 2 cases.',
          'Affichez l’état après chaque suppression réussie, puis libérez t à la fin du programme (free(NULL) est sans effet).',
        ],
        starterCode: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    int *t = NULL;
    int nb = 0, cap = 0;
    int n = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int v = 0;
        scanf("%d", &v);
        /* TODO : ajout en fin */
    }
    int k = 0;
    scanf("%d", &k);
    for (int j = 0; j < k; j++) {
        int indice = 0;
        scanf("%d", &indice);
        /* TODO : suppression ordonnee, compactage, affichage */
    }
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int ajouter(int **t, int *nb, int *cap, int v) {
    if (*nb == *cap) {
        int nouvelleCap = (*cap == 0) ? 1 : 2 * *cap;
        int *tmp = realloc(*t, nouvelleCap * sizeof(int));
        if (tmp == NULL) return 0;
        *t = tmp;
        *cap = nouvelleCap;
    }
    (*t)[*nb] = v;
    (*nb)++;
    return 1;
}

void compacter(int **t, int nb, int *cap) {
    if (nb == 0) {
        free(*t);
        *t = NULL;
        *cap = 0;
    } else if (nb <= *cap / 4) {
        int *tmp = realloc(*t, (*cap / 2) * sizeof(int));
        if (tmp != NULL) {
            *t = tmp;
            *cap = *cap / 2;
        }
    }
}

void afficher(const int *t, int nb, int cap) {
    printf("nb=%d cap=%d :", nb, cap);
    if (nb == 0) {
        printf(" vide");
    }
    for (int i = 0; i < nb; i++) {
        printf(" %d", t[i]);
    }
    printf("\n");
}

int main(void) {
    int *t = NULL;
    int nb = 0, cap = 0;
    int n = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int v = 0;
        scanf("%d", &v);
        if (!ajouter(&t, &nb, &cap, v)) {
            free(t);
            return 1;
        }
    }
    int k = 0;
    scanf("%d", &k);
    for (int j = 0; j < k; j++) {
        int indice = 0;
        scanf("%d", &indice);
        if (indice < 0 || indice >= nb) {
            printf("Indice invalide : %d\n", indice);
            continue;
        }
        memmove(&t[indice], &t[indice + 1], (nb - indice - 1) * sizeof(int));
        nb--;
        compacter(&t, nb, &cap);
        afficher(t, nb, cap);
    }
    free(t);
    return 0;
}
`,
        testCases: [
          { id: 't1', label: '5 lignes, suppressions variées', category: 'normal', stdin: '5\n10 20 30 40 50\n4\n1 9 3 0\n', expectedStdout: 'nb=4 cap=8 : 10 30 40 50\nIndice invalide : 9\nnb=3 cap=8 : 10 30 40\nnb=2 cap=4 : 30 40', explanation: 'L’ordre est conservé ; réduction quand nb = 2 ≤ 8/4.', mustContainConstructs: ['memmove', 'realloc'], forbidMemoryLeaks: true },
          { id: 't2', label: 'Vider complètement', category: 'limite', stdin: '3\n7 8 9\n3\n2 0 0\n', expectedStdout: 'nb=2 cap=4 : 7 8\nnb=1 cap=2 : 8\nnb=0 cap=0 : vide', explanation: 'Capacités 4 → 4 (2 > 1) → 2 (1 ≤ 1) → libéré.', mustContainConstructs: ['memmove', 'realloc'], forbidMemoryLeaks: true },
          { id: 't3', label: 'Indices négatifs et sur tableau vide', category: 'invalide', stdin: '1\n5\n3\n-1 0 0\n', expectedStdout: 'Indice invalide : -1\nnb=0 cap=0 : vide\nIndice invalide : 0', explanation: 'Après la seule suppression valide, le tableau est vide.', mustContainConstructs: ['memmove'], forbidMemoryLeaks: true },
          { id: 't4', label: 'Supprimer la dernière case', category: 'limite', stdin: '4\n1 2 3 4\n1\n3\n', expectedStdout: 'nb=3 cap=4 : 1 2 3', explanation: 'memmove de 0 octet : aucun décalage.', mustContainConstructs: ['memmove'], forbidMemoryLeaks: true },
        ],
        hints: [
          'Mettez ajout et compactage dans des fonctions qui reçoivent int **t : vous éviterez les oublis de mise à jour.',
          'Pour la dernière case (indice nb - 1), memmove déplace 0 octet : c’est correct.',
          'Le free final doit exister même si le tableau a déjà été libéré : t vaut alors NULL.',
        ],
        detailedExplanation: 'Les trois difficultés sont : (1) le nombre d’éléments à décaler, nb - i - 1 ; (2) l’ordre des opérations — décrémenter nb avant de compacter ; (3) l’état cohérent du tableau vide (NULL, capacité 0), qui rend le free final et un éventuel nouvel ajout sans danger.',
      },
      {
        id: 'D02_E5',
        chapterId: 'D02',
        trackId: 'defi',
        title: 'Un catalogue toujours trié par référence',
        difficulty: 'synthese',
        category: 'c_code',
        testedSkill: 'Insertion triée avec realloc + memmove, suppression, unicité',
        prerequisites: ['D01', 'D02'],
        projectLink: 'catalogue produits trié : affichage dans l’ordre des références et recherche plus rapide (dichotomie possible).',
        statement: `Le programme lit des commandes jusqu’à « FIN » :
- « AJOUT REF PRIX » : si REF existe → « REFUS doublon REF » ; sinon insertion à la position qui garde le catalogue trié (strcmp), capacité 0 → 2 puis doublement → « AJOUT REF en position P » ;
- « SUPPR REF » : si absent → « INTROUVABLE REF » ; sinon suppression ordonnée → « SUPPR REF ».
À « FIN », affichez « Catalogue : N produit(s), capacite C » puis une ligne « REF PRIX » par produit (2 décimales), et libérez la mémoire.`,
        isCoreValidationExercise: true,
        guidedSteps: [
          'Lisez chaque commande avec scanf("%11s", cmd) puis, selon la commande, scanf("%11s %f", ref, &prix) ou scanf("%11s", ref).',
          'Position d’insertion : le premier indice i tel que strcmp(cat[i].reference, ref) > 0 (nb si aucun). Si un strcmp vaut 0 → doublon.',
          'Agrandissez si besoin, puis memmove(&cat[pos + 1], &cat[pos], (nb - pos) * sizeof(Produit)); et écrivez le produit en cat[pos].',
          'Suppression : trouvez l’indice avec strcmp == 0, puis décalage vers la gauche.',
        ],
        starterCode: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char reference[12];
    float prix;
} Produit;

int main(void) {
    Produit *cat = NULL;
    int nb = 0, cap = 0;
    char cmd[12];
    while (scanf("%11s", cmd) == 1 && strcmp(cmd, "FIN") != 0) {
        /* TODO */
    }
    /* TODO : affichage et liberation */
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char reference[12];
    float prix;
} Produit;

int trouver(const Produit *cat, int nb, const char *ref) {
    for (int i = 0; i < nb; i++) {
        if (strcmp(cat[i].reference, ref) == 0) return i;
    }
    return -1;
}

int insererTrie(Produit **cat, int *nb, int *cap, const char *ref, float prix) {
    if (*nb == *cap) {
        int nouvelleCap = (*cap == 0) ? 2 : 2 * *cap;
        Produit *tmp = realloc(*cat, nouvelleCap * sizeof(Produit));
        if (tmp == NULL) return -1;
        *cat = tmp;
        *cap = nouvelleCap;
    }
    int pos = 0;
    while (pos < *nb && strcmp((*cat)[pos].reference, ref) < 0) {
        pos++;
    }
    memmove(&(*cat)[pos + 1], &(*cat)[pos], (*nb - pos) * sizeof(Produit));
    strcpy((*cat)[pos].reference, ref);
    (*cat)[pos].prix = prix;
    (*nb)++;
    return pos;
}

int main(void) {
    Produit *cat = NULL;
    int nb = 0, cap = 0;
    char cmd[12];
    while (scanf("%11s", cmd) == 1 && strcmp(cmd, "FIN") != 0) {
        char ref[12];
        if (strcmp(cmd, "AJOUT") == 0) {
            float prix = 0.0f;
            scanf("%11s %f", ref, &prix);
            if (trouver(cat, nb, ref) >= 0) {
                printf("REFUS doublon %s\n", ref);
                continue;
            }
            int pos = insererTrie(&cat, &nb, &cap, ref, prix);
            if (pos < 0) {
                printf("Memoire insuffisante\n");
                break;
            }
            printf("AJOUT %s en position %d\n", ref, pos);
        } else if (strcmp(cmd, "SUPPR") == 0) {
            scanf("%11s", ref);
            int i = trouver(cat, nb, ref);
            if (i < 0) {
                printf("INTROUVABLE %s\n", ref);
                continue;
            }
            memmove(&cat[i], &cat[i + 1], (nb - i - 1) * sizeof(Produit));
            nb--;
            printf("SUPPR %s\n", ref);
        }
    }
    printf("Catalogue : %d produit(s), capacite %d\n", nb, cap);
    for (int i = 0; i < nb; i++) {
        printf("%s %.2f\n", cat[i].reference, cat[i].prix);
    }
    free(cat);
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Insertions dans le désordre', category: 'normal', stdin: 'AJOUT PRD-0004 89.90\nAJOUT PRD-0001 79.90\nAJOUT PRD-0007 49.90\nAJOUT PRD-0002 24.50\nFIN\n', expectedStdout: 'AJOUT PRD-0004 en position 0\nAJOUT PRD-0001 en position 0\nAJOUT PRD-0007 en position 2\nAJOUT PRD-0002 en position 1\nCatalogue : 4 produit(s), capacite 4\nPRD-0001 79.90\nPRD-0002 24.50\nPRD-0004 89.90\nPRD-0007 49.90', explanation: 'Le catalogue reste trié à chaque étape.', mustContainConstructs: ['memmove', 'realloc'], forbidMemoryLeaks: true },
          { id: 't2', label: 'Doublon, suppression, introuvable', category: 'normal', stdin: 'AJOUT PRD-0003 199\nAJOUT PRD-0006 9.90\nAJOUT PRD-0003 150\nSUPPR PRD-0003\nSUPPR PRD-0009\nAJOUT PRD-0005 59.90\nFIN\n', expectedStdout: 'AJOUT PRD-0003 en position 0\nAJOUT PRD-0006 en position 1\nREFUS doublon PRD-0003\nSUPPR PRD-0003\nINTROUVABLE PRD-0009\nAJOUT PRD-0005 en position 0\nCatalogue : 2 produit(s), capacite 2\nPRD-0005 59.90\nPRD-0006 9.90', explanation: 'Le doublon ne modifie pas le prix ; la suppression libère la place.', mustContainConstructs: ['memmove', 'realloc'], forbidMemoryLeaks: true },
          { id: 't3', label: 'Cinq produits (deux agrandissements)', category: 'limite', stdin: 'AJOUT PRD-0005 1\nAJOUT PRD-0004 2\nAJOUT PRD-0003 3\nAJOUT PRD-0002 4\nAJOUT PRD-0001 5\nFIN\n', expectedStdout: 'AJOUT PRD-0005 en position 0\nAJOUT PRD-0004 en position 0\nAJOUT PRD-0003 en position 0\nAJOUT PRD-0002 en position 0\nAJOUT PRD-0001 en position 0\nCatalogue : 5 produit(s), capacite 8\nPRD-0001 5.00\nPRD-0002 4.00\nPRD-0003 3.00\nPRD-0004 2.00\nPRD-0005 1.00', explanation: 'Pire cas : chaque insertion décale tout le tableau.', mustContainConstructs: ['memmove', 'realloc'], forbidMemoryLeaks: true },
          { id: 't4', label: 'Catalogue vide', category: 'limite', stdin: 'SUPPR PRD-0001\nFIN\n', expectedStdout: 'INTROUVABLE PRD-0001\nCatalogue : 0 produit(s), capacite 0', explanation: 'Aucune allocation : cat reste NULL.', forbidMemoryLeaks: true },
        ],
        hints: [
          'Séparez le travail en deux fonctions : trouver (renvoie l’indice ou -1) et insererTrie (renvoie la position ou -1).',
          'Dans insererTrie, agrandissez AVANT de calculer le décalage : memmove écrit dans la case nb.',
          'La position renvoyée est l’indice où le produit a été écrit, après décalage.',
        ],
        detailedExplanation: 'Un catalogue trié coûte un décalage O(n) à chaque insertion, mais permet ensuite un affichage ordonné sans tri et une recherche dichotomique en O(log n). Le pire cas (insertion toujours en tête, test t3) montre que memmove doit décaler tout le tableau. Dans ShopFlow, vous pourriez garder ce tri pour le catalogue, mais surtout pas pour les clients si vous mémorisez leurs indices ailleurs : l’insertion triée décale les indices.',
      },
      {
        id: 'D02_E6',
        chapterId: 'D02',
        trackId: 'defi',
        title: 'Corriger trois erreurs mémoire autour de realloc',
        difficulty: 'avance',
        category: 'bugfix',
        testedSkill: 'Pointeur pendant, taille en octets, libération',
        prerequisites: ['D02'],
        projectLink: 'module client : ajout de clients pendant qu’on crédite les points de fidélité d’un client existant.',
        statement: `Le programme ajoute 4 clients puis crédite 10 points au premier, et affiche le répertoire. Il contient **3 bugs** :
1. un pointeur vers le premier client est conservé pendant les ajouts (use-after-free détecté par la plateforme) ;
2. la taille passée à realloc oublie sizeof(Client) ;
3. le répertoire n’est jamais libéré.
Corrigez-les sans changer l’affichage attendu.`,
        isCoreValidationExercise: true,
        guidedSteps: [
          'Exécutez le programme : lisez le message d’erreur et la ligne indiquée.',
          'Remplacez le pointeur premier par un indice (0) et accédez à b.clients[0] après les ajouts.',
          'Vérifiez l’expression passée à realloc : elle doit être en OCTETS.',
          'Ajoutez le free manquant avant return 0.',
        ],
        starterCode: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int idClient;
    char nom[50];
    int pointsFidelite;
} Client;

typedef struct {
    Client *clients;
    int nbClients;
    int capaciteClients;
} Boutique;

int ajouterClient(Boutique *b, int id, const char *nom) {
    if (b->nbClients == b->capaciteClients) {
        int cap = (b->capaciteClients == 0) ? 1 : 2 * b->capaciteClients;
        Client *tmp = realloc(b->clients, cap);
        if (tmp == NULL) return 0;
        b->clients = tmp;
        b->capaciteClients = cap;
    }
    Client *c = &b->clients[b->nbClients];
    c->idClient = id;
    strcpy(c->nom, nom);
    c->pointsFidelite = 0;
    b->nbClients++;
    return 1;
}

int main(void) {
    Boutique b = {NULL, 0, 0};
    ajouterClient(&b, 1, "Martin");
    Client *premier = &b.clients[0];
    ajouterClient(&b, 2, "Bernard");
    ajouterClient(&b, 3, "Durand");
    ajouterClient(&b, 4, "Petit");
    premier->pointsFidelite += 10;
    for (int i = 0; i < b.nbClients; i++) {
        printf("#%d %s : %d pts\n", b.clients[i].idClient, b.clients[i].nom, b.clients[i].pointsFidelite);
    }
    printf("capacite %d\n", b.capaciteClients);
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int idClient;
    char nom[50];
    int pointsFidelite;
} Client;

typedef struct {
    Client *clients;
    int nbClients;
    int capaciteClients;
} Boutique;

int ajouterClient(Boutique *b, int id, const char *nom) {
    if (b->nbClients == b->capaciteClients) {
        int cap = (b->capaciteClients == 0) ? 1 : 2 * b->capaciteClients;
        Client *tmp = realloc(b->clients, cap * sizeof(Client));
        if (tmp == NULL) return 0;
        b->clients = tmp;
        b->capaciteClients = cap;
    }
    Client *c = &b->clients[b->nbClients];
    c->idClient = id;
    strcpy(c->nom, nom);
    c->pointsFidelite = 0;
    b->nbClients++;
    return 1;
}

int main(void) {
    Boutique b = {NULL, 0, 0};
    ajouterClient(&b, 1, "Martin");
    int iPremier = 0;
    ajouterClient(&b, 2, "Bernard");
    ajouterClient(&b, 3, "Durand");
    ajouterClient(&b, 4, "Petit");
    b.clients[iPremier].pointsFidelite += 10;
    for (int i = 0; i < b.nbClients; i++) {
        printf("#%d %s : %d pts\n", b.clients[i].idClient, b.clients[i].nom, b.clients[i].pointsFidelite);
    }
    printf("capacite %d\n", b.capaciteClients);
    free(b.clients);
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Répertoire de 4 clients', category: 'normal', stdin: '', expectedStdout: '#1 Martin : 10 pts\n#2 Bernard : 0 pts\n#3 Durand : 0 pts\n#4 Petit : 0 pts\ncapacite 4', explanation: 'Sans erreur mémoire ni fuite.', forbidMemoryLeaks: true, forbiddenConstructs: ['premier->'] },
        ],
        hints: [
          'Le message « Use-After-Free » pointe la ligne premier->pointsFidelite += 10;',
          'realloc(b->clients, cap) réserve cap OCTETS, pas cap clients.',
          'free(b.clients); avant return 0;',
        ],
        detailedExplanation: 'Le pointeur premier désigne une case du premier bloc ; le 2e ajout le déplace et libère l’ancien. Le bug de taille est encore plus sournois : avec cap octets, les écritures dépassent le bloc dès le premier client (débordement de tas). Sur un vrai système, ces deux bugs peuvent « sembler marcher » longtemps avant de corrompre la mémoire : seuls valgrind ou un sanitizer les révèlent de façon fiable.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE D03 — COMPILATION DE PROJET ET SIMULATION DE TESTS
  // ==========================================================================
  {
    id: 'D03',
    trackId: 'defi',
    number: 3,
    title: 'Compiler un projet multi-fichiers et simuler des tests',
    subtitle: 'gcc étape par étape, Makefile, messages d’erreur par étape, tests unitaires, tests de scénario et préparation de la soutenance.',
    estimatedMinutes: 90,
    prerequisites: ['C01', 'C06', 'C10'],
    relatedChapters: ['B02', 'C01', 'C10'],
    coreConcepts: ['préprocesseur', 'compilation séparée', 'édition de liens', 'Makefile', 'gcc -Wall -Wextra', 'tests unitaires', 'harnais de test', 'tolérance flottante', 'test de scénario', 'redirection et diff'],
    successCriteria: [
      'Compiler ShopFlow à la main puis avec un Makefile, et savoir quoi recompiler après une modification',
      'Associer un message d’erreur à l’étape qui l’a produit',
      'Écrire un harnais de tests qui détecte un bug et un test de scénario qui rejoue une session',
    ],
    lesson: {
      objectives: [
        'Décrire les 4 étapes de gcc et les fichiers qu’elles produisent (.i, .s, .o, exécutable)',
        'Lire et écrire un Makefile pour les 7 fichiers .c de ShopFlow (variables, règles, $@, $^, $<, clean)',
        'Distinguer erreur de préprocesseur, de compilation et d’édition de liens',
        'Écrire des tests unitaires avec un harnais (verifier, verifierProche) et des cas limites',
        'Rejouer un scénario complet avec une redirection d’entrée et comparer la sortie avec diff',
      ],
      intuition: `Un projet de 7 fichiers .c ne se compile pas « d’un bloc » : chaque .c est **compilé séparément** en un fichier objet .o, puis l’**éditeur de liens** assemble tous les .o en un exécutable. Comprendre ce découpage permet de lire les erreurs : une faute de frappe dans commande.c est signalée à la compilation de commande.c ; une fonction déclarée mais jamais écrite n’est signalée qu’**au moment des liens** (« undefined reference »).

Le **Makefile** décrit qui dépend de quoi. Quand vous modifiez client.c, make ne recompile que client.o puis refait les liens ; quand vous modifiez types.h, il recompile tout ce qui l’inclut. Résultat : une commande, make, et zéro oubli.

**Tester**, c’est vérifier automatiquement qu’une fonction donne le résultat attendu, au lieu de « regarder si ça a l’air bon ». Deux niveaux :
- les **tests unitaires** appellent une fonction (tauxRemise, calculerCommande, estDateValide) avec des entrées choisies — surtout les **cas limites** (100 €, 60 €, 29 février) — et comparent au résultat attendu ;
- les **tests de scénario** rejouent une session complète de l’application à partir d’un fichier d’entrées (./shopflow < scenario.txt) et comparent la sortie à une sortie de référence.

Un test qui échoue n’est pas un échec du projet : c’est un bug trouvé **avant** la soutenance.`,
      formalDefinition: `- **Chaîne de compilation** d’un fichier :
    gcc -E commande.c -o commande.i   préprocesseur : #include, #define, #ifndef
    gcc -S commande.i -o commande.s   compilation : C → assembleur (erreurs de syntaxe et de types)
    gcc -c commande.s -o commande.o   assemblage : fichier objet
    gcc *.o -o shopflow               édition de liens : résout les appels entre fichiers
  En pratique : gcc -Wall -Wextra -std=c99 -c commande.c (les 3 premières étapes d’un coup).
- **Options utiles** : -Wall -Wextra (avertissements), -std=c99 (norme), -g (informations de débogage pour gdb/valgrind), -O0 (pas d’optimisation pendant la mise au point), -Werror (avertissement = erreur).
- **Makefile** : cible: dépendances, puis une ligne de commande qui commence par une **tabulation**.
    $@ = la cible ; $^ = toutes les dépendances ; $< = la première dépendance ; %.o: %.c = règle générique.
- **Erreurs par étape** :
    préprocesseur : fatal error: commande.h: No such file or directory
    compilation   : expected ';' • implicit declaration of function • incompatible pointer type • unknown type name
    liens         : undefined reference to 'f' • multiple definition of 'f'
    make          : missing separator (espaces au lieu d’une tabulation) • No rule to make target
- **Test unitaire** : entrée connue → appel → comparaison au résultat attendu ; compteur de réussites ; code de retour non nul si un test échoue (utilisable par make test).
- **Flottants** : comparer avec une tolérance, fabs(obtenu - attendu) < 0.005 pour des montants au centime.
- **Test de scénario** : ./shopflow < tests/annulation.txt > sortie.txt puis diff -u tests/annulation.attendu sortie.txt (aucune sortie de diff = test réussi).
- **Mémoire** : valgrind --leak-check=full --error-exitcode=1 ./shopflow < tests/annulation.txt`,
      analogy: {
        title: 'Une chaîne de montage automobile',
        content: `Chaque atelier fabrique une pièce à partir de ses plans (compilation d’un .c en .o) ; le hall d’assemblage visse toutes les pièces sur le châssis (édition de liens). Si un plan est mal dessiné, l’atelier concerné s’arrête (erreur de compilation) ; s’il manque une pièce entière, c’est l’assemblage qui bloque (« undefined reference »). Le Makefile est le planning de l’usine : il sait quels ateliers relancer quand un plan change. Et les tests sont le banc d’essai : on ne livre pas une voiture dont on n’a pas testé les freins… surtout pas le jour de la soutenance.`,
      },
      vocabulary: [
        { fr: 'Unité de compilation', en: 'Translation unit', definition: 'Un fichier .c après inclusion de ses en-têtes ; compilé indépendamment des autres.' },
        { fr: 'Fichier objet', en: 'Object file', definition: 'Code machine d’un seul .c, avec des appels pas encore résolus.' },
        { fr: 'Éditeur de liens', en: 'Linker', definition: 'Outil qui assemble les .o et résout les appels entre fichiers.' },
        { fr: 'Cible / dépendance', en: 'Target / prerequisite', definition: 'Dans un Makefile : fichier à produire / fichiers dont il dépend.' },
        { fr: 'Test unitaire', en: 'Unit test', definition: 'Vérification automatique d’une fonction isolée sur des entrées choisies.' },
        { fr: 'Harnais de test', en: 'Test harness', definition: 'Petit code qui exécute les tests, compte les réussites et affiche un bilan.' },
        { fr: 'Test de non-régression', en: 'Regression test', definition: 'Test rejoué après chaque modification pour vérifier qu’on n’a rien cassé.' },
        { fr: 'Sortie de référence', en: 'Golden file / expected output', definition: 'Fichier contenant la sortie correcte d’un scénario, comparée avec diff.' },
      ],
      deepDive: [
        {
          title: 'Compiler ShopFlow à la main, étape par étape',
          content: `Faites-le une fois à la main avant d’utiliser make : vous comprendrez chaque message d’erreur.`,
          code: `# 1. Compiler chaque module separement (produit les .o)
gcc -Wall -Wextra -std=c99 -g -c main.c
gcc -Wall -Wextra -std=c99 -g -c produit.c
gcc -Wall -Wextra -std=c99 -g -c client.c
gcc -Wall -Wextra -std=c99 -g -c commande.c
gcc -Wall -Wextra -std=c99 -g -c statistique.c
gcc -Wall -Wextra -std=c99 -g -c utils.c
gcc -Wall -Wextra -std=c99 -g -c initialisation.c

# 2. Edition de liens : un seul executable
gcc main.o produit.o client.o commande.o statistique.o utils.o initialisation.o -o shopflow

# 3. Voir ce que produit le preprocesseur (utile pour un probleme d'include)
gcc -E commande.c | less`,
        },
        {
          title: 'Un Makefile complet pour ShopFlow, ligne par ligne',
          content: `Les lignes de commande (« recettes ») commencent OBLIGATOIREMENT par une tabulation : avec des espaces, make répond « missing separator ».
- CC, CFLAGS, OBJ sont des variables, utilisées avec $(…) ;
- shopflow: $(OBJ) dit « l’exécutable dépend de tous les .o » ;
- %.o: %.c types.h est une règle générique : chaque .o dépend de son .c et de types.h ;
- $< est la première dépendance (le .c), $@ la cible (le .o), $^ toutes les dépendances ;
- .PHONY déclare des cibles qui ne sont pas des fichiers (clean, test).`,
          code: `CC      = gcc
CFLAGS  = -Wall -Wextra -std=c99 -g
OBJ     = main.o produit.o client.o commande.o statistique.o utils.o initialisation.o

shopflow: $(OBJ)
	$(CC) $(CFLAGS) -o $@ $^

%.o: %.c types.h
	$(CC) $(CFLAGS) -c $< -o $@

# dependances specifiques : commande.o depend aussi de produit.h et client.h
commande.o: commande.c commande.h produit.h client.h types.h

test: shopflow
	./shopflow < tests/annulation.txt > tests/annulation.sortie
	diff -u tests/annulation.attendu tests/annulation.sortie

memoire: shopflow
	valgrind --leak-check=full --error-exitcode=1 ./shopflow < tests/annulation.txt

clean:
	rm -f $(OBJ) shopflow tests/*.sortie

.PHONY: clean test memoire`,
        },
        {
          title: 'Que recompile make ?',
          content: `make compare les dates de modification : une cible est refaite si une de ses dépendances est plus récente.
- Vous modifiez client.c → seul client.o est recompilé, puis les liens sont refaits.
- Vous modifiez types.h → tous les .o (règle %.o: %.c types.h) sont recompilés.
- Vous modifiez produit.h mais il n’apparaît dans aucune dépendance → make ne recompile RIEN, et l’exécutable peut utiliser des structures incohérentes entre fichiers. D’où l’importance de lister les en-têtes (ou d’utiliser gcc -MMD pour générer les dépendances automatiquement).
En cas de doute : make clean && make.`,
        },
        {
          title: 'Lire un message d’erreur : quelle étape, quel fichier, quelle cause ?',
          content: `    commande.c:57:9: error: implicit declaration of function 'trouverProduit'
→ compilation de commande.c, ligne 57 : la fonction n’a pas de prototype visible. Il manque #include "produit.h" (ou le prototype dans produit.h).
    /usr/bin/ld: main.o: in function 'main': undefined reference to 'detruireBoutique'
→ édition de liens : le prototype existe mais aucun .o ne contient le corps. Fichier initialisation.c absent de OBJ, ou nom mal orthographié dans la définition.
    /usr/bin/ld: client.o: multiple definition of 'estEmailValide'; utils.o: first defined here
→ édition de liens : le corps existe deux fois, souvent écrit dans un .h inclus par deux .c.
    Makefile:5: *** missing separator. Stop.
→ make : la ligne 5 commence par des espaces au lieu d’une tabulation.
Règle d’or : corrigez **la première** erreur, recompilez, recommencez. Les suivantes sont souvent des conséquences.`,
        },
        {
          title: 'assert ou harnais de test ?',
          content: `assert(condition) (<assert.h>) arrête le programme dès qu’une condition est fausse, en indiquant le fichier et la ligne. Idéal pour vérifier des **invariants** pendant le développement (nb ≤ capacite, pointeur non NULL).
Un **harnais** (fonctions verifier / verifierProche avec compteurs) continue après un échec et affiche un bilan : idéal pour une **série de tests**, car on voit d’un coup tous les cas qui échouent. On le place dans un fichier séparé tests.c compilé avec les modules (sans main.c), par exemple : gcc -Wall -Wextra tests.c commande.c produit.c utils.c -o tests && ./tests`,
        },
        {
          title: 'Choisir ses cas de test : partitions et bornes',
          content: `Pour chaque règle métier, testez une valeur dans chaque zone **et** chaque borne :
- tauxRemise : 0 / 99.99 / 100 / 299.99 / 300 / 599.99 / 600 / 1000 ;
- port : 59.99 / 60 ;
- estDateValide : 28/02/2026, 29/02/2026, 29/02/2024, 29/02/2000, 29/02/2100, 31/04, 0/1, mois 13 ;
- quantité : 0, 1, stock, stock + 1, « 3x » ;
- transitions : chacune des 4 × 4 combinaisons (statut actuel, statut demandé).
Un test qui n’a jamais échoué n’a peut-être jamais rien testé : vérifiez qu’il échoue bien quand vous introduisez volontairement un bug (par exemple > au lieu de >=).`,
        },
        {
          title: 'Rejouer un scénario de soutenance automatiquement',
          content: `Votre programme lit le clavier (stdin). Le shell peut le remplacer par un fichier : chaque ligne du fichier est une réponse au menu. Enregistrez une fois la sortie correcte, puis comparez après chaque modification.`,
          code: `# tests/annulation.txt : choix du menu et saisies, une par ligne
3          <- menu Commandes
1          <- creer une commande
2          <- client n 2
PRD-0004
2
0          <- fin des lignes
4          <- annuler la commande creee
0          <- quitter

./shopflow < tests/annulation.txt > tests/annulation.sortie
diff -u tests/annulation.attendu tests/annulation.sortie && echo "SCENARIO OK"`,
        },
      ],
      simpleExample: cExample(
        'Un harnais de tests unitaires pour tauxRemise',
        'verifier compte les tests et affiche un bilan ; le code de retour vaut 1 si un test échoue (utilisable par make test).',
        String.raw`#include <stdio.h>

int nbTests = 0;
int nbReussis = 0;

void verifier(int condition, const char *nom) {
    nbTests++;
    if (condition) {
        nbReussis++;
        printf("[OK]    %s\n", nom);
    } else {
        printf("[ECHEC] %s\n", nom);
    }
}

int tauxRemise(float brut) {
    if (brut >= 600.0f) return 15;
    if (brut >= 300.0f) return 10;
    if (brut >= 100.0f) return 5;
    return 0;
}

int main(void) {
    verifier(tauxRemise(0.0f) == 0, "panier vide -> 0 %");
    verifier(tauxRemise(99.99f) == 0, "99.99 -> 0 %");
    verifier(tauxRemise(100.0f) == 5, "borne 100 -> 5 %");
    verifier(tauxRemise(299.99f) == 5, "299.99 -> 5 %");
    verifier(tauxRemise(300.0f) == 10, "borne 300 -> 10 %");
    verifier(tauxRemise(600.0f) == 15, "borne 600 -> 15 %");
    printf("Bilan : %d/%d tests reussis\n", nbReussis, nbTests);
    return (nbReussis == nbTests) ? 0 : 1;
}`,
        `[OK]    panier vide -> 0 %
[OK]    99.99 -> 0 %
[OK]    borne 100 -> 5 %
[OK]    299.99 -> 5 %
[OK]    borne 300 -> 10 %
[OK]    borne 600 -> 15 %
Bilan : 6/6 tests reussis`,
        [
          ['int nbTests = 0;', 'Compteurs globaux du harnais (dans un fichier tests.c séparé, on les déclarerait static).'],
          ['void verifier(int condition, const char *nom) {', 'Un test = une condition + un nom lisible pour savoir lequel a échoué.'],
          ['printf("[ECHEC] %s\\n", nom);', 'Le harnais continue après un échec : on voit tous les problèmes d’un coup.'],
          ['verifier(tauxRemise(100.0f) == 5, "borne 100 -> 5 %");', 'Les tests portent d’abord sur les BORNES des paliers.'],
          ['return (nbReussis == nbTests) ? 0 : 1;', 'Code de retour non nul en cas d’échec : make test ou un script s’arrêtent automatiquement.'],
        ]
      ),
      intermediateExample: cExample(
        'Tests pilotés par une table de cas lue en entrée',
        'Les cas (brut, TTC attendu) arrivent par stdin comme un fichier de test ; verifierProche compare des montants avec une tolérance d’un demi-centime.',
        String.raw`#include <stdio.h>
#include <math.h>

int nbTests = 0;
int nbReussis = 0;

void verifierProche(float obtenu, float attendu, const char *nom) {
    nbTests++;
    if (fabs(obtenu - attendu) < 0.005f) {
        nbReussis++;
        printf("[OK]    %s = %.2f\n", nom, obtenu);
    } else {
        printf("[ECHEC] %s : obtenu %.2f, attendu %.2f\n", nom, obtenu, attendu);
    }
}

float calculerTTC(float brut) {
    int taux = brut >= 600 ? 15 : brut >= 300 ? 10 : brut >= 100 ? 5 : 0;
    float ht = brut - brut * taux / 100.0f;
    float port = (brut >= 60.0f) ? 0.0f : 5.90f;
    return ht * 1.20f + port;
}

int main(void) {
    float brut = 0.0f, attendu = 0.0f;
    char nom[40];
    while (scanf("%f %f", &brut, &attendu) == 2) {
        snprintf(nom, sizeof(nom), "TTC(%.2f)", brut);
        verifierProche(calculerTTC(brut), attendu, nom);
    }
    printf("Bilan : %d/%d tests reussis\n", nbReussis, nbTests);
    return (nbReussis == nbTests) ? 0 : 1;
}`,
        `[OK]    TTC(50.00) = 65.90
[OK]    TTC(60.00) = 72.00
[OK]    TTC(100.00) = 114.00
[OK]    TTC(340.00) = 367.20
[ECHEC] TTC(600.00) : obtenu 612.00, attendu 620.00
Bilan : 4/5 tests reussis`,
        [
          ['if (fabs(obtenu - attendu) < 0.005f) {', 'Jamais == entre float : une tolérance d’un demi-centime suffit pour des montants arrondis au centime.'],
          ['printf("[ECHEC] %s : obtenu %.2f, attendu %.2f\\n", nom, obtenu, attendu);', 'Un bon message d’échec affiche obtenu ET attendu : on comprend tout de suite l’écart.'],
          ['while (scanf("%f %f", &brut, &attendu) == 2) {', 'Les cas de test viennent d’un fichier (./tests < cas.txt) : ajouter un test = ajouter une ligne, sans recompiler.'],
          ['snprintf(nom, sizeof(nom), "TTC(%.2f)", brut);', 'Le nom du test est construit à partir de ses données.'],
          ['return (nbReussis == nbTests) ? 0 : 1;', 'Le dernier cas échoue : c’est le CAS DE TEST qui est faux (620 au lieu de 612). Un échec se vérifie dans les deux sens : le code ET la valeur attendue.'],
        ],
        '50 65.90\n60 72.00\n100 114.00\n340 367.20\n600 620.00\n'
      ),
      commonMistakes: [
        {
          title: 'Compiler un seul fichier et s’étonner des « undefined reference »',
          wrongCode: `gcc -Wall main.c -o shopflow
/* undefined reference to 'initialiserDonneesTest'
   undefined reference to 'detruireBoutique' ... */`,
          rightCode: `gcc -Wall -Wextra -std=c99 main.c produit.c client.c commande.c \\
    statistique.c utils.c initialisation.c -o shopflow
/* ou simplement : make */`,
          explanation: 'main.c compile (les prototypes sont visibles), mais l’éditeur de liens ne trouve pas les corps qui sont dans les autres .c.',
          errorType: 'compilation',
        },
        {
          title: 'Ignorer les avertissements',
          wrongCode: `commande.c:88: warning: suggest parentheses around assignment
    used as truth value [-Wparentheses]
/* "ce n'est qu'un warning" */`,
          rightCode: `/* Le sujet exige 0 avertissement : chaque warning
   est un bug potentiel. Ici : if (c->statut = ANNULEE)
   doit devenir if (c->statut == ANNULEE). */`,
          explanation: '-Wall -Wextra détectent des bugs réels (= au lieu de ==, variable non initialisée, mauvais format printf). Compilez avec -Werror pour ne plus pouvoir les ignorer.',
          errorType: 'compilation',
        },
        {
          title: 'Comparer des montants flottants avec == dans un test',
          wrongCode: `verifier(calculerTTC(59.90f) == 77.78f, "TTC 59.90");
/* peut echouer alors que le calcul est juste */`,
          rightCode: `verifierProche(calculerTTC(59.90f), 77.78f, "TTC 59.90");
/* fabs(obtenu - attendu) < 0.005f */`,
          explanation: '77.78 n’a pas de représentation binaire exacte : le résultat calculé peut différer au 7e chiffre. Le test serait faux, pas le code.',
          errorType: 'logique',
        },
        {
          title: 'Ne tester que les cas « normaux »',
          wrongCode: `verifier(tauxRemise(50) == 0, "50");
verifier(tauxRemise(200) == 5, "200");
/* passe meme avec > au lieu de >= */`,
          rightCode: `verifier(tauxRemise(99.99f) == 0, "99.99");
verifier(tauxRemise(100.0f) == 5, "borne 100");`,
          explanation: 'Les bugs se cachent aux bornes. Un test au milieu d’une zone ne distingue pas > de >=.',
          errorType: 'logique',
        },
      ],
      summary: [
        'Chaque .c → .o séparément ; l’éditeur de liens assemble les .o.',
        'undefined reference / multiple definition = édition de liens ; expected ; / implicit declaration = compilation.',
        'Makefile : variables, cible: dépendances, recette avec TABULATION, $@ $< $^, clean, .PHONY.',
        'Lister les .h dans les dépendances, sinon make ne recompile pas après leur modification.',
        'Tests unitaires sur les bornes ; tolérance pour les float ; bilan et code de retour.',
        'Tests de scénario : ./shopflow < scenario.txt > sortie.txt puis diff avec la sortie de référence ; valgrind sur le même scénario.',
      ],
      comprehensionQuestions: [
        {
          id: 'D03_Q1',
          question: 'Le message « undefined reference to calculerCommande » vient de quelle étape ?',
          options: ['Du préprocesseur', 'De la compilation de commande.c', 'De l’édition de liens', 'De l’exécution'],
          correctIndex: 2,
          explanation: 'Tous les fichiers ont compilé ; c’est l’assemblage des .o qui ne trouve aucun corps pour calculerCommande.',
        },
        {
          id: 'D03_Q2',
          question: 'Avec la règle `%.o: %.c types.h`, vous modifiez types.h puis tapez make. Que se passe-t-il ?',
          options: ['Rien', 'Seul main.o est recompilé', 'Tous les .o sont recompilés puis les liens sont refaits', 'Seuls les liens sont refaits'],
          correctIndex: 2,
          explanation: 'types.h est une dépendance de chaque .o : tous sont plus anciens que lui et sont donc refaits.',
        },
        {
          id: 'D03_Q3',
          question: 'Pourquoi un harnais de test renvoie-t-il 1 quand un test échoue ?',
          options: [
            'Pour afficher un message',
            'Pour que make, un script ou un outil d’intégration continue détectent l’échec automatiquement',
            'Parce que main doit toujours renvoyer 1',
            'Pour libérer la mémoire',
          ],
          correctIndex: 1,
          explanation: 'Le code de retour est lu par le shell : make s’arrête si une commande renvoie une valeur non nulle.',
        },
      ],
    },
    exercises: [
      {
        id: 'D03_E1',
        chapterId: 'D03',
        trackId: 'defi',
        title: 'Reconstituer le Makefile de ShopFlow',
        difficulty: 'intermediaire',
        category: 'ordering',
        testedSkill: 'Structure d’un Makefile : variables, édition de liens, règle générique, clean',
        prerequisites: ['D03'],
        projectLink: 'le Makefile « fortement recommandé » par la section 4 du sujet.',
        statement: 'Remettez les lignes dans l’ordre : d’abord les variables CC, CFLAGS puis OBJ ; ensuite la règle de l’exécutable et sa recette ; puis la règle générique des .o et sa recette ; enfin clean et sa recette. (Les recettes commencent par une tabulation.)',
        isCoreValidationExercise: true,
        scrambledLines: [
          '%.o: %.c types.h',
          'clean:',
          'CFLAGS = -Wall -Wextra -std=c99 -g',
          '\t$(CC) $(CFLAGS) -o $@ $^',
          'OBJ = main.o produit.o client.o commande.o statistique.o utils.o initialisation.o',
          '\trm -f $(OBJ) shopflow',
          'CC = gcc',
          '\t$(CC) $(CFLAGS) -c $< -o $@',
          'shopflow: $(OBJ)',
        ],
        correctOrderIndices: [6, 2, 4, 8, 3, 0, 7, 1, 5],
        hints: [
          'Une recette suit toujours immédiatement la ligne « cible: dépendances » qu’elle réalise.',
          'La recette qui utilise -c et $< compile UN .c : elle va avec la règle %.o.',
          'La recette avec $^ assemble tous les .o : elle va avec shopflow.',
        ],
        detailedExplanation: `CC = gcc
CFLAGS = -Wall -Wextra -std=c99 -g
OBJ = main.o produit.o client.o commande.o statistique.o utils.o initialisation.o
shopflow: $(OBJ)
	$(CC) $(CFLAGS) -o $@ $^
%.o: %.c types.h
	$(CC) $(CFLAGS) -c $< -o $@
clean:
	rm -f $(OBJ) shopflow
La première cible du fichier (shopflow) est celle que construit make sans argument.`,
      },
      {
        id: 'D03_E2',
        chapterId: 'D03',
        trackId: 'defi',
        title: 'Diagnostiquer une erreur d’édition de liens',
        difficulty: 'intermediaire',
        category: 'error_spot',
        testedSkill: 'Associer un message à son étape et à sa cause',
        prerequisites: ['D03'],
        statement: `La compilation donne :

    gcc -Wall -Wextra -std=c99 -g -c main.c
    gcc -Wall -Wextra -std=c99 -g -c commande.c
    ...
    gcc -o shopflow main.o produit.o client.o commande.o statistique.o utils.o
    /usr/bin/ld: main.o: in function 'main':
    main.c:(.text+0x2a): undefined reference to 'initialiserDonneesTest'
    /usr/bin/ld: main.c:(.text+0x91): undefined reference to 'detruireBoutique'

Quelle est la cause la plus probable ?`,
        isCoreValidationExercise: true,
        options: [
          'Il manque #include "initialisation.h" dans main.c',
          'initialisation.o ne fait pas partie de la liste des objets liés (OBJ incomplet dans le Makefile)',
          'Une erreur de syntaxe dans main.c',
          'La fonction main est définie deux fois',
        ],
        correctOptionIndex: 1,
        errorClassificationTarget: 'compilation',
        hints: [
          'main.c a été compilé sans erreur : les prototypes étaient donc visibles.',
          'Les deux fonctions manquantes appartiennent au même module.',
          'Regardez la liste des .o de la dernière commande.',
        ],
        detailedExplanation: 'Un #include manquant aurait produit « implicit declaration » à la compilation de main.c. Ici, toutes les compilations réussissent et c’est l’éditeur de liens qui ne trouve pas les deux fonctions du module initialisation : initialisation.o est absent de la commande de liens (oubli dans OBJ). Correction : ajouter initialisation.o à OBJ.',
      },
      {
        id: 'D03_E3',
        chapterId: 'D03',
        trackId: 'defi',
        title: 'Que recompile make ?',
        difficulty: 'intermediaire',
        category: 'qcm',
        testedSkill: 'Dépendances et recompilation incrémentale',
        prerequisites: ['D03'],
        statement: `Le Makefile contient la règle générique %.o: %.c types.h et la règle spécifique :

    commande.o: commande.c commande.h produit.h client.h types.h

Après une première compilation complète, vous modifiez **produit.h** puis tapez make. Que se passe-t-il ?`,
        isCoreValidationExercise: true,
        options: [
          'Rien n’est recompilé',
          'Seul produit.o est recompilé',
          'commande.o est recompilé (il dépend explicitement de produit.h), puis les liens sont refaits ; produit.o, qui ne liste pas produit.h, n’est PAS recompilé',
          'Tous les .o sont recompilés',
        ],
        correctOptionIndex: 2,
        hints: [
          'Quelles règles mentionnent produit.h parmi leurs dépendances ?',
          'La règle générique ne cite que le .c et types.h.',
          'Une dépendance oubliée signifie « pas de recompilation », même si le fichier inclut cet en-tête.',
        ],
        detailedExplanation: 'Seul commande.o déclare dépendre de produit.h : il est recompilé, puis shopflow est refait. produit.o inclut pourtant produit.h, mais le Makefile ne le dit pas : make ne le recompile pas. Si produit.h a changé une structure, les deux .o en ont alors une vision différente — un bug très difficile à trouver. Solution : lister les en-têtes de chaque .o (ou gcc -MMD), et en cas de doute make clean && make.',
      },
      {
        id: 'D03_E4',
        chapterId: 'D03',
        trackId: 'defi',
        title: 'Écrire le harnais qui débusque un bug de frais de port',
        difficulty: 'avance',
        category: 'c_code',
        testedSkill: 'Harnais de tests avec tolérance flottante et messages d’échec',
        prerequisites: ['D03'],
        projectLink: 'fichier tests.c compilé avec commande.c pour vérifier calculerCommande avant la soutenance.',
        statement: `La fonction calculerTTC (fournie, **à ne pas corriger**) contient un bug sur le seuil de port. Écrivez :
- \`void verifierProche(float obtenu, float attendu, const char *nom)\` qui incrémente nbTests et, si |obtenu − attendu| < 0.005, incrémente nbReussis et affiche « [OK] nom », sinon « [ECHEC] nom (obtenu X, attendu Y) » (2 décimales) ;
- dans main, les 6 tests de la démarche guidée, dans l’ordre, puis « Bilan : R/T tests reussis ».
Le programme doit renvoyer 1 si au moins un test échoue.`,
        isCoreValidationExercise: true,
        guidedSteps: [
          'Écrivez verifierProche avec fabs (inclure <math.h>).',
          'Tests, dans cet ordre : "TTC 50" → 65.90 ; "TTC 59.90" → 77.78 ; "TTC 60" → 72.00 ; "TTC 100" → 114.00 ; "TTC 300" → 324.00 ; "TTC 600" → 612.00.',
          'Affichez le bilan, puis return (nbReussis == nbTests) ? 0 : 1;',
          'Lisez le résultat : quel test échoue, et pourquoi ? (Ne corrigez pas calculerTTC : le but est que le test le révèle.)',
        ],
        starterCode: String.raw`#include <stdio.h>
#include <math.h>

int nbTests = 0;
int nbReussis = 0;

/* Fonction testee : NE PAS MODIFIER */
float calculerTTC(float brut) {
    int taux = brut >= 600 ? 15 : brut >= 300 ? 10 : brut >= 100 ? 5 : 0;
    float ht = brut - brut * taux / 100.0f;
    float port = (brut > 60.0f) ? 0.0f : 5.90f;
    return ht * 1.20f + port;
}

/* TODO : verifierProche */

int main(void) {
    /* TODO : les 6 tests et le bilan */
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <math.h>

int nbTests = 0;
int nbReussis = 0;

/* Fonction testee : NE PAS MODIFIER */
float calculerTTC(float brut) {
    int taux = brut >= 600 ? 15 : brut >= 300 ? 10 : brut >= 100 ? 5 : 0;
    float ht = brut - brut * taux / 100.0f;
    float port = (brut > 60.0f) ? 0.0f : 5.90f;
    return ht * 1.20f + port;
}

void verifierProche(float obtenu, float attendu, const char *nom) {
    nbTests++;
    if (fabs(obtenu - attendu) < 0.005f) {
        nbReussis++;
        printf("[OK] %s\n", nom);
    } else {
        printf("[ECHEC] %s (obtenu %.2f, attendu %.2f)\n", nom, obtenu, attendu);
    }
}

int main(void) {
    verifierProche(calculerTTC(50.0f), 65.90f, "TTC 50");
    verifierProche(calculerTTC(59.90f), 77.78f, "TTC 59.90");
    verifierProche(calculerTTC(60.0f), 72.00f, "TTC 60");
    verifierProche(calculerTTC(100.0f), 114.00f, "TTC 100");
    verifierProche(calculerTTC(300.0f), 324.00f, "TTC 300");
    verifierProche(calculerTTC(600.0f), 612.00f, "TTC 600");
    printf("Bilan : %d/%d tests reussis\n", nbReussis, nbTests);
    return (nbReussis == nbTests) ? 0 : 1;
}
`,
        testCases: [
          { id: 't1', label: 'Le harnais révèle le bug du seuil de port', category: 'normal', stdin: '', expectedStdout: '[OK] TTC 50\n[OK] TTC 59.90\n[ECHEC] TTC 60 (obtenu 77.90, attendu 72.00)\n[OK] TTC 100\n[OK] TTC 300\n[OK] TTC 600\nBilan : 5/6 tests reussis', expectedExitCode: 1, explanation: 'Avec > 60, le port reste facturé à exactement 60 € : seul le test de la borne le détecte.', mustContainConstructs: ['fabs', 'nbTests'], forbiddenConstructs: ['brut >= 60.0f'] },
        ],
        hints: [
          'nbTests++ à chaque appel ; nbReussis++ seulement si l’écart est inférieur à 0.005.',
          'Format d’échec : printf("[ECHEC] %s (obtenu %.2f, attendu %.2f)\\n", nom, obtenu, attendu);',
          'Le bilan est 5/6 : le test de la borne 60 € échoue, et c’est voulu.',
        ],
        detailedExplanation: 'Ce harnais montre l’intérêt des tests aux bornes : avec > au lieu de >=, seuls les paniers d’exactement 60 € sont mal facturés. Aucun test « au milieu » (50, 100, 300) ne l’aurait vu. Une fois le bug ainsi prouvé, on corrigerait calculerTTC (>=) et on relancerait les tests : 6/6, le test reste ensuite comme test de non-régression.',
      },
      {
        id: 'D03_E5',
        chapterId: 'D03',
        trackId: 'defi',
        title: 'Simuler un test de scénario avec vérifications intégrées',
        difficulty: 'synthese',
        category: 'c_code',
        testedSkill: 'Rejouer une session et vérifier l’état attendu à chaque étape',
        prerequisites: ['C08', 'D03'],
        projectLink: 'fichiers tests/*.txt rejoués avec ./shopflow < scenario.txt : vérifier la cohérence du stock après création et annulation.',
        statement: `Le catalogue fixe contient PRD-0001 (stock 10) et PRD-0004 (stock 5). Le programme lit un **scénario** ligne par ligne (une commande par ligne, numérotées à partir de 1) :
- « AJOUT REF Q » : ajoute Q au panier si REF existe et Q ≤ stock restant (le stock est décrémenté), sinon ne fait rien ;
- « ANNULER » : réintègre tout le panier dans le stock et vide le panier ;
- « ATTENDU_STOCK REF N » : vérifie que le stock de REF vaut N ;
- « ATTENDU_ARTICLES N » : vérifie que le panier contient N articles au total.
Chaque vérification affiche « [OK] ligne L » ou « [ECHEC] ligne L : obtenu X, attendu N ». À la fin : « Scenario : R/T verifications reussies ».`,
        isCoreValidationExercise: true,
        guidedSteps: [
          'Lisez chaque ligne avec fgets, incrémentez un compteur de ligne, puis identifiez la commande avec sscanf(ligne, "%19s", cmd).',
          'Gardez un tableau int panier[2] (quantités par produit) et un tableau de stocks ; une fonction indiceProduit(ref) renvoie 0, 1 ou -1.',
          'AJOUT : sscanf(ligne, "%*s %11s %d", ref, &q) ; contrôlez la référence et le stock avant de modifier quoi que ce soit.',
          'Les deux commandes ATTENDU_* appellent la même fonction de vérification (obtenu, attendu, numéro de ligne).',
        ],
        starterCode: String.raw`#include <stdio.h>
#include <string.h>

int main(void) {
    const char *refs[2] = {"PRD-0001", "PRD-0004"};
    int stock[2] = {10, 5};
    int panier[2] = {0, 0};
    char ligne[80];
    int numLigne = 0;
    while (fgets(ligne, sizeof(ligne), stdin) != NULL) {
        numLigne++;
        /* TODO */
    }
    /* TODO : bilan */
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <string.h>

int nbVerifs = 0;
int nbOk = 0;

void verifier(int obtenu, int attendu, int numLigne) {
    nbVerifs++;
    if (obtenu == attendu) {
        nbOk++;
        printf("[OK] ligne %d\n", numLigne);
    } else {
        printf("[ECHEC] ligne %d : obtenu %d, attendu %d\n", numLigne, obtenu, attendu);
    }
}

int indiceProduit(const char *refs[], const char *ref) {
    for (int i = 0; i < 2; i++) {
        if (strcmp(refs[i], ref) == 0) return i;
    }
    return -1;
}

int main(void) {
    const char *refs[2] = {"PRD-0001", "PRD-0004"};
    int stock[2] = {10, 5};
    int panier[2] = {0, 0};
    char ligne[80];
    int numLigne = 0;
    while (fgets(ligne, sizeof(ligne), stdin) != NULL) {
        numLigne++;
        char cmd[20], ref[12];
        int n = 0;
        if (sscanf(ligne, "%19s", cmd) != 1) continue;
        if (strcmp(cmd, "AJOUT") == 0) {
            if (sscanf(ligne, "%*s %11s %d", ref, &n) == 2) {
                int i = indiceProduit(refs, ref);
                if (i >= 0 && n >= 1 && n <= stock[i]) {
                    stock[i] -= n;
                    panier[i] += n;
                }
            }
        } else if (strcmp(cmd, "ANNULER") == 0) {
            for (int i = 0; i < 2; i++) {
                stock[i] += panier[i];
                panier[i] = 0;
            }
        } else if (strcmp(cmd, "ATTENDU_STOCK") == 0) {
            if (sscanf(ligne, "%*s %11s %d", ref, &n) == 2) {
                int i = indiceProduit(refs, ref);
                verifier(i >= 0 ? stock[i] : -1, n, numLigne);
            }
        } else if (strcmp(cmd, "ATTENDU_ARTICLES") == 0) {
            if (sscanf(ligne, "%*s %d", &n) == 1) {
                verifier(panier[0] + panier[1], n, numLigne);
            }
        }
    }
    printf("Scenario : %d/%d verifications reussies\n", nbOk, nbVerifs);
    return (nbOk == nbVerifs) ? 0 : 1;
}
`,
        testCases: [
          { id: 't1', label: 'Création puis annulation', category: 'normal', stdin: 'AJOUT PRD-0001 3\nAJOUT PRD-0004 2\nATTENDU_STOCK PRD-0001 7\nATTENDU_ARTICLES 5\nANNULER\nATTENDU_STOCK PRD-0001 10\nATTENDU_STOCK PRD-0004 5\nATTENDU_ARTICLES 0\n', expectedStdout: '[OK] ligne 3\n[OK] ligne 4\n[OK] ligne 6\n[OK] ligne 7\n[OK] ligne 8\nScenario : 5/5 verifications reussies', explanation: 'Le stock revient à l’état initial après annulation.' },
          { id: 't2', label: 'Ajouts refusés et attente erronée', category: 'limite', stdin: 'AJOUT PRD-0004 6\nAJOUT PRD-0009 1\nAJOUT PRD-0004 5\nATTENDU_STOCK PRD-0004 0\nAJOUT PRD-0004 1\nATTENDU_ARTICLES 6\n', expectedStdout: '[OK] ligne 4\n[ECHEC] ligne 6 : obtenu 5, attendu 6\nScenario : 1/2 verifications reussies', explanation: 'Le 6e casque est refusé : le scénario qui attendait 6 articles échoue.' },
          { id: 't3', label: 'Lignes vides ignorées mais comptées', category: 'limite', stdin: 'AJOUT PRD-0001 10\n\nATTENDU_STOCK PRD-0001 0\n', expectedStdout: '[OK] ligne 3\nScenario : 1/1 verifications reussies', explanation: 'La ligne vide garde sa numérotation.' },
        ],
        hints: [
          '%*s dans sscanf lit un mot sans le stocker : pratique pour sauter le nom de la commande.',
          'La ligne est comptée avant d’être analysée, même si elle est vide.',
          'Une seule fonction verifier(obtenu, attendu, numLigne) sert aux deux commandes ATTENDU_*.',
        ],
        detailedExplanation: 'Ce programme est une version miniature d’un outil de tests d’acceptation : le scénario mélange actions et vérifications, et le numéro de ligne permet de retrouver immédiatement l’étape fautive. Dans votre projet, vous obtenez le même résultat avec ./shopflow < scenario.txt > sortie.txt puis diff avec la sortie de référence.',
      },
      {
        id: 'D03_E6',
        chapterId: 'D03',
        trackId: 'defi',
        title: 'Faire passer une suite de tests sur estDateValide',
        difficulty: 'intermediaire',
        category: 'bugfix',
        testedSkill: 'Utiliser les échecs d’une suite de tests pour localiser et corriger des bugs',
        prerequisites: ['C02', 'D03'],
        projectLink: 'validation de la date de commande (section 3.1.1 du sujet : jour validé selon le mois, années bissextiles).',
        statement: 'Exécutez le programme : la suite de 8 tests signale des échecs. Corrigez **uniquement** les fonctions estBissextile et joursDansMois jusqu’à obtenir « Bilan : 8/8 tests reussis ». Ne modifiez pas les tests.',
        isCoreValidationExercise: true,
        guidedSteps: [
          'Lancez « Tester avec cette entrée » et notez les tests [ECHEC].',
          'Pour chaque échec, déroulez la fonction à la main avec la date du test (table de trace mentale).',
          'Corrigez une seule chose, relancez, et vérifiez que les tests déjà verts le restent (non-régression).',
        ],
        starterCode: String.raw`#include <stdio.h>

typedef struct { int jour; int mois; int annee; } Date;

int nbTests = 0;
int nbReussis = 0;

void verifier(int condition, const char *nom) {
    nbTests++;
    if (condition) {
        nbReussis++;
        printf("[OK] %s\n", nom);
    } else {
        printf("[ECHEC] %s\n", nom);
    }
}

int estBissextile(int a) {
    return a % 4 == 0;
}

int joursDansMois(int m, int a) {
    if (m == 2) return estBissextile(a) ? 29 : 28;
    if (m == 4 || m == 6 || m == 9) return 30;
    return 31;
}

int estDateValide(Date d) {
    if (d.mois < 1 || d.mois > 12) return 0;
    if (d.annee < 2000 || d.annee > 2100) return 0;
    return d.jour >= 1 && d.jour <= joursDansMois(d.mois, d.annee);
}

int main(void) {
    verifier(estDateValide((Date){12, 3, 2026}), "12/03/2026 valide");
    verifier(!estDateValide((Date){29, 2, 2026}), "29/02/2026 invalide");
    verifier(estDateValide((Date){29, 2, 2024}), "29/02/2024 valide");
    verifier(estDateValide((Date){29, 2, 2000}), "29/02/2000 valide");
    verifier(!estDateValide((Date){29, 2, 2100}), "29/02/2100 invalide");
    verifier(!estDateValide((Date){31, 4, 2026}), "31/04/2026 invalide");
    verifier(!estDateValide((Date){31, 11, 2026}), "31/11/2026 invalide");
    verifier(!estDateValide((Date){1, 13, 2026}), "01/13/2026 invalide");
    printf("Bilan : %d/%d tests reussis\n", nbReussis, nbTests);
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>

typedef struct { int jour; int mois; int annee; } Date;

int nbTests = 0;
int nbReussis = 0;

void verifier(int condition, const char *nom) {
    nbTests++;
    if (condition) {
        nbReussis++;
        printf("[OK] %s\n", nom);
    } else {
        printf("[ECHEC] %s\n", nom);
    }
}

int estBissextile(int a) {
    return (a % 4 == 0 && a % 100 != 0) || a % 400 == 0;
}

int joursDansMois(int m, int a) {
    if (m == 2) return estBissextile(a) ? 29 : 28;
    if (m == 4 || m == 6 || m == 9 || m == 11) return 30;
    return 31;
}

int estDateValide(Date d) {
    if (d.mois < 1 || d.mois > 12) return 0;
    if (d.annee < 2000 || d.annee > 2100) return 0;
    return d.jour >= 1 && d.jour <= joursDansMois(d.mois, d.annee);
}

int main(void) {
    verifier(estDateValide((Date){12, 3, 2026}), "12/03/2026 valide");
    verifier(!estDateValide((Date){29, 2, 2026}), "29/02/2026 invalide");
    verifier(estDateValide((Date){29, 2, 2024}), "29/02/2024 valide");
    verifier(estDateValide((Date){29, 2, 2000}), "29/02/2000 valide");
    verifier(!estDateValide((Date){29, 2, 2100}), "29/02/2100 invalide");
    verifier(!estDateValide((Date){31, 4, 2026}), "31/04/2026 invalide");
    verifier(!estDateValide((Date){31, 11, 2026}), "31/11/2026 invalide");
    verifier(!estDateValide((Date){1, 13, 2026}), "01/13/2026 invalide");
    printf("Bilan : %d/%d tests reussis\n", nbReussis, nbTests);
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Suite complète au vert', category: 'normal', stdin: '', expectedStdout: '[OK] 12/03/2026 valide\n[OK] 29/02/2026 invalide\n[OK] 29/02/2024 valide\n[OK] 29/02/2000 valide\n[OK] 29/02/2100 invalide\n[OK] 31/04/2026 invalide\n[OK] 31/11/2026 invalide\n[OK] 01/13/2026 invalide\nBilan : 8/8 tests reussis', explanation: 'Les 8 cas limites de la validation de date.' },
        ],
        hints: [
          'Deux tests échouent : 29/02/2100 et 31/11/2026.',
          '2100 est divisible par 4… et par 100 sans l’être par 400.',
          'Novembre a 30 jours.',
        ],
        detailedExplanation: 'La règle bissextile complète est (a % 4 == 0 && a % 100 != 0) || a % 400 == 0, et novembre (11) manquait parmi les mois de 30 jours. Remarquez que 29/02/2000 passait déjà avec la version fausse (2000 est divisible par 4) : seul le test 2100 distingue la règle simplifiée de la vraie. C’est pourquoi les années 2000 et 2100, bornes de l’intervalle du sujet, sont des tests indispensables.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE D04 — REPÉRER LES ERREURS DANS LE CODE
  // ==========================================================================
  {
    id: 'D04',
    trackId: 'defi',
    number: 4,
    title: 'Repérer les erreurs dans le code',
    subtitle: 'Une méthode, un catalogue des bugs C les plus fréquents dans ShopFlow, et les outils pour les traquer (avertissements, traces, assert, gdb, valgrind).',
    estimatedMinutes: 90,
    prerequisites: ['B14', 'B15', 'C10', 'D03'],
    relatedChapters: ['B14', 'B15', 'D01', 'D02', 'D03'],
    coreConcepts: ['méthode de débogage', 'familles d’erreurs', 'traces sur stderr', 'assert et invariants', 'gdb', 'valgrind', 'erreurs classiques du C'],
    successCriteria: [
      'Classer une erreur (syntaxe, compilation, liens, exécution, logique, mémoire) et choisir l’outil adapté',
      'Appliquer une méthode reproductible : lire, reproduire, localiser, comprendre, corriger, vérifier',
      'Corriger des fonctions de ShopFlow qui contiennent plusieurs bugs simultanés',
    ],
    lesson: {
      objectives: [
        'Reconnaître les 6 familles d’erreurs et les symptômes de chacune',
        'Appliquer la méthode en 6 étapes plutôt que modifier le code au hasard',
        'Instrumenter un programme avec des traces sur stderr et des assert d’invariants',
        'Lire un rapport valgrind et utiliser les commandes de base de gdb',
        'Repérer à la lecture les 12 bugs les plus fréquents du projet',
      ],
      intuition: `Un bug se cache rarement là où on le cherche. Modifier le code « pour voir » ajoute souvent un deuxième bug au premier. Il faut une **méthode**, comme un médecin face à des symptômes :
1. **Lire** le symptôme exact (le premier message du compilateur, la sortie fausse, la ligne du crash) ;
2. **Reproduire** avec la plus petite entrée possible ;
3. **Localiser** : où le programme commence-t-il à se tromper ? (traces, assert, gdb, table de trace) ;
4. **Comprendre** la cause, pas seulement l’endroit ;
5. **Corriger** minimalement ;
6. **Vérifier** avec un test… et garder ce test (D03).

Certaines erreurs se voient **avant** d’exécuter : le compilateur refuse (syntaxe, types) ou avertit (-Wall -Wextra : = au lieu de ==, variable non initialisée). D’autres n’apparaissent qu’à l’exécution : crash (pointeur NULL, débordement), ou pire, un résultat **faux sans crash** (erreur logique : remise mal calculée, stock réintégré deux fois). Ce sont les plus dangereuses en soutenance, car rien ne les signale : seuls des tests et une relecture attentive les trouvent.`,
      formalDefinition: `- **Familles d’erreurs et outils** :
    syntaxe        expected ';' before '}'              → lire la ligne indiquée ET la précédente
    compilation    incompatible types, implicit decl.   → prototypes, includes, types
    liens          undefined reference / multiple def.  → Makefile, définitions (D03)
    exécution      Segmentation fault, abort            → gdb (bt), valgrind, assert
    mémoire        fuite, double free, use-after-free   → valgrind --leak-check=full
    logique        résultat faux, aucun message         → tests aux bornes, traces, table de trace
- **Traces** : fprintf(stderr, "DEBUG brut=%.2f\\n", brut); — stderr n’est pas mélangé à la sortie testée et n’est pas mis en tampon.
- **assert(condition)** : arrête le programme avec fichier et ligne si l’invariant est faux ; désactivé par -DNDEBUG. Pour des invariants (nb ≤ capacite), jamais pour valider une saisie utilisateur.
- **gdb** (compiler avec -g) : gdb ./shopflow, puis break calculerCommande, run, next, step, print c->montantBrutHT, bt (pile d’appels au moment du crash), continue, quit.
- **valgrind** : « Invalid read/write of size N » (accès hors bloc ou après free), « Conditional jump depends on uninitialised value » (variable non initialisée), « definitely lost » (fuite), « Invalid free » (double free). Chaque message donne la pile de l’accès fautif ET de l’allocation/libération du bloc.
- **Relecture ciblée** : chaque boucle (bornes < / <=), chaque comparaison (= / ==, strcmp == 0), chaque division (entière ?), chaque malloc/realloc (NULL testé, sizeof, free), chaque switch (break), chaque fonction non void (return sur tous les chemins).`,
      analogy: {
        title: 'L’enquête policière',
        content: `On ne trouve pas un coupable en arrêtant les passants au hasard. L’enquêteur relève les faits (le message exact), reconstitue la scène (reproduire), interroge les témoins (traces, gdb), vérifie les alibis (assert : « à cette ligne, nb devait être ≤ capacité »), puis confond le coupable (la cause) — et il archive le dossier (le test de non-régression) pour que l’affaire ne se reproduise pas.`,
      },
      vocabulary: [
        { fr: 'Débogage', en: 'Debugging', definition: 'Recherche méthodique et correction des défauts d’un programme.' },
        { fr: 'Cas minimal reproductible', en: 'Minimal reproducible example', definition: 'Plus petite entrée qui déclenche encore le bug.' },
        { fr: 'Trace', en: 'Trace / log', definition: 'Message affiché à un point du programme pour suivre son exécution.' },
        { fr: 'Invariant', en: 'Invariant', definition: 'Condition qui doit toujours être vraie à un point donné (vérifiée par assert).' },
        { fr: 'Point d’arrêt', en: 'Breakpoint', definition: 'Ligne où le débogueur suspend l’exécution pour inspecter les variables.' },
        { fr: 'Pile d’appels', en: 'Backtrace (bt)', definition: 'Liste des fonctions en cours d’exécution au moment du crash.' },
        { fr: 'Régression', en: 'Regression', definition: 'Bug réintroduit par une modification ; détecté par les tests rejoués.' },
      ],
      deepDive: [
        {
          title: 'Les 12 bugs les plus fréquents dans ShopFlow',
          content: `1. = au lieu de == dans un if (if (c->statut = ANNULEE)).
2. Comparer des chaînes avec == au lieu de strcmp(...) == 0.
3. Division entière : brut * (taux / 100) avec taux entier vaut toujours 0.
4. Bornes de boucle : i <= nb (une case de trop) ou i < nb - 1 (une case oubliée).
5. break oublié dans un switch de menu : le cas suivant s’exécute aussi.
6. Accumulateur non remis à zéro : calculerCommande rappelée → le brut double.
7. scanf sans & ou sans test de sa valeur de retour (boucle infinie sur une lettre).
8. realloc affecté directement au pointeur, ou pointeur conservé à travers un realloc.
9. Libération incomplète ou dans le mauvais ordre (lignes avant commandes).
10. Paliers testés dans le mauvais ordre ou avec > au lieu de >=.
11. Transitions de statut non contrôlées (double annulation → stock réintégré deux fois).
12. Unicité vérifiée seulement sur les éléments actifs.`,
        },
        {
          title: 'Tracer proprement avec stderr',
          content: `Les traces de débogage vont sur stderr, pas sur stdout : elles ne faussent pas une sortie comparée par diff ou par les tests automatiques de la plateforme, et elles s’affichent immédiatement. Une macro permet de les supprimer d’un coup en fin de mise au point :`,
          code: `#ifdef DEBUG
#define TRACE(...) fprintf(stderr, __VA_ARGS__)
#else
#define TRACE(...)
#endif

/* compilation avec traces : gcc -DDEBUG ... */
TRACE("ligne %d : sousTotal=%.2f brut=%.2f\\n", i, l->sousTotalHT, c->montantBrutHT);`,
        },
        {
          title: 'assert : vérifier ses hypothèses',
          content: `Écrivez une fonction verifierCommande qui vérifie tous les invariants d’une commande et appelez-la après chaque modification pendant le développement. Le jour où un invariant casse, le programme s’arrête à l’endroit exact du problème au lieu de produire un résultat faux trois écrans plus loin.`,
          code: `#include <assert.h>

void verifierCommande(const Commande *c) {
    assert(c->nbLignes >= 0 && c->nbLignes <= c->capaciteLignes);
    assert((c->lignes == NULL) == (c->capaciteLignes == 0));
    assert(c->montantRemise <= c->montantBrutHT + 0.005f);
    assert(c->fraisPort == 0.0f || c->montantBrutHT < 60.0f);
}`,
        },
        {
          title: 'Une session gdb sur un crash',
          content: `Le programme plante avec « Segmentation fault » après la création d’une commande. Compilez avec -g, puis :`,
          code: `$ gdb ./shopflow
(gdb) run < tests/creation.txt
Program received signal SIGSEGV, Segmentation fault.
0x... in ajouterLigne (c=0x5555..., p=0x0, quantite=2) at commande.c:57
57          c->lignes[c->nbLignes].prixUnitaireHT = p->prixUnitaireHT;
(gdb) bt
#0  ajouterLigne (...) at commande.c:57
#1  creerCommande (...) at commande.c:112
#2  main () at main.c:40
(gdb) print p
$1 = (const Produit *) 0x0
/* -> trouverProduit a renvoye NULL (reference inconnue)
      et ajouterLigne ne l'a pas teste. */`,
        },
        {
          title: 'Lire un rapport valgrind',
          content: `    Invalid read of size 4
       at 0x...: crediterPoints (client.c:88)
     Address 0x4a8c048 is 8 bytes inside a block of size 128 free'd
       at 0x...: realloc
       by 0x...: ajouterClient (client.c:41)
     Block was alloc'd at
       at 0x...: malloc (initialisation.c:30)
Trois informations : OÙ l’accès fautif a lieu (client.c:88), QUEL bloc est concerné (128 octets, libéré par un realloc dans ajouterClient), et OÙ il avait été alloué. Diagnostic : crediterPoints utilise un pointeur vers un client obtenu avant un ajout qui a déplacé le tableau (voir D02).`,
        },
        {
          title: 'Diviser pour régner',
          content: `Quand le résultat final est faux (TTC incorrect) mais que vous ne savez pas où : affichez (ou vérifiez avec assert) les valeurs **au milieu** du calcul. Si le brut est juste, le bug est après ; s’il est faux, il est avant. En 3 ou 4 coupures, on isole la ligne fautive même dans une longue fonction. La même idée s’applique aux données : si le scénario de 40 lignes échoue, essayez avec la première moitié.`,
        },
      ],
      simpleExample: cExample(
        'Localiser un bug avec des traces sur stderr',
        'Le brut affiché est juste ; les traces de calcul sont écrites sur stderr (onglet Sortie d’erreur de l’inspecteur) et ne polluent pas la sortie testée.',
        String.raw`#include <stdio.h>

typedef struct { int quantite; float prixUnitaireHT; } LigneCommande;

float calculerBrut(const LigneCommande lignes[], int nb) {
    float brut = 0.0f;
    for (int i = 0; i < nb; i++) {
        float sousTotal = lignes[i].quantite * lignes[i].prixUnitaireHT;
        brut += sousTotal;
        fprintf(stderr, "TRACE i=%d sousTotal=%.2f brut=%.2f\n", i, sousTotal, brut);
    }
    return brut;
}

int main(void) {
    LigneCommande lignes[3] = {{2, 79.90f}, {1, 24.50f}, {3, 9.90f}};
    printf("Brut HT : %.2f\n", calculerBrut(lignes, 3));
    return 0;
}`,
        `Brut HT : 214.00`,
        [
          ['for (int i = 0; i < nb; i++) {', 'Point de contrôle n° 1 : les bornes. < nb parcourt exactement les nb lignes.'],
          ['brut += sousTotal;', 'L’accumulateur a été initialisé à 0 juste avant la boucle (bug n° 6 évité).'],
          ['fprintf(stderr, "TRACE i=%d sousTotal=%.2f brut=%.2f\\n", i, sousTotal, brut);', 'Trace à chaque tour : en cas d’erreur, on voit à quelle ligne le cumul diverge. Sur stderr, elle n’apparaît pas dans la sortie comparée.'],
          ['printf("Brut HT : %.2f\\n", calculerBrut(lignes, 3));', 'La sortie standard ne contient que le résultat : 159.80 + 24.50 + 29.70 = 214.00.'],
        ]
      ),
      intermediateExample: cExample(
        'Des invariants vérifiés par assert pendant le développement',
        'verifierCommande est appelée après chaque opération ; ici toutes les assertions tiennent et le programme se termine normalement.',
        String.raw`#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

typedef struct { int quantite; } LigneCommande;
typedef struct { int nbLignes; int capaciteLignes; LigneCommande *lignes; int statut; } Commande;

#define EN_COURS 0
#define ANNULEE 3

void verifierCommande(const Commande *c) {
    assert(c->nbLignes >= 0);
    assert(c->nbLignes <= c->capaciteLignes);
    assert((c->lignes == NULL) == (c->capaciteLignes == 0));
    assert(c->statut == EN_COURS || c->statut == ANNULEE);
}

int ajouterLigne(Commande *c, int qte) {
    if (c->statut != EN_COURS) return 0;
    if (c->nbLignes == c->capaciteLignes) {
        int cap = (c->capaciteLignes == 0) ? 2 : 2 * c->capaciteLignes;
        LigneCommande *tmp = realloc(c->lignes, cap * sizeof(LigneCommande));
        if (tmp == NULL) return 0;
        c->lignes = tmp;
        c->capaciteLignes = cap;
    }
    c->lignes[c->nbLignes].quantite = qte;
    c->nbLignes++;
    verifierCommande(c);
    return 1;
}

int main(void) {
    Commande c = {0, 0, NULL, EN_COURS};
    verifierCommande(&c);
    for (int q = 1; q <= 3; q++) ajouterLigne(&c, q);
    c.statut = ANNULEE;
    verifierCommande(&c);
    printf("Ajout apres annulation : %s\n", ajouterLigne(&c, 9) ? "accepte" : "refuse");
    printf("%d lignes, capacite %d : invariants respectes\n", c.nbLignes, c.capaciteLignes);
    free(c.lignes);
    return 0;
}`,
        `Ajout apres annulation : refuse
3 lignes, capacite 4 : invariants respectes`,
        [
          ['void verifierCommande(const Commande *c) {', 'Regroupe toutes les hypothèses sur une commande valide.'],
          ['assert((c->lignes == NULL) == (c->capaciteLignes == 0));', 'Invariant : pas de bloc ⇔ capacité nulle. Un free sans remise à 0 de la capacité le casserait immédiatement.'],
          ['if (c->statut != EN_COURS) return 0;', 'Contrôle métier (et non assert) : une tentative d’ajout sur une commande annulée est une situation normale, à refuser proprement.'],
          ['verifierCommande(c);', 'Appel après chaque modification : un bug est intercepté à l’endroit où il se produit.'],
          ['printf("%d lignes, capacite %d : invariants respectes\\n", c.nbLignes, c.capaciteLignes);', 'Si une assertion avait échoué, le programme se serait arrêté avec la ligne fautive (onglet Diagnostics).'],
        ]
      ),
      commonMistakes: [
        {
          title: 'Corriger le symptôme au lieu de la cause',
          wrongCode: `calculerCommande(&c);
calculerCommande(&c);   /* rappel apres ajout de ligne */
c.montantBrutHT /= 2;   /* "corrige" le doublement */`,
          rightCode: `void calculerCommande(Commande *c) {
    c->montantBrutHT = 0.0f;   /* remise a zero : la vraie cause */
    for (...) c->montantBrutHT += ...;
}`,
          explanation: 'Le doublement vient de l’accumulateur non remis à zéro. Le « correctif » /2 casse dès qu’on rappelle la fonction une troisième fois.',
          errorType: 'logique',
        },
        {
          title: 'Utiliser assert pour valider une saisie',
          wrongCode: `scanf("%d", &qte);
assert(qte >= 1);   /* l'utilisateur tape 0 : le programme s'arrete */`,
          rightCode: `if (!convertirQuantite(saisie, &qte)) {
    printf("Quantite invalide, recommencez\\n");
}`,
          explanation: 'assert est réservé aux erreurs de PROGRAMMATION (invariants). Une saisie invalide est un cas normal qu’on doit gérer, et assert disparaît avec -DNDEBUG.',
          errorType: 'logique',
        },
        {
          title: 'Ne lire que le dernier message du compilateur',
          wrongCode: `/* 23 erreurs affichees ; on regarde la derniere :
   error: expected declaration or statement at end of input */`,
          rightCode: `/* On lit la PREMIERE :
   commande.c:41: error: expected ';' before 'return'
   -> un point-virgule manque ligne 40. Les 22 autres
      erreurs disparaissent apres la correction. */`,
          explanation: 'Une seule faute de syntaxe désoriente l’analyseur pour tout le reste du fichier : les erreurs suivantes sont souvent des conséquences.',
          errorType: 'syntaxe',
        },
      ],
      summary: [
        'Méthode : lire → reproduire → localiser → comprendre → corriger → vérifier (et garder le test).',
        'Compiler avec -Wall -Wextra -g ; corriger la PREMIÈRE erreur d’abord.',
        'Traces sur stderr ; assert pour les invariants, jamais pour les saisies.',
        'Crash : gdb + bt ; mémoire : valgrind (où, quel bloc, alloué/libéré où).',
        'Erreur logique : tests aux bornes, traces au milieu du calcul (diviser pour régner).',
        'Relire systématiquement boucles, comparaisons, divisions, allocations, switch et return.',
      ],
      comprehensionQuestions: [
        {
          id: 'D04_Q1',
          question: 'Le programme affiche un TTC faux, sans crash ni message. De quelle famille d’erreur s’agit-il, et quel outil utiliser en premier ?',
          options: [
            'Erreur de liens ; relire le Makefile',
            'Erreur logique ; des tests aux bornes et des traces des valeurs intermédiaires',
            'Erreur mémoire ; valgrind obligatoirement',
            'Erreur de syntaxe ; recompiler',
          ],
          correctIndex: 1,
          explanation: 'Aucun outil automatique ne signale une formule fausse : il faut comparer à un résultat attendu et suivre les valeurs intermédiaires.',
        },
        {
          id: 'D04_Q2',
          question: 'Pourquoi écrire les traces de débogage sur stderr plutôt que sur stdout ?',
          options: [
            'stderr est plus rapide à taper',
            'Elles ne se mélangent pas à la sortie normale comparée par les tests et s’affichent sans tampon',
            'printf ne fonctionne pas pendant le débogage',
            'stderr colore les messages',
          ],
          correctIndex: 1,
          explanation: 'Les tests (diff, plateforme) comparent stdout : des traces sur stderr ne les font pas échouer.',
        },
        {
          id: 'D04_Q3',
          question: 'Après un crash, quelle commande gdb affiche la suite des appels de fonctions qui a mené à la ligne fautive ?',
          options: ['print', 'next', 'bt', 'break'],
          correctIndex: 2,
          explanation: 'bt (backtrace) affiche la pile d’appels : main → creerCommande → ajouterLigne.',
        },
      ],
    },
    exercises: [
      {
        id: 'D04_E1',
        chapterId: 'D04',
        trackId: 'defi',
        title: 'Le menu qui exécute deux actions',
        difficulty: 'debutant',
        category: 'error_spot',
        testedSkill: 'break oublié dans un switch',
        prerequisites: ['D04'],
        projectLink: 'boucle principale de main.c.',
        statement: `Quand l’utilisateur choisit 1, le programme affiche le catalogue PUIS la liste des clients. Pourquoi ?

    switch (choix) {
        case 1:
            afficherCatalogue(&b);
        case 2:
            afficherClients(&b);
            break;
        case 0:
            printf("Au revoir\\n");
            break;
    }`,
        isCoreValidationExercise: true,
        options: [
          'choix vaut 2 à cause d’un scanf mal écrit',
          'Il manque break; après afficherCatalogue(&b); : l’exécution continue dans le case 2',
          'Le case 0 devrait être en premier',
          'afficherCatalogue appelle afficherClients',
        ],
        correctOptionIndex: 1,
        errorClassificationTarget: 'logique',
        hints: [
          'Un case est une simple étiquette : où s’arrête l’exécution ?',
          'Que se passe-t-il quand on atteint la fin du code du case 1 ?',
          'Seul break (ou return) fait sortir du switch.',
        ],
        detailedExplanation: 'Sans break, l’exécution « tombe » dans le case suivant (fall-through). C’est une erreur logique : aucun message à la compilation sans l’option -Wimplicit-fallthrough (incluse dans -Wextra avec gcc récent).',
      },
      {
        id: 'D04_E2',
        chapterId: 'D04',
        trackId: 'defi',
        title: 'La remise toujours nulle',
        difficulty: 'intermediaire',
        category: 'error_spot',
        testedSkill: 'Division entière',
        prerequisites: ['D04'],
        projectLink: 'calculerCommande du module commande.',
        statement: `Toutes les commandes ont une remise de 0,00 €, même celles de 700 €. Où est l’erreur ?

    int taux = tauxRemise(c->montantBrutHT);        /* 0, 5, 10 ou 15 */
    c->montantRemise = c->montantBrutHT * (taux / 100);
    c->montantHT = c->montantBrutHT - c->montantRemise;`,
        isCoreValidationExercise: true,
        options: [
          'tauxRemise renvoie toujours 0',
          'taux / 100 est une division entière : 15 / 100 vaut 0 ; il faut c->montantBrutHT * taux / 100.0f',
          'Il faut utiliser montantHT au lieu de montantBrutHT',
          'La soustraction est inversée',
        ],
        correctOptionIndex: 1,
        errorClassificationTarget: 'logique',
        hints: [
          'Quel est le type de taux, et celui de 100 ?',
          'Calculez 15 / 100 en C entre deux int.',
          'Les parenthèses forcent la division entière AVANT la multiplication par un float.',
        ],
        detailedExplanation: 'Entre deux int, 15 / 100 vaut 0 (troncature). En écrivant c->montantBrutHT * taux / 100.0f, la multiplication par un float a lieu d’abord et la division est réelle. Le linter pédagogique de la plateforme signale ce piège (« division entière implicite ») ; gcc, lui, ne dit rien.',
      },
      {
        id: 'D04_E3',
        chapterId: 'D04',
        trackId: 'defi',
        title: 'Prédire l’effet de trois bugs silencieux',
        difficulty: 'intermediaire',
        category: 'prediction',
        testedSkill: 'Dérouler un code qui compile mais se trompe',
        prerequisites: ['D04'],
        statement: 'Ce programme compile (avec des avertissements que l’on aurait dû lire !). Quelle est sa sortie exacte ?',
        isCoreValidationExercise: true,
        codeSnippet: String.raw`#include <stdio.h>

int main(void) {
    int stocks[4] = {5, 0, 12, 3};
    int nb = 4;
    int enAlerte = 0;
    for (int i = 1; i < nb; i++) {
        if (stocks[i] <= 3) {
            enAlerte++;
        }
    }
    int stock = stocks[0];
    if (stock = 0) {
        printf("Rupture\n");
    }
    int taux = 10;
    float remise = 200.0f * (taux / 100);
    printf("%d %d %.2f\n", enAlerte, stock, remise);
    return 0;
}`,
        expectedOutputAnswer: '2 0 0.00',
        hints: [
          'La boucle commence à 1 : stocks[0] n’est pas examiné.',
          'stock = 0 est une affectation : sa valeur est 0, donc faux… et stock vaut maintenant 0.',
          'taux / 100 entre deux int vaut 0.',
        ],
        detailedExplanation: 'enAlerte : indices 1 à 3 → 0 et 3 sont ≤ 3 → 2 (stocks[0] = 5 est ignoré, mais il n’était pas en alerte : ce bug d’indice ne se voit pas ici !). if (stock = 0) affecte 0, la condition est fausse : « Rupture » ne s’affiche pas et stock vaut 0. remise = 200 × 0 = 0.00. Trois bugs, une sortie plausible : c’est pourquoi on teste chaque cas séparément.',
      },
      {
        id: 'D04_E4',
        chapterId: 'D04',
        trackId: 'defi',
        title: 'Corriger calculerCommande (3 bugs)',
        difficulty: 'avance',
        category: 'bugfix',
        testedSkill: 'Accumulateur, base de la TVA, seuil du port',
        prerequisites: ['C06', 'D04'],
        projectLink: 'calculerCommande, appelée après chaque ajout ou suppression de ligne.',
        statement: `Le programme lit n lignes « quantite prix », calcule la commande, ajoute une ligne « 1 10.00 », puis recalcule. calculerCommande contient **3 bugs** :
1. le brut n’est pas remis à zéro (le 2e calcul cumule) ;
2. la TVA est calculée sur le brut au lieu du HT après remise ;
3. le seuil du port est testé sur le HT au lieu du brut.
Corrigez-les.`,
        isCoreValidationExercise: true,
        guidedSteps: [
          'Exécutez avec l’entrée de test et comparez les deux lignes affichées avec un calcul à la main.',
          'Le 2e calcul est-il cohérent avec le 1er + 10 € ? Sinon, cherchez l’accumulateur.',
          'Relisez les règles du sujet : TVA sur le HT après remise, port offert dès 60 € HT BRUT.',
        ],
        starterCode: String.raw`#include <stdio.h>

typedef struct { int quantite; float prixUnitaireHT; } LigneCommande;
typedef struct {
    int nbLignes;
    LigneCommande lignes[10];
    float montantBrutHT, montantRemise, montantHT, montantTVA, fraisPort, montantTTC;
} Commande;

int tauxRemise(float brut) {
    if (brut >= 600.0f) return 15;
    if (brut >= 300.0f) return 10;
    if (brut >= 100.0f) return 5;
    return 0;
}

void calculerCommande(Commande *c) {
    for (int i = 0; i < c->nbLignes; i++) {
        c->montantBrutHT += c->lignes[i].quantite * c->lignes[i].prixUnitaireHT;
    }
    c->montantRemise = c->montantBrutHT * tauxRemise(c->montantBrutHT) / 100.0f;
    c->montantHT = c->montantBrutHT - c->montantRemise;
    c->montantTVA = c->montantBrutHT * 0.20f;
    c->fraisPort = (c->montantHT >= 60.0f) ? 0.0f : 5.90f;
    c->montantTTC = c->montantHT + c->montantTVA + c->fraisPort;
}

void afficher(const Commande *c) {
    printf("brut %.2f remise %.2f HT %.2f TVA %.2f port %.2f TTC %.2f\n",
           c->montantBrutHT, c->montantRemise, c->montantHT, c->montantTVA, c->fraisPort, c->montantTTC);
}

int main(void) {
    Commande c = {0};
    scanf("%d", &c.nbLignes);
    for (int i = 0; i < c.nbLignes; i++) {
        scanf("%d %f", &c.lignes[i].quantite, &c.lignes[i].prixUnitaireHT);
    }
    calculerCommande(&c);
    afficher(&c);
    c.lignes[c.nbLignes].quantite = 1;
    c.lignes[c.nbLignes].prixUnitaireHT = 10.0f;
    c.nbLignes++;
    calculerCommande(&c);
    afficher(&c);
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>

typedef struct { int quantite; float prixUnitaireHT; } LigneCommande;
typedef struct {
    int nbLignes;
    LigneCommande lignes[10];
    float montantBrutHT, montantRemise, montantHT, montantTVA, fraisPort, montantTTC;
} Commande;

int tauxRemise(float brut) {
    if (brut >= 600.0f) return 15;
    if (brut >= 300.0f) return 10;
    if (brut >= 100.0f) return 5;
    return 0;
}

void calculerCommande(Commande *c) {
    c->montantBrutHT = 0.0f;
    for (int i = 0; i < c->nbLignes; i++) {
        c->montantBrutHT += c->lignes[i].quantite * c->lignes[i].prixUnitaireHT;
    }
    c->montantRemise = c->montantBrutHT * tauxRemise(c->montantBrutHT) / 100.0f;
    c->montantHT = c->montantBrutHT - c->montantRemise;
    c->montantTVA = c->montantHT * 0.20f;
    c->fraisPort = (c->montantBrutHT >= 60.0f) ? 0.0f : 5.90f;
    c->montantTTC = c->montantHT + c->montantTVA + c->fraisPort;
}

void afficher(const Commande *c) {
    printf("brut %.2f remise %.2f HT %.2f TVA %.2f port %.2f TTC %.2f\n",
           c->montantBrutHT, c->montantRemise, c->montantHT, c->montantTVA, c->fraisPort, c->montantTTC);
}

int main(void) {
    Commande c = {0};
    scanf("%d", &c.nbLignes);
    for (int i = 0; i < c.nbLignes; i++) {
        scanf("%d %f", &c.lignes[i].quantite, &c.lignes[i].prixUnitaireHT);
    }
    calculerCommande(&c);
    afficher(&c);
    c.lignes[c.nbLignes].quantite = 1;
    c.lignes[c.nbLignes].prixUnitaireHT = 10.0f;
    c.nbLignes++;
    calculerCommande(&c);
    afficher(&c);
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Passage au palier 5 % après ajout', category: 'normal', stdin: '2\n2 40.00\n1 15.00\n', expectedStdout: 'brut 95.00 remise 0.00 HT 95.00 TVA 19.00 port 0.00 TTC 114.00\nbrut 105.00 remise 5.25 HT 99.75 TVA 19.95 port 0.00 TTC 119.70', explanation: 'Le 2e calcul part de zéro : 95 + 10 = 105.' },
          { id: 't2', label: 'Port : seuil sur le brut', category: 'limite', stdin: '1\n6 10.00\n', expectedStdout: 'brut 60.00 remise 0.00 HT 60.00 TVA 12.00 port 0.00 TTC 72.00\nbrut 70.00 remise 0.00 HT 70.00 TVA 14.00 port 0.00 TTC 84.00', explanation: 'Brut 60 : port offert.' },
          { id: 't3', label: 'TVA sur le HT après remise', category: 'limite', stdin: '1\n1 300.00\n', expectedStdout: 'brut 300.00 remise 30.00 HT 270.00 TVA 54.00 port 0.00 TTC 324.00\nbrut 310.00 remise 31.00 HT 279.00 TVA 55.80 port 0.00 TTC 334.80', explanation: 'TVA calculée sur le HT (270), pas sur le brut (300).' },
          { id: 't4', label: 'Petit panier', category: 'normal', stdin: '1\n2 20.00\n', expectedStdout: 'brut 40.00 remise 0.00 HT 40.00 TVA 8.00 port 5.90 TTC 53.90\nbrut 50.00 remise 0.00 HT 50.00 TVA 10.00 port 5.90 TTC 65.90', explanation: 'Port facturé sous 60 € de brut.' },
        ],
        hints: [
          'Ajoutez c->montantBrutHT = 0.0f; avant la boucle.',
          'c->montantTVA = c->montantHT * 0.20f;',
          'c->fraisPort = (c->montantBrutHT >= 60.0f) ? 0.0f : 5.90f;',
        ],
        detailedExplanation: 'Le bug d’accumulateur n’apparaît qu’au 2e appel : un seul calcul par commande l’aurait masqué — d’où le scénario « calculer, ajouter une ligne, recalculer ». Les deux autres bugs sont des écarts aux règles du sujet : ils ne se voient qu’avec des cas où HT ≠ brut (remise non nulle), ce que fournit le test t3.',
      },
      {
        id: 'D04_E5',
        chapterId: 'D04',
        trackId: 'defi',
        title: 'Corriger l’ajout de clients (3 bugs)',
        difficulty: 'avance',
        category: 'bugfix',
        testedSkill: 'strcmp, unicité incluant les inactifs, compteur d’identifiants',
        prerequisites: ['C08', 'D01', 'D04'],
        projectLink: 'ajouterClient du module client (règles 8 et 9 du sujet).',
        statement: `Le programme lit des emails (un par ligne) et tente de créer un client pour chacun. Le répertoire contient déjà le client n° 1 « j.bernard@mail.fr », **désactivé**. Pour chaque email : « Client N cree » ou « REFUS email deja utilise ». ajouterClient contient **3 bugs** :
1. les emails sont comparés avec == ;
2. le contrôle d’unicité ignore les clients désactivés ;
3. l’identifiant n’est pas pris dans le compteur idClientSuivant (et le compteur n’avance pas).
Corrigez-les.`,
        isCoreValidationExercise: true,
        guidedSteps: [
          'Testez avec deux fois le même email : le 2e est-il refusé ?',
          'Testez avec j.bernard@mail.fr : il doit être refusé même si l’ancien client est désactivé.',
          'Vérifiez les numéros attribués : ils doivent valoir 2, 3, 4… et ne jamais se répéter.',
        ],
        starterCode: String.raw`#include <stdio.h>
#include <string.h>

typedef struct {
    int idClient;
    char email[80];
    int actif;
} Client;

typedef struct {
    Client clients[20];
    int nbClients;
    int idClientSuivant;
} Boutique;

int ajouterClient(Boutique *b, const char *email) {
    for (int i = 0; i < b->nbClients; i++) {
        if (b->clients[i].actif && b->clients[i].email == email) {
            return 0;
        }
    }
    Client *c = &b->clients[b->nbClients];
    c->idClient = b->nbClients + 1;
    strcpy(c->email, email);
    c->actif = 1;
    b->nbClients++;
    return c->idClient;
}

int main(void) {
    Boutique b;
    b.nbClients = 1;
    b.idClientSuivant = 2;
    b.clients[0].idClient = 1;
    strcpy(b.clients[0].email, "j.bernard@mail.fr");
    b.clients[0].actif = 0;
    char email[80];
    while (fgets(email, sizeof(email), stdin) != NULL) {
        email[strcspn(email, "\n")] = '\0';
        int id = ajouterClient(&b, email);
        if (id > 0) {
            printf("Client %d cree\n", id);
        } else {
            printf("REFUS email deja utilise\n");
        }
    }
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <string.h>

typedef struct {
    int idClient;
    char email[80];
    int actif;
} Client;

typedef struct {
    Client clients[20];
    int nbClients;
    int idClientSuivant;
} Boutique;

int ajouterClient(Boutique *b, const char *email) {
    for (int i = 0; i < b->nbClients; i++) {
        if (strcmp(b->clients[i].email, email) == 0) {
            return 0;
        }
    }
    Client *c = &b->clients[b->nbClients];
    c->idClient = b->idClientSuivant;
    b->idClientSuivant++;
    strcpy(c->email, email);
    c->actif = 1;
    b->nbClients++;
    return c->idClient;
}

int main(void) {
    Boutique b;
    b.nbClients = 1;
    b.idClientSuivant = 2;
    b.clients[0].idClient = 1;
    strcpy(b.clients[0].email, "j.bernard@mail.fr");
    b.clients[0].actif = 0;
    char email[80];
    while (fgets(email, sizeof(email), stdin) != NULL) {
        email[strcspn(email, "\n")] = '\0';
        int id = ajouterClient(&b, email);
        if (id > 0) {
            printf("Client %d cree\n", id);
        } else {
            printf("REFUS email deja utilise\n");
        }
    }
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Doublon dans la saisie', category: 'normal', stdin: 'a.martin@mail.fr\nl.petit@mail.fr\na.martin@mail.fr\n', expectedStdout: 'Client 2 cree\nClient 3 cree\nREFUS email deja utilise', explanation: 'strcmp détecte le doublon.' },
          { id: 't2', label: 'Email d’un client désactivé', category: 'limite', stdin: 'j.bernard@mail.fr\nm.durand@mail.fr\n', expectedStdout: 'REFUS email deja utilise\nClient 2 cree', explanation: 'Règle 8 : l’unicité porte aussi sur les désactivés.' },
          { id: 't3', label: 'Numéros non réutilisés', category: 'normal', stdin: 'x@a.fr\nx@a.fr\ny@a.fr\n', expectedStdout: 'Client 2 cree\nREFUS email deja utilise\nClient 3 cree', explanation: 'Un refus ne consomme pas de numéro.' },
        ],
        hints: [
          'strcmp(b->clients[i].email, email) == 0',
          'Supprimez le test b->clients[i].actif dans le contrôle d’unicité.',
          'c->idClient = b->idClientSuivant++;',
        ],
        detailedExplanation: 'Avec ==, aucun doublon n’est jamais détecté (adresses différentes). Avec le filtre actif, l’email d’un client désactivé serait réutilisable. Et nbClients + 1 n’est pas un compteur fiable : il donne le même numéro qu’un client existant dès qu’on supprime physiquement un élément ou qu’on charge des données de test avec d’autres numéros. Les trois bugs passent la compilation sans avertissement.',
      },
      {
        id: 'D04_E6',
        chapterId: 'D04',
        trackId: 'defi',
        title: 'Corriger annulerCommande (3 bugs)',
        difficulty: 'synthese',
        category: 'bugfix',
        testedSkill: 'Bornes de boucle, contrôle de transition, effets de bord complets',
        prerequisites: ['C07', 'C08', 'D04'],
        projectLink: 'fonction « Annuler une commande » : réintégration du stock et retrait des points de fidélité.',
        statement: `Le programme crée une commande de 3 lignes (stock décrémenté, points crédités), puis applique les actions lues en entrée (« ANNULER » ou « EXPEDIER ») et affiche l’état après chaque action. annulerCommande contient **3 bugs** :
1. la boucle oublie la dernière ligne ;
2. aucune vérification du statut : une commande expédiée ou déjà annulée est « annulée » à nouveau ;
3. les points de fidélité de la commande ne sont pas retirés au client.
Corrigez-les (une annulation refusée affiche « Annulation refusee »).`,
        isCoreValidationExercise: true,
        guidedSteps: [
          'Testez « ANNULER » seul : les trois stocks reviennent-ils à 10, 5 et 50 ?',
          'Testez « ANNULER » deux fois : le stock ne doit pas dépasser son niveau initial.',
          'Testez « EXPEDIER » puis « ANNULER » : l’annulation doit être refusée.',
        ],
        starterCode: String.raw`#include <stdio.h>
#include <string.h>

#define EN_COURS 0
#define EXPEDIEE 1
#define ANNULEE 3

typedef struct { int indiceProduit; int quantite; } LigneCommande;
typedef struct { int statut; int nbLignes; LigneCommande lignes[5]; int points; } Commande;

int stock[3] = {10, 5, 50};
int pointsClient = 0;

int annulerCommande(Commande *c) {
    for (int i = 0; i < c->nbLignes - 1; i++) {
        stock[c->lignes[i].indiceProduit] += c->lignes[i].quantite;
    }
    c->statut = ANNULEE;
    return 1;
}

void afficher(const Commande *c) {
    const char *libelle = c->statut == EN_COURS ? "EN_COURS" : c->statut == EXPEDIEE ? "EXPEDIEE" : "ANNULEE";
    printf("%s | stocks %d %d %d | points %d\n", libelle, stock[0], stock[1], stock[2], pointsClient);
}

int main(void) {
    Commande c = {EN_COURS, 3, {{0, 2}, {1, 3}, {2, 10}}, 0};
    for (int i = 0; i < c.nbLignes; i++) {
        stock[c.lignes[i].indiceProduit] -= c.lignes[i].quantite;
    }
    c.points = 57;
    pointsClient += c.points;
    afficher(&c);
    char action[20];
    while (scanf("%19s", action) == 1) {
        if (strcmp(action, "ANNULER") == 0) {
            if (!annulerCommande(&c)) {
                printf("Annulation refusee\n");
            }
        } else if (strcmp(action, "EXPEDIER") == 0 && c.statut == EN_COURS) {
            c.statut = EXPEDIEE;
        }
        afficher(&c);
    }
    return 0;
}
`,
        referenceSolution: String.raw`#include <stdio.h>
#include <string.h>

#define EN_COURS 0
#define EXPEDIEE 1
#define ANNULEE 3

typedef struct { int indiceProduit; int quantite; } LigneCommande;
typedef struct { int statut; int nbLignes; LigneCommande lignes[5]; int points; } Commande;

int stock[3] = {10, 5, 50};
int pointsClient = 0;

int annulerCommande(Commande *c) {
    if (c->statut != EN_COURS) {
        return 0;
    }
    for (int i = 0; i < c->nbLignes; i++) {
        stock[c->lignes[i].indiceProduit] += c->lignes[i].quantite;
    }
    pointsClient -= c->points;
    c->statut = ANNULEE;
    return 1;
}

void afficher(const Commande *c) {
    const char *libelle = c->statut == EN_COURS ? "EN_COURS" : c->statut == EXPEDIEE ? "EXPEDIEE" : "ANNULEE";
    printf("%s | stocks %d %d %d | points %d\n", libelle, stock[0], stock[1], stock[2], pointsClient);
}

int main(void) {
    Commande c = {EN_COURS, 3, {{0, 2}, {1, 3}, {2, 10}}, 0};
    for (int i = 0; i < c.nbLignes; i++) {
        stock[c.lignes[i].indiceProduit] -= c.lignes[i].quantite;
    }
    c.points = 57;
    pointsClient += c.points;
    afficher(&c);
    char action[20];
    while (scanf("%19s", action) == 1) {
        if (strcmp(action, "ANNULER") == 0) {
            if (!annulerCommande(&c)) {
                printf("Annulation refusee\n");
            }
        } else if (strcmp(action, "EXPEDIER") == 0 && c.statut == EN_COURS) {
            c.statut = EXPEDIEE;
        }
        afficher(&c);
    }
    return 0;
}
`,
        testCases: [
          { id: 't1', label: 'Annulation simple', category: 'normal', stdin: 'ANNULER\n', expectedStdout: 'EN_COURS | stocks 8 2 40 | points 57\nANNULEE | stocks 10 5 50 | points 0', explanation: 'Les 3 lignes sont réintégrées et les points retirés.' },
          { id: 't2', label: 'Double annulation', category: 'limite', stdin: 'ANNULER\nANNULER\n', expectedStdout: 'EN_COURS | stocks 8 2 40 | points 57\nANNULEE | stocks 10 5 50 | points 0\nAnnulation refusee\nANNULEE | stocks 10 5 50 | points 0', explanation: 'Le stock ne doit pas être réintégré deux fois.' },
          { id: 't3', label: 'Annulation après expédition', category: 'invalide', stdin: 'EXPEDIER\nANNULER\n', expectedStdout: 'EN_COURS | stocks 8 2 40 | points 57\nEXPEDIEE | stocks 8 2 40 | points 57\nAnnulation refusee\nEXPEDIEE | stocks 8 2 40 | points 57', explanation: 'L’annulation n’est possible qu’au statut EN_COURS.' },
        ],
        hints: [
          'La boucle doit aller jusqu’à i < c->nbLignes.',
          'Au début de la fonction : if (c->statut != EN_COURS) return 0;',
          'Avant de changer le statut : pointsClient -= c->points;',
        ],
        detailedExplanation: 'Les trois bugs violent chacun une règle du sujet : cohérence du stock (dernière ligne oubliée), machine à états (annulation seulement EN_COURS) et fidélité (« points retirés en cas d’annulation »). Le test de double annulation est le plus révélateur : sans contrôle de statut, chaque appel recrée du stock à partir de rien.',
      },
      {
        id: 'D04_E7',
        chapterId: 'D04',
        trackId: 'defi',
        title: 'Interpréter un rapport valgrind',
        difficulty: 'avance',
        category: 'qcm',
        testedSkill: 'Lire les piles d’appels d’un message « Invalid write »',
        prerequisites: ['D02', 'D04'],
        statement: `valgrind affiche :

    Invalid write of size 4
       at 0x...: calculerCommande (commande.c:88)
       by 0x...: creerCommande (commande.c:131)
     Address 0x4a8c0d8 is 56 bytes inside a block of size 640 free'd
       at 0x...: realloc
       by 0x...: ajouterCommande (client.c:52)
       by 0x...: creerCommande (commande.c:120)

Dans creerCommande, quelle est la cause la plus probable ?`,
        isCoreValidationExercise: true,
        options: [
          'calculerCommande divise par zéro',
          'Un pointeur vers un élément d’un tableau (obtenu avant la ligne 120) est utilisé ligne 131, après qu’un realloc dans ajouterCommande a déplacé ce tableau',
          'Le bloc de 640 octets n’a jamais été alloué',
          'Une fuite mémoire dans crediterPoints',
        ],
        correctOptionIndex: 1,
        hints: [
          'Le bloc a été libéré par qui ?',
          'L’accès fautif a lieu APRÈS (ligne 131) la libération (ligne 120).',
          'Un realloc qui déplace le bloc libère l’ancien.',
        ],
        detailedExplanation: 'Le bloc de 640 octets est le tableau des commandes du client : il a été libéré par le realloc de ajouterCommande (ligne 120), puis calculerCommande écrit dedans (appel ligne 131). Typiquement : Commande *cmd = &cl->commandes[cl->nbCommandes - 1]; … ajouterCommande(cl, …); … calculerCommande(cmd); — cmd désigne encore l’ancien bloc. Correction : relire le pointeur après l’ajout (cmd = &cl->commandes[j];) ou travailler avec l’indice j.',
      },
    ],
  },
];
