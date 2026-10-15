# El contexto del agente también es una dependencia — APM (20 minutos)

Subtítulo: **Entrega de software con IA: agentes, skills y reglas del equipo, versionados e instalados como dependencias.**

Tesis: **El contexto del agente es parte de tu entrega: versiónalo e instálalo como una dependencia más, y que CI lo verifique.**

14 minutos de contenido + 6 minutos para preguntas o imprevistos.

Premisa: con IA, la configuración del agente (agentes, habilidades, instrucciones, MCP) es parte de lo que entregas, igual que una dependencia. Si no está versionada y validada, la entrega no es reproducible: una persona nueva clona el repo y su agente no trabaja como el equipo; dos personas con configuraciones distintas entregan cosas distintas por el mismo pipeline. APM declara, versiona, bloquea y comprueba en CI esa configuración. No promete que el modelo sea determinista ni que el código resultante sea correcto. No hay historia de ticket: los ejemplos (regla de idempotencia, agente `refund-reviewer`, habilidad `check-refund`) son ilustraciones de convenciones del equipo.

La narrativa y los controles de las diapositivas están en español; la demo (diapositivas 5 y 6), los ejemplos de código, las rutas y la salida grabada de la CLI se conservan en inglés. Las notas coinciden con los controles visibles.

| Diapositiva | Qué debe llevarse la audiencia | Duración | Acumulado |
| --- | --- | --- | --- |
| 1 | Portada: título y subtítulo de la charla | 0:00 (se presenta dentro del tiempo de la 2) | 0:00 |
| 2 | Entregamos con agentes, pero su configuración no pasa por el pipeline | 2:00 | 2:00 |
| 3 | Mismo pipeline, dos configuraciones de agente: lo que se entrega depende de la laptop | 2:00 | 4:00 |
| 4 | La configuración del agente como dependencia: declarada, versionada y bloqueada | 2:00 | 6:00 |
| 5 | Crear y versionar el paquete central del equipo (demo) | 2:00 | 8:00 |
| 6 | Consumir esa versión, bloquearla y dejar que CI valide, incluido un fallo (demo) | 4:00 | 12:00 |
| 7 | El pipeline de entrega: APM cubre la configuración, el equipo el resto; cómo empezar | 2:00 | 14:00 |
| — | Preguntas / margen | 6:00 | 20:00 |

Controles: flechas / Espacio para avanzar; 1–7 para saltar; **5** abre creación, **6** o **P** abre consumo; F alterna pantalla completa. Espacio e Intro activan el botón enfocado en vez de cambiar de diapositiva. Haz clic en el fondo antes de avanzar con Espacio. Los objetivos y tiempos de cada escena son información del presentador, no texto visible.

## Honestidad: dilo una vez, de viva voz

Al abrir la diapositiva 3, di una sola vez: «Las configuraciones de Alice y Bob son ejemplos inventados, no una medición de modelos ni de herramientas. La misma configuración puede producir resultados distintos. Compartir archivos reduce diferencias de preparación; no garantiza código idéntico». No repitas esta advertencia en cada diapositiva; la pantalla afirma lo que muestra.

## Qué demuestra cada parte

- Diapositivas 2–3: escenarios ilustrativos y ejemplos de configuración. No son ejecuciones medidas de agentes ni una comparación de herramientas.
- Diapositiva 4: la promesa. La configuración del agente se trata como una dependencia: el equipo es dueño de las definiciones y publica una versión; el `apm.yml` consumidor declara `northstar-engineering/payments-team#v1.0.0`. El archivo de bloqueo y la auditoría en CI no se explican aquí: los muestra la diapositiva 6.
- Diapositiva 5: inicialización real con Git y `apm init --yes`, archivos escritos por el equipo y versionado Git real. APM no genera las definiciones del revisor ni de la habilidad.
- Diapositiva 6: instalación real de esa misma versión con `apm-cli` 0.33.0. Una regla `insteadOf` aislada dirige la identidad ilustrativa de GitHub al repositorio local. No hay publicación ni descarga de esa organización en GitHub; no se ejecutó ningún modelo, servidor MCP ni proveedor de pagos.
- Diapositiva 7: cierre sin demo ejecutable. El pipeline de entrega en tres pasos (configuración, validación, revisión y publicación) y los pasos de adopción.

