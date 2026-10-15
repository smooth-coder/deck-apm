# El agente también es una dependencia — APM

**Entrega de software con IA: versionar, bloquear y validar la configuración del agente.** Charla de 20 minutos implementada como una aplicación React (Vite + TypeScript + Tailwind v4): **14 minutos de contenido + 6 minutos para preguntas**. Tesis: la configuración del agente es parte de tu entrega; versiónala, bloquéala y valídala en CI. Guion y tiempos: [`docs/talk-script.md`](docs/talk-script.md).

La narrativa, los controles de las diapositivas y las notas del presentador están en español. La demo, los ejemplos de código, los nombres de archivos y la salida real de la CLI permanecen en inglés. La página declara `lang="es"`; la demo y los ejemplos en inglés identifican su idioma.

## Ejecutar

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # Vitest + jsdom
pnpm typecheck
pnpm build      # dist/
pnpm preview
```

## Controles

| Tecla | Acción |
| --- | --- |
| Derecha / Abajo / Espacio / PageDown | Diapositiva siguiente |
| Izquierda / Arriba / PageUp | Diapositiva anterior |
| 1–6 | Saltar a una diapositiva |
| P | Abrir la demo de consumo de la diapositiva 5 |
| F | Alternar pantalla completa, si el navegador lo permite |

La diapositiva actual se guarda en la URL (`#/scene/3`), por lo que se puede recargar o compartir un enlace directo. Espacio e Intro activan el botón enfocado; haz clic en el fondo para avanzar con Espacio.

La diapositiva 1 plantea el problema: **entregamos con agentes, pero su configuración no pasa por el pipeline.** Una persona nueva clona, instala y ejecuta, pero su agente no tiene las reglas, procedimientos ni conexiones del equipo. APM se presenta en la diapositiva 3. No se promete que instalar configuración haga correcto el código del agente.

La diapositiva 2 compara dos configuraciones ilustrativas con el mismo pipeline: lo que se entrega depende de la laptop de origen. No son resultados medidos de modelos. La 3 trata la configuración del agente como dependencia (declarada en `apm.yml`, versionada por el equipo y bloqueada en `apm.lock.yaml`); la analogía con npm es secundaria. **Ejemplo técnico y límites** permite inspeccionar el manifiesto.

La diapositiva 4 muestra cómo se centraliza la configuración en `payments-team/`: **Initialize package → Add team files → Version package**. Empieza con una carpeta vacía, reproduce Git y `apm init` reales, añade las definiciones propias del equipo y graba un commit y la etiqueta `v1.0.0`. APM no genera el contenido del agente ni de la habilidad. **Reset repository** vuelve al estado vacío.

La diapositiva 5 muestra únicamente el uso desde `payments-service/`. Empieza solo con su `apm.yml`; al finalizar **Install** aparecen los archivos desplegados y el archivo de bloqueo. Recorrido principal: **Install → Inspect Lockfile → Run CI checks** (diez comprobaciones aprobadas) **→ Add dependency without installing → Run CI checks** (falla con la salida real de `apm audit --ci` y `apm install --frozen`, código 1) **→ Fix manifest & re-run CI** (vuelve a pasar). El análisis Unicode queda como respaldo opcional. **Reset Demo** vuelve al manifiesto único, incluso durante la reproducción. En ambas pantallas, el explorador permanece a la izquierda, también en móvil; solo las acciones completadas muestran un resultado breve.

La diapositiva 6 cierra con el pipeline de entrega: **Configuración** (APM: instala la configuración revisada y `apm audit --ci` compara manifiesto y lockfile), **Validación** (equipo: pruebas del producto y evaluaciones del agente) y **Revisión y publicación** (equipo: revisión humana, compilación y controles de publicación). **Cómo empezar** explica cómo declarar el repositorio real del equipo y añadir `apm audit --ci` como comprobación obligatoria en CI. La frase final: «El próximo dev clona el repo y su agente ya trabaja como el equipo.» El total es de 14+6 minutos.

## Versión de APM y evidencia

APM significa **Agent Package Manager**, no monitorización del rendimiento de aplicaciones. La demo usa `apm-cli` 0.33.0 y los ejemplos de `examples/payments-team` y `examples/payments-service`.

La referencia `northstar-engineering/payments-team#v1.0.0` representa una organización ilustrativa. El grabador crea un Git local real con etiqueta y una regla `insteadOf` aislada; no publica ni descarga ese repositorio de GitHub. La CLI instala desde Git y registra el commit resuelto, las huellas de seis archivos y la configuración MCP en el archivo de bloqueo. La condición local está indicada en la propia demo.

El repositorio central declara el MCP documental Microsoft Learn. La CLI escribió realmente `.mcp.json` para Claude Code y `.github/mcp.json` para Copilot CLI. Son archivos capturados, no vistas inventadas; no se conectó al servidor ni se ejecutó un modelo. APM confía en el MCP propio de una dependencia directa; `--trust-transitive-mcp` corresponde al caso indirecto y no es necesario aquí. La aprobación del cliente y las credenciales de servicios privados son asuntos separados.

La inicialización del productor, el manifiesto inicial, sus definiciones finales, el versionado, las copias instaladas, el archivo de bloqueo y las salidas reales se capturan en `src/playground/recorded.ts`. El generador exige que el commit del productor coincida con el lockfile consumidor. Para volver a grabar: [`scripts/README.md`](scripts/README.md). Evidencia y límites: [`docs/apm-validation.md`](docs/apm-validation.md).

## Desplegar en Vercel

Vercel detecta Vite: comando de compilación `pnpm build`, directorio de salida `dist`.
No hace falta `vercel.json`: la navegación usa el fragmento de la URL, no rutas del servidor.

## QR pendiente

`public/qr-code.svg` es provisional y no se muestra. Cuando exista la URL del despliegue, genera un QR real y sustituye el archivo antes de volver a mostrarlo en la diapositiva 6.
