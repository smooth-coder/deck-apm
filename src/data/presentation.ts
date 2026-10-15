
export interface Scene {
  readonly id: number;
  /** Claim headline shown to the audience (max ~10 words). */
  readonly title: string;
  /** One supporting line shown under the title (max ~25 words). */
  readonly support: string;
  readonly lang?: "es" | "en";
  /** Presenter intent. Never rendered; kept for the presenter script (docs/talk-script.md). */
  readonly goal: string;
  readonly durationMin: number;
}

export const scenes: readonly Scene[] = [
  {
    id: 1,
    title: "Clonar el repositorio no trae el contexto del equipo.",
    support:
      "El código se instala y se ejecuta. El agente no conoce las convenciones, los procedimientos ni las conexiones de herramientas del equipo.",
    goal: "Plantear el problema único: una persona nueva clona, instala y ejecuta, pero su agente no tiene el contexto del equipo y cada persona lo reconstruye a mano.",
    durationMin: 2,
  },
  {
    id: 2,
    title: "Mismo repositorio. Distinta configuración en cada agente.",
    support:
      "Alice tiene reglas, un procedimiento y una conexión MCP en el repositorio. Bob tiene reglas copiadas en su laptop y nada más.",
    goal: "Premisa central: dos personas, mismo repositorio y mismo agente, con reglas, habilidades y MCP distintos. Presentar el coste de la deriva de configuración sin prometer resultados deterministas.",
    durationMin: 2,
  },
  {
    id: 3,
    title: "El equipo publica una versión. Cada proyecto elige cuál usar.",
    support:
      "APM (Agent Package Manager) empaqueta las definiciones del equipo. Cada proyecto declara en apm.yml qué paquete y versión utiliza.",
    goal: "Presentar APM solo como la promesa: el equipo es dueño de las definiciones y publica una versión; cada proyecto declara cuál usa. El archivo de bloqueo y la auditoría en CI se muestran en la escena 5.",
    durationMin: 2,
  },
  {
    id: 4,
    title: "Centraliza la configuración del equipo.",
    support: "Crea un paquete APM, añade los agentes, habilidades y MCP del equipo, y etiqueta una versión.",
    goal: "Separate package authoring from consumption: initialize, add team-owned definitions and record a local Git version without claiming publication.",
    durationMin: 2,
  },
  {
    id: 5,
    title: "Usa la versión del equipo en tu proyecto.",
    support: "Declara el repositorio en apm.yml. Instala la configuración compartida para Claude y Copilot.",
    goal: "Start with only the consumer manifest. Install the versioned package and inspect deployed files, lockfile and CI without showing the producer source tree.",
    durationMin: 3,
  },
  {
    id: 6,
    title: "Versiona la configuración del agente como versionas tus dependencias.",
    support:
      "APM hace la configuración compartida, versionada e inspeccionable. Las pruebas, las evaluaciones y la revisión humana validan el código.",
    goal: "Cierre breve: qué resuelve APM, qué no resuelve, cómo empezar y la frase final: el próximo dev clona el repo y su agente ya trabaja como el equipo.",
    durationMin: 2,
  },
];

export const TOTAL_DURATION_MIN: number = scenes.reduce((sum, s) => sum + s.durationMin, 0);
