export type ApmCoverage = "apm" | "yours";

export interface PipelineStep {
  readonly label: string;
  /** One line (max ~25 words) saying what is checked at this step. */
  readonly check: string;
  /** Configuration tooling versus the team's delivery responsibility. */
  readonly coverage: ApmCoverage;
}

export const COVERAGE_LABEL: Readonly<Record<ApmCoverage, string>> = {
  apm: "APM",
  yours: "EQUIPO",
};

export const PIPELINE_TITLE = "Pipeline de entrega";

export const pipelineSteps: readonly PipelineStep[] = [
  {
    label: "Configuración",
    check: "Instala la configuración revisada del agente; apm audit --ci comprueba que el manifiesto y apm.lock.yaml coinciden.",
    coverage: "apm",
  },
  {
    label: "Validación",
    check: "Pruebas del producto y evaluaciones del agente con tareas fijas, registrando modelo y configuración.",
    coverage: "yours",
  },
  {
    label: "Revisión y publicación",
    check: "Revisión humana del código, compilación y controles de publicación habituales.",
    coverage: "yours",
  },
];

export const PIPELINE_CAPTION =
  "APM cubre el primer paso: la configuración. El equipo es dueño del resto. Las huellas verifican integridad, no seguridad, y APM no aísla al agente ni evalúa el código.";

export const TAKEAWAY_TITLE = "Cómo empezar";

export const takeawaySteps: readonly { readonly command: string; readonly note: string }[] = [
  { command: "pip install apm-cli==0.33.0", note: "Python 3.10+, preferiblemente en un entorno virtual" },
  { command: "apm init", note: "crea apm.yml; después declara el repositorio y la versión del equipo" },
  { command: "apm install", note: "también instala la configuración MCP del repositorio directo" },
  { command: "apm audit --ci", note: "añádelo como comprobación obligatoria en CI: código 0 pasa, código 1 falla" },
];

export const TAKEAWAY_FOOTER = "Cada proyecto fija una referencia Git revisada de la versión del equipo.";

export const CLOSING_QUOTE = "El próximo dev clona el repo y su agente ya trabaja como el equipo.";
