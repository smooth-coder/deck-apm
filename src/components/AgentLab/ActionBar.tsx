import type { ButtonId } from "../../playground/scenarios";

export interface ActionButton {
  readonly id: ButtonId;
  readonly label: string;
  readonly enabled: boolean;
  readonly recommended: boolean;
  /** Why the button is disabled, or what it does. */
  readonly title: string;
}

interface Props {
  buttons: readonly ActionButton[];
  onPress: (id: ButtonId) => void;
}

export function ActionBar({ buttons, onPress }: Props) {
  return (
    <div className="lab-actions" role="group" aria-label="Demo actions">
      {buttons.map((button) => (
        <button
          key={button.id}
          type="button"
          className={button.id === "reset" ? "btn lab-actions__reset" : "btn"}
          aria-disabled={!button.enabled}
          data-recommended={button.recommended ? "true" : undefined}
          title={button.title}
          onClick={() => onPress(button.id)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
