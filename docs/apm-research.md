# APM research (primary sources only)

## Grabación vigente: repositorio central y consumidor Git

La presentación usa una grabación real con `apm-cli` 0.33.0 de `examples/payments-team`, consumido desde el manifiesto mínimo de `examples/payments-service`. La referencia ilustrativa `northstar-engineering/payments-team#v1.0.0` se resuelve a un Git local real mediante una regla `insteadOf` aislada. No se publicó ni descargó ese repositorio de GitHub. La grabación anterior por ruta local y los ejemplos públicos de las secciones históricas no representan la demo vigente.

- Definiciones del equipo: revisor, habilidad de reintentos y reglas bajo `.apm/`; el manifiesto central declara además el MCP documental Microsoft Learn.
- Creación del productor: Git init y `apm init --yes`, código 0; manifiesto inicial separado de las definiciones del equipo; Git commit/tag/rev-parse, código 0. Las pantallas 5 y 6 separan autoría (2 min) y consumo (3 min), sin repetir las fuentes en el consumidor.
- Consumidor: solo metadatos, clientes y referencia Git; instala con `apm install`, código 0.
- Archivo de bloqueo: `resolved_commit: a8de87fb7a2791683f5ece4ec15ad5e94452c48b`, referencia `v1.0.0`, seis huellas de archivos y configuración MCP. El commit corresponde al Git local de la demostración.
- La CLI escribió `.mcp.json` y `.github/mcp.json`; ambos se capturaron. No hubo conexión MCP ni ejecución de modelo. El MCP propio de una dependencia directa se considera confiado; `--trust-transitive-mcp` se reserva para el caso indirecto.
- Auditoría y CI limpios: código 0. Referencia adicional sin instalar: CI y modo congelado, código 1. Restaurar manifiesto: código 0 y diez comprobaciones aprobadas.
- Fuentes de autoría: [habilidades](https://microsoft.github.io/apm/producer/author-primitives/skills/), [agentes e instrucciones](https://microsoft.github.io/apm/producer/author-primitives/instructions-and-agents/) y [MCP y confianza](https://microsoft.github.io/apm/producer/author-primitives/mcp-as-primitive/). Los documentos vivos pueden evolucionar; esta evidencia usa la CLI fijada en 0.33.0.

Evidencia vigente y límites: [`apm-validation.md`](apm-validation.md). Las secciones siguientes se conservan como investigación histórica, no como rutas, conteos o resultados actuales.


Researched 2026-10-14. Sources (all primary):

- [R] Repo + README: https://github.com/microsoft/apm (README: https://raw.githubusercontent.com/microsoft/apm/main/README.md)
- [D] Official docs: https://microsoft.github.io/apm/ (full text: https://microsoft.github.io/apm/llms-full.txt)
- [REL] Release API: https://api.github.com/repos/microsoft/apm/releases/latest
- [CLI] Real CLI run by me: `apm-cli` 0.33.0 from PyPI (output copied below)

Throwaway setup: `uv venv /tmp/apmrun.XXXX/venv && uv pip install apm-cli`, then a scratch project in `/tmp/apmrun.XXXX/proj` (outside the keynote project). Docs/README downloaded into a separate empty `/tmp/apmdl.XXXX`. No project source was touched.

## 1. Maintainer, repo, license, version, install

- Maintainer: Microsoft (GitHub org `microsoft`), described in the README as "open-source, community-driven". Repo: https://github.com/microsoft/apm [R]
- License: MIT (GitHub API `license.spdx_id`).
- Latest release: v0.33.0, published 2026-10-02 [REL]. Pre-1.0, so CLI flags and output change often. Repo created 2025-09-18, ~4k stars, active (last push 2026-10-14).
- One-liner [R]: "Think package.json, requirements.txt, or Cargo.toml but for AI agent configuration."
- Install methods [R]: `brew install apm`; `curl -sSL https://aka.ms/apm-unix | sh`; `irm https://aka.ms/apm-windows | iex`; `pip install apm-cli` (Python 3.10+); WinGet `Microsoft.APM`; Scoop.
- Companion: GitHub Action `microsoft/apm-action@v1` for CI [D].

## 2. Manifest

File name: `apm.yml` (confirmed; `apm init` creates it). Real output of `apm init --yes` [CLI]:

```yaml
name: proj
version: 1.0.0
description: APM project for proj
author: Developer
# Which agent platforms to deploy to (uncomment to pin):
# targets:
#   - copilot
#   - claude

dependencies:
  apm: []
  mcp: []
includes: auto
scripts: {}
```

Example from the README [R]:

```yaml
name: your-project
version: 1.0.0
dependencies:
  apm:
    - anthropics/skills/skills/frontend-design
    - github/awesome-copilot/plugins/context-engineering
    - github/awesome-copilot/agents/api-architect.agent.md
    - microsoft/apm-sample-package#v1.0.0
  mcp:
    - name: io.github.github/github-mcp-server
      transport: http
```

Fields seen: `name`, `version`, `description`, `author`, `targets`, `dependencies.apm`, `dependencies.mcp`, `includes`, `scripts`, `devDependencies` (via `apm install --dev`). The `dependencies.apm` shape is `owner/repo[/path][#ref]`.

## 3. Lockfile

File name: `apm.lock.yaml` (README also says `apm.lock` in one sentence; the file written by 0.33.0 is `apm.lock.yaml`). YAML. Real excerpt after `apm install microsoft/apm-sample-package#v1.0.0 -t copilot,claude` [CLI]:

```yaml
lockfile_version: '1'
apm_version: 0.33.0
dependencies:
- repo_url: microsoft/apm-sample-package
  host: github.com
  resolved_commit: fb2851683be0e0e7711421d518bd8dba23b0b1f6
  resolved_ref: v1.0.0
  version: 1.0.0
  package_type: apm_package
  deployed_files:
  - .agents/skills/style-checker/SKILL.md
  - .github/prompts/design-review.prompt.md
  # ...
  deployed_file_hashes:
    .agents/skills/style-checker/SKILL.md: sha256:1142700284d2...
  content_hash: sha256:744cca54cc8f...
- repo_url: github/awesome-copilot
  resolved_commit: 3cf7c7e8fe9cc1e7c3fd1319e8d01babf388cd6b
  depth: 2
  resolved_by: microsoft/apm-sample-package   # transitive dependency
  ...
deployments:   # per-file ledger: target, owner, content_hash
```

It records: resolved commit SHA, resolved ref, version, transitive depth and parent, every deployed file path, SHA-256 hash per deployed file, per-package `content_hash`, and a deployment ledger. So "pins exactly what was resolved" is TRUE (commit SHA + content hashes), stronger than version-only. Also `apm lock export --format cyclonedx|spdx` for SBOM [R].

## 4. CLI (real, v0.33.0)

Top-level `apm --help` "Common workflows" block [CLI]:

```
apm auth <host>                Set up credentials for a git host
apm init                       Scaffold a new project
apm install                    Install dependencies from apm.yml
apm install --frozen           Reproduce lockfile exactly (CI-safe)
apm lock                       Resolve deps only (no deploy/delete)
apm outdated                   See what's drifted from upstream
apm update                     Refresh refs and rewrite the lockfile
apm audit --ci                 Validate lockfile integrity for CI gates
apm doctor                     Diagnose environment problems
apm run <script>               Execute a script from apm.yml
```

Other commands: `compile`, `deps` (`apm deps list`), `targets`, `pack`, `unpack` (deprecated), `uninstall`, `prune`, `view`, `search`, `marketplace`, `mcp`, `plugin`, `policy`, `approve`/`deny`, `find`, `config`, `self-update`.

Gotchas:

- `apm list` lists SCRIPTS from apm.yml, NOT installed dependencies. Use `apm deps list`.
- `apm update` refreshes refs and rewrites the lockfile (`-y` for CI). `apm install --update` is deprecated.
- `apm compile` generates AGENTS.md-style aggregated context files; it is not a dependency check.
- Install with no `--target`, no `targets:` in apm.yml and no harness marker directory exits 2 (`Error: [x] No harness detected`). Always pass `-t` or set `targets:` in apm.yml. Re-verified in the "Re-recorded runs" section below.
- `apm install --frozen`: "Refuse to install when apm.lock.yaml is missing or out of sync with apm.yml".

Real `apm install` output (abridged) [CLI]:

```
[i] Targets: claude, copilot  (source: --target flag)
  [+] microsoft/apm-sample-package #v1.0.0 @fb285168
  [+] github.com/github/awesome-copilot/skills/review-and-refactor #default @3cf7c7e8
  |-- 2 prompts integrated -> .github/prompts/
  |-- 2 agents integrated -> .claude/agents/, .github/agents/
  |-- 2 commands integrated -> .claude/commands/
  |-- 2 instruction(s) integrated -> .claude/rules/, .github/instructions/
  |-- 1 skill(s) integrated -> .agents/skills/, .claude/skills/
  [!] 1 dependency unpinned: github/awesome-copilot -- add #tag or #sha to prevent drift
[*] Installed 2 APM dependencies in 13.9s.
```

Real `apm deps list` [CLI]: table with columns Package, Version, Source, Prompts, Instructions, Agents, Skills, Hooks.

## 5. What dependencies are, targets, install locations

Primitives [D, "Primitives and Targets"]: instructions (`*.instructions.md`), prompts (also surfaced as commands), agents (`*.agent.md`), skills (`SKILL.md`), hooks, plugins, MCP servers (plus LSP servers in 0.33). Packages can depend on packages (transitive). Sources: GitHub, GitLab, Bitbucket, Azure DevOps, GHE, Gitea, any git host [R]. "Agentic dependencies" is a fair description.

Targets [CLI `apm targets` and install --help]: copilot, claude, cursor, codex, gemini, grok-build, opencode, windsurf, kiro (default "all"), plus explicit-only agent-skills, antigravity, hermes, intellij, openclaw, and more. Docs say nine default harnesses [D].

Where files land [D line "compiled output lives in..."; CLI verified for copilot and claude]:

- Copilot: `.github/` (`instructions/`, `prompts/`, `agents/`)
- Claude Code: `.claude/` (`agents/`, `commands/`, `rules/`, `skills/`)
- Skills: shared `.agents/skills/` (default in 0.33; `--legacy-skill-paths` for per-client dirs like `.cursor/skills/`)
- Cursor `.cursor/`, Codex `.codex/` + AGENTS.md, Gemini `.gemini/`, OpenCode `.opencode/`, Windsurf `.windsurf/`, Kiro `.kiro/`
- Downloaded packages: `apm_modules/` (auto-added to `.gitignore`)

So the plan's `.agents/` and `.github/` folders are real and correct.

## 6. Security / audit: what exists and what does not

Exists (all exercised by me unless noted):

- Install-time scan for hidden Unicode; critical findings block deploy (`--force` overrides) [D, R].
- `apm audit` replays the install cache-only, diffs against the working tree (drift), scans deployed files. Output: `12 file(s) scanned -- no issues found`, `No drift detected`. Formats: text, json, sarif, markdown.
- Real hidden-character detection, tested with a file containing U+200B and U+202E (exit code 1):
  `CRITICAL ... U+202E Right-to-left override (RLO)` and `WARNING ... U+200B Zero-width space`. `apm audit --strip` removes them.
- Lockfile hashes: SHA-256 per deployed file and per package (content-integrity check).
- `apm-policy.yml` org policy (allow-lists of sources/MCP/primitives), enforced at install; `apm audit --ci --policy org` [D]. Not exercised by me (needs an org repo). Inside my scratch run it printed `Could not determine org from git remote; enforcement skipped`.
- MCP trust prompts for transitive MCP servers [R]. Not exercised.

Does NOT exist [D]:

- "It does NOT do LLM-based prompt review, prompt-injection detection, or semantic safety review." and "does not scan code semantics or behave like an antivirus."
- APM is not a runtime: it "does not govern the runtime plane" (permissions, sandboxing).
- Experimental: external scanners (`--external skillspector|sarif`) require `apm experimental enable external-scanners`.
- Warn mode caveat: in policy `warn` mode `apm audit --ci` exits 0 [D].

## 7. CI validation

`apm audit --ci` (exit 0 clean, 1 on violations) is the real CI gate. There is no command literally named "dependency validation". `apm install --frozen` is the second real option. Real clean run [CLI]:

```
 [+] lockfile-exists / ref-consistency / deployment-ledger-owners / deployed-files-present
 [+] no-orphaned-packages / skill-subset-consistency / config-consistency
 [+] content-integrity / includes-consent / drift
[*] All 10 check(s) passed          (exit 0)
```

Real mismatch run (I added `example/engineering-skills` to apm.yml without installing) [CLI]:

```
 [+] lockfile-exists
     ref-consistency   1 ref mismatch -- run 'apm install --update' to update lockfile
 [+] drift
  ref-consistency details:
    - example/engineering-skills: not found in lockfile
[x] 1 of 3 check(s) failed          (exit 1)
```

```
$ apm install --frozen -t copilot,claude
[x] --frozen: apm.lock.yaml is out of sync with apm.yml.
  - example/engineering-skills is declared in apm.yml but missing from apm.lock.yaml
[x] Install failed after 0.0s.      (exit 1)
```

Docs say a PR that edits apm.yml without updating apm.lock.yaml "fails the audit check" [D, enforce-in-ci]. GitHub Action: `microsoft/apm-action@v1` (`setup-only: true` then `apm audit --ci`).

Note: `--frozen` on a clean tree re-deploys files (it printed "Installed 1 APM dependency") and only verifies lockfile presence/sync; on-disk integrity is `apm audit`'s job.

## Claims table

| # | Claim | Verdict | Source |
|---|---|---|---|
| 1 | Manifest is `apm.yml` | VERIFIED | [R] README, `apm init` output |
| 2 | Lockfile exists, name `apm.lock.yaml` | VERIFIED | CLI run; [D] |
| 3 | Lockfile pins exactly what was resolved | VERIFIED (commit SHA, ref, SHA-256 hashes, deployed files) | CLI run |
| 4 | Install command is `apm install` | VERIFIED | [R], `apm --help` |
| 5 | Install materializes deps on a fresh checkout | VERIFIED (`git clone && apm install`, needs target detectable or `-t`) | [R], CLI |
| 6 | "Agentic dependencies" = skills, instructions, agents, prompts, hooks, plugins, MCP servers | VERIFIED | [D] primitive catalogue |
| 7 | CI validation exists | VERIFIED as `apm audit --ci` / `apm install --frozen`, NOT a command called "dependency validation" | CLI `--help` |
| 8 | CI fails when manifest and lockfile mismatch | VERIFIED (exit 1 both commands) | CLI run |
| 9 | Security audit step exists | VERIFIED but narrow: hidden Unicode, lockfile hash integrity, drift, org policy | CLI run; [D] |
| 10 | APM detects malicious/injected prompt content | FALSE | [D] "does NOT do ... prompt-injection detection" |
| 11 | Folders `.github/` and `.agents/` are install locations | VERIFIED (also `.claude/`, `.cursor/`, ...) | CLI run |
| 12 | `dependencies: apm: - example/engineering-skills` | UNVERIFIED/FALSE as a real package: github.com/example/engineering-skills returns 404. Schema is correct, package is fictional | HTTP 404; CLI |
| 13 | Agents supported: Claude Code, Cursor, Copilot, Codex, others | VERIFIED (9 default + extras) | `apm targets`, [R] |
| 14 | `apm list` shows installed deps | FALSE (lists scripts). Use `apm deps list` | CLI run |
| 15 | "APM is not npm for agents" / analogies | VERIFIED as sensible; docs themselves say the package model differs from npm | [D] line "The verbs rhyme on purpose..." |
| 16 | APM does not cover evals, tests, human oversight | VERIFIED (not a runtime; no semantic review) | [D] |
| 17 | Pipeline step "Dependency Resolution" is an APM feature | VERIFIED (`apm install`/`apm lock`) | CLI |
| 18 | Pipeline step "Security Validation" is an APM feature | PARTIAL: only hidden-Unicode, hash integrity, policy. Label it "Integrity and content scan" | [D] |
| 19 | Maintained by Microsoft, MIT, v0.33.0 (2026-10-02) | VERIFIED | GitHub API |
| 20 | `apm compile` is related to CI/dependency checks | FALSE: it builds AGENTS.md/copilot-instructions context | CLI `compile --help` |

## Recommended playground script

Real (reproduced by me in v0.33.0). Use a real public package instead of `example/engineering-skills`:

```bash
# 0. install (pick one)
brew install apm        # or: pip install apm-cli

# 1. init
apm init --yes
# creates apm.yml (name, version, dependencies.apm: [], dependencies.mcp: [])

# 1b. uncomment the targets block in apm.yml by hand (init writes it commented out)
# 2. install a real package; pin its tag (no -t needed once targets: is set, see "Re-recorded runs")
apm install microsoft/apm-sample-package#v1.0.0
# -> [+] microsoft/apm-sample-package #v1.0.0 @fb285168
# -> 2 prompts -> .github/prompts/ ; 2 agents -> .claude/agents/, .github/agents/
# -> 1 skill(s) -> .agents/skills/, .claude/skills/
# -> writes apm.yml entry and apm.lock.yaml
# -> [!] 1 dependency unpinned: github/awesome-copilot (transitive; real warning)
# -> [*] Installed 2 APM dependencies

# 3. inspect
apm deps list

# 4. Security
apm audit
# -> No drift detected / 12 file(s) scanned -- no issues found

# 5. CI validation (clean)
apm audit --ci          # [*] All 10 check(s) passed, exit 0
apm install --frozen

# 6. CI validation (mismatch): add a dependency to apm.yml WITHOUT installing
apm audit --ci
# -> ref-consistency: 1 ref mismatch ... example/engineering-skills: not found in lockfile
# -> [x] 1 of 3 check(s) failed, exit 1
apm install --frozen
# -> [x] --frozen: apm.lock.yaml is out of sync with apm.yml. exit 1
```

Optional real security demo: put a zero-width space and U+202E in a file, run `apm audit --file <path>`: reports `CRITICAL U+202E` and `WARNING U+200B`, exit 1.

Must stay a simulation or be labelled illustrative:

- The package name `example/engineering-skills` (404). If kept for the story, mark it as a placeholder; the manifest shape is real.
- Org policy enforcement (`apm-policy.yml`, `--policy org`) unless shown on a real org repo.
- Any claim that "Security" catches malicious or injected instructions: it does not (hidden Unicode and hash tampering only).
- Install timing (13.9s measured, network-dependent) and exact table formatting; the CLI is pre-1.0 and output changes between versions.

Suggested UI wording: manifest `apm.yml`, lockfile `apm.lock.yaml`, CI step `apm audit --ci` (alt: `apm install --frozen`), dependency types "instructions, prompts, agents, skills, hooks, plugins, MCP servers".

## Re-recorded runs (2026-10-15)

The playground (scene 5) now replays ONE scripted session instead of the mixed excerpts above. Output is copied byte for byte (via `src/playground/recorded.ts`, generated by a script from the captured files). Setup: existing throwaway venv `/tmp/apmrun.sOET/venv` (`apm --version` -> `Agent Package Manager (APM) CLI version 0.33.0`), scratch project `/tmp/apmrun.sOET/rec3/proj` (outside the keynote project), `COLUMNS=120 NO_COLOR=1`. The recording script and its outputs stay in `/tmp/apmrun.sOET/` (`record.sh`, `gen_recorded.py`, `rec3/out/`).

Exact sequence and exit codes:

| # | Command | Exit |
| --- | --- | --- |
| 1 | `apm init --yes` | 0 |
| 2 | hand edit: uncomment `targets:` / `- copilot` / `- claude` (and the comment text, "uncomment to pin" became "uncommented to pin") | - |
| 3 | `apm install microsoft/apm-sample-package#v1.0.0` (no `-t`) | 0 |
| 4 | `apm audit` | 0 |
| 5 | fixture `src/pasted-prompt.md` written with `printf` containing U+200B and U+202E, then `apm audit --file src/pasted-prompt.md` | 1 |
| 6 | `apm audit --ci` (clean) | 0 |
| 7 | add `    - example/engineering-skills` under `dependencies.apm` by hand, `apm audit --ci` | 1 |
| 8 | `apm install --frozen` (no `-t`) | 1 |
| 9 | remove that line, `apm audit --ci` | 0 |
| 10 | `apm deps list` | 0 |

Targets findings (the question was how the commented `targets:` block interacts with the demo):

- With `targets:` still commented out and no `-t`, `apm install microsoft/apm-sample-package#v1.0.0` exits 2 (`Error: [x] No harness detected`) and rolls back (`[i] apm.yml restored to its previous state.`). So the old demo manifest (commented targets) only worked because the command carried `-t copilot,claude`.
- With `targets:` uncommented (`copilot`, `claude`), the same command without `-t` works: exit 0, `[i] Targets: claude, copilot  (source: apm.yml)`. The `-t` flag is not needed, and `apm install --frozen` works without it too.
- `apm install <pkg>` does NOT write `targets:`; the block is only ever edited by hand. It DOES write the dependency into apm.yml: `dependencies.apm` goes from `[]` to `- microsoft/apm-sample-package#v1.0.0` (`[*] Updated apm.yml with 1 new package(s)`). The viewer shows that change after the install step.
- `apm install` also adds `apm_modules/` to `.gitignore` (`[i] Added apm_modules/ to .gitignore`).

Other differences from the older excerpts in this doc (0.33.0 on 2026-10-15 vs 2026-10-14):

- The transitive `github/awesome-copilot` skill resolved to `@36e95dfd` (was `@3cf7c7e8`): the default branch moved. Its lockfile entry has `version: unknown` and no `resolved_ref`, and install prints an extra `|-- Skill integrated` line plus two `[!] ... Claude command ... frontmatter keys ... dropped: mode` warnings.
- `apm audit --ci` prints a table ("APM Policy Compliance", 10 rows), not the three-line summary shown earlier, preceded by `[>] Replaying install (cache-only)...` and `[+] No drift detected`. The failing run is a 3-row table plus `ref-consistency details:`.
- `apm audit --file` prints a "Content Scan Findings" table with real positions: `CRITICAL src/pasted-prompt.md 3:30 U+202E Right-to-left override (RLO)` and `WARNING src/pasted-prompt.md 2:29 U+200B Zero-width space`, then `[x] 1 critical finding(s) in 1 file(s) -- hidden characters detected`. Nothing is elided. The positions are line:column of the character in the fixture.
- Install durations vary per run (7.1s to 17.4s observed across three runs); the playground shows the last run's value verbatim.
- The complete `apm.lock.yaml` (199 lines, with the full `deployments:` ledger) is shown in the viewer, not an excerpt. `apm deps list` is now recorded (2 rows: `microsoft/apm-sample-package` 1.0.0 and `github/awesome-copilot/skills/review-and-refactor` unknown).
- Hash and path of deployed files come from that same lockfile; the file contents themselves were not captured, so the viewer says so.
