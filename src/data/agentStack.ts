export interface StackNode {
  readonly id: string;
  readonly label: string;
  /** What it is and when it enters the model's context (max ~25 words). */
  readonly definition: string;
  /** Where it lives: a real path or file name. */
  readonly lives: string;
  /** Illustrative content for that file. */
  readonly example: string;
}

export const agentNode: StackNode = {
  id: "agent",
  label: "Agente de IA",
  definition:
    "El modelo y la herramienta que ejecutan la tarea. La configuración es una entrada, no todo el entorno de ejecución.",
  lives: "(herramienta: Claude Code, Copilot, Cursor, Codex)",
  example: "Task: Add a refund endpoint to the payment service.",
};

export const capabilityNodes: readonly StackNode[] = [
  {
    id: "instructions",
    label: "Instrucciones",
    definition:
      "Reglas aportadas como contexto. Orientan al modelo; no imponen que el resultado sea correcto.",
    lives: "CLAUDE.md · AGENTS.md",
    example: "Return Result<T,E>. Refund requests require an idempotency key.",
  },
  {
    id: "skills",
    label: "Procedimientos",
    definition: "Una habilidad (skill) reutilizable que se elige para una tarea. Tenerla disponible no demuestra que se haya ejecutado.",
    lives: ".claude/skills/write-tests/SKILL.md",
    example: "Send the same refund request twice. Assert one refund, not two.",
  },
  {
    id: "mcp",
    label: "MCP",
    definition:
      "El protocolo MCP conecta al agente con herramientas y datos. El acceso al servidor requiere permisos y credenciales.",
    lives: ".mcp.json (Claude Code) · .cursor/mcp.json (Cursor)",
    example: "Read PAY-142: retrying a request must not refund the payment twice.",
  },
  {
    id: "subagents",
    label: "Subagentes",
    definition:
      "Delegación opcional: un especialista con sus propias instrucciones, contexto y permisos de herramientas.",
    lives: ".claude/agents/code-reviewer.md",
    example: "Read-only reviewer: inspect refund behavior and the retry test.",
  },
];

export const contextNode: StackNode = {
  id: "context",
  label: "Contexto del agente",
  definition:
    "Lo que el modelo recibe durante la ejecución: tarea, conversación y resultados seleccionados de las herramientas.",
  lives: "Se arma durante la ejecución; un lockfile de APM no lo registra por completo",
  example: "Mismos archivos instalados ≠ mismo resultado. También influyen el modelo, la conversación, los permisos y los datos externos.",
};

export const STACK_MESSAGE =
  "APM gestiona la configuración instalada. Las pruebas y evaluaciones validan el comportamiento.";

/** Shown with every node: most paths are Claude Code's; other tools are named where they differ. */
export const STACK_SCOPE_NOTE =
  "Las rutas son de Claude Code, salvo que se indique otra herramienta. Los ejemplos son ilustrativos.";
