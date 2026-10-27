// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const C_CHAPTERS_PART2: any[] = [
  // ============================================================================
  // CHAPITRE B09 — PORTÉE, VISIBILITÉ ET DURÉE DE VIE DES VARIABLES
  // ============================================================================
  {
    id: 'B09',
    trackId: 'c',
    order: 9,
    title: 'Portée, visibilité et durée de vie des variables',
    subtitle: 'Comprendre où existe une variable en mémoire : blocs { }, pile d’appels et masquage.',
    estimatedMinutes: 45,
    prerequisites: ['B08'],
    bridgeChapterIds: ['A09'],
    objectives: [
      'Identifier la portée (scope) d’une variable déclarée dans une fonction ou dans un bloc { }',
      'Comprendre la durée de vie automatique d’une variable locale sur la pile (Stack)',
      'Éviter le piège du masquage (shadowing) lorsqu’on redéclare une variable de même nom dans un sous-bloc',
      'Comprendre pourquoi les variables globales modifiables sont déconseillées en génie logiciel',
    ],
    tags: ['portée', 'scope', 'pile', 'shadowing', 'durée de vie'],
    lesson: {
      intuitiveExplanation: `En C, les accolades **\`{\`** et **\`}\`** délimitent un territoire appelé **portée** (*scope*) :
- Toute variable déclarée à l'intérieur d'un bloc \`{ ... }\` **naît** à sa déclaration et **meurt** (est détruite de la pile mémoire) dès qu'on franchit l'accolade fermante \`}\`.
- Si vous redéclarez \`int x = 99;\` à l'intérieur d'un \`if { ... }\` alors qu'un \`int x = 10;\` existait déjà autour, vous créez une **deuxième boîte temporaire** qui masque la première !`,
      formalDefinition: `- **Portée de bloc (*Block Scope*)** : une variable locale n'est visible que depuis sa ligne de déclaration jusqu'à la fin du bloc \`{ ... }\` qui la contient (par exemple le compteur \`i\` dans \`for (int i = 0; ...)\`).
- **Durée de vie automatique** : la mémoire d'une variable locale est allouée automatiquement sur la **pile (*Stack*)** à l'entrée du bloc et libérée à sa sortie.
- **Masquage (*Shadowing*)** : déclarer une variable locale portant le même nom qu'une variable d'un bloc englobant occulte la variable externe jusqu'à la fin du bloc interne.`,
      analogy: `Une variable locale est comme un **badge visiteur temporaire** valable uniquement dans une salle de réunion (\`{ ... }\`) : dès que vous sortez de la salle (\`}\`), le badge est détruit.`,
      vocabulary: [
        { french: 'Portée (Visibilité)', english: 'Scope', definition: 'Région du code source dans laquelle un identificateur est reconnu.' },
        { french: 'Durée de vie', english: 'Lifetime / Storage duration', definition: 'Période de l’exécution pendant laquelle la variable occupe effectivement une case en mémoire.' },
        { french: 'Masquage de variable', english: 'Variable shadowing', definition: 'Fait qu’une variable interne porte le même nom qu’une variable externe et la cache temporairement.' },
      ],
      simpleExample: {
        title: 'Indépendance des variables locales entre main et une fonction',
        description: 'La variable x de main et la variable x de doubler sont deux cases mémoires distinctes sur la pile.',
        language: 'c',
        code: `#include <stdio.h>

int calculer(int n) {
    int x = n * 2;
    return x;
}

int main(void) {
    int x = 10;
    int y = calculer(x);
    printf("x = %d, y = %d\\n", x, y);
    return 0;
}`,
        expectedOutput: `x = 10, y = 20`,
        lineByLine: [
          { line: 'int x = n * 2;', explanation: 'Variable locale x propre au cadre de pile de calculer (vaut 20).' },
          { line: 'printf("x = %d, y = %d\\n", x, y);', explanation: 'Le x de main n’a jamais changé et vaut toujours 10.' },
        ],
      },
      intermediateExample: {
        title: 'Piège du masquage (Shadowing) dans un sous-bloc',
        description: 'Écrire int score = 50; dans un if crée une nouvelle variable au lieu de modifier score !',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    int score = 10;
    if (score > 0) {
        // SANS le mot "int", on modifie bien la variable score existante :
        score = 50;
    }
    printf("Score = %d\\n", score);
    return 0;
}`,
        expectedOutput: `Score = 50`,
        lineByLine: [
          { line: 'score = 50;', explanation: 'Modifie la variable score déclarée plus haut. Si on avait écrit "int score = 50;", la modification aurait été perdue à la sortie du if !' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Remettre le type `int` devant une variable qu’on veut simplement modifier dans un `if` ou un `while` (`int res = 42;` au lieu de `res = 42;`).',
          whyItHappens: 'Confusion entre déclaration d’une nouvelle variable et affectation d’une variable existante.',
          howToFix: 'Ne mettez le type (`int`, `double`) qu’**une seule fois**, au moment où vous créez la variable.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B09_C1',
          question: 'Qu’affiche `int x = 5; if (x == 5) { int x = 99; } printf("%d", x);` ?',
          options: [
            '99',
            '5 (car int x = 99 a créé une variable locale au bloc if qui disparaît aussitôt)',
            '104',
            'Erreur d’exécution',
          ],
          correctIndex: 1,
          explanation: 'La redéclaration `int x = 99;` masque le `x` externe uniquement à l’intérieur des accolades du `if`.',
        },
      ],
      summary: `Une variable locale n'existe qu'entre sa déclaration et l'accolade fermante } de son bloc. Ne remettez jamais le type int devant une variable déjà déclarée lorsque vous voulez simplement modifier sa valeur.`,
    },
    exercises: [
      {
        id: 'B09_E1',
        chapterId: 'B09',
        title: 'Prédire l’effet d’un masquage de variable',
        category: 'prediction',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Qu'affiche ce programme C ?`,
        codeSnippet: `#include <stdio.h>

int main(void) {
    int total = 100;
    if (total > 50) {
        int total = 0;
        total += 10;
    }
    printf("%d\\n", total);
    return 0;
}`,
        expectedAnswer: '100',
        acceptedAnswers: ['100'],
        hints: ['Regardez attentivement `int total = 0;` à l’intérieur du `if`.'],
        explanation: `À cause du mot \`int\`, \`int total = 0;\` crée une nouvelle variable locale au bloc \`if\`. Le \`total\` de \`main\` reste intact à \`100\`.`,
      },
      {
        id: 'B09_E2',
        chapterId: 'B09',
        title: 'Corriger un bug de masquage (shadowing)',
        category: 'bugfix',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Ce programme lit un prix \`p\`. Si \`p >= 100\`, il doit appliquer une remise de 20 (donc \`finale = p - 20\`), sinon \`finale = p\`. Mais le programmeur a redéclaré \`int finale\` dans les blocs \`if/else\` ! Corrigez ce bug.`,
        starterCode: `#include <stdio.h>

int main(void) {
    int p = 0;
    scanf("%d", &p);
    int finale = 0;
    if (p >= 100) {
        int finale = p - 20;
    } else {
        int finale = p;
    }
    printf("%d\\n", finale);
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'Prix 150 -> 130', stdin: '150\n', expectedStdout: '130', isHidden: false },
          { id: 't2', label: 'Prix 60 -> 60', stdin: '60\n', expectedStdout: '60', isHidden: false },
        ],
        hints: ['Supprimez le mot-clé `int` devant `finale` à l’intérieur du `if` et du `else`.'],
        explanation: `En écrivant \`finale = p - 20;\` sans \`int\`, on modifie bien la variable \`finale\` déclarée dans \`main\`.`,
        referenceSolution: `#include <stdio.h>

int main(void) {
    int p = 0;
    scanf("%d", &p);
    int finale = 0;
    if (p >= 100) {
        finale = p - 20;
    } else {
        finale = p;
    }
    printf("%d\\n", finale);
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B10 — TABLEAUX EN C
  // ============================================================================
  {
    id: 'B10',
    trackId: 'c',
    order: 10,
    title: 'Tableaux en C (1D, passage en paramètre et bornes)',
    subtitle: 'Manipuler des tableaux contigus en mémoire et les transmettre à des fonctions avec leur taille.',
    estimatedMinutes: 55,
    prerequisites: ['B07', 'B08'],
    bridgeChapterIds: ['A10', 'A11', 'A12', 'A13'],
    objectives: [
      'Déclarer et initialiser un tableau en C : int tab[5] = {10, 20, 30, 40, 50};',
      'Parcourir un tableau de 0 à n - 1 avec une boucle for',
      'Passer un tableau et sa taille à une fonction : int sommeTableau(int tab[], int n)',
      'Comprendre que la modification d’une case tab[i] dans une fonction modifie directement le tableau d’origine',
    ],
    tags: ['tableaux C', 'int tab[]', 'passage de tableau', 'débordement'],
    lesson: {
      intuitiveExplanation: `En C, un tableau \`int notes[5];\` réserve **5 cases entières consécutives (20 octets)** en mémoire, numérotées de \`0\` à \`4\`.
Particularité fondamentale du langage C :
1. Un tableau C **ne connaît pas sa propre taille** à l'exécution : quand vous passez un tableau à une fonction, vous devez **toujours** passer sa taille \`int n\` en second paramètre (\`int somme(int tab[], int n)\`).
2. Contrairement aux variables simples qui sont copiées, passer un tableau à une fonction transmet l'**adresse de sa première case** : si la fonction modifie \`tab[i]\`, le tableau de \`main\` est directement modifié !`,
      formalDefinition: `- **Déclaration et initialisation** : \`int tab[4] = {10, 20, 30, 40};\`
- **Accès** : \`tab[i]\` pour $0 \\le i < N$.
- **Danger mémoire** : en C standard, accéder à \`tab[4]\` ou \`tab[-1]\` n'est pas bloqué à la compilation mais corrompt la mémoire voisine (*Buffer Overflow*). Notre moteur C99 intègre une protection mémoire (*AddressSanitizer*) qui intercepte immédiatement tout débordement d'indice !`,
      analogy: `Passer un \`int\` à une fonction, c'est envoyer une **photocopie** d'une feuille. Passer un tableau \`tab[]\` à une fonction, c'est donner **la clé de l'armoire où sont rangés les dossiers originaux**.`,
      vocabulary: [
        { french: 'Contiguïté mémoire', english: 'Contiguous memory', definition: 'Les cases tab[0], tab[1], ... se suivent sans espace en RAM (espacées de sizeof(int) = 4 octets).' },
        { french: 'Débordement de tampon', english: 'Buffer overflow', definition: 'Lecture ou écriture en dehors des indices valides [0 .. N-1] d’un tableau.' },
      ],
      simpleExample: {
        title: 'Initialisation et parcours d’un tableau en C',
        description: 'Calcul de la somme des éléments d’un tableau initialisé.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    int valeurs[5] = {4, 8, 15, 16, 23};
    int somme = 0;
    for (int i = 0; i < 5; i++) {
        somme += valeurs[i];
    }
    printf("Somme = %d\\n", somme);
    return 0;
}`,
        expectedOutput: `Somme = 66`,
        lineByLine: [
          { line: 'int valeurs[5] = {4, 8, 15, 16, 23};', explanation: 'Déclare et initialise les 5 cases d’indices 0 à 4.' },
          { line: 'for (int i = 0; i < 5; i++)', explanation: 'Idiome universel en C : i part de 0 et s’arrête strictement avant 5 (i < 5).' },
        ],
      },
      intermediateExample: {
        title: 'Fonction de recherche du maximum d’un tableau',
        description: 'La fonction reçoit le tableau tab[] et sa taille n.',
        language: 'c',
        code: `#include <stdio.h>

int trouverMax(int tab[], int n) {
    int max = tab[0];
    for (int i = 1; i < n; i++) {
        if (tab[i] > max) {
            max = tab[i];
        }
    }
    return max;
}

int main(void) {
    int mesures[4] = {-12, -3, -25, -8};
    printf("Max = %d\\n", trouverMax(mesures, 4));
    return 0;
}`,
        expectedOutput: `Max = -3`,
        lineByLine: [
          { line: 'int trouverMax(int tab[], int n)', explanation: 'On passe toujours le tableau accompagné de son nombre d’éléments n.' },
          { line: 'int max = tab[0];', explanation: 'Initialisation sur le premier élément (indispensable pour gérer les nombres négatifs).' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Écrire `for (int i = 0; i <= n; i++)` avec `<=` au lieu de `<`.',
          whyItHappens: 'Confusion entre le dernier indice `n - 1` et la taille `n`.',
          howToFix: 'Au dernier tour `i = n`, `tab[n]` accède hors du tableau ! Utilisez toujours la condition stricte `i < n`.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B10_C1',
          question: 'Quelle est l’écriture idiomatique en C pour parcourir un tableau de taille `n` ?',
          options: [
            'for (int i = 1; i <= n; i++)',
            'for (int i = 0; i < n; i++)',
            'for (int i = 0; i <= n; i++)',
            'for (int i = 1; i < n; i++)',
          ],
          correctIndex: 1,
          explanation: 'En partant de 0 avec la condition stricte `i < n`, `i` parcourt exactement les `n` indices `0, 1, ..., n - 1`.',
        },
      ],
      summary: `Un tableau C de taille n se parcourt avec for (int i = 0; i < n; i++). Lorsqu'on le passe à une fonction, on transmet toujours sa taille n en paramètre.`,
    },
    exercises: [
      {
        id: 'B10_E1',
        chapterId: 'B10',
        title: 'Corriger un débordement de tableau en C',
        category: 'bugfix',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Ce programme tente de calculer la somme d'un tableau de 4 entiers, mais la condition de boucle \`i <= 4\` provoque une erreur d'exécution (*Index out of bounds* sur \`tab[4]\`). Corrigez la borne de la boucle !`,
        starterCode: `#include <stdio.h>

int main(void) {
    int tab[4] = {10, 20, 30, 40};
    int somme = 0;
    for (int i = 0; i <= 4; i++) {
        somme += tab[i];
    }
    printf("%d\\n", somme);
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'Somme = 100 sans débordement', stdin: '', expectedStdout: '100', isHidden: false },
        ],
        hints: ['Remplacez `i <= 4` par `i < 4`.'],
        explanation: `Les indices valides d'un tableau de taille 4 sont 0, 1, 2 et 3 (\`i < 4\`).`,
        referenceSolution: `#include <stdio.h>

int main(void) {
    int tab[4] = {10, 20, 30, 40};
    int somme = 0;
    for (int i = 0; i < 4; i++) {
        somme += tab[i];
    }
    printf("%d\\n", somme);
    return 0;
}`,
      },
      {
        id: 'B10_E2',
        chapterId: 'B10',
        title: 'Fonction qui compte les occurrences d’une cible dans un tableau',
        category: 'c_code',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Écrivez la fonction \`int compterOccurrences(int tab[], int n, int cible)\` qui renvoie combien de fois \`cible\` apparaît dans les \`n\` cases de \`tab\`.`,
        starterCode: `#include <stdio.h>

int compterOccurrences(int tab[], int n, int cible) {
    // Comptez et retournez le nombre de cases égales à cible
}

int main(void) {
    int t[5];
    for (int i = 0; i < 5; i++) {
        scanf("%d", &t[i]);
    }
    int c = 0;
    scanf("%d", &c);
    printf("%d\\n", compterOccurrences(t, 5, c));
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'Valeur 7 présente 3 fois', stdin: '7\n2\n7\n9\n7\n7\n', expectedStdout: '3', isHidden: false },
          { id: 't2', label: 'Valeur absente -> 0', stdin: '1\n2\n3\n4\n5\n9\n', expectedStdout: '0', isHidden: true },
        ],
        hints: [
          'Initialisez int nb = 0;',
          'Parcourez avec for (int i = 0; i < n; i++) et si tab[i] == cible, faites nb++;',
        ],
        explanation: `La fonction parcourt \`tab[0 .. n-1]\` et incrémente un compteur local à chaque égalité avec \`cible\`.`,
        referenceSolution: `#include <stdio.h>

int compterOccurrences(int tab[], int n, int cible) {
    int nb = 0;
    for (int i = 0; i < n; i++) {
        if (tab[i] == cible) {
            nb++;
        }
    }
    return nb;
}

int main(void) {
    int t[5];
    for (int i = 0; i < 5; i++) {
        scanf("%d", &t[i]);
    }
    int c = 0;
    scanf("%d", &c);
    printf("%d\\n", compterOccurrences(t, 5, c));
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B11 — CHAÎNES DE CARACTÈRES EN C
  // ============================================================================
  {
    id: 'B11',
    trackId: 'c',
    order: 11,
    title: 'Chaînes de caractères en C (\\0 et <string.h>)',
    subtitle: 'Comprendre qu’une chaîne C est un tableau de char terminé par le caractère nul \'\\0\'.',
    estimatedMinutes: 55,
    prerequisites: ['B10'],
    bridgeChapterIds: ['A10'],
    objectives: [
      'Comprendre la représentation mémoire d’une chaîne C et le rôle de la sentinelle \'\\0\' (code ASCII 0)',
      'Prévoir toujours 1 octet supplémentaire pour \'\\0\' lors du dimensionnement d’un tableau char[]',
      'Parcourir une chaîne caractère par caractère avec while (s[i] != \'\\0\')',
      'Utiliser les fonctions standard de <string.h> : strlen, strcmp, strcpy',
    ],
    tags: ['chaînes', 'char[]', 'sentinelle \\0', 'strlen', 'strcmp', 'string.h'],
    lesson: {
      intuitiveExplanation: `En C, il n'existe pas de type « chaîne » magique : une chaîne de caractères est tout simplement un **tableau de \`char\`** !
Mais comment \`printf("%s", mot)\` sait-il où s'arrête le mot si un tableau C ne connaît pas sa taille ?
Grâce à un caractère spécial invisible placé juste après la dernière lettre : le **caractère nul \`'\\0'\`** (de valeur numérique \`0\`).
Ainsi, le mot \`"Bonjour"\` (7 lettres) occupe en réalité **8 octets** en mémoire : \`'B','o','n','j','o','u','r','\\0'\` !`,
      formalDefinition: `- Une **chaîne C (*Null-terminated string*)** de longueur $L$ nécessite un tableau d'au moins **$L + 1$ \`char\`** pour loger le terminateur \`'\\0'\`.
- **Attention** : on ne peut **pas** comparer deux chaînes avec \`s1 == s2\`, ni copier une chaîne avec \`s1 = s2\`. Il faut utiliser \`<string.h>\` :
  - \`strlen(s)\` : renvoie le nombre de caractères avant \`'\\0'\`.
  - \`strcmp(s1, s2)\` : renvoie \`0\` si les deux chaînes sont identiques !
  - \`strcpy(dest, src)\` : copie \`src\` (y compris \`'\\0'\`) dans \`dest\`.`,
      analogy: `Le caractère \`'\\0'\` est comme le **heurtoir de fin de voie** dans une gare : le train (\`printf\` ou \`strlen\`) avance wagon après wagon et s'arrête net dès qu'il rencontre \`'\\0'\`.`,
      vocabulary: [
        { french: 'Caractère nul (Sentinelle)', english: 'Null terminator (\'\\0\')', definition: 'Octet de valeur 0 marquant obligatoirement la fin d’une chaîne de caractères en C.' },
        { french: 'Code ASCII', english: 'ASCII code', definition: 'Numéro entier associé à chaque caractère (\'A\' = 65, \'a\' = 97, \'0\' = 48, \'\\0\' = 0).' },
      ],
      simpleExample: {
        title: 'Parcours d’une chaîne jusqu’au caractère nul \'\\0\'',
        description: 'Compter manuellement le nombre de voyelles dans une chaîne.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    char mot[] = "Algorithmique";
    int i = 0;
    int voyelles = 0;
    while (mot[i] != '\\0') {
        char c = mot[i];
        if (c == 'A' || c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            voyelles++;
        }
        i++;
    }
    printf("Mot : %s, Longueur = %d, Voyelles = %d\\n", mot, i, voyelles);
    return 0;
}`,
        expectedOutput: `Mot : Algorithmique, Longueur = 13, Voyelles = 6`,
        lineByLine: [
          { line: 'char mot[] = "Algorithmique";', explanation: 'Crée un tableau de 14 char (les 13 lettres + \'\\0\' automatique).' },
          { line: 'while (mot[i] != \'\\0\')', explanation: 'S’arrête dès qu’on atteint la sentinelle de fin de chaîne.' },
        ],
      },
      intermediateExample: {
        title: 'Utilisation de <string.h> : strlen et strcmp',
        description: 'Vérifier la longueur et l’égalité de deux chaînes.',
        language: 'c',
        code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char secret[] = "C99";
    char essai[] = "C99";
    printf("Longueur = %d\\n", (int)strlen(secret));
    if (strcmp(secret, essai) == 0) {
        printf("Chaines identiques\\n");
    }
    return 0;
}`,
        expectedOutput: `Longueur = 3\nChaines identiques`,
        lineByLine: [
          { line: 'strlen(secret)', explanation: 'Renvoie 3 (le caractère \'\\0\' n’est pas compté dans la longueur).' },
          { line: 'if (strcmp(secret, essai) == 0)', explanation: 'strcmp renvoie 0 lorsque les deux chaînes contiennent exactement les mêmes caractères.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Déclarer `char nom[4] = "Alex";` pour un mot de 4 lettres.',
          whyItHappens: 'Oubli de la case nécessaire pour le caractère nul `\'\\0\'`.',
          howToFix: 'Pour stocker 4 lettres, il faut au minimum `char nom[5]` (4 lettres + 1 case pour `\'\\0\'`).',
        },
        {
          mistake: 'Tester `if (mot == "oui")` pour comparer deux chaînes.',
          whyItHappens: 'Fonctionne dans d’autres langages, mais en C `==` compare les adresses mémoires des tableaux, pas leur contenu !',
          howToFix: 'Utilisez toujours `if (strcmp(mot, "oui") == 0)` en incluant `<string.h>`.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B11_C1',
          question: 'Quelle est la taille minimale du tableau `char s[?]` pour stocker la chaîne `"Ecole"` (5 lettres) ?',
          options: [
            '4',
            '5',
            '6 (5 lettres + 1 case pour le caractère nul \'\\0\')',
            '10',
          ],
          correctIndex: 2,
          explanation: 'Toute chaîne C se termine par `\'\\0\'`, donc 5 lettres nécessitent 6 octets.',
        },
      ],
      summary: `Une chaîne C est un tableau de char terminé par '\\0'. Sa longueur utile est donnée par strlen(s) et la comparaison de deux chaînes se fait avec strcmp(s1, s2) == 0.`,
    },
    exercises: [
      {
        id: 'B11_E1',
        chapterId: 'B11',
        title: 'Comparer deux chaînes avec strcmp',
        category: 'qcm',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Que renvoie \`strcmp(a, b)\` de \`<string.h>\` lorsque les deux chaînes \`a\` et \`b\` sont **strictement identiques** ?`,
        choices: [
          '1',
          '0',
          '-1',
          'La longueur de la chaîne',
        ],
        expectedAnswer: '0',
        hints: ['Pensez à strcmp comme à une soustraction lexicographique (a - b) : si a et b sont égaux, la différence vaut...'],
        explanation: `\`strcmp\` calcule l'écart lexicographique entre les deux chaînes : un écart de \`0\` signifie qu'elles sont identiques.`,
      },
      {
        id: 'B11_E2',
        chapterId: 'B11',
        title: 'Calculer la longueur d’une chaîne sans strlen',
        category: 'c_code',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Écrivez la fonction \`int maLongueur(char s[])\` qui compte et renvoie le nombre de caractères de \`s\` avant le caractère nul \`'\\0'\` (sans utiliser \`strlen\`).`,
        starterCode: `#include <stdio.h>

int maLongueur(char s[]) {
    // Comptez les caractères jusqu'à '\\0'
}

int main(void) {
    char texte[64];
    scanf("%s", texte);
    printf("%d\\n", maLongueur(texte));
    return 0;
}`,
        testCases: [
          { id: 't1', label: '"Ingenieur" -> 9', stdin: 'Ingenieur\n', expectedStdout: '9', isHidden: false },
          { id: 't2', label: '"C" -> 1', stdin: 'C\n', expectedStdout: '1', isHidden: false },
          { id: 't3', label: '"Algorithme" -> 10', stdin: 'Algorithme\n', expectedStdout: '10', isHidden: true },
        ],
        hints: [
          'Initialisez int i = 0;',
          'Tant que s[i] != \'\\0\', incrémentez i, puis retournez i.',
        ],
        explanation: `La boucle \`while (s[i] != '\\0') { i++; }\` avance jusqu'au terminateur nul : \`i\` contient alors exactement la longueur de la chaîne.`,
        referenceSolution: `#include <stdio.h>

int maLongueur(char s[]) {
    int i = 0;
    while (s[i] != '\\0') {
        i++;
    }
    return i;
}

int main(void) {
    char texte[64];
    scanf("%s", texte);
    printf("%d\\n", maLongueur(texte));
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B12 — POINTEURS, ADRESSES MÉMOIRE ET ALLOCATION DYNAMIQUE
  // ============================================================================
  {
    id: 'B12',
    trackId: 'c',
    order: 12,
    title: 'Pointeurs, adresses mémoire et allocation dynamique',
    subtitle: 'Démystifier & et *, modifier une variable par adresse et gérer le Tas (malloc / free).',
    estimatedMinutes: 65,
    prerequisites: ['B05', 'B08', 'B10'],
    bridgeChapterIds: ['A08', 'A10'],
    objectives: [
      'Comprendre ce qu’est une adresse mémoire et ce qu’est un pointeur (int *p = &x;)',
      'Maîtriser les deux opérateurs complémentaires : & (adresse de) et * (valeur pointée par / déréférencement)',
      'Écrire une fonction qui modifie ses arguments par adresse : void echanger(int *a, int *b)',
      'Allouer un tableau dynamiquement sur le Tas avec malloc et le libérer avec free',
    ],
    tags: ['pointeurs', 'adresse &', 'déréférencement *', 'NULL', 'malloc', 'free'],
    lesson: {
      intuitiveExplanation: `Les **pointeurs** ont la réputation d'être la notion la plus redoutée de première année, alors qu'ils reposent sur une idée très simple :
Chaque variable en mémoire RAM possède :
1. Un **contenu** (par exemple \`42\`),
2. Une **adresse mémoire** (le numéro de sa case en RAM, par exemple \`0x4004\`).

Un **pointeur** \`int *p;\` est tout simplement une variable dont le contenu est **l'adresse d'une autre variable** !
- **\`&x\`** signifie : *« Donne-moi l'adresse où habite \`x\` »*.
- **\`*p\`** signifie : *« Va à l'adresse écrite dans \`p\` et lis (ou modifie) la case qui s'y trouve »*.`,
      formalDefinition: `- **Déclaration d'un pointeur** : \`int *p = &x;\` (\`p\` contient l'adresse de \`x\`).
- **Déréférencement (*Dereferencing*)** : l'expression \`*p\` désigne la variable pointée par \`p\`. Écrire \`*p = 99;\` modifie directement \`x\` !
- **Pointeur nul** : \`int *p = NULL;\` indique que le pointeur ne pointe vers aucune adresse valide (\`0x0\`). Interdiction absolue de faire \`*p\` quand \`p == NULL\`.
- **Allocation dynamique (\`<stdlib.h>\`)** :
  - \`int *tab = malloc(n * sizeof(int));\` réserve $n$ entiers sur le **Tas (*Heap*)**.
  - \`free(tab);\` libère cette mémoire une fois qu'on n'en a plus besoin (oublier \`free\` crée une **fuite mémoire / *Memory Leak***).`,
      analogy: `Une variable \`int x = 42;\` est une **maison** contenant \`42\`.
Un pointeur \`int *p = &x;\` est un **post-it** sur lequel est notée l'adresse GPS de la maison \`x\`.
Suivre l'adresse du post-it pour aller repeindre l'intérieur de la maison, c'est **déréférencer** le pointeur (\`*p = 100;\`).`,
      vocabulary: [
        { french: 'Pointeur', english: 'Pointer', definition: 'Variable stockant l’adresse mémoire d’une autre donnée.' },
        { french: 'Déréférencement', english: 'Dereferencing (*p)', definition: 'Accès à la valeur stockée à l’adresse contenue dans le pointeur p.' },
        { french: 'Passage par adresse', english: 'Pass by pointer / address', definition: 'Transmission de l’adresse &x à une fonction pour lui permettre de modifier x.' },
        { french: 'Tas mémoire', english: 'Heap', definition: 'Zone mémoire dédiée aux allocations dynamiques via malloc / calloc / free.' },
      ],
      simpleExample: {
        title: 'Lire et modifier une variable via un pointeur',
        description: 'Observation de &x, p et *p.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    int x = 10;
    int *p = &x; // p stocke l'adresse de x
    *p = 42;     // Modifie la variable située à l'adresse p (donc x !)
    printf("x = %d, *p = %d\\n", x, *p);
    return 0;
}`,
        expectedOutput: `x = 42, *p = 42`,
        lineByLine: [
          { line: 'int *p = &x;', explanation: 'Déclare un pointeur sur int nommé p, et l’initialise avec l’adresse de x.' },
          { line: '*p = 42;', explanation: 'Déréférence p : écrit 42 directement dans la case mémoire de x.' },
        ],
      },
      intermediateExample: {
        title: 'Échanger deux variables grâce au passage par adresse et utiliser malloc / free',
        description: 'La fonction echanger reçoit int *a et int *b pour permuter les variables de main.',
        language: 'c',
        code: `#include <stdio.h>
#include <stdlib.h>

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 5, y = 9;
    echanger(&x, &y);
    printf("x = %d, y = %d\\n", x, y);

    int *dyn = malloc(2 * sizeof(int));
    dyn[0] = x;
    dyn[1] = y;
    printf("Somme tas = %d\\n", dyn[0] + dyn[1]);
    free(dyn);
    return 0;
}`,
        expectedOutput: `x = 9, y = 5\nSomme tas = 14`,
        lineByLine: [
          { line: 'echanger(&x, &y);', explanation: 'On transmet les adresses de x et y avec l’opérateur &.' },
          { line: 'int temp = *a; *a = *b; *b = temp;', explanation: 'Permute les contenus des cases pointées par a et b.' },
          { line: 'free(dyn);', explanation: 'Libère le bloc alloué par malloc sur le tas (aucune fuite mémoire).' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Déréférencer un pointeur non initialisé ou `NULL` (`int *p = NULL; *p = 5;`).',
          whyItHappens: 'On utilise `*p` avant d’avoir fait pointer `p` vers une variable réelle (`p = &x;`) ou un bloc `malloc`.',
          howToFix: 'Un pointeur doit **toujours** pointer vers une adresse valide avant d’être déréférencé avec `*p`.',
        },
        {
          mistake: 'Oublier `free(ptr)` après un `malloc`.',
          whyItHappens: 'Le programme semble fonctionner, mais la mémoire du Tas reste bloquée.',
          howToFix: 'À chaque `malloc` doit correspondre un `free` avant la fin du programme.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B12_C1',
          question: 'Après `int a = 7; int *p = &a; *p = *p + 3;`, quelle est la valeur de `a` ?',
          options: [
            '7',
            '3',
            '10',
            'L’adresse de p',
          ],
          correctIndex: 2,
          explanation: '`*p` désigne directement la variable `a`. Lui ajouter 3 fait passer `a` de 7 à 10.',
        },
      ],
      summary: `&x donne l'adresse de x. Un pointeur int *p stocke une adresse, et *p accède à la valeur pointée. Pour qu'une fonction modifie une variable de main, on lui passe &x et elle modifie *p.`,
    },
    exercises: [
      {
        id: 'B12_E1',
        chapterId: 'B12',
        title: 'Prédire l’effet de deux pointeurs sur une même variable',
        category: 'prediction',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Qu'affiche ce programme C ?`,
        codeSnippet: `#include <stdio.h>

int main(void) {
    int n = 10;
    int *p1 = &n;
    int *p2 = &n;
    *p1 = *p1 + 5;
    *p2 = *p2 * 2;
    printf("%d\\n", n);
    return 0;
}`,
        expectedAnswer: '30',
        acceptedAnswers: ['30'],
        hints: ['p1 et p2 pointent tous les deux vers la même variable n !'],
        explanation: `\`*p1 = *p1 + 5\` fait passer \`n\` de 10 à 15. Puis \`*p2 = *p2 * 2\` multiplie ce même \`n\` par 2, ce qui donne \`30\`.`,
      },
      {
        id: 'B12_E2',
        chapterId: 'B12',
        title: 'Fonction ordonnerDeuxNombres par pointeurs',
        category: 'c_code',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Écrivez la procédure \`void ordonner(int *a, int *b)\` qui compare les entiers pointés par \`a\` et \`b\` et les échange si \`*a > *b\` afin qu'après l'appel on ait toujours \`*a <= *b\`.`,
        starterCode: `#include <stdio.h>

void ordonner(int *a, int *b) {
    // Si *a > *b, échangez les valeurs pointées par a et b
}

int main(void) {
    int x = 0, y = 0;
    scanf("%d", &x);
    scanf("%d", &y);
    ordonner(&x, &y);
    printf("%d %d\\n", x, y);
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'Entrées 25 et 8 -> 8 25', stdin: '25\n8\n', expectedStdout: '8 25', isHidden: false },
          { id: 't2', label: 'Déjà dans l’ordre 4 et 19 -> 4 19', stdin: '4\n19\n', expectedStdout: '4 19', isHidden: false },
          { id: 't3', label: 'Nombres négatifs -2 et -10 -> -10 -2', stdin: '-2\n-10\n', expectedStdout: '-10 -2', isHidden: true },
        ],
        hints: [
          'Testez if (*a > *b)',
          'Utilisez une variable int temp = *a; puis *a = *b; et *b = temp;',
        ],
        explanation: `En passant \`&x\` et \`&y\`, la fonction \`ordonner\` peut lire et permuter directement le contenu des variables de \`main\` via \`*a\` et \`*b\`.`,
        referenceSolution: `#include <stdio.h>

void ordonner(int *a, int *b) {
    if (*a > *b) {
        int temp = *a;
        *a = *b;
        *b = temp;
    }
}

int main(void) {
    int x = 0, y = 0;
    scanf("%d", &x);
    scanf("%d", &y);
    ordonner(&x, &y);
    printf("%d %d\\n", x, y);
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B13 — STRUCTURES (STRUCT ET TYPEDEF)
  // ============================================================================
  {
    id: 'B13',
    trackId: 'c',
    order: 13,
    title: 'Structures de données (struct, typedef, . et ->)',
    subtitle: 'Regrouper plusieurs champs de types différents au sein d’un type composite sur mesure.',
    estimatedMinutes: 50,
    prerequisites: ['B10', 'B12'],
    bridgeChapterIds: ['A16'],
    objectives: [
      'Définir un type structure avec struct et typedef struct { ... } NomType;',
      'Accéder aux champs d’une structure avec l’opérateur point (p.x)',
      'Accéder aux champs via un pointeur sur structure avec l’opérateur flèche (ptr->x)',
      'Manipuler des fonctions prenant ou renvoyant une structure',
    ],
    tags: ['struct', 'typedef', 'opérateur .', 'opérateur ->'],
    lesson: {
      intuitiveExplanation: `Un tableau regroupe des éléments qui ont **tous le même type** (par exemple 50 \`int\`).
Mais comment représenter un **Point 2D** \`(x, y)\`, un **Étudiant** (numéro \`int\`, moyenne \`double\`), ou un **Capteur** ?
En C, le mot-clé **\`struct\`** permet de fabriquer votre propre « fiche d'information » regroupant plusieurs **champs** (*fields*) de types différents sous une seule variable !`,
      formalDefinition: `- **Définition avec alias \`typedef\`** :
\`\`\`c
typedef struct {
    int x;
    int y;
} Point;
\`\`\`
- **Accès direct aux champs** : si \`Point p;\`, on accède à ses champs avec l'opérateur **point \`.\`** : \`p.x = 10;\`.
- **Accès via un pointeur** : si \`Point *ptr = &p;\`, on accède aux champs avec l'opérateur **flèche \`->\`** : \`ptr->x = 10;\` (qui est un raccourci pour \`(*ptr).x = 10;\`).`,
      analogy: `Une \`struct\` est un **formulaire administratif pré-imprimé** comportant plusieurs cases nommées (\`.id\`, \`.moyenne\`). Chaque variable de ce type est une fiche remplie.`,
      vocabulary: [
        { french: 'Structure (Enregistrement)', english: 'Struct (Record)', definition: 'Type composite regroupant plusieurs variables (champs) sous un même nom.' },
        { french: 'Champ (ou Membre)', english: 'Field / Member', definition: 'Chacune des variables internes composant une structure.' },
        { french: 'Opérateur flèche', english: 'Arrow operator (->)', definition: 'Accède au champ d’une structure à partir d’un pointeur sur cette structure (ptr->champ).' },
      ],
      simpleExample: {
        title: 'Définition et utilisation d’une structure Point',
        description: 'Calcul du carré de la distance à l’origine d’un point 2D.',
        language: 'c',
        code: `#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

int distanceCarree(Point p) {
    return p.x * p.x + p.y * p.y;
}

int main(void) {
    Point a = {3, 4};
    printf("Point (%d, %d) -> d2 = %d\\n", a.x, a.y, distanceCarree(a));
    return 0;
}`,
        expectedOutput: `Point (3, 4) -> d2 = 25`,
        lineByLine: [
          { line: 'typedef struct { int x; int y; } Point;', explanation: 'Crée le nouveau type Point composé de deux entiers x et y.' },
          { line: 'Point a = {3, 4};', explanation: 'Initialise a.x à 3 et a.y à 4.' },
          { line: 'return p.x * p.x + p.y * p.y;', explanation: 'Accède aux champs avec l’opérateur point (.).' },
        ],
      },
      intermediateExample: {
        title: 'Modifier une structure via un pointeur et l’opérateur flèche ->',
        description: 'Déplacer un point en passant son adresse &p à une fonction.',
        language: 'c',
        code: `#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

void deplacer(Point *p, int dx, int dy) {
    p->x += dx;
    p->y += dy;
}

int main(void) {
    Point joueur = {10, 20};
    deplacer(&joueur, 5, -3);
    printf("Position = (%d, %d)\\n", joueur.x, joueur.y);
    return 0;
}`,
        expectedOutput: `Position = (15, 17)`,
        lineByLine: [
          { line: 'void deplacer(Point *p, int dx, int dy)', explanation: 'Reçoit un pointeur vers la structure Point à modifier.' },
          { line: 'p->x += dx;', explanation: 'Utilise la flèche -> car p est un pointeur sur Point.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Oublier le point-virgule `;` après l’accolade fermante de `struct { ... };`.',
          whyItHappens: 'Les fonctions n’ont pas de `;` après `}`, mais une définition de `struct` en a obligatoirement un !',
          howToFix: 'Terminez toujours une déclaration de structure par `};` ou `} NomType;`.',
        },
        {
          mistake: 'Utiliser `.` au lieu de `->` sur un pointeur de structure (`p.x` quand `p` est de type `Point *`).',
          whyItHappens: 'Confusion entre une variable structure directe et un pointeur sur structure.',
          howToFix: 'Variable directe $\\Rightarrow$ `.` (`joueur.x`). Pointeur $\\Rightarrow$ `->` (`ptr->x`).',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B13_C1',
          question: 'Si ` ptr` est de type `Etudiant *` (pointeur sur une structure `Etudiant`), comment accède-t-on à son champ `note` ?',
          options: [
            'ptr.note',
            'ptr->note',
            '&ptr.note',
            '*ptr->note',
          ],
          correctIndex: 1,
          explanation: 'L’opérateur `->` déréférence le pointeur et accède au champ `note` en une seule opération.',
        },
      ],
      summary: `typedef struct { ... } Nom; définit un type composite. On accède aux champs par . sur une variable directe et par -> sur un pointeur.`,
    },
    exercises: [
      {
        id: 'B13_E1',
        chapterId: 'B13',
        title: 'Opérateur point vs opérateur flèche',
        category: 'qcm',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `À quelle écriture est strictement équivalente l'expression \`ptr->x\` lorsque \`ptr\` est un pointeur sur une structure ?`,
        choices: [
          '(*ptr).x',
          '*(ptr.x)',
          '&ptr.x',
          'ptr + x',
        ],
        expectedAnswer: '(*ptr).x',
        hints: ['Il faut d’abord déréférencer le pointeur (*ptr), puis accéder au champ .x.'],
        explanation: `L'opérateur flèche \`ptr->x\` est l'écriture abrégée et lisible de \`(*ptr).x\`.`,
      },
      {
        id: 'B13_E2',
        chapterId: 'B13',
        title: 'Calculer l’aire d’une structure Rectangle',
        category: 'c_code',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Complétez la fonction \`int aireRectangle(Rectangle r)\` qui renvoie le produit de la largeur et de la hauteur du rectangle \`r\`.`,
        starterCode: `#include <stdio.h>

typedef struct {
    int largeur;
    int hauteur;
} Rectangle;

int aireRectangle(Rectangle r) {
    // Retournez l'aire du rectangle r
}

int main(void) {
    Rectangle rect;
    scanf("%d", &rect.largeur);
    scanf("%d", &rect.hauteur);
    printf("%d\\n", aireRectangle(rect));
    return 0;
}`,
        testCases: [
          { id: 't1', label: '6 x 8 -> 48', stdin: '6\n8\n', expectedStdout: '48', isHidden: false },
          { id: 't2', label: '10 x 3 -> 30', stdin: '10\n3\n', expectedStdout: '30', isHidden: true },
        ],
        hints: ['Utilisez r.largeur * r.hauteur.'],
        explanation: `Comme \`r\` est une structure passée par valeur, on accède à ses champs avec l'opérateur point : \`r.largeur * r.hauteur\`.`,
        referenceSolution: `#include <stdio.h>

typedef struct {
    int largeur;
    int hauteur;
} Rectangle;

int aireRectangle(Rectangle r) {
    return r.largeur * r.hauteur;
}

int main(void) {
    Rectangle rect;
    scanf("%d", &rect.largeur);
    scanf("%d", &rect.hauteur);
    printf("%d\\n", aireRectangle(rect));
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B14 — DÉBOGAGE EN C (ASSERT, TRACES, MÉMOIRE)
  // ============================================================================
  {
    id: 'B14',
    trackId: 'c',
    order: 14,
    title: 'Débogage méthodique en C (traces, assert, inspection)',
    subtitle: 'Localiser scientifiquement un bug avec <assert.h>, des traces d’état et l’inspecteur mémoire.',
    estimatedMinutes: 45,
    prerequisites: ['B10', 'B12'],
    bridgeChapterIds: ['A14', 'A15'],
    objectives: [
      'Utiliser assert(condition) de <assert.h> pour vérifier automatiquement les préconditions et invariants',
      'Insérer des traces d’exécution ciblées pour observer l’évolution des variables',
      'Formuler une hypothèse sur l’origine d’un bug et la vérifier méthodiquement',
    ],
    tags: ['débogage', 'assert.h', 'préconditions', 'inspection mémoire'],
    lesson: {
      intuitiveExplanation: `Quand un programme C affiche un mauvais résultat, la pire réaction est de modifier le code au hasard (« programmation par tâtonnement »).
Le **débogage méthodique** consiste à :
1. **Verrouiller les hypothèses** avec **\`assert(condition)\`** (\`#include <assert.h>\`) : si la condition est fausse à l'exécution, le programme s'arrête immédiatement en vous indiquant exactement quelle propriété a été violée et à quelle ligne.
2. **Observer l'état mémoire** (valeurs des variables à chaque tour de boucle, adresses des pointeurs) pour trouver l'instant précis où la réalité diverge de votre intention.`,
      formalDefinition: `- **Assertion (\`assert(expr)\`)** : macro définie dans \`<assert.h>\`. Si \`expr\` vaut \`0\` (faux), l'exécution est interrompue avec un diagnostic précis (fichier, numéro de ligne, condition en échec).
- **Précondition** : condition que les paramètres d'une fonction doivent obligatoirement respecter à l'entrée (ex. \`assert(n > 0);\`).`,
      analogy: `Une instruction \`assert\` est comme un **disjoncteur électrique** : dès qu'une valeur anormale (comme un diviseur nul ou un indice négatif) apparaît, elle coupe immédiatement le courant à l'endroit exact du court-circuit au lieu de laisser l'incendie se propager.`,
      vocabulary: [
        { french: 'Assertion', english: 'Assertion (assert)', definition: 'Vérification dynamique d’une propriété logique devant toujours être vraie à cet endroit du code.' },
        { french: 'Précondition', english: 'Precondition', definition: 'Contrat qu’une fonction exige de ses arguments avant de commencer son calcul.' },
      ],
      simpleExample: {
        title: 'Sécuriser une fonction avec assert(<assert.h>)',
        description: 'Vérifier que la taille du tableau est strictement positive avant de chercher le minimum.',
        language: 'c',
        code: `#include <stdio.h>
#include <assert.h>

int minimum(int tab[], int n) {
    assert(n > 0);
    int min = tab[0];
    for (int i = 1; i < n; i++) {
        if (tab[i] < min) {
            min = tab[i];
        }
    }
    return min;
}

int main(void) {
    int donnees[4] = {18, 4, 29, 7};
    int m = minimum(donnees, 4);
    assert(m <= donnees[0]);
    printf("Min valide = %d\\n", m);
    return 0;
}`,
        expectedOutput: `Min valide = 4`,
        lineByLine: [
          { line: 'assert(n > 0);', explanation: 'Précondition : garantit qu’on n’accédera jamais à tab[0] sur un tableau vide.' },
          { line: 'assert(m <= donnees[0]);', explanation: 'Postcondition : le minimum trouvé est nécessairement inférieur ou égal au premier élément.' },
        ],
      },
      intermediateExample: {
        title: 'Tracer pas à pas une boucle pour débusquer une erreur d’accumulation',
        description: 'Observation de l’évolution de i et de acc à chaque itération.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    int acc = 1;
    for (int i = 1; i <= 4; i++) {
        acc = acc * 2;
        printf("[Trace i=%d] acc=%d\\n", i, acc);
    }
    return 0;
}`,
        expectedOutput: `[Trace i=1] acc=2\n[Trace i=2] acc=4\n[Trace i=3] acc=8\n[Trace i=4] acc=16`,
        lineByLine: [
          { line: 'printf("[Trace i=%d] acc=%d\\n", i, acc);', explanation: 'Affiche l’état interne de la boucle à chaque itération.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Mettre une instruction qui modifie une variable à l’intérieur d’un `assert`, comme `assert(i++ < n);`.',
          whyItHappens: 'On combine test et effet de bord.',
          howToFix: 'Une assertion ne doit **jamais** modifier l’état du programme : elle doit uniquement observer (`assert(i < n);`).',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B14_C1',
          question: 'Que se passe-t-il à l’exécution si la condition d’un `assert(x >= 0);` est fausse (`x` vaut `-5`) ?',
          options: [
            'x est automatiquement transformé en +5',
            'Le programme s’arrête immédiatement en signalant la ligne exacte de l’assertion échouée',
            'Le programme ignore la ligne et continue',
            'L’ordinateur redémarre',
          ],
          correctIndex: 1,
          explanation: '`assert` interrompt immédiatement l’exécution avec un diagnostic précis dès que sa condition est fausse.',
        },
      ],
      summary: `Utilisez assert(condition) de <assert.h> pour vérifier vos préconditions et invariants, et inspectez l'état des variables tour par tour plutôt que de modifier le code au hasard.`,
    },
    exercises: [
      {
        id: 'B14_E1',
        chapterId: 'B14',
        title: 'Rôle d’une assertion',
        category: 'qcm',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Quel fichier d'en-tête faut-il inclure pour utiliser \`assert(condition);\` en C ?`,
        choices: [
          '#include <stdio.h>',
          '#include <assert.h>',
          '#include <debug.h>',
          '#include <math.h>',
        ],
        expectedAnswer: '#include <assert.h>',
        hints: ['Le nom de l’en-tête correspond directement au nom de la macro assert.'],
        explanation: `La macro \`assert\` est déclarée dans l'en-tête standard \`<assert.h>\`.`,
      },
      {
        id: 'B14_E2',
        chapterId: 'B14',
        title: 'Déboguer une fonction de calcul de puissance',
        category: 'bugfix',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Cette fonction \`puissance(int base, int exp)\` censée calculer $\\text{base}^{\\text{exp}}$ renvoie toujours \`0\` ! En inspectant l'initialisation de \`resultat\` et la boucle, corrigez le bug.`,
        starterCode: `#include <stdio.h>
#include <assert.h>

int puissance(int base, int exp) {
    assert(exp >= 0);
    int resultat = 0;
    for (int i = 0; i < exp; i++) {
        resultat = resultat * base;
    }
    return resultat;
}

int main(void) {
    int b = 0, e = 0;
    scanf("%d", &b);
    scanf("%d", &e);
    printf("%d\\n", puissance(b, e));
    return 0;
}`,
        testCases: [
          { id: 't1', label: '3^4 -> 81', stdin: '3\n4\n', expectedStdout: '81', isHidden: false },
          { id: 't2', label: '5^0 -> 1', stdin: '5\n0\n', expectedStdout: '1', isHidden: false },
        ],
        hints: ['Si resultat est initialisé à 0, que vaut 0 * base à chaque tour de boucle ?'],
        explanation: `Un accumulateur multiplicatif doit toujours être initialisé à \`1\` (et non \`0\`), ce qui garantit également que $b^0 = 1$.`,
        referenceSolution: `#include <stdio.h>
#include <assert.h>

int puissance(int base, int exp) {
    assert(exp >= 0);
    int resultat = 1;
    for (int i = 0; i < exp; i++) {
        resultat = resultat * base;
    }
    return resultat;
}

int main(void) {
    int b = 0, e = 0;
    scanf("%d", &b);
    scanf("%d", &e);
    printf("%d\\n", puissance(b, e));
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B15 — ERREURS DE COMPILATION ET D'EXÉCUTION
  // ============================================================================
  {
    id: 'B15',
    trackId: 'c',
    order: 15,
    title: 'Erreurs de compilation, d’exécution et de mémoire',
    subtitle: 'Diagnostiquer et corriger Segmentation Fault, débordements, division par zéro et fuites mémoire.',
    estimatedMinutes: 50,
    prerequisites: ['B10', 'B12', 'B14'],
    bridgeChapterIds: ['A15'],
    objectives: [
      'Distinguer clairement une erreur de compilation (syntaxe/types) d’une erreur d’exécution (runtime trap)',
      'Comprendre les causes d’une erreur de segmentation (Segmentation Fault : pointeur NULL, adresse invalide, oubli de & dans scanf)',
      'Prévenir la division par zéro et les fuites mémoire (malloc sans free)',
    ],
    tags: ['Segmentation fault', 'NULL', 'fuite mémoire', 'division par zéro', 'diagnostics'],
    lesson: {
      intuitiveExplanation: `En langage C, il existe quatre grandes familles d'erreurs :
1. **Erreur de compilation** : le code viole la grammaire C (point-virgule oublié, variable non déclarée). Le programme **ne démarre même pas**.
2. **Erreur d'exécution (*Runtime Error / Crash*)** : le programme compile et démarre, mais tente une opération illégale en cours de route :
   - Diviser par \`0\`,
   - Déréférencer un pointeur \`NULL\` ou invalide (*Segmentation Fault*),
   - Déborder d'un tableau (*Buffer Overflow*).
3. **Fuite mémoire (*Memory Leak*)** : allouer avec \`malloc\` sans appeler \`free\`.
4. **Erreur logique** : le programme ne plante pas, mais sa formule est fausse.`,
      formalDefinition: `Tableau de diagnostic rapide des plantages d'exécution en C :
| Symptôme / Message | Cause principale | Correction |
|---|---|---|
| \`Segmentation fault (NULL pointer)\` | \`*p\` alors que \`p == NULL\` ou oubli de \`&\` dans \`scanf("%d", x)\` | Vérifier \`if (p != NULL)\` et mettre \`&x\` dans \`scanf\` |
| \`Index out of bounds\` | Accès à \`tab[n]\` ou \`tab[-1]\` | Vérifier que \`0 <= i && i < n\` |
| \`Division by zero\` | \`a / b\` ou \`a % b\` avec \`b == 0\` | Tester \`if (b != 0)\` avant de diviser |
| \`Memory leak detected\` | Bloc \`malloc\` jamais libéré | Appeler \`free(ptr);\` avant la fin |`,
      analogy: `- **Erreur de compilation** : le contrôle technique refuse votre voiture **avant** de prendre la route.
- **Erreur d'exécution (Segfault)** : une sortie de route en plein trajet parce que vous avez suivi une adresse GPS qui mène dans un ravin (\`NULL\`).`,
      vocabulary: [
        { french: 'Erreur de segmentation', english: 'Segmentation fault (Segfault)', definition: 'Arrêt brutal provoqué par une tentative d’accès à une zone mémoire interdite ou NULL.' },
        { french: 'Fuite mémoire', english: 'Memory leak', definition: 'Perte de mémoire sur le Tas lorsqu’un bloc alloué par malloc n’est jamais libéré par free.' },
      ],
      simpleExample: {
        title: 'Protéger un pointeur et une division contre les erreurs d’exécution',
        description: 'Vérifier systématiquement qu’un pointeur n’est pas NULL et qu’un diviseur n’est pas nul.',
        language: 'c',
        code: `#include <stdio.h>

int diviserSecurise(int a, int b, int *resultat) {
    if (b == 0 || resultat == NULL) {
        return 0; // Échec sécurisé sans crash
    }
    *resultat = a / b;
    return 1; // Succès
}

int main(void) {
    int q = 0;
    if (diviserSecurise(20, 4, &q) == 1) {
        printf("Quotient = %d\\n", q);
    }
    if (diviserSecurise(20, 0, &q) == 0) {
        printf("Division par zero evitee !\\n");
    }
    return 0;
}`,
        expectedOutput: `Quotient = 5\nDivision par zero evitee !`,
        lineByLine: [
          { line: 'if (b == 0 || resultat == NULL) return 0;', explanation: 'Protège à la fois contre la division par zéro et le déréférencement de pointeur NULL.' },
          { line: '*resultat = a / b;', explanation: 'Exécuté uniquement lorsque toutes les garanties de sécurité sont réunies.' },
        ],
      },
      intermediateExample: {
        title: 'Cycle de vie complet sans fuite mémoire (malloc + vérification + free)',
        description: 'Allocation dynamique d’un tableau, utilisation et libération propre.',
        language: 'c',
        code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 4;
    int *tab = malloc(n * sizeof(int));
    if (tab == NULL) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        tab[i] = (i + 1) * 10;
    }
    printf("Dernier = %d\\n", tab[n - 1]);
    free(tab);
    return 0;
}`,
        expectedOutput: `Dernier = 40`,
        lineByLine: [
          { line: 'int *tab = malloc(n * sizeof(int));', explanation: 'Alloue 4 entiers (16 octets) sur le Tas.' },
          { line: 'free(tab);', explanation: 'Rend les 16 octets au système avant de quitter main.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Utiliser la mémoire pointée APRÈS avoir appelé `free(tab)` (*Use-after-free*).',
          whyItHappens: 'On appelle `free(tab)` trop tôt, avant le dernier `printf`.',
          howToFix: 'N’appelez `free(tab)` qu’une fois que vous avez totalement fini de lire ou d’écrire dans `tab`.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B15_C1',
          question: 'Quelle erreur d’exécution se produit si l’on exécute `int *p = NULL; *p = 10;` ?',
          options: [
            'Une erreur de syntaxe à la compilation',
            'Un déréférencement de pointeur NULL (Segmentation fault)',
            'Une fuite mémoire',
            'p prend la valeur 10 sans erreur',
          ],
          correctIndex: 1,
          explanation: 'L’adresse NULL (0x0) est interdite d’accès : tenter d’y écrire provoque une erreur de segmentation.',
        },
      ],
      summary: `Protégez toujours vos divisions (b != 0), vos indices de tableaux (0 <= i < n), vos pointeurs (p != NULL) et libérez chaque malloc par un free.`,
    },
    exercises: [
      {
        id: 'B15_E1',
        chapterId: 'B15',
        title: 'Identifier la nature d’une erreur',
        category: 'error_spot',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Quel type de problème contient un programme qui alloue un tableau avec \`malloc\` mais se termine par \`return 0;\` sans jamais appeler \`free\` ?`,
        choices: [
          'Une erreur de syntaxe qui empêche la compilation',
          'Une fuite mémoire (Memory Leak)',
          'Une division par zéro',
          'Un débordement de pile (Stack Overflow)',
        ],
        expectedAnswer: 'Une fuite mémoire (Memory Leak)',
        hints: ['La mémoire réservée sur le Tas (Heap) n’est pas rendue.'],
        explanation: `Toute mémoire réservée dynamiquement avec \`malloc\` ou \`calloc\` qui n'est pas libérée avec \`free\` constitue une fuite mémoire (*Memory Leak*).`,
      },
      {
        id: 'B15_E2',
        chapterId: 'B15',
        title: 'Corriger trois erreurs critiques dans un programme C',
        category: 'bugfix',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Ce programme lit un entier \`n\`, alloue un tableau dynamique de \`n\` cases, le remplit avec \`1..n\` et affiche la somme.
Mais il comporte **3 bugs** : oubli de \`&\` dans \`scanf\`, débordement d'indice \`i <= n\`, et oubli de \`free(tab)\`. Corrigez-les tous !`,
        starterCode: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 0;
    scanf("%d", n);
    int *tab = malloc(n * sizeof(int));
    int somme = 0;
    for (int i = 0; i <= n; i++) {
        tab[i] = i + 1;
        somme += tab[i];
    }
    printf("%d\\n", somme);
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'n = 4 -> 10', stdin: '4\n', expectedStdout: '10', isHidden: false },
          { id: 't2', label: 'n = 5 -> 15', stdin: '5\n', expectedStdout: '15', isHidden: true },
        ],
        hints: [
          '1. Mettez &n dans scanf("%d", &n);',
          '2. Remplacez i <= n par i < n dans la boucle for.',
          '3. Ajoutez free(tab); juste avant return 0;',
        ],
        explanation: `Avec \`&n\`, la condition \`i < n\` et \`free(tab);\`, le programme s'exécute sans erreur de segmentation, sans débordement de tampon et sans fuite mémoire.`,
        referenceSolution: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 0;
    scanf("%d", &n);
    int *tab = malloc(n * sizeof(int));
    int somme = 0;
    for (int i = 0; i < n; i++) {
        tab[i] = i + 1;
        somme += tab[i];
    }
    printf("%d\\n", somme);
    free(tab);
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B16 — PETITS PROJETS DE SYNTHÈSE ET PASSERELLES ALGO -> C
  // ============================================================================
  {
    id: 'B16',
    trackId: 'c',
    order: 16,
    title: 'Projets de synthèse C et Passerelles Algo -> C',
    subtitle: 'Traduire des algorithmes complets en programmes C99 robustes, modulaires et sans fuite mémoire.',
    estimatedMinutes: 70,
    prerequisites: ['B08', 'B10', 'B11', 'B12', 'B13', 'B15'],
    bridgeChapterIds: ['A16'],
    objectives: [
      'Traduire intégralement un algorithme validé en programme C99',
      'Combiner fonctions, tableaux, pointeurs et structures dans un mini-projet de synthèse',
      'Valider son programme sur des cas normaux et des cas limites',
    ],
    tags: ['synthèse C', 'passerelle Algo -> C', 'projet final'],
    lesson: {
      intuitiveExplanation: `Félicitations ! Vous êtes arrivé au dernier chapitre du **Parcours B — Langage C**.
Vous savez désormais passer méthodiquement d'un problème énoncé en français à :
1. Sa **conception algorithmique** en pseudo-code (Parcours A),
2. Sa **trace d'exécution** et ses **cas limites**,
3. Son **implémentation en C99** (Parcours B) avec compilation réelle, gestion de la mémoire et validation automatisée.`,
      formalDefinition: `Grille de traduction récapitulative **Algorithmique $\\longrightarrow$ Langage C99** :
| Concept Algorithmique | Équivalent en Langage C99 |
|---|---|
| \`x : ENTIER\` / \`REEL\` | \`int x;\` / \`double x;\` |
| \`LIRE(x)\` / \`AFFICHER(x)\` | \`scanf("%d", &x);\` / \`printf("%d\\n", x);\` |
| \`a DIV b\` / \`a MOD b\` | \`a / b\` (entre \`int\`) / \`a % b\` |
| \`SI ... ALORS ... SINON ... FINSI\` | \`if (...) { ... } else { ... }\` |
| \`POUR i ALLANT DE 0 A n - 1 FAIRE\` | \`for (int i = 0; i < n; i++) { ... }\` |
| \`FONCTION f(a : ENTIER) : ENTIER\` | \`int f(int a) { ... }\` |
| \`tab : TABLEAU[N] DE ENTIER\` | \`int tab[N];\` ou \`int *tab = malloc(n * sizeof(int));\` |`,
      analogy: `L'algorithmique est l'**architecture** (les plans et les lois physiques de l'ouvrage) ; le langage C est l'**ingénierie de construction** qui donne vie à l'ouvrage dans le monde réel du processeur et de la mémoire.`,
      vocabulary: [
        { french: 'Traduction Algo -> C', english: 'Algorithm-to-C implementation', definition: 'Passage d’un pseudo-code indépendant de la machine à un code source C99 compilable.' },
        { french: 'Projet de synthèse', english: 'Capstone project', definition: 'Exercice transversal mobilisant simultanément plusieurs compétences du programme.' },
      ],
      simpleExample: {
        title: 'Passerelle complète : Tri par sélection et médiane d’un tableau en C',
        description: 'On trie un tableau de 5 mesures avec une fonction dédiée puis on affiche la valeur médiane (case centrale d’indice 2).',
        language: 'c',
        code: `#include <stdio.h>

void trierSelection(int tab[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (tab[j] < tab[minIdx]) {
                minIdx = j;
            }
        }
        int temp = tab[i];
        tab[i] = tab[minIdx];
        tab[minIdx] = temp;
    }
}

int main(void) {
    int mesures[5] = {42, 7, 19, 3, 25};
    trierSelection(mesures, 5);
    printf("Min = %d, Mediane = %d, Max = %d\\n", mesures[0], mesures[2], mesures[4]);
    return 0;
}`,
        expectedOutput: `Min = 3, Mediane = 19, Max = 42`,
        lineByLine: [
          { line: 'void trierSelection(int tab[], int n)', explanation: 'Trie directement le tableau mesures en place en O(n²).' },
          { line: 'mesures[2]', explanation: 'Une fois les 5 éléments triés (3, 7, 19, 25, 42), l’élément central d’indice 2 est la médiane (19).' },
        ],
      },
      intermediateExample: {
        title: 'Synthèse avec structures et pointeurs : Gestion de relevés d’étudiants',
        description: 'Calcul de la meilleure note parmi un tableau de structures Etudiant.',
        language: 'c',
        code: `#include <stdio.h>

typedef struct {
    int id;
    int note;
} Etudiant;

Etudiant trouverMajor(Etudiant promo[], int n) {
    Etudiant major = promo[0];
    for (int i = 1; i < n; i++) {
        if (promo[i].note > major.note) {
            major = promo[i];
        }
    }
    return major;
}

int main(void) {
    Etudiant groupe[3] = {{101, 14}, {102, 18}, {103, 16}};
    Etudiant m = trouverMajor(groupe, 3);
    printf("Major : ID %d avec %d/20\\n", m.id, m.note);
    return 0;
}`,
        expectedOutput: `Major : ID 102 avec 18/20`,
        lineByLine: [
          { line: 'Etudiant groupe[3] = ...', explanation: 'Tableau contenant 3 structures Etudiant.' },
          { line: 'if (promo[i].note > major.note)', explanation: 'Compare le champ .note de chaque structure du tableau.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Se lancer directement dans le code C sans avoir clarifié l’algorithme sur papier.',
          whyItHappens: 'Précipitation devant le clavier.',
          howToFix: 'Découpez toujours votre problème en petites fonctions (`estPremier`, `trouverMax`, `trier`) et testez chacune séparément.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B16_C1',
          question: 'Lorsqu’une fonction `void trier(int tab[], int n)` modifie les cases `tab[i]`, que devient le tableau dans `main` ?',
          options: [
            'Il n’est pas modifié car il est copié',
            'Il est directement trié en place car tab[] transmet l’adresse du tableau d’origine',
            'Il est détruit à la fin de la fonction',
            'Il faut obligatoirement faire return tab;',
          ],
          correctIndex: 1,
          explanation: 'En C, passer un tableau transmet l’adresse de son premier élément : toute modification de `tab[i]` affecte le tableau d’origine.',
        },
      ],
      summary: `Vous disposez désormais de toutes les bases de l'algorithmique et de la programmation en C99. Validez les exercices de synthèse ci-dessous pour achever le parcours complet !`,
    },
    exercises: [
      {
        id: 'B16_E1',
        chapterId: 'B16',
        title: 'Passerelle Algo -> C 1 : Compter les nombres premiers dans [a, b]',
        category: 'synthesis',
        difficulty: 'avance',
        isCoreValidationExercise: true,
        bridgeTargetExerciseId: 'A16_E1',
        prompt: `Traduisez en **langage C** l'algorithme de synthèse \`A16_E1\` :
1. Écrivez la fonction \`int estPremier(int n)\` qui renvoie \`1\` si \`n\` est premier ($n \\ge 2$ et aucun diviseur entre $2$ et $n-1$), et \`0\` sinon.
2. Dans \`main\`, lisez deux entiers \`a\` et \`b\` ($a \\le b$) avec \`scanf\`, et affichez combien de nombres premiers se trouvent dans l'intervalle \`[a, b]\` inclus.`,
        starterCode: `#include <stdio.h>

int estPremier(int n) {
    // Renvoie 1 si n est premier, 0 sinon
}

int main(void) {
    int a = 0, b = 0;
    scanf("%d", &a);
    scanf("%d", &b);
    // Comptez et affichez le nombre de premiers entre a et b inclus
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'Entre 1 et 10 -> 4', stdin: '1\n10\n', expectedStdout: '4', isHidden: false },
          { id: 't2', label: 'Entre 10 et 20 -> 4', stdin: '10\n20\n', expectedStdout: '4', isHidden: false },
          { id: 't3', label: 'Entre 24 et 28 -> 0', stdin: '24\n28\n', expectedStdout: '0', isHidden: true },
        ],
        hints: [
          'Dans estPremier(int n) : si n < 2, return 0; puis for (int d = 2; d < n; d++) { if (n % d == 0) return 0; } return 1;',
          'Dans main : faites une boucle for (int k = a; k <= b; k++) et ajoutez estPremier(k) à votre compteur.',
        ],
        explanation: `C'est la traduction exacte en C99 de l'algorithme \`A16_E1\` : \`MOD\` devient \`%\`, \`POUR\` devient \`for\`, et \`LIRE/AFFICHER\` deviennent \`scanf/printf\`.`,
        referenceSolution: `#include <stdio.h>

int estPremier(int n) {
    if (n < 2) {
        return 0;
    }
    for (int d = 2; d < n; d++) {
        if (n % d == 0) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int a = 0, b = 0;
    scanf("%d", &a);
    scanf("%d", &b);
    int nb = 0;
    for (int k = a; k <= b; k++) {
        if (estPremier(k) == 1) {
            nb++;
        }
    }
    printf("%d\\n", nb);
    return 0;
}`,
      },
      {
        id: 'B16_E2',
        chapterId: 'B16',
        title: 'Passerelle Algo -> C 2 : Étendue (Max - Min) avec pointeurs',
        category: 'synthesis',
        difficulty: 'avance',
        isCoreValidationExercise: true,
        bridgeTargetExerciseId: 'A16_E2',
        prompt: `Traduisez et enrichissez en **langage C** l'algorithme \`A16_E2\` :
1. Écrivez une procédure \`void trouverMinMax(int tab[], int n, int *minOut, int *maxOut)\` qui parcourt \`tab\` et écrit le minimum dans \`*minOut\` et le maximum dans \`*maxOut\`.
2. Dans \`main\`, lisez 5 entiers dans un tableau \`tab[5]\`, appelez \`trouverMinMax(tab, 5, &min, &max)\`, et affichez l'étendue \`max - min\`.`,
        starterCode: `#include <stdio.h>

void trouverMinMax(int tab[], int n, int *minOut, int *maxOut) {
    // Initialisez *minOut et *maxOut avec tab[0], puis parcourez tab
}

int main(void) {
    int tab[5];
    for (int i = 0; i < 5; i++) {
        scanf("%d", &tab[i]);
    }
    int min = 0, max = 0;
    trouverMinMax(tab, 5, &min, &max);
    printf("%d\\n", max - min);
    return 0;
}`,
        testCases: [
          { id: 't1', label: '10, 4, 25, 8, 12 -> 21', stdin: '10\n4\n25\n8\n12\n', expectedStdout: '21', isHidden: false },
          { id: 't2', label: 'Valeurs identiques -> 0', stdin: '7\n7\n7\n7\n7\n', expectedStdout: '0', isHidden: false },
          { id: 't3', label: 'Valeurs négatives (-10 à -2 -> 8)', stdin: '-5\n-10\n-2\n-8\n-4\n', expectedStdout: '8', isHidden: true },
        ],
        hints: [
          'Commencez par *minOut = tab[0]; et *maxOut = tab[0];',
          'Dans la boucle for (int i = 1; i < n; i++), si tab[i] < *minOut alors *minOut = tab[i]; et si tab[i] > *maxOut alors *maxOut = tab[i];',
        ],
        explanation: `Grâce au passage par adresse (\`int *minOut, int *maxOut\`), une seule fonction C peut renvoyer simultanément deux résultats (\`min\` et \`max\`) à \`main\` !`,
        referenceSolution: `#include <stdio.h>

void trouverMinMax(int tab[], int n, int *minOut, int *maxOut) {
    *minOut = tab[0];
    *maxOut = tab[0];
    for (int i = 1; i < n; i++) {
        if (tab[i] < *minOut) {
            *minOut = tab[i];
        }
        if (tab[i] > *maxOut) {
            *maxOut = tab[i];
        }
    }
}

int main(void) {
    int tab[5];
    for (int i = 0; i < 5; i++) {
        scanf("%d", &tab[i]);
    }
    int min = 0, max = 0;
    trouverMinMax(tab, 5, &min, &max);
    printf("%d\\n", max - min);
    return 0;
}`,
      },
    ],
  },
];
