// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ALGO_CHAPTERS_PART2: any[] = [
  // ============================================================================
  // CHAPITRE A09 — PARAMÈTRES, VALEURS DE RETOUR, DÉCOMPOSITION ET RÉCURSIVITÉ
  // ============================================================================
  {
    id: 'A09',
    trackId: 'algo',
    order: 9,
    title: 'Paramètres, décomposition modulaire et récursivité',
    subtitle: 'Comprendre la pile d’appels, la portée locale et les appels récursifs avec cas de base.',
    estimatedMinutes: 55,
    prerequisites: ['A08'],
    bridgeChapterIds: ['B08', 'B09'],
    objectives: [
      'Comprendre l’indépendance des variables locales entre l’appelant et la fonction appelée',
      'Décomposer un problème complexe en plusieurs sous-fonctions qui s’appellent mutuellement',
      'Comprendre le principe de la récursivité : cas de base (condition d’arrêt) et appel récursif',
      'Tracer une fonction récursive simple (factorielle, puissance, PGCD d’Euclide)',
    ],
    tags: ['portée', 'pile d’appels', 'récursivité', 'cas de base'],
    lesson: {
      intuitiveExplanation: `Quand une fonction A appelle une fonction B, chacune travaille dans sa propre « feuille de brouillon » privée. Même si A et B possèdent toutes les deux une variable nommée \`x\`, ce sont deux boîtes mémoires totalement distinctes !
Et que se passe-t-il si une fonction s'appelle **elle-même** avec un problème légèrement plus petit ? C'est ce qu'on appelle la **récursivité** : une méthode élégante pour résoudre des problèmes définis par récurrence (comme $n! = n \\times (n-1)!$).`,
      formalDefinition: `Chaque appel de sous-programme crée un **cadre d'activation** (*Stack Frame*) contenant ses paramètres et ses variables locales.
Une fonction est **récursive** si son corps contient au moins un appel à elle-même. Pour terminer, toute fonction récursive doit comporter :
1. Un ou plusieurs **cas de base** (*base cases*) qui renvoient directement un résultat sans appel récursif.
2. Un **cas général** (*recursive step*) qui rappelle la fonction sur une entrée strictement plus proche du cas de base.`,
      analogy: `Imaginez des **poupées russes (Matriochkas)** : pour ouvrir une grande poupée, vous l'ouvrez et trouvez une poupée plus petite (appel récursif), jusqu'à tomber sur la toute petite poupée pleine qui ne s'ouvre pas (le **cas de base**). Ensuite, vous refermez chaque poupée dans l'ordre inverse.`,
      vocabulary: [
        { french: 'Portée locale', english: 'Local scope', definition: 'Zone de visibilité limitée à l’intérieur de la fonction où la variable est déclarée.' },
        { french: 'Pile d’appels', english: 'Call stack', definition: 'Structure mémoire empilant les contextes des fonctions en cours d’exécution.' },
        { french: 'Récursivité', english: 'Recursion', definition: 'Mécanisme par lequel une fonction s’appelle elle-même.' },
        { french: 'Cas de base (Condition d’arrêt)', english: 'Base case', definition: 'Condition indispensable qui stoppe les appels récursifs.' },
      ],
      simpleExample: {
        title: 'Calcul récursif de la factorielle',
        description: 'Calcul de n! = n * (n - 1)! avec cas de base 0! = 1 et 1! = 1.',
        language: 'pseudocode',
        code: `FONCTION factorielle(n : ENTIER) : ENTIER
DEBUT
    SI n <= 1 ALORS
        RETOURNER 1
    SINON
        RETOURNER n * factorielle(n - 1)
    FINSI
FINFONCTION

ALGORITHME TestFact
DEBUT
    AFFICHER(factorielle(4))
FIN`,
        expectedOutput: `24`,
        lineByLine: [
          { line: 'SI n <= 1 ALORS RETOURNER 1', explanation: 'Cas de base : si n vaut 0 ou 1, on s’arrête immédiatement et on renvoie 1.' },
          { line: 'RETOURNER n * factorielle(n - 1)', explanation: 'Appel récursif : n - 1 se rapproche strictement de 1.' },
          { line: 'AFFICHER(factorielle(4))', explanation: 'Calcule 4 * 3 * 2 * 1 = 24.' },
        ],
      },
      intermediateExample: {
        title: 'Algorithme d’Euclide récursif (PGCD)',
        description: 'Le PGCD de a et b vaut a si b = 0, sinon il vaut le PGCD de b et (a MOD b).',
        language: 'pseudocode',
        code: `FONCTION pgcd(a : ENTIER, b : ENTIER) : ENTIER
DEBUT
    SI b == 0 ALORS
        RETOURNER a
    SINON
        RETOURNER pgcd(b, a MOD b)
    FINSI
FINFONCTION

ALGORITHME TestEuclide
DEBUT
    AFFICHER(pgcd(48, 18))
FIN`,
        expectedOutput: `6`,
        lineByLine: [
          { line: 'SI b == 0 ALORS RETOURNER a', explanation: 'Cas de base d’Euclide : lorsque le reste est nul, le diviseur courant a est le PGCD.' },
          { line: 'RETOURNER pgcd(b, a MOD b)', explanation: 'pgcd(48, 18) -> pgcd(18, 12) -> pgcd(12, 6) -> pgcd(6, 0) -> 6.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Oublier le cas de base dans une fonction récursive.',
          whyItHappens: 'On écrit directement la formule de récurrence `RETOURNER n * factorielle(n - 1)`.',
          howToFix: 'Toujours commencer une fonction récursive par `SI condition_arret ALORS RETOURNER valeur_base`. Sans cela, la pile d’appels déborde (*Stack Overflow*).',
        },
        {
          mistake: 'Appeler la fonction récursive avec le même paramètre `factorielle(n)` au lieu de `factorielle(n - 1)`.',
          whyItHappens: 'Erreur d’inattention sur la progression vers le cas de base.',
          howToFix: 'Vérifier que l’argument diminue (ou converge) strictement à chaque appel récursif.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'A09_C1',
          question: 'Que se passe-t-il si une fonction récursive ne possède pas de cas de base ?',
          options: [
            'Elle renvoie 0 automatiquement',
            'Elle provoque une récursion infinie et un débordement de la pile d’appels (Stack Overflow)',
            'Le compilateur ajoute le cas de base tout seul',
            'Elle s’exécute une seule fois',
          ],
          correctIndex: 1,
          explanation: 'Sans cas de base, les cadres d’appels s’empilent indéfiniment jusqu’à saturation de la mémoire.',
        },
      ],
      summary: `Les variables déclarées dans une fonction ont une portée locale. La récursivité résout un problème en s'appelant sur un sous-problème plus petit jusqu'à atteindre un cas de base obligatoire.`,
    },
    exercises: [
      {
        id: 'A09_E1',
        chapterId: 'A09',
        title: 'Prédire un appel récursif',
        category: 'prediction',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Qu'affiche l'algorithme suivant ?`,
        codeSnippet: `FONCTION mystere(n : ENTIER) : ENTIER
DEBUT
    SI n == 0 ALORS
        RETOURNER 0
    SINON
        RETOURNER n + mystere(n - 1)
    FINSI
FINFONCTION

ALGORITHME Test
DEBUT
    AFFICHER(mystere(4))
FIN`,
        expectedAnswer: '10',
        acceptedAnswers: ['10'],
        hints: ['Calculez de proche en proche : mystere(4) = 4 + mystere(3)...'],
        explanation: `mystere(4) = 4 + 3 + 2 + 1 + 0 = 10.`,
      },
      {
        id: 'A09_E2',
        chapterId: 'A09',
        title: 'Puissance entière récursive',
        category: 'pseudocode',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Écrivez une fonction récursive \`puissance(x : ENTIER, n : ENTIER) : ENTIER\` qui calcule $x^n$ (pour $n \\ge 0$), en utilisant le cas de base $x^0 = 1$ et la relation $x^n = x \\times x^{n-1}$.
Dans l'algorithme principal, lisez \`x\` puis \`n\` et affichez \`puissance(x, n)\`.`,
        starterCode: `FONCTION puissance(x : ENTIER, n : ENTIER) : ENTIER
DEBUT
    // Cas de base n == 0 et appel récursif
FINFONCTION

ALGORITHME CalculPuissance
VARIABLES
    x, n : ENTIER
DEBUT
    LIRE(x)
    LIRE(n)
    AFFICHER(puissance(x, n))
FIN`,
        testCases: [
          { id: 't1', label: '2 puissance 5', stdin: '2\n5\n', expectedStdout: '32', isHidden: false },
          { id: 't2', label: 'Exposant nul (7^0)', stdin: '7\n0\n', expectedStdout: '1', isHidden: false },
          { id: 't3', label: '3 puissance 4', stdin: '3\n4\n', expectedStdout: '81', isHidden: true },
        ],
        hints: [
          'Si n == 0, retournez 1.',
          'Sinon, retournez x * puissance(x, n - 1).',
        ],
        explanation: `Le cas de base $n = 0$ renvoie $1$. Pour $n > 0$, chaque appel multiplie $x$ par $x^{n-1}$.`,
        referenceSolution: `FONCTION puissance(x : ENTIER, n : ENTIER) : ENTIER
DEBUT
    SI n == 0 ALORS
        RETOURNER 1
    SINON
        RETOURNER x * puissance(x, n - 1)
    FINSI
FINFONCTION

ALGORITHME CalculPuissance
VARIABLES
    x, n : ENTIER
DEBUT
    LIRE(x)
    LIRE(n)
    AFFICHER(puissance(x, n))
FIN`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE A10 — TABLEAUX ET PARCOURS DE DONNÉES
  // ============================================================================
  {
    id: 'A10',
    trackId: 'algo',
    order: 10,
    title: 'Tableaux et parcours de données',
    subtitle: 'Stocker une collection indexée à partir de 0 et la parcourir avec une boucle.',
    estimatedMinutes: 55,
    prerequisites: ['A07'],
    bridgeChapterIds: ['B10'],
    objectives: [
      'Déclarer un tableau de taille fixe et comprendre l’indiçage à partir de 0 (0 à N-1)',
      'Accéder en lecture et en écriture à une case T[i]',
      'Parcourir un tableau dans l’ordre croissant ou décroissant des indices',
      'Éviter l’erreur critique de débordement d’indice (Index Out of Bounds)',
    ],
    tags: ['tableau', 'indice', 'parcours', 'collection'],
    lesson: {
      intuitiveExplanation: `Imaginez que vous deviez stocker les notes de 50 étudiants. Déclarer \`note1\`, \`note2\`, ..., \`note50\` serait ingérable !
Un **tableau** (*Array*) regroupe sous un seul nom une rangée de cases numérotées de **0** à **N - 1**. Grâce à une boucle \`POUR i ALLANT DE 0 A N - 1\`, quelques lignes suffisent pour traiter 10 ou 10 000 éléments.`,
      formalDefinition: `Un **tableau** de taille $N$ est une structure de données homogène (tous les éléments ont le même type) stockée de façon contiguë.
En informatique (et en langage C), les indices commencent à **0** :
- Le premier élément est à l'indice \`0\` (\`tab[0]\`).
- Le dernier élément est à l'indice \`N - 1\` (\`tab[N - 1]\`).`,
      analogy: `Un tableau est comme une **rangée de boîtes aux lettres** dans un immeuble, numérotées de \`0\` à \`N - 1\`. L'indice \`i\` est le numéro de la boîte.`,
      vocabulary: [
        { french: 'Tableau', english: 'Array', definition: 'Collection de cases de même type accessibles par leur indice.' },
        { french: 'Indice (ou Index)', english: 'Index', definition: 'Position entière d’un élément dans le tableau (commence à 0).' },
        { french: 'Débordement de tableau', english: 'Index out of bounds', definition: 'Erreur consistant à accéder à un indice négatif ou supérieur ou égal à la taille N.' },
      ],
      simpleExample: {
        title: 'Remplissage et affichage d’un tableau de 4 carrés',
        description: 'On remplit tab[i] avec i * i puis on affiche chaque case.',
        language: 'pseudocode',
        code: `ALGORITHME TableauCarres
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i : ENTIER
DEBUT
    POUR i ALLANT DE 0 A 3 FAIRE
        tab[i] <- i * i
    FINPOUR
    POUR i ALLANT DE 0 A 3 FAIRE
        AFFICHER(tab[i])
    FINPOUR
FIN`,
        expectedOutput: `0\n1\n4\n9`,
        lineByLine: [
          { line: 'tab : TABLEAU[4] DE ENTIER', explanation: 'Réserve 4 cases entières : tab[0], tab[1], tab[2], tab[3].' },
          { line: 'POUR i ALLANT DE 0 A 3 FAIRE', explanation: 'Parcourt tous les indices valides de 0 à 4 - 1 = 3.' },
        ],
      },
      intermediateExample: {
        title: 'Affichage inversé d’un tableau lu en entrée',
        description: 'On lit 4 entiers dans un tableau, puis on les affiche du dernier au premier.',
        language: 'pseudocode',
        code: `ALGORITHME InverseTableau
VARIABLES
    notes : TABLEAU[4] DE ENTIER
    i : ENTIER
DEBUT
    POUR i ALLANT DE 0 A 3 FAIRE
        LIRE(notes[i])
    FINPOUR
    POUR i ALLANT DE 3 A 0 PAS -1 FAIRE
        AFFICHER(notes[i])
    FINPOUR
FIN`,
        expectedOutput: `40\n30\n20\n10`,
        lineByLine: [
          { line: 'LIRE(notes[i])', explanation: 'Stocke successivement les 4 entrées dans notes[0]..notes[3].' },
          { line: 'POUR i ALLANT DE 3 A 0 PAS -1 FAIRE', explanation: 'Parcours à rebours de l’indice 3 jusqu’à l’indice 0.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Accéder à `tab[N]` pour un tableau de taille `N`.',
          whyItHappens: 'Confusion entre le nombre d’éléments ($N$) et l’indice du dernier élément ($N - 1$).',
          howToFix: 'Toujours retenir : un tableau de taille `N` va de `0` à `N - 1`. La case `tab[N]` est hors-limite !',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'A10_C1',
          question: 'Pour un tableau `T : TABLEAU[10] DE ENTIER`, quels sont les indices de la première et de la dernière case ?',
          options: [
            '1 et 10',
            '0 et 10',
            '0 et 9',
            '1 et 9',
          ],
          correctIndex: 2,
          explanation: 'Les 10 cases sont numérotées de 0 à 9 inclus.',
        },
      ],
      summary: `Un tableau de taille N stocke N éléments de même type aux indices 0 à N-1. On le parcourt naturellement avec une boucle POUR.`,
    },
    exercises: [
      {
        id: 'A10_E1',
        chapterId: 'A10',
        title: 'Indice du dernier élément',
        category: 'qcm',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Si \`valeurs : TABLEAU[6] DE ENTIER\`, quelle instruction provoque une erreur de débordement d'indice ?`,
        choices: [
          'valeurs[0] <- 10',
          'valeurs[5] <- 10',
          'valeurs[6] <- 10',
          'valeurs[2] <- 10',
        ],
        expectedAnswer: 'valeurs[6] <- 10',
        hints: ['Quels sont les indices valides pour une taille de 6 ?'],
        explanation: `Pour une taille 6, les indices valides vont de 0 à 5. L'indice 6 est hors des bornes du tableau.`,
      },
      {
        id: 'A10_E2',
        chapterId: 'A10',
        title: 'Doubler les éléments d’un tableau',
        category: 'pseudocode',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Écrivez un algorithme qui lit 4 entiers dans un tableau \`tab : TABLEAU[4] DE ENTIER\`, multiplie chaque case par 2, puis affiche les 4 cases dans l'ordre.`,
        starterCode: `ALGORITHME DoublerTableau
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i : ENTIER
DEBUT
    // Lire les 4 éléments, les multiplier par 2, et les afficher
FIN`,
        testCases: [
          { id: 't1', label: '1, 2, 3, 4', stdin: '1\n2\n3\n4\n', expectedStdout: '2\n4\n6\n8', isHidden: false },
          { id: 't2', label: 'Nombres négatifs et zéro', stdin: '-5\n0\n10\n7\n', expectedStdout: '-10\n0\n20\n14', isHidden: true },
        ],
        hints: [
          'Utilisez une boucle POUR i ALLANT DE 0 A 3 FAIRE.',
          'Dans la boucle, lisez tab[i], remplacez tab[i] par tab[i] * 2, puis affichez tab[i].',
        ],
        explanation: `On parcourt les indices de 0 à 3 pour lire, transformer et afficher chaque élément.`,
        referenceSolution: `ALGORITHME DoublerTableau
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i : ENTIER
DEBUT
    POUR i ALLANT DE 0 A 3 FAIRE
        LIRE(tab[i])
        tab[i] <- tab[i] * 2
        AFFICHER(tab[i])
    FINPOUR
FIN`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE A11 — SOMME, MOYENNE, COMPTAGE, MINIMUM ET MAXIMUM
  // ============================================================================
  {
    id: 'A11',
    trackId: 'algo',
    order: 11,
    title: 'Somme, moyenne, comptage, minimum et maximum',
    subtitle: 'Les cinq schémas algorithmiques fondamentaux sur un tableau.',
    estimatedMinutes: 55,
    prerequisites: ['A10'],
    bridgeChapterIds: ['B10'],
    objectives: [
      'Calculer la somme et la moyenne des éléments d’un tableau',
      'Compter le nombre d’éléments vérifiant un critère donné',
      'Trouver le minimum ou le maximum d’un tableau en l’initialisant avec le premier élément `tab[0]`',
    ],
    tags: ['accumulateur', 'compteur', 'minimum', 'maximum', 'moyenne'],
    lesson: {
      intuitiveExplanation: `Presque tous les traitements statistiques sur des données reposent sur trois briques :
1. **L'accumulateur** (\`somme <- somme + tab[i]\`), initialisé à \`0\`.
2. **Le compteur** (\`nb <- nb + 1\` quand une condition est vraie), initialisé à \`0\`.
3. **Le champion provisoire** (\`max <- tab[0]\`), que l'on met à jour dès qu'on rencontre un élément plus grand.`,
      formalDefinition: `Pour rechercher un **extrémum** (minimum ou maximum) dans un tableau non vide $T[0..N-1]$ :
- On initialise \`extremum <- T[0]\` (et **jamais** à \`0\`, sinon l'algorithme échoue sur un tableau de nombres tous négatifs !).
- On parcourt \`i\` de \`1\` à \`N - 1\` : si \`T[i] > max\`, alors \`max <- T[i]\`.`,
      analogy: `Pour élire le plus grand joueur d'une équipe : vous désignez le premier joueur (\`T[0]\`) comme détenteur provisoire du record. Puis chaque joueur suivant (\`1\` à \`N-1\`) se mesure à lui : s'il est plus grand, il devient le nouveau détenteur du record.`,
      vocabulary: [
        { french: 'Accumulateur', english: 'Accumulator', definition: 'Variable qui cumule progressivement une somme ou un produit.' },
        { french: 'Compteur conditionnel', english: 'Conditional counter', definition: 'Variable incrémentée de 1 uniquement lorsqu’un élément satisfait un test.' },
        { french: 'Extrémum', english: 'Extremum (Min / Max)', definition: 'Valeur minimale ou maximale d’une collection.' },
      ],
      simpleExample: {
        title: 'Recherche du maximum dans un tableau',
        description: 'Initialisation sur tab[0] puis comparaison sur les indices 1 à N-1.',
        language: 'pseudocode',
        code: `ALGORITHME ChercherMax
VARIABLES
    tab : TABLEAU[5] DE ENTIER
    i, max : ENTIER
DEBUT
    tab[0] <- -12
    tab[1] <- -5
    tab[2] <- -30
    tab[3] <- -2
    tab[4] <- -8
    max <- tab[0]
    POUR i ALLANT DE 1 A 4 FAIRE
        SI tab[i] > max ALORS
            max <- tab[i]
        FINSI
    FINPOUR
    AFFICHER(max)
FIN`,
        expectedOutput: `-2`,
        lineByLine: [
          { line: 'max <- tab[0]', explanation: 'Initialise max avec le premier élément (-12). Si on avait mis 0, le résultat aurait été 0 (faux !).' },
          { line: 'SI tab[i] > max ALORS max <- tab[i]', explanation: 'Met à jour le record dès qu’on trouve une valeur supérieure.' },
        ],
      },
      intermediateExample: {
        title: 'Somme et comptage des valeurs positives',
        description: 'Calculer la somme totale et le nombre de valeurs strictement positives.',
        language: 'pseudocode',
        code: `ALGORITHME StatsTableau
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i, somme, nbPositifs : ENTIER
DEBUT
    tab[0] <- 10
    tab[1] <- -4
    tab[2] <- 6
    tab[3] <- 0
    somme <- 0
    nbPositifs <- 0
    POUR i ALLANT DE 0 A 3 FAIRE
        somme <- somme + tab[i]
        SI tab[i] > 0 ALORS
            nbPositifs <- nbPositifs + 1
        FINSI
    FINPOUR
    AFFICHER("Somme =", somme)
    AFFICHER("Positifs =", nbPositifs)
FIN`,
        expectedOutput: `Somme = 12\nPositifs = 2`,
        lineByLine: [
          { line: 'somme <- 0 / nbPositifs <- 0', explanation: 'Toujours initialiser les accumulateurs et compteurs à 0 avant la boucle.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Initialiser `max <- 0` au lieu de `max <- tab[0]`.',
          whyItHappens: 'Habitude d’initialiser toutes les variables à 0.',
          howToFix: 'Si toutes les valeurs du tableau sont négatives (ex. températures d’hiver -10, -5, -3), `max <- 0` renverra `0` qui n’est même pas dans le tableau ! Initialisez toujours avec `tab[0]`.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'A11_C1',
          question: 'Pourquoi faut-il initialiser `max <- tab[0]` plutôt que `max <- 0` ?',
          options: [
            'Pour aller plus vite',
            'Pour que l’algorithme fonctionne même si tous les éléments du tableau sont strictement négatifs',
            'Parce que 0 est interdit en algorithmique',
            'Pour éviter une boucle infinie',
          ],
          correctIndex: 1,
          explanation: 'Sur un tableau de nombres négatifs, 0 serait supérieur à tous les éléments et fausserait le maximum.',
        },
      ],
      summary: `Somme et compteur s'initialisent à 0 avant la boucle. Le minimum et le maximum s'initialisent avec le premier élément tab[0].`,
    },
    exercises: [
      {
        id: 'A11_E1',
        chapterId: 'A11',
        title: 'Corriger une recherche de maximum',
        category: 'bugfix',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Cet algorithme lit 4 entiers (qui peuvent être tous négatifs !) et doit afficher le plus grand. Corrigez l'initialisation erronée de \`max\`.`,
        starterCode: `ALGORITHME MaxQuatre
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i, max : ENTIER
DEBUT
    POUR i ALLANT DE 0 A 3 FAIRE
        LIRE(tab[i])
    FINPOUR
    max <- 0
    POUR i ALLANT DE 0 A 3 FAIRE
        SI tab[i] > max ALORS
            max <- tab[i]
        FINSI
    FINPOUR
    AFFICHER(max)
FIN`,
        testCases: [
          { id: 't1', label: 'Nombres tous négatifs', stdin: '-15\n-3\n-20\n-8\n', expectedStdout: '-3', isHidden: false },
          { id: 't2', label: 'Nombres mixtes', stdin: '4\n19\n-2\n7\n', expectedStdout: '19', isHidden: true },
        ],
        hints: ['Remplacez `max <- 0` par `max <- tab[0]`.'],
        explanation: `En initialisant \`max <- tab[0]\`, le maximum est garanti d'appartenir au tableau même si toutes les entrées sont négatives.`,
        referenceSolution: `ALGORITHME MaxQuatre
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i, max : ENTIER
DEBUT
    POUR i ALLANT DE 0 A 3 FAIRE
        LIRE(tab[i])
    FINPOUR
    max <- tab[0]
    POUR i ALLANT DE 1 A 3 FAIRE
        SI tab[i] > max ALORS
            max <- tab[i]
        FINSI
    FINPOUR
    AFFICHER(max)
FIN`,
      },
      {
        id: 'A11_E2',
        chapterId: 'A11',
        title: 'Compter les notes supérieures ou égales à 10',
        category: 'pseudocode',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Écrivez un algorithme qui lit 5 notes entières dans un tableau de taille 5 et affiche combien de ces notes sont supérieures ou égales à 10.`,
        starterCode: `ALGORITHME CompterMoyenne
VARIABLES
    notes : TABLEAU[5] DE ENTIER
    i, compteur : ENTIER
DEBUT
    // Lire les 5 notes et compter celles >= 10
FIN`,
        testCases: [
          { id: 't1', label: '3 notes >= 10', stdin: '12\n8\n10\n15\n4\n', expectedStdout: '3', isHidden: false },
          { id: 't2', label: 'Aucune note >= 10', stdin: '2\n9\n5\n7\n8\n', expectedStdout: '0', isHidden: true },
        ],
        hints: [
          'Initialisez compteur <- 0 avant la boucle.',
          'À chaque note lue, SI notes[i] >= 10 ALORS compteur <- compteur + 1.',
        ],
        explanation: `Le compteur est initialisé à 0 et incrémenté pour chaque élément vérifiant \`notes[i] >= 10\`.`,
        referenceSolution: `ALGORITHME CompterMoyenne
VARIABLES
    notes : TABLEAU[5] DE ENTIER
    i, compteur : ENTIER
DEBUT
    compteur <- 0
    POUR i ALLANT DE 0 A 4 FAIRE
        LIRE(notes[i])
        SI notes[i] >= 10 ALORS
            compteur <- compteur + 1
        FINSI
    FINPOUR
    AFFICHER(compteur)
FIN`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE A12 — RECHERCHE DANS DES COLLECTIONS & COMPLEXITÉ
  // ============================================================================
  {
    id: 'A12',
    trackId: 'algo',
    order: 12,
    title: 'Recherche séquentielle, dichotomique et complexité',
    subtitle: 'Comparer la recherche linéaire O(n) et la recherche par dichotomie O(log n) dans un tableau trié.',
    estimatedMinutes: 60,
    prerequisites: ['A10', 'A11'],
    bridgeChapterIds: ['B10'],
    objectives: [
      'Écrire une recherche séquentielle (linéaire) qui renvoie l’indice de la cible ou -1',
      'Comprendre le principe de la recherche dichotomique (Binary Search) sur un tableau trié',
      'Comparer le coût algorithmique O(n) et O(log n)',
    ],
    tags: ['recherche séquentielle', 'dichotomie', 'complexité', 'O(log n)'],
    lesson: {
      intuitiveExplanation: `Comment cherchez-vous un mot dans un dictionnaire de 1 000 pages ?
- **Méthode naïve (recherche séquentielle)** : vous tournez les pages une par une depuis la page 1. Dans le pire cas, 1 000 étapes !
- **Méthode intelligente (recherche dichotomique)** : puisque le dictionnaire est **trié par ordre alphabétique**, vous l'ouvrez au milieu (page 500). Vous savez immédiatement si votre mot est dans la moitié gauche ou la moitié droite. Vous éliminez la moitié des pages à chaque étape : en **10 étapes** seulement ($2^{10} = 1024$), vous trouvez le mot !`,
      formalDefinition: `- **Recherche séquentielle** (*Linear Search*) : parcourt le tableau de \`0\` à \`N-1\`. Complexité dans le pire cas : $\\mathcal{O}(N)$ comparaisons. Ne nécessite pas que le tableau soit trié.
- **Recherche dichotomique** (*Binary Search*) : exige un tableau **trié**. Maintient deux bornes \`gauche\` et \`droite\`, inspecte \`milieu <- (gauche + droite) DIV 2\`, et réduit l'intervalle de moitié à chaque tour. Complexité dans le pire cas : $\\mathcal{O}(\\log_2 N)$ comparaisons.`,
      analogy: `C'est exactement le jeu du **« Plus grand / Plus petit »** entre 1 et 100 : en proposant toujours le milieu de l'intervalle restant (50, puis 25 ou 75...), vous êtes certain de trouver le nombre secret en au plus 7 essais.`,
      vocabulary: [
        { french: 'Recherche séquentielle', english: 'Linear search', definition: 'Examen des éléments un par un du début à la fin.' },
        { french: 'Recherche dichotomique', english: 'Binary search', definition: 'Recherche par division successive de l’intervalle par 2 dans un tableau trié.' },
        { french: 'Complexité temporelle', english: 'Time complexity', definition: 'Ordre de grandeur du nombre d’opérations élémentaires en fonction de la taille N des données.' },
      ],
      simpleExample: {
        title: 'Recherche séquentielle d’une valeur cible',
        description: 'Renvoie le premier indice où apparaît cible, ou -1 si elle est absente.',
        language: 'pseudocode',
        code: `ALGORITHME RechercheLineaire
VARIABLES
    tab : TABLEAU[5] DE ENTIER
    i, cible, indiceTrouve : ENTIER
DEBUT
    tab[0] <- 14
    tab[1] <- 8
    tab[2] <- 23
    tab[3] <- 42
    tab[4] <- 15
    cible <- 42
    indiceTrouve <- -1
    POUR i ALLANT DE 0 A 4 FAIRE
        SI tab[i] == cible ET indiceTrouve == -1 ALORS
            indiceTrouve <- i
        FINSI
    FINPOUR
    AFFICHER(indiceTrouve)
FIN`,
        expectedOutput: `3`,
        lineByLine: [
          { line: 'indiceTrouve <- -1', explanation: 'Par convention, -1 signifie « non trouvé » (car les indices valides sont >= 0).' },
          { line: 'SI tab[i] == cible ET indiceTrouve == -1', explanation: 'Mémorise l’indice de la première occurrence rencontrée.' },
        ],
      },
      intermediateExample: {
        title: 'Recherche dichotomique dans un tableau trié',
        description: 'Trouve l’indice de 35 dans un tableau trié de 7 éléments en divisant l’intervalle par 2.',
        language: 'pseudocode',
        code: `ALGORITHME RechercheDichotomique
VARIABLES
    tab : TABLEAU[7] DE ENTIER
    gauche, droite, milieu, cible, resultat : ENTIER
DEBUT
    tab[0] <- 5
    tab[1] <- 12
    tab[2] <- 19
    tab[3] <- 24
    tab[4] <- 35
    tab[5] <- 48
    tab[6] <- 60
    cible <- 35
    gauche <- 0
    droite <- 6
    resultat <- -1
    TANT QUE gauche <= droite ET resultat == -1 FAIRE
        milieu <- (gauche + droite) DIV 2
        SI tab[milieu] == cible ALORS
            resultat <- milieu
        SINON
            SI tab[milieu] < cible ALORS
                gauche <- milieu + 1
            SINON
                droite <- milieu - 1
            FINSI
        FINSI
    FINTANTQUE
    AFFICHER(resultat)
FIN`,
        expectedOutput: `4`,
        lineByLine: [
          { line: 'milieu <- (gauche + droite) DIV 2', explanation: 'Calcule l’indice central de la zone de recherche actuelle.' },
          { line: 'gauche <- milieu + 1', explanation: 'Si tab[milieu] est trop petit, la cible ne peut être que dans la moitié droite.' },
          { line: 'droite <- milieu - 1', explanation: 'Si tab[milieu] est trop grand, la cible ne peut être que dans la moitié gauche.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Utiliser la recherche dichotomique sur un tableau NON trié.',
          whyItHappens: 'On oublie la précondition fondamentale de la dichotomie.',
          howToFix: 'La dichotomie ne fonctionne QUE si les éléments sont ordonnés. Sinon, éliminer une moitié est infondé.',
        },
        {
          mistake: 'Écrire `gauche <- milieu` au lieu de `gauche <- milieu + 1`.',
          whyItHappens: 'Oubli que `tab[milieu]` a déjà été testé et n’est pas égal à la cible.',
          howToFix: 'Toujours exclure `milieu` (`milieu + 1` ou `milieu - 1`) pour éviter une boucle infinie.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'A12_C1',
          question: 'Dans un tableau trié de 1 000 000 d’éléments, combien de comparaisons environ la recherche dichotomique effectue-t-elle au maximum ?',
          options: [
            '1 000 000',
            '500 000',
            'Environ 20 (car 2^20 ≈ 1 000 000)',
            '1',
          ],
          correctIndex: 2,
          explanation: 'À chaque étape la taille est divisée par 2 : log2(1 000 000) ≈ 20 étapes.',
        },
      ],
      summary: `La recherche séquentielle examine chaque case en O(n). Sur un tableau trié, la recherche dichotomique divise l'espace par 2 à chaque étape et trouve la cible en O(log n).`,
    },
    exercises: [
      {
        id: 'A12_E1',
        chapterId: 'A12',
        title: 'Condition préalable de la dichotomie',
        category: 'qcm',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Quelle condition est indispensable pour pouvoir appliquer une recherche dichotomique sur un tableau ?`,
        choices: [
          'Le tableau doit contenir uniquement des nombres positifs',
          'Le tableau doit être préalablement trié',
          'La taille du tableau doit être une puissance de 2',
          'Le tableau ne doit pas contenir de doublons',
        ],
        expectedAnswer: 'Le tableau doit être préalablement trié',
        hints: ['Pourquoi peut-on éliminer toute une moitié du tableau d’un seul coup ?'],
        explanation: `C'est l'ordre croissant (ou décroissant) du tableau qui permet de savoir de quel côté se trouve la valeur cherchée par rapport au milieu.`,
      },
      {
        id: 'A12_E2',
        chapterId: 'A12',
        title: 'Implémenter une recherche d’indice',
        category: 'pseudocode',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Écrivez un algorithme qui lit 5 entiers dans un tableau \`tab[5]\`, puis lit un entier \`cible\`, et affiche l'indice (entre 0 et 4) de la première apparition de \`cible\`, ou \`-1\` si \`cible\` n'est pas présente.`,
        starterCode: `ALGORITHME ChercherIndice
VARIABLES
    tab : TABLEAU[5] DE ENTIER
    i, cible, pos : ENTIER
DEBUT
    // Lire les 5 cases, puis la cible, et afficher sa position ou -1
FIN`,
        testCases: [
          { id: 't1', label: 'Cible présente à l’indice 2', stdin: '10\n20\n30\n40\n50\n30\n', expectedStdout: '2', isHidden: false },
          { id: 't2', label: 'Cible absente', stdin: '4\n8\n15\n16\n23\n99\n', expectedStdout: '-1', isHidden: false },
          { id: 't3', label: 'Cible en première position', stdin: '7\n1\n2\n3\n7\n7\n', expectedStdout: '0', isHidden: true },
        ],
        hints: [
          'Initialisez pos <- -1.',
          'Lors du parcours, SI tab[i] == cible ET pos == -1 ALORS pos <- i.',
        ],
        explanation: `On initialise \`pos\` à \`-1\` et on le met à jour uniquement lors de la première rencontre avec \`cible\`.`,
        referenceSolution: `ALGORITHME ChercherIndice
VARIABLES
    tab : TABLEAU[5] DE ENTIER
    i, cible, pos : ENTIER
DEBUT
    POUR i ALLANT DE 0 A 4 FAIRE
        LIRE(tab[i])
    FINPOUR
    LIRE(cible)
    pos <- -1
    POUR i ALLANT DE 0 A 4 FAIRE
        SI tab[i] == cible ET pos == -1 ALORS
            pos <- i
        FINSI
    FINPOUR
    AFFICHER(pos)
FIN`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE A13 — TRIS ÉLÉMENTAIRES
  // ============================================================================
  {
    id: 'A13',
    trackId: 'algo',
    order: 13,
    title: 'Tris élémentaires : sélection et insertion',
    subtitle: 'Ordonner un tableau en place et comprendre la complexité quadratique O(n²).',
    estimatedMinutes: 60,
    prerequisites: ['A10', 'A11', 'A12'],
    bridgeChapterIds: ['B10', 'B16'],
    objectives: [
      'Comprendre et écrire le tri par sélection du minimum (Selection Sort)',
      'Comprendre le tri par insertion (Insertion Sort) comme un joueur de cartes',
      'Échanger deux cases d’un tableau à l’aide d’une variable temporaire',
      'Expliquer pourquoi deux boucles imbriquées de taille N donnent un coût O(N²)',
    ],
    tags: ['tri par sélection', 'tri par insertion', 'O(n²)', 'échange'],
    lesson: {
      intuitiveExplanation: `Comment trier un jeu de cartes ou une liste de notes par ordre croissant ?
- **Le tri par sélection** : vous cherchez la plus petite valeur de tout le tableau et vous la placez en case \`0\`. Puis vous cherchez la plus petite valeur parmi les cases restantes (\`1\` à \`N-1\`) et vous la placez en case \`1\`, et ainsi de suite.
- **Le tri par insertion** : comme un joueur de cartes qui trie sa main de gauche à droite, vous prenez chaque nouvel élément et vous le faites glisser vers la gauche jusqu'à sa bonne place parmi les éléments déjà triés.`,
      formalDefinition: `Les tris élémentaires (sélection, insertion, bulles) fonctionnent **en place** (*in-place*, sans créer de second tableau) et utilisent deux boucles imbriquées.
Le nombre de comparaisons pour le tri par sélection est :
$$(N - 1) + (N - 2) + \\dots + 1 = \\frac{N(N - 1)}{2} \\in \\mathcal{O}(N^2)$$`,
      analogy: `Le **tri par sélection** consiste à sélectionner le plus petit élève de la file pour le mettre au premier rang, puis le plus petit des élèves restants pour le mettre au deuxième rang, etc.`,
      vocabulary: [
        { french: 'Tri par sélection', english: 'Selection sort', definition: 'Recherche répétée du minimum de la partie non triée pour le placer en tête.' },
        { french: 'Tri par insertion', english: 'Insertion sort', definition: 'Insertion successive de chaque élément à sa place dans le préfixe déjà trié.' },
        { french: 'Tri en place', english: 'In-place sort', definition: 'Tri qui modifie directement le tableau d’origine sans allouer de tableau auxiliaire.' },
      ],
      simpleExample: {
        title: 'Tri par sélection d’un tableau de 4 entiers',
        description: 'À chaque étape i, on cherche l’indice du minimum entre i et 3, puis on échange tab[i] et tab[indiceMin].',
        language: 'pseudocode',
        code: `ALGORITHME TriSelection
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i, j, indiceMin, temp : ENTIER
DEBUT
    tab[0] <- 29
    tab[1] <- 10
    tab[2] <- 14
    tab[3] <- 7
    POUR i ALLANT DE 0 A 2 FAIRE
        indiceMin <- i
        POUR j ALLANT DE i + 1 A 3 FAIRE
            SI tab[j] < tab[indiceMin] ALORS
                indiceMin <- j
            FINSI
        FINPOUR
        temp <- tab[i]
        tab[i] <- tab[indiceMin]
        tab[indiceMin] <- temp
    FINPOUR
    POUR i ALLANT DE 0 A 3 FAIRE
        AFFICHER(tab[i])
    FINPOUR
FIN`,
        expectedOutput: `7\n10\n14\n29`,
        lineByLine: [
          { line: 'indiceMin <- i', explanation: 'Suppose provisoirement que le minimum de la zone [i..3] est en position i.' },
          { line: 'SI tab[j] < tab[indiceMin] ALORS indiceMin <- j', explanation: 'Mémorise l’indice du nouveau minimum trouvé.' },
          { line: 'temp <- tab[i] ...', explanation: 'Échange la case i avec la case contenant le minimum.' },
        ],
      },
      intermediateExample: {
        title: 'Tri par insertion',
        description: 'On insère chaque clé tab[i] à sa place dans la partie gauche déjà triée tab[0..i-1].',
        language: 'pseudocode',
        code: `ALGORITHME TriInsertion
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i, j, cle : ENTIER
DEBUT
    tab[0] <- 15
    tab[1] <- 4
    tab[2] <- 22
    tab[3] <- 8
    POUR i ALLANT DE 1 A 3 FAIRE
        cle <- tab[i]
        j <- i - 1
        TANT QUE j >= 0 ET tab[j] > cle FAIRE
            tab[j + 1] <- tab[j]
            j <- j - 1
        FINTANTQUE
        tab[j + 1] <- cle
    FINPOUR
    POUR i ALLANT DE 0 A 3 FAIRE
        AFFICHER(tab[i])
    FINPOUR
FIN`,
        expectedOutput: `4\n8\n15\n22`,
        lineByLine: [
          { line: 'cle <- tab[i]', explanation: 'Sauvegarde la valeur de la carte à insérer.' },
          { line: 'tab[j + 1] <- tab[j]', explanation: 'Décale vers la droite les éléments plus grands que la clé.' },
          { line: 'tab[j + 1] <- cle', explanation: 'Dépose la clé dans le trou ainsi libéré.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Échanger les valeurs à chaque fois dans la boucle interne du tri par sélection au lieu de mémoriser `indiceMin`.',
          whyItHappens: 'On confond recherche de l’indice du minimum et échange immédiat.',
          howToFix: 'Cherchez d’abord `indiceMin` dans toute la boucle interne `j`, et ne faites qu’un seul échange après `FINPOUR` de `j`.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'A13_C1',
          question: 'Si la taille N d’un tableau est multipliée par 10, par combien environ est multiplié le temps d’exécution d’un tri par sélection en O(N²) ?',
          options: [
            'Par 10',
            'Par 20',
            'Par 100 (car 10² = 100)',
            'Il reste constant',
          ],
          correctIndex: 2,
          explanation: 'Une complexité quadratique O(N²) multiplie le nombre d’opérations par 10² = 100 lorsque N est multiplié par 10.',
        },
      ],
      summary: `Le tri par sélection place à chaque tour le minimum restant en tête. Le tri par insertion insère chaque élément dans le préfixe déjà trié. Tous deux ont une complexité O(N²).`,
    },
    exercises: [
      {
        id: 'A13_E1',
        chapterId: 'A13',
        title: 'Étapes du tri par sélection',
        category: 'ordering',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Remettez dans l'ordre les instructions d'une étape \`i\` du tri par sélection.`,
        scrambledLines: [
          'indiceMin <- i',
          'POUR j ALLANT DE i + 1 A n - 1 FAIRE',
          '    SI tab[j] < tab[indiceMin] ALORS indiceMin <- j FINSI',
          'FINPOUR',
          'temp <- tab[i] ; tab[i] <- tab[indiceMin] ; tab[indiceMin] <- temp',
        ],
        expectedAnswer: `indiceMin <- i\nPOUR j ALLANT DE i + 1 A n - 1 FAIRE\n    SI tab[j] < tab[indiceMin] ALORS indiceMin <- j FINSI\nFINPOUR\ntemp <- tab[i] ; tab[i] <- tab[indiceMin] ; tab[indiceMin] <- temp`,
        hints: ['On initialise indiceMin, on parcourt avec j pour trouver le vrai minimum, puis on échange après la boucle.'],
        explanation: `L'échange ne doit avoir lieu qu'une fois la boucle interne \`j\` terminée.`,
      },
      {
        id: 'A13_E2',
        chapterId: 'A13',
        title: 'Trier 4 nombres par ordre croissant',
        category: 'pseudocode',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Écrivez un algorithme qui lit 4 entiers dans \`tab[4]\`, les trie par ordre croissant (par sélection ou insertion), puis affiche les 4 éléments triés.`,
        starterCode: `ALGORITHME TrierQuatre
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i, j, indiceMin, temp : ENTIER
DEBUT
    // Lire les 4 entiers, les trier et les afficher
FIN`,
        testCases: [
          { id: 't1', label: 'Tableau inversé', stdin: '40\n30\n20\n10\n', expectedStdout: '10\n20\n30\n40', isHidden: false },
          { id: 't2', label: 'Valeurs quelconques', stdin: '12\n-5\n12\n3\n', expectedStdout: '-5\n3\n12\n12', isHidden: true },
        ],
        hints: [
          'Lisez d’abord tab[0] à tab[3] avec une boucle POUR.',
          'Appliquez le tri par sélection avec i allant de 0 à 2 et j allant de i + 1 à 3.',
        ],
        explanation: `Le tri par sélection trouve successivement les minimums pour les positions 0, 1 et 2 (la position 3 est alors automatiquement la plus grande).`,
        referenceSolution: `ALGORITHME TrierQuatre
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i, j, indiceMin, temp : ENTIER
DEBUT
    POUR i ALLANT DE 0 A 3 FAIRE
        LIRE(tab[i])
    FINPOUR
    POUR i ALLANT DE 0 A 2 FAIRE
        indiceMin <- i
        POUR j ALLANT DE i + 1 A 3 FAIRE
            SI tab[j] < tab[indiceMin] ALORS
                indiceMin <- j
            FINSI
        FINPOUR
        temp <- tab[i]
        tab[i] <- tab[indiceMin]
        tab[indiceMin] <- temp
    FINPOUR
    POUR i ALLANT DE 0 A 3 FAIRE
        AFFICHER(tab[i])
    FINPOUR
FIN`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE A14 — TRACES D'EXÉCUTION ET INVARIANTS DE BOUCLE
  // ============================================================================
  {
    id: 'A14',
    trackId: 'algo',
    order: 14,
    title: 'Traces d’exécution et invariants de boucle',
    subtitle: 'Exécuter un algorithme à la main dans une table de trace et prouver sa correction.',
    estimatedMinutes: 45,
    prerequisites: ['A07', 'A11'],
    bridgeChapterIds: ['B14'],
    objectives: [
      'Construire méthodiquement une table de trace ligne par ligne',
      'Comprendre la notion d’invariant de boucle (propriété vraie avant et après chaque itération)',
      'Justifier qu’une boucle se termine grâce à un variant de boucle décroissant',
    ],
    tags: ['trace', 'invariant de boucle', 'terminaison', 'preuve'],
    lesson: {
      intuitiveExplanation: `Comment être **certain** qu'un algorithme fonctionne sans même avoir d'ordinateur sous la main (par exemple en examen sur feuille) ?
1. En dressant une **table de trace** : un tableau où chaque colonne est une variable et chaque ligne représente une étape d'exécution.
2. En identifiant l'**invariant de boucle** : la relation logique qui reste vraie du début à la fin de la boucle.`,
      formalDefinition: `- Une **trace d'exécution** est la suite chronologique des états des variables d'un programme pour une entrée donnée.
- Un **invariant de boucle** est une propriété logique $P$ telle que :
  1. **Initialisation** : $P$ est vraie juste avant la première itération.
  2. **Conservation** : si $P$ est vraie au début d'une itération, elle reste vraie à la fin de cette itération.
  3. **Terminaison** : lorsque la boucle s'arrête, $P$ combinée à la négation de la condition de boucle prouve que le résultat est exact.`,
      analogy: `Un invariant de boucle est comme un **garde-fou sur une passerelle** : tant que vous restez entre les garde-fous à chaque pas (conservation) et que vous avancez vers la sortie (terminaison), vous êtes certain d'arriver au bon endroit.`,
      vocabulary: [
        { french: 'Table de trace', english: 'Trace table', definition: 'Tableau consignant l’évolution des variables instruction après instruction.' },
        { french: 'Invariant de boucle', english: 'Loop invariant', definition: 'Propriété logique qui demeure vraie avant et après chaque tour de boucle.' },
        { french: 'Variant de boucle', english: 'Loop variant', definition: 'Quantité entière positive qui décroît strictement à chaque tour, prouvant que la boucle s’arrête.' },
      ],
      simpleExample: {
        title: 'Trace et invariant du calcul de somme',
        description: 'À la fin du tour i, la variable s contient exactement la somme des entiers de 1 à i.',
        language: 'pseudocode',
        code: `ALGORITHME SommeInvariant
VARIABLES
    i, s : ENTIER
DEBUT
    s <- 0
    POUR i ALLANT DE 1 A 4 FAIRE
        s <- s + i
    FINPOUR
    AFFICHER(s)
FIN`,
        expectedOutput: `10`,
        lineByLine: [
          { line: 's <- 0', explanation: 'Avant la boucle : s = 0 (somme vide).' },
          { line: 's <- s + i', explanation: 'Tour i=1 : s=1 ; Tour i=2 : s=3 ; Tour i=3 : s=6 ; Tour i=4 : s=10.' },
        ],
      },
      intermediateExample: {
        title: 'Trace d’un algorithme mystère (division entière par soustractions)',
        description: 'Combien de fois peut-on soustraire b de a ? C’est le quotient q, et ce qui reste dans a est le reste !',
        language: 'pseudocode',
        code: `ALGORITHME DivisionSoustraction
VARIABLES
    a, b, q : ENTIER
DEBUT
    a <- 17
    b <- 5
    q <- 0
    TANT QUE a >= b FAIRE
        a <- a - b
        q <- q + 1
    FINTANTQUE
    AFFICHER("Quotient =", q, "Reste =", a)
FIN`,
        expectedOutput: `Quotient = 3 Reste = 2`,
        lineByLine: [
          { line: 'TANT QUE a >= b FAIRE', explanation: 'Invariant : à chaque tour, 17 == q * 5 + a.' },
          { line: 'a <- a - b ; q <- q + 1', explanation: 'État initial (a=17, q=0) -> (a=12, q=1) -> (a=7, q=2) -> (a=2, q=3). Sortie car 2 < 5.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Mettre à jour les variables de tête sans écrire chaque étape dans la table de trace.',
          whyItHappens: 'On veut aller trop vite sur les boucles contenant plusieurs affectations.',
          howToFix: 'Écrivez une ligne par tour de boucle en notant systématiquement la nouvelle valeur de chaque variable.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'A14_C1',
          question: 'Dans l’algorithme de division par soustractions (a=17, b=5), quelle relation reste vraie à chaque tour de boucle (invariant) ?',
          options: [
            'a + b == 17',
            'q * b + a == 17',
            'a == q',
            'b == 0',
          ],
          correctIndex: 1,
          explanation: 'À chaque fois que a diminue de b, q augmente de 1, donc q * b + a reste toujours égal à la valeur initiale 17.',
        },
      ],
      summary: `La table de trace permet de suivre l'état exact des variables pas à pas. L'invariant prouve que l'algorithme calcule le bon résultat, et le variant prouve qu'il s'arrête.`,
    },
    exercises: [
      {
        id: 'A14_E1',
        chapterId: 'A14',
        title: 'Tracer une boucle à deux variables',
        category: 'trace',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Tracez l'exécution de cet algorithme et indiquez la valeur finale affichée pour \`res\`.`,
        codeSnippet: `ALGORITHME TraceDeuxVars
VARIABLES
    x, y, res : ENTIER
DEBUT
    x <- 1
    y <- 4
    res <- 0
    TANT QUE x <= y FAIRE
        res <- res + x * y
        x <- x + 1
        y <- y - 1
    FINTANTQUE
    AFFICHER(res)
FIN`,
        expectedAnswer: '10',
        acceptedAnswers: ['10'],
        hints: [
          'Tour 1 (x=1, y=4) : res = 0 + 1*4 = 4, puis x=2, y=3.',
          'Tour 2 (x=2, y=3) : res = 4 + 2*3 = 10, puis x=3, y=2 (la boucle s’arrête car x > y).',
        ],
        explanation: `Au 1er tour \`res\` passe à 4 (\`x=2, y=3\`). Au 2e tour \`res\` passe à 4 + 6 = 10 (\`x=3, y=2\`). Comme \`3 <= 2\` est faux, la boucle se termine et affiche 10.`,
      },
      {
        id: 'A14_E2',
        chapterId: 'A14',
        title: 'Prédire la sortie d’une trace sur tableau',
        category: 'prediction',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Quelle valeur cet algorithme affiche-t-il ?`,
        codeSnippet: `ALGORITHME TraceTab
VARIABLES
    t : TABLEAU[4] DE ENTIER
    i, s : ENTIER
DEBUT
    t[0] <- 2
    t[1] <- 5
    t[2] <- 3
    t[3] <- 8
    s <- 0
    POUR i ALLANT DE 0 A 2 FAIRE
        s <- s + (t[i + 1] - t[i])
    FINPOUR
    AFFICHER(s)
FIN`,
        expectedAnswer: '6',
        acceptedAnswers: ['6'],
        hints: [
          'Pour i=0 : t[1] - t[0] = 5 - 2 = 3.',
          'Pour i=1 : t[2] - t[1] = 3 - 5 = -2.',
          'Pour i=2 : t[3] - t[2] = 8 - 3 = 5. Somme = 3 - 2 + 5.',
        ],
        explanation: `C'est une somme télescopique : $(t[1]-t[0]) + (t[2]-t[1]) + (t[3]-t[2]) = t[3] - t[0] = 8 - 2 = 6$.`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE A15 — TESTS, CAS LIMITES ET DÉBOGAGE LOGIQUE
  // ============================================================================
  {
    id: 'A15',
    trackId: 'algo',
    order: 15,
    title: 'Tests, cas limites et débogage logique',
    subtitle: 'Concevoir un jeu d’essais robuste (cas normaux, cas limites, erreurs de décalage off-by-one).',
    estimatedMinutes: 45,
    prerequisites: ['A14'],
    bridgeChapterIds: ['B14', 'B15'],
    objectives: [
      'Distinguer les cas normaux, les cas limites (Edge Cases) et les entrées particulières (0, négatifs, égalité)',
      'Repérer et corriger les erreurs d’un cran (Off-by-one errors : < au lieu de <=)',
      'Isoler un bug logique en inspectant les valeurs intermédiaires',
    ],
    tags: ['tests', 'cas limites', 'off-by-one', 'débogage'],
    lesson: {
      intuitiveExplanation: `Un programme qui marche sur l'exemple du cours n'est **pas** forcément juste !
En ingénierie logicielle, les bugs se cachent presque toujours aux **frontières** (*Edge Cases*) :
- Que fait votre algorithme si l'entrée vaut \`0\` ?
- Si deux nombres sont **égaux** ?
- Si la cible cherchée est en **toute première** (\`indice 0\`) ou **toute dernière** case (\`indice N-1\`) du tableau ?`,
      formalDefinition: `Un **jeu de tests** (*Test Suite*) complet couvre trois familles d'entrées :
1. **Cas nominaux (normaux)** : valeurs typiques au cœur du domaine.
2. **Cas limites (*Boundary / Edge Cases*)** : valeurs aux bornes ($0$, $1$, $N-1$, égalité entre deux valeurs, nombres négatifs).
3. **Erreurs d'un cran (*Off-by-one errors*)** : erreur classique où une boucle s'arrête une itération trop tôt ou trop tard (\`< N-1\` au lieu de \`<= N-1\`).`,
      analogy: `C'est le problème des **poteaux et des intervalles d'une clôture** : pour poser 10 mètres de clôture avec un poteau tous les mètres, il faut **11 poteaux**, pas 10 ! Confondre le nombre d'intervalles et le nombre de bornes est l'erreur *off-by-one*.`,
      vocabulary: [
        { french: 'Cas limite', english: 'Edge case / Boundary case', definition: 'Entrée située à la frontière exacte d’une condition (ex: 0, égalité, premier/dernier élément).' },
        { french: 'Erreur d’un cran', english: 'Off-by-one error', definition: 'Décalage d’une unité dans une borne de boucle ou un indice de tableau.' },
        { french: 'Jeu de tests', english: 'Test suite', definition: 'Ensemble structuré d’entrées et de sorties attendues permettant de valider un programme.' },
      ],
      simpleExample: {
        title: 'Bug d’un cran (Off-by-one) sur un parcours de tableau',
        description: 'Oublier la dernière case d’un tableau de taille 4 en arrêtant la boucle à 2 au lieu de 3.',
        language: 'pseudocode',
        code: `ALGORITHME SommeComplete
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i, somme : ENTIER
DEBUT
    tab[0] <- 10
    tab[1] <- 20
    tab[2] <- 30
    tab[3] <- 40
    somme <- 0
    // Correct : on va bien de 0 jusqu'à 3 inclus
    POUR i ALLANT DE 0 A 3 FAIRE
        somme <- somme + tab[i]
    FINPOUR
    AFFICHER(somme)
FIN`,
        expectedOutput: `100`,
        lineByLine: [
          { line: 'POUR i ALLANT DE 0 A 3 FAIRE', explanation: 'Visite les 4 indices : 0, 1, 2 et 3. Si on s’était arrêté à 2, tab[3]=40 aurait été oublié.' },
        ],
      },
      intermediateExample: {
        title: 'Cas limite d’égalité dans la recherche du maximum de 3 nombres',
        description: 'Utiliser >= au lieu de > pour gérer correctement deux valeurs maximales ex-aequo.',
        language: 'pseudocode',
        code: `FONCTION max3(a : ENTIER, b : ENTIER, c : ENTIER) : ENTIER
VARIABLES
    m : ENTIER
DEBUT
    m <- a
    SI b > m ALORS
        m <- b
    FINSI
    SI c > m ALORS
        m <- c
    FINSI
    RETOURNER m
FINFONCTION

ALGORITHME TestMax3
DEBUT
    AFFICHER(max3(15, 15, 8))
FIN`,
        expectedOutput: `15`,
        lineByLine: [
          { line: 'm <- a', explanation: 'En partant de m = a, même si a et b sont ex-aequo (15 et 15), m vaut déjà 15.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Écrire `SI a > b ET a > c` puis `SINON SI b > a ET b > c` pour chercher le maximum.',
          whyItHappens: 'On utilise des inégalités strictes `>` partout.',
          howToFix: 'Que se passe-t-il si `a = 15, b = 15, c = 8` ? Les deux conditions `15 > 15` sont fausses et l’algorithme renvoie `c = 8` (le plus petit) ! Utilisez une variable `m <- a` mise à jour progressivement.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'A15_C1',
          question: 'Pourquoi le programme `SI a > b ET a > c ALORS max <- a SINON SI b > a ET b > c ALORS max <- b SINON max <- c` est-il buggé ?',
          options: [
            'Il ne compile pas',
            'Il échoue sur le cas limite où les deux plus grands nombres sont égaux (ex: a=10, b=10, c=2 renvoie 2)',
            'Il ne marche pas avec les nombres pairs',
            'Il est trop lent',
          ],
          correctIndex: 1,
          explanation: 'Avec a=10, b=10, c=2, `a > b` est faux et `b > a` est faux, donc on tombe dans le SINON final qui renvoie c=2 !',
        },
      ],
      summary: `Testez systématiquement vos algorithmes sur les cas limites : 0, nombres négatifs, égalités (ex-aequo), et premier/dernier élément d'un tableau.`,
    },
    exercises: [
      {
        id: 'A15_E1',
        chapterId: 'A15',
        title: 'Identifier un bug de cas limite',
        category: 'error_spot',
        difficulty: 'debutant',
        isCoreValidationExercise: true,
        prompt: `Pour quelle entrée la fonction suivante renvoie-t-elle un résultat FAUX lorsqu'elle cherche le maximum de 3 entiers \`a, b, c\` ?
\`SI a > b ET a > c ALORS RETOURNER a SINON SI b > a ET b > c ALORS RETOURNER b SINON RETOURNER c FINSI\``,
        choices: [
          'a = 5, b = 3, c = 1',
          'a = 10, b = 10, c = 2',
          'a = 1, b = 2, c = 3',
          'a = -5, b = -2, c = -1',
        ],
        expectedAnswer: 'a = 10, b = 10, c = 2',
        hints: ['Testez ce que vaut `10 > 10`.'],
        explanation: `Pour \`a=10, b=10, c=2\`, la condition \`10 > 10\` est FAUSSE, donc les deux premiers SI échouent et la fonction renvoie \`c = 2\` au lieu de \`10\`.`,
      },
      {
        id: 'A15_E2',
        chapterId: 'A15',
        title: 'Corriger un bug off-by-one et de cas limite',
        category: 'bugfix',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        prompt: `Cet algorithme doit vérifier si un tableau de 4 entiers est trié par ordre croissant au sens large (\`tab[0] <= tab[1] <= tab[2] <= tab[3]\`) et afficher \`1\` si oui, \`0\` sinon.
Il comporte deux erreurs : il rejette les valeurs égales consécutives et oublie de tester la dernière paire. Corrigez-le !`,
        starterCode: `ALGORITHME VerifierCroissant
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i, estTrie : ENTIER
DEBUT
    POUR i ALLANT DE 0 A 3 FAIRE
        LIRE(tab[i])
    FINPOUR
    estTrie <- 1
    POUR i ALLANT DE 0 A 1 FAIRE
        SI tab[i] >= tab[i + 1] ALORS
            estTrie <- 0
        FINSI
    FINPOUR
    AFFICHER(estTrie)
FIN`,
        testCases: [
          { id: 't1', label: 'Tableau trié avec doublon (2, 5, 5, 9)', stdin: '2\n5\n5\n9\n', expectedStdout: '1', isHidden: false },
          { id: 't2', label: 'Dernière paire non triée (1, 3, 8, 4)', stdin: '1\n3\n8\n4\n', expectedStdout: '0', isHidden: false },
          { id: 't3', label: 'Strictement croissant', stdin: '10\n20\n30\n40\n', expectedStdout: '1', isHidden: true },
        ],
        hints: [
          'Pour comparer toutes les paires adjacentes (0-1, 1-2, 2-3), i doit aller de 0 à 2.',
          'Le tableau n’est PAS trié uniquement si tab[i] > tab[i + 1] (les doublons tab[i] == tab[i+1] sont autorisés).',
        ],
        explanation: `Il y a 3 paires adjacentes dans un tableau de 4 cases (\`i\` de \`0\` à \`2\`), et l'ordre croissant large est violé uniquement lorsque \`tab[i] > tab[i + 1]\`.`,
        referenceSolution: `ALGORITHME VerifierCroissant
VARIABLES
    tab : TABLEAU[4] DE ENTIER
    i, estTrie : ENTIER
DEBUT
    POUR i ALLANT DE 0 A 3 FAIRE
        LIRE(tab[i])
    FINPOUR
    estTrie <- 1
    POUR i ALLANT DE 0 A 2 FAIRE
        SI tab[i] > tab[i + 1] ALORS
            estTrie <- 0
        FINSI
    FINPOUR
    AFFICHER(estTrie)
FIN`,
      },
    ],
  },

  // ============================================================================
  // CHAPITRE A16 — PETITS PROBLÈMES DE SYNTHÈSE ALGORITHMIQUE
  // ============================================================================
  {
    id: 'A16',
    trackId: 'algo',
    order: 16,
    title: 'Problèmes de synthèse algorithmique (Passerelles vers C)',
    subtitle: 'Mobiliser variables, boucles, fonctions et tableaux pour résoudre des problèmes complets.',
    estimatedMinutes: 65,
    prerequisites: ['A08', 'A11', 'A12', 'A13', 'A15'],
    bridgeChapterIds: ['B16'],
    objectives: [
      'Combiner lecture de données, fonctions, boucles et tableaux dans une solution structurée',
      'Résoudre un problème d’analyse statistique complète d’une série de mesures',
      'Préparer la traduction directe d’un algorithme validé vers un programme C complet',
    ],
    tags: ['synthèse', 'passerelle Algo-C', 'bilan algorithmique'],
    lesson: {
      intuitiveExplanation: `Vous maîtrisez désormais toutes les briques fondamentales de l'algorithmique de première année : variables, conditions, boucles, fonctions, récursivité, tableaux, recherches et tris.
Dans ce chapitre de synthèse, nous assemblons ces briques pour résoudre des problèmes complets tels que vous les rencontrerez en travaux pratiques et en examen — avant de les traduire en langage C dans le **Parcours B**.`,
      formalDefinition: `La **méthode de résolution descendante** (*Top-Down Design*) en 4 étapes :
1. **Spécifier** les entrées, les sorties et les cas limites.
2. **Décomposer** le problème en sous-fonctions élémentaires.
3. **Écrire et tracer** chaque sous-algorithme sur un petit exemple.
4. **Traduire** en langage C et valider sur le jeu de tests.`,
      analogy: `Comme un ingénieur qui conçoit un pont : il ne coule pas le béton au hasard ; il valide d'abord les plans et les calculs de résistance (l'algorithme), puis passe à la construction matérielle (l'implémentation en C).`,
      vocabulary: [
        { french: 'Conception descendante', english: 'Top-down design', definition: 'Méthode partant du problème global pour le découper en sous-problèmes élémentaires.' },
        { french: 'Passerelle Algo -> C', english: 'Algo-to-C bridge', definition: 'Traduction méthodique d’un pseudo-code validé vers un programme C compilable.' },
      ],
      simpleExample: {
        title: 'Vérification de nombre premier avec fonction dédiée',
        description: 'Une fonction estPremier(n) teste si n >= 2 n’admet aucun diviseur entre 2 et n-1.',
        language: 'pseudocode',
        code: `FONCTION estPremier(n : ENTIER) : ENTIER
VARIABLES
    d : ENTIER
DEBUT
    SI n < 2 ALORS
        RETOURNER 0
    FINSI
    POUR d ALLANT DE 2 A n - 1 FAIRE
        SI n MOD d == 0 ALORS
            RETOURNER 0
        FINSI
    FINPOUR
    RETOURNER 1
FINFONCTION

ALGORITHME TestPremiers
DEBUT
    AFFICHER(estPremier(13))
    AFFICHER(estPremier(15))
FIN`,
        expectedOutput: `1\n0`,
        lineByLine: [
          { line: 'SI n < 2 ALORS RETOURNER 0', explanation: 'Cas limite : 0 et 1 ne sont pas premiers.' },
          { line: 'SI n MOD d == 0 ALORS RETOURNER 0', explanation: 'Dès qu’un diviseur exact est trouvé, on s’arrête et on renvoie 0.' },
        ],
      },
      intermediateExample: {
        title: 'Bilan d’un relevé de 5 capteurs (Min, Max, Nombre d’alertes)',
        description: 'Analyse un tableau de 5 mesures et compte celles qui dépassent un seuil critique.',
        language: 'pseudocode',
        code: `ALGORITHME BilanCapteurs
VARIABLES
    mesures : TABLEAU[5] DE ENTIER
    i, min, max, alertes : ENTIER
DEBUT
    mesures[0] <- 22
    mesures[1] <- 85
    mesures[2] <- 18
    mesures[3] <- 92
    mesures[4] <- 40
    min <- mesures[0]
    max <- mesures[0]
    alertes <- 0
    POUR i ALLANT DE 0 A 4 FAIRE
        SI mesures[i] < min ALORS
            min <- mesures[i]
        FINSI
        SI mesures[i] > max ALORS
            max <- mesures[i]
        FINSI
        SI mesures[i] >= 80 ALORS
            alertes <- alertes + 1
        FINSI
    FINPOUR
    AFFICHER("Min =", min, "Max =", max, "Alertes =", alertes)
FIN`,
        expectedOutput: `Min = 18 Max = 92 Alertes = 2`,
        lineByLine: [
          { line: 'min <- mesures[0] ; max <- mesures[0]', explanation: 'Initialise les deux extrémums sur la première mesure.' },
          { line: 'SI mesures[i] >= 80 ALORS alertes <- alertes + 1', explanation: 'Compte simultanément les dépassements de seuil.' },
        ],
      },
      commonMistakes: [
        {
          mistake: 'Mettre `RETOURNER 1` à l’intérieur de la boucle `POUR d` dès que le premier `n MOD d != 0`.',
          whyItHappens: 'Conclusion hâtive : ce n’est pas parce que 9 n’est pas divisible par 2 qu’il est premier !',
          howToFix: 'On ne peut conclure que `n` est premier (`RETOURNER 1`) qu’APRÈS avoir testé TOUS les diviseurs candidats jusqu’à la fin de la boucle.',
        },
      ],
      comprehensionQuestions: [
        {
          id: 'A16_C1',
          question: 'Dans `estPremier(n)`, pourquoi `RETOURNER 1` doit-il obligatoirement se trouver APRÈS `FINPOUR` ?',
          options: [
            'Parce que RETOURNER est interdit dans une boucle',
            'Parce qu’un nombre n’est premier que si AUCUN diviseur n’a été trouvé sur l’ensemble des tours de boucle',
            'Pour économiser de la mémoire',
            'Parce que d doit valoir 0',
          ],
          correctIndex: 1,
          explanation: 'Tester un seul diviseur ne suffit pas : il faut que toute la boucle se termine sans trouver de diviseur pour affirmer que n est premier.',
        },
      ],
      summary: `Un problème de synthèse se résout en combinant décomposition en fonctions, parcours de tableaux et gestion rigoureuse des cas limites.`,
    },
    exercises: [
      {
        id: 'A16_E1',
        chapterId: 'A16',
        title: 'Synthèse 1 : Compter les nombres premiers dans un intervalle',
        category: 'synthesis',
        difficulty: 'avance',
        isCoreValidationExercise: true,
        bridgeTargetExerciseId: 'B16_E1',
        prompt: `Écrivez une fonction \`estPremier(n : ENTIER) : ENTIER\` qui renvoie \`1\` si \`n\` est premier et \`0\` sinon.
Dans l'algorithme principal, lisez deux entiers \`a\` et \`b\` ($a \\le b$) et affichez combien de nombres premiers se trouvent entre \`a\` et \`b\` inclus.`,
        starterCode: `FONCTION estPremier(n : ENTIER) : ENTIER
VARIABLES
    d : ENTIER
DEBUT
    // Renvoie 1 si n est premier, 0 sinon
FINFONCTION

ALGORITHME CompterPremiers
VARIABLES
    a, b, k, nb : ENTIER
DEBUT
    LIRE(a)
    LIRE(b)
    // Compter les nombres premiers entre a et b inclus
FIN`,
        testCases: [
          { id: 't1', label: 'Entre 1 et 10 (2, 3, 5, 7 -> 4)', stdin: '1\n10\n', expectedStdout: '4', isHidden: false },
          { id: 't2', label: 'Entre 10 et 20 (11, 13, 17, 19 -> 4)', stdin: '10\n20\n', expectedStdout: '4', isHidden: false },
          { id: 't3', label: 'Entre 24 et 28 (aucun -> 0)', stdin: '24\n28\n', expectedStdout: '0', isHidden: true },
        ],
        hints: [
          'Dans estPremier(n), si n < 2 retournez 0. Puis testez d de 2 à n - 1.',
          'Dans l’algorithme principal, parcourez k de a à b et ajoutez estPremier(k) à nb.',
        ],
        explanation: `La décomposition en une fonction \`estPremier(n)\` rend la boucle principale très lisible : \`nb <- nb + estPremier(k)\`.`,
        referenceSolution: `FONCTION estPremier(n : ENTIER) : ENTIER
VARIABLES
    d : ENTIER
DEBUT
    SI n < 2 ALORS
        RETOURNER 0
    FINSI
    POUR d ALLANT DE 2 A n - 1 FAIRE
        SI n MOD d == 0 ALORS
            RETOURNER 0
        FINSI
    FINPOUR
    RETOURNER 1
FINFONCTION

ALGORITHME CompterPremiers
VARIABLES
    a, b, k, nb : ENTIER
DEBUT
    LIRE(a)
    LIRE(b)
    nb <- 0
    POUR k ALLANT DE a A b FAIRE
        SI estPremier(k) == 1 ALORS
            nb <- nb + 1
        FINSI
    FINPOUR
    AFFICHER(nb)
FIN`,
      },
      {
        id: 'A16_E2',
        chapterId: 'A16',
        title: 'Synthèse 2 : Étendue (Max - Min) d’un relevé de 5 valeurs',
        category: 'synthesis',
        difficulty: 'intermediaire',
        isCoreValidationExercise: true,
        bridgeTargetExerciseId: 'B16_E2',
        prompt: `L'**étendue** d'une série statistique est la différence \`max - min\` entre sa plus grande et sa plus petite valeur.
Écrivez un algorithme qui lit 5 entiers dans un tableau \`tab[5]\`, détermine le minimum et le maximum, puis affiche l'étendue \`max - min\`.`,
        starterCode: `ALGORITHME CalculerEtendue
VARIABLES
    tab : TABLEAU[5] DE ENTIER
    i, min, max : ENTIER
DEBUT
    // Lire les 5 valeurs, calculer min et max, afficher max - min
FIN`,
        testCases: [
          { id: 't1', label: '10, 4, 25, 8, 12 -> 25 - 4 = 21', stdin: '10\n4\n25\n8\n12\n', expectedStdout: '21', isHidden: false },
          { id: 't2', label: 'Valeurs identiques -> 0', stdin: '7\n7\n7\n7\n7\n', expectedStdout: '0', isHidden: false },
          { id: 't3', label: 'Valeurs négatives (-10 à -2 -> 8)', stdin: '-5\n-10\n-2\n-8\n-4\n', expectedStdout: '8', isHidden: true },
        ],
        hints: [
          'Initialisez min <- tab[0] et max <- tab[0] après avoir lu les données.',
          'Parcourez ensuite de 1 à 4 pour mettre à jour min et max, puis affichez max - min.',
        ],
        explanation: `En initialisant \`min\` et \`max\` avec \`tab[0]\`, l'étendue \`max - min\` est correcte quels que soient les signes des nombres lus.`,
        referenceSolution: `ALGORITHME CalculerEtendue
VARIABLES
    tab : TABLEAU[5] DE ENTIER
    i, min, max : ENTIER
DEBUT
    POUR i ALLANT DE 0 A 4 FAIRE
        LIRE(tab[i])
    FINPOUR
    min <- tab[0]
    max <- tab[0]
    POUR i ALLANT DE 1 A 4 FAIRE
        SI tab[i] < min ALORS
            min <- tab[i]
        FINSI
        SI tab[i] > max ALORS
            max <- tab[i]
        FINSI
    FINPOUR
    AFFICHER(max - min)
FIN`,
      },
    ],
  },
];
