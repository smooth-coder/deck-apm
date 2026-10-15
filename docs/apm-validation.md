# APM claims: validation status

Validated 2026-10-14 (playground re-recorded 2026-10-15) against apm-cli 0.33.0 (released 2026-10-02, pre-1.0). Evidence, sources and real command output live in [`apm-research.md`](./apm-research.md); the claim numbers below refer to its claims table. APM is pre-1.0, so re-check before each talk.

Legend: VERIFIED = true as written, CHANGED = copy was wrong or vague and was fixed, OPEN = still needs a human.

## Scene 4 (APM Moment), `src/data/apm.ts`

- [x] VERIFIED: the manifest is `apm.yml` (claim 1).
- [x] CHANGED: the lockfile is `apm.lock.yaml`; the UI said "APM lockfile" (claim 2).
- [x] VERIFIED: the install command is `apm install` (claim 4).
- [x] CHANGED: "Agentic dependencies" now lists the real types: instructions, prompts, agents, skills, hooks, plugins, MCP servers, plus transitive packages (claim 6).
- [x] CHANGED: the row "Agent dependency validation" now names the real gate, `apm audit --ci` (alternative `apm install --frozen`). No command is literally called "dependency validation" (claim 7). The traditional side is `npm ci`, which also fails on a lockfile mismatch.
- [x] CHANGED: the lockfile pins the commit SHA, ref, version and a SHA-256 hash per deployed file, not only versions (claim 3).
- [x] CHANGED: `manifestSnippet` is now a real apm.yml shape (init output plus the README dependency entry) and the "illustrative, to be validated" marker is gone (claim 12 for the fictional package).
- [x] VERIFIED: install materializes dependencies on a fresh checkout; it needs `-t` (or `targets:` in apm.yml) when no target is detectable. Files land in `.github/`, `.claude/`, `.agents/skills/`, and packages in `apm_modules/` (claims 5, 11, 13).
- [x] VERIFIED: the "conceptual analogies, not functional identity" disclaimer stays (claim 15).

## Scene 5 (Playground), `src/playground/`

- [x] All terminal output and every file shown (apm.yml, the full apm.lock.yaml, .gitignore, deployed paths) comes from ONE real session recorded on 2026-10-15 (`apm-research.md`, "Re-recorded runs"), copied verbatim into `src/playground/recorded.ts`. Nothing is elided or reworded.
- [x] The manifest, the command and the output agree: `apm.yml` has `targets: [copilot, claude]` uncommented, so `apm install microsoft/apm-sample-package#v1.0.0` runs without `-t` (`Targets: claude, copilot  (source: apm.yml)`). With targets commented out the same command exits 2. `apm install` writes the dependency into apm.yml, so the viewer shows the file changing; it never writes `targets:`.
- [x] Sample dependency is `microsoft/apm-sample-package#v1.0.0`. The 404 name `example/engineering-skills` appears only in the recorded failing CI run and is labelled as a placeholder (claim 12).
- [x] The security step is "hidden-character and integrity scan". APM does not detect prompt injection (claim 10, FALSE). The fixture `src/pasted-prompt.md` was created in the recording run with real U+200B and U+202E; the viewer shows it with `<U+XXXX>` markers and the audit output is the real table (`3:30` RLO critical, `2:29` ZWSP warning).
- [x] `apm list` is never used; it lists scripts, not dependencies (claim 14). `apm compile` is not shown as a check (claim 20).
- [x] `apm deps list` is now recorded and shown in the Inspect Lockfile step.
- [ ] OPEN: the output of the fix path `apm install` after editing apm.yml was not recorded; the demo fixes by removing the line instead (CI passes with exit 0 on the restored apm.yml, byte-identical to the post-install one).
- [ ] OPEN: org policy (`apm-policy.yml`, `--policy org`) was not exercised and is not shown.

## Scene 6 (Software Delivery), `src/data/delivery.ts`

- [x] VERIFIED: "APM covers part of the problem". Evals, tests and human oversight are outside APM (claim 16).
- [x] VERIFIED: "Dependency Resolution" is `apm install` / `apm lock` (claim 17).
- [x] CHANGED: "Security Validation" is now "Integrity Scan" tagged PARTIAL; APM only covers hidden Unicode, hash integrity, drift and policy (claim 18).

## Scene 3 and 2

- [x] VERIFIED 2026-10-15 against primary docs: CLAUDE.md is loaded every session as context, not enforced configuration; Claude Code reads AGENTS.md when there is no CLAUDE.md; skills live in `.claude/skills/<name>/SKILL.md` and load by `description`; subagents are Markdown files in `.claude/agents/` with a `tools` allow-list and their own context; project MCP config is `.mcp.json` (Claude Code asks for approval); Copilot reads `.github/copilot-instructions.md` and AGENTS.md; Cursor rules are `.cursor/rules/*.mdc`, Cursor reads AGENTS.md, MCP is `.cursor/mcp.json`; Codex reads AGENTS.md (also `~/.codex`), 32 KiB cap by default.
- [x] DROPPED: the claim that Cursor has "no shell" (unverified). Skills and subagent locations for Copilot, Cursor and Codex are not claimed anywhere.
- [x] Scene 2 setups and outputs are invented and labelled illustrative on screen.

## General

- [ ] OPEN: replace `public/qr-code.svg` with a real QR once the deployed URL is known (the slide no longer shows it).
