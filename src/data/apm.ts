export interface AnalogyRow {
  readonly id: string;
  readonly outcome: string;
  readonly traditional: string;
  readonly agentic: string;
  /** Plain-language consequence for a team, explained when this row is selected. */
  readonly note: string;
}

export const ANALOGY_DISCLAIMER =
  "Analogía con npm, no equivalencia funcional · APM 0.33.0, versión preliminar";

export const APM_CLOSING =
  "Empieza con instrucciones versionadas. Usa APM cuando compartir paquetes y mantener varios clientes requiera trabajo manual.";

export const analogyRows: readonly AnalogyRow[] = [
  {
    id: "manifest",
    outcome: "Acordar la configuración en un solo lugar",
    traditional: "package.json",
    agentic: "apm.yml",
    note: "El equipo es dueño de las definiciones (agentes, habilidades, reglas y MCP) y publica una versión. Cada proyecto declara en su apm.yml qué versión usa; no redefine su contenido.",
  },
  {
    id: "install",
    outcome: "Preparar a una persona nueva sin copiar carpetas",
    traditional: "npm install",
    agentic: "apm install",
    note: "Instala las definiciones de la versión elegida en los clientes del proyecto. Todas las personas parten de la misma configuración.",
  },
];

/** Same Git dependency and consumer metadata used by the real recording. */
export const manifestSnippet = `# Consumer project — definitions live in the shared repository
name: payments-service
version: 1.0.0
targets: [copilot, claude]
dependencies:
  apm:
    - northstar-engineering/payments-team#v1.0.0`;
