import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { APMMomentScene } from "./04-APMMoment";
import { AgentStackScene } from "./03-AgentStack";
import { DependencyHellScene } from "./02-DependencyHell";
import { HookScene } from "./01-Hook";
import { SoftwareDeliveryScene } from "./06-SoftwareDelivery";

beforeEach(() => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: true,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

afterEach(() => vi.unstubAllGlobals());

describe("scene content", () => {
  it("hook shows the full sequence and the graph when motion is reduced", () => {
    render(<HookScene />);
    expect(screen.getByText(/What gives every agent the same context/i)).toBeInTheDocument();
    expect(screen.getByText("Illustrative terminal")).toBeInTheDocument();
    expect(screen.getByText(/issue tracker unreachable/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /dependency graph/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Replay" })).toBeInTheDocument();
  });

  it("dependency hell labels setups as illustrative and shows outputs with a why line after Run Same Task", async () => {
    const user = userEvent.setup();
    render(<DependencyHellScene />);
    expect(screen.getByText(/Illustrative setups/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Bob/ }));
    expect(screen.getByText(/Bob's setup/)).toBeInTheDocument();
    expect(screen.getByText(/\.cursor\/rules\/api\.mdc/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Run Same Task" }));
    expect(screen.getByText(/Illustrative setups and outputs, not real model runs/)).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getByText("The rule file describes a different codebase.")).toBeInTheDocument();
    expect(screen.queryByText(/no shell/i)).not.toBeInTheDocument();
  });

  it("agent stack shows definition and file location of the clicked node", async () => {
    const user = userEvent.setup();
    render(<AgentStackScene />);
    await user.click(screen.getByRole("button", { name: "MCP" }));
    expect(screen.getByText(/gives the agent tools and data beyond the repo/i)).toBeInTheDocument();
    expect(screen.getByText(/\.cursor\/mcp\.json/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Subagents" }));
    expect(screen.getByText(/\.claude\/agents\/code-reviewer\.md/)).toBeInTheDocument();
  });

  it("apm table labels analogies and explains the selected row", async () => {
    const user = userEvent.setup();
    render(<APMMomentScene />);
    expect(screen.getByText(/loop rhymes with npm/i)).toBeInTheDocument();
    expect(screen.getByText(/lists agent instructions, skills and MCP servers/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /npm install/ }));
    expect(screen.getByText(/writes files into \.github\//i)).toBeInTheDocument();
    expect(screen.getByText(/apm-sample-package#v1\.0\.0/)).toBeInTheDocument();
    expect(screen.queryByText(/to be validated/)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /apm install --frozen/ }));
    expect(screen.getByText(/apm audit --ci runs 10 checks/)).toBeInTheDocument();
    expect(screen.queryByText(/stronger than a version number/)).not.toBeInTheDocument();
  });

  it("delivery tags every step, shows the caption and the takeaway, and no QR placeholder", () => {
    render(<SoftwareDeliveryScene />);
    const steps = screen.getAllByRole("listitem").filter((li) => li.className === "pipeline__step");
    expect(steps).toHaveLength(7);
    expect(screen.getAllByText("APM")).toHaveLength(4);
    expect(screen.getAllByText("PARTIAL")).toHaveLength(1);
    expect(screen.getAllByText("YOURS")).toHaveLength(2);
    expect(screen.getByText("Integrity Scan")).toBeInTheDocument();
    expect(screen.queryByText("Security Scan")).not.toBeInTheDocument();
    expect(screen.getByText(/APM handles steps 1 to 4 and 6/)).toBeInTheDocument();
    expect(screen.getByText("Try this Monday")).toBeInTheDocument();
    expect(screen.getByText(/github\.com\/microsoft\/apm/)).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /QR code/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Placeholder/)).not.toBeInTheDocument();
  });
});
