# Entrega de software con IA — APM (20 minutos)

Tesis: **Versiona la configuración. Valida el resultado. Revisa antes de publicar.**

17 minutos de contenido + 3 minutos para preguntas o imprevistos. Es una charla sobre entrega de software que utiliza APM como herramienta, no una promesa de que gestionar paquetes vuelve determinista al modelo. La narrativa y los controles de las diapositivas están en español; la demo, los ejemplos de código, las rutas y la salida grabada de la CLI se conservan en inglés. Las notas coinciden con los controles visibles.

| Diapositiva | Qué debe llevarse la audiencia | Duración | Acumulado |
| --- | --- | --- | --- |
| 1 | Entrega con IA y APM: definir, versionar y compartir la configuración del equipo | 2:00 | 2:00 |
| 2 | Compartir configuración reduce diferencias de preparación, no la variabilidad del modelo | 2:00 | 4:00 |
| 3 | Reglas, procedimientos y acceso a herramientas cumplen funciones distintas | 2:00 | 6:00 |
| 4 | El equipo mantiene sus definiciones; APM evita distribuirlas a mano | 2:00 | 8:00 |
| 5 | Crear y versionar el repositorio central del equipo | 2:00 | 10:00 |
| 6 | Consumir esa versión desde un proyecto limpio | 3:00 | 13:00 |
| 7 | Validar PAY-142, evaluar cambios del agente, revisar y adoptar | 4:00 | 17:00 |
| — | Preguntas / margen | 3:00 | 20:00 |

Controles: flechas / Espacio para avanzar; 1–7 para saltar; **5** abre creación, **6** o **P** abre consumo; F alterna pantalla completa. Espacio e Intro activan el botón enfocado en vez de cambiar de diapositiva. Haz clic en el fondo antes de avanzar con Espacio. Los objetivos y tiempos de cada escena son información del presentador, no texto visible.

## Qué demuestra cada parte

- Diapositivas 1–3: historia ilustrativa sobre reembolsos y ejemplos de configuración. No son ejecuciones medidas de agentes ni una comparación de herramientas.
- Diapositiva 4: el `apm.yml` consumidor declara el repositorio Git `northstar-engineering/payments-team#v1.0.0`. Las definiciones están en el repositorio central: archivos `.apm/` para agentes, habilidades y reglas; `dependencies.mcp` en su propio manifiesto para MCP.
- Diapositiva 5: inicialización real con Git y `apm init --yes`, archivos escritos por el equipo y versionado Git real. APM no genera las definiciones del revisor ni de la habilidad.
- Diapositiva 6: instalación real de esa misma versión con `apm-cli` 0.33.0. Una regla `insteadOf` aislada dirige la identidad ilustrativa de GitHub al repositorio local. No hay publicación ni descarga de esa organización en GitHub; no se ejecutó ningún modelo, servidor MCP ni proveedor de pagos.
- Diapositiva 7: registro local ejecutable en TypeScript, implementado en `src/lib/refundExample.ts`. Corre en el navegador, no fue generado por un agente y no llama a un proveedor de pagos. Es un ejemplo didáctico, no un servicio de producción ni un ejecutor de evaluaciones de agentes.

No presentar estas evidencias distintas como una entrega completa realizada con éxito por un agente.

## Diapositiva 1 — Tema y resultado concreto (2:00)

Antes de empezar: diapositiva 1, pantalla completa. La terminal se anima automáticamente; **Saltar animación** muestra todo el contenido. Las líneas permanecen visibles.

- **0:00–0:25:** «El tema de hoy es la entrega de software con IA y APM: cómo un equipo define, versiona y comparte sus propios agentes, habilidades y reglas. Veremos esas definiciones instaladas en Claude y Copilot. APM significa Agent Package Manager; validar el software producido es otra responsabilidad».
- **0:25–0:55:** «PAY-142 pide un endpoint de reembolso. Un reintento no debe reembolsar dos veces el mismo pago. Esta terminal es un escenario de revisión inventado, no una ejecución real de un modelo». Señala la comprobación de idempotencia, la convención de errores y el acceso al ticket que faltan.
- **0:55–1:30:** Relaciona cada problema con la configuración ausente. «Un archivo de instrucciones expresa la convención. Una habilidad describe la prueba de solicitudes duplicadas. MCP puede conectar el gestor de tickets. Proporcionar esos archivos no demuestra que el agente los haya utilizado». No leas todas las rutas.
- **1:30–2:00:** «Hay dos responsabilidades: versionar la configuración y validar el reembolso de forma independiente. Al final volveremos a este mismo criterio de reintentos».

