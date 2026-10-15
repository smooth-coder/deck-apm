# APM: validación vigente de la presentación

La demo representa una organización con un repositorio central de agentes, habilidades, reglas y configuración MCP. El proyecto consumidor declara una referencia Git en `apm.yml`, no las definiciones de esos componentes. Esta grabación con `apm-cli` 0.33.0 sustituye la anterior instalación por ruta local; las secciones históricas de [`apm-research.md`](apm-research.md) no describen el estado actual de la demo.

## Propiedad y consumo

- `examples/payments-team`: repositorio central del ejemplo. Contiene `.apm/agents/refund-reviewer.agent.md`, `.apm/skills/check-refund/SKILL.md`, `.apm/instructions/refunds.instructions.md` y su propio manifiesto con `dependencies.mcp`.
- `examples/payments-service/apm.yml`: consumidor mínimo. Declara nombre, versión, clientes y `northstar-engineering/payments-team#v1.0.0` como dependencia. No contiene instrucciones del agente, procedimientos ni detalles de conexión MCP.
- Pantalla 5: el productor empieza vacío; tras Git y `apm init` aparece su manifiesto inicial. Add team files añade las definiciones del equipo y su manifiesto final; Version package reproduce commit y etiqueta reales. Reset repository devuelve el estado vacío.
- Pantalla 6: el consumidor empieza únicamente con `payments-service/apm.yml` y conserva ese estado durante Install. Al finalizar muestra solo archivos desplegados, su manifiesto y lockfile. No añade el árbol fuente `payments-team/` ni un segundo manifiesto. La caché real `apm_modules/` no se expande en esta vista filtrada.
- El recorrido principal es **Install → Inspect Lockfile → Run CI checks** y termina con la auditoría limpia: diez comprobaciones aprobadas, sin mutaciones del manifiesto. El fallo queda dentro de **Optional: show an incomplete dependency change**, cerrado inicialmente. Tras el éxito, **Add dependency without installing** abre y resalta una edición deliberada de `apm.yml`; no modifica el lockfile ni ejecuta comandos. Otro clic en **Run CI checks** reproduce el rechazo. La recuperación elimina la línea añadida y vuelve a ejecutar la auditoría.

La organización es ilustrativa. El grabador crea un Git local real y la etiqueta `v1.0.0`; una regla `insteadOf` aislada dirige la identidad GitHub de ejemplo a ese Git. No se publicó ni descargó un repositorio de esa organización en GitHub. No se presenta una dependencia `source: local` como si fuera una instalación Git.

## Comandos reales ejercitados

| Operación | Resultado observado |
| --- | --- |
| Productor: Git init + `apm init --yes` | Código 0; manifiesto inicial capturado, sin definiciones del equipo |
| Productor: añadir originales del ejemplo | Autoría del equipo, no salida generada por APM |
| Productor: Git commit + tag `v1.0.0` + rev-parse | Código 0; cuatro archivos y el mismo commit que registra el consumidor |
| `apm install`, con la referencia Git ya declarada | Código 0; una dependencia instalada para Claude y Copilot |
| Agente | Un revisor original desplegado en `.claude/agents/` y `.github/agents/` |
| Reglas | Copias en `.claude/rules/` y `.github/instructions/`; conversión real de metadatos para Claude |
| Habilidad | `check-refund` instalado en `.agents/skills/` y `.claude/skills/` |
| MCP | Configuración escrita en `.mcp.json` y `.github/mcp.json` |
| Archivo de bloqueo | Referencia Git, commit resuelto, seis huellas de archivos, configuración MCP y sus destinos |
| `apm deps list`, `apm audit`, CI limpio | Código 0 |
| Añadir `northstar-engineering/uninstalled-team#v1.0.0` sin instalar | `apm audit --ci` y `apm install --frozen`: código 1 |
| Restaurar el manifiesto consumidor | CI: código 0, diez comprobaciones aprobadas |
| Archivo deliberado con caracteres ocultos | Dos hallazgos; auditoría del archivo: código 1 |

El commit capturado en `resolved_commit` es `a8de87fb7a2791683f5ece4ec15ad5e94452c48b`. Corresponde al Git local de la demostración, no a una publicación remota. El archivo de bloqueo también contiene `mcp_configs`, `mcp_target_servers` y `mcp_config_provenance`; los JSON de los clientes no forman parte de las seis huellas de archivos desplegados.

`scripts/record.sh` prepara la sesión aislada, inicializa el productor, incorpora las definiciones, versiona e instala ese mismo paquete en el consumidor. `scripts/gen_recorded.py` exige éxitos de inicialización y versionado, los códigos del recorrido consumidor y la igualdad del commit antes de generar `src/playground/recorded.ts`. Se capturan el manifiesto inicial, originales finales, salidas Git/APM y bytes instalados, incluidos los JSON MCP. El grabador elimina su directorio temporal al terminar.

## MCP: configuración, confianza y ejecución son cosas distintas

