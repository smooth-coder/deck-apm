"""Generate src/playground/recorded.ts from the output directory written by scripts/record.sh.

Usage:
    python3 -I scripts/gen_recorded.py <out-dir>     # <out-dir> is printed by record.sh
    python3 -I scripts/gen_recorded.py --help

This is the only script that writes into the project, and only to src/playground/recorded.ts.
"""

import argparse
import json
import pathlib

DEST = pathlib.Path(__file__).resolve().parent.parent / "src" / "playground" / "recorded.ts"

ENTRIES = [
    ("PRODUCER_INIT_COMMAND", "00-producer-init.command"),
    ("PRODUCER_VERSION_COMMAND", "00-producer-version.command"),
    ("PRODUCER_INIT_MANIFEST", "00-producer-init.yml"),
    ("OUT_PRODUCER_INIT", "00-producer-init.out"),
    ("OUT_PRODUCER_VERSION", "00-producer-version.out"),
    ("MANIFEST_TARGETS", "02-apm.before-install.yml"),
    ("MANIFEST_INSTALLED", "04-apm.after-install.yml"),
    ("MANIFEST_DRIFTED", "09-apm.drifted.yml"),
    ("LOCKFILE", "05-lock.yaml"),
    ("GITIGNORE", "15-gitignore"),
    ("OUT_INSTALL", "03-install.out"),
    ("OUT_DEPS_LIST", "14-deps-list.out"),
    ("OUT_AUDIT", "06-audit.out"),
    ("OUT_AUDIT_FILE", "07-audit-file.out"),
    ("OUT_CI_PASS", "13-ci-pass.out"),
    ("OUT_CI_FAIL", "10-ci-fail.out"),
    ("OUT_FROZEN", "11-frozen.out"),
]

ZWSP = "​"
RLO = "‮"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("out_dir", type=pathlib.Path, help="output directory written by record.sh")
    args = parser.parse_args()
    out = args.out_dir

    def read(name: str) -> str:
        return (out / name).read_text(encoding="utf-8")

    def block(name: str) -> str:
        text = read(name).rstrip("\n")
        return json.dumps(text if name.endswith(".command") else text + "\n", ensure_ascii=False)

    fixture = read("07-fixture.md")
    assert ZWSP in fixture and RLO in fixture, "fixture lost its hidden characters"
    marked = fixture.replace(ZWSP, "<U+200B>").replace(RLO, "<U+202E>")

    version = read("00-version.out").strip()
    exits = dict(line.split() for line in read("exit.txt").strip().splitlines())

    expected_exits = {"producer-init": "0", "producer-version": "0",
                      "install": "0", "deps-list": "0", "audit": "0",
                      "audit-file": "1", "ci-clean": "0", "ci-fail": "1", "frozen": "1", "ci-pass": "0"}
    assert exits == expected_exits, f"recorded workflow did not complete as intended: {exits}"
    producer_exits = {name: int(exits.pop("producer-" + name)) for name in ("init", "version")}
    source_files = json.loads(read("00-team-source.json"))
    deployed_files = json.loads(read("16-deployed.json"))
    commit = read("00-git-commit.out").strip()
    assert len(commit) == 40 and all(c in "0123456789abcdef" for c in commit), "missing real Git commit"
    assert commit in read("05-lock.yaml"), "lockfile did not record the source Git commit"
    assert commit in read("00-producer-version.out"), "producer did not report the consumed Git commit"
    assert read("00-producer-init.yml") != source_files["payments-team/apm.yml"], "init and authored manifests were not captured separately"
    assert "source: local" not in read("05-lock.yaml"), "Git dependency silently became a local dependency"
    assert ".github/mcp.json" in deployed_files, "Copilot CLI MCP configuration was not captured"

    parts = [
        "/** Real CLI/Git captures and authored example files; regenerate with scripts/record.sh. */\n",
        f"export const RECORDED_VERSION = {json.dumps(version)};\n",
        f"export const RECORDED_GIT_COMMIT = {json.dumps(commit)};\n",
        f"export const RECORDED_GIT_CONFIG = {block('00-gitconfig')};\n",
        "export const RECORDED_EXIT = " + json.dumps(exits) + " as const;\n",
        "export const PRODUCER_EXIT = " + json.dumps(producer_exits) + " as const;\n",
        "/** Fixture source with the hidden characters made visible. The real file holds the raw characters. */\n"
        f"export const FIXTURE_MARKED = {json.dumps(marked, ensure_ascii=False)};\n",
        "export const TEAM_SOURCE_FILES: Readonly<Record<string, string>> = " + json.dumps(source_files, ensure_ascii=False) + ";\n",
        "export const DEPLOYED_FILES: Readonly<Record<string, string>> = " + json.dumps(deployed_files, ensure_ascii=False) + ";\n",
    ]
    for const, name in ENTRIES:
        parts.append(f"export const {const} = {block(name)};\n")
    DEST.write_text("\n".join(parts), encoding="utf-8")
    print("ok", DEST)


if __name__ == "__main__":
    main()
