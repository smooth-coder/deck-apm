export interface AnalogyRow {
  readonly id: string;
  readonly traditional: string;
  readonly agentic: string;
  /** Max ~25 words, projector-short. */
  readonly note: string;
}

export const ANALOGY_DISCLAIMER =
  "The loop rhymes with npm; the packages do not. Pre-1.0: flags change.";

export const APM_CLOSING =
  "Every agent file from the previous slide becomes a line you can review in a pull request.";

export const EMPTY_NOTE =
  "package.json lists libraries. apm.yml lists agent instructions, skills and MCP servers.";

export const analogyRows: readonly AnalogyRow[] = [
  {
    id: "manifest",
    traditional: "package.json",
    agentic: "apm.yml",
    note: "Committed list of what the agent needs: APM packages and MCP servers, as owner/repo#ref.",
  },
  {
    id: "lockfile",
    traditional: "package-lock.json",
    agentic: "apm.lock.yaml",
    note: "Pins the resolved commit SHA, plus a SHA-256 hash for every file APM deployed and where it went.",
  },
  {
    id: "install",
    traditional: "npm install",
    agentic: "apm install",
    note: "Fetches packages and writes files into .github/, .claude/ and .agents/. Pass -t or set targets: in apm.yml.",
  },
  {
    id: "dependencies",
    traditional: "Libraries",
    agentic: "Agent files",
    note: "Instructions, prompts, agents, skills, hooks, plugins, MCP servers. Packages can depend on packages.",
  },
  {
    id: "ci",
    traditional: "npm ci",
    agentic: "apm install --frozen",
    note: "Fails if apm.lock.yaml is out of sync with apm.yml. apm audit --ci runs 10 checks and exits 1.",
  },
];

/** apm.yml shape from the APM README (docs/apm-research.md, section 2); package refs are examples. */
export const manifestSnippet = `# apm.yml (shape from the APM README; refs illustrative)
name: payments-service
version: 1.0.0
dependencies:
  apm:
    - microsoft/apm-sample-package#v1.0.0
    - anthropics/skills/skills/frontend-design
  mcp:
    - name: io.github.github/github-mcp-server
      transport: http`;
