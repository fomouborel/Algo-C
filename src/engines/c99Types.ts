export type CBaseType =
  | 'void'
  | 'char'
  | 'short'
  | 'int'
  | 'long'
  | 'float'
  | 'double'
  | 'bool'
  | 'size_t'
  | 'FILE'
  | 'struct';

export interface CTypeInfo {
  base: CBaseType;
  unsigned?: boolean;
  isConst?: boolean;
  pointerDepth: number; // 0 = value, 1 = T*, 2 = T**
  arrayDims: number[]; // [] for scalar, [10] for 1D, [3, 4] for 2D
  structName?: string;
}

export interface CStructFieldDef {
  name: string;
  type: CTypeInfo;
  offset: number;
  size: number;
}

export interface CStructDef {
  name: string;
  fields: CStructFieldDef[];
  totalSize: number;
}

export interface Token {
  type:
    | 'keyword'
    | 'ident'
    | 'int_lit'
    | 'float_lit'
    | 'char_lit'
    | 'string_lit'
    | 'punct'
    | 'eof';
  value: string;
  numValue?: number;
  line: number;
  column: number;
}

export type ASTExpr =
  | { kind: 'int_lit'; value: number; line: number }
  | { kind: 'float_lit'; value: number; line: number }
  | { kind: 'char_lit'; value: number; line: number }
  | { kind: 'string_lit'; value: string; line: number }
  | { kind: 'ident'; name: string; line: number }
  | { kind: 'init_list'; elements: ASTExpr[]; designated?: { field?: string; expr: ASTExpr }[]; line: number }
  | { kind: 'unary'; op: string; prefix: boolean; operand: ASTExpr; line: number }
  | { kind: 'binary'; op: string; left: ASTExpr; right: ASTExpr; line: number }
  | { kind: 'ternary'; cond: ASTExpr; thenExpr: ASTExpr; elseExpr: ASTExpr; line: number }
  | { kind: 'assign'; op: string; left: ASTExpr; right: ASTExpr; line: number }
  | { kind: 'call'; callee: string; args: ASTExpr[]; line: number }
  | { kind: 'index'; array: ASTExpr; index: ASTExpr; line: number }
  | { kind: 'member'; object: ASTExpr; field: string; isArrow: boolean; line: number }
  | { kind: 'cast'; targetType: CTypeInfo; expr: ASTExpr; line: number }
  | { kind: 'sizeof_type'; targetType: CTypeInfo; line: number }
  | { kind: 'sizeof_expr'; expr: ASTExpr; line: number };

export interface VarDeclItem {
  name: string;
  type: CTypeInfo;
  init?: ASTExpr;
  line: number;
}

export type ASTStmt =
  | { kind: 'block'; statements: ASTStmt[]; line: number }
  | { kind: 'var_decl'; decls: VarDeclItem[]; isStatic?: boolean; line: number }
  | { kind: 'expr_stmt'; expr: ASTExpr | null; line: number }
  | { kind: 'if'; cond: ASTExpr; thenBranch: ASTStmt; elseBranch: ASTStmt | null; line: number }
  | {
      kind: 'switch';
      expr: ASTExpr;
      cases: { value: ASTExpr | null; stmts: ASTStmt[]; line: number }[];
      line: number;
    }
  | { kind: 'while'; cond: ASTExpr; body: ASTStmt; line: number }
  | { kind: 'do_while'; body: ASTStmt; cond: ASTExpr; line: number }
  | {
      kind: 'for';
      init: ASTStmt | null;
      cond: ASTExpr | null;
      step: ASTExpr | null;
      body: ASTStmt;
      line: number;
    }
  | { kind: 'return'; expr: ASTExpr | null; line: number }
  | { kind: 'break'; line: number }
  | { kind: 'continue'; line: number };

export interface ASTFunctionParam {
  name: string;
  type: CTypeInfo;
}

export interface ASTFunctionDef {
  name: string;
  returnType: CTypeInfo;
  params: ASTFunctionParam[];
  body: ASTStmt | null; // null if prototype only
  line: number;
}

export interface ASTProgram {
  structs: Map<string, CStructDef>;
  typedefs: Map<string, CTypeInfo>;
  enums: Map<string, number>;
  globals: VarDeclItem[];
  functions: Map<string, ASTFunctionDef>;
}
