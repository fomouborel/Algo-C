import { describe, expect, it } from 'vitest';
import { compileAndRunC, runCCodeTestSuite } from '../c99Engine';
import { compileAndRunPseudoCode } from '../algoEngine';
import {
  createInitialProgressState,
  exportProgressToJson,
  validateAndImportProgressJson,
} from '../../services/storageService';

describe('C99Engine — Real C99 Compiler & Linear Memory VM', () => {
  it('compiles and runs a basic Hello World program', () => {
    const res = compileAndRunC(`
      #include <stdio.h>
      int main(void) {
        printf("Bonjour Ingenieur!\\n");
        return 0;
      }
    `);
    expect(res.compileSuccess).toBe(true);
    expect(res.executionSuccess).toBe(true);
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toBe('Bonjour Ingenieur!\n');
  });

  it('handles integer vs floating-point division and explicit casts accurately', () => {
    const res = compileAndRunC(`
      #include <stdio.h>
      int main(void) {
        int a = 5, b = 2;
        int divEntiere = a / b;
        double divCast = (double)a / b;
        printf("%d | %.2f\\n", divEntiere, divCast);
        return 0;
      }
    `);
    expect(res.executionSuccess).toBe(true);
    expect(res.stdout).toBe('2 | 2.50\n');
  });

  it('handles scanf with pointers (&) and multiple data types', () => {
    const res = compileAndRunC(
      `
      #include <stdio.h>
      int main(void) {
        int age = 0;
        double taille = 0.0;
        char nom[20];
        int lus = scanf("%s %d %lf", nom, &age, &taille);
        printf("Lus=%d : %s a %d ans et mesure %.2fm\\n", lus, nom, age, taille);
        return 0;
      }
    `,
      'Alice 19 1.72\n'
    );
    expect(res.executionSuccess).toBe(true);
    expect(res.stdout).toBe('Lus=3 : Alice a 19 ans et mesure 1.72m\n');
  });

  it('detects missing & in scanf at compile-time (warning) and runtime (trap)', () => {
    const res = compileAndRunC(
      `
      #include <stdio.h>
      int main(void) {
        int x = 0;
        scanf("%d", x);
        return 0;
      }
    `,
      '42\n'
    );
    expect(res.diagnostics.some((d) => d.code === 'C-WARN-SCANF-NO-AMP')).toBe(true);
    expect(res.executionSuccess).toBe(false);
    expect(res.diagnostics.some((d) => d.code === 'C-RUN-SCANF-MISSING-AMP')).toBe(true);
  });

  it('supports pointers, address-of (&), dereference (*), and pass-by-pointer swap', () => {
    const res = compileAndRunC(`
      #include <stdio.h>
      void echanger(int *p1, int *p2) {
        int tmp = *p1;
        *p1 = *p2;
        *p2 = tmp;
      }
      int main(void) {
        int x = 10, y = 99;
        echanger(&x, &y);
        printf("x=%d, y=%d\\n", x, y);
        return 0;
      }
    `);
    expect(res.executionSuccess).toBe(true);
    expect(res.stdout).toBe('x=10, y=99\n'.replace('10', '99').replace('y=99', 'y=10'));
  });

  it('supports recursion (factorial and Fibonacci)', () => {
    const res = compileAndRunC(`
      #include <stdio.h>
      int factorielle(int n) {
        if (n <= 1) return 1;
        return n * factorielle(n - 1);
      }
      int main(void) {
        printf("5! = %d\\n", factorielle(5));
        return 0;
      }
    `);
    expect(res.executionSuccess).toBe(true);
    expect(res.stdout).toBe('5! = 120\n');
  });

  it('supports 1D arrays, pointer arithmetic, and traps on out-of-bounds access', () => {
    const okRes = compileAndRunC(`
      #include <stdio.h>
      int somme(int tab[], int n) {
        int s = 0;
        for (int i = 0; i < n; i++) {
          s += *(tab + i);
        }
        return s;
      }
      int main(void) {
        int notes[4] = {12, 15, 18, 15};
        printf("Somme = %d\\n", somme(notes, 4));
        return 0;
      }
    `);
    expect(okRes.executionSuccess).toBe(true);
    expect(okRes.stdout).toBe('Somme = 60\n');

    const oobRes = compileAndRunC(`
      #include <stdio.h>
      int main(void) {
        int t[3] = {1, 2, 3};
        printf("%d\\n", t[3]);
        return 0;
      }
    `);
    expect(oobRes.executionSuccess).toBe(false);
    expect(oobRes.diagnostics.some((d) => d.code === 'C-RUN-ARRAY-OOB')).toBe(true);
  });

  it('supports structs, typedef struct, dot (.) and arrow (->) operators', () => {
    const res = compileAndRunC(`
      #include <stdio.h>
      #include <string.h>

      typedef struct {
        char nom[24];
        int age;
        double moyenne;
      } Etudiant;

      void bonifier(Etudiant *e, double bonus) {
        e->moyenne += bonus;
      }

      int main(void) {
        Etudiant e1;
        strcpy(e1.nom, "Durand");
        e1.age = 18;
        e1.moyenne = 13.5;
        bonifier(&e1, 1.25);
        printf("%s (%d ans) : %.2f\\n", e1.nom, e1.age, e1.moyenne);
        return 0;
      }
    `);
    expect(res.executionSuccess).toBe(true);
    expect(res.stdout).toBe('Durand (18 ans) : 14.75\n');
  });

  it('supports dynamic memory allocation (malloc, free) and detects memory leaks', () => {
    const cleanRes = compileAndRunC(`
      #include <stdio.h>
      #include <stdlib.h>
      int main(void) {
        int *tab = (int *)malloc(3 * sizeof(int));
        tab[0] = 7;
        tab[1] = 14;
        tab[2] = 21;
        printf("%d\\n", tab[0] + tab[1] + tab[2]);
        free(tab);
        return 0;
      }
    `);
    expect(cleanRes.executionSuccess).toBe(true);
    expect(cleanRes.stdout).toBe('42\n');
    expect(cleanRes.memorySnapshot?.leakedBytes).toBe(0);

    const leakRes = compileAndRunC(`
      #include <stdlib.h>
      int main(void) {
        int *p = (int *)malloc(16);
        *p = 5;
        return 0;
      }
    `);
    expect(leakRes.executionSuccess).toBe(true);
    expect(leakRes.memorySnapshot?.leakedBytes).toBe(16);
    expect(leakRes.diagnostics.some((d) => d.code === 'C-WARN-MEM-LEAK')).toBe(true);
  });

  it('terminates infinite loops safely via instruction limit', () => {
    const res = compileAndRunC(
      `
      int main(void) {
        int i = 0;
        while (i >= 0) {
          i++;
        }
        return 0;
      }
    `,
      '',
      5000
    );
    expect(res.executionSuccess).toBe(false);
    expect(res.terminatedByTimeout).toBe(true);
  });
});

