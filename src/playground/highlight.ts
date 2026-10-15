/** Tiny YAML/Markdown line tinter for the read-only viewer. No dependencies on purpose. */
export type TokenKind = "plain" | "comment" | "key" | "string" | "marker";

export interface Token {
  readonly kind: TokenKind;
  readonly text: string;
}

const KEY_LINE = /^(\s*(?:- )?)([A-Za-z_][\w.-]*)(:)(.*)$/;
const HIDDEN = /(<U\+[0-9A-F]{4}>)/;

function tintValue(value: string): Token[] {
  const hash = value.indexOf(" #");
  const body = hash === -1 ? value : value.slice(0, hash);
  const tokens: Token[] = [];
  for (const part of body.split(HIDDEN)) {
    if (part === "") continue;
    tokens.push({ kind: HIDDEN.test(part) ? "marker" : "string", text: part });
  }
  if (hash !== -1) tokens.push({ kind: "comment", text: value.slice(hash) });
  return tokens;
}

export function tintLine(line: string): Token[] {
  if (/^\s*#/.test(line)) {
    return [{ kind: "comment", text: line }];
  }
  const match = KEY_LINE.exec(line);
  if (match) {
    const [, indent = "", key = "", colon = "", rest = ""] = match;
    return [
      { kind: "plain", text: indent },
      { kind: "key", text: key },
      { kind: "plain", text: colon },
      ...tintValue(rest),
    ];
  }
  const tokens: Token[] = [];
  for (const part of line.split(HIDDEN)) {
    if (part === "") continue;
    tokens.push({ kind: HIDDEN.test(part) ? "marker" : "plain", text: part });
  }
  return tokens.length > 0 ? tokens : [{ kind: "plain", text: "" }];
}