## Diapositiva 1 — Portada (sin tiempo propio)

Pantalla completa, solo título y subtítulo. Di en unos 15 segundos: «Hoy hablamos de entrega de software con IA, y de una dependencia que casi nadie versiona: la configuración del agente». Preséntate si quieres y avanza con Espacio. Esos segundos salen de los 2:00 de la diapositiva 2; no cambian el total de 14 minutos.

## Diapositiva 2 — Entregamos con agentes, pero su configuración no pasa por el pipeline (2:00)

Pantalla completa. La terminal se anima automáticamente; **Saltar animación** muestra todo el contenido. Las líneas permanecen visibles.

- **0:00–0:35:** «Entregamos con agentes. El código tiene su lockfile y su CI; la configuración del agente, no. Una persona llega al equipo, clona el repositorio, instala las dependencias y ejecuta las pruebas. Todo funciona. Ahora le pide algo a su agente». Abre con la incorporación, sin nombrar todavía la herramienta.
- **0:35–1:15:** Señala las observaciones en rojo: el agente no conoce la convención `Result<T,E>`, no tiene el procedimiento de pruebas del equipo y no está conectado a sus herramientas. Son escenarios inventados, no una ejecución real de un modelo. Relaciona cada observación con una pieza (instrucciones, habilidad, MCP) sin desarrollar aún cada tecnología.
- **1:15–1:40:** «Hoy esa configuración no se versiona ni se valida: cada persona la reconstruye a mano, copia archivos, usa versiones distintas y repite decisiones en la revisión».
- **1:40–2:00:** Pregunta final: «¿Cómo compartimos y versionamos la configuración sin reconstruirla a mano para cada persona?».

Precisión: usa `npm ci` como analogía de instalación bloqueada. No afirmes que `npm install` siempre instala código idéntico ni que todo el comportamiento del agente queda registrado en un archivo de bloqueo.

## Diapositiva 3 — Mismo pipeline, dos configuraciones de agente distintas (2:00)

Es la premisa central. Ambos ejemplos usan Claude Code. Son configuraciones inventadas, no un experimento controlado; esta comparación no aísla los efectos del modelo, las instrucciones o el entorno.

- **0:00–0:35:** Alice: `CLAUDE.md` con la convención actual, un procedimiento de pruebas y una conexión MCP, todo en el repositorio. El acceso a la documentación sigue requiriendo autorización personal.
- **0:35–1:00:** Selecciona Bob. Sus reglas locales se copiaron de otro proyecto; no hay procedimiento compartido ni conexión MCP.
- **1:00–1:35:** Pulsa **Comparar configuraciones**. «Dos personas, el mismo repositorio, el mismo pipeline y el mismo agente, con reglas, habilidades y MCP distintos. Lo que se entrega depende de qué laptop lo produjo, y quien revise a Bob deberá reconstruir lo que falta». **Volver a las configuraciones** recupera el selector.
- **1:35–2:00:** Los tres costes: repetir decisiones, omitir procedimientos e incorporar personas a mano. «Si la configuración es parte de la entrega, debe vivir en un solo lugar, con una versión, como cualquier dependencia».

No afirmes que la falta de MCP impide cualquier otra forma de consultar la documentación. No conviertas la comparación en un juicio sobre herramientas.

## Diapositiva 4 — El contexto del agente, tratado como dependencia (2:00)

Solo la promesa. El archivo de bloqueo y la auditoría en CI se demuestran en la diapositiva 6; no los adelantes.

