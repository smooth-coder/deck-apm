# Copy review: "Your AI Agents Have a Dependency Problem"

Historical audit of the earlier deck. Its four-developer comparison, seven-step pipeline and timings are superseded by the delivery-focused edition in [`talk-script.md`](talk-script.md). Findings below are retained as historical review evidence, not the current implementation contract.

Scope: review only. Based on a read of `src/data/*.ts`, `src/scenes/*.tsx`, `src/components/**`, `src/playground/*`, `docs/talk-script.md`, `docs/apm-research.md`. No screenshots were taken; widths are judged from the layout code (graph node 390px, etc.). Line numbers refer to files as they were when read; another agent is editing, so re-check before applying.

Verification key. Tool-file facts below were checked against primary docs on 2026-10-15:
- Claude Code memory/skills/subagents/MCP: code.claude.com/docs/en/{memory,skills,sub-agents,mcp}
- Copilot repo instructions: docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
- Cursor rules and MCP: cursor.com/docs/context/{rules,mcp}
- Codex AGENTS.md: learn.chatgpt.com/docs/agent-configuration/agents-md
- VS Code MCP: code.visualstudio.com/docs/copilot/customization/mcp-servers

Anything not covered is marked UNVERIFIED and is not used in replacement copy.

---

## 0. Cross-cutting problems (read first)

### 0.1 Presenter notes are rendered to the audience
`src/components/SceneView/SceneView.tsx` renders `scene.goal` as `<p class="scene__goal">` and "Scene N / M min" as `scene__meta`. The goals in `src/data/presentation.ts:9-14` are internal intent statements, not slide copy:
- `:9` "Make the audience feel the pain of agent setup drift." (a stage direction, said TO the audience)
- `:13` "Let the audience try it hands-on, live." FALSE twice: the audience does not click, and the output is recorded, not live.
- `:10` "Show how agent configs, skills and tools break each other." Scene 2 does not show configs breaking each other; it shows four outputs diverging.
- `:12` "Introduce a package manager model for agent dependencies." Describes the talk, not the fact.

Also on screen: "Scene 3 / 3 min" (timer metadata), and titles that are topic labels ("The Hook", "Software Delivery", "The APM Moment"). "The Hook" is a presenter label; the audience should never read it.

Fix: make the title an assertion (the one idea), make `goal` a one-line supporting fact, hide or move `Scene N / M min` to a presenter-only overlay. Replacement strings are in each scene section.

### 0.2 Titles name topics, not ideas
"Dependency Hell", "The Agent Stack", "Live Playground" tell nobody what to conclude. Use claim headlines (max 10 words).