Precisión: utiliza `npm ci` como analogía de instalación bloqueada. No afirmes que `npm install` siempre instala código idéntico ni que todo el comportamiento del agente queda registrado en un archivo de bloqueo.

## Diapositiva 2 — Dos configuraciones, no herramientas rivales (2:00)

Ambos ejemplos usan Claude Code. Son configuraciones inventadas, no un experimento controlado. La misma configuración puede producir resultados distintos; esta comparación no aísla los efectos del modelo, las instrucciones o el entorno de ejecución.

- **0:00–0:35:** Alice: las instrucciones actuales, el procedimiento de solicitudes duplicadas y la conexión al gestor de tickets se pueden revisar en el repositorio. El acceso al gestor sigue requiriendo autorización personal.
- **0:35–1:00:** Selecciona Bob. Sus reglas locales se copiaron de otro proyecto; no hay procedimiento compartido para reintentos ni configuración del gestor de tickets.
- **1:00–1:35:** Pulsa **Comparar riesgos**. «Comparamos configuración disponible y riesgos de revisión, no cambios generados. Alice sigue necesitando pruebas. Quien revise a Bob deberá reconstruir reglas y criterios de aceptación ausentes». **Volver a las configuraciones** recupera el selector.
- **1:35–2:00:** Menciona solo los tres costes: repetir decisiones durante la revisión, omitir comprobaciones e incorporar personas a mano. «Compartir archivos reduce diferencias de configuración. No garantiza código idéntico».

No afirmes que la falta de MCP impide cualquier otra forma de leer el ticket. No conviertas la comparación en un juicio sobre qué herramienta de programación es mejor.

## Diapositiva 3 — Nombrar las piezas con lenguaje sencillo (2:00)

Utiliza PAY-142 en todos los nodos. Las rutas son ejemplos, principalmente para Claude Code; no representan una estructura universal para todos los clientes.

- **0:00–0:15:** **Agente de IA:** modelo más herramienta. La configuración es una entrada, no todo el entorno de ejecución.
- **0:15–0:45:** **Instrucciones** = reglas: devolver `Result<T,E>` y exigir una clave de idempotencia. Orientar no equivale a imponer.
- **0:45–1:10:** **Procedimientos** = habilidades reutilizables: enviar la misma solicitud dos veces y comprobar un solo reembolso. Estar disponible no significa haberse ejecutado.
- **1:10–1:35:** **MCP**, Model Context Protocol = conexiones a herramientas y datos. El gestor puede exponer PAY-142. Las credenciales, la aprobación y la llamada efectiva siguen siendo cuestiones separadas.
- **1:35–1:45:** **Subagentes** = delegación opcional. Un revisor puede tener contexto propio y permisos de solo lectura. No entrar en una explicación de arquitectura de orquestación.
- **1:45–2:00:** **Contexto del agente:** lo que realmente recibe el modelo durante la ejecución. También importan la versión del modelo, la conversación, los resultados de herramientas seleccionados, los permisos y el estado externo. «APM gestiona la configuración instalada. Las pruebas y evaluaciones validan el comportamiento».

## Diapositiva 4 — El equipo es dueño de las definiciones (2:00)

Empieza con la distinción: «APM no escribe el agente del equipo por nosotros. Los archivos son nuestros. APM permite empaquetarlos, distribuirlos e inspeccionar qué consume cada proyecto».

- **0:00–0:35:** «El equipo de pagos define un revisor de reembolsos, una habilidad para comprobar reintentos y las convenciones de reembolso. Son archivos reales dentro de `.apm/agents/`, `.apm/skills/` y `.apm/instructions/`». Las definiciones no se escriben como texto dentro del manifiesto consumidor.
- **0:35–1:00:** Selecciona la fila del manifiesto. «El paquete tiene nombre y versión propios. Cada proyecto consumidor lo declara en su `apm.yml`. Son dos manifiestos distintos: lo que publica el equipo y lo que utiliza este proyecto».
- **1:00–1:25:** Selecciona la fila de instalación. «APM instala las copias compatibles con Claude y Copilot. El equipo mantiene las definiciones originales en vez de pedir a cada persona que mantenga sus propias copias».
- **1:25–1:45:** Selecciona las filas del archivo de bloqueo y CI. «Revisar el cambio original, versionar el paquete, inspeccionar lo instalado y rechazar diferencias entre manifiesto y archivo de bloqueo: eso es lo que ganamos en gestión».
- **1:45–2:00:** «Cada proyecto declara el repositorio y la versión revisada del equipo; no reescribe sus agentes ni habilidades. Aquí el nombre de organización es ilustrativo: la grabación usa un Git local real con una etiqueta, no una publicación en GitHub».