Presenta la herramienta después del problema: «Para tratar estos archivos como dependencias (declaradas en `apm.yml`, versionadas por el equipo y bloqueadas en `apm.lock.yaml`) usamos APM: Agent Package Manager. No escribe el agente del equipo por nosotros. Los archivos son nuestros; APM permite empaquetarlos, versionarlos e instalarlos».

- **0:00–0:50:** Fila del manifiesto. «El equipo es dueño de las definiciones: agentes, habilidades, reglas y MCP, en archivos reales dentro de `.apm/`. Publica una versión. Cada proyecto declara en su `apm.yml` cuál usa. Son dos manifiestos: lo que publica el equipo y lo que usa este proyecto».
- **0:50–1:30:** Fila de instalación. «`apm install` copia las definiciones de esa versión a los clientes del proyecto. Una persona nueva parte de la misma configuración que el resto».
- **1:30–2:00:** «El proyecto no reescribe los agentes ni las habilidades: elige una versión. El nombre de organización es ilustrativo; la grabación usa un Git local con una etiqueta, no una publicación en GitHub».

La analogía con npm es secundaria. **Ejemplo técnico y límites** muestra el manifiesto consumidor: referencia al repositorio, no definiciones incrustadas.

## Diapositiva 5 — Crear el repositorio central del equipo (2:00)

Abre con **4**. El explorador muestra únicamente la carpeta vacía `payments-team/`. «Primero estamos del lado del equipo que mantiene la configuración; todavía no somos el proyecto que la consume». El explorador permanece a la izquierda y los archivos o comandos a la derecha.

### 0:00–0:35 — Inicializar el paquete

Pulsa **Initialize package**. Se reproduce la salida real de `git init --initial-branch=main && apm init --yes`. Solo al terminar aparece el `apm.yml` generado.

«APM creó el manifiesto. Todavía no escribió nuestro agente ni nuestra habilidad». Puedes abrir **File view** para mostrar el manifiesto inicial con dependencias vacías y metadatos de inicialización.

### 0:35–1:25 — Añadir lo que pertenece al equipo

Pulsa **Add team files**. Esta acción representa autoría: añade los archivos del ejemplo, no ejecuta un comando APM que los genere. El manifiesto inicial se sustituye por la configuración final del paquete.

- Abre el revisor de `.apm/agents/` y di de viva voz: «Un subagente es un especialista con su propio contexto al que el agente principal puede delegar». Después: nombre, alcance y evidencia esperada para cambios de reembolsos. Sus instrucciones no imponen permisos de solo lectura. El texto grabado menciona PAY-142; es contenido de ejemplo de la grabación, no una historia de la charla: léelo como una convención del equipo.
- Abre `SKILL.md` en `.apm/skills/check-refund/`: el procedimiento del equipo comprueba que un reintento no cree otro reembolso.
- Señala `.apm/instructions/refunds.instructions.md` como reglas acordadas.
- Abre `apm.yml`: identidad y versión del paquete, más su declaración MCP documental Microsoft Learn. Se comparte configuración, no credenciales ni una conexión ejecutada.

Elige uno o dos fragmentos para explicar; no leas todos los archivos. «Estos originales se revisan y mantienen una sola vez en el repositorio central».

### 1:25–2:00 — Versionar para consumir

Pulsa **Version package**. La grabación real crea el commit, la etiqueta `v1.0.0` y muestra el commit resuelto.

«Ya tenemos una versión del paquete. En la siguiente pantalla otro proyecto elegirá esta referencia, sin copiar definiciones a mano». La etiqueta es local: no se hizo `push` ni se publicó un repositorio en GitHub. El alias aislado de la grabación permite consumir este mismo Git desde la referencia ilustrativa.

**Reset repository** vuelve al repositorio vacío, incluso durante la reproducción. **Skip typing** completa la salida. La siguiente diapositiva no incorpora este árbol fuente dentro del proyecto consumidor.

## Diapositiva 6 — Usar la versión del equipo y dejar que CI la valide (4:00)

Abre con **5** o **P**. Esta pantalla muestra solo `payments-service/`, no el repositorio productor. Empieza únicamente con su `apm.yml`, sin agentes, habilidades, MCP ni archivo de bloqueo instalados.

