
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

export const TALK_TITLE = "El agente también es una dependencia";
export const TALK_SUBTITLE =
  "Entrega de software con IA: versionar, bloquear y validar la configuración del agente";
export const TALK_THESIS = "La configuración del agente es parte de tu entrega: versiónala, bloquéala y valídala en CI.";

export const scenes: readonly Scene[] = [
  {
    id: 1,
    title: "Entregamos con agentes, pero su configuración no pasa por el pipeline.",
    support:
      "Una persona nueva clona el repositorio: el código se instala y se ejecuta, pero su agente no tiene las reglas, los procedimientos ni las conexiones del equipo.",
    goal: "Plantear el problema único de entrega: el código llega con su lockfile y su CI, pero la configuración del agente (instrucciones, habilidades, MCP) no se versiona ni se valida; cada persona la reconstruye a mano.",
    durationMin: 2,
  },
  {
    id: 2,
    title: "Mismo pipeline. Dos configuraciones de agente distintas.",
    support:
      "Alice trabaja con reglas, un procedimiento y una conexión MCP del repositorio. Bob, con reglas copiadas en su laptop. Lo que se entrega depende de qué laptop produjo el cambio.",
    goal: "Premisa central: dos personas, mismo repositorio, mismo pipeline y mismo agente, con configuraciones distintas. Lo que llega al pipeline depende de la laptop de origen. Sin prometer resultados deterministas.",
    durationMin: 2,
  },
  {
    id: 3,
    title: "La configuración del agente, tratada como dependencia.",
    support:
      "APM (Agent Package Manager) la declara en apm.yml, el equipo la versiona y apm.lock.yaml la bloquea. Cada proyecto elige qué versión usa.",
    goal: "Presentar APM solo como la promesa: la configuración del agente se trata como una dependencia (declarada, versionada, bloqueada). El archivo de bloqueo y la auditoría en CI se muestran en la escena 5.",
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
    title: "Usa la versión del equipo y deja que CI la valide.",
    support: "Declara el repositorio en apm.yml, instala para Claude y Copilot, y comprueba en CI que lo instalado coincide con el manifiesto y el lockfile.",
    goal: "Start with only the consumer manifest. Install the versioned package, inspect deployed files and lockfile, pass CI, then show an incomplete dependency change fail CI and the fix pass it, without showing the producer source tree.",
    durationMin: 4,
  },
  {
    id: 6,
    title: "La configuración del agente es parte de tu entrega.",
    support:
      "Versiónala, bloquéala y valídala en CI. APM cubre el primer paso del pipeline; las pruebas, las evaluaciones y la revisión humana siguen siendo del equipo.",
    goal: "Cierre: el pipeline de entrega con tres pasos, APM cubre la configuración y el equipo el resto; cómo empezar y la frase final: el próximo dev clona el repo y su agente ya trabaja como el equipo.",
    durationMin: 2,
  },
];

export const TOTAL_DURATION_MIN: number = scenes.reduce((sum, s) => sum + s.durationMin, 0);
