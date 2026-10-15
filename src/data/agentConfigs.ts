/** Where one piece of a developer's agent setup lives. */
export type ConfigLocation = "repo" | "local" | "missing";

export interface ConfigItem {
  readonly text: string;
  readonly where: ConfigLocation;
}

export const LOCATION_LABEL: Readonly<Record<ConfigLocation, string>> = {
  repo: "En el repositorio",
  local: "Solo en esta laptop",
  missing: "Sin configurar",
};

/** What each illustrative setup makes available to the agent. */
export interface TaskOutput {
  readonly errors: string;
  readonly tests: string;
  readonly tools: string;
}

export interface DeveloperSetup {
  readonly id: string;
  readonly name: string;
  readonly agent: string;
  readonly summary: string;
  readonly config: readonly ConfigItem[];
  readonly output: TaskOutput;
  /** One line linking a configuration difference to a review risk. */
  readonly why: string;
}

export const sharedTask = 'Misma tarea: "Agregar un endpoint de escritura al servicio de pagos."';

export const ILLUSTRATIVE_LABEL = "Lo que cada agente tiene disponible";

export const SETUPS_LABEL = "Misma herramienta en ambos casos: Claude Code";

export const OUTPUT_COLUMNS: readonly { key: keyof TaskOutput; label: string }[] = [
  { key: "errors", label: "Reglas disponibles" },
  { key: "tests", label: "Procedimiento de pruebas" },
  { key: "tools", label: "Conexión MCP" },
];

export const WHY_LABEL = "Consecuencia para el equipo";

export const developers: readonly DeveloperSetup[] = [
  {
    id: "alice",
    name: "Alice",
    agent: "Claude Code",
    summary: "Configuración en el repositorio",
    config: [
      { text: "CLAUDE.md: devolver Result<T,E>; exigir clave de idempotencia", where: "repo" },
      { text: ".claude/skills/write-tests/SKILL.md: comprobar solicitudes duplicadas", where: "repo" },
      { text: ".mcp.json: conexión a la documentación del equipo; requiere autorización personal", where: "repo" },
    ],
    output: {
      errors: "Convención actual: Result",
      tests: "Procedimiento compartido",
      tools: "Documentación del equipo",
    },
    why: "La configuración está en el repositorio y se puede revisar.",
  },
  {
    id: "bob",
    name: "Bob",
    agent: "Claude Code",
    summary: "Reglas copiadas en una sola laptop",
    config: [
      { text: "~/.claude/CLAUDE.md: lanzar excepciones; copiado de otro proyecto", where: "local" },
      { text: "Sin procedimiento compartido de pruebas", where: "missing" },
      { text: "Sin conexión a la documentación del equipo", where: "missing" },
    ],
    output: {
      errors: "Convención ajena: throw",
      tests: "Sin procedimiento",
      tools: "Sin configurar",
    },
    why: "Cada revisión debe reconstruir las reglas y procedimientos que faltan.",
  },
];

export const COSTS_TITLE = "Lo que esto le cuesta al equipo";

export interface TeamCost {
  readonly title: string;
  readonly detail: string;
}

export const teamCosts: readonly TeamCost[] = [
  {
    title: "Volvemos a discutir convenciones",
    detail: "¿Result o throw? La revisión repite decisiones ya acordadas.",
  },
  {
    title: "Se omiten procedimientos",
    detail: "Cada persona decide qué comprobaciones ejecuta su agente.",
  },
  {
    title: "La incorporación depende de otra persona",
    detail: "Cada persona nueva copia una configuración a mano o empieza sin ella.",
  },
];

export const BRIDGE = "La configuración del equipo debe vivir en un solo lugar, con una versión.";