describe('AlgoEngine — French Algorithmic Pseudo-Code Interpreter & Tracer', () => {
  it('executes French pseudo-code with variables, loops, conditions, and generates trace steps', () => {
    const res = compileAndRunPseudoCode(
      `
      Algorithme CalculSommePairs
      Variables
        n, i, somme : Entier
      Début
        Lire(n)
        somme <- 0
        Pour i de 1 à n Faire
          Si i MOD 2 = 0 Alors
            somme <- somme + i
          FinSi
        FinPour
        Afficher(somme)
      Fin
    `,
      '6'
    );
    expect(res.compileSuccess).toBe(true);
    expect(res.executionSuccess).toBe(true);
    expect(res.stdout.trim()).toBe('12');
    expect((res.traceSteps ?? []).length).toBeGreaterThan(5);
  });
});

describe('StorageService — Export and Import Validation', () => {
  it('exports and re-imports valid progress state while rejecting malformed JSON', () => {
    const initial = createInitialProgressState();
    const json = exportProgressToJson(initial);
    const imported = validateAndImportProgressJson(json);
    expect(imported.valid).toBe(true);
    expect(imported.state?.schemaVersion).toBe(1);

    const bad = validateAndImportProgressJson('{"schemaVersion": 999}');
    expect(bad.valid).toBe(false);
  });
});

describe('C99Engine — features used by the ShopFlow track (Parcours C)', () => {
  it('honours #ifndef include guards and #ifdef / #else', () => {
    const res = compileAndRunC(`
      #include <stdio.h>
      #ifndef TYPES_H
      #define TYPES_H
      typedef struct { int numero; float montant; } Commande;
      #endif
      #ifndef TYPES_H
      typedef struct { int numero; } Commande;
      #endif
      #ifdef DEBUG
      #define MODE 1
      #else
      #define MODE 2
      #endif
      int main(void) {
        Commande c = {7, 1.5f};
        printf("%d %.1f %d\\n", c.numero, c.montant, MODE);
        return 0;
      }
    `);
    expect(res.compileSuccess).toBe(true);
    expect(res.stdout).toBe('7 1.5 2\n');
  });

  it('initialises arrays of structs, compound literals and sizeof of array fields', () => {
    const res = compileAndRunC(`
      #include <stdio.h>
      typedef struct { int jour; int mois; int annee; } Date;
      typedef struct { char reference[12]; char designation[60]; } Produit;
      int main(void) {
        Produit cat[2] = {{"PRD-0001", "Clavier"}, {"PRD-0007", "Hub USB-C"}};
        Date d;
        d = (Date){12, 3, 2026};
        printf("%s %s %d/%d/%d %d\\n", cat[1].reference, cat[1].designation,
               d.jour, d.mois, d.annee, (int)sizeof(cat[0].designation));
        return 0;
      }
    `);
    expect(res.executionSuccess).toBe(true);
    expect(res.stdout).toBe('PRD-0007 Hub USB-C 12/3/2026 60\n');
  });

  it('supports qsort with a user comparator, strcspn and fgets(stdin)', () => {
    const res = compileAndRunC(
      `
      #include <stdio.h>
      #include <stdlib.h>
      #include <string.h>
      int cmp(const void *a, const void *b) {
        return *(const int *)b - *(const int *)a;
      }
      int main(void) {
        int t[5] = {3, 9, 1, 7, 5};
        qsort(t, 5, sizeof(int), cmp);
        char ligne[40];
        fgets(ligne, sizeof(ligne), stdin);
        ligne[strcspn(ligne, "\\n")] = '\\0';
        printf("%d %d %d [%s]\\n", t[0], t[2], t[4], ligne);
        return 0;
      }
    `,
      '12 rue de la Paix\n'
    );
    expect(res.executionSuccess).toBe(true);
    expect(res.stdout).toBe('9 5 1 [12 rue de la Paix]\n');
  });

  it('fails a test case flagged forbidMemoryLeaks when a block is not freed', () => {
    const code = `
      #include <stdio.h>
      #include <stdlib.h>
      int main(void) {
        int *p = malloc(4 * sizeof(int));
        printf("ok\\n");
        return 0;
      }
    `;
    const tc = { id: 't', label: 'fuite', category: 'normal' as const, stdin: '', expectedStdout: 'ok', explanation: '' };
    expect(runCCodeTestSuite(code, [tc]).allPassed).toBe(true);
    expect(runCCodeTestSuite(code, [{ ...tc, forbidMemoryLeaks: true }]).allPassed).toBe(false);
  });
});