La analogía con npm sigue visible, pero es secundaria. **Ejemplo técnico y límites** muestra el manifiesto consumidor: referencia al repositorio, no definiciones incrustadas. El archivo de bloqueo registra el commit resuelto y huellas de archivos instalados. Una etiqueta puede cambiar; el commit registrado identifica lo instalado. APM también materializa la configuración MCP declarada por el repositorio central. Confiar en una dependencia directa incluye confiar en su MCP; no equivale a autorización del cliente ni garantiza el comportamiento del modelo.

## Diapositiva 5 — Crear el repositorio central del equipo (2:00)

Abre con **5**. El explorador muestra únicamente la carpeta vacía `payments-team/`. «Primero estamos del lado del equipo que mantiene la configuración; todavía no somos el proyecto que la consume». El explorador permanece a la izquierda y los archivos o comandos a la derecha.

### 0:00–0:35 — Inicializar el paquete

Pulsa **Initialize package**. Se reproduce la salida real de `git init --initial-branch=main && apm init --yes`. Solo al terminar aparece el `apm.yml` generado.

«APM creó el manifiesto. Todavía no escribió nuestro agente ni nuestra habilidad». Puedes abrir **File view** para mostrar el manifiesto inicial con dependencias vacías y metadatos de inicialización.

### 0:35–1:25 — Añadir lo que pertenece al equipo

Pulsa **Add team files**. Esta acción representa autoría: añade los archivos del ejemplo, no ejecuta un comando APM que los genere. El manifiesto inicial se sustituye por la configuración final del paquete.

- Abre el revisor de `.apm/agents/`: nombre, alcance y evidencia esperada para PAY-142. Sus instrucciones no imponen permisos de solo lectura.
- Abre `SKILL.md` en `.apm/skills/check-refund/`: el procedimiento del equipo comprueba que un reintento no cree otro reembolso.
- Señala `.apm/instructions/refunds.instructions.md` como reglas acordadas.
- Abre `apm.yml`: identidad y versión del paquete, más su declaración MCP documental Microsoft Learn. Se comparte configuración, no credenciales ni una conexión ejecutada.

Elige uno o dos fragmentos para explicar; no leas todos los archivos. «Estos originales se revisan y mantienen una sola vez en el repositorio central».

### 1:25–2:00 — Versionar para consumir

Pulsa **Version package**. La grabación real crea el commit, la etiqueta `v1.0.0` y muestra el commit resuelto.

«Ya tenemos una versión del paquete. En la siguiente pantalla otro proyecto elegirá esta referencia, sin copiar definiciones a mano». La etiqueta es local: no se hizo `push` ni se publicó un repositorio en GitHub. El alias aislado de la grabación permite consumir este mismo Git desde la referencia ilustrativa.

**Reset repository** vuelve al repositorio vacío, incluso durante la reproducción. **Skip typing** completa la salida. La siguiente diapositiva no incorpora este árbol fuente dentro del proyecto consumidor.

## Diapositiva 6 — Usar la versión del equipo en un proyecto (3:00)

Abre con **6** o **P**. Esta pantalla muestra solo `payments-service/`, no el repositorio productor. Empieza únicamente con su `apm.yml`, sin agentes, habilidades, MCP ni archivo de bloqueo instalados.

### 0:00–0:30 — Declarar qué utilizamos

Señala `northstar-engineering/payments-team#v1.0.0` y `targets: [copilot, claude]`. «El proyecto elige la versión y los clientes; no redefine el revisor ni el procedimiento que acabamos de ver».

### 0:30–1:15 — Instalar y ver aparecer el resultado

Pulsa **Install**. El comando real es `apm install`. Durante la reproducción solo se ve el manifiesto; al terminar se pueblan el explorador y el archivo de bloqueo.

Abre una copia del agente o de la habilidad. Copilot recibe agentes en `.github/agents/` y habilidades en `.agents/skills/`; Claude utiliza `.claude/agents/` y `.claude/skills/`. Son los destinos reales de APM 0.33.0, no una distribución inventada por el visor.

