export type TrackId = 'algo' | 'c';

export type DifficultyLevel = 'debutant' | 'intermediaire' | 'avance' | 'synthese';

export type ExerciseCategory =
  | 'qcm'
  | 'prediction'
  | 'trace'
  | 'ordering'
  | 'completion'
  | 'bugfix'
  | 'error_spot'
  | 'pseudocode'
  | 'c_code'
  | 'synthesis';

export type ErrorClassification = 'syntaxe' | 'compilation' | 'execution' | 'logique';

export interface VocabularyEntry {
  fr: string;
  en: string;
  definition: string;
}

export interface LineExplanation {
  lineNumber: number;
  code: string;
  explanation: string;
}

export interface AnnotatedExample {
  title: string;
  description: string;
  language: 'pseudo' | 'c';
  code: string;
  stdin?: string;
  expectedOutput: string;
  lineExplanations: LineExplanation[];
}

export interface CommonMistake {
  title: string;
  wrongCode: string;
  rightCode: string;
  explanation: string;
  errorType: ErrorClassification;
}

export interface LessonQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonContent {
  objectives: string[];
  intuition: string;
  formalDefinition: string;
  analogy: {
    title: string;
    content: string;
  };
  vocabulary: VocabularyEntry[];
  simpleExample: AnnotatedExample;
  intermediateExample: AnnotatedExample;
  commonMistakes: CommonMistake[];
  summary: string[];
  comprehensionQuestions: LessonQuizQuestion[];
}

export interface CodeTestCase {
  id: string;
  label: string;
  category: 'normal' | 'limite' | 'invalide';
  stdin: string;
  expectedStdout: string;
  expectedExitCode?: number;
  mustContainConstructs?: string[];
  forbiddenConstructs?: string[];
  explanation: string;
}

export interface TraceCellTarget {
  stepIndex: number;
  variableName: string;
  expectedValue: string;
}

export interface TraceTableSpec {
  code: string;
  language: 'pseudo' | 'c';
  columns: string[]; // e.g. ['Étape', 'i', 'somme', 'Affichage']
  prefilledRows: Record<string, string>[]; // Use '?' for cells the student must fill
  expectedAnswers: Record<string, string>; // key: "rowIndex:colName" -> expected string
}

export interface CompletionGap {
  id: string; // e.g. "GAP_1"
  placeholder: string;
  acceptedAnswers: string[];
  explanation: string;
}

export interface Exercise {
  id: string;
  chapterId: string;
  trackId: TrackId;
  title: string;
  difficulty: DifficultyLevel;
  category: ExerciseCategory;
  testedSkill: string;
  prerequisites: string[];
  statement: string;
  isCoreValidationExercise?: boolean;
  bridgeTargetChapterId?: string; // Links an Algo exercise to a C chapter or vice versa

  // Category-specific payloads:
  // 1. QCM & Error Spotting
  options?: string[];
  correctOptionIndex?: number;
  errorClassificationTarget?: ErrorClassification;

  // 2. Output Prediction
  codeSnippet?: string;
  codeLanguage?: 'pseudo' | 'c';
  stdinForPrediction?: string;
  expectedOutputAnswer?: string;
  ignoreWhitespaceInPrediction?: boolean;

  // 3. Execution Trace Table
  traceSpec?: TraceTableSpec;

  // 4. Instruction Ordering
  scrambledLines?: string[];
  correctOrderIndices?: number[];

  // 5. Code Completion
  templateWithGaps?: string; // Contains {{GAP_1}}, {{GAP_2}}
  gaps?: CompletionGap[];

  // 6. Bugfix / Correction / Pseudo-code / C Programming / Synthesis
  starterCode?: string;
  referenceSolution?: string;
  testCases?: CodeTestCase[];

  // Synthesis / Bridge multi-stage (optional pseudo-code + C code)
  bridgePseudoStarter?: string;
  bridgePseudoSolution?: string;

  // Pedagogical support
  hints: [string, string, string]; // 3 progressive hints
  detailedExplanation: string;
}

export interface Chapter {
  id: string; // e.g. 'A01' .. 'A16', 'B01' .. 'B16'
  trackId: TrackId;
  number: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  prerequisites: string[]; // chapter IDs
  relatedChapters: string[]; // cross-track or same-track related chapter IDs
  coreConcepts: string[];
  successCriteria: string[];
  lesson: LessonContent;
  exercises: Exercise[];
}