### 0.3 No scene contains a number, a file name, or a command that the audience can remember, except 4 and 5
Scenes 1, 2, 3, 6 are almost entirely abstract nouns ("project instructions", "skills", "tools", "Agent Context"). The real artifacts exist (CLAUDE.md, .mcp.json, .cursor/rules/*.mdc, apm.lock.yaml) but the copy avoids naming them.

### 0.4 Talk title is absent from the app
The talk is "Your AI Agents Have a Dependency Problem / The npm Moment for AI-Powered Software Delivery". Nowhere on screen. Meanwhile scene 4 states "APM is not npm for agents" (`src/data/apm.ts:9`) while the subtitle says "The npm Moment". Pick one stance and say it: "npm moment" as an analogy for the SHIFT (declare, lock, install, audit), not for the product. Suggested badge in 4.

---

## 1. Scene 1: Hook

### Current vs should teach
Currently: a fake terminal (`src/data/hook.ts:9-18`) then a disconnected-nodes graph, then "Your code is reproducible. Are your AI agents?" (`01-Hook.tsx:42-44`).
Should teach (one idea): a fresh clone gives you identical code in 30 seconds; it gives you NO identical agent context, and nothing in the repo says what the agent was supposed to have.

### Offending strings
- `hook.ts:15` "⚠ Missing project instructions" and `hook.ts:16` "⚠ Unknown coding standards": the same thing twice. Instructions ARE the coding standards. The graph therefore shows 4 nodes for 3 ideas.
- `hook.ts:17` "⚠ Required skills not found": required by whom? Nothing declares them. Contradicts the point (nothing is declared).
- `hook.ts:18` "⚠ MCP tools unavailable": no tool named, no file.
- `hook.ts:9` `$ git clone enterprise-project`: "enterprise" is marketing filler, not an artifact.
- `hook.ts:14` `$ agent run "implement payment feature"`: not a real command. Unlabeled fiction.
- `docs/talk-script.md` Scene 1: "This is the agent's real dependency graph today." The graph is a staged animation; calling it "real" is false.
- `01-Hook.tsx:42-44` quote: fine as a hook, but it is the only information the scene carries beyond four vague warnings.

### Why boilerplate
The warnings are generic enough to describe any project; none points at a file the audience could go look for. "Dependencies resolved / Lockfile verified" is true for npm but the scene never says what the agent equivalent would have been.

### Replacement copy

Scene header:
- title: `Your code is reproducible. Your agents aren't.`
- goal (<=25 words): `npm install gives every developer the same code. Nothing gives every agent the same instructions, skills and tools.`

Terminal lines (`hookLines`), keep kinds; add an "Illustrative terminal" badge on the terminal:
```
$ git clone acme/payments-service
$ npm install
✓ 247 packages, all pinned in package-lock.json
$ claude "add a refund endpoint"
⚠ No CLAUDE.md or AGENTS.md
⚠ No skills: write-tests missing
⚠ No .mcp.json: issue tracker unreachable
⚠ No manifest, no lockfile for any of it
```
Notes:
- `claude "add a refund endpoint"` is the documented CLI form for a one-shot prompt; if you want neutrality keep `$ agent "add a refund endpoint"` and label as illustrative. Do not call it a real graph.
- 247 and acme/payments-service are illustrative; the badge must say so.
- These four strings are also the graph node labels (`01-Hook.tsx` strips "⚠ "). Each is <=40 chars so it fits the 390px node.
- Node set now maps 1:1 to the stack in scene 3: instructions, skills, tools, and the missing declaration. This sets up scene 4.

Closing quote (replace `01-Hook.tsx:42-44`):
```
npm install gives every developer the same code.
What gives every agent the same context?
```
Keep "Your code is reproducible / Are your agents?" as the SPOKEN line.

### Screen vs speech
- Screen: the four file-named warnings and the quote.
- Speech only: the story ("You clone, you install, everything passes"), why this hurts on a team, the transition.
- Disagreement: script says "real dependency graph". Change the script to "This is what the agent has to work with: four things, none connected, none declared."

---

## 2. Scene 2: Dependency Hell

### Current vs should teach
Currently: 4 devs with one-line summaries ("Her own skills and instructions", "Different rules", "MCP tools", "AGENTS.md"), then a button that reveals four hand-written outputs, then "Sharing a repo does not guarantee sharing a reproducible agentic environment." (`agentConfigs.ts:21-22`).
Should teach: same repo, same task, same day, four pull requests that disagree on error handling, tests, structure and data access, and the cause is where each tool reads its instructions from and what each developer configured locally. Real fact to land: each tool has its own native location, and nothing in git ties them together.

### Offending strings
- `agentConfigs.ts:29,46,63,80` summaries: "Her own skills and instructions", "Different rules", "MCP tools", "AGENTS.md". Not parallel, not informative; "Different rules" differs from what?
- `:31-33` "Personal skills for testing and code review", "Own project instructions file, never committed": which file? "Skills" for what? no path.
- `:48` "Editor rules written months ago for another project": the best line in the file, but no file name (`.cursor/rules/*.mdc`).
- `:66` "Tool list differs from every teammate's": says nothing about WHICH tool or what it changes.
- `:68` "Default instructions only" (Carol) vs `:70` "Mixed styles copied from nearby files": plausible, but the link from config to output is not displayed. `DeveloperComparison.tsx:46-53` replaces the setup panel with the outputs once "Run Same Task" is pressed, so config and result are never on screen together. The audience cannot see cause and effect.
- `:56` Bob's tools "Editor context only; no shell". UNVERIFIED and likely false for Cursor agent mode. Remove; claiming a vendor tool lacks a capability invites a correction from the room.
- `:87` Dave: "Follows AGENTS.md" implies AGENTS.md is Codex-specific. It is not: Copilot and Cursor docs say they read AGENTS.md too, and Claude Code docs say it can use a repository's AGENTS.md. Presenting Dave as "the AGENTS.md guy" is misleading about the ecosystem.
- `:21-22` CONCLUSION restates the scene title. It is a sentence, not evidence.
- `:19` label "Illustrative output, not real model runs" is correct and necessary. Keep, but make the file-based setup real (the setup facts are verifiable, only the outputs are invented).

### Why boilerplate
The cards show "conventions / tests / architecture / tool access" as four generic fields with sentences like "Mixed styles copied from nearby files". A reader cannot picture a diff. No code token appears except two (`Result<T,E>`, `throw new Error`). The strongest real fact (4 tools, 4 different instruction locations) is not on screen.

### Replacement copy

Scene header:
- title: `Same repo. Same task. Four different pull requests.`
- goal: `Each tool reads instructions from a different place. Each developer configured theirs by hand. Git records none of it.`

Task line (`sharedTask`): keep.

Developer setups (labels are real file names; outputs stay illustrative):

```
alice  Claude Code   summary: "CLAUDE.md + her own skill"
  config:
   - "CLAUDE.md: errors return Result<T,E>, never throw"
   - "~/.claude/skills/write-tests/SKILL.md: tests before handler (on her laptop only)"
   - "No .mcp.json: no ticket access"
  output:
   conventions: "return err(new RefundError()); named exports"
   tests:       "refund.test.ts written first"
   architecture:"RefundService behind a PaymentGateway port"
   tools:       "Files and shell. Cannot read the ticket."
  why: "Her skill and CLAUDE.md are not in the repo."

bob    Cursor        summary: ".cursor/rules from another project"
  config:
   - ".cursor/rules/api.mdc copied months ago: default exports, throw on error"
   - "No team test procedure configured"
   - "No MCP servers (.cursor/mcp.json absent)"
  output:
   conventions: "throw new Error('refund failed'); default export"
   tests:       "None generated"
   architecture:"Refund logic inline in the route handler"
   tools:       "Open files only. Cannot read the ticket."
  why: "The rule file describes a different codebase."

carol  Copilot       summary: ".github/copilot-instructions.md + local MCP"
  config:
   - ".github/copilot-instructions.md: six generic lines"
   - "MCP servers for tracker and staging DB, set up in her own editor, not in the repo"
   - "No shared skill for tests"
  output:
   conventions: "Mixed styles copied from nearby files"
   tests:       "One happy-path test"
   architecture:"Handler queries the staging database directly"
   tools:       "Reads the ticket. Writes SQL against staging."
  why: "Her tools differ from everyone's, and nobody reviewed them."

dave   Codex         summary: "AGENTS.md, two releases old"
  config:
   - "AGENTS.md at repo root, last edited two releases ago"
   - "Names the old test framework and the old layering"
   - "No MCP servers"
  output:
   conventions: "snake_case names; the codebase moved to camelCase"
   tests:       "Jest tests; the team moved to Vitest"
   architecture:"Old controller/model layering"
   tools:       "Shell only"
  why: "The file is committed, so it is trusted, and it is stale."
```
(Add a `why` field to `DeveloperSetup`, render under each output card: one line, max 12 words.)

Result strip (replace `CONCLUSION`):
`Four pull requests. Four error-handling styles. One of them reads production-adjacent data. Git shows only the code.`
Safer if you do not want to imply real harm: `Four pull requests, four conventions. Nothing in git says which agent context produced which.`

New small slide or panel (optional but strongest real evidence; all verified): "Where each tool reads instructions"

| Tool | Instruction files it loads |
| --- | --- |
| Claude Code | `CLAUDE.md`, `.claude/rules/` (AGENTS.md also usable, see docs) |
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `AGENTS.md` |
| Cursor | `.cursor/rules/*.mdc` (`.md` without frontmatter is ignored), `AGENTS.md` |
| Codex | `AGENTS.md` (also `~/.codex/AGENTS.md`), 32 KiB combined cap by default |

Footnote: `Claude Code treats CLAUDE.md as context, not enforced configuration (its docs).`

### Screen vs speech
- Screen: file names, the one-line `why`, the four outputs with code tokens, the table.
- Speech: "I wrote these outputs; real runs vary." The badge already says so; do not make the speaker carry it alone.
- Disagreement: script (Scene 2) says "Alice ... Dave (Codex, AGENTS.md)" as if AGENTS.md identifies Codex. Say instead "AGENTS.md is the common denominator; the other three tools also have their own".

---

## 3. Scene 3: Agent Stack

### Current vs should teach
Currently: five nodes, each with a one-line abstract definition and a one-line example; conclusion `STACK_MESSAGE` "They are not interchangeable. Together they form the agent's operating environment." (`agentStack.ts:49-50`).
Should teach: these five things differ in WHEN they enter the model's context, WHAT they can do, and WHERE they live. That is the "not interchangeable" claim, and the file tree is the evidence.

### Offending strings
- `agentStack.ts:19` Skills: "Reusable procedures and knowledge the agent can apply." No loading behaviour, no file.
- `:25` MCP: "A standardized connection to tools and data sources." Fine but no "what it grants", no config file.
- `:31` Agents: "Components that coordinate tasks and use the available capabilities." Word salad. Also collides with the "AI Agent" node (`:11`): two things called Agent on one diagram. A subagent is a Markdown file with its own prompt and tool allow-list.
- `:37` Instructions: "Project conventions, constraints and rules." Defines instructions as rules. Circular.
- `:44-46` Project Context: "What the agent actually sees for this project once everything is assembled." Describes itself. "The repo, plus the skills, tools, agents and rules loaded for it." Same.
- `:11-12` AI Agent example "A coding agent asked to implement the payment feature." Restates the node.
- `:49` STACK_MESSAGE: asserted, never demonstrated.
- `StackDiagram.tsx` panel label "Example" is the only evidence slot; none shows a file.

### Why boilerplate
Every definition could be pasted from a vendor glossary. The audience cannot tell skills from instructions after reading them, which is the scene's purpose.

### Replacement copy

Header:
- title: `Five parts. Five files. Not interchangeable.`
- goal: `Instructions load every session. Skills load on demand. MCP grants tool access. Subagents get their own context. Together: the agent's environment.`

Nodes. `definition` <=25 words; `example` shows a path plus a real content line. Names inside examples are illustrative; labelled with the `Example` prefix already in the UI (change to `Illustrative example`). Add a `lives` field ("Where it lives") rendered above the example.

```
agent   label "AI Agent"
  definition: "The model that reads the task and edits your repo. Everything else on this slide is what you give it."
  lives:      "(the tool: Claude Code, Copilot, Cursor, Codex)"
  example:    "Task: Add a refund endpoint to the payment service."

instructions  label "Instructions"
  definition: "Plain-text rules loaded into context at session start. Guidance only: the model can still ignore them."
  lives:      "CLAUDE.md · AGENTS.md · .github/copilot-instructions.md · .cursor/rules/*.mdc"
  example:    "Use pnpm. Errors extend AppError. Never edit generated files."

skills  label "Skills"
  definition: "A named procedure the agent loads only when its description matches the task."
  lives:      ".claude/skills/write-tests/SKILL.md"
  example:    "description: Add a unit test the way this team does it. Body: numbered steps."

mcp  label "MCP"
  definition: "A server that gives the agent tools and data beyond the repo: it can read and act on external systems."
  lives:      ".mcp.json (Claude Code, VS Code) · .cursor/mcp.json (Cursor)"
  example:    '{ "mcpServers": { "tracker": { "type": "http", "url": "https://tracker.example.com/mcp" } } }'

subagents  label "Subagents"   (rename from "Agents")
  definition: "A specialist the main agent hands work to, with its own prompt and its own tool allow-list."
  lives:      ".claude/agents/code-reviewer.md"
  example:    "tools: Read, Grep, Glob. It can review the diff but cannot edit files."

context  label "Agent Context"   (rename from "Project Context")
  definition: "What the model actually receives: your repo plus whatever the files above put in front of it."
  lives:      "Built at runtime from all of the above, differently per tool and per laptop"
  example:    "Change one file, or one version of it, and the same prompt produces a different pull request."
```
Verified: CLAUDE.md "loaded every session... context, not enforced configuration"; skill `description` decides when Claude loads it; `.claude/skills/<name>/SKILL.md`; subagents are Markdown with YAML frontmatter in `.claude/agents/`, `tools` is an allow-list, `description` tells Claude when to delegate; `.mcp.json` with `"type"` required for url entries, Claude Code asks to approve project servers; `.cursor/mcp.json` for Cursor; VS Code supports `.mcp.json` at workspace root. The "Guidance only: the model can still ignore them" line is supported by the Claude docs ("context, not enforced configuration").
UNVERIFIED and omitted: skills/subagent equivalents in Copilot, Cursor and Codex. Do not generalize `.claude/skills` to all tools on screen (APM itself maps skills to `.agents/skills/` and `.claude/skills/` as recorded in the install output).

STACK_MESSAGE replacement: `If any one file differs, the agent's environment differs. That is the dependency problem.`

### Screen vs speech
- Screen: label, definition, `lives` path, example.
- Speech: analogies ("instructions are the style guide, skills are the runbook, MCP is the VPN badge"); the claim that the team currently manages none of these as dependencies; the transition to APM.
- Disagreement: script reads the existing one-line definitions aloud ("Reusable procedures and knowledge"). With the new copy, do not read the slide; read only the contrast between nodes.

---

## 4. Scene 4: APM Moment

### Current vs should teach
Currently: a five-row analogy table, click to reveal notes, a manifest snippet, and "What if we could manage agent dependencies the same way we manage software dependencies?" (`apm.ts:11-12`).
Should teach: APM (microsoft/apm, MIT, pre-1.0, v0.33.0) gives the declare / lock / install / audit loop to the files from scene 3. The analogy to npm is useful for the loop and wrong in detail.

### What is good
The row data is the most accurate copy in the app (real filenames, real SHAs, honest "no command named dependency validation"). Keep the structure.

### Offending strings
- `apm.ts:11-12` APM_QUESTION: APM already exists, so "What if we could" is a staged rhetorical question. It is also the exact marketing register the brief bans. Replace with a fact.
- `apm.ts:9` ANALOGY_DISCLAIMER "Conceptual analogies, not functional identity. APM is not npm for agents." Honest, but it contradicts the talk subtitle and says only what APM is not.
- `apm.ts:40-41` row `dependencies`: traditional "Dependencies" ≈ agentic "Agentic dependencies". Tautology. The note is informative (7 primitive types), the row label is not.
- `apm.ts:35-38` `ci` row maps `npm ci` to `apm audit --ci`. Imprecise: `npm ci` installs strictly from the lockfile and errors on mismatch, which is what `apm install --frozen` does. `apm audit --ci` is a validation gate (10 checks per the recorded run). Mapping the wrong pair invites a correction.
- `apm.ts:29-31` lockfile note: "which is stronger than a version number". npm's `package-lock.json` also stores integrity hashes, so "stronger than npm" is false; the verified differences are: commit SHA and ref for a git source, SHA-256 per deployed FILE, and a ledger of where files landed.
- Note lengths: lockfile note ~35 words, dependencies note ~28, ci note ~35. Over the 25-word limit; unreadable on a projector.
- `ComparisonTable.tsx:43` "Click a row to see the analogy." Instructional, not informative; empty state shows nothing before the first click, so the right panel is blank while the speaker introduces the scene.
- `apm.ts:49-54` snippet: only one dependency and `mcp: []`; the scene-3 point ("skills, MCP, subagents") is invisible in the manifest.

### Replacement copy

Header:
- title: `Declare it. Lock it. Install it. Audit it.`
- goal: `APM (microsoft/apm, MIT, pre-1.0) applies the package-manager loop to agent files. Analogy, not equivalence: its packages are instructions, skills, agents, prompts, hooks and MCP servers.`
  (if that is >25 words trim: `APM applies the package-manager loop to agent files. The loop is the analogy; the contents are different.`)

Disclaimer badge (`ANALOGY_DISCLAIMER`): `The loop rhymes with npm. The packages do not: these are agent files, not libraries.`

Rows (keep ids; each note <=25 words):
```
manifest      package.json  ≈  apm.yml
  note: "Committed list of what the agent needs: apm packages and MCP servers, as owner/repo#ref."

lockfile      package-lock.json  ≈  apm.lock.yaml
  note: "Pins the resolved commit SHA, plus a SHA-256 hash for every file APM deployed and where it went."

install       npm install  ≈  apm install
  note: "Fetches packages and writes files into .github/, .claude/ and .agents/. Needs -t or targets: in apm.yml."

dependencies  libraries  ≈  agent files   (relabel row)
  traditional: "Libraries"   agentic: "Agent files"
  note: "Instructions, prompts, agents, skills, hooks, plugins, MCP servers. Packages can depend on packages."

ci            npm ci  ≈  apm install --frozen  (+ apm audit --ci)
  traditional: "npm ci"      agentic: "apm install --frozen"
  note: "Fails if apm.lock.yaml is out of sync with apm.yml. apm audit --ci runs 10 checks and exits 1."
```
Remove "There is no command literally named dependency validation" from the slide; say it aloud if asked.

Empty-state panel text (replace "Click a row to see the analogy."): `package.json lists libraries. apm.yml lists agent instructions, skills and MCP servers.`

Closing line (replace `APM_QUESTION`): `Everything from scene 3 becomes a line in a file you can review in a pull request.`

Snippet (README shape, all keys real; label it): replace `manifestSnippet` with
```
# apm.yml  (shape from the APM README; versions illustrative)
name: payments-service
dependencies:
  apm:
    - microsoft/apm-sample-package#v1.0.0
    - anthropics/skills/skills/frontend-design
  mcp:
    - name: io.github.github/github-mcp-server
      transport: http
```
Sources for each entry: README example block in `docs/apm-research.md` section 2. `payments-service` is an illustrative name. If you prefer zero risk keep only the first dependency line (the one proven in the recorded run) and the comment.

### Screen vs speech
- Screen: filenames and the 25-word notes.
- Speech: pre-1.0 caveat (move one sentence to the badge too: "pre-1.0, flags change"), maintainer/licence, why the npm analogy is only a loop, "no command called dependency validation".
- Disagreement: script (Scene 4) says "Read the short explanation each time"; the old notes are not short. After replacement this is true.

---

## 5. Scene 5: Playground (recorded CLI)

### What is good
Output is real (apm-cli 0.33.0), badge says so (`commands.ts:24`), `SECURITY_NOTE` (`commands.ts:26-27`) is the single most honest sentence in the app: "It does NOT do prompt-injection analysis or semantic review." Keep it.

### Offending strings
- Scene title "Live Playground" (`presentation.ts:13`) and goal "Let the audience try it hands-on, live." Both false (recorded, presenter-driven). See 0.1.
- `AgentLab.tsx:114` "AGENT DEPENDENCY LAB": a brand label with no information; screen real estate better used for the one-sentence task ("A fresh checkout. Install, lock, audit, gate.").
- `AgentLab.tsx:116` `state: dependencies-installed`: internal state-machine id shown to the audience.
- `scenarios.ts` `minute: "1:00 - 3:00"` rendered in "Demo path" (`AgentLab.tsx:134`): presenter timing on the audience's screen.
- Demo-path `say` strings (`scenarios.ts:36-81`) are for the presenter ("Hidden Unicode and integrity only. It is not a prompt-injection scanner.") and double as the on-screen coach. Acceptable content, wrong register for a projector (they are long and sit below the terminal).
- `commands.ts` CI_FAIL narration `# a teammate adds example/engineering-skills (placeholder name from the recorded run)`: honest, but the placeholder is a 404 repo (research claim 12). OK as long as the label stays; consider a real name or a stub like `your-org/new-skill`.
- `virtualFileSystem.ts` `src/prompt-notes.md`: the file that fails the audit is a fixture (the file comment says so) but the screen does not say "fixture". The reader may think the install produced it.
- Missing payoff: after Install nothing connects the result to scene 1's four warnings. The terminal prints "2 prompts, 2 agents, 2 commands, 2 instructions, 1 skill" and the audience must infer that these are exactly the missing pieces.
- Missing explanation: `[x] 1 of 3 check(s) failed` / `ref-consistency` has no plain-language gloss on screen, while the green run lists 10 check names.

### Replacement copy

Scene header:
- title: `One command rebuilds the agent's environment.`
- goal: `Recorded run of apm-cli 0.33.0: install, lock, audit, then a CI gate that fails on drift.`
  (title in `presentation.ts:13` rename "Live Playground" to "Recorded Run"; keep scene id 5.)

Lab header: replace "AGENT DEPENDENCY LAB" with `FRESH CHECKOUT → INSTALL → LOCK → AUDIT → CI GATE` (hide `state:` line, or show only under a presenter flag).

Demo-path bar: drop `minute` from the audience view; keep `title` and `say`.

`say` rewrites (<=25 words each, audience-safe):
```
Install:   "One command writes instructions, skills and agents into .github/, .claude/ and .agents/. This is what scene 1 was missing."
Inspect:   "apm.lock.yaml pins each package to a commit SHA and records a SHA-256 hash for every file it deployed."
Security:  "Scans deployed files for hidden Unicode and checks hashes and drift. It does not detect prompt injection."
CI:        "apm.yml gained a dependency that was never installed. apm audit --ci and apm install --frozen both exit 1."
Fix:       "Revert the line. The same check now passes all 10 checks and exits 0."
```
Intro (`INTRO_STEP.say`): `The repo declares no agent dependencies and has no agent files. Compare scene 1.`

Post-install annotation line (new, shown after the install output, in the dim style):
`Before: no instructions, skills or tools. After: 2 prompts, 2 agents, 2 commands, 2 instructions, 1 skill, across two tools.`

Fixture note on the security step (`note()` entry, already styled as narration):
`# src/prompt-notes.md is a demo fixture: text pasted from a web page with U+200B and U+202E`

CI gloss (new `note()` before the red result):
`# ref-consistency: every ref in apm.yml must exist in apm.lock.yaml`

Footer note (`AgentLab.tsx:150`): currently `Security: hidden-character and integrity scan. apm audit scans ... Output is replayed from a real run; APM is pre-1.0, so flags and output change between versions.` Keep; remove the duplicated "Output is replayed" (the badge already says RECORDED OUTPUT).

Honest-limits panel (permanent, 3 lines, below terminal):
```
APM does:     install, lock, hash, hidden-Unicode scan, drift check, CI gate
APM does not: detect prompt injection, review semantics, sandbox the agent at runtime
Not shown:    org policy (apm-policy.yml) and MCP trust prompts. Not run in this recording.
```
All three lines are directly from `docs/apm-research.md` section 6.

### Screen vs speech
- Screen: the five `say` lines, the three-line honest-limits panel, recorded badge.
- Speech: what the install timing was (13.9s, network dependent), that `apm list` is scripts not dependencies (gotcha, only if asked), the placeholder dependency name, the Reset instructions, keyboard caveats (Space advances scene).
- Disagreements: script Scene 5 headings "(Phase 3)" and "0:00-1:00 the problem" fine; the script says "Point at the Explorer: .github/, .claude/, .agents/skills/ and apm_modules/ appear". Verify the explorer actually shows `apm_modules/`; research says it exists and is gitignored, `virtualFileSystem.ts` may collapse it with a summary. If it shows a summary only, say so.

---

## 6. Scene 6: Software Delivery

### Current vs should teach
Currently: seven nouns in a row that light up in sequence (`delivery.ts:1-9`), a caption "APM covers part of the problem. Reliable delivery also needs evals, tests, security controls and human oversight." (`:14-15`), a closing quote, and a QR code placeholder.
Should teach: where each check sits, which are APM (verified), which are partial, which are yours to build. The honest boundary is the content of this scene and it currently lives only in a caption.

### Offending strings
- `delivery.ts:2-8` seven labels, zero information. "Agent Context" = what? "Dependency Resolution" = which tool? The script (Scene 6) asks the speaker to "narrate each step in one phrase", i.e. the script carries ALL the information; the screen carries none.
- `delivery.ts:5` "Security Scan": research claim 18 is PARTIAL; the recommended label is "Integrity and content scan". Calling it Security Scan overstates APM (the room will hear prompt-injection scanning).
- `delivery.ts:6` "Agent Evals": not an APM feature (claim 16). Presented in the same visual style as APM steps with no marker, so it reads as if APM does it.
- `delivery.ts:14-15` PIPELINE_CAPTION: correct but generic and tiny, and the only place the boundary appears.
- `delivery.ts:17-18` CLOSING_QUOTE: a slogan. "The same discipline" is the empty part. Acceptable as the last spoken line; weak as the only on-screen takeaway.
- `06-SoftwareDelivery.tsx:19-20` the QR image alt "QR code placeholder: final link not available yet" and the caption "Placeholder. Real link after deploy." are VISIBLE. If shipped, the last thing the audience sees is a dead QR with an apology. Also the `// TODO` at `:6`. P0 before the talk.
- No leave-with-something: the goal says audiences should leave with something to explore; the only link is the placeholder QR. The repo (github.com/microsoft/apm) is never printed.
- Scene header "Software Delivery" / goal "Connect reproducible agent setups to shipping software." generic.

### Replacement copy

Header:
- title: `Where agent context fits in your delivery pipeline.`
- goal: `Five of these checks APM can run. Two it cannot. Human review stays yours.` (adjust the count once the step list is fixed; with the list below: APM runs 1, 2, 3, 4 partially, 6; evals and review do not.)
  Simpler: `APM handles context, locking, integrity and the CI gate. Evals and review are yours to build.`

Pipeline steps. Change `pipelineSteps` from `string[]` to objects `{label, check, apm}` and render the `check` line under the dot, with a tag (`APM` solid / `PARTIAL` outline / `YOURS` dashed). Max 25 words on `check`.

```
1 Developer              apm:yes
  "Edits apm.yml and agent rules in the same pull request as the code."
2 Agent Context          apm:yes
  "apm install writes instructions, skills and agents into .github/, .claude/ and .agents/."
3 Dependency Lock        apm:yes   (rename from "Dependency Resolution")
  "apm.lock.yaml pins commit SHAs and a SHA-256 hash per deployed file."
4 Integrity Scan         apm:partial   (rename from "Security Scan")
  "apm audit: hidden Unicode, hash mismatch, drift. Not prompt-injection detection."
5 Agent Evals            apm:no
  "Run a fixed task set against the configured agent and compare results. You build this; APM has no evals."
6 CI Gate                apm:yes
  "apm audit --ci exits 1 if apm.yml and apm.lock.yaml disagree. Runs via microsoft/apm-action@v1."
7 Human Review           apm:no    (rename from "CI/CD Pipeline" + "Software Delivery"; merge them)
  "A person reads the diff before merge. Tests and runtime permissions still apply."
```
Notes:
- The original has both "CI/CD Pipeline" and "Software Delivery" as separate steps; the second is an outcome, not a check. Merging lets "Human Review" appear in the chain, which the caption promises but the pipeline omits.
- "APM does not govern the runtime plane (permissions, sandboxing)" is in the docs; put it in the speech or as a footnote: `APM does not sandbox the agent at runtime.`
- Step 5's eval example is deliberately generic. Do not name an eval tool unless you have verified it; none is verified here.
- `microsoft/apm-action@v1` is from the APM docs (research doc section 1); `setup-only: true` then `apm audit --ci`.

Caption (replace `PIPELINE_CAPTION`):
`APM handles steps 1 to 4 and 6. It does not evaluate agent quality, sandbox the runtime, or replace code review.`
(Step 4 is partial; spoken: "partial: hashes and hidden characters, not intent".)

Closing: keep `CLOSING_QUOTE`, preceded by a concrete takeaway block (visible, replaces the QR apology):
```
Try this Monday
1. apm init            (creates apm.yml)
2. apm install owner/repo#tag -t claude,copilot
3. apm audit --ci      (add it to CI)
github.com/microsoft/apm   ·   MIT   ·   pre-1.0
```
All commands verified in `docs/apm-research.md` (init, install with -t, audit --ci; repo, licence, pre-1.0). Remove the placeholder QR until `public/qr-code.svg` is real; if kept, drop the figcaption.

### Screen vs speech
- Screen: step label + one-line check + APM/PARTIAL/YOURS tag; caption; "Try this Monday" block; repo URL.
- Speech: the story of what each step catches ("a hash mismatch means someone changed a skill after review"), the closing quote delivery, questions.
- Disagreement: script says "Narrate each step in one phrase while it lights"; today the screen gives the speaker nothing to point at. With the new copy the speaker reads the TAG, not the sentence.

---

## 7. Presenter speech vs on-screen: global split

On slide (audience reads it in 3 seconds): claim headline; real file names and commands; one-line definition; the APM / PARTIAL / YOURS tag; the "illustrative" and "recorded" badges; the honest-limits strip.

Only spoken (docs/talk-script.md): the narrative ("you clone, you install"), pacing and timings, how to click, fallback ("press 6"), transitions, caveats that apply only if asked (Cursor/Copilot AGENTS.md reading, `apm list` gotcha, install time), humour, and the closing quote delivery.

Must NOT be on screen at all: scene goal as stage direction, "Scene N / M min", `state: dependencies-installed`, `1:00 - 3:00`, "Placeholder. Real link after deploy.", "Click a row to see the analogy.".

Script/screen disagreements found:
1. Script S1: "This is the agent's real dependency graph today." Screen: illustrative animation. Reword the script.
2. Script S2: Dave/Codex presented as the AGENTS.md user. Other tools also read AGENTS.md (verified).
3. Script S2: "I made these up". Screen has the badge, but only after pressing Run Same Task, and the setups (config panels) are real-shaped but presented without a label; label the whole scene illustrative.
4. Script S3: reads definitions aloud; screen definitions will change.
5. Script S4: "Say the CI row precisely: no command called dependency validation". Fine, but the row maps npm ci to `apm audit --ci`; the script should point at `apm install --frozen` as the closer analogue.
6. Script S5: "Press P ... Live" vs on-screen title "Live Playground" while the badge says RECORDED OUTPUT. The scene title contradicts the badge.
7. Script S6: talk of step narration; the screen steps have no content. Also script mentions "Agent Evals" without clarifying that APM doesn't provide them.
8. `docs/talk-script.md` header says playground is "Phase 3"; remove from audience-visible text if it leaks.

---

## 8. Prioritized fix list

P0 = misleading or empty (fix before presenting). Format: replacement -> file : key.

| # | Priority | Replacement | File : key |
| --- | --- | --- | --- |
| 1 | P0 | Scene 5 title "Live Playground" -> "Recorded Run"; goal -> "Recorded run of apm-cli 0.33.0: install, lock, audit, then a CI gate that fails on drift." | `src/data/presentation.ts` : scenes[4].title / goal |
| 2 | P0 | Stop rendering `scene.goal` stage directions; replace all six goals with supporting facts (sections 1-6) | `src/data/presentation.ts` : scenes[*].goal ; `SceneView.tsx` |
| 3 | P0 | Hide "Scene N / M min" from the audience view | `src/components/SceneView/SceneView.tsx` : `scene__meta` |
| 4 | P0 | Remove visible QR placeholder + "Placeholder. Real link after deploy."; add "Try this Monday" block with repo URL | `src/scenes/06-SoftwareDelivery.tsx` : `closing__qr` ; `src/data/delivery.ts` |
| 5 | P0 | Rename "Security Scan" -> "Integrity Scan" (tag PARTIAL); tag "Agent Evals" as YOURS | `src/data/delivery.ts` : `pipelineSteps[3]`, `[4]` |
| 6 | P0 | Remove `tools: "Editor context only; no shell, ..."` for Bob (UNVERIFIED/likely false) | `src/data/agentConfigs.ts` : developers[bob].output.tools (line ~56) |
| 7 | P0 | Fix `ci` row: pair `npm ci` with `apm install --frozen`; keep `apm audit --ci` as the gate in the note | `src/data/apm.ts` : analogyRows[ci] |
| 8 | P0 | Drop "which is stronger than a version number" (npm lockfile also has integrity hashes) | `src/data/apm.ts` : analogyRows[lockfile].note |
| 9 | P0 | Script S1 wording: not "real dependency graph" | `docs/talk-script.md` : Scene 1 |
| 10 | P1 | Hook warnings -> file-named strings (4 lines, section 1) incl. removing the duplicate "coding standards" | `src/data/hook.ts` : hookLines[6..9] |
| 11 | P1 | Hook terminal: `acme/payments-service`, `claude "add a refund endpoint"`, "Illustrative terminal" badge | `src/data/hook.ts` : hookLines[0..5]; `src/scenes/01-Hook.tsx` |
| 12 | P1 | Hook quote second line -> "What gives every agent the same context?" | `src/scenes/01-Hook.tsx` : ~line 42-44 |
| 13 | P1 | Scene 2 developers: summaries, config with real file names, outputs with code tokens, add `why` | `src/data/agentConfigs.ts` : developers[*]; add `why` to `DeveloperSetup`; render in `DeveloperComparison.tsx` |
| 14 | P1 | Keep config panel visible alongside outputs (or show `why`) | `src/components/DeveloperComparison/DeveloperComparison.tsx` : `ran` branch |
| 15 | P1 | `CONCLUSION` -> "Four pull requests, four conventions. Nothing in git says which agent context produced which." | `src/data/agentConfigs.ts` : CONCLUSION |
| 16 | P1 | Scene 3 nodes: new `definition` + `lives` + `example`; rename "Agents" -> "Subagents", "Project Context" -> "Agent Context"; add `lives` rendering | `src/data/agentStack.ts` : agentNode, capabilityNodes, contextNode; `StackDiagram.tsx` |
| 17 | P1 | `STACK_MESSAGE` -> "If any one file differs, the agent's environment differs. That is the dependency problem." | `src/data/agentStack.ts` : STACK_MESSAGE |
| 18 | P1 | Scene 4 notes: rewrite to <=25 words (section 4); relabel `dependencies` row | `src/data/apm.ts` : analogyRows[*].note |
| 19 | P1 | `APM_QUESTION` -> factual closing line; update empty panel text | `src/data/apm.ts` : APM_QUESTION; `ComparisonTable.tsx:43` |
| 20 | P1 | Scene 6 pipeline: objects with `check` and `apm` tag; merge CI/CD+Delivery into "Human Review"; new caption | `src/data/delivery.ts` : pipelineSteps, PIPELINE_CAPTION; `PipelineVisualizer.tsx` |
| 21 | P1 | Playground `say` lines -> audience-safe; hide `minute` and `state:` from the audience view | `src/playground/scenarios.ts` : demoSteps[*].say, INTRO_STEP; `AgentLab.tsx:116,134` |
| 22 | P1 | Add post-install "Before/After" note, fixture note, ref-consistency gloss as `note()` entries | `src/playground/commands.ts` : INSTALL, SECURITY, CI_FAIL |
| 23 | P1 | Honest-limits 3-line panel (does / does not / not shown) | `src/components/AgentLab/AgentLab.tsx` : near `lab__note` |
| 24 | P2 | Replace "AGENT DEPENDENCY LAB" with the five-step flow line | `src/components/AgentLab/AgentLab.tsx:114` |
| 25 | P2 | Drop duplicate "Output is replayed from a real run" in footer | `src/components/AgentLab/AgentLab.tsx:150` |
| 26 | P2 | Scene titles -> claim headlines (sections 1-6) | `src/data/presentation.ts` : scenes[*].title |
| 27 | P2 | Add "Where each tool reads instructions" table to scene 2 (verified facts) | new data in `src/data/agentConfigs.ts` |
| 28 | P2 | Show the talk title on a cover or footer; decide "npm moment" vs "not npm" stance | `src/data/presentation.ts` / `src/App.tsx` |
| 29 | P2 | Disagreement fixes 2-8 in section 7 | `docs/talk-script.md` |

Structural implications for the developer: three type changes (`DeveloperSetup.why`, `StackNode.lives`, `pipelineSteps` -> objects with `check` and `apm`), tests in `src/scenes/content.test.tsx`, `src/data/presentation.test.ts` and `src/App.test.tsx` that assert the old strings will need updating.

## 9. Not verified, not used

- Skills and subagent file locations for Copilot, Cursor, Codex (UNVERIFIED).
- `~/.claude/skills/...` and `~/.claude/CLAUDE.md` are documented as personal scope (skills page confirmed; the `~/.claude/CLAUDE.md` path is standard but the memory page was only read in part).
- Cursor agent shell access (claim removed).
- Whether `apm_modules/` appears in the in-app Explorer (check `virtualFileSystem.ts` build output on screen).
- Any named eval framework (none verified; none used).
