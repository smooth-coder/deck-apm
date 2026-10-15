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

export const pipelineSteps: readonly PipelineStep[] = [
  {
    label: "Configuración",
    check: "Instala archivos revisados; compara manifiesto y apm.lock.yaml con apm audit --ci.",
    coverage: "apm",
  },
  {
    label: "Validación",
    check: "Ejecuta pruebas del producto. Evalúa cambios del agente con tareas fijas, registrando modelo y configuración.",
    coverage: "yours",
  },
  {
    label: "Aprobación",
    check: "Revisa el código, supera las pruebas y la compilación; después integra y publica con tus controles habituales.",
    coverage: "yours",
  },
];


export const PIPELINE_CAPTION =
  "Las huellas verifican integridad frente a una referencia, no seguridad. APM no evalúa la calidad del código ni aísla al agente.";

export const TAKEAWAY_TITLE = "Pruébalo el lunes";

export const takeawaySteps: readonly { readonly command: string; readonly note: string }[] = [
  { command: "pip install apm-cli==0.33.0", note: "Python 3.10+, preferiblemente en un entorno virtual" },
  { command: "apm init", note: "declara el repositorio y la versión del equipo; fija los clientes destino" },
  { command: "apm install", note: "también instala la configuración MCP del repositorio directo" },
  { command: "apm audit --ci", note: "código 0: pasa; código 1: falla" },
];

export const TAKEAWAY_FOOTER = "Cada proyecto fija una referencia Git revisada. Revisa las definiciones y el MCP antes de confiar. Las credenciales y permisos siguen siendo personales.";

export const CLOSING_QUOTE =
  "Versiona la configuración. Valida el resultado. Revisa antes de publicar.";
