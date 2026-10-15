
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
    title: "Entrega de software con IA y APM",
    support:
      "Define, versiona y comparte los agentes, habilidades y reglas de tu equipo.",
    goal: "Presentar el tema y el resultado concreto antes del caso PAY-142; separar configuración y validación del código.",
    durationMin: 2,
  },
  {
    id: 2,
    title: "Mismo repositorio. Distinta configuración del agente.",
    support:
      "Dos configuraciones ilustrativas, no una comparación de modelos. Distintas reglas y herramientas generan distintos riesgos en la revisión.",
    goal: "Contrastar la configuración compartida con la de una sola laptop, sin prometer resultados deterministas.",
    durationMin: 2,
  },
  {
    id: 3,
    title: "Reglas, procedimientos y herramientas cumplen funciones distintas.",
    support:
      "Las instrucciones orientan. Las habilidades describen procedimientos. MCP conecta herramientas. Nada de esto garantiza que el agente siga el flujo esperado.",
    goal: "Explicar los tres conceptos principales en lenguaje sencillo; mencionar los subagentes como delegación.",
    durationMin: 2,
  },
  {
    id: 4,
    title: "Los agentes y habilidades del equipo, gestionados juntos.",
    support:
      "Tu equipo define los archivos. APM los empaqueta e instala; cada proyecto declara qué paquete utiliza.",
    goal: "Distinguir las definiciones propias del manifiesto consumidor. Explicar propiedad, versiones y distribución.",
    durationMin: 2,
  },
  {
    id: 5,
    title: "Centralize the team's setup.",
    support: "Create an APM package, add your team's agents, skills and MCP configuration, then tag a version.",
    goal: "Separate package authoring from consumption: initialize, add team-owned definitions and record a local Git version without claiming publication.",
    lang: "en",
    durationMin: 2,
  },
  {
    id: 6,
    title: "Use the team's version in your project.",
    support: "Declare the repository in apm.yml. Install the shared setup for Claude and Copilot.",
    goal: "Start with only the consumer manifest. Install the versioned package and inspect deployed files, lockfile and CI without showing the producer source tree.",
    lang: "en",
    durationMin: 3,
  },
  {
    id: 7,
    title: "Configuración válida no significa reembolso correcto.",
    support:
      "Configurar → validar → aprobar. Dos solicitudes deben crear un solo reembolso. Después, evalúa los cambios del agente y revisa el código.",
    goal: "Cerrar PAY-142 con una comprobación local ejecutable; explicar evaluaciones, revisión humana y adopción.",
    durationMin: 4,
  },
];

export const TOTAL_DURATION_MIN: number = scenes.reduce((sum, s) => sum + s.durationMin, 0);