Muestra `.mcp.json` y `.github/mcp.json` si hace falta aclarar el resultado MCP: son configuraciones escritas realmente para Claude Code y Copilot CLI. El servidor Microsoft Learn es público y no requiere autenticación; no fue invocado. APM confía en el MCP de esta dependencia directa, sin necesitar `--trust-transitive-mcp`.

El árbol solo muestra archivos desplegados relevantes: no repite el manifiesto ni las fuentes del productor. El paquete descargado existe en `apm_modules/` en la instalación real; esa caché no se expande en esta vista.

### 1:15–1:45 — Inspeccionar qué versión llegó

Pulsa **Inspect Lockfile**. Señala `resolved_ref: v1.0.0`, `resolved_commit` y `deployed_file_hashes`. El commit coincide con el mostrado al versionar el productor.

«No solo sabemos qué versión pedimos; podemos inspeccionar qué revisión y contenido quedaron instalados». Eso no demuestra que un agente haya seguido sus instrucciones.

### 1:45–2:30 — Validar la instalación correcta

Pulsa **Run CI checks**. Reproduce `apm audit --ci` sobre la configuración instalada, con diez comprobaciones aprobadas y código 0. No edita el manifiesto ni introduce un fallo.

«Pedimos la versión del equipo, instalamos sus archivos y comprobamos que la configuración desplegada coincide con el manifiesto y el lockfile. Esta instalación pasa la validación».

No leas cada fila. Es una grabación del comando local, no una ejecución de un pipeline remoto. Convertir esa comprobación en un requisito del pipeline corresponde al equipo.

### 2:30–3:00 — Explicar qué ganamos y cerrar

«Las definiciones se mantienen en un repositorio central; cada proyecto elige una versión, instala lo necesario para sus clientes y comprueba la consistencia. Todavía falta validar el software producido».

Para añadir una dependencia real, se edita `apm.yml`, se ejecuta `apm install`, se revisan los cambios y se versionan manifiesto y lockfile. Editar el manifiesto es correcto; omitir la instalación deja el cambio incompleto. No muestres ese fallo en el recorrido principal.

**Reset Demo** elimina archivos instalados, pestañas y salida; deja solo el manifiesto consumidor original. También funciona durante Install. La inspección de archivos conserva el explorador a la izquierda; **Skip typing** termina la reproducción. No abras la pantalla productora para explicar un archivo instalado: los roles ya están separados.

### Fallo opcional — Solo después del éxito, fuera de los tres minutos

Abre **Optional: show an incomplete dependency change** y pulsa **Add dependency without installing**, disponible tras la validación exitosa. Se abre `apm.yml` con `northstar-engineering/uninstalled-team#v1.0.0` resaltado; el lockfile no cambia y todavía no se repite CI.

«Provocamos un cambio incompleto: declaramos otro paquete, pero no lo instalamos ni actualizamos su registro».

Pulsa **Run CI checks**. Ahora se reproducen los rechazos reales de `apm audit --ci` y `apm install --frozen`, ambos con código 1. «Si esta comprobación es obligatoria en el pipeline, ese cambio incompleto no pasa».

Pulsa **Fix manifest & re-run CI** para eliminar la línea añadida y volver a las diez comprobaciones aprobadas. Esta recuperación deshace el ejemplo: no instala el repositorio ficticio ni demuestra cómo incorporar un paquete nuevo.

### Análisis Unicode opcional — Fuera de los tres minutos

Después de **Inspect Lockfile**, **Backup: Unicode scan and scope limits → Scan hidden Unicode** reproduce una auditoría real de un archivo deliberado, con U+200B/U+202E visibles. No detecta la semántica de una inyección de instrucciones.

La advertencia de políticas de organización omitidas es real: el consumidor no tiene remoto y no se ejercitaron políticas remotas. Tampoco se probó conexión o aprobación del cliente MCP. Si falta tiempo, omite esta alternativa, no la separación entre creación y consumo.

Vuelve a grabar después de editar las definiciones o actualizar APM: `scripts/README.md`. La siguiente diapositiva vuelve a PAY-142: dos solicitudes deben crear un solo reembolso.

## Diapositiva 7 — Demostrar un resultado y decidir cómo adoptar (4:00)

Las tres filas numeradas representan responsabilidades, no una ejecución de CI ni resultados aprobados:

1. **Configuración / APM:** instalar archivos revisados y comprobar la consistencia entre manifiesto y archivo de bloqueo.
2. **Validación / equipo:** pruebas del producto y evaluaciones del agente.
3. **Aprobación / equipo:** revisión humana del código, comprobaciones de compilación y pruebas, integración y controles de publicación.

### 0:00–1:15 — Cerrar PAY-142

Vista inicial: **Validar PAY-142**. Explica idempotencia sin jerga: «Un reintento es la misma solicitud que llega otra vez. Debe devolver el reembolso original en vez de registrar uno nuevo».

Pulsa **Run retry check**. Ejecuta `runRefundCheck()` en el navegador: un registro local nuevo recibe dos solicitudes idénticas. La interfaz calcula si ambas devuelven el mismo identificador y si el registro contiene una sola entrada. Lee el resultado observado, sin dar por supuesto un PASS. Repite para mostrar que cada ejecución del ejemplo está aislada.

Límite explícito: es un ejemplo didáctico en memoria, escrito para la presentación, no código generado por un agente ni una integración HTTP o con un proveedor de pagos. No demuestra seguridad ante concurrencia, persistencia tras reinicios ni una implementación de producción. Muestra cómo convertir un criterio de aceptación en una comprobación ejecutable.

### 1:15–2:15 — Las pruebas del producto no son evaluaciones del agente

«Prueba del producto: esta implementación mantiene la propiedad de los reintentos. Evaluación del agente: pedirle que implemente PAY-142 con una configuración registrada y comprobar la implementación producida contra esa misma propiedad».

Fija tarea, instrucciones, modelo y versión, configuración y entradas externas conocidas; ejecuta varias veces y compara con una referencia. Mide fallos de reembolso duplicado en vez de asumir que un cambio con buen aspecto o una generación exitosa demuestran fiabilidad. La presentación no ejecuta una evaluación de agentes ni afirma una mejora medida.

La revisión humana sigue inspeccionando el código. APM no proporciona permisos de ejecución, aislamiento, comprobaciones de compilación ni controles de publicación.

### 2:15–3:35 — Pruébalo el lunes

Pulsa **Pruébalo el lunes**. Utiliza un repositorio de prueba, Python 3.10+ y preferiblemente un entorno virtual. Después de `apm init`, declara en `apm.yml` el repositorio Git real y la versión revisada de tu equipo, y fija `targets: [claude, copilot]`. No uses el nombre ilustrativo de la organización como si fuera un repositorio publicado. El consumidor declara referencias; las definiciones se mantienen en el repositorio central:

```sh
pip install apm-cli==0.33.0
apm init
# First declare the team's Git repository/version and targets in apm.yml.
apm install
apm audit --ci
```

Hazlo en un repositorio de prueba, no de golpe en todos los proyectos del equipo. Revisa advertencias y cambios generados. Versiona `apm.yml`, `apm.lock.yaml` y las reglas previstas; no añadas copias generadas ni secretos sin revisarlos. Incorpora la auditoría como comprobación obligatoria real de CI. El enlace de la diapositiva abre documentación de la versión de APM utilizada.

Para adoptarlo, sustituye las definiciones didácticas por las convenciones reales del equipo. Revisa los cambios originales, versiona el repositorio central y publica una etiqueta o un commit Git accesible a sus consumidores. Cada proyecto elige su referencia. Revisa el MCP compartido antes de instalar: APM confía en el MCP propio de una dependencia directa; `--trust-transitive-mcp` amplía ese alcance a dependencias indirectas y no hace falta aquí. Las aprobaciones del cliente y las credenciales de servicios privados son cuestiones separadas. La grabación no demuestra publicación remota, autenticación privada ni ejecución MCP. Referencia: [MCP compartido y límite de confianza](https://microsoft.github.io/apm/producer/author-primitives/mcp-as-primitive/#direct-vs-transitive-the-trust-boundary).

### 3:35–4:00 — Cierre

«Versiona la configuración. Valida el resultado. Revisa antes de publicar».

Deja la diapositiva visible para preguntas. No se muestra un QR provisional.

## Preguntas / margen (3:00)

Si falta tiempo, omite el análisis Unicode y muestra solo una copia instalada. Conserva las definiciones propias de habilidad y agente y la comprobación de aceptación del reembolso. Los 17 minutos son un objetivo de contenido, no un ensayo humano cronometrado.