// ============================================================================
// COMPILER & EXECUTION ENGINE TYPES
// ============================================================================

export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export interface CompilerDiagnostic {
  line: number;
  column: number;
  severity: DiagnosticSeverity;
  category: ErrorClassification;
  code: string; // e.g. 'C-SYN-001', 'C-WARN-SCANF-AMP'
  gccMessage: string; // Standard compiler message
  pedagogicalTitle: string;
  pedagogicalExplanation: string;
  suggestion?: string;
}

export interface MemoryVariableSnapshot {
  name: string;
  type: string;
  scope: string; // 'global' | 'main' | function name
  addressHex: string; // e.g. '0x4004'
  sizeBytes: number;
  valueFormatted: string;
  initialized: boolean;
  pointsToAddressHex?: string;
  isArray?: boolean;
  arrayElements?: string[];
  isStruct?: boolean;
  structFields?: Record<string, string>;
}

export interface StackFrameSnapshot {
  functionName: string;
  returnLine: number;
  baseAddressHex: string;
  variables: MemoryVariableSnapshot[];
}

export interface HeapBlockSnapshot {
  addressHex: string;
  sizeBytes: number;
  allocatedAtLine: number;
  freed: boolean;
  freedAtLine?: number;
  valuesPreview: string;
}

export interface MemorySnapshot {
  globals: MemoryVariableSnapshot[];
  callStack: StackFrameSnapshot[];
  heapBlocks: HeapBlockSnapshot[];
  leakedBytes: number;
  totalBytesUsed: number;
}

export interface TraceStep {
  stepNumber: number;
  line: number;
  instructionSummary: string;
  variables: Record<string, string>;
  outputDelta?: string;
}

export interface CompileAndRunResult {
  compileSuccess: boolean;
  executionSuccess: boolean;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  diagnostics: CompilerDiagnostic[];
  executionTimeMs: number;
  instructionsExecuted: number;
  terminatedByTimeout: boolean;
  memorySnapshot?: MemorySnapshot;
  traceSteps?: TraceStep[];
}

export interface TestCaseRunResult {
  testCase: CodeTestCase;
  passed: boolean;
  actualStdout: string;
  actualStderr: string;
  exitCode: number | null;
  diagnostics: CompilerDiagnostic[];
  failureReason?: string;
}

// ============================================================================
// LOCAL PERSISTENCE & PROGRESSION TYPES
// ============================================================================

export interface ChapterProgressState {
  chapterId: string;
  consulted: boolean;
  firstConsultedAt?: string;
  lastConsultedAt?: string;
  lessonQuizAnswers: Record<string, number>;
  lessonCompleted: boolean;
  lessonCompletedAt?: string;
  validated: boolean;
  validatedAt?: string;
}

export interface ExerciseProgressState {
  exerciseId: string;
  attemptsCount: number;
  passed: boolean;
  firstPassedAt?: string;
  lastAttemptAt?: string;
  hintsUnlocked: number; // 0 to 3
  savedCode?: string;
  savedSecondaryCode?: string; // For synthesis/bridge exercises
  savedAnswers?: Record<string, string>;
  savedOptionIndex?: number;
  savedOrder?: number[];
  lastErrorCategory?: ErrorClassification;
  failedAttemptsBeforePass: number;
}

export interface LabSnippet {
  id: string;
  title: string;
  language: 'c' | 'pseudo';
  code: string;
  stdin: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  editorFontSize: 'sm' | 'md' | 'lg';
  showCompilerWarnings: boolean;
  showMemoryInspectorByDefault: boolean;
}

export interface LastLocationState {
  screen:
    | 'dashboard'
    | 'tracks'
    | 'chapters'
    | 'lesson'
    | 'exercise'
    | 'lab'
    | 'report'
    | 'settings';
  trackId: TrackId;
  chapterId: string;
  exerciseId?: string;
}

export interface StudentProgressState {
  schemaVersion: 1;
  createdAt: string;
  lastActivityAt: string;
  lastLocation: LastLocationState;
  preferences: UserPreferences;
  chapters: Record<string, ChapterProgressState>;
  exercises: Record<string, ExerciseProgressState>;
  labSnippets: LabSnippet[];
}
