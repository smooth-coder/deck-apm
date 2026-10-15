import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AgentLab } from "./AgentLab";
import { UNLOCKED_DEPENDENCY } from "../../playground/virtualFileSystem";

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

  it("validates the clean install before the optional manifest failure, then recovers and resets", async () => {
    const user = userEvent.setup();
    render(<AgentLab />);
    const viewer = screen.getByRole("region", { name: "File viewer" });

    await user.click(button("Install"));
    expect(log()).toBeVisible();
    expect(viewer).not.toBeVisible();
    await user.click(button("Inspect Lockfile"));
    expect(viewer).toBeVisible();
    expect(screen.getByRole("tab", { name: "apm.lock.yaml" })).toHaveAttribute("aria-selected", "true");
    expect(screen.queryByRole("log", { name: "Terminal output" })).not.toBeInTheDocument();

    expect(button("Run CI checks")).toHaveAttribute("aria-disabled", "false");
    expect(screen.queryByRole("button", { name: "Add dependency without installing" })).not.toBeInTheDocument();
    await user.click(button("Run CI checks"));
    expect(log()).toBeVisible();
    await user.click(screen.getByText("Optional: show an incomplete dependency change"));
    await user.click(button("Add dependency without installing"));
    expect(viewer).toBeVisible();
    expect(screen.queryByRole("log", { name: "Terminal output" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Contents of payments-service/apm.yml")).toHaveTextContent(UNLOCKED_DEPENDENCY);
    expect(button("Run CI checks")).toHaveAttribute("aria-disabled", "false");
    await user.click(button("Run CI checks"));
    expect(log()).toBeVisible();

    await user.click(button("Fix manifest & re-run CI"));
    await user.click(button("File view"));
    expect(screen.getByLabelText("Contents of payments-service/apm.yml")).not.toHaveTextContent(UNLOCKED_DEPENDENCY);

    await user.click(button("Reset Demo"));
    expect(screen.getAllByRole("tab")).toHaveLength(1);
    expect(button("Install")).toHaveAttribute("aria-disabled", "false");
    expect(button("Run CI checks")).toHaveAttribute("aria-disabled", "true");
  });

  it("keeps the Unicode scan available as a separate branch before CI", async () => {
    const user = userEvent.setup();
    render(<AgentLab />);
    await user.click(button("Install"));
    await user.click(button("Inspect Lockfile"));
    await user.click(screen.getByText("Backup: Unicode scan and scope limits"));
    await user.click(button("Scan hidden Unicode"));
    await user.click(button("File view"));
    expect(screen.getByLabelText("Contents of payments-service/src/pasted-prompt.md")).toBeVisible();
    expect(screen.queryByRole("button", { name: "Add dependency without installing" })).not.toBeInTheDocument();
    expect(button("Run CI checks")).toHaveAttribute("aria-disabled", "false");
  });

});
