export type TerminalLineKind = "command" | "success" | "info" | "error";

export interface TerminalLine {
  readonly kind: TerminalLineKind;
  readonly text: string;
  /** Related configuration gap; supplying the file does not guarantee correct output. */
  readonly ref?: number;
}

/** Badge shown on the terminal: the session is staged, not a real run. */
export const HOOK_BADGE = "Terminal ilustrativa · observaciones en rojo";

/** Illustrative onboarding: a new developer's code runs, but the agent lacks the team's context. */
export const hookLines: readonly TerminalLine[] = [
  { kind: "command", text: "$ git clone acme/payments-service" },
  { kind: "command", text: "$ npm ci && npm test" },
  { kind: "success", text: "✓ Installed from package-lock.json · tests pass" },
  { kind: "command", text: '$ claude "add a payments endpoint"' },
  { kind: "info", text: "● Wrote src/routes/payments.ts. Done." },
  { kind: "error", text: "✗ Throws; team returns Result<T,E>", ref: 1 },
  { kind: "error", text: "✗ No idempotency key on a write endpoint", ref: 1 },
  { kind: "error", text: "✗ Team test procedure not available", ref: 2 },
  { kind: "error", text: "✗ Not connected to the team's docs tools", ref: 3 },
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
    effect: "Describir cómo se prueban los reintentos.",
  },
  {
    n: 3,
    name: "Servidor MCP",
    file: ".mcp.json",
    what: "Conecta herramientas; requiere credenciales y autorización.",
    effect: "Permitir consultar la documentación del equipo.",
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
  "¿Cómo compartimos y versionamos la configuración",
  "sin reconstruirla a mano para cada persona?",
];
