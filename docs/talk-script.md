# Talk script: Your AI Agents Have a Dependency Problem (20 minutes)

Budget: 18 min of content + 2 min margin. The recorded run is budgeted at 5 min in `src/data/presentation.ts` (total 18), so the margin is real.

The screen shows only a claim headline, one supporting line, real file names and commands, and the illustrative/recorded badges. Everything else below is spoken. Scene numbers, timings and presenter goals are not rendered anywhere on the slides; they live only here and in `presentation.ts` (`goal`, `durationMin`).

| Scene | Headline on screen | Time | Running |
| --- | --- | --- | --- |
| 1 | Your code is reproducible. Your agents aren't. | 2:00 | 2:00 |
| 2 | Same repo. Same task. Four different pull requests. | 3:00 | 5:00 |
| 3 | Four kinds of agent files. Not interchangeable. | 3:00 | 8:00 |
| 4 | Declare it. Lock it. Install it. Audit it. | 2:00 | 10:00 |
| 5 | One command rebuilds the agent's environment. | 5:00 | 15:00 |
| 6 | Where agent context fits in your delivery pipeline. | 3:00 | 18:00 |
| - | Margin / questions | 2:00 | 20:00 |

Navigation: arrow keys or Space = next, 1-6 = jump, P = jump to the recorded run (scene 5), F = fullscreen.
Fallback if the demo fails or time is short: press **P** only if the demo is ready; otherwise press **6** to skip it and say the recorded run is in the repo.

Do not read slides aloud. The slide carries the file names and the claim; you carry the story.

## Scene 1: Hook (2:00)

Before you start: fullscreen (F), scene 1 loaded. The animation starts by itself and takes about 12 seconds. The terminal is labelled "Illustrative terminal": `acme/payments-service` and the 247 packages are invented.

- Say while lines appear: "You clone a project. You install. Every check passes: 247 packages, all pinned in the lockfile."
- When the warnings show: "Now I ask an agent to do real work. There is no CLAUDE.md or AGENTS.md, no skills, no MCP config, and no manifest or lockfile for any of it."
- On the quote: pause 2 seconds. "npm install gives every developer the same code. What gives every agent the same context?" Spoken version if you want it shorter: "Your code is reproducible. Are your agents?"
- When the warnings turn into a graph: "This is what the agent has to work with: four things, none connected, none declared. It is a staged picture, not a scan of a real project."
- Click: "Skip animation" if you are late. "Replay" to run it again.
- Transition: "Let me show you what that looks like on a team."

## Scene 2: Dependency Hell (3:00)

The setups and the outputs are both invented; a badge says so ("Illustrative setups..."). Say it once out loud too: "I wrote these. Real runs vary, the point is the shape."

