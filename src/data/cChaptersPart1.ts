// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const C_CHAPTERS_PART1: any[] = [
  // ============================================================================
  // CHAPITRE B01 — STRUCTURE D'UN PROGRAMME C ET FONCTION MAIN
  // ============================================================================
  {
    id: 'B01',
    trackId: 'c',
    order: 1,
    title: 'Structure d’un programme C et fonction main',
    subtitle: 'Comprendre le squelette minimal d’un programme C99 : #include, int main(void), accolades et return 0.',
    estimatedMinutes: 40,
    prerequisites: [],
    bridgeChapterIds: ['A01'],
    objectives: [
      'Identifier les éléments indispensables d’un fichier source C (.c)',
      'Comprendre le rôle de la directive #include <stdio.h>',
      'Comprendre pourquoi tout programme C démarre dans la fonction main et renvoie 0 au système',
      'Utiliser correctement les points-virgules (;), les accolades ({ }) et les commentaires (// et /* */)',
    ],
    tags: ['main', 'include', 'stdio.h', 'return 0', 'syntaxe C'],
    lesson: {
      intuitiveExplanation: `En pseudo-code, nous écrivions \`ALGORITHME Nom ... DEBUT ... FIN\`.
En **langage C**, le point d'entrée universel de tout programme s'appelle la fonction **\`main\`** (« principale » en anglais).
Les mots \`DEBUT\` et \`FIN\` sont remplacés par une paire d'accolades **\`{\`** et **\`}\`**, et chaque instruction élémentaire doit obligatoirement se terminer par un **point-virgule \`;\`** (comme le point à la fin d'une phrase en français).`,
      formalDefinition: `Un programme C minimal conforme à la norme **ISO C99** se compose de :
1. **Directives du préprocesseur** (commençant par \`#\`), comme \`#include <stdio.h>\` qui importe les déclarations des fonctions d'entrée/sortie standard (*Standard Input/Output*).
2. La fonction principale **\`int main(void)\`** : l'exécution commence toujours à la première instruction de \`main\`.
3. L'instruction **\`return 0;\`** : renvoie le code de statut \`0\` au système d'exploitation, ce qui signifie par convention « le programme s'est terminé sans erreur ».`,
      analogy: `\`#include <stdio.h>\` est comme sortir la **boîte à outils d'affichage** avant de bricoler. \`int main(void) { ... }\` est la **porte d'entrée principale** de l'atelier, et \`return 0;\` est le **rapport de fin de chantier** confirmant que tout s'est bien passé.`,
      vocabulary: [
        { french: 'En-tête standard', english: 'Header file (.h)', definition: 'Fichier importé via #include contenant les prototypes des fonctions de bibliothèque.' },
        { french: 'Point d’entrée', english: 'Entry point (main)', definition: 'Fonction par laquelle le système d’exploitation démarre l’exécution du programme.' },
        { french: 'Code de retour', english: 'Exit status / Return code', definition: 'Entier renvoyé par main (0 = succès, non-zéro = erreur).' },
        { french: 'Bloc d’instructions', english: 'Compound statement / Block', definition: 'Ensemble d’instructions délimité par { et }.' },
      ],
      simpleExample: {
        title: 'Le programme C minimal « Bonjour »',
        description: 'Affichage d’un message à l’écran et terminaison propre avec return 0.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    // Affiche un message suivi d'un retour à la ligne
    printf("Bonjour Ingenieur !\\n");
    return 0;
}`,
        expectedOutput: `Bonjour Ingenieur !`,
        lineByLine: [
          { line: '#include <stdio.h>', explanation: 'Importe la bibliothèque standard d’entrées/sorties (nécessaire pour printf).' },
          { line: 'int main(void) {', explanation: 'Début de la fonction principale. Elle ne prend aucun argument (void) et renvoie un entier (int).' },
          { line: 'printf("Bonjour Ingenieur !\\n");', explanation: 'Affiche le texte à l’écran. Le \\n provoque un saut de ligne. Notez le point-virgule final !' },
          { line: 'return 0;', explanation: 'Termine le programme en indiquant au système que tout s’est déroulé sans erreur.' },
        ],
      },
      intermediateExample: {
        title: 'Plusieurs instructions et commentaires multi-lignes',
        description: 'Les instructions de main sont exécutées séquentiellement de haut en bas.',
        language: 'c',
        code: `#include <stdio.h>

/* Programme de démonstration :
   Exécution séquentielle en C */
int main(void) {
    printf("Etape 1 : Initialisation\\n");
    printf("Etape 2 : Calcul\\n");
    printf("Etape 3 : Terminaison\\n");
    return 0;
}`,
        expectedOutput: `Etape 1 : Initialisation\nEtape 2 : Calcul\nEtape 3 : Terminaison`,
        lineByLine: [
          { line: '/* ... */', explanation: 'Commentaire sur plusieurs lignes, totalement ignoré par le compilateur.' },
          { line: 'printf("Etape 1...\\n");', explanation: 'Chaque appel à printf s’exécute dans l’ordre d’écriture.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Oublier le point-virgule `;` à la fin d’une instruction.',
          whyItHappens: 'En pseudo-code, un simple retour à la ligne suffit.',
          howToFix: 'En C, chaque instruction simple (`printf(...)`, `x = 5`, `return 0`) DOIT se terminer par `;`. En revanche, on ne met jamais de `;` après `#include <stdio.h>` ni après `int main(void)`.',
        },
        {
          mistake: 'Écrire `Main` ou `MAIN` avec une majuscule.',
          whyItHappens: 'Habitude de mettre une majuscule en début de mot.',
          howToFix: 'Le langage C est sensible à la casse (*case-sensitive*) : `main`, `printf` et `return` s’écrivent intégralement en minuscules.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B01_C1',
          question: 'Que signifie l’instruction `return 0;` à la fin de la fonction `main` ?',
          options: [
            'Elle efface l’écran',
            'Elle indique au système d’exploitation que le programme s’est terminé avec succès (code 0)',
            'Elle relance le programme depuis le début',
            'Elle affiche le chiffre 0 à l’écran',
          ],
          correctIndex: 1,
          explanation: 'Par convention universelle sous Unix/Windows/C99, un code de retour 0 signifie « aucune erreur ».',
        },
      ],
      summary: `Tout programme C commence à la fonction int main(void), utilise #include <stdio.h> pour communiquer avec l'écran/clavier, termine chaque instruction par un point-virgule ; et se conclut par return 0;.`,
    },
    exercises: [
      {
        id: 'B01_E1',
        chapterId: 'B01',
        title: 'Identifier le rôle de #include <stdio.h>',
        category: 'qcm',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Pourquoi écrit-on \`#include <stdio.h>\` en haut d'un programme C ?`,
        choices: [
          'Pour déclarer une variable nommée stdio',
          'Pour pouvoir utiliser les fonctions standard d’affichage et de lecture comme printf et scanf',
          'Pour terminer le programme',
          'Pour accélérer la vitesse du processeur',
        ],
        expectedAnswer: 'Pour pouvoir utiliser les fonctions standard d’affichage et de lecture comme printf et scanf',
        hints: ['Que signifient les lettres STD-I-O (Standard Input/Output) ?'],
        explanation: `\`stdio.h\` (*Standard Input/Output Header*) contient les déclarations de \`printf\` et \`scanf\`.`,
      },
      {
        id: 'B01_E2',
        chapterId: 'B01',
        title: 'Remettre en ordre le squelette d’un programme C',
        category: 'ordering',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Ordonnez ces lignes pour former un programme C valide.`,
        scrambledLines: [
          '#include <stdio.h>',
          'int main(void) {',
          '    printf("Pret !\\n");',
          '    return 0;',
          '}',
        ],
        expectedAnswer: `#include <stdio.h>\nint main(void) {\n    printf("Pret !\\n");\n    return 0;\n}`,
        hints: ['La directive #include est tout en haut, suivie de int main(void) {, puis des instructions et de } final.'],
        explanation: `Le fichier commence par les directives \`#include\`, puis la définition de \`main\` entourée d'accolades.`,
      },
      {
        id: 'B01_E3',
        chapterId: 'B01',
        title: 'Écrire votre premier programme C complet',
        category: 'c_code',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Complétez ce programme C pour qu'il affiche exactement \`Premier programme C\` suivi d'un saut de ligne \`\\n\`, puis renvoie \`0\`.`,
        starterCode: `#include <stdio.h>

int main(void) {
    // Affichez "Premier programme C\n" puis retournez 0
}`,
        testCases: [
          { id: 't1', label: 'Affichage exact', stdin: '', expectedStdout: 'Premier programme C', isHidden: false },
        ],
        hints: [
          'Utilisez printf("Premier programme C\\n");',
          'N’oubliez pas return 0; avec son point-virgule.',
        ],
        explanation: `L'appel \`printf("Premier programme C\\n");\` affiche la chaîne, et \`return 0;\` termine proprement \`main\`.`,
        referenceSolution: `#include <stdio.h>

int main(void) {
    printf("Premier programme C\\n");
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B02 — COMPILATION ET PREMIER PROGRAMME
  // ============================================================================
  {
    id: 'B02',
    trackId: 'c',
    order: 2,
    title: 'Compilation, séquences d’échappement et erreurs de syntaxe',
    subtitle: 'Comprendre le passage du code source .c à l’exécutable et maîtriser printf (\\n, \\t, \\\").',
    estimatedMinutes: 45,
    prerequisites: ['B01'],
    bridgeChapterIds: ['A01', 'A04'],
    objectives: [
      'Comprendre les étapes de la chaîne de compilation : préprocesseur, compilation, édition de liens',
      'Utiliser les séquences d’échappement \\n (nouvelle ligne), \\t (tabulation) et \\\" (guillemet)',
      'Lire un message d’erreur du compilateur (numéro de ligne, cause, conseil) et le corriger',
    ],
    tags: ['compilation', 'printf', 'échappement', 'erreurs de syntaxe'],
    lesson: {
      intuitiveExplanation: `Un processeur ne comprend pas le texte C que vous écrivez : il ne comprend que du code machine binaire.
Le **compilateur C** joue à la fois le rôle de **correcteur orthographique/grammatical strict** et de **traducteur**. S'il manque un seul point-virgule ou une accolade, le compilateur refuse de produire l'exécutable et vous indique précisément la ligne du problème !`,
      formalDefinition: `La transformation d'un fichier \`programme.c\` en programme exécutable suit 3 phases :
1. **Préprocesseur** : traite les directives \`#include\` et \`#define\`, et supprime les commentaires.
2. **Compilation** : vérifie la syntaxe et les types, puis traduit le code C en instructions bas niveau.
3. **Édition de liens (*Linking*)** : relie votre code aux fonctions des bibliothèques standard (comme \`printf\`).`,
      analogy: `Écrire du code C, c'est rédiger la **partition musicale**. Compiler, c'est vérifier qu'aucune fausse note d'écriture n'existe et imprimer la partition finale. Exécuter, c'est faire jouer l'orchestre.`,
      vocabulary: [
        { french: 'Compilateur', english: 'Compiler', definition: 'Outil qui vérifie le code source C et le traduit en code exécutable.' },
        { french: 'Séquence d’échappement', english: 'Escape sequence', definition: 'Combinaison commençant par \\ représentant un caractère spécial (\\n, \\t, \\\\).' },
        { french: 'Erreur de compilation', english: 'Compile-time error', definition: 'Violation des règles du langage détectée avant toute exécution.' },
      ],
      simpleExample: {
        title: 'Maîtriser le saut de ligne \\n dans printf',
        description: 'Contrairement à AFFICHER en pseudo-code, printf ne saute PAS de ligne automatiquement si on ne met pas \\n.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    printf("Ligne 1\\n");
    printf("Debut ");
    printf("et Fin sur la meme ligne\\n");
    return 0;
}`,
        expectedOutput: `Ligne 1\nDebut et Fin sur la meme ligne`,
        lineByLine: [
          { line: 'printf("Debut ");', explanation: 'Pas de \\n à la fin : le curseur reste sur la même ligne après l’espace.' },
          { line: 'printf("et Fin sur la meme ligne\\n");', explanation: 'S’affiche immédiatement à la suite de "Debut ".' },
        ],
      },
      intermediateExample: {
        title: 'Présentation tabulée avec \\t et \\n',
        description: 'Afficher un petit tableau aligné grâce à la tabulation \\t.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    printf("Module\\tCoeff\\n");
    printf("Algo\\t4\\n");
    printf("Prog C\\t4\\n");
    return 0;
}`,
        expectedOutput: `Module\tCoeff\nAlgo\t4\nProg C\t4`,
        lineByLine: [
          { line: '\\t', explanation: 'Insère une tabulation horizontale pour aligner les colonnes.' },
          { line: '\\n', explanation: 'Passe à la ligne suivante.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Utiliser le slash normal `/n` au lieu de l’antislash `\\n`.',
          whyItHappens: 'Confusion visuelle entre `/` (division) et `\\` (échappement).',
          howToFix: 'Les séquences d’échappement commencent toujours par un **antislash** `\\` : `\\n`, `\\t`. Écrire `/n` affichera littéralement les deux caractères `/` et `n`.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B02_C1',
          question: 'Qu’affiche `printf("A"); printf("B\\n");` ?',
          options: [
            'A sur une ligne, puis B sur la ligne suivante',
            'AB sur une seule ligne',
            'A\\nB',
            'Une erreur de compilation',
          ],
          correctIndex: 1,
          explanation: 'Le premier printf ne contient pas de \\n, donc B est affiché juste à côté de A.',
        },
      ],
      summary: `Le compilateur vérifie la syntaxe avant l'exécution. printf n'ajoute pas de saut de ligne automatique : utilisez \\n pour aller à la ligne et \\t pour tabuler.`,
    },
    exercises: [
      {
        id: 'B02_E1',
        chapterId: 'B02',
        title: 'Corriger un programme qui ne compile pas',
        category: 'bugfix',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Ce programme comporte deux erreurs : un point-virgule manquant et un \`/n\` au lieu de \`\\n\`. Corrigez-le pour qu'il affiche \`Compilation reussie\` sur la première ligne et \`Bravo\` sur la seconde.`,
        starterCode: `#include <stdio.h>

int main(void) {
    printf("Compilation reussie/n")
    printf("Bravo\\n");
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'Sortie sur 2 lignes', stdin: '', expectedStdout: 'Compilation reussie\nBravo', isHidden: false },
        ],
        hints: [
          'Remplacez /n par \\n dans le premier printf.',
          'Ajoutez un point-virgule ; à la fin du premier printf.',
        ],
        explanation: `L'antislash \`\\n\` provoque le retour à la ligne et le \`;\` termine l'instruction \`printf\`.`,
        referenceSolution: `#include <stdio.h>

int main(void) {
    printf("Compilation reussie\\n");
    printf("Bravo\\n");
    return 0;
}`,
      },
      {
        id: 'B02_E2',
        chapterId: 'B02',
        title: 'Afficher deux lignes distinctes',
        category: 'c_code',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Écrivez un programme C qui affiche :
\`\`\`
Algorithmique
Langage C
\`\`\`
sur deux lignes séparées.`,
        starterCode: `#include <stdio.h>

int main(void) {
    // Votre code ici
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'Affichage 2 lignes', stdin: '', expectedStdout: 'Algorithmique\nLangage C', isHidden: false },
        ],
        hints: ['Utilisez printf("Algorithmique\\n"); suivi de printf("Langage C\\n");'],
        explanation: `Chaque \`\\n\` passe à la ligne suivante.`,
        referenceSolution: `#include <stdio.h>

int main(void) {
    printf("Algorithmique\\n");
    printf("Langage C\\n");
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B03 — VARIABLES, CONSTANTES, TYPES ET OPÉRATEURS EN C
  // ============================================================================
  {
    id: 'B03',
    trackId: 'c',
    order: 3,
    title: 'Variables, constantes, types et opérateurs en C',
    subtitle: 'Manipuler int, double, char, const, et les opérateurs arithmétiques (+, -, *, /, %, ++, +=).',
    estimatedMinutes: 50,
    prerequisites: ['B02'],
    bridgeChapterIds: ['A02', 'A03'],
    objectives: [
      'Déclarer et initialiser des variables typées : int (entier), double (réel), char (caractère)',
      'Définir des constantes avec const ou #define',
      'Utiliser les opérateurs arithmétiques +, -, *, /, % (modulo) et les opérateurs combinés +=, -=, ++, --',
      'Connaître la taille mémoire des types de base avec sizeof',
    ],
    tags: ['int', 'double', 'char', 'modulo %', 'sizeof', 'opérateurs'],
    lesson: {
      intuitiveExplanation: `En pseudo-code, nous avions \`ENTIER\`, \`REEL\` et \`CARACTERE\`, et l'affectation s'écrivait \`<-\`.
En langage C :
- \`ENTIER\` s'écrit **\`int\`** (4 octets en mémoire),
- \`REEL\` s'écrit **\`double\`** (8 octets, double précision) ou \`float\` (4 octets),
- \`CARACTERE\` s'écrit **\`char\`** (1 octet, entouré d'apostrophes simples comme \`'A'\`),
- L'affectation \`<-\` s'écrit avec un simple signe égal **\`=\`**,
- Le reste de la division entière \`MOD\` s'écrit avec le symbole pourcentage **\`%\`**.`,
      formalDefinition: `Correspondance des types et opérateurs entre Algorithmique et C99 :
- \`x : ENTIER\` $\\longrightarrow$ \`int x;\`
- \`y : REEL\` $\\longrightarrow$ \`double y;\`
- \`c : CARACTERE\` $\\longrightarrow$ \`char c = 'A';\`
- \`a <- a + 1\` $\\longrightarrow$ \`a = a + 1;\` ou \`a += 1;\` ou \`a++;\`
- \`a MOD b\` $\\longrightarrow$ \`a % b\` (uniquement entre deux entiers !).`,
      analogy: `En C, déclarer le type d'une variable (\`int\` ou \`double\`), c'est choisir **la taille exacte du tiroir en mémoire RAM** : 1 octet pour un \`char\`, 4 octets pour un \`int\`, 8 octets pour un \`double\`.`,
      vocabulary: [
        { french: 'Entier signé', english: 'int (integer)', definition: 'Type entier occupant généralement 4 octets (32 bits).' },
        { french: 'Flottant double précision', english: 'double', definition: 'Type réel à virgule flottante sur 8 octets (64 bits).' },
        { french: 'Opérateur d’incrémentation', english: 'Increment operator (++)', definition: 'Ajoute 1 à une variable entière (i++ équivaut à i = i + 1).' },
        { french: 'Opérateur sizeof', english: 'sizeof operator', definition: 'Renvoie la taille en octets d’un type ou d’une variable en mémoire.' },
      ],
      simpleExample: {
        title: 'Calculs entiers, modulo % et incrémentation ++',
        description: 'Déclaration de variables int, calcul de quotient/reste et incrémentation.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    int totalSecondes = 135;
    int minutes = totalSecondes / 60;
    int secondes = totalSecondes % 60;
    minutes++; // Ajoute 1 minute
    printf("Minutes = %d, Secondes = %d\\n", minutes, secondes);
    return 0;
}`,
        expectedOutput: `Minutes = 3, Secondes = 15`,
        lineByLine: [
          { line: 'int minutes = totalSecondes / 60;', explanation: 'Entre deux int, / effectue la division entière : 135 / 60 = 2.' },
          { line: 'int secondes = totalSecondes % 60;', explanation: 'L’opérateur % calcule le reste : 135 % 60 = 15.' },
          { line: 'minutes++;', explanation: 'Incrémente minutes de 1 : passe de 2 à 3.' },
        ],
      },
      intermediateExample: {
        title: 'Types int, double, char et constante const',
        description: 'Manipuler conjointement un caractère, un entier et un réel.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    const double TVA = 0.20;
    char categorie = 'A';
    int quantite = 3;
    double prixUnitaire = 10.5;
    double totalTTC = quantite * prixUnitaire * (1.0 + TVA);
    printf("Cat %c : Total = %.2f\\n", categorie, totalTTC);
    return 0;
}`,
        expectedOutput: `Cat A : Total = 37.80`,
        lineByLine: [
          { line: 'const double TVA = 0.20;', explanation: 'Déclare une constante réelle non modifiable.' },
          { line: 'char categorie = \'A\';', explanation: 'Un caractère unique s’écrit toujours entre apostrophes simples \'A\'.' },
          { line: 'printf("Cat %c : Total = %.2f\\n", categorie, totalTTC);', explanation: '%c affiche un char, %.2f affiche un double avec 2 chiffres après la virgule.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Utiliser des guillemets doubles `"A"` au lieu d’apostrophes simples `\'A\'` pour un `char`.',
          whyItHappens: 'En C, la distinction entre caractère et chaîne est stricte.',
          howToFix: 'Un `char` unique utilise toujours des apostrophes simples `\'A\'`. Les guillemets doubles `"A"` désignent une chaîne de caractères en mémoire.',
        },
        {
          mistake: 'Croire que `^` calcule la puissance en C (`2 ^ 3`).',
          whyItHappens: 'Notation mathématique ou calculatrice.',
          howToFix: 'En C, `^` est l’opérateur OU exclusif bit-à-bit (*bitwise XOR*) ! `2 ^ 3` vaut `1`, pas `8`. Pour un carré ou un cube, écrivez `x * x` ou utilisez `pow(x, n)` de `<math.h>`.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B03_C1',
          question: 'Que vaut l’expression C `17 % 5` ?',
          options: [
            '3.4',
            '3',
            '2',
            '85',
          ],
          correctIndex: 2,
          explanation: '17 = 5 * 3 + 2. L’opérateur % renvoie le reste de la division euclidienne, soit 2.',
        },
      ],
      summary: `En C, int stocke les entiers, double les réels et char un caractère ('A'). L'opérateur = affecte une valeur, / entre deux int réalise la division entière et % calcule le reste.`,
    },
    exercises: [
      {
        id: 'B03_E1',
        chapterId: 'B03',
        title: 'Prédire l’effet de += et %',
        category: 'prediction',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Qu'affiche ce programme C ?`,
        codeSnippet: `#include <stdio.h>

int main(void) {
    int x = 14;
    x += 5;
    int r = x % 4;
    printf("%d\\n", r);
    return 0;
}`,
        expectedAnswer: '3',
        acceptedAnswers: ['3'],
        hints: ['x passe de 14 à 14 + 5 = 19. Quel est le reste de 19 divisé par 4 ?'],
        explanation: `\`x += 5\` donne \`19\`. Puis \`19 % 4\` vaut \`3\` (car $19 = 4 \\times 4 + 3$).`,
      },
      {
        id: 'B03_E2',
        chapterId: 'B03',
        title: 'Calculer l’aire et le périmètre en C',
        category: 'c_code',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Écrivez un programme C qui déclare \`int largeur = 7;\` et \`int hauteur = 4;\`, puis affiche sur une seule ligne l'aire et le périmètre au format exact : \`Aire = 28, Perimetre = 22\`.`,
        starterCode: `#include <stdio.h>

int main(void) {
    int largeur = 7;
    int hauteur = 4;
    // Calculez et affichez "Aire = 28, Perimetre = 22\n"
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'Sortie attendue', stdin: '', expectedStdout: 'Aire = 28, Perimetre = 22', isHidden: false },
        ],
        hints: ['Utilisez printf("Aire = %d, Perimetre = %d\\n", aire, perimetre);'],
        explanation: `L'aire vaut \`largeur * hauteur\` (28) et le périmètre \`2 * (largeur + hauteur)\` (22).`,
        referenceSolution: `#include <stdio.h>

int main(void) {
    int largeur = 7;
    int hauteur = 4;
    int aire = largeur * hauteur;
    int perimetre = 2 * (largeur + hauteur);
    printf("Aire = %d, Perimetre = %d\\n", aire, perimetre);
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B04 — CONVERSIONS DE TYPES ET CASTS EXPLICITES
  // ============================================================================
  {
    id: 'B04',
    trackId: 'c',
    order: 4,
    title: 'Conversions de types et casts explicites',
    subtitle: 'Éviter le piège n°1 en C : la division entière involontaire (5 / 2 == 2) et maîtriser (double).',
    estimatedMinutes: 45,
    prerequisites: ['B03'],
    bridgeChapterIds: ['A03'],
    objectives: [
      'Comprendre pourquoi `double m = 5 / 2;` stocke `2.0` et non `2.5`',
      'Forcer une division réelle à l’aide d’un cast explicite `(double)somme / n` ou d’une constante réelle `2.0`',
      'Comprendre la troncature lors de la conversion d’un `double` vers un `int`',
    ],
    tags: ['cast', 'conversion de type', 'division entière', 'double'],
    lesson: {
      intuitiveExplanation: `Voici le piège dans lequel tombent 95 % des débutants en C :
Vous écrivez \`int somme = 15; int n = 2; double moyenne = somme / n;\` en pensant obtenir \`7.5\`.
Mais le programme affiche **\`7.00\`** ! Pourquoi ?
Parce qu'en C, le type d'une opération dépend **uniquement de ses opérandes**, pas de la variable qui reçoit le résultat. Comme \`somme\` et \`n\` sont deux \`int\`, \`somme / n\` effectue la **division entière** (\`15 / 2 = 7\`), et ce n'est qu'**ensuite** que \`7\` est converti en \`7.0\` !
Pour obtenir \`7.5\`, il faut convertir au moins l'un des deux opérandes en \`double\` **avant** la division : \`(double)somme / n\`.`,
      formalDefinition: `- **Règle de l'opérateur \`/\` en C** :
  - \`int / int\` $\\longrightarrow$ **division entière** (partie décimale tronquée vers zéro).
  - \`double / int\` ou \`int / double\` ou \`double / double\` $\\longrightarrow$ **division flottante réelle**.
- **Cast explicite** (*Type Casting*) : l'écriture \`(double)expr\` convertit la valeur de \`expr\` en \`double\` avant que l'opérateur suivant ne s'applique.
- **Troncature** : affecter un \`double\` (ex. \`3.99\`) dans un \`int\` supprime brutalement la partie fractionnaire (donne \`3\`, sans arrondir à \`4\`).`,
      analogy: `Si vous coupez une planche avec une scie qui ne coupe qu'au mètre entier (\`int / int\`), vous perdez déjà les centimètres avant même de poser la planche sur une table de précision (\`double\`). Il faut changer de scie **avant** de couper (\`(double)somme / n\`).`,
      vocabulary: [
        { french: 'Conversion explicite (Cast)', english: 'Explicit type cast', definition: 'Opérateur unaire (type) forçant la conversion d’une expression vers le type indiqué.' },
        { french: 'Promotion implicite', english: 'Implicit type promotion', definition: 'Conversion automatique du type le plus petit (int) vers le plus grand (double) dans une opération mixte.' },
        { french: 'Troncature', english: 'Truncation', definition: 'Suppression pure et simple des chiffres après la virgule lors du passage de double à int.' },
      ],
      simpleExample: {
        title: 'Division entière vs Cast explicite (double)',
        description: 'Comparaison directe entre a / b et (double)a / b.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 2;
    double faux = a / b;
    double vrai = (double)a / b;
    printf("Sans cast : %.2f\\n", faux);
    printf("Avec cast : %.2f\\n", vrai);
    return 0;
}`,
        expectedOutput: `Sans cast : 3.00\nAvec cast : 3.50`,
        lineByLine: [
          { line: 'double faux = a / b;', explanation: 'Calcule d’abord 7 / 2 en entier (= 3), puis stocke 3.00.' },
          { line: 'double vrai = (double)a / b;', explanation: 'Convertit a en 7.0, puis divise 7.0 par 2 = 3.50.' },
        ],
      },
      intermediateExample: {
        title: 'Troncature vers int et extraction de la partie entière',
        description: 'Convertir un double en int coupe la partie décimale sans arrondir.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    double mesure = 9.87;
    int partieEntiere = (int)mesure;
    printf("Mesure = %.2f, Partie entiere = %d\\n", mesure, partieEntiere);
    return 0;
}`,
        expectedOutput: `Mesure = 9.87, Partie entiere = 9`,
        lineByLine: [
          { line: 'int partieEntiere = (int)mesure;', explanation: 'Tronque 9.87 en 9 (attention, ce n’est pas un arrondi au plus proche !).' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Écrire `(double)(a / b)` avec des parenthèses autour de `a / b`.',
          whyItHappens: 'On met le cast devant toute la division déjà parenthésée.',
          howToFix: 'Dans `(double)(a / b)`, `a / b` est calculé en premier entre deux `int` (donc déjà tronqué !). Écrivez `(double)a / b` sans parenthèses autour de `a / b`.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B04_C1',
          question: 'Si `int total = 9;` et `int n = 4;`, quelle expression vaut exactement `2.25` ?',
          options: [
            'total / n',
            '(double)(total / n)',
            '(double)total / n',
            '(int)total / n',
          ],
          correctIndex: 2,
          explanation: '`(double)total` convertit `total` en `9.0` avant la division par `4`, ce qui donne `2.25`.',
        },
      ],
      summary: `En C, diviser deux int effectue toujours une division entière. Pour obtenir un quotient réel exact, utilisez un cast explicite : (double)num / den.`,
    },
    exercises: [
      {
        id: 'B04_E1',
        chapterId: 'B04',
        title: 'Repérer une division entière involontaire',
        category: 'qcm',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Que contient la variable \`res\` après \`int x = 5, y = 2; double res = (double)(x / y);\` ?`,
        choices: [
          '2.50',
          '2.00',
          '3.00',
          '0.00',
        ],
        expectedAnswer: '2.00',
        hints: ['Que calcule d’abord la parenthèse (x / y) entre deux int ?'],
        explanation: `Les parenthèses forcent le calcul entier \`5 / 2 = 2\` en premier, et le cast convertit ensuite \`2\` en \`2.00\`.`,
      },
      {
        id: 'B04_E2',
        chapterId: 'B04',
        title: 'Corriger un calcul de moyenne en C',
        category: 'bugfix',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Ce programme doit calculer la moyenne exacte de \`somme = 15\` pour \`nbNotes = 4\` (soit \`3.75\`), mais il affiche \`3.00\`. Ajoutez le cast nécessaire pour corriger le calcul.`,
        starterCode: `#include <stdio.h>

int main(void) {
    int somme = 15;
    int nbNotes = 4;
    double moyenne = somme / nbNotes;
    printf("%.2f\\n", moyenne);
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'Moyenne exacte 3.75', stdin: '', expectedStdout: '3.75', isHidden: false },
        ],
        hints: ['Remplacez `somme / nbNotes` par `(double)somme / nbNotes`.'],
        explanation: `Le cast \`(double)somme\` promeut la division en virgule flottante double précision : $15.0 / 4 = 3.75$.`,
        referenceSolution: `#include <stdio.h>

int main(void) {
    int somme = 15;
    int nbNotes = 4;
    double moyenne = (double)somme / nbNotes;
    printf("%.2f\\n", moyenne);
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B05 — AFFICHAGE ET LECTURE DE DONNÉES (PRINTF ET SCANF)
  // ============================================================================
  {
    id: 'B05',
    trackId: 'c',
    order: 5,
    title: 'Affichage et lecture de données (printf et scanf)',
    subtitle: 'Maîtriser les spécificateurs de format (%d, %lf, %.2f, %c) et l’opérateur d’adresse & dans scanf.',
    estimatedMinutes: 50,
    prerequisites: ['B03', 'B04'],
    bridgeChapterIds: ['A04', 'B12'],
    objectives: [
      'Utiliser les bons spécificateurs de format dans printf (%d pour int, %f / %.2f pour double, %c pour char)',
      'Lire des valeurs au clavier avec scanf("%d", &x) et scanf("%lf", &d)',
      'Comprendre pourquoi l’esperluette & (adresse mémoire) est obligatoire devant une variable simple dans scanf',
    ],
    tags: ['printf', 'scanf', 'format %d %lf', 'opérateur &'],
    lesson: {
      intuitiveExplanation: `Pour afficher une variable avec \`printf\`, il suffit de lui donner sa **valeur** : \`printf("%d", age);\`.
Mais pour lire une saisie clavier avec **\`scanf\`**, la fonction doit venir **ranger** la valeur saisie directement à l'intérieur de votre boîte mémoire \`age\`. Pour qu'un livreur dépose un colis chez vous, il a besoin de votre **adresse postale** : en C, l'opérateur **\`&\`** (« adresse de ») donne l'adresse mémoire de la variable : **\`scanf("%d", &age);\`** !`,
      formalDefinition: `Principaux spécificateurs de format en C99 :
| Type C | \`printf\` (Affichage) | \`scanf\` (Lecture) |
|---|---|---|
| \`int\` | \`%d\` | \`%d\` (avec \`&var\`) |
| \`double\` | \`%f\` ou \`%.2f\` | \`%lf\` (*long float*, avec \`&var\`) |
| \`char\` | \`%c\` | \` %c\` (avec \`&var\`) |

**Règle critique** : dans \`scanf\`, toute variable scalaire (\`int\`, \`double\`, \`char\`) doit être précédée de **\`&\`** (adresse mémoire). Oublier \`&\` provoque un comportement indéfini ou un plantage mémoire !`,
      analogy: `- \`printf("%d", x)\` : vous envoyez une **photocopie** du contenu de \`x\` à l'imprimante.
- \`scanf("%d", &x)\` : vous donnez les **coordonnées GPS (\`&\`) de la boîte \`x\`** au livreur pour qu'il vienne y déposer la valeur tapée au clavier.`,
      vocabulary: [
        { french: 'Spécificateur de format', english: 'Format specifier (%d, %lf)', definition: 'Marqueur indiquant à printf/scanf le type de donnée à afficher ou lire.' },
        { french: 'Opérateur d’adresse', english: 'Address-of operator (&)', definition: 'Opérateur unaire renvoyant l’adresse mémoire où est stockée une variable.' },
        { french: 'Entrée standard', english: 'Standard input (stdin)', definition: 'Flux de données provenant par défaut du clavier.' },
      ],
      simpleExample: {
        title: 'Lecture et affichage d’un entier avec scanf et printf',
        description: 'On lit un entier n avec scanf("%d", &n) puis on affiche son double.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    int n = 0;
    scanf("%d", &n);
    printf("Double = %d\\n", n * 2);
    return 0;
}`,
        expectedOutput: `Double = 24`,
        lineByLine: [
          { line: 'scanf("%d", &n);', explanation: 'Lit un entier sur l’entrée standard et le stocke à l’adresse de n (&n).' },
          { line: 'printf("Double = %d\\n", n * 2);', explanation: 'Affiche le double de n (pas de & dans printf !).' },
        ],
      },
      intermediateExample: {
        title: 'Lecture d’un entier et d’un réel (double)',
        description: 'Calcul du montant total à partir d’une quantité entière (%d) et d’un prix unitaire réel (%lf).',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    int quantite = 0;
    double prix = 0.0;
    scanf("%d", &quantite);
    scanf("%lf", &prix);
    printf("Total = %.2f\\n", quantite * prix);
    return 0;
}`,
        expectedOutput: `Total = 45.00`,
        lineByLine: [
          { line: 'scanf("%lf", &prix);', explanation: 'Pour lire un double avec scanf, on utilise %lf (long float) et &prix.' },
          { line: 'printf("Total = %.2f\\n", quantite * prix);', explanation: 'Affiche le résultat avec 2 décimales.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Oublier le `&` devant la variable dans `scanf("%d", x);`.',
          whyItHappens: 'Par mimétisme avec `printf("%d", x);`.',
          howToFix: 'Retenez la règle d’or : **`scanf` modifie la variable $\\Rightarrow$ il lui faut son adresse `&x`**. `printf` ne fait que lire la valeur $\\Rightarrow$ jamais de `&`.',
        },
        {
          mistake: 'Mettre `\\n` à l’intérieur de `scanf("%d\\n", &x);`.',
          whyItHappens: 'Habitude de mettre `\\n` dans tous les `printf`.',
          howToFix: 'Ne mettez **jamais** `\\n` dans un `scanf` : cela force `scanf` à attendre indéfiniment un caractère non-blanc supplémentaire !',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B05_C1',
          question: 'Quelle instruction lit correctement un entier dans la variable `int age;` ?',
          options: [
            'scanf("%d", age);',
            'scanf("%d", &age);',
            'printf("%d", &age);',
            'scanf("%f", &age);',
          ],
          correctIndex: 1,
          explanation: 'Il faut le format `%d` pour un `int` et l’opérateur d’adresse `&` devant `age`.',
        },
      ],
      summary: `printf affiche des valeurs (%d, %.2f, %c) sans &. scanf lit des saisies et exige l'adresse mémoire &var (%d pour int, %lf pour double).`,
    },
    exercises: [
      {
        id: 'B05_E1',
        chapterId: 'B05',
        title: 'Corriger un appel à scanf',
        category: 'bugfix',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Ce programme tente de lire un entier \`x\` et d'afficher son carré, mais il a oublié l'opérateur d'adresse dans \`scanf\`. Corrigez-le !`,
        starterCode: `#include <stdio.h>

int main(void) {
    int x = 0;
    scanf("%d", x);
    printf("%d\\n", x * x);
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'Entrée 7 -> 49', stdin: '7\n', expectedStdout: '49', isHidden: false },
          { id: 't2', label: 'Entrée -4 -> 16', stdin: '-4\n', expectedStdout: '16', isHidden: true },
        ],
        hints: ['Ajoutez & devant x dans scanf("%d", &x);'],
        explanation: `Sans \`&x\`, \`scanf\` ne reçoit pas l'adresse mémoire de la variable \`x\` et déclenche une erreur mémoire.`,
        referenceSolution: `#include <stdio.h>

int main(void) {
    int x = 0;
    scanf("%d", &x);
    printf("%d\\n", x * x);
    return 0;
}`,
      },
      {
        id: 'B05_E2',
        chapterId: 'B05',
        title: 'Somme et moyenne réelle de deux entiers lus au clavier',
        category: 'c_code',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Écrivez un programme C qui lit deux entiers \`a\` et \`b\` avec \`scanf\`, puis affiche leur moyenne réelle avec 2 chiffres après la virgule (\`%.2f\\n\`). Attention à la division entière !`,
        starterCode: `#include <stdio.h>

int main(void) {
    int a = 0, b = 0;
    // Lisez a et b, puis affichez leur moyenne réelle au format "%.2f\n"
    return 0;
}`,
        testCases: [
          { id: 't1', label: '10 et 15 -> 12.50', stdin: '10\n15\n', expectedStdout: '12.50', isHidden: false },
          { id: 't2', label: '3 et 4 -> 3.50', stdin: '3\n4\n', expectedStdout: '3.50', isHidden: true },
        ],
        hints: [
          'Lisez a et b avec scanf("%d", &a); et scanf("%d", &b);',
          'Calculez (a + b) / 2.0 et affichez avec printf("%.2f\\n", moyenne);',
        ],
        explanation: `On combine \`scanf("%d", &a)\`, un cast ou division par \`2.0\`, et le format \`%.2f\`.`,
        referenceSolution: `#include <stdio.h>

int main(void) {
    int a = 0, b = 0;
    scanf("%d", &a);
    scanf("%d", &b);
    double moyenne = (a + b) / 2.0;
    printf("%.2f\\n", moyenne);
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B06 — CONDITIONS EN C (IF, ELSE, SWITCH)
  // ============================================================================
  {
    id: 'B06',
    trackId: 'c',
    order: 6,
    title: 'Conditions en C (if, else if, else, switch)',
    subtitle: 'Traduire les structures conditionnelles, utiliser &&, ||, ! et éviter le piège mortel if (a = b).',
    estimatedMinutes: 50,
    prerequisites: ['B05'],
    bridgeChapterIds: ['A05', 'A06'],
    objectives: [
      'Écrire des structures conditionnelles if (...) { ... } else if (...) { ... } else { ... }',
      'Utiliser les opérateurs logiques C : && (ET), || (OU), ! (NON)',
      'Ne jamais confondre le test d’égalité == et l’affectation = dans un if',
      'Utiliser switch / case / break / default sur une variable entière ou caractère',
    ],
    tags: ['if else', 'switch case', 'opérateurs && || !', 'piège == vs ='],
    lesson: {
      intuitiveExplanation: `En C, les structures \`SI ... ALORS ... SINON\` deviennent **\`if (...) { ... } else { ... }\`**, et \`SELON\` devient **\`switch (...) { case ...: break; }\`**.
Mais attention au **piège le plus célèbre du langage C** :
En C, toute valeur entière différente de \`0\` est considérée comme **vraie**, et \`0\` est considéré comme **faux**.
Si vous écrivez par erreur \`if (x = 5)\` avec un seul \`=\` au lieu de \`if (x == 5)\`, le C **écrase** \`x\` avec \`5\`, puis évalue \`5\` qui est non nul donc **toujours vrai** ! Utilisez toujours **\`==\`** pour comparer.`,
      formalDefinition: `Syntaxe des opérateurs relationnels et logiques en C :
- Égalité : **\`==\`** | Différence : **\`!=\`** | Comparaisons : \`<\`, \`<=\`, \`>\`, \`>=\`
- **ET** logique : **\`&&\`** | **OU** logique : **\`||\`** | **NON** logique : **\`!\`**
- Dans un \`switch (expr)\`, chaque branche \`case constante:\` doit se terminer par **\`break;\`** pour ne pas traverser (*fallthrough*) vers le cas suivant.`,
      analogy: `Le double égal \`==\` est une **balance à deux plateaux** qui compare deux valeurs sans les modifier. Le simple égal \`=\` est un **entonnoir** qui verse la valeur de droite dans la variable de gauche.`,
      vocabulary: [
        { french: 'Opérateur d’égalité', english: 'Equality operator (==)', definition: 'Renvoie 1 si les deux opérandes sont égaux, 0 sinon.' },
        { french: 'Évaluation en court-circuit', english: 'Short-circuit evaluation', definition: 'Dans A && B, si A est faux, B n’est même pas évalué.' },
        { french: 'Instruction break', english: 'Break statement', definition: 'Sort immédiatement d’un bloc switch ou d’une boucle.' },
      ],
      simpleExample: {
        title: 'Test de parité et de signe avec if / else if / else',
        description: 'Vérifie si un entier est négatif, nul ou positif.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    int n = -7;
    if (n > 0) {
        printf("Positif\\n");
    } else if (n < 0) {
        printf("Negatif\\n");
    } else {
        printf("Nul\\n");
    }
    return 0;
}`,
        expectedOutput: `Negatif`,
        lineByLine: [
          { line: 'if (n > 0) {', explanation: 'La condition doit obligatoirement être entourée de parenthèses (n > 0).' },
          { line: '} else if (n < 0) {', explanation: 'Testé uniquement si la première condition était fausse.' },
        ],
      },
      intermediateExample: {
        title: 'Menu de calculatrice avec switch / case / break',
        description: 'Sélectionne l’opération selon le numéro de choix.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    int choix = 2;
    int a = 10, b = 4;
    switch (choix) {
        case 1:
            printf("%d\\n", a + b);
            break;
        case 2:
            printf("%d\\n", a - b);
            break;
        default:
            printf("Choix invalide\\n");
            break;
    }
    return 0;
}`,
        expectedOutput: `6`,
        lineByLine: [
          { line: 'case 2:', explanation: 'Correspond à choix == 2 : affiche 10 - 4 = 6.' },
          { line: 'break;', explanation: 'Indispensable pour sortir du switch sans exécuter le bloc default.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Écrire `if (x = 0)` ou `if (x = 10)` avec un seul `=`.',
          whyItHappens: 'Habitude mathématique où `=` représente l’égalité.',
          howToFix: 'Relisez chaque `if` : pour tester l’égalité, il faut deux signes `==`. Notre compilateur pédagogique émet d’ailleurs un avertissement `-Wall` dès qu’il détecte `if (a = b)` !',
        },
        {
          mistake: 'Écrire `if (0 <= note <= 20)` en C.',
          whyItHappens: 'Notation mathématique d’encadrement.',
          howToFix: 'En C, `0 <= note` renvoie `0` ou `1`, puis `0 <= 20` ou `1 <= 20` est **toujours vrai** (même pour `note = 50` !). Écrivez toujours : `if (note >= 0 && note <= 20)`.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B06_C1',
          question: 'Comment écrit-on en C la condition « x est compris entre 10 et 20 inclus » ?',
          options: [
            'if (10 <= x <= 20)',
            'if (x >= 10 && x <= 20)',
            'if (x >= 10 || x <= 20)',
            'if (x == 10..20)',
          ],
          correctIndex: 1,
          explanation: 'En C, il faut combiner deux comparaisons avec l’opérateur logique ET (`&&`).',
        },
      ],
      summary: `En C, utilisez == pour l'égalité, != pour la différence, && pour ET, || pour OU, et terminez chaque case d'un switch par break;.`,
    },
    exercises: [
      {
        id: 'B06_E1',
        chapterId: 'B06',
        title: 'Corriger le bug if (x = 0)',
        category: 'bugfix',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Ce programme lit un entier \`x\` et doit afficher \`Zero\` si \`x\` vaut 0, et \`Non zero\` sinon. Mais il contient le bug classique \`=\` au lieu de \`==\`. Corrigez-le !`,
        starterCode: `#include <stdio.h>

int main(void) {
    int x = 0;
    scanf("%d", &x);
    if (x = 0) {
        printf("Zero\\n");
    } else {
        printf("Non zero\\n");
    }
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'Entrée 0 -> Zero', stdin: '0\n', expectedStdout: 'Zero', isHidden: false },
          { id: 't2', label: 'Entrée 5 -> Non zero', stdin: '5\n', expectedStdout: 'Non zero', isHidden: false },
        ],
        hints: ['Remplacez `if (x = 0)` par `if (x == 0)`.'],
        explanation: `Avec \`if (x = 0)\`, \`x\` reçoit \`0\` et l'expression vaut \`0\` (faux), ce qui affichait \`Non zero\` même quand on entrait \`0\` ! Avec \`==\`, le test est exact.`,
        referenceSolution: `#include <stdio.h>

int main(void) {
    int x = 0;
    scanf("%d", &x);
    if (x == 0) {
        printf("Zero\\n");
    } else {
        printf("Non zero\\n");
    }
    return 0;
}`,
      },
      {
        id: 'B06_E2',
        chapterId: 'B06',
        title: 'Année bissextile en C',
        category: 'c_code',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Une année \`a\` est bissextile si elle est divisible par 4 ET non divisible par 100, OU si elle est divisible par 400.
Écrivez un programme C qui lit un entier \`a\` et affiche \`1\` si l'année est bissextile, \`0\` sinon.`,
        starterCode: `#include <stdio.h>

int main(void) {
    int a = 0;
    scanf("%d", &a);
    // Testez si a est bissextile et affichez 1 ou 0
    return 0;
}`,
        testCases: [
          { id: 't1', label: '2024 (divisible par 4, pas par 100) -> 1', stdin: '2024\n', expectedStdout: '1', isHidden: false },
          { id: 't2', label: '1900 (divisible par 100 mais pas 400) -> 0', stdin: '1900\n', expectedStdout: '0', isHidden: false },
          { id: 't3', label: '2000 (divisible par 400) -> 1', stdin: '2000\n', expectedStdout: '1', isHidden: true },
          { id: 't4', label: '2023 -> 0', stdin: '2023\n', expectedStdout: '0', isHidden: true },
        ],
        hints: [
          '« a est divisible par 4 » s’écrit (a % 4 == 0).',
          'Condition complète : if ((a % 4 == 0 && a % 100 != 0) || (a % 400 == 0))',
        ],
        explanation: `On combine \`%\`, \`==\`, \`!=\`, \`&&\` et \`||\` pour exprimer la règle grégorienne des années bissextiles.`,
        referenceSolution: `#include <stdio.h>

int main(void) {
    int a = 0;
    scanf("%d", &a);
    if ((a % 4 == 0 && a % 100 != 0) || (a % 400 == 0)) {
        printf("1\\n");
    } else {
        printf("0\\n");
    }
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B07 — BOUCLES EN C (FOR, WHILE, DO...WHILE)
  // ============================================================================
  {
    id: 'B07',
    trackId: 'c',
    order: 7,
    title: 'Boucles en C (for, while, do...while)',
    subtitle: 'Répéter des traitements en C avec les trois boucles standard et contrôler le flux.',
    estimatedMinutes: 55,
    prerequisites: ['B06'],
    bridgeChapterIds: ['A07'],
    objectives: [
      'Écrire une boucle for (int i = 0; i < n; i++) en comprenant ses 3 parties',
      'Écrire une boucle while (condition) et une boucle do { ... } while (condition);',
      'Comprendre l’effet de break (sortir de la boucle) et continue (passer au tour suivant)',
    ],
    tags: ['for', 'while', 'do while', 'break', 'continue'],
    lesson: {
      intuitiveExplanation: `En C, la boucle \`POUR\` s'écrit **\`for (initialisation; condition; progression)\`**.
Toute la mécanique de la boucle est regroupée de manière ultra-compacte sur une seule ligne :
\`for (int i = 1; i <= n; i++)\` signifie :
1. On démarre avec \`i = 1\`,
2. Tant que \`i <= n\` est vrai, on exécute le corps de la boucle,
3. À la fin de chaque tour, on incrémente \`i\` (\`i++\`).`,
      formalDefinition: `Les trois boucles du langage C99 :
1. **\`for (init; cond; step) { ... }\`** : idéale lorsque le nombre d'itérations ou l'intervalle d'indice est connu.
2. **\`while (cond) { ... }\`** : teste la condition **avant** chaque tour (0 tour possible).
3. **\`do { ... } while (cond);\`** : teste la condition **après** chaque tour (au moins 1 tour garanti ; notez le \`;\` final obligatoire).`,
      analogy: `L'en-tête \`for (int i = 0; i < 10; i++)\` est le **tableau de bord complet** d'un pilote : point de départ (\`i = 0\`), destination (\`i < 10\`), et vitesse de croisière (\`i++\`) réunis au même endroit.`,
      vocabulary: [
        { french: 'Boucle for', english: 'For loop', definition: 'Boucle regroupant initialisation, condition de maintien et mise à jour du compteur.' },
        { french: 'Instruction continue', english: 'Continue statement', definition: 'Saute le reste du tour actuel et passe directement à l’itération suivante.' },
      ],
      simpleExample: {
        title: 'Calcul de la factorielle avec une boucle for',
        description: 'Produit des entiers de 1 à n.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    int n = 5;
    int fact = 1;
    for (int i = 1; i <= n; i++) {
        fact = fact * i;
    }
    printf("5! = %d\\n", fact);
    return 0;
}`,
        expectedOutput: `5! = 120`,
        lineByLine: [
          { line: 'int fact = 1;', explanation: 'Un produit s’initialise toujours à 1 (élément neutre de la multiplication).' },
          { line: 'for (int i = 1; i <= n; i++)', explanation: 'Fait varier i de 1 à 5 inclus.' },
        ],
      },
      intermediateExample: {
        title: 'Somme des chiffres d’un entier avec while',
        description: 'On extrait le dernier chiffre avec % 10 et on le retire avec / 10 tant que n > 0.',
        language: 'c',
        code: `#include <stdio.h>

int main(void) {
    int n = 472;
    int somme = 0;
    while (n > 0) {
        somme += n % 10;
        n = n / 10;
    }
    printf("Somme des chiffres = %d\\n", somme);
    return 0;
}`,
        expectedOutput: `Somme des chiffres = 13`,
        lineByLine: [
          { line: 'somme += n % 10;', explanation: 'Ajoute le chiffre des unités (2, puis 7, puis 4).' },
          { line: 'n = n / 10;', explanation: 'Décale le nombre d’un rang décimal (472 -> 47 -> 4 -> 0).' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Mettre un point-virgule juste après la parenthèse du `for` : `for (int i = 0; i < 5; i++); { ... }`.',
          whyItHappens: 'Réflexe de mettre un `;` à la fin de chaque ligne.',
          howToFix: 'Un `;` juste après `for (...)` ou `while (...)` crée une boucle vide qui tourne dans le vide, et le bloc `{ ... }` qui suit ne s’exécute qu’une seule fois après la boucle !',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B07_C1',
          question: 'Combien de fois le corps de la boucle `for (int i = 0; i < 5; i++)` est-il exécuté ?',
          options: [
            '4 fois',
            '5 fois (pour i = 0, 1, 2, 3, 4)',
            '6 fois (pour i = 0, 1, 2, 3, 4, 5)',
            'Une infinité de fois',
          ],
          correctIndex: 1,
          explanation: 'i prend les 5 valeurs 0, 1, 2, 3 et 4. Dès que i atteint 5, i < 5 devient faux.',
        },
      ],
      summary: `Utilisez for (int i = 0; i < n; i++) quand le nombre de tours est connu, et while (condition) quand l'arrêt dépend d'un événement dynamique.`,
    },
    exercises: [
      {
        id: 'B07_E1',
        chapterId: 'B07',
        title: 'Prédire la sortie d’une boucle while',
        category: 'prediction',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Qu'affiche ce programme C ?`,
        codeSnippet: `#include <stdio.h>

int main(void) {
    int n = 1;
    int s = 0;
    while (n < 10) {
        s += n;
        n = n * 2;
    }
    printf("%d\\n", s);
    return 0;
}`,
        expectedAnswer: '15',
        acceptedAnswers: ['15'],
        hints: ['Quelles valeurs successives prend n ? 1, 2, 4, 8, puis 16 (qui sort de la boucle).'],
        explanation: `\`n\` prend les valeurs 1, 2, 4 et 8. La somme \`s\` vaut donc $1 + 2 + 4 + 8 = 15$.`,
      },
      {
        id: 'B07_E2',
        chapterId: 'B07',
        title: 'Somme des carrés de 1 à N en C',
        category: 'c_code',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Écrivez un programme C qui lit un entier \`n\` ($n \\ge 1$) et affiche la somme des carrés $1^2 + 2^2 + \\dots + n^2$.`,
        starterCode: `#include <stdio.h>

int main(void) {
    int n = 0;
    scanf("%d", &n);
    // Calculez et affichez la somme des carrés de 1 à n
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'n = 3 (1 + 4 + 9 = 14)', stdin: '3\n', expectedStdout: '14', isHidden: false },
          { id: 't2', label: 'n = 5 (55)', stdin: '5\n', expectedStdout: '55', isHidden: false },
          { id: 't3', label: 'n = 1 (1)', stdin: '1\n', expectedStdout: '1', isHidden: true },
        ],
        hints: [
          'Initialisez int somme = 0;',
          'Avec for (int i = 1; i <= n; i++), ajoutez i * i à somme.',
        ],
        explanation: `La boucle \`for\` accumule \`i * i\` dans \`somme\` pour \`i\` allant de \`1\` à \`n\`.`,
        referenceSolution: `#include <stdio.h>

int main(void) {
    int n = 0;
    scanf("%d", &n);
    int somme = 0;
    for (int i = 1; i <= n; i++) {
        somme += i * i;
    }
    printf("%d\\n", somme);
    return 0;
}`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE B08 — FONCTIONS, PROTOTYPES ET RÉCURSIVITÉ EN C
  // ============================================================================
  {
    id: 'B08',
    trackId: 'c',
    order: 8,
    title: 'Fonctions, prototypes et récursivité en C',
    subtitle: 'Structurer un programme C en fonctions typées, déclarer des prototypes et utiliser void.',
    estimatedMinutes: 55,
    prerequisites: ['B07'],
    bridgeChapterIds: ['A08', 'A09'],
    objectives: [
      'Définir une fonction en C avec son type de retour et ses paramètres typés',
      'Utiliser le type de retour void pour une procédure qui ne renvoie rien',
      'Comprendre le rôle d’un prototype de fonction placé avant main',
      'Implémenter une fonction récursive en C',
    ],
    tags: ['fonctions', 'prototype', 'void', 'return', 'récursivité C'],
    lesson: {
      intuitiveExplanation: `En C, les fonctions et les procédures du pseudo-code sont unifiées :
- Une **fonction** indique le type de la valeur qu'elle renvoie devant son nom : \`int carre(int x) { return x * x; }\`.
- Une **procédure** (qui ne renvoie rien) utilise simplement le mot-clé **\`void\`** (« vide ») comme type de retour : \`void afficherLigne(int n) { ... }\`.
De plus, comme le compilateur C lit le fichier **de haut en bas**, toute fonction appelée dans \`main\` doit soit être définie **avant** \`main\`, soit être annoncée par son **prototype** (sa première ligne suivie d'un \`;\`) en haut du fichier.`,
      formalDefinition: `- **Prototype (déclaration)** : \`int max(int a, int b);\` — informe le compilateur du nom, du type de retour et des types des paramètres.
- **Définition** : \`int max(int a, int b) { ... }\` — contient le corps effectif de la fonction.
- **Passage par valeur** : en C, les arguments sont **copiés** dans les paramètres de la fonction. Modifier un paramètre \`x\` à l'intérieur d'une fonction ne modifie **pas** la variable de \`main\`.`,
      analogy: `Le **prototype** en haut du fichier est le **sommaire d'un livre** : il prévient le lecteur (\`main\`) qu'un chapitre \`calculerPGCD\` existe plus bas et précise comment l'utiliser.`,
      vocabulary: [
        { french: 'Prototype de fonction', english: 'Function prototype', definition: 'Signature de la fonction terminée par un point-virgule, placée avant son premier appel.' },
        { french: 'Type vide', english: 'void type', definition: 'Mot-clé indiquant qu’une fonction ne renvoie aucune valeur (ou ne prend aucun paramètre).' },
        { french: 'Passage par valeur', english: 'Pass by value', definition: 'Mécanisme par défaut en C où la fonction reçoit une copie indépendante des arguments.' },
      ],
      simpleExample: {
        title: 'Prototype et définition d’une fonction max et d’une fonction void',
        description: 'Utilisation d’un prototype avant main et définition après main.',
        language: 'c',
        code: `#include <stdio.h>

// Prototypes
int maximum(int a, int b);
void afficherResultat(int valeur);

int main(void) {
    int m = maximum(18, 42);
    afficherResultat(m);
    return 0;
}

int maximum(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}

void afficherResultat(int valeur) {
    printf("Max = %d\\n", valeur);
}`,
        expectedOutput: `Max = 42`,
        lineByLine: [
          { line: 'int maximum(int a, int b);', explanation: 'Prototype : annonce la signature de maximum au compilateur avant main.' },
          { line: 'void afficherResultat(int valeur)', explanation: 'Type void : cette fonction affiche un message mais ne renvoie aucune valeur.' },
        ],
      },
      intermediateExample: {
        title: 'Fonction récursive PGCD (Euclide) en C',
        description: 'Traduction directe de l’algorithme d’Euclide récursif vu au chapitre A09.',
        language: 'c',
        code: `#include <stdio.h>

int pgcd(int a, int b) {
    if (b == 0) {
        return a;
    }
    return pgcd(b, a % b);
}

int main(void) {
    printf("PGCD = %d\\n", pgcd(60, 24));
    return 0;
}`,
        expectedOutput: `PGCD = 12`,
        lineByLine: [
          { line: 'if (b == 0) return a;', explanation: 'Cas de base arrêtant la récursion.' },
          { line: 'return pgcd(b, a % b);', explanation: 'Appel récursif avec le reste modulo %.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Écrire `int maFonction(int a, b)` en oubliant de répéter le type devant `b`.',
          whyItHappens: 'En pseudo-code ou dans les déclarations locales, on peut regrouper `a, b : ENTIER`.',
          howToFix: 'Dans l’en-tête d’une fonction C, **chaque paramètre doit obligatoirement avoir son propre type** : `int maFonction(int a, int b)`.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'B08_C1',
          question: 'Quel type de retour utilise-t-on en C pour une fonction qui ne renvoie aucune valeur ?',
          options: [
            'int',
            'null',
            'void',
            'empty',
          ],
          correctIndex: 2,
          explanation: 'Le mot-clé `void` indique l’absence de valeur de retour.',
        },
      ],
      summary: `Une fonction C précise son type de retour (int, double, void) et le type de chacun de ses paramètres. Les arguments sont passés par valeur (copie).`,
    },
    exercises: [
      {
        id: 'B08_E1',
        chapterId: 'B08',
        title: 'Passage par valeur en C',
        category: 'prediction',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Qu'affiche ce programme C ? (Rappelez-vous que les arguments sont passés par valeur/copie en C !)`,
        codeSnippet: `#include <stdio.h>

void tenterModification(int x) {
    x = x + 100;
}

int main(void) {
    int a = 25;
    tenterModification(a);
    printf("%d\\n", a);
    return 0;
}`,
        expectedAnswer: '25',
        acceptedAnswers: ['25'],
        hints: ['La fonction tenterModification reçoit une copie de a dans sa variable locale x.'],
        explanation: `Comme \`a\` est passé par valeur, seul le paramètre local \`x\` passe à 125. Dans \`main\`, \`a\` vaut toujours \`25\`. (Nous verrons au chapitre B12 comment modifier \`a\` grâce aux pointeurs !)`,
      },
      {
        id: 'B08_E2',
        chapterId: 'B08',
        title: 'Écrire une fonction valeurAbsolue en C',
        category: 'c_code',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Écrivez une fonction \`int valeurAbsolue(int x)\` qui renvoie \`-x\` si \`x < 0\`, et \`x\` sinon.
Dans \`main\`, lisez un entier \`n\` au clavier et affichez \`valeurAbsolue(n)\`.`,
        starterCode: `#include <stdio.h>

int valeurAbsolue(int x) {
    // Retournez la valeur absolue de x
}

int main(void) {
    int n = 0;
    scanf("%d", &n);
    printf("%d\\n", valeurAbsolue(n));
    return 0;
}`,
        testCases: [
          { id: 't1', label: 'Entier négatif -42 -> 42', stdin: '-42\n', expectedStdout: '42', isHidden: false },
          { id: 't2', label: 'Entier positif 19 -> 19', stdin: '19\n', expectedStdout: '19', isHidden: false },
          { id: 't3', label: 'Zéro -> 0', stdin: '0\n', expectedStdout: '0', isHidden: true },
        ],
        hints: ['Si x < 0, faites return -x; sinon return x;'],
        explanation: `La fonction \`valeurAbsolue\` teste le signe de son paramètre \`x\` et renvoie toujours un entier positif ou nul.`,
        referenceSolution: `#include <stdio.h>

int valeurAbsolue(int x) {
    if (x < 0) {
        return -x;
    }
    return x;
}

int main(void) {
    int n = 0;
    scanf("%d", &n);
    printf("%d\\n", valeurAbsolue(n));
    return 0;
}`,
      },
    ],
  },
];
