export type TerminalLineKind = "command" | "success" | "info" | "error";

export interface TerminalLine {
  readonly kind: TerminalLineKind;
  readonly text: string;
  /** Related configuration gap; supplying the file does not guarantee correct output. */
  readonly ref?: number;
}

/** Badge shown on the terminal: the session is staged, not a real run. */
export const HOOK_BADGE = "Terminal ilustrativa · observaciones en rojo";

/**
 * Illustrative PAY-142 review: missing configuration is a risk, not proof of causality.
 * Keep every line visible so the presenter can return to the refund invariant at the close.
 */
export const hookLines: readonly TerminalLine[] = [
  { kind: "command", text: "$ git clone acme/payments-service" },
  { kind: "command", text: "$ npm ci" },
  { kind: "success", text: "✓ Installed from package-lock.json" },
  { kind: "command", text: '$ claude "add a refund endpoint"' },
  { kind: "info", text: "● Wrote src/routes/refund.ts. Done." },
  { kind: "error", text: "✗ Throws; team returns Result<T,E>", ref: 1 },
  { kind: "error", text: "✗ No idempotency key: double refunds", ref: 1 },
  { kind: "error", text: "✗ No tests written", ref: 2 },
  { kind: "error", text: "✗ Never read ticket PAY-142", ref: 3 },
];

export interface MissingPiece {
  readonly n: number;
  /** Plain name of the piece. */
  readonly name: string;
  /** Real file name(s); verified in docs/copy-review.md. Empty when the point is that none exists. */
  readonly file: string;
  /** What it is, in one plain sentence. */
  readonly what: string;
  /** What this piece asks or enables the agent to do; not a behavioral guarantee. */
  readonly effect: string;
}

export const MISSING_TITLE = "Lo que el agente no recibió";

export const missingPieces: readonly MissingPiece[] = [
  {
    n: 1,
    name: "Archivo de instrucciones",
    file: "CLAUDE.md · AGENTS.md",
    what: "Reglas del equipo como contexto, no como política obligatoria.",
    effect: "Pedir tipos Result y claves de idempotencia.",
  },
  {
    n: 2,
    name: "Procedimiento (skill)",
    file: ".claude/skills/write-tests/SKILL.md",
    what: "Un procedimiento reutilizable que se carga cuando corresponde.",
    effect: "Describir la prueba de reintentos.",
  },
  {
    n: 3,
    name: "Servidor MCP",
    file: ".mcp.json",
    what: "Conecta herramientas; requiere credenciales y autorización.",
    effect: "Permitir leer PAY-142, no garantizar su lectura.",
  },
  {
    n: 4,
    name: "Sin registro compartido",
    file: "",
    what: "No hay una declaración común de los archivos instalados.",
    effect: "Poder revisar y reproducir la configuración.",
  },
];

/** Seconds between consecutive stages: one per terminal line, one per missing piece, then the quote. */
export const hookDelays: readonly number[] = [
  0.6, 0.8, 0.6, 1.0, 1.4, 0.9, 0.8, 0.8, 0.8, 1.6, 1.2, 1.2, 1.2, 1.6,
];

/** Stage at which missing piece `i` (0-based) becomes visible. */
export const pieceStage = (i: number): number => hookLines.length + 1 + i;

export const QUOTE_STAGE = hookLines.length + missingPieces.length + 1;

export const HOOK_QUOTE_LINES: readonly [string, string] = [
  "Versiona la configuración.",
  "Valida el reembolso, no solo la configuración.",
];
