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

/** Review risks inferred from these illustrative setups, not measured agent outputs. */
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

export const sharedTask = 'PAY-142: "Agregar un endpoint de reembolso. Un reintento no debe reembolsar dos veces."';

export const ILLUSTRATIVE_LABEL = "Riesgos ilustrativos · no son resultados medidos de modelos";

export const SETUPS_LABEL = "Misma herramienta en ambos ejemplos · no es un experimento causal";

export const OUTPUT_COLUMNS: readonly { key: keyof TaskOutput; label: string }[] = [
  { key: "errors", label: "Reglas disponibles" },
  { key: "tests", label: "Prueba de reintentos" },
  { key: "tools", label: "Acceso al ticket" },
];

export const WHY_LABEL = "Riesgo en revisión";

export const developers: readonly DeveloperSetup[] = [
  {
    id: "alice",
    name: "Alice",
    agent: "Claude Code",
    summary: "Configuración compartida y revisada",
    config: [
      { text: "CLAUDE.md: devolver Result<T,E>; exigir clave de idempotencia", where: "repo" },
      { text: ".claude/skills/write-tests/SKILL.md: comprobar solicitudes duplicadas", where: "repo" },
      { text: ".mcp.json: conexión al gestor de tickets; requiere autorización personal", where: "repo" },
    ],
    output: {
      errors: "Convención actual: Result",
      tests: "Comprobación de duplicados",
      tools: "Configurado; requiere autorización",
    },
    why: "La configuración se puede revisar; el resultado necesita pruebas.",
  },
  {
    id: "bob",
    name: "Bob",
    agent: "Claude Code",
    summary: "Reglas copiadas en una sola laptop",
    config: [
      { text: "~/.claude/CLAUDE.md: lanzar excepciones; copiado de otro proyecto", where: "local" },
      { text: "Sin procedimiento compartido para solicitudes duplicadas", where: "missing" },
      { text: "Sin conexión al gestor de tickets", where: "missing" },
    ],
    output: {
      errors: "Convención ajena: throw",
      tests: "Sin procedimiento compartido",
      tools: "Sin configurar",
    },
    why: "La revisión debe reconstruir las reglas y criterios faltantes.",
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
    title: "Fallan las comprobaciones",
    detail: "Un error de reintentos llega a revisión sin una prueba compartida.",
  },
  {
    title: "La incorporación depende de otra persona",
    detail: "Cada persona nueva copia una configuración a mano o empieza sin ella.",
  },
];

export const BRIDGE = "Compartir archivos reduce diferencias de configuración. No garantiza código idéntico.";
