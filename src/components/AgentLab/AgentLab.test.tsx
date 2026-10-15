import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AgentLab } from "./AgentLab";

beforeEach(() => {
  // Reduced motion: terminal output appears instantly.
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: true,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

afterEach(() => vi.unstubAllGlobals());

const button = (name: RegExp | string) => screen.getByRole("button", { name });
const log = () => screen.getByRole("log", { name: "Terminal output" });

describe("AgentLab", () => {
  it("labels the output as recorded and highlights Install as the next step", () => {
    render(<AgentLab />);
    expect(screen.getByText("RECORDED OUTPUT · apm-cli 0.33.0")).toBeInTheDocument();
    expect(button("Install")).toHaveAttribute("data-recommended", "true");
    expect(screen.getByText(/Demo path/)).toBeInTheDocument();
    expect(screen.getByText(/FRESH CHECKOUT/)).toBeInTheDocument();
    expect(screen.queryByText(/state:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\d:\d\d - \d:\d\d/)).not.toBeInTheDocument();
  });

  it("walks the whole demo and resets exactly to the initial state", async () => {
    const user = userEvent.setup();
    render(<AgentLab />);

    await user.click(button("Install"));
    expect(within(log()).getByText(/Installed 2 APM dependencies/)).toBeInTheDocument();
    expect(within(log()).getByText(/Before: no instructions, skills or tools/)).toBeInTheDocument();
    expect(button("Inspect Lockfile")).toHaveAttribute("data-recommended", "true");

    await user.click(button("Inspect Lockfile"));
    expect(screen.getAllByText(/resolved_commit/).length).toBeGreaterThan(0);

    await user.click(button("Security"));
    expect(within(log()).getByText(/Right-to-left override \(RLO\)/)).toBeInTheDocument();
    expect(screen.getByText(/detect prompt injection, review semantics/)).toBeInTheDocument();
    expect(within(log()).getByText(/demo fixture/)).toBeInTheDocument();

    await user.click(button("CI Validation"));
    expect(within(log()).getByText(/1 of 3 check\(s\) failed/)).toBeInTheDocument();
    expect(within(log()).getByText(/ref-consistency: every ref in apm\.yml/)).toBeInTheDocument();
    expect(button("Fix manifest & re-run CI")).toHaveAttribute("data-recommended", "true");

    await user.click(button("Fix manifest & re-run CI"));
    expect(within(log()).getByText(/All 10 check\(s\) passed/)).toBeInTheDocument();
    expect(screen.getByText(/Demo complete/)).toBeInTheDocument();

    await user.click(button("Reset Demo"));
    expect(within(log()).queryByText(/Installed 2/)).not.toBeInTheDocument();
    expect(document.querySelector(".lab__header")).toHaveAttribute("data-state", "initial");
    expect(screen.getByRole("tab", { name: "apm.yml" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByRole("tab")).toHaveLength(1);
    expect(button("Install")).toHaveAttribute("data-recommended", "true");
  });

  it("explains an illegal click instead of running it", async () => {
    const user = userEvent.setup();
    render(<AgentLab />);
    await user.click(button("CI Validation"));
    expect(screen.getByRole("status")).toHaveTextContent("Run Install first");
    expect(within(log()).queryByText(/apm audit --ci/)).not.toBeInTheDocument();
    expect(button("CI Validation")).toHaveAttribute("aria-disabled", "true");
  });
});
