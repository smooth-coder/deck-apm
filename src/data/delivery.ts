export const SOLVES_TITLE = "Qué resuelve APM";
export const DOES_NOT_SOLVE_TITLE = "Qué no resuelve";

export const solves: readonly string[] = [
  "Configuración compartida entre personas y proyectos",
  "Versión declarada en apm.yml",
  "Archivos instalados inspeccionables en apm.lock.yaml",
  "Consistencia comprobada en CI con apm audit --ci",
];

export const doesNotSolve: readonly string[] = [
  "No hace determinista al modelo",
  "No valida el código que produce el agente: lo validan las pruebas, las evaluaciones y la revisión humana",
  "No sustituye la revisión antes de publicar",
];

export const TAKEAWAY_TITLE = "Cómo empezar";

export const takeawaySteps: readonly { readonly command: string; readonly note: string }[] = [
  { command: "pip install apm-cli==0.33.0", note: "Python 3.10+, preferiblemente en un entorno virtual" },
  { command: "apm init", note: "crea apm.yml; después declara el repositorio y la versión del equipo" },
  { command: "apm install", note: "también instala la configuración MCP del repositorio directo" },
  { command: "apm audit --ci", note: "código 0: pasa; código 1: falla" },
];

export const TAKEAWAY_FOOTER = "Cada proyecto fija una referencia Git revisada de la versión del equipo.";

export const CLOSING_QUOTE = "El próximo dev clona el repo y su agente ya trabaja como el equipo.";