### 0:00–0:30 — Declarar qué utilizamos

Señala `northstar-engineering/payments-team#v1.0.0` y `targets: [copilot, claude]`. «El proyecto elige la versión y los clientes; no redefine el revisor ni el procedimiento que acabamos de ver».

### 0:30–1:15 — Instalar y ver aparecer el resultado

Pulsa **Install**. El comando real es `apm install`. Durante la reproducción solo se ve el manifiesto; al terminar se pueblan el explorador y el archivo de bloqueo.

Abre una copia del agente o de la habilidad. Copilot recibe agentes en `.github/agents/` y habilidades en `.agents/skills/`; Claude utiliza `.claude/agents/` y `.claude/skills/`. Son los destinos reales de APM 0.33.0, no una distribución inventada por el visor.

Muestra `.mcp.json` y `.github/mcp.json` si hace falta aclarar el resultado MCP: son configuraciones escritas realmente para Claude Code y Copilot CLI. El servidor Microsoft Learn es público y no requiere autenticación; no fue invocado.

**Límite de confianza MCP (nota para el presentador, no para la pantalla):** APM confía en la configuración MCP de una dependencia directa; `--trust-transitive-mcp` amplía ese alcance a dependencias indirectas y no hace falta aquí. La aprobación del cliente y las credenciales de servicios privados son cuestiones separadas y personales. Revisa el MCP compartido antes de instalar. Referencia: [MCP compartido y límite de confianza](https://microsoft.github.io/apm/producer/author-primitives/mcp-as-primitive/#direct-vs-transitive-the-trust-boundary).

El árbol solo muestra archivos desplegados relevantes: no repite el manifiesto ni las fuentes del productor. El paquete descargado existe en `apm_modules/` en la instalación real; esa caché no se expande en esta vista.

### 1:15–1:45 — Inspeccionar qué versión llegó

Pulsa **Inspect Lockfile**. Señala `resolved_ref: v1.0.0`, `resolved_commit` y `deployed_file_hashes`. El commit coincide con el mostrado al versionar el productor.

«No solo sabemos qué versión pedimos; podemos inspeccionar qué revisión y contenido quedaron instalados». Eso no demuestra que un agente haya seguido sus instrucciones.

### 1:45–2:15 — Validar la instalación correcta

Pulsa **Run CI checks**. Reproduce `apm audit --ci` sobre la configuración instalada, con diez comprobaciones aprobadas y código 0. No edita el manifiesto ni introduce un fallo.

«Pedimos la versión del equipo, instalamos sus archivos y comprobamos que la configuración desplegada coincide con el manifiesto y el lockfile. Esta instalación pasa la validación».

No leas cada fila. Es una grabación del comando local, no una ejecución de un pipeline remoto. Convertir esa comprobación en un requisito del pipeline corresponde al equipo.

«Hasta aquí, el camino feliz. Ahora veamos qué pasa cuando alguien rompe la entrega».

### 2:15–2:40 — Un cambio incompleto

Pulsa **Add dependency without installing** (disponible tras la validación exitosa). Se abre `apm.yml` con `northstar-engineering/uninstalled-team#v1.0.0` resaltado; el lockfile no cambia y todavía no se repite CI.

«Alguien declara otro paquete, pero no lo instala ni actualiza su registro. Es el equivalente a editar `package.json` y olvidar el lockfile».

### 2:40–3:20 — CI lo rechaza

Pulsa **Run CI checks**. Se reproducen los rechazos reales de `apm audit --ci` y `apm install --frozen`, ambos con código 1. «Si esta comprobación es obligatoria en el pipeline, ese cambio incompleto no pasa. La configuración del agente tiene su propia puerta de entrada».

### 3:20–3:50 — Corregir y volver a verde

Pulsa **Fix manifest & re-run CI**: elimina la línea añadida y vuelve a las diez comprobaciones aprobadas. Esta recuperación deshace el ejemplo: no instala el repositorio ficticio ni demuestra cómo incorporar un paquete nuevo. Para añadir una dependencia real, se edita `apm.yml`, se ejecuta `apm install`, se revisan los cambios y se versionan manifiesto y lockfile.

### 3:50–4:00 — Cerrar

«Las definiciones se mantienen en un repositorio central; cada proyecto elige una versión, la bloquea y CI comprueba la consistencia. Validar el software que produce el agente es otro trabajo, y es el tema de la última diapositiva».

**Reset Demo** elimina archivos instalados, pestañas y salida; deja solo el manifiesto consumidor original. También funciona durante Install. La inspección de archivos conserva el explorador a la izquierda; **Skip typing** termina la reproducción. No abras la pantalla productora para explicar un archivo instalado: los roles ya están separados.

### Análisis Unicode opcional — Respaldo, fuera del recorrido principal

Después de **Inspect Lockfile**, **Backup: Unicode scan and scope limits → Scan hidden Unicode** reproduce una auditoría real de un archivo deliberado, con U+200B/U+202E visibles. No detecta la semántica de una inyección de instrucciones.

La advertencia de políticas de organización omitidas es real: el consumidor no tiene remoto y no se ejercitaron políticas remotas. Tampoco se probó conexión o aprobación del cliente MCP. Si falta tiempo, omite esta alternativa, no la separación entre creación y consumo.

Vuelve a grabar después de editar las definiciones o actualizar APM: `scripts/README.md`. La siguiente diapositiva cierra: qué resuelve APM y qué no.

## Diapositiva 7 — El contexto del agente es parte de tu entrega (2:00)

Cierre breve, sin demo ejecutable. Vista inicial **Pipeline de entrega**: tres pasos, con una etiqueta que indica quién es dueño de cada uno.

- **0:00–0:50:** *Paso 1, Configuración (APM):* instala la configuración revisada del agente y `apm audit --ci` comprueba que manifiesto y `apm.lock.yaml` coinciden. «Esto es lo que acabamos de ver fallar y pasar».
- **0:50–1:15:** *Pasos 2 y 3 (equipo):* pruebas del producto y evaluaciones del agente; revisión humana, compilación y controles de publicación. «APM cubre el primer paso. El resto sigue siendo nuestro: no hace determinista al modelo ni valida el código que produce. Las huellas del lockfile verifican integridad, no seguridad ni corrección».
- **1:15–1:45:** Pulsa **Cómo empezar**. Usa un repositorio de prueba, Python 3.10+ y, preferiblemente, un entorno virtual:

```sh
pip install apm-cli==0.33.0
apm init   # crea apm.yml
# First declare the team's Git repository/version and targets in apm.yml.
apm install
apm audit --ci   # add it as a required CI check
```

  Declara en `apm.yml` el repositorio Git real y la versión revisada de tu equipo, con `targets: [claude, copilot]`. No uses el nombre ilustrativo de la organización como si fuera un repositorio publicado. Versiona `apm.yml` y `apm.lock.yaml`; revisa advertencias antes de confiar, y añade `apm audit --ci` como comprobación obligatoria en CI. El enlace abre la documentación de APM 0.33.0. Para adoptarlo en serio, sustituye las definiciones didácticas por las convenciones reales y publica una etiqueta o commit accesible a los consumidores. Si preguntan por MCP, remite a la nota de confianza de la diapositiva 6.
- **1:45–2:00:** Cierra con la frase: «El próximo dev clona el repo y su agente ya trabaja como el equipo». Deja la diapositiva visible para preguntas. No se muestra un QR provisional.

## Preguntas / margen (6:00)

Si falta tiempo, omite el análisis Unicode y muestra solo una copia instalada en la diapositiva 6 (el fallo de CI es parte del recorrido principal: abrevia la inspección de archivos antes que omitirlo); conserva la separación entre creación y consumo. Los 14 minutos son un objetivo de contenido, no un ensayo humano cronometrado.
