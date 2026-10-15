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
    note: "La organización versiona agentes, habilidades, reglas y configuración MCP en un repositorio central. Cada proyecto declara la referencia del paquete en su apm.yml; no redefine su contenido.",
  },
  {
    id: "lockfile",
    outcome: "Registrar las versiones revisadas",
    traditional: "package-lock.json",
    agentic: "apm.lock.yaml",
    note: "Registra el commit Git resuelto, las huellas de los archivos y la configuración MCP. La demo usa un repositorio Git etiquetado local mediante un alias aislado; no una publicación en GitHub.",
  },
  {
    id: "install",
    outcome: "Preparar otro entorno sin copiar carpetas",
    traditional: "npm install",
    agentic: "apm install",
    note: "Instala las definiciones compartidas en los clientes elegidos. APM confía en la configuración MCP de una dependencia directa; la aprobación del cliente y las credenciales de servicios privados siguen siendo personales.",
  },
  {
    id: "ci",
    outcome: "Detectar inconsistencias antes de integrar cambios",
    traditional: "npm ci",
    agentic: "apm install --frozen",
    note: "Si cambia la lista de paquetes sin actualizar el lockfile, CI rechaza la inconsistencia. Corrige la configuración antes de integrar; la calidad del código se comprueba aparte.",
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