El manifiesto central declara `microsoft-learn`, con `registry: false`, `transport: http` y `https://learn.microsoft.com/api/mcp`. Es un servidor documental público sin autenticación. Esta sesión solo materializó la configuración: no se conectó al servidor, no invocó herramientas y no ejecutó un modelo.

APM confía en un MCP propio de una dependencia **directa**. El comando de esta demo es `apm install`, sin `--trust-transitive-mcp`. Ese indicador amplía la confianza al MCP propio de dependencias **indirectas**; no es un requisito de este caso. Instalar la configuración no demuestra aprobación del cliente ni proporciona autorización o credenciales para servidores privados.

Fuentes primarias:
- [APM: MCP compartido y límite entre dependencia directa e indirecta](https://microsoft.github.io/apm/producer/author-primitives/mcp-as-primitive/#direct-vs-transitive-the-trust-boundary).
- [Microsoft Learn MCP: configuración y autenticación](https://learn.microsoft.com/en-us/training/support/mcp).

Los documentos vivos pueden evolucionar; los archivos y resultados de la demo proceden de la CLI fijada en 0.33.0.

## Presentación y límites

- Narrativa y controles externos a los ejemplos en español; demo, código, rutas y salida CLI en inglés. Idioma raíz `es`; los títulos de las diapositivas 5 y 6 están en español y no llevan `lang="en"`. El contenido de la demo (CLI, código, rutas) permanece en inglés.
- La apertura plantea la configuración dispersa y la preparación manual del agente, no el nombre de la herramienta. No hay una historia de ticket: los ejemplos son convenciones del equipo, sin promesa de que APM evite errores del agente. APM se introduce con su nombre completo en la diapositiva 4.
- Explorador a la izquierda y archivo o terminal a la derecha, también a 390 px de ancho. Seleccionar un archivo abre su vista automáticamente.
- Sin instrucciones iniciales de relleno ni panel explicativo. Solo una acción completada muestra un resultado breve; el detalle se explica desde [`talk-script.md`](talk-script.md).
- Gestionar el repositorio significa revisar definiciones, versionar y actualizar consumidores de forma intencional. No se ejercitaron publicación remota ni autenticación privada.
- Disponer de una configuración no demuestra que el modelo la siga o invoque una habilidad o agente. El texto del revisor no impone permisos de solo lectura.
- Las huellas verifican integridad frente a una referencia, no seguridad o corrección. El análisis Unicode no detecta la semántica de una inyección de instrucciones.
- Se conserva la advertencia real de políticas de organización omitidas: el consumidor no tiene remoto. No se validaron políticas remotas ni aislamiento de ejecución.
- La comprobación de reembolsos de la diapositiva 7 es independiente: ejemplo local en memoria, no evaluación de agentes, endpoint HTTP ni integración con pagos.

## Verificación integrada

En navegador se recorrió la pantalla productora: vacío → init sin archivos anticipados → manifiesto generado → cuatro archivos authored → versión Git local. La pantalla consumidora, accesible con P, comenzó solo con su manifiesto; tras Install aparecieron exclusivamente los archivos desplegados. Se verificaron el mismo commit, fallo de CI, recuperación con diez comprobaciones y reinicio limpio. No se mezclaron fuentes del productor en la vista de consumo.

En escritorio (1280×720) y móvil (390×844) se ejercitó primero el recorrido limpio: Install → Inspect Lockfile → Run CI checks, con diez comprobaciones aprobadas y sin abrir la sección de fallo ni añadir su dependencia. Después se abrió el ejemplo opcional: edición visible → rechazo → recuperación. En escritorio se comprobó que la edición conservaba exactamente el contenido anterior del lockfile. Reset dejó solo el manifiesto original; también se comprobó durante Install. La rama Unicode pudo volver a CI limpio. No hubo errores de navegador ni desbordamiento horizontal de la página; el explorador sigue a la izquierda.

Se revisó la narrativa española a 1280×720 y su adaptación a 390×844, sin desbordamiento horizontal de la página. En móvil, explorador y visor conservaron la misma coordenada vertical y columnas separadas; los archivos largos permiten desplazamiento dentro de sus paneles. (Histórico: una versión anterior de la diapositiva 7 incluía una comprobación local de reembolsos; se eliminó.)

La apertura centrada en el problema se inspeccionó a 1280×720 y 390×844: título, texto de apoyo, pregunta final y terminal ilustrativa visibles, sin desbordamiento horizontal de la página. Se ejercitaron Repetir y Saltar animación. (Histórico: una escena intermedia que nombraba las piezas se eliminó.) La escena 4 introduce Agent Package Manager con su función concreta. No se observaron errores de navegador.

`bun --bun run build` completó TypeScript y Vite. No se agregaron pruebas ni se ejecutó la suite, conforme al foco solicitado en la demo funcional.

Se mantienen 14 minutos de contenido y seis para preguntas. No es un ensayo humano cronometrado. No se muestra un QR provisional.