- Press **2**. Click each developer in turn (about 20 seconds each). Read the file name, not the summary: Alice (Claude Code, CLAUDE.md plus a skill only on her laptop), Bob (Cursor, `.cursor/rules` copied from another project), Carol (Copilot, `.github/copilot-instructions.md` plus MCP servers set up in her own editor), Dave (Codex, an AGENTS.md two releases old).
- Say: "Same repo. Four people. Four different agent setups, and git recorded none of them."
- Click **Run Same Task**. Walk the four cards on one axis each: conventions, tests, architecture, tool access. Then read the one-line cause under each card.
- Key sentence: "Four pull requests, four conventions. Nothing in git says which agent context produced which."
- Only if asked, the verified facts about where each tool reads instructions (checked against the tools' docs on 2026-10-15):

  | Tool | Instruction files it loads |
  | --- | --- |
  | Claude Code | `CLAUDE.md` (project, or `~/.claude/CLAUDE.md` for you), `.claude/rules/`; reads `AGENTS.md` when there is no `CLAUDE.md` |
  | GitHub Copilot | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `AGENTS.md` |
  | Cursor | `.cursor/rules/*.mdc` (must be `.mdc`), `AGENTS.md` |
  | Codex | `AGENTS.md` (also in `~/.codex`), combined size cap 32 KiB by default |

- Do not say "Dave is the AGENTS.md guy". Say: "AGENTS.md is the common denominator; Copilot and Cursor read it too, and Claude Code can. Each tool also has its own files, and that is where they drift."
- Do not claim what any tool cannot do (for example shell access in Cursor). The slide does not, and neither should you.
- Transition: "To manage this we first need to name the parts."

## Scene 3: Agent Stack (3:00)

Do not read the definitions aloud. The slide has them. Read only the contrast between nodes. File paths shown are Claude Code's unless another tool is named; examples are illustrative.

- Press **3**. Start with AI Agent selected: "The tool and its model. Everything else is what you give it."
- Click **Instructions**: "Loaded every session. Guidance, not enforcement: the model can still ignore it." (Claude Code docs: CLAUDE.md is context, not enforced configuration.) Style guide analogy if you want one.
- Click **Skills**: "Loaded when the description matches the task. Think runbook." Point at `.claude/skills/write-tests/SKILL.md`.
- Click **MCP**: "This one gives the agent hands: it can read the tracker. It is the VPN badge." Point at `.mcp.json` (Claude Code) and `.cursor/mcp.json` (Cursor). Claude Code asks you to approve project servers.
- Click **Subagents**: "A specialist with its own prompt and its own tool allow-list. This reviewer can read but not edit." Point at `.claude/agents/code-reviewer.md`.
- Click **Agent Context**: "All of it, assembled at runtime, differently per tool and per laptop."
- If asked about skills or subagents in Copilot, Cursor or Codex: say you have not verified their file locations and will not guess.
- Key sentence: "If any one file differs, the agent's environment differs. That is the dependency problem."
- Say also: "Today a team manages none of these as dependencies."
- Transition: "We already know how to manage things that must be declared, pinned and installed."

## Scene 4: APM Moment (2:00)

- Press **4**. The badge says it: "The loop rhymes with npm; the packages do not. Pre-1.0: flags change." Add: "APM is microsoft/apm, MIT licensed, v0.33.0. The npm comparison is an analogy for the loop, not a claim that it is npm for agents."
- Click rows one by one: package.json and apm.yml, then the lockfile, then install, then libraries and agent files, then `npm ci` and `apm install --frozen`. The notes are short; let the audience read them.
- Lockfile row: "It pins the commit SHA and a SHA-256 hash for every file APM deployed, and where it put it." Do not say this is stronger than npm: npm's lockfile has integrity hashes too. The difference is that it hashes the deployed files and records the source commit.
- CI row, say it precisely: "`npm ci` installs strictly from the lockfile and fails on a mismatch. The closest APM command is `apm install --frozen`. `apm audit --ci` is the validation gate: it runs 10 checks and exits 1. There is no command literally called dependency validation."
- Point at the snippet: "The shape comes from the APM README. The package refs are examples."
- Closing line on screen: "Every agent file from the previous slide becomes a line you can review in a pull request."
- Facts are checked in `docs/apm-validation.md` (evidence in `docs/apm-research.md`). APM is pre-1.0: re-check before the talk.
- Transition: "Let's look at a real run."

## Scene 5: Recorded run (5:00)

Press **P** (or **5**). Say it out loud: "This is output I recorded from a real `apm-cli` 0.33.0 session, replayed here. It is not live and I am not typing." The badge says RECORDED OUTPUT. Nothing is typed: click the highlighted button. The Demo path bar shows the next step. Keyboard: Tab to a button and press **Enter** or **Space**: both click the focused button and no longer change scene (the global shortcuts ignore Space/Enter on buttons and links). Arrows, 1-9, P and F still navigate, even with a button focused. Click in the terminal or the page background first if you want Space to mean "next scene" again.

The three lines under the buttons are the honest limits: what APM does, what it does not, and what is not shown (org policy and MCP trust prompts were not run in this recording).

- Start: apm.yml pins `targets: [copilot, claude]` but declares no dependencies, no agent files exist. "A fresh checkout: nothing is deployed for any agent. Compare the opening terminal." Say: "I uncommented the targets block by hand; apm init writes it commented out. Without it (or `-t`), install exits 2."
- **Install**: `apm install microsoft/apm-sample-package#v1.0.0` (no `-t`: the manifest already names the targets, the output says `source: apm.yml`). Point at apm.yml: the dependency line is highlighted because install wrote it. Point at the Explorer: `.github/`, `.claude/` and `.agents/skills/` appear with their files. `apm_modules/` is shown as an empty folder labelled git-ignored, not its contents: say so if asked. Read the yellow lines: one transitive dependency is unpinned, a real warning. The terminal ends with "Before / After": the pieces the opening terminal was missing. Install time (about 10 s here) is network dependent.
- **Inspect Lockfile**: the terminal runs `apm deps list`; the viewer opens the complete real `apm.lock.yaml` with the resolved commit SHA, ref, every deployed file and a SHA-256 hash per file. "Pinned by content, not just by version." (`apm list` lists scripts, not dependencies; only mention it if asked.)
- **Security** ("hidden-character and integrity scan"): clean `apm audit` (12 files scanned), then `apm audit --file src/pasted-prompt.md`. The terminal says the file is a demo fixture (U+200B and U+202E, shown as `<U+200B>` markers); the real findings table reports them at 2:29 and 3:30, exit 1. Say: "This is not a prompt-injection scanner. APM does not do that."
- **CI Validation**: apm.yml gets a line that was never installed. The terminal explains `ref-consistency` first. `apm audit --ci` and `apm install --frozen` both exit 1. Expect about 20 lines of output; use Skip typing if short on time. The package name `example/engineering-skills` is a placeholder from the recording (the repo 404s).
- **Fix manifest & re-run CI**: remove the line, `apm audit --ci` passes, 10 checks, exit 0.
- **Reset Demo** restores everything (state, files, terminal, tabs). Use it between runs.
- If it breaks: Reset Demo; if it still breaks say what you expected to see, then press **6**.
- To re-record after an APM upgrade, see `scripts/README.md`.

## Scene 6: Software Delivery (3:00)

- Press **6**. The pipeline lights up step by step. Each row has a tag. Read the TAG, not the sentence: APM, PARTIAL or YOURS.
- Developer, Agent Context, Dependency Lock: "APM." Integrity Scan: "Partial: hashes and hidden characters, not intent. A hash mismatch means someone changed a skill after review." Agent Evals: "Yours. APM has no evals; you build a fixed task set and compare results." CI Gate: "APM, via `apm audit --ci` or the `microsoft/apm-action@v1` action." Human Review: "Yours. A person reads the diff."
- Click **Replay** if you were talking over it.
- Caption, read it as a limit, not a pitch: "APM handles steps 1 to 4 and 6. It does not evaluate agent quality, sandbox the runtime, or replace code review." Add: "APM does not govern the runtime plane: permissions, sandboxing."
- "Try this Monday" block: `apm init`, `apm install owner/repo#tag -t claude,copilot`, `apm audit --ci`. Repo: github.com/microsoft/apm, MIT, pre-1.0.
- Closing quote, slowly: "We version our code. We lock our dependencies. Now it's time to engineer our AI agents with the same discipline."
- Leave this slide up for questions. The QR code is not shown: `public/qr-code.svg` is a placeholder until the deployed URL exists (see the TODO in `README.md`).

## Margin (2:00)

Use it for questions or to absorb overruns in scenes 2 and 5. If you are more than 1 minute behind after scene 3, cut the Run Same Task walk-through to two cards.
