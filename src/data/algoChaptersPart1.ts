import { Chapter } from '../types/curriculum';

export const ALGO_CHAPTERS_PART1: Chapter[] = [
  // ==========================================================================
  // CHAPITRE A01 — INTRODUCTION À L'ALGORITHMIQUE ET RÉSOLUTION DE PROBLÈMES
  // ==========================================================================
  {
    id: 'A01',
    trackId: 'algo',
    number: 1,
    title: "Introduction à l'algorithmique et résolution de problèmes",
    subtitle: 'Comprendre ce qu’est un algorithme, décomposer un problème et structurer une séquence d’instructions',
    estimatedMinutes: 35,
    prerequisites: [],
    relatedChapters: ['B01', 'A02'],
    coreConcepts: [
      'Définition d’un algorithme',
      'Schéma Entrées → Traitement → Sorties',
      'Séquentialité et non-ambiguïté',
      'Structure générale d’un pseudo-code',
    ],
    successCriteria: [
      'Identifier les entrées, le traitement et les sorties d’un problème concret',
      'Ordonner une suite logique d’opérations élémentaires sans ambiguïté',
      'Lire et exécuter un premier algorithme en pseudo-code',
    ],
    lesson: {
      objectives: [
        'Comprendre pourquoi un ordinateur a besoin d’instructions précises et non ambiguës.',
        'Décomposer n’importe quel problème selon le modèle Entrées (Inputs) → Traitement (Processing) → Sorties (Outputs).',
        'Découvrir la structure standard du pseudo-code utilisé en école d’ingénieurs.',
      ],
      intuition:
        "Un ordinateur est une machine extrêmement rapide mais totalement dépourvue d'initiative : il ne devine jamais votre intention. Si vous dites à un humain « Fais cuire des pâtes », il sait implicitement qu'il faut prendre une casserole, la remplir d'eau et allumer le feu. Un ordinateur, lui, a besoin que chaque étape élémentaire soit explicitée dans un ordre strict. Concevoir ce plan d'action précis, avant même de toucher à un langage comme le C, s'appelle l'algorithmique.",
      formalDefinition:
        "Un algorithme est une suite finie, ordonnée et non ambiguë d'instructions élémentaires permettant, à partir de données initiales (les entrées), d'obtenir en un temps fini un résultat déterminé (les sorties) répondant à un problème donné.",
      analogy: {
        title: 'La recette de cuisine d’un automate',
        content:
          "Imaginez un robot cuisinier : les ingrédients posés sur la table sont les Entrées (Inputs). Les gestes précis numérotés (« 1. Verser 200 ml d'eau », « 2. Chauffer à 100°C pendant 8 minutes ») constituent le Traitement (Processing). Le plat servi à la fin est la Sortie (Output). Si une instruction dit « Ajouter un peu de sel », le robot bloque car « un peu » est ambigu : il lui faut « Ajouter 5 grammes de sel ».",
      },
      vocabulary: [
        {
          fr: 'Algorithme',
          en: 'Algorithm',
          definition: 'Suite finie et non ambiguë d’instructions résolvant un problème.',
        },
        {
          fr: 'Pseudo-code',
          en: 'Pseudocode',
          definition:
            'Langage structuré en français permettant d’écrire un algorithme sans dépendre de la syntaxe d’un langage machine particulier.',
        },
        {
          fr: 'Entrée / Sortie',
          en: 'Input / Output (I/O)',
          definition:
            'Données fournies à l’algorithme au départ (Entrées) et résultats produits à la fin (Sorties).',
        },
        {
          fr: 'Instruction',
          en: 'Statement / Instruction',
          definition: 'Ordre élémentaire exécuté par la machine (lire, calculer, afficher...).',
        },
      ],
      simpleExample: {
        title: 'Calculer le double d’un nombre donné',
        description:
          'Voici notre tout premier algorithme en pseudo-code : il lit un nombre entier, calcule son double et affiche le résultat.',
        language: 'pseudo',
        code: `Algorithme CalculDouble
Variables
    nombre, resultat : Entier
Début
    Lire(nombre)
    resultat <- nombre * 2
    Afficher(resultat)
Fin`,
        stdin: '7',
        expectedOutput: '14',
        lineExplanations: [
          {
            lineNumber: 1,
            code: 'Algorithme CalculDouble',
            explanation: 'Donne un nom clair à notre algorithme.',
          },
          {
            lineNumber: 2,
            code: 'Variables / nombre, resultat : Entier',
            explanation:
              'Réserve deux emplacements mémoire (« boîtes ») capables de stocker des nombres entiers.',
          },
          {
            lineNumber: 4,
            code: 'Début',
            explanation: 'Marque le commencement de la séquence d’instructions.',
          },
          {
            lineNumber: 5,
            code: 'Lire(nombre)',
            explanation:
              'Entrée : récupère la valeur fournie par l’utilisateur (ici 7) et la range dans la variable nombre.',
          },
          {
            lineNumber: 6,
            code: 'resultat <- nombre * 2',
            explanation:
              'Traitement : multiplie nombre par 2 (7 * 2 = 14) et range le résultat dans la variable resultat.',
          },
          {
            lineNumber: 7,
            code: 'Afficher(resultat)',
            explanation: 'Sortie : affiche la valeur contenue dans resultat (14) à l’écran.',
          },
          {
            lineNumber: 8,
            code: 'Fin',
            explanation: 'Indique que l’algorithme est terminé.',
          },
        ],
      },
      intermediateExample: {
        title: 'Périmètre et aire d’un rectangle',
        description:
          'Un problème comporte souvent plusieurs entrées et plusieurs sorties. Ici, à partir de la largeur et de la longueur, nous calculons le périmètre puis l’aire.',
        language: 'pseudo',
        code: `Algorithme Rectangle
Variables
    largeur, longueur, perimetre, aire : Entier
Début
    Lire(largeur)
    Lire(longueur)
    perimetre <- 2 * (largeur + longueur)
    aire <- largeur * longueur
    Afficher("Perimetre :", perimetre)
    Afficher("Aire :", aire)
Fin`,
        stdin: '4\n6',
        expectedOutput: 'Perimetre : 20\nAire : 24',
        lineExplanations: [
          {
            lineNumber: 5,
            code: 'Lire(largeur) / Lire(longueur)',
            explanation: 'Lit successivement les deux dimensions (4 puis 6).',
          },
          {
            lineNumber: 7,
            code: 'perimetre <- 2 * (largeur + longueur)',
            explanation: 'Calcule 2 * (4 + 6) = 20.',
          },
          {
            lineNumber: 8,
            code: 'aire <- largeur * longueur',
            explanation: 'Calcule 4 * 6 = 24.',
          },
          {
            lineNumber: 9,
            code: 'Afficher("Perimetre :", perimetre)',
            explanation: 'Affiche un libellé explicite suivi de la valeur calculée.',
          },
        ],
      },
      commonMistakes: [
        {
          title: 'Utiliser une donnée avant de l’avoir lue ou initialisée',
          wrongCode: `Début
    resultat <- nombre * 2
    Lire(nombre)
    Afficher(resultat)
Fin`,
          rightCode: `Début
    Lire(nombre)
    resultat <- nombre * 2
    Afficher(resultat)
Fin`,
          explanation:
            'Les instructions sont exécutées de haut en bas. Si vous calculez `nombre * 2` avant `Lire(nombre)`, la variable `nombre` ne contient pas encore la valeur saisie par l’utilisateur !',
          errorType: 'logique',
        },
        {
          title: 'Oublier d’afficher le résultat final',
          wrongCode: `Début
    Lire(nombre)
    resultat <- nombre * 2
Fin`,
          rightCode: `Début
    Lire(nombre)
    resultat <- nombre * 2
    Afficher(resultat)
Fin`,
          explanation:
            'Un calcul effectué en mémoire mais jamais affiché (ni retourné) reste invisible pour l’utilisateur.',
          errorType: 'logique',
        },
      ],
      summary: [
        'Un algorithme résout un problème en transformant des Entrées en Sorties via une séquence finie d’instructions non ambiguës.',
        'L’ordre des instructions est fondamental : la machine exécute chaque ligne séquentiellement, de haut en bas.',
        'On conçoit toujours la logique en pseudo-code avant de la traduire en langage C.',
      ],
      comprehensionQuestions: [
        {
          id: 'A01-Q1',
          question:
            'Quelle propriété est INDISPENSABLE pour qu’une suite d’instructions soit qualifiée d’algorithme ?',
          options: [
            'Elle doit être écrite en anglais uniquement.',
            'Elle doit être finie, ordonnée et dépourvue de toute ambiguïté.',
            'Elle doit obligatoirement comporter plus de 100 lignes.',
            'Elle doit utiliser une intelligence artificielle.',
          ],
          correctIndex: 1,
          explanation:
            'Par définition, un algorithme est une suite finie, ordonnée et non ambiguë d’opérations élémentaires qui se termine en un temps fini.',
        },
        {
          id: 'A01-Q2',
          question:
            'Dans un algorithme qui calcule la moyenne de trois notes saisies au clavier, quelles sont les ENTRÉES ?',
          options: [
            'La moyenne finale affichée à l’écran.',
            'Les trois notes fournies au départ par l’utilisateur.',
            'L’addition et la division par 3.',
            'Le mot-clé Début.',
          ],
          correctIndex: 1,
          explanation:
            'Les entrées (inputs) sont les données brutes fournies au programme (les 3 notes). L’addition/division est le traitement, et la moyenne est la sortie (output).',
        },
      ],
    },
    exercises: [
      {
        id: 'A01-EX1',
        chapterId: 'A01',
        trackId: 'algo',
        title: 'Identifier Entrées, Traitement et Sorties',
        difficulty: 'debutant',
        category: 'qcm',
        testedSkill: 'Distinguer les entrées, le traitement et les sorties d’un problème',
        prerequisites: [],
        statement:
          "On souhaite écrire un algorithme qui demande à un étudiant le prix hors taxe (HT) d'un livre et affiche son prix toutes taxes comprises (TTC) avec une TVA de 20 %. Quelle proposition décrit correctement le schéma Entrée → Traitement → Sortie ?",
        options: [
          'Entrée : Prix TTC | Traitement : Lire le prix HT | Sortie : Multiplier par 1.20',
          'Entrée : Prix HT | Traitement : Calculer Prix HT × 1.20 | Sortie : Prix TTC',
          'Entrée : 20 % | Traitement : Afficher le livre | Sortie : Prix HT',
          'Entrée : Multiplier par 1.20 | Traitement : Prix HT | Sortie : Prix TTC',
        ],
        correctOptionIndex: 1,
        hints: [
          'Demandez-vous d’abord ce que l’utilisateur doit fournir au programme avant tout calcul.',
          'Le calcul mathématique correspond toujours à la phase de Traitement.',
          'Le résultat final communiqué à l’utilisateur est le Prix TTC (la Sortie).',
        ],
        detailedExplanation:
          "L'information connue au départ et saisie par l'utilisateur est le Prix HT (Entrée). L'opération mathématique `Prix TTC <- Prix HT * 1.20` est le Traitement. La valeur affichée à la fin est le Prix TTC (Sortie).",
      },
      {
        id: 'A01-EX2',
        chapterId: 'A01',
        trackId: 'algo',
        title: 'Remettre en ordre un algorithme séquentiel',
        difficulty: 'debutant',
        category: 'ordering',
        testedSkill: 'Respecter la séquentialité Entrée → Traitement → Sortie',
        prerequisites: [],
        statement:
          'Remettez dans l’ordre logique les lignes suivantes pour obtenir un algorithme valide qui lit un nombre entier `x`, lui ajoute 10, et affiche le résultat `res`.',
        scrambledLines: [
          '    Afficher(res)',
          'Algorithme AjoutDix',
          '    Lire(x)',
          'Fin',
          'Variables x, res : Entier',
          '    res <- x + 10',
          'Début',
        ],
        correctOrderIndices: [1, 4, 6, 2, 5, 0, 3],
        hints: [
          'Un algorithme commence toujours par son en-tête `Algorithme ...` suivi de la déclaration `Variables ...` puis `Début`.',
          'À l’intérieur du bloc `Début ... Fin`, il faut d’abord `Lire(x)` avant de pouvoir calculer `res <- x + 10`.',
          'L’instruction `Afficher(res)` vient juste après le calcul et juste avant `Fin`.',
        ],
        detailedExplanation:
          "L'ordre impératif est : 1) En-tête `Algorithme AjoutDix`, 2) Déclaration `Variables x, res : Entier`, 3) `Début`, 4) Entrée `Lire(x)`, 5) Traitement `res <- x + 10`, 6) Sortie `Afficher(res)`, 7) `Fin`.",
      },
      {
        id: 'A01-EX3',
        chapterId: 'A01',
        trackId: 'algo',
        title: 'Écrire votre premier algorithme : Triple d’un entier',
        difficulty: 'debutant',
        category: 'pseudocode',
        isCoreValidationExercise: true,
        testedSkill: 'Écrire un algorithme complet lisant une entrée, effectuant un calcul et affichant la sortie',
        prerequisites: [],
        statement:
          'Complétez et exécutez l’algorithme ci-dessous pour qu’il lise un entier `n`, calcule son triple (`n * 3`) dans une variable `triple`, et affiche uniquement la valeur de `triple`.',
        starterCode: `Algorithme CalculTriple
Variables
    n, triple : Entier
Début
    // 1. Lire l'entier n
    
    // 2. Calculer le triple de n
    
    // 3. Afficher le résultat
    
Fin`,
        referenceSolution: `Algorithme CalculTriple
Variables
    n, triple : Entier
Début
    Lire(n)
    triple <- n * 3
    Afficher(triple)
Fin`,
        testCases: [
          {
            id: 'tc1',
            label: 'Cas normal (n = 5)',
            category: 'normal',
            stdin: '5',
            expectedStdout: '15',
            explanation: 'Le triple de 5 est 15.',
          },
          {
            id: 'tc2',
            label: 'Cas limite (n = 0)',
            category: 'limite',
            stdin: '0',
            expectedStdout: '0',
            explanation: 'Le triple de 0 est 0.',
          },
          {
            id: 'tc3',
            label: 'Nombre négatif (n = -4)',
            category: 'limite',
            stdin: '-4',
            expectedStdout: '-12',
            explanation: 'Le triple de -4 est -12.',
          },
        ],
        hints: [
          'Utilisez `Lire(n)` pour récupérer la valeur d’entrée dans la variable `n`.',
          'Utilisez l’opérateur d’affectation `<-` : `triple <- n * 3`.',
          'Terminez par `Afficher(triple)` sans texte supplémentaire autour.',
        ],
        detailedExplanation:
          'L’algorithme suit exactement les 3 étapes : `Lire(n)` récupère l’entrée, `triple <- n * 3` effectue la multiplication, et `Afficher(triple)` produit la sortie attendue.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE A02 — VARIABLES, CONSTANTES, TYPES ET AFFECTATIONS
  // ==========================================================================
  {
    id: 'A02',
    trackId: 'algo',
    number: 2,
    title: 'Variables, constantes, types et affectations',
    subtitle: 'Comprendre la mémoire, manipuler l’affectation et réaliser l’échange de deux variables',
    estimatedMinutes: 45,
    prerequisites: ['A01'],
    relatedChapters: ['B03', 'A03'],
    coreConcepts: [
      'Notion de variable (nom, type, valeur, adresse)',
      'Types fondamentaux : Entier, Réel, Caractère, Chaîne, Booléen',
      'Opération d’affectation (<-) vs égalité mathématique',
      'Algorithme classique d’échange de deux variables (swap)',
    ],
    successCriteria: [
      'Choisir le type approprié pour représenter une donnée',
      'Prédire la valeur de plusieurs variables après une suite d’affectations',
      'Écrire sans erreur l’échange de deux variables à l’aide d’une variable temporaire',
    ],
    lesson: {
      objectives: [
        'Visualiser une variable comme une case mémoire étiquetée ayant un type précis.',
        'Distinguer une variable (modifiable) d’une constante (figée).',
        'Comprendre le mécanisme exact de l’affectation `x <- expression` (évaluation à droite, écriture à gauche).',
        'Maîtriser le schéma d’échange de deux variables avec une variable temporaire.',
      ],
      intuition:
        "En mathématiques, écrire `x = x + 1` est une absurdité (aucun nombre n'est égal à lui-même plus un). En informatique, l'affectation `x <- x + 1` n'est pas une équation : c'est un ordre d'action dans le temps ! Cela signifie : « Lis la valeur actuelle dans la boîte `x`, ajoute-lui 1, puis écrase le contenu de la boîte `x` avec ce nouveau résultat ».",
      formalDefinition:
        "Une variable est une zone mémoire repérée par un identifiant (son nom) et caractérisée par un type qui détermine l'ensemble des valeurs qu'elle peut contenir ainsi que les opérations autorisées. L'affectation (`<-`) évalue d'abord l'expression située à droite de la flèche, puis stocke la valeur obtenue dans la variable située à gauche, en écrasant son ancienne valeur.",
      analogy: {
        title: 'Les deux verres de liquide coloré (Échange de variables)',
        content:
          "Imaginez un verre A rempli de sirop de menthe (vert) et un verre B rempli de grenadine (rouge). Comment échanger leur contenu ? Si vous versez A directement dans B, les deux liquides se mélangent et le contenu initial de B est perdu ! Vous avez obligatoirement besoin d'un troisième verre vide `temp` : 1) Verser A dans `temp`, 2) Verser B dans A, 3) Verser `temp` dans B.",
      },
      vocabulary: [
        {
          fr: 'Variable',
          en: 'Variable',
          definition: 'Emplacement mémoire nommé dont la valeur peut évoluer au cours de l’exécution.',
        },
        {
          fr: 'Constante',
          en: 'Constant',
          definition: 'Donnée nommée dont la valeur est fixée dès sa déclaration et ne peut plus être modifiée.',
        },
        {
          fr: 'Affectation',
          en: 'Assignment',
          definition: 'Opération consistant à attribuer une nouvelle valeur à une variable (`x <- valeur`).',
        },
        {
          fr: 'Variable temporaire',
          en: 'Temporary variable',
          definition: 'Variable intermédiaire utilisée pour sauvegarder une valeur avant qu’elle ne soit écrasée.',
        },
      ],
      simpleExample: {
        title: 'Évolution d’une variable par affectations successives',
        description:
          'Observons comment une variable écrase son ancienne valeur à chaque nouvelle affectation.',
        language: 'pseudo',
        code: `Algorithme SuiviAffectations
Variables
    score, bonus : Entier
Début
    score <- 10
    bonus <- 5
    score <- score + bonus
    Afficher(score)
Fin`,
        expectedOutput: '15',
        lineExplanations: [
          {
            lineNumber: 5,
            code: 'score <- 10',
            explanation: 'La boîte `score` reçoit la valeur 10.',
          },
          {
            lineNumber: 6,
            code: 'bonus <- 5',
            explanation: 'La boîte `bonus` reçoit la valeur 5.',
          },
          {
            lineNumber: 7,
            code: 'score <- score + bonus',
            explanation:
              'On évalue d’abord la droite : `score + bonus` vaut `10 + 5 = 15`. Puis on range 15 dans `score` (l’ancien 10 est écrasé).',
          },
        ],
      },
      intermediateExample: {
        title: 'Échange (Swap) de deux variables avec variable temporaire',
        description:
          'Cet algorithme fondamental échange les valeurs de `a` et `b` sans perdre de données.',
        language: 'pseudo',
        code: `Algorithme EchangeVariables
Variables
    a, b, temp : Entier
Début
    Lire(a)
    Lire(b)
    temp <- a
    a <- b
    b <- temp
    Afficher(a, b)
Fin`,
        stdin: '12\n99',
        expectedOutput: '99 12',
        lineExplanations: [
          {
            lineNumber: 7,
            code: 'temp <- a',
            explanation: 'Sauvegarde la valeur initiale de `a` (12) dans `temp`.',
          },
          {
            lineNumber: 8,
            code: 'a <- b',
            explanation: 'Copie la valeur de `b` (99) dans `a`. `a` vaut maintenant 99.',
          },
          {
            lineNumber: 9,
            code: 'b <- temp',
            explanation: 'Récupère la valeur sauvegardée dans `temp` (12) et la range dans `b`.',
          },
        ],
      },
      commonMistakes: [
        {
          title: 'Échanger deux variables sans variable temporaire',
          wrongCode: `a <- b
b <- a`,
          rightCode: `temp <- a
a <- b
b <- temp`,
          explanation:
            'Dans le code erroné, dès la première ligne `a <- b`, l’ancienne valeur de `a` est détruite ! À la ligne suivante `b <- a`, `a` et `b` contiennent toutes les deux l’ancienne valeur de `b`.',
          errorType: 'logique',
        },
        {
          title: 'Inverser le sens de l’affectation',
          wrongCode: `10 <- x`,
          rightCode: `x <- 10`,
          explanation:
            'À gauche de la flèche `<-` doit toujours figurer le nom d’une variable réceptrice (jamais un nombre ou un calcul).',
          errorType: 'syntaxe',
        },
      ],
      summary: [
        'Les 5 types algorithmiques de base sont : Entier (ex: -3, 42), Réel (ex: 3.14), Caractère (ex: \'A\'), Chaîne (ex: "Bonjour") et Booléen (Vrai / Faux).',
        'Une affectation écrase toujours la valeur précédente de la variable cible.',
        'L’échange de deux variables `a` et `b` nécessite impérativement une variable intermédiaire `temp` (3 affectations : `temp <- a`, `a <- b`, `b <- temp`).',
      ],
      comprehensionQuestions: [
        {
          id: 'A02-Q1',
          question:
            'Après les instructions `x <- 4`, `y <- 7`, `x <- y`, `y <- x`, quelles sont les valeurs finales de `x` et `y` ?',
          options: [
            'x vaut 7 et y vaut 4',
            'x vaut 7 et y vaut 7',
            'x vaut 4 et y vaut 4',
            'x vaut 11 et y vaut 7',
          ],
          correctIndex: 1,
          explanation:
            'Lors de `x <- y`, `x` prend la valeur 7 (la valeur 4 est perdue). Ensuite `y <- x` copie 7 dans `y`. Les deux valent donc 7 !',
        },
        {
          id: 'A02-Q2',
          question:
            'Quel type algorithmique est le plus adapté pour stocker le fait qu’un capteur d’alarme est déclenché ou non ?',
          options: ['Réel', 'Chaîne', 'Booléen (Vrai / Faux)', 'Entier'],
          correctIndex: 2,
          explanation:
            'Un état logique binaire (oui/non, actif/inactif, vrai/faux) est représenté par le type Booléen.',
        },
      ],
    },
    exercises: [
      {
        id: 'A02-EX1',
        chapterId: 'A02',
        trackId: 'algo',
        title: 'Prédire l’état final des variables',
        difficulty: 'debutant',
        category: 'prediction',
        testedSkill: 'Suivre l’évolution de variables lors d’affectations successives',
        prerequisites: ['A01'],
        statement:
          'Quel texte exact est affiché par l’algorithme suivant ? (Écrivez les deux nombres séparés par une espace).',
        codeLanguage: 'pseudo',
        codeSnippet: `Algorithme TraceSimple
Variables
    a, b : Entier
Début
    a <- 3
    b <- 8
    a <- a + b
    b <- a - 2
    Afficher(a, b)
Fin`,
        expectedOutputAnswer: '11 9',
        hints: [
          'Tracez chaque ligne sur papier : au départ `a = 3` et `b = 8`.',
          'À la ligne `a <- a + b`, on calcule `3 + 8 = 11`, donc `a` devient 11 (et `b` vaut toujours 8).',
          'À la ligne `b <- a - 2`, on utilise la NOUVELLE valeur de `a` (11) : `11 - 2 = 9`.',
        ],
        detailedExplanation:
          '1) `a` vaut 3, `b` vaut 8. 2) `a <- 3 + 8` donc `a` vaut 11. 3) `b <- 11 - 2` donc `b` vaut 9. L’affichage produit `11 9`.',
      },
      {
        id: 'A02-EX2',
        chapterId: 'A02',
        trackId: 'algo',
        title: 'Table de trace d’un échange de variables',
        difficulty: 'debutant',
        category: 'trace',
        testedSkill: 'Construire la table de trace pas-à-pas d’une séquence d’affectations',
        prerequisites: ['A01'],
        statement:
          'Complétez les cases marquées par `?` dans la table de trace ci-dessous pour suivre l’exécution de l’algorithme d’échange.',
        traceSpec: {
          language: 'pseudo',
          code: `a <- 15
b <- 40
temp <- a
a <- b
b <- temp`,
          columns: ['Instruction', 'a', 'b', 'temp'],
          prefilledRows: [
            { Instruction: 'a <- 15', a: '15', b: '-', temp: '-' },
            { Instruction: 'b <- 40', a: '15', b: '40', temp: '-' },
            { Instruction: 'temp <- a', a: '15', b: '40', temp: '?' },
            { Instruction: 'a <- b', a: '?', b: '40', temp: '15' },
            { Instruction: 'b <- temp', a: '40', b: '?', temp: '15' },
          ],
          expectedAnswers: {
            '2:temp': '15',
            '3:a': '40',
            '4:b': '15',
          },
        },
        hints: [
          'À l’étape `temp <- a`, la valeur actuelle de `a` (15) est copiée dans `temp`.',
          'À l’étape `a <- b`, la valeur actuelle de `b` (40) est copiée dans `a`.',
          'À l’étape `b <- temp`, la valeur conservée dans `temp` (15) est copiée dans `b`.',
        ],
        detailedExplanation:
          'La table de trace montre clairement que `temp` joue le rôle de mémoire tampon : elle retient 15 pendant que `a` reçoit 40, puis restitue 15 à `b`.',
      },
      {
        id: 'A02-EX3',
        chapterId: 'A02',
        trackId: 'algo',
        title: 'Permutation circulaire de trois variables',
        difficulty: 'intermediaire',
        category: 'pseudocode',
        isCoreValidationExercise: true,
        bridgeTargetChapterId: 'B03',
        testedSkill: 'Manipuler une variable temporaire pour permuter trois variables',
        prerequisites: ['A01'],
        statement:
          'Écrivez un algorithme qui lit trois entiers `a`, `b`, `c` et réalise une permutation circulaire vers la gauche : `a` prend la valeur initiale de `b`, `b` prend la valeur initiale de `c`, et `c` prend la valeur initiale de `a`. Affichez ensuite `a`, `b`, `c` avec `Afficher(a, b, c)`.',
        starterCode: `Algorithme PermutationCirculaire
Variables
    a, b, c, temp : Entier
Début
    Lire(a)
    Lire(b)
    Lire(c)
    // Réalisez la permutation circulaire à l'aide de temp
    
    Afficher(a, b, c)
Fin`,
        referenceSolution: `Algorithme PermutationCirculaire
Variables
    a, b, c, temp : Entier
Début
    Lire(a)
    Lire(b)
    Lire(c)
    temp <- a
    a <- b
    b <- c
    c <- temp
    Afficher(a, b, c)
Fin`,
        testCases: [
          {
            id: 'tc1',
            label: 'Cas standard (10, 20, 30)',
            category: 'normal',
            stdin: '10\n20\n30',
            expectedStdout: '20 30 10',
            explanation: 'a devient 20, b devient 30, c devient 10.',
          },
          {
            id: 'tc2',
            label: 'Valeurs négatives et nulles (-5, 0, 8)',
            category: 'limite',
            stdin: '-5\n0\n8',
            expectedStdout: '0 8 -5',
            explanation: 'a devient 0, b devient 8, c devient -5.',
          },
        ],
        hints: [
          'Quelle est la première variable dont la valeur va être écrasée ? Sauvegardez-la d’abord dans `temp`.',
          'Si vous sauvegardez `temp <- a`, vous pouvez ensuite écraser `a` en faisant `a <- b`.',
          'Continuez avec `b <- c`, puis terminez en plaçant `temp` dans `c`.',
        ],
        detailedExplanation:
          'En sauvegardant `a` dans `temp` (`temp <- a`), on libère `a` qui peut recevoir `b` (`a <- b`), puis `b` reçoit `c` (`b <- c`), et enfin `c` récupère l’ancienne valeur de `a` via `c <- temp`.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE A03 — EXPRESSIONS, OPÉRATEURS ET CALCULS
  // ==========================================================================
  {
    id: 'A03',
    trackId: 'algo',
    number: 3,
    title: 'Expressions, opérateurs et calculs',
    subtitle: 'Priorités opératoires, division entière DIV, reste MOD et expressions booléennes',
    estimatedMinutes: 45,
    prerequisites: ['A02'],
    relatedChapters: ['B03', 'B04'],
    coreConcepts: [
      'Opérateurs arithmétiques (+, -, *, /, DIV, MOD)',
      'Division entière (quotient) et Modulo (reste)',
      'Priorité des opérateurs et parenthésage',
      'Opérateurs de comparaison et logiques (ET, OU, NON)',
    ],
    successCriteria: [
      'Utiliser DIV et MOD pour décomposer une durée ou tester la divisibilité',
      'Évaluer sans erreur une expression arithmétique et booléenne complexe',
    ],
    lesson: {
      objectives: [
        'Faire la différence fondamentale entre la division réelle (`/`), la division entière (`DIV`) et le reste de la division euclidienne (`MOD`).',
        'Maîtriser les règles de priorité des opérateurs et l’usage des parenthèses.',
        'Construire des expressions booléennes avec `ET`, `OU` et `NON`.',
      ],
      intuition:
        "Si vous devez répartir 14 pommes équitablement entre 4 personnes sans couper les pommes, chacun reçoit 3 pommes entières (c'est le quotient entier : `14 DIV 4 = 3`) et il reste 2 pommes dans le panier (c'est le reste ou modulo : `14 MOD 4 = 2`). En informatique, ces deux opérations sont omniprésentes : convertir des secondes en heures/minutes, savoir si un nombre est pair (`n MOD 2 = 0`), ou extraire les chiffres d'un nombre.",
      formalDefinition:
        "Une expression est une combinaison valide de constantes, de variables, d'opérateurs et d'appels de fonctions dont l'évaluation produit une valeur unique d'un type déterminé. Pour deux entiers $a$ et $b > 0$, la division euclidienne s'écrit $a = (a \\text{ DIV } b) \\times b + (a \\text{ MOD } b)$ avec $0 \\le (a \\text{ MOD } b) < b$.",
      analogy: {
        title: 'L’horloge et la conversion de secondes',
        content:
          "Quand vous avez 135 secondes, combien cela fait-il de minutes et de secondes ? Chaque paquet de 60 secondes forme 1 minute : `minutes <- 135 DIV 60` (2 minutes). Les secondes qui n'ont pas pu former une minute complète sont le reste : `secondes <- 135 MOD 60` (15 secondes).",
      },
      vocabulary: [
        {
          fr: 'Division entière',
          en: 'Integer division',
          definition: 'Quotient entier de la division euclidienne (`17 DIV 5` donne `3`).',
        },
        {
          fr: 'Modulo (Reste)',
          en: 'Modulo / Remainder',
          definition: 'Reste de la division entière (`17 MOD 5` donne `2`). En langage C, il s’écrit `%`.',
        },
        {
          fr: 'Priorité des opérateurs',
          en: 'Operator precedence',
          definition: 'Règle déterminant quel opérateur est calculé en premier (ex: `*` avant `+`).',
        },
        {
          fr: 'Opérateur booléen',
          en: 'Logical operator',
          definition: 'Opérateur combinant des conditions vraies ou fausses (`ET`, `OU`, `NON`).',
        },
      ],
      simpleExample: {
        title: 'Quotient et reste d’une division entière',
        description:
          'Calculons combien de boîtes de 6 œufs on peut remplir avec `n` œufs, et combien d’œufs restent.',
        language: 'pseudo',
        code: `Algorithme BoitesOeufs
Variables
    n, boites, reste : Entier
Début
    Lire(n)
    boites <- n DIV 6
    reste <- n MOD 6
    Afficher(boites, reste)
Fin`,
        stdin: '20',
        expectedOutput: '3 2',
        lineExplanations: [
          {
            lineNumber: 6,
            code: 'boites <- n DIV 6',
            explanation: '20 DIV 6 vaut 3 (car 3 * 6 = 18). On remplit 3 boîtes complètes.',
          },
          {
            lineNumber: 7,
            code: 'reste <- n MOD 6',
            explanation: '20 MOD 6 vaut 2 (car 20 - 18 = 2). Il reste 2 œufs.',
          },
        ],
      },
      intermediateExample: {
        title: 'Convertir une durée en secondes vers Heures, Minutes, Secondes',
        description:
          'Un grand classique des examens de 1re année : décomposer un nombre total de secondes en heures, minutes et secondes.',
        language: 'pseudo',
        code: `Algorithme ConversionDuree
Variables
    total, heures, reste, minutes, secondes : Entier
Début
    Lire(total)
    heures <- total DIV 3600
    reste <- total MOD 3600
    minutes <- reste DIV 60
    secondes <- reste MOD 60
    Afficher(heures, minutes, secondes)
Fin`,
        stdin: '3735',
        expectedOutput: '1 2 15',
        lineExplanations: [
          {
            lineNumber: 6,
            code: 'heures <- total DIV 3600',
            explanation: '1 heure = 3600 secondes. 3735 DIV 3600 = 1 heure.',
          },
          {
            lineNumber: 7,
            code: 'reste <- total MOD 3600',
            explanation: 'Il reste 3735 MOD 3600 = 135 secondes à répartir.',
          },
          {
            lineNumber: 8,
            code: 'minutes <- reste DIV 60 / secondes <- reste MOD 60',
            explanation: '135 DIV 60 = 2 minutes, et 135 MOD 60 = 15 secondes.',
          },
        ],
      },
      commonMistakes: [
        {
          title: 'Oublier les parenthèses dans un calcul de moyenne',
          wrongCode: `moyenne <- note1 + note2 / 2`,
          rightCode: `moyenne <- (note1 + note2) / 2`,
          explanation:
            'La division `/` est prioritaire sur l’addition `+`. Sans parenthèses, seule `note2` est divisée par 2 !',
          errorType: 'logique',
        },
        {
          title: 'Confondre DIV et MOD pour tester la parité',
          wrongCode: `estPair <- (n DIV 2 = 0)`,
          rightCode: `estPair <- (n MOD 2 = 0)`,
          explanation:
            'Un nombre est pair si le RESTE de sa division par 2 vaut 0 (`n MOD 2 = 0`), et non son quotient !',
          errorType: 'logique',
        },
      ],
      summary: [
        '`*`, `/`, `DIV` et `MOD` ont la même priorité, supérieure à `+` et `-`. En cas de doute, utilisez des parenthèses `(...)`.',
        '`n MOD 2 = 0` teste si `n` est pair ; `n MOD 10` donne le chiffre des unités d’un entier positif `n`.',
        '`ET` est vrai uniquement si les deux conditions sont vraies ; `OU` est vrai dès qu’au moins une condition est vraie.',
      ],
      comprehensionQuestions: [
        {
          id: 'A03-Q1',
          question: 'Que valent respectivement `23 DIV 5` et `23 MOD 5` ?',
          options: [
            '4.6 et 3',
            '4 et 3',
            '3 et 4',
            '5 et 2',
          ],
          correctIndex: 1,
          explanation: 'Car 23 = 4 × 5 + 3. Le quotient entier (DIV) est 4 et le reste (MOD) est 3.',
        },
        {
          id: 'A03-Q2',
          question: 'Que vaut l’expression `4 + 6 * 2` ?',
          options: ['20', '16', '12', '24'],
          correctIndex: 1,
          explanation: 'La multiplication est prioritaire sur l’addition : `6 * 2 = 12`, puis `4 + 12 = 16`.',
        },
      ],
    },
    exercises: [
      {
        id: 'A03-EX1',
        chapterId: 'A03',
        trackId: 'algo',
        title: 'Extraire les chiffres d’un nombre avec DIV et MOD',
        difficulty: 'debutant',
        category: 'qcm',
        testedSkill: 'Comprendre les propriétés de DIV 10 et MOD 10 en base 10',
        prerequisites: ['A02'],
        statement:
          'Soit une variable entière `n` contenant la valeur `487`. Quelle expression permet d’obtenir le chiffre des unités (`7`) ?',
        options: ['n DIV 10', 'n MOD 10', 'n DIV 100', 'n MOD 100'],
        correctOptionIndex: 1,
        hints: [
          'En base 10, diviser par 10 décale les chiffres : `487 = 48 * 10 + 7`.',
          '`487 DIV 10` donne le quotient `48`.',
          'Le chiffre des unités est le reste de la division par 10.',
        ],
        detailedExplanation:
          '`487 = 48 × 10 + 7`, donc `487 MOD 10` donne `7` (chiffre des unités) tandis que `487 DIV 10` donne `48`.',
      },
      {
        id: 'A03-EX2',
        chapterId: 'A03',
        trackId: 'algo',
        title: 'Corriger le calcul d’une moyenne pondérée',
        difficulty: 'debutant',
        category: 'bugfix',
        testedSkill: 'Corriger une erreur de priorité des opérateurs avec des parenthèses',
        prerequisites: ['A02'],
        statement:
          'L’algorithme suivant doit calculer la moyenne entière de deux notes `n1` et `n2` `(n1 + n2) DIV 2`, mais il contient un bug de priorité opératoire. Corrigez-le !',
        starterCode: `Algorithme MoyenneEntiere
Variables
    n1, n2, moy : Entier
Début
    Lire(n1)
    Lire(n2)
    moy <- n1 + n2 DIV 2
    Afficher(moy)
Fin`,
        referenceSolution: `Algorithme MoyenneEntiere
Variables
    n1, n2, moy : Entier
Début
    Lire(n1)
    Lire(n2)
    moy <- (n1 + n2) DIV 2
    Afficher(moy)
Fin`,
        testCases: [
          {
            id: 'tc1',
            label: 'Notes 12 et 16',
            category: 'normal',
            stdin: '12\n16',
            expectedStdout: '14',
            explanation: '(12 + 16) DIV 2 = 28 DIV 2 = 14 (sans parenthèses : 12 + 8 = 20 !).',
          },
          {
            id: 'tc2',
            label: 'Notes 10 et 10',
            category: 'limite',
            stdin: '10\n10',
            expectedStdout: '10',
            explanation: '(10 + 10) DIV 2 = 10.',
          },
        ],
        hints: [
          'Observez la ligne `moy <- n1 + n2 DIV 2`.',
          'L’opérateur `DIV` est évalué avant `+`.',
          'Entourez `n1 + n2` de parenthèses : `(n1 + n2) DIV 2`.',
        ],
        detailedExplanation:
          'Sans parenthèses, `n1 + n2 DIV 2` calcule `n1 + (n2 DIV 2)`. En écrivant `(n1 + n2) DIV 2`, la somme est effectuée avant la division.',
      },
      {
        id: 'A03-EX3',
        chapterId: 'A03',
        trackId: 'algo',
        title: 'Somme des chiffres d’un nombre à 2 chiffres',
        difficulty: 'intermediaire',
        category: 'pseudocode',
        isCoreValidationExercise: true,
        bridgeTargetChapterId: 'B03',
        testedSkill: 'Combiner DIV et MOD pour manipuler les chiffres d’un entier',
        prerequisites: ['A02'],
        statement:
          'Écrivez un algorithme qui lit un entier positif `n` compris entre 10 et 99, extrait son chiffre des dizaines et son chiffre des unités à l’aide de `DIV` et `MOD`, et affiche la somme de ces deux chiffres.',
        starterCode: `Algorithme SommeDeuxChiffres
Variables
    n, dizaines, unites, somme : Entier
Début
    Lire(n)
    // Calculez dizaines, unites puis somme
    
    Afficher(somme)
Fin`,
        referenceSolution: `Algorithme SommeDeuxChiffres
Variables
    n, dizaines, unites, somme : Entier
Début
    Lire(n)
    dizaines <- n DIV 10
    unites <- n MOD 10
    somme <- dizaines + unites
    Afficher(somme)
Fin`,
        testCases: [
          {
            id: 'tc1',
            label: 'n = 47 (4 + 7 = 11)',
            category: 'normal',
            stdin: '47',
            expectedStdout: '11',
            explanation: '47 DIV 10 = 4 et 47 MOD 10 = 7, somme = 11.',
          },
          {
            id: 'tc2',
            label: 'Cas limite n = 10 (1 + 0 = 1)',
            category: 'limite',
            stdin: '10',
            expectedStdout: '1',
            explanation: '10 DIV 10 = 1 et 10 MOD 10 = 0, somme = 1.',
          },
          {
            id: 'tc3',
            label: 'Cas limite n = 99 (9 + 9 = 18)',
            category: 'limite',
            stdin: '99',
            expectedStdout: '18',
            explanation: '9 + 9 = 18.',
          },
        ],
        hints: [
          'Le chiffre des dizaines d’un nombre entre 10 et 99 s’obtient par `dizaines <- n DIV 10`.',
          'Le chiffre des unités s’obtient par `unites <- n MOD 10`.',
          'Additionnez `somme <- dizaines + unites` puis appelez `Afficher(somme)`.',
        ],
        detailedExplanation:
          'Pour tout entier à deux chiffres `n`, `n DIV 10` isole les dizaines et `n MOD 10` isole les unités. Leur somme donne la somme des chiffres.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE A04 — ENTRÉES ET SORTIES
  // ==========================================================================
  {
    id: 'A04',
    trackId: 'algo',
    number: 4,
    title: 'Entrées et sorties (Dialogue Homme-Machine)',
    subtitle: 'Concevoir des lectures et affichages clairs, séquentiels et bien structurés',
    estimatedMinutes: 35,
    prerequisites: ['A02', 'A03'],
    relatedChapters: ['B05'],
    coreConcepts: [
      'Instruction Lire() et flux d’entrée standard',
      'Instruction Afficher() et combinaison texte + variables',
      'Synchronisation entre les lectures et les données fournies',
    ],
    successCriteria: [
      'Écrire un algorithme qui lit plusieurs données dans un ordre imposé et formate sa sortie',
      'Distinguer le nom d’une variable (`Afficher(x)`) d’une chaîne littérale (`Afficher("x")`)',
    ],
    lesson: {
      objectives: [
        'Comprendre le fonctionnement du flux d’entrée (`Lire`) et du flux de sortie (`Afficher`).',
        'Ne jamais confondre `Afficher("prix")` (qui écrit le mot "prix") et `Afficher(prix)` (qui écrit la valeur numérique contenue dans la variable `prix`).',
        'Préparer la transition vers `printf` et `scanf` en langage C.',
      ],
      intuition:
        "Un algorithme qui calcule sans jamais lire d'entrées fait toujours exactement le même calcul sur les mêmes valeurs figées. C'est `Lire(...)` qui rend un algorithme général : il peut traiter n'importe quelle valeur fournie au moment de l'exécution.",
      formalDefinition:
        "Une instruction de lecture (`Lire(v)`) suspend l'exécution pour consommer la prochaine donnée disponible sur le canal d'entrée standard (`stdin`) et l'affecter à la variable `v`. Une instruction d'écriture (`Afficher(e1, e2, ...)`) évalue chaque expression passée en argument et émet sa représentation textuelle sur le canal de sortie standard (`stdout`).",
      analogy: {
        title: 'Le guichet de gare',
        content:
          "Le formulaire que vous remplissez au guichet (ville de départ, ville d'arrivée, âge) correspond aux instructions `Lire(...)`. Le billet imprimé qui combine du texte fixe (« Billet valable pour : ») et vos données variables correspond à `Afficher(...)`.",
      },
      vocabulary: [
        {
          fr: 'Entrée standard',
          en: 'Standard input (stdin)',
          definition: 'Flux de données entrant dans le programme (généralement le clavier ou un fichier de test).',
        },
        {
          fr: 'Sortie standard',
          en: 'Standard output (stdout)',
          definition: 'Flux de texte produit par le programme (généralement affiché dans la console).',
        },
        {
          fr: 'Chaîne littérale',
          en: 'String literal',
          definition: 'Texte fixe entouré de guillemets, par exemple `"Total : "`.',
        },
      ],
      simpleExample: {
        title: 'Différence entre chaîne entre guillemets et variable',
        description:
          'Observons comment combiner du texte fixe (entre guillemets) et la valeur d’une variable (sans guillemets).',
        language: 'pseudo',
        code: `Algorithme FactureSimple
Variables
    quantite, prixUnitaire, total : Entier
Début
    Lire(quantite)
    Lire(prixUnitaire)
    total <- quantite * prixUnitaire
    Afficher("Total :", total)
Fin`,
        stdin: '3\n15',
        expectedOutput: 'Total : 45',
        lineExplanations: [
          {
            lineNumber: 5,
            code: 'Lire(quantite) / Lire(prixUnitaire)',
            explanation: 'Consomme la 1re valeur d’entrée (3) dans `quantite` et la 2e (15) dans `prixUnitaire`.',
          },
          {
            lineNumber: 8,
            code: 'Afficher("Total :", total)',
            explanation:
              '"Total :" est entre guillemets : il est affiché tel quel. `total` est sans guillemets : sa valeur (45) est affichée.',
          },
        ],
      },
      intermediateExample: {
        title: 'Calcul d’un bulletin de notes sur trois matières',
        description: 'Lecture de trois notes coefficientées et affichage de la somme des points.',
        language: 'pseudo',
        code: `Algorithme PointsPonderes
Variables
    math, info, phys, points : Entier
Début
    Lire(math)
    Lire(info)
    Lire(phys)
    points <- (math * 3) + (info * 4) + (phys * 2)
    Afficher("Points :", points)
Fin`,
        stdin: '14\n16\n12',
        expectedOutput: 'Points : 130',
        lineExplanations: [
          {
            lineNumber: 8,
            code: 'points <- (math * 3) + (info * 4) + (phys * 2)',
            explanation: 'Calcule 14*3 + 16*4 + 12*2 = 42 + 64 + 24 = 130.',
          },
        ],
      },
      commonMistakes: [
        {
          title: 'Mettre le nom de la variable entre guillemets dans Afficher',
          wrongCode: `total <- 45
Afficher("total")`,
          rightCode: `total <- 45
Afficher(total)`,
          explanation:
            '`Afficher("total")` affiche les 5 lettres t-o-t-a-l au lieu du nombre 45 contenu dans la variable `total` !',
          errorType: 'logique',
        },
        {
          title: 'Inverser l’ordre des Lire() par rapport aux données d’entrée',
          wrongCode: `// Entrée : d'abord l'âge (20), puis l'année (2026)
Lire(annee)
Lire(age)`,
          rightCode: `Lire(age)
Lire(annee)`,
          explanation:
            'Les valeurs de `stdin` sont lues strictement dans l’ordre où elles arrivent. Si vous inversez les deux `Lire`, `annee` recevra 20 et `age` recevra 2026 !',
          errorType: 'logique',
        },
      ],
      summary: [
        '`Lire(v)` lit la prochaine valeur sur l’entrée standard et la stocke dans `v`.',
        'Dans `Afficher(...)`, tout ce qui est entre guillemets `"..."` est affiché littéralement ; tout identifiant sans guillemets est remplacé par sa valeur.',
      ],
      comprehensionQuestions: [
        {
          id: 'A04-Q1',
          question: 'Si la variable `x` vaut `25`, qu’affiche l’instruction `Afficher("x =", x)` ?',
          options: ['x = x', '25 = 25', 'x = 25', '"x =" 25'],
          correctIndex: 2,
          explanation: '`"x ="` est une chaîne littérale et `x` est évalué à `25`, ce qui affiche `x = 25`.',
        },
        {
          id: 'A04-Q2',
          question:
            'Que se passe-t-il si vous appelez deux fois de suite `Lire(a)` puis `Lire(a)` avec les entrées `10` puis `20` ?',
          options: [
            'a vaut 10',
            'a vaut 20 (le second Lire écrase le premier)',
            'a vaut 30',
            'Une erreur de syntaxe se produit',
          ],
          correctIndex: 1,
          explanation:
            'Le premier `Lire(a)` met 10 dans `a`, et le second `Lire(a)` écrase `a` avec la deuxième valeur lue (20).',
        },
      ],
    },
    exercises: [
      {
        id: 'A04-EX1',
        chapterId: 'A04',
        trackId: 'algo',
        title: 'Prédire l’affichage combinant texte et variables',
        difficulty: 'debutant',
        category: 'prediction',
        testedSkill: 'Distinguer chaîne littérale et évaluation de variable dans Afficher()',
        prerequisites: ['A02'],
        statement:
          'Si l’entrée fournie est `8` suivi de `3`, qu’affiche exactement cet algorithme ?',
        codeLanguage: 'pseudo',
        codeSnippet: `Algorithme TestAffichage
Variables
    a, b, diff : Entier
Début
    Lire(a)
    Lire(b)
    diff <- a - b
    Afficher("Difference :", diff)
Fin`,
        stdinForPrediction: '8\n3',
        expectedOutputAnswer: 'Difference : 5',
        hints: [
          '`a` reçoit 8 et `b` reçoit 3.',
          '`diff` reçoit `8 - 3 = 5`.',
          '`Afficher("Difference :", diff)` sépare ses arguments par une espace.',
        ],
        detailedExplanation: 'La chaîne `"Difference :"` est suivie d’une espace et de la valeur de `diff` (5), soit `Difference : 5`.',
      },
      {
        id: 'A04-EX2',
        chapterId: 'A04',
        trackId: 'algo',
        title: 'Compléter un algorithme de calcul d’aire de triangle rectangle',
        difficulty: 'debutant',
        category: 'completion',
        testedSkill: 'Compléter les instructions Lire et Afficher d’un algorithme',
        prerequisites: ['A03'],
        statement:
          'Complétez les trois trous pour lire la `base` et la `hauteur` entières d’un triangle rectangle, calculer `(base * hauteur) DIV 2` dans `aire`, et afficher `aire`.',
        templateWithGaps: `Algorithme AireTriangle
Variables
    base, hauteur, aire : Entier
Début
    {{GAP_1}}(base)
    Lire({{GAP_2}})
    aire <- (base * hauteur) DIV 2
    {{GAP_3}}(aire)
Fin`,
        gaps: [
          {
            id: 'GAP_1',
            placeholder: 'Instruction de lecture',
            acceptedAnswers: ['Lire', 'lire'],
            explanation: 'On utilise `Lire(base)` pour lire la première entrée.',
          },
          {
            id: 'GAP_2',
            placeholder: 'Nom de la 2e variable',
            acceptedAnswers: ['hauteur'],
            explanation: 'La seconde dimension à lire est `hauteur`.',
          },
          {
            id: 'GAP_3',
            placeholder: 'Instruction de sortie',
            acceptedAnswers: ['Afficher', 'afficher', 'Ecrire', 'ecrire'],
            explanation: 'On utilise `Afficher(aire)` pour produire la sortie.',
          },
        ],
        hints: [
          'Quelle instruction permet de saisir une donnée en pseudo-code ?',
          'Quelles sont les deux variables utilisées dans `(base * hauteur) DIV 2` ?',
          'Quelle instruction permet d’écrire le résultat à l’écran ?',
        ],
        detailedExplanation:
          '`Lire(base)` et `Lire(hauteur)` récupèrent les deux entrées, puis `Afficher(aire)` affiche le résultat du calcul.',
      },
      {
        id: 'A04-EX3',
        chapterId: 'A04',
        trackId: 'algo',
        title: 'Calculateur de monnaie rendue',
        difficulty: 'intermediaire',
        category: 'pseudocode',
        isCoreValidationExercise: true,
        bridgeTargetChapterId: 'B05',
        testedSkill: 'Lire deux entrées, calculer un rendu de monnaie en billets de 10 et pièces de 1',
        prerequisites: ['A03'],
        statement:
          'Écrivez un algorithme qui lit le `prix` à payer puis la `sommeDonnee` par le client (avec `sommeDonnee >= prix`). Calculez la monnaie totale à rendre `rendu <- sommeDonnee - prix`, puis le nombre de billets de 10 € (`billets10 <- rendu DIV 10`) et de pièces de 1 € (`pieces1 <- rendu MOD 10`). Affichez enfin `Afficher(billets10, pieces1)`.',
        starterCode: `Algorithme RenduMonnaie
Variables
    prix, sommeDonnee, rendu, billets10, pieces1 : Entier
Début
    // 1. Lire prix puis sommeDonnee
    
    // 2. Calculer rendu, billets10 et pieces1
    
    // 3. Afficher billets10 et pieces1
    
Fin`,
        referenceSolution: `Algorithme RenduMonnaie
Variables
    prix, sommeDonnee, rendu, billets10, pieces1 : Entier
Début
    Lire(prix)
    Lire(sommeDonnee)
    rendu <- sommeDonnee - prix
    billets10 <- rendu DIV 10
    pieces1 <- rendu MOD 10
    Afficher(billets10, pieces1)
Fin`,
        testCases: [
          {
            id: 'tc1',
            label: 'Prix 23 €, donné 50 € -> rendu 27 € (2 billets de 10, 7 pièces de 1)',
            category: 'normal',
            stdin: '23\n50',
            expectedStdout: '2 7',
            explanation: '50 - 23 = 27 ; 27 DIV 10 = 2 et 27 MOD 10 = 7.',
          },
          {
            id: 'tc2',
            label: 'Compte exact : Prix 15 €, donné 15 €',
            category: 'limite',
            stdin: '15\n15',
            expectedStdout: '0 0',
            explanation: 'Rendu = 0 -> 0 billet et 0 pièce.',
          },
        ],
        hints: [
          'Commencez par `Lire(prix)` puis `Lire(sommeDonnee)`.',
          'Calculez `rendu <- sommeDonnee - prix`.',
          'Utilisez `DIV 10` pour les billets de 10 et `MOD 10` pour les pièces de 1, puis `Afficher(billets10, pieces1)`.',
        ],
        detailedExplanation:
          'Cet exercice combine la lecture ordonnée de deux entrées, la soustraction et la décomposition euclidienne (`DIV 10` et `MOD 10`).',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE A05 — CONDITIONS SIMPLES ET IMBRIQUÉES
  // ==========================================================================
  {
    id: 'A05',
    trackId: 'algo',
    number: 5,
    title: 'Conditions simples et imbriquées',
    subtitle: 'Prendre des décisions avec Si ... Alors ... Sinon ... FinSi et combiner des tests logiques',
    estimatedMinutes: 50,
    prerequisites: ['A03', 'A04'],
    relatedChapters: ['B06', 'A06'],
    coreConcepts: [
      'Structure conditionnelle Si ... Alors ... FinSi',
      'Alternative complète Si ... Alors ... Sinon ... FinSi',
      'Conditions composées (ET, OU, NON) et intervalles',
      'Conditions imbriquées et SinonSi',
    ],
    successCriteria: [
      'Traduire une règle métier en arbre de décision conditionnel',
      'Écrire correctement un test d’appartenance à un intervalle `[a, b]`',
      'Éviter les tests redondants dans les structures `SinonSi`',
    ],
    lesson: {
      objectives: [
        'Permettre à un algorithme d’adapter son comportement selon la valeur des données.',
        'Maîtriser la structure `Si ... Alors ... Sinon ... FinSi`.',
        'Savoir exprimer un intervalle mathématique $a \\le x \\le b$ sous la forme `(x >= a) ET (x <= b)`.',
      ],
      intuition:
        "Jusqu'ici, nos algorithmes étaient des lignes droites : toutes les instructions étaient exécutées systématiquement. Or, dans la réalité, on doit prendre des décisions : « Si le solde est suffisant, autoriser le paiement, Sinon afficher un refus ». La structure conditionnelle est l'aiguillage du train algorithmique.",
      formalDefinition:
        "Une structure conditionnelle évalue une expression booléenne appelée condition. Si la condition vaut `Vrai`, le bloc d'instructions du `Alors` est exécuté ; si elle vaut `Faux` et qu'une clause `Sinon` est présente, seul le bloc du `Sinon` est exécuté. Les deux branches sont mutuellement exclusives.",
      analogy: {
        title: 'L’aiguillage ferroviaire',
        content:
          "Un train arrive devant un aiguillage : selon la position du levier (la condition `Vrai` ou `Faux`), le train s'engage soit sur la voie de gauche (`Alors`), soit sur la voie de droite (`Sinon`), mais jamais sur les deux en même temps, avant de rejoindre la voie principale après `FinSi`.",
      },
      vocabulary: [
        {
          fr: 'Structure conditionnelle',
          en: 'Conditional statement / Branching',
          definition: 'Instruction permettant d’exécuter un bloc de code uniquement si une condition est vérifiée.',
        },
        {
          fr: 'Branche alternative',
          en: 'Else branch',
          definition: 'Bloc exécuté lorsque la condition du `Si` est fausse.',
        },
        {
          fr: 'Conditions imbriquées',
          en: 'Nested conditions',
          definition: 'Structure `Si` placée à l’intérieur d’une autre structure `Si` ou `Sinon`.',
        },
      ],
      simpleExample: {
        title: 'Déterminer si un étudiant valide son module (note >= 10)',
        description: 'Un test simple à deux issues mutuellement exclusives.',
        language: 'pseudo',
        code: `Algorithme ValidationModule
Variables
    note : Entier
Début
    Lire(note)
    Si note >= 10 Alors
        Afficher("Admis")
    Sinon
        Afficher("Ajourné")
    FinSi
Fin`,
        stdin: '12',
        expectedOutput: 'Admis',
        lineExplanations: [
          {
            lineNumber: 6,
            code: 'Si note >= 10 Alors',
            explanation: 'Teste si la valeur de `note` (12) est supérieure ou égale à 10. C’est Vrai.',
          },
          {
            lineNumber: 7,
            code: 'Afficher("Admis")',
            explanation: 'Exécuté car la condition est vraie. Le bloc `Sinon` est totalement ignoré.',
          },
        ],
      },
      intermediateExample: {
        title: 'État physique de l’eau selon la température (Conditions en cascade)',
        description:
          'Lorsque plus de deux cas se présentent ($T \\le 0$, $0 < T < 100$, $T \\ge 100$), on enchaîne `Si ... SinonSi ... Sinon ... FinSi`.',
        language: 'pseudo',
        code: `Algorithme EtatEau
Variables
    temp : Entier
Début
    Lire(temp)
    Si temp <= 0 Alors
        Afficher("Solide")
    SinonSi temp < 100 Alors
        Afficher("Liquide")
    Sinon
        Afficher("Gazeux")
    FinSi
Fin`,
        stdin: '25',
        expectedOutput: 'Liquide',
        lineExplanations: [
          {
            lineNumber: 6,
            code: 'Si temp <= 0 Alors',
            explanation: '25 <= 0 est Faux : on passe au SinonSi.',
          },
          {
            lineNumber: 8,
            code: 'SinonSi temp < 100 Alors',
            explanation:
              'Comme on vient du premier test qui était Faux, on sait DÉJÀ que temp > 0. Il suffit donc de tester `temp < 100` (25 < 100 est Vrai).',
          },
        ],
      },
      commonMistakes: [
        {
          title: 'Écrire un double encadrement mathématique `0 <= note <= 20`',
          wrongCode: `Si 0 <= note <= 20 Alors`,
          rightCode: `Si (note >= 0) ET (note <= 20) Alors`,
          explanation:
            'En informatique (et particulièrement en C !), on ne peut pas chaîner deux opérateurs `<` ainsi. Il faut décomposer en deux comparaisons reliées par `ET`.',
          errorType: 'logique',
        },
        {
          title: 'Mettre une condition après le mot-clé Sinon',
          wrongCode: `Si x > 0 Alors
    Afficher("Positif")
Sinon x <= 0
    Afficher("Négatif ou nul")
FinSi`,
          rightCode: `Si x > 0 Alors
    Afficher("Positif")
Sinon
    Afficher("Négatif ou nul")
FinSi`,
          explanation:
            '`Sinon` signifie « dans tous les autres cas restants » : il ne prend jamais de condition. Si vous voulez tester une seconde condition, utilisez `SinonSi ... Alors`.',
          errorType: 'syntaxe',
        },
      ],
      summary: [
        'Toute structure `Si ... Alors` doit obligatoirement être fermée par `FinSi`.',
        'Pour tester qu’une variable appartient à $[a, b]$, écrivez `(x >= a) ET (x <= b)`.',
        'Pour tester qu’une variable est en dehors de $[a, b]$, écrivez `(x < a) OU (x > b)`.',
      ],
      comprehensionQuestions: [
        {
          id: 'A05-Q1',
          question:
            'Comment écrire correctement la condition « `x` est compris entre 10 et 20 inclus » ?',
          options: [
            '10 <= x <= 20',
            '(x >= 10) OU (x <= 20)',
            '(x >= 10) ET (x <= 20)',
            'x >= 10, <= 20',
          ],
          correctIndex: 2,
          explanation:
            'Les deux bornes doivent être respectées simultanément : `x >= 10` ET `x <= 20`. Avec `OU`, tout nombre vérifierait l’une des deux inégalités !',
        },
        {
          id: 'A05-Q2',
          question:
            'Dans une structure `Si C1 Alors ... SinonSi C2 Alors ... Sinon ... FinSi`, combien de blocs peuvent être exécutés lors d’un passage ?',
          options: [
            'Exactement un seul bloc',
            'Tous les blocs dont la condition est vraie',
            'Toujours deux blocs',
            'Aucun même s’il y a un Sinon',
          ],
          correctIndex: 0,
          explanation:
            'Dès que la première condition vraie est rencontrée, son bloc est exécuté et l’algorithme saute directement après `FinSi`. Si toutes sont fausses, le bloc `Sinon` est exécuté.',
        },
      ],
    },
    exercises: [
      {
        id: 'A05-EX1',
        chapterId: 'A05',
        trackId: 'algo',
        title: 'Repérer l’erreur logique dans un test d’intervalle',
        difficulty: 'debutant',
        category: 'error_spot',
        testedSkill: 'Distinguer ET et OU dans une validation de borne',
        prerequisites: ['A03'],
        statement:
          'Un étudiant veut vérifier qu’une note est **valide** (comprise entre 0 et 20 inclus). Il écrit : `Si (note >= 0) OU (note <= 20) Alors Afficher("Valide")`. Quel est le problème de cette condition ?',
        options: [
          'Il manque un point-virgule à la fin de la ligne.',
          'Erreur logique : avec OU, même `note = 35` ou `note = -5` sera acceptée comme valide ! Il faut utiliser ET.',
          'Erreur de syntaxe : on ne peut pas comparer une variable à 0.',
          'Aucun problème, cet algorithme fonctionne parfaitement.',
        ],
        correctOptionIndex: 1,
        errorClassificationTarget: 'logique',
        hints: [
          'Testez mentalement la condition `(note >= 0) OU (note <= 20)` avec `note = 50`.',
          'Pour `note = 50`, `note >= 0` est Vrai. Or `Vrai OU Faux` donne `Vrai` !',
          'Pour imposer les deux bornes en même temps, il faut l’opérateur `ET`.',
        ],
        detailedExplanation:
          'Avec `OU`, tout nombre réel est soit $\\ge 0$, soit $\\le 20$. La condition est donc toujours vraie (tautologie) ! Pour un intervalle fermé $[0, 20]$, il faut `(note >= 0) ET (note <= 20)`.',
      },
      {
        id: 'A05-EX2',
        chapterId: 'A05',
        trackId: 'algo',
        title: 'Valeur absolue d’un entier',
        difficulty: 'debutant',
        category: 'pseudocode',
        testedSkill: 'Utiliser Si ... Alors ... Sinon pour calculer une valeur absolue',
        prerequisites: ['A04'],
        statement:
          'Sans utiliser de fonction prédéfinie, écrivez un algorithme qui lit un entier `x`, calcule sa valeur absolue `absX` à l’aide d’une structure `Si ... Alors ... Sinon ... FinSi`, et affiche `absX`.',
        starterCode: `Algorithme ValeurAbsolue
Variables
    x, absX : Entier
Début
    Lire(x)
    // Si x est négatif, absX vaut -x, sinon absX vaut x
    
    Afficher(absX)
Fin`,
        referenceSolution: `Algorithme ValeurAbsolue
Variables
    x, absX : Entier
Début
    Lire(x)
    Si x < 0 Alors
        absX <- -x
    Sinon
        absX <- x
    FinSi
    Afficher(absX)
Fin`,
        testCases: [
          {
            id: 'tc1',
            label: 'Nombre négatif (-18)',
            category: 'normal',
            stdin: '-18',
            expectedStdout: '18',
            mustContainConstructs: ['Si'],
            explanation: '-18 < 0 donc absX reçoit -(-18) = 18.',
          },
          {
            id: 'tc2',
            label: 'Nombre positif (42)',
            category: 'normal',
            stdin: '42',
            expectedStdout: '42',
            explanation: '42 >= 0 donc absX reçoit 42.',
          },
          {
            id: 'tc3',
            label: 'Cas limite (0)',
            category: 'limite',
            stdin: '0',
            expectedStdout: '0',
            explanation: 'La valeur absolue de 0 est 0.',
          },
        ],
        hints: [
          'Testez `Si x < 0 Alors`.',
          'Dans la branche `Alors`, affectez `absX <- -x` (ou `0 - x`).',
          'Dans la branche `Sinon`, affectez `absX <- x`, puis fermez avec `FinSi`.',
        ],
        detailedExplanation:
          'La définition mathématique de $|x|$ se traduit directement : si $x < 0$ alors $-x$, sinon $x$.',
      },
      {
        id: 'A05-EX3',
        chapterId: 'A05',
        trackId: 'algo',
        title: 'Tarification dégressive de photocopies',
        difficulty: 'intermediaire',
        category: 'pseudocode',
        isCoreValidationExercise: true,
        bridgeTargetChapterId: 'B06',
        testedSkill: 'Construire une structure Si / SinonSi / Sinon sur plusieurs tranches',
        prerequisites: ['A04'],
        statement:
          'Un magasin facture les photocopies en centimes selon le nombre `n` de copies :\n- Si `n <= 10` : chaque copie coûte 10 centimes (`prix <- n * 10`).\n- Sinon, si `n <= 30` : les 10 premières coûtent 10 centimes chacune (soit 100 centimes) et chacune des suivantes (`n - 10`) coûte 8 centimes (`prix <- 100 + (n - 10) * 8`).\n- Sinon (`n > 30`) : les 10 premières coûtent 10 centimes (100), les 20 suivantes coûtent 8 centimes (160), et chacune au-delà de 30 (`n - 30`) coûte 5 centimes (`prix <- 260 + (n - 30) * 5`).\nÉcrivez l’algorithme qui lit `n` et affiche `prix`.',
        starterCode: `Algorithme TarifPhotocopies
Variables
    n, prix : Entier
Début
    Lire(n)
    // Écrivez la structure Si ... SinonSi ... Sinon ... FinSi
    
    Afficher(prix)
Fin`,
        referenceSolution: `Algorithme TarifPhotocopies
Variables
    n, prix : Entier
Début
    Lire(n)
    Si n <= 10 Alors
        prix <- n * 10
    SinonSi n <= 30 Alors
        prix <- 100 + (n - 10) * 8
    Sinon
        prix <- 260 + (n - 30) * 5
    FinSi
    Afficher(prix)
Fin`,
        testCases: [
          {
            id: 'tc1',
            label: '1re tranche (n = 7)',
            category: 'normal',
            stdin: '7',
            expectedStdout: '70',
            explanation: '7 <= 10 -> 7 * 10 = 70 centimes.',
          },
          {
            id: 'tc2',
            label: 'Borne 10 copies (n = 10)',
            category: 'limite',
            stdin: '10',
            expectedStdout: '100',
            explanation: '10 * 10 = 100 centimes.',
          },
          {
            id: 'tc3',
            label: '2e tranche (n = 20)',
            category: 'normal',
            stdin: '20',
            expectedStdout: '180',
            explanation: '100 + (20 - 10) * 8 = 180 centimes.',
          },
          {
            id: 'tc4',
            label: '3e tranche (n = 40)',
            category: 'normal',
            stdin: '40',
            expectedStdout: '310',
            explanation: '260 + (40 - 30) * 5 = 310 centimes.',
          },
        ],
        hints: [
          'Commencez par `Si n <= 10 Alors prix <- n * 10`.',
          'Ajoutez `SinonSi n <= 30 Alors prix <- 100 + (n - 10) * 8`.',
          'Terminez par `Sinon prix <- 260 + (n - 30) * 5` puis `FinSi`.',
        ],
        detailedExplanation:
          'Les conditions par tranches tirent parti de l’exclusion mutuelle de `Si / SinonSi / Sinon` : lorsqu’on arrive dans `SinonSi n <= 30`, on sait déjà que `n > 10`.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE A06 — CHOIX MULTIPLES (SELON / CAS)
  // ==========================================================================
  {
    id: 'A06',
    trackId: 'algo',
    number: 6,
    title: 'Choix multiples (Selon / Cas)',
    subtitle: 'Structurer proprement les aiguillages sur valeurs discrètes et les menus',
    estimatedMinutes: 35,
    prerequisites: ['A05'],
    relatedChapters: ['B06'],
    coreConcepts: [
      'Structure Selon <expression> Faire ... Cas ... Autrement ... FinSelon',
      'Regroupement de plusieurs valeurs dans un même Cas',
      'Quand préférer Selon à Si/SinonSi',
    ],
    successCriteria: [
      'Utiliser Selon pour traiter les choix d’un menu ou des codes discrets',
      'Prévoir systématiquement le cas par défaut (Autrement) pour les entrées invalides',
    ],
    lesson: {
      objectives: [
        'Remplacer une longue cascade de `Si x = 1 ... SinonSi x = 2 ...` par une structure `Selon` lisible.',
        'Savoir regrouper plusieurs valeurs déclenchant le même traitement.',
        'Utiliser la clause `Autrement` pour gérer les valeurs inattendues.',
      ],
      intuition:
        "Lorsqu'on teste si une même variable entière ou caractère est égale à 1, 2, 3 ou 4 (comme dans un menu de distributeur automatique), répéter `Si choix = 1 ... SinonSi choix = 2 ...` alourdit le code. La structure `Selon` (qui deviendra `switch` en C) exprime directement une table de correspondance claire.",
      formalDefinition:
        "La structure à choix multiples `Selon E` évalue une unique fois l'expression discrète `E`, puis compare sa valeur aux constantes listées dans chaque clause `Cas`. Le bloc correspondant au premier cas égal est exécuté ; si aucun cas ne correspond, le bloc `Autrement` (s'il existe) est exécuté.",
      analogy: {
        title: 'Les boutons d’un ascenseur',
        content:
          "Dans un ascenseur, vous appuyez sur un numéro d'étage discret (0, 1, 2, 3). L'ascenseur va directement à l'étage correspondant au bouton pressé. La clause `Autrement` est le message d'erreur si un code d'étage inconnu est demandé.",
      },
      vocabulary: [
        {
          fr: 'Choix multiple',
          en: 'Switch / Multi-way branch',
          definition: 'Aiguillage sélectionnant un bloc parmi plusieurs selon la valeur discrète d’une expression.',
        },
        {
          fr: 'Cas par défaut',
          en: 'Default case',
          definition: 'Branche `Autrement` exécutée lorsqu’aucune valeur de `Cas` ne correspond.',
        },
      ],
      simpleExample: {
        title: 'Nom du jour de la semaine (1 à 3)',
        description: 'Associer un numéro à un libellé avec gestion des numéros hors plage.',
        language: 'pseudo',
        code: `Algorithme JourSemaine
Variables
    jour : Entier
Début
    Lire(jour)
    Selon jour Faire
        Cas 1 :
            Afficher("Lundi")
        Cas 2 :
            Afficher("Mardi")
        Cas 3 :
            Afficher("Mercredi")
        Autrement :
            Afficher("Jour invalide")
    FinSelon
Fin`,
        stdin: '2',
        expectedOutput: 'Mardi',
        lineExplanations: [
          {
            lineNumber: 6,
            code: 'Selon jour Faire',
            explanation: 'Évalue la variable `jour` (ici 2).',
          },
          {
            lineNumber: 9,
            code: 'Cas 2 : Afficher("Mardi")',
            explanation: 'Comme `jour` vaut 2, seul ce cas est exécuté.',
          },
          {
            lineNumber: 13,
            code: 'Autrement :',
            explanation: 'Exécuté si l’utilisateur saisit par exemple 9 ou -1.',
          },
        ],
      },
      intermediateExample: {
        title: 'Nombre de jours dans un mois (Regroupement de cas)',
        description:
          'Plusieurs mois ont 31 jours ou 30 jours : on peut les regrouper sur une même ligne `Cas` séparés par des virgules.',
        language: 'pseudo',
        code: `Algorithme JoursDansMois
Variables
    mois : Entier
Début
    Lire(mois)
    Selon mois Faire
        Cas 1, 3, 5, 7, 8, 10, 12 :
            Afficher(31)
        Cas 4, 6, 9, 11 :
            Afficher(30)
        Cas 2 :
            Afficher(28)
        Autrement :
            Afficher(-1)
    FinSelon
Fin`,
        stdin: '4',
        expectedOutput: '30',
        lineExplanations: [
          {
            lineNumber: 7,
            code: 'Cas 1, 3, 5, 7, 8, 10, 12 :',
            explanation: 'Tous les mois de 31 jours sont traités en un seul cas.',
          },
          {
            lineNumber: 9,
            code: 'Cas 4, 6, 9, 11 :',
            explanation: 'Le mois 4 (avril) correspond à ce groupe et affiche 30.',
          },
        ],
      },
      commonMistakes: [
        {
          title: 'Vouloir utiliser Selon pour des intervalles de nombres réels',
          wrongCode: `Selon temperature Faire
    Cas < 0 : Afficher("Gel")`,
          rightCode: `Si temperature < 0 Alors
    Afficher("Gel")`,
          explanation:
            '`Selon` (tout comme `switch` en C) compare uniquement des valeurs constantes discrètes (1, 2, 3, \'A\'...). Pour des inégalités (`<`, `>=`) ou des nombres réels, utilisez `Si / SinonSi`.',
          errorType: 'syntaxe',
        },
      ],
      summary: [
        '`Selon` est idéal pour tester l’égalité d’une variable entière ou caractère contre une liste de valeurs connues.',
        'Ajoutez toujours une branche `Autrement` pour traiter proprement les saisies imprévues.',
      ],
      comprehensionQuestions: [
        {
          id: 'A06-Q1',
          question: 'Dans quel cas la structure `Selon` est-elle préférable à `Si / SinonSi` ?',
          options: [
            'Pour tester si un nombre réel est compris entre 0.5 et 1.75',
            'Pour tester la valeur d’un code d’opération entier (1, 2, 3, 4) choisi dans un menu',
            'Pour combiner trois variables différentes avec ET et OU',
            'Pour répéter une instruction 10 fois',
          ],
          correctIndex: 1,
          explanation:
            '`Selon` est conçu pour aiguiller l’exécution à partir d’une valeur discrète (entier ou caractère) parmi une liste de constantes.',
        },
      ],
    },
    exercises: [
      {
        id: 'A06-EX1',
        chapterId: 'A06',
        trackId: 'algo',
        title: 'Choisir entre Si et Selon',
        difficulty: 'debutant',
        category: 'qcm',
        testedSkill: 'Identifier le domaine d’application de Selon vs Si',
        prerequisites: ['A05'],
        statement:
          'Parmi les problèmes suivants, lequel NE PEUT PAS être écrit directement avec un `Selon` standard (et nécessite un `Si / SinonSi`) ?',
        options: [
          'Afficher le nom d’une saison à partir de son code entier (1, 2, 3 ou 4).',
          'Tester si une vitesse réelle `v` est supérieure à 130.0 km/h.',
          'Exécuter une action selon la touche pressée (1, 2 ou 0).',
          'Afficher le tarif correspondant à une zone tarifaire numérotée de 1 à 5.',
        ],
        correctOptionIndex: 1,
        hints: [
          '`Selon` teste l’égalité avec des constantes discrètes.',
          'Une inégalité sur un nombre réel (`v > 130.0`) comporte une infinité de valeurs.',
          'Il faut donc obligatoirement utiliser `Si v > 130.0 Alors` pour la vitesse.',
        ],
        detailedExplanation:
          'Une comparaison d’inégalité sur un réel (`v > 130.0`) ne peut pas s’écrire sous forme de cas discrets : elle relève de `Si ... Alors`.',
      },
      {
        id: 'A06-EX2',
        chapterId: 'A06',
        trackId: 'algo',
        title: 'Calculatrice par code d’opération',
        difficulty: 'intermediaire',
        category: 'pseudocode',
        isCoreValidationExercise: true,
        bridgeTargetChapterId: 'B06',
        testedSkill: 'Utiliser Selon ... Cas ... Autrement pour implémenter un menu de calcul',
        prerequisites: ['A05'],
        statement:
          'Écrivez un algorithme qui lit deux entiers `a` et `b`, puis un code d’opération entier `op` :\n- `Cas 1` : affiche `a + b`\n- `Cas 2` : affiche `a - b`\n- `Cas 3` : affiche `a * b`\n- `Autrement` : affiche `-999` (code d’erreur).',
        starterCode: `Algorithme MiniCalculatrice
Variables
    a, b, op : Entier
Début
    Lire(a)
    Lire(b)
    Lire(op)
    // Utilisez Selon op Faire ... FinSelon
    
Fin`,
        referenceSolution: `Algorithme MiniCalculatrice
Variables
    a, b, op : Entier
Début
    Lire(a)
    Lire(b)
    Lire(op)
    Selon op Faire
        Cas 1 :
            Afficher(a + b)
        Cas 2 :
            Afficher(a - b)
        Cas 3 :
            Afficher(a * b)
        Autrement :
            Afficher(-999)
    FinSelon
Fin`,
        testCases: [
          {
            id: 'tc1',
            label: 'Addition (op = 1)',
            category: 'normal',
            stdin: '12\n8\n1',
            expectedStdout: '20',
            mustContainConstructs: ['Selon'],
            explanation: 'op = 1 -> 12 + 8 = 20.',
          },
          {
            id: 'tc2',
            label: 'Soustraction (op = 2)',
            category: 'normal',
            stdin: '12\n8\n2',
            expectedStdout: '4',
            explanation: 'op = 2 -> 12 - 8 = 4.',
          },
          {
            id: 'tc3',
            label: 'Multiplication (op = 3)',
            category: 'normal',
            stdin: '12\n8\n3',
            expectedStdout: '96',
            explanation: 'op = 3 -> 12 * 8 = 96.',
          },
          {
            id: 'tc4',
            label: 'Code opération invalide (op = 9)',
            category: 'invalide',
            stdin: '12\n8\n9',
            expectedStdout: '-999',
            explanation: 'op = 9 -> Cas Autrement affiche -999.',
          },
        ],
        hints: [
          'Ouvrez le bloc avec `Selon op Faire`.',
          'Écrivez `Cas 1 : Afficher(a + b)`, `Cas 2 : Afficher(a - b)`, `Cas 3 : Afficher(a * b)`.',
          'Ajoutez `Autrement : Afficher(-999)` et fermez avec `FinSelon`.',
        ],
        detailedExplanation:
          'La structure `Selon op Faire` oriente proprement vers l’opération demandée et intercepte tout code invalide grâce à `Autrement`.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE A07 — BOUCLES ET STRUCTURES RÉPÉTITIVES
  // ==========================================================================
  {
    id: 'A07',
    trackId: 'algo',
    number: 7,
    title: 'Boucles et structures répétitives',
    subtitle: 'Répéter des traitements avec Pour, TantQue et Répéter sans créer de boucle infinie',
    estimatedMinutes: 60,
    prerequisites: ['A05'],
    relatedChapters: ['B07', 'A14'],
    coreConcepts: [
      'Boucle à compteur déterminé : Pour i de début à fin Faire ... FinPour',
      'Boucle à condition préalable : TantQue <condition> Faire ... FinTantQue',
      'Boucle à condition finale : Répéter ... Jusqu’à <condition>',
      'Accumulateurs, compteurs et prévention des boucles infinies',
    ],
    successCriteria: [
      'Savoir choisir entre Pour et TantQue selon que le nombre d’itérations est connu ou non',
      'Utiliser un accumulateur initialisé à 0 (somme) ou 1 (produit)',
      'Garantir la terminaison d’une boucle TantQue',
    ],
    lesson: {
      objectives: [
        'Comprendre les trois structures répétitives : `Pour`, `TantQue` et `Répéter ... Jusqu’à`.',
        'Savoir quand utiliser `Pour` (nombre de tours connu à l’avance) et quand utiliser `TantQue` (nombre de tours inconnu à l’avance).',
        'Maîtriser le schéma d’accumulateur (`somme <- somme + i`) et éviter les boucles infinies.',
      ],
      intuition:
        "Si l'on vous demande d'additionner 1000 nombres, vous n'allez pas écrire 1000 lignes `Lire(x)`. Vous allez écrire une seule fois l'instruction « Lire un nombre et l'ajouter au total » et demander à la machine de la répéter. C'est la puissance des boucles : quelques lignes de code peuvent exécuter des millions d'opérations.",
      formalDefinition:
        "Une structure répétitive (ou boucle) exécute un bloc d'instructions (le corps de la boucle) de manière itérative tant qu'une condition de maintien est vérifiée (ou jusqu'à ce qu'un compteur atteigne sa borne finale). Chaque passage dans le corps de la boucle est appelé une itération.",
      analogy: {
        title: 'Course sur piste d’athlétisme vs Marche jusqu’à la mer',
        content:
          "Courir un 5000 mètres sur piste consiste à faire exactement 12 tours : le nombre de tours est connu au départ, c'est une boucle `Pour tour de 1 à 12 Faire`. En revanche, marcher vers l'ouest jusqu'à apercevoir l'océan dépend du terrain : on ne connaît pas le nombre de pas à l'avance, c'est une boucle `TantQue non_arrive Faire avancer()`.",
      },
      vocabulary: [
        {
          fr: 'Itération',
          en: 'Iteration',
          definition: 'Une exécution complète du corps de la boucle.',
        },
        {
          fr: 'Compteur de boucle',
          en: 'Loop counter / Iterator',
          definition: 'Variable entière (souvent nommée `i`, `j`, `k`) qui progresse à chaque tour d’une boucle `Pour`.',
        },
        {
          fr: 'Accumulateur',
          en: 'Accumulator',
          definition: 'Variable initialisée avant la boucle qui cumule un résultat progressif (somme, produit) à chaque itération.',
        },
        {
          fr: 'Boucle infinie',
          en: 'Infinite loop',
          definition: 'Erreur logique où la condition d’arrêt d’une boucle n’est jamais atteinte.',
        },
      ],
      simpleExample: {
        title: 'Somme des entiers de 1 à n (Boucle Pour + Accumulateur)',
        description:
          'Pour additionner $1 + 2 + \\dots + n$, on initialise `somme <- 0` avant la boucle, puis on ajoute `i` à chaque tour.',
        language: 'pseudo',
        code: `Algorithme SommeUnAN
Variables
    n, i, somme : Entier
Début
    Lire(n)
    somme <- 0
    Pour i de 1 à n Faire
        somme <- somme + i
    FinPour
    Afficher(somme)
Fin`,
        stdin: '5',
        expectedOutput: '15',
        lineExplanations: [
          {
            lineNumber: 6,
            code: 'somme <- 0',
            explanation:
              'TRÈS IMPORTANT : on remet l’accumulateur à 0 AVANT de commencer la boucle (élément neutre de l’addition).',
          },
          {
            lineNumber: 7,
            code: 'Pour i de 1 à n Faire',
            explanation: 'Fait varier `i` automatiquement de 1 jusqu’à `n` (5) par pas de 1.',
          },
          {
            lineNumber: 8,
            code: 'somme <- somme + i',
            explanation: 'Ajoute successivement 1, puis 2, puis 3, puis 4, puis 5 à `somme` (total = 15).',
          },
        ],
      },
      intermediateExample: {
        title: 'Compter le nombre de divisions par 2 (Boucle TantQue)',
        description:
          'On ne sait pas à l’avance combien de fois un entier `n` peut être divisé par 2 avant d’atteindre 1 : on utilise donc `TantQue`.',
        language: 'pseudo',
        code: `Algorithme ÉtapesDivisionParDeux
Variables
    n, etapes : Entier
Début
    Lire(n)
    etapes <- 0
    TantQue n > 1 Faire
        n <- n DIV 2
        etapes <- etapes + 1
    FinTantQue
    Afficher(etapes)
Fin`,
        stdin: '16',
        expectedOutput: '4',
        lineExplanations: [
          {
            lineNumber: 7,
            code: 'TantQue n > 1 Faire',
            explanation: 'Vérifie la condition AVANT chaque tour. Si `n` vaut déjà 1 au départ, la boucle fait 0 tour.',
          },
          {
            lineNumber: 8,
            code: 'n <- n DIV 2',
            explanation: 'Modifie `n` (16 -> 8 -> 4 -> 2 -> 1), ce qui garantit que `n > 1` finira par devenir Faux.',
          },
        ],
      },
      commonMistakes: [
        {
          title: 'Initialiser l’accumulateur À L’INTÉRIEUR de la boucle',
          wrongCode: `Pour i de 1 à n Faire
    somme <- 0
    somme <- somme + i
FinPour`,
          rightCode: `somme <- 0
Pour i de 1 à n Faire
    somme <- somme + i
FinPour`,
          explanation:
            'Si `somme <- 0` est placé dans la boucle, la somme est effacée et remise à zéro à chaque tour ! À la fin, `somme` ne contiendra que le dernier `i`.',
          errorType: 'logique',
        },
        {
          title: 'Oublier de faire évoluer la variable de condition dans un TantQue (Boucle infinie)',
          wrongCode: `i <- 1
TantQue i <= 5 Faire
    Afficher(i)
FinTantQue`,
          rightCode: `i <- 1
TantQue i <= 5 Faire
    Afficher(i)
    i <- i + 1
FinTantQue`,
          explanation:
            'Contrairement à `Pour`, la boucle `TantQue` n’incrémente aucune variable toute seule. Sans `i <- i + 1`, `i` reste égal à 1 éternellement !',
          errorType: 'execution',
        },
      ],
      summary: [
        'Utilisez `Pour` lorsque le nombre d’itérations est connu avant d’entrer dans la boucle.',
        'Utilisez `TantQue` lorsque l’arrêt dépend d’un événement ou d’une convergence dont on ignore la durée (0 tour possible si la condition est fausse d’emblée).',
        'Dans un `TantQue`, vérifiez toujours : 1) Initialisation avant la boucle, 2) Condition de maintien, 3) Progression vers l’arrêt dans le corps de la boucle.',
      ],
      comprehensionQuestions: [
        {
          id: 'A07-Q1',
          question:
            'Combien de fois le corps de la boucle `TantQue x < 0 Faire ... FinTantQue` est-il exécuté si `x` vaut `10` avant la boucle ?',
          options: [
            '1 fois',
            '0 fois (le corps n’est jamais exécuté)',
            '10 fois',
            'Une infinité de fois',
          ],
          correctIndex: 1,
          explanation:
            '`TantQue` teste sa condition AVANT d’entrer dans la boucle. Comme `10 < 0` est Faux dès le départ, la boucle est sautée (0 itération).',
        },
        {
          id: 'A07-Q2',
          question:
            'À quelle valeur faut-il initialiser une variable `produit` avant une boucle qui multiplie des nombres entre eux (par exemple pour calculer $n! = 1 \\times 2 \\times \\dots \\times n$) ?',
          options: [
            '0',
            '1 (l’élément neutre de la multiplication)',
            'n',
            '-1',
          ],
          correctIndex: 1,
          explanation:
            'Si vous initialisez un produit à 0, toutes les multiplications successives donneront toujours 0 ! Un produit s’initialise toujours à 1.',
        },
      ],
    },
    exercises: [
      {
        id: 'A07-EX1',
        chapterId: 'A07',
        trackId: 'algo',
        title: 'Table de trace d’une boucle TantQue',
        difficulty: 'debutant',
        category: 'trace',
        testedSkill: 'Suivre l’évolution des variables d’une boucle TantQue tour par tour',
        prerequisites: ['A05'],
        statement:
          'Complétez la table de trace de l’algorithme suivant en remplaçant les `?` par les valeurs exactes des variables `x` et `cpt` à la fin de chaque itération.',
        traceSpec: {
          language: 'pseudo',
          code: `x <- 1
cpt <- 0
TantQue x < 8 Faire
    x <- x * 2
    cpt <- cpt + 1
FinTantQue`,
          columns: ['Étape', 'Condition (x < 8)', 'x', 'cpt'],
          prefilledRows: [
            { Étape: 'Initialisation', 'Condition (x < 8)': '-', x: '1', cpt: '0' },
            { Étape: 'Fin tour 1', 'Condition (x < 8)': 'Vrai (1 < 8)', x: '2', cpt: '1' },
            { Étape: 'Fin tour 2', 'Condition (x < 8)': 'Vrai (2 < 8)', x: '?', cpt: '2' },
            { Étape: 'Fin tour 3', 'Condition (x < 8)': 'Vrai (4 < 8)', x: '8', cpt: '?' },
            { Étape: 'Sortie', 'Condition (x < 8)': 'Faux (8 < 8)', x: '?', cpt: '3' },
          ],
          expectedAnswers: {
            '2:x': '4',
            '3:cpt': '3',
            '4:x': '8',
          },
        },
        hints: [
          'Au tour 2, `x` valait 2 et subit `x <- x * 2`, donc `x` devient 4.',
          'Au tour 3, `cpt` valait 2 et subit `cpt <- cpt + 1`, donc `cpt` devient 3.',
          'À la sortie, la condition `8 < 8` est Fausse : `x` conserve sa valeur 8.',
        ],
        detailedExplanation:
          '`x` double à chaque itération (1 → 2 → 4 → 8) tandis que `cpt` compte le nombre de doublements (0 → 1 → 2 → 3). Dès que `x` atteint 8, `x < 8` devient Faux et la boucle s’arrête.',
      },
      {
        id: 'A07-EX2',
        chapterId: 'A07',
        trackId: 'algo',
        title: 'Calcul de la factorielle n!',
        difficulty: 'intermediaire',
        category: 'pseudocode',
        isCoreValidationExercise: true,
        bridgeTargetChapterId: 'B07',
        testedSkill: 'Utiliser une boucle Pour et un accumulateur multiplicatif initialisé à 1',
        prerequisites: ['A05'],
        statement:
          'Écrivez un algorithme qui lit un entier `n` ($n \\ge 0$) et calcule sa factorielle $n! = 1 \\times 2 \\times \\dots \\times n$ (avec par convention $0! = 1$) dans une variable `fact`, puis affiche `fact`.',
        starterCode: `Algorithme CalculFactorielle
Variables
    n, i, fact : Entier
Début
    Lire(n)
    // Initialisez fact puis utilisez une boucle Pour i de 1 à n
    
    Afficher(fact)
Fin`,
        referenceSolution: `Algorithme CalculFactorielle
Variables
    n, i, fact : Entier
Début
    Lire(n)
    fact <- 1
    Pour i de 1 à n Faire
        fact <- fact * i
    FinPour
    Afficher(fact)
Fin`,
        testCases: [
          {
            id: 'tc1',
            label: 'n = 5 (5! = 120)',
            category: 'normal',
            stdin: '5',
            expectedStdout: '120',
            explanation: '1 * 2 * 3 * 4 * 5 = 120.',
          },
          {
            id: 'tc2',
            label: 'Cas limite n = 0 (0! = 1)',
            category: 'limite',
            stdin: '0',
            expectedStdout: '1',
            explanation: 'Si n = 0, la boucle Pour de 1 à 0 ne fait aucun tour et fact reste égal à 1.',
          },
          {
            id: 'tc3',
            label: 'n = 1 (1! = 1)',
            category: 'limite',
            stdin: '1',
            expectedStdout: '1',
            explanation: '1! = 1.',
          },
        ],
        hints: [
          'Initialisez `fact <- 1` avant la boucle (ainsi, même si `n = 0`, `fact` vaudra 1).',
          'Écrivez `Pour i de 1 à n Faire`.',
          'Dans la boucle, multipliez : `fact <- fact * i`, puis fermez avec `FinPour`.',
        ],
        detailedExplanation:
          'En initialisant `fact <- 1` avant `Pour i de 1 à n Faire`, le cas limite $n = 0$ est géré naturellement (0 tour de boucle, résultat 1) et pour $n \\ge 1$, `fact` accumule les produits successifs.',
      },
      {
        id: 'A07-EX3',
        chapterId: 'A07',
        trackId: 'algo',
        title: 'Somme des chiffres d’un entier de taille quelconque (Boucle TantQue)',
        difficulty: 'avance',
        category: 'pseudocode',
        testedSkill: 'Utiliser une boucle TantQue avec DIV 10 et MOD 10',
        prerequisites: ['A03', 'A05'],
        statement:
          'Au chapitre A03, nous avons additionné les chiffres d’un nombre à 2 chiffres. Maintenant, écrivez un algorithme capable de calculer la somme des chiffres de **n’importe quel entier positif `n`** (qu’il ait 1, 3 ou 8 chiffres) à l’aide d’une boucle `TantQue n > 0 Faire`.',
        starterCode: `Algorithme SommeChiffresGenerale
Variables
    n, somme : Entier
Début
    Lire(n)
    somme <- 0
    // Tant que n > 0, ajoutez le chiffre des unités (n MOD 10) à somme
    // puis supprimez le chiffre des unités de n (n <- n DIV 10)
    
    Afficher(somme)
Fin`,
        referenceSolution: `Algorithme SommeChiffresGenerale
Variables
    n, somme : Entier
Début
    Lire(n)
    somme <- 0
    TantQue n > 0 Faire
        somme <- somme + (n MOD 10)
        n <- n DIV 10
    FinTantQue
    Afficher(somme)
Fin`,
        testCases: [
          {
            id: 'tc1',
            label: 'n = 4825 (4 + 8 + 2 + 5 = 19)',
            category: 'normal',
            stdin: '4825',
            expectedStdout: '19',
            mustContainConstructs: ['TantQue'],
            explanation: '5 + 2 + 8 + 4 = 19.',
          },
          {
            id: 'tc2',
            label: 'Cas limite n = 0',
            category: 'limite',
            stdin: '0',
            expectedStdout: '0',
            explanation: 'Pour n = 0, la somme est 0.',
          },
          {
            id: 'tc3',
            label: 'Nombre à un seul chiffre (n = 7)',
            category: 'limite',
            stdin: '7',
            expectedStdout: '7',
            explanation: 'La somme est 7.',
          },
        ],
        hints: [
          'À chaque tour de `TantQue n > 0 Faire`, le dernier chiffre de `n` vaut `n MOD 10`.',
          'Ajoutez-le à `somme` : `somme <- somme + (n MOD 10)`.',
          'Puis décalez `n` d’un chiffre vers la droite avec `n <- n DIV 10`.',
        ],
        detailedExplanation:
          'À chaque itération, `n MOD 10` extrait le chiffre de droite et `n <- n DIV 10` l’élimine. Le nombre de chiffres diminue de 1 à chaque tour jusqu’à ce que `n` atteigne 0.',
      },
    ],
  },

  // ==========================================================================
  // CHAPITRE A08 — FONCTIONS ET PROCÉDURES
  // ==========================================================================
  {
    id: 'A08',
    trackId: 'algo',
    number: 8,
    title: 'Fonctions et procédures (Modularité)',
    subtitle: 'Découper un problème complexe en sous-programmes réutilisables et lisibles',
    estimatedMinutes: 45,
    prerequisites: ['A07'],
    relatedChapters: ['A09', 'B08'],
    coreConcepts: [
      'Principe de décomposition modulaire et non-répétition (DRY)',
      'Différence entre Fonction (retourne une valeur) et Procédure (action sans valeur de retour)',
      'Instruction Retourner et arrêt immédiat de la fonction',
      'Appel d’une fonction dans une expression',
    ],
    successCriteria: [
      'Distinguer clairement `Retourner resultat` et `Afficher(resultat)`',
      'Écrire une fonction et l’appeler depuis l’algorithme principal',
    ],
    lesson: {
      objectives: [
        'Comprendre pourquoi on découpe un grand algorithme en sous-programmes indépendants.',
        'Distinguer une **Fonction** (qui calcule et renvoie une valeur avec `Retourner`) d’une **Procédure** (qui exécute une action sans renvoyer de valeur).',
        'Ne jamais confondre `Retourner` (transmettre une valeur au programme appelant) et `Afficher` (écrire du texte à l’écran).',
      ],
      intuition:
        "Lorsque vous utilisez la touche $\\sqrt{x}$ de votre calculatrice, vous n'avez pas besoin de réécrire l'algorithme de calcul d'une racine carrée : vous lui donnez un nombre (l'argument) et elle vous renvoie le résultat. Une fonction vous permet de créer vos propres « briques » logiques réutilisables.",
      formalDefinition:
        "Un sous-programme est un bloc d'instructions nommé et paramétré. Une **fonction** renvoie une valeur typée à l'instruction qui l'a appelée via le mot-clé `Retourner <expression>` et s'utilise à l'intérieur d'une expression (ex: `y <- carre(5) + 1`). Une **procédure** ne renvoie aucune valeur et s'appelle comme une instruction autonome.",
      analogy: {
        title: 'Le sous-traitant spécialisé vs Le coursier d’affichage',
        content:
          "Une fonction `calculerTVA(prix)` est comme un comptable à qui vous passez un montant sur un papier : il vous rend un papier avec le résultat, que vous pouvez ensuite additionner à d'autres montants. Si le comptable criait le résultat par la fenêtre (`Afficher`) au lieu de vous le rendre (`Retourner`), vous ne pourriez pas poursuivre vos calculs avec !",
      },
      vocabulary: [
        {
          fr: 'Fonction',
          en: 'Function',
          definition: 'Sous-programme qui calcule et renvoie une valeur via `Retourner`.',
        },
        {
          fr: 'Procédure',
          en: 'Procedure / Void function',
          definition: 'Sous-programme qui réalise un traitement sans renvoyer de valeur (en C : fonction de type `void`).',
        },
        {
          fr: 'Valeur de retour',
          en: 'Return value',
          definition: 'Résultat transmis par la fonction à l’endroit où elle a été appelée.',
        },
        {
          fr: 'Appelant / Appelé',
          en: 'Caller / Callee',
          definition: 'L’algorithme qui lance l’appel est l’appelant ; la fonction exécutée est l’appelé.',
        },
      ],
      simpleExample: {
        title: 'Fonction calculant le carré d’un entier',
        description:
          'La fonction `carre(x)` renvoie `x * x`. L’algorithme principal peut l’appeler plusieurs fois.',
        language: 'pseudo',
        code: `Fonction carre(x : Entier) : Entier
Début
    Retourner x * x
FinFonction

Algorithme TestCarre
Variables
    n, res : Entier
Début
    Lire(n)
    res <- carre(n) + carre(3)
    Afficher(res)
Fin`,
        stdin: '4',
        expectedOutput: '25',
        lineExplanations: [
          {
            lineNumber: 1,
            code: 'Fonction carre(x : Entier) : Entier',
            explanation: 'Déclare une fonction nommée `carre` qui reçoit un entier `x` et renvoie un `Entier`.',
          },
          {
            lineNumber: 3,
            code: 'Retourner x * x',
            explanation: 'Renvoie le résultat du produit `x * x` au programme appelant.',
          },
          {
            lineNumber: 11,
            code: 'res <- carre(n) + carre(3)',
            explanation: 'Appelle deux fois `carre` : `carre(4)` vaut 16, `carre(3)` vaut 9, donc `res` reçoit 25.',
          },
        ],
      },
      intermediateExample: {
        title: 'Fonction maximum de deux nombres réutilisée pour trois nombres',
        description:
          'Une fois `max2(a, b)` écrite, trouver le maximum de 3 nombres `a, b, c` se résume à `max2(max2(a, b), c)` !',
        language: 'pseudo',
        code: `Fonction max2(a : Entier, b : Entier) : Entier
Début
    Si a > b Alors
        Retourner a
    Sinon
        Retourner b
    FinSi
FinFonction

Algorithme MaxTroisNombres
Variables
    x, y, z, grand : Entier
Début
    Lire(x)
    Lire(y)
    Lire(z)
    grand <- max2(max2(x, y), z)
    Afficher(grand)
Fin`,
        stdin: '14\n29\n18',
        expectedOutput: '29',
        lineExplanations: [
          {
            lineNumber: 17,
            code: 'grand <- max2(max2(x, y), z)',
            explanation: '`max2(14, 29)` renvoie 29, puis `max2(29, 18)` renvoie 29.',
          },
        ],
      },
      commonMistakes: [
        {
          title: 'Confondre Afficher et Retourner dans une fonction',
          wrongCode: `Fonction doubleVal(x : Entier) : Entier
Début
    Afficher(x * 2)
FinFonction`,
          rightCode: `Fonction doubleVal(x : Entier) : Entier
Début
    Retourner x * 2
FinFonction`,
          explanation:
            'Si une fonction fait `Afficher` au lieu de `Retourner`, elle ne renvoie rien à l’expression appelante (`res <- doubleVal(5) + 1` échouera ou vaudra `0 + 1`).',
          errorType: 'logique',
        },
      ],
      summary: [
        'Une fonction encapsule un calcul précis et renvoie son résultat avec `Retourner`.',
        'Dès que l’instruction `Retourner` est exécutée, la fonction s’arrête immédiatement et rend la main à l’appelant.',
        'Une bonne fonction fait une seule chose bien définie et peut être réutilisée à volonté.',
      ],
      comprehensionQuestions: [
        {
          id: 'A08-Q1',
          question:
            'Que se passe-t-il pour les instructions placées juste APRÈS un `Retourner resultat` dans le même bloc d’une fonction ?',
          options: [
            'Elles sont exécutées normalement.',
            'Elles ne sont jamais exécutées (code mort), car `Retourner` quitte immédiatement la fonction.',
            'Elles sont exécutées avant `Retourner`.',
            'Elles s’exécutent à la fin du programme principal.',
          ],
          correctIndex: 1,
          explanation:
            '`Retourner` provoque la sortie immédiate de la fonction et le renvoi de la valeur à l’appelant.',
        },
        {
          id: 'A08-Q2',
          question: 'Quelle est la différence entre une fonction et une procédure ?',
          options: [
            'Une fonction ne peut pas avoir de paramètres.',
            'Une fonction renvoie une valeur utilisable dans une expression, tandis qu’une procédure n’en renvoie pas.',
            'Une procédure ne peut contenir aucune boucle.',
            'Il n’y a aucune différence.',
          ],
          correctIndex: 1,
          explanation:
            'La fonction produit une valeur de retour (`Retourner v`), contrairement à la procédure (qui correspond au type de retour `void` en langage C).',
        },
      ],
    },
    exercises: [
      {
        id: 'A08-EX1',
        chapterId: 'A08',
        trackId: 'algo',
        title: 'Distinguer Retourner et Afficher',
        difficulty: 'debutant',
        category: 'qcm',
        testedSkill: 'Comprendre le flux de valeur lors d’un appel de fonction',
        prerequisites: ['A07'],
        statement:
          'On souhaite pouvoir écrire dans l’algorithme principal : `total <- prixTTC(100) + fraisPort`. Que doit obligatoirement faire la fonction `prixTTC(ht)` à la fin de son calcul ?',
        options: [
          'Afficher(ht * 1.2)',
          'Retourner ht * 1.2',
          'Lire(ht)',
          'FinAlgorithme',
        ],
        correctOptionIndex: 1,
        hints: [
          'L’appel `prixTTC(100)` se trouve au milieu d’une addition `+ fraisPort`.',
          'Pour que l’addition puisse se faire, l’appel doit être remplacé par une valeur numérique.',
          'Seule l’instruction `Retourner` transmet cette valeur à l’expression appelante.',
        ],
        detailedExplanation:
          'Pour utiliser le résultat d’une fonction dans un calcul (`prixTTC(100) + fraisPort`), la fonction doit renvoyer la valeur via `Retourner`.',
      },
      {
        id: 'A08-EX2',
        chapterId: 'A08',
        trackId: 'algo',
        title: 'Écrire une fonction estPair(n) et l’utiliser',
        difficulty: 'intermediaire',
        category: 'pseudocode',
        isCoreValidationExercise: true,
        bridgeTargetChapterId: 'B08',
        testedSkill: 'Définir une fonction avec paramètre et valeur de retour puis l’appeler',
        prerequisites: ['A07'],
        statement:
          'Écrivez une fonction `estPair(n : Entier)` qui retourne `1` si `n` est pair (`n MOD 2 = 0`) et `0` sinon. Dans l’algorithme principal, lisez un entier `x` et affichez le résultat de `estPair(x)`.',
        starterCode: `Fonction estPair(n : Entier) : Entier
Début
    // Retournez 1 si n est pair, 0 sinon
    
FinFonction

Algorithme TestParite
Variables
    x, res : Entier
Début
    Lire(x)
    res <- estPair(x)
    Afficher(res)
Fin`,
        referenceSolution: `Fonction estPair(n : Entier) : Entier
Début
    Si n MOD 2 = 0 Alors
        Retourner 1
    Sinon
        Retourner 0
    FinSi
FinFonction

Algorithme TestParite
Variables
    x, res : Entier
Début
    Lire(x)
    res <- estPair(x)
    Afficher(res)
Fin`,
        testCases: [
          {
            id: 'tc1',
            label: 'Nombre pair (x = 14)',
            category: 'normal',
            stdin: '14',
            expectedStdout: '1',
            mustContainConstructs: ['Retourner'],
            explanation: '14 est pair, estPair(14) retourne 1.',
          },
          {
            id: 'tc2',
            label: 'Nombre impair (x = 9)',
            category: 'normal',
            stdin: '9',
            expectedStdout: '0',
            explanation: '9 est impair, estPair(9) retourne 0.',
          },
          {
            id: 'tc3',
            label: 'Cas limite (x = 0)',
            category: 'limite',
            stdin: '0',
            expectedStdout: '1',
            explanation: '0 est pair (0 MOD 2 = 0), retourne 1.',
          },
        ],
        hints: [
          'Dans `estPair`, testez `Si n MOD 2 = 0 Alors`.',
          'Si c’est vrai, écrivez `Retourner 1`, sinon `Retourner 0`.',
          'N’oubliez pas `FinSi` avant `FinFonction`.',
        ],
        detailedExplanation:
          'La fonction `estPair` isole le test de divisibilité par 2 et renvoie un code entier (1 ou 0) directement exploitable par l’appelant.',
      },
    ],
  },
];
