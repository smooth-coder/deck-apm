import { act, renderHook } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { useSceneNavigation } from "./useSceneNavigation";

const press = (key: string, init: KeyboardEventInit = {}) =>
  act(() => {
    fireEvent.keyDown(window, { key, ...init });
  });

beforeEach(() => {
  window.location.hash = "";
});

describe("useSceneNavigation", () => {
  it("starts at the first scene when the hash is empty", () => {
    const { result } = renderHook(() => useSceneNavigation(6));
    expect(result.current.index).toBe(0);
  });

  it("starts at the scene given by the hash", () => {
    window.location.hash = "#/scene/3";
    const { result } = renderHook(() => useSceneNavigation(6));
    expect(result.current.index).toBe(2);
  });

  it.each(["ArrowRight", "ArrowDown", " ", "PageDown"])("%s advances", (key) => {
    const { result } = renderHook(() => useSceneNavigation(6));
    press(key);
    expect(result.current.index).toBe(1);
  });

  it.each(["ArrowLeft", "ArrowUp", "PageUp"])("%s goes back", (key) => {
    window.location.hash = "#/scene/3";
    const { result } = renderHook(() => useSceneNavigation(6));
    press(key);
    expect(result.current.index).toBe(1);
  });

  it("clamps at both ends", () => {
    const { result } = renderHook(() => useSceneNavigation(6));
    press("ArrowLeft");
    expect(result.current.index).toBe(0);
    for (let i = 0; i < 10; i++) press("ArrowRight");
    expect(result.current.index).toBe(5);
  });

  it("jumps with number keys and P", () => {
    const { result } = renderHook(() => useSceneNavigation(6));
    press("4");
    expect(result.current.index).toBe(3);
    press("p");
    expect(result.current.index).toBe(5);
  });

  it("writes the current scene to the URL hash", () => {
    const { result } = renderHook(() => useSceneNavigation(6));
    press("ArrowRight");
    expect(window.location.hash).toBe("#/scene/2");
    act(() => result.current.goTo(5));
    expect(window.location.hash).toBe("#/scene/6");
  });

  it("follows hashchange events", () => {
    const { result } = renderHook(() => useSceneNavigation(6));
    act(() => {
      window.location.hash = "#/scene/4";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(result.current.index).toBe(3);
  });

  it("ignores keys with modifiers and keys typed into inputs", () => {
    const { result } = renderHook(() => useSceneNavigation(6));
    press("ArrowRight", { metaKey: true });
    press("ArrowRight", { ctrlKey: true });
    expect(result.current.index).toBe(0);
    const input = document.createElement("input");
    document.body.append(input);
    act(() => {
      fireEvent.keyDown(input, { key: "ArrowRight" });
    });
    expect(result.current.index).toBe(0);
    input.remove();
  });

  describe("interactive elements", () => {
    const fireOn = (el: Element, key: string) =>
      act(() => {
        fireEvent.keyDown(el, { key });
      });
    const mount = (html: string) => {
      const host = document.createElement("div");
      host.innerHTML = html;
      document.body.append(host);
      return host;
    };

    it.each([
      ["button", "<button>Go</button>"],
      ["link", '<a href="#x">Go</a>'],
      ["role=button", '<div role="button" tabindex="0">Go</div>'],
      ["child of a button", "<button><span>Go</span></button>"],
    ])("Space and Enter on a %s do not navigate", (_name, html) => {
      const { result } = renderHook(() => useSceneNavigation(6));
      const host = mount(html);
      const target = host.querySelector("span") ?? (host.firstElementChild as Element);
      fireOn(target, " ");
      fireOn(target, "Enter");
      expect(result.current.index).toBe(0);
      host.remove();
    });

    it("does not call preventDefault, so the button still clicks", () => {
      renderHook(() => useSceneNavigation(6));
      const host = mount("<button>Go</button>");
      const button = host.querySelector("button") as HTMLButtonElement;
      const notCancelled = fireEvent.keyDown(button, { key: " " });
      expect(notCancelled).toBe(true);
      host.remove();
    });

    it("still navigates with arrows, number keys and P from a focused button", () => {
      const { result } = renderHook(() => useSceneNavigation(6));
      const host = mount("<button>Go</button>");
      const button = host.querySelector("button") as HTMLButtonElement;
      fireOn(button, "ArrowRight");
      expect(result.current.index).toBe(1);
      fireOn(button, "4");
      expect(result.current.index).toBe(3);
      fireOn(button, "p");
      expect(result.current.index).toBe(5);
      host.remove();
    });

    it("Space on the page body still advances", () => {
      const { result } = renderHook(() => useSceneNavigation(6));
      fireOn(document.body, " ");
      expect(result.current.index).toBe(1);
    });
  });

  it("calls the fullscreen toggle on F", () => {
    const toggle = vi.fn().mockResolvedValue(true);
    renderHook(() => useSceneNavigation(6, { toggleFullscreen: toggle }));
    press("f");
    expect(toggle).toHaveBeenCalledOnce();
  });
});
