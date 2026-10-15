# Recording scripts

`src/playground/recorded.ts` holds terminal output copied verbatim from a real `apm-cli` session. These scripts regenerate it.

| Script | Does |
| --- | --- |
| `record.sh` | In a `mktemp -d` directory: creates a venv (`uv venv`), installs `apm-cli==$APM_VERSION`, runs the scripted session, writes outputs to `<tmp>/out`. Writes nothing into the project. |
| `gen_recorded.py` | Reads `<tmp>/out` and writes `src/playground/recorded.ts`. The only step that touches the project. |

## Re-record

```sh
pnpm record                      # runs record.sh, prints the out dir
python3 -I scripts/gen_recorded.py /tmp/apmrec.XXXXXX/out
pnpm test && pnpm typecheck && pnpm build
```

`scripts/record.sh --help` and `--dry-run` change nothing. Requires `uv`, `python3` and network access. The temp directory is kept (set `KEEP_WORKDIR=0` to delete it).

## When to re-record

APM is pre-1.0: flags and output change between releases. Re-record when you upgrade APM, and before every talk check `apm --version` against `RECORDED_VERSION`. Bump `APM_VERSION` at the top of `record.sh` (or pass `APM_VERSION=x.y.z`), re-record, then update the copy that cites the version (`docs/apm-research.md`, README, scene 5 copy and tests that assert `0.33.0`, `10 check(s)`, `1 of 3 check(s)`). Install time and the resolved commit of unpinned transitive packages change on every run.

## The two hand edits in the recording

Both are done by small inline Python snippets in `record.sh`, and both must stay explained on screen:

1. Uncomment the `targets:` block. `apm init` writes it commented out. Without it (or `-t`), `apm install` exits 2 (`No harness detected`). The recording pins `copilot` and `claude`, so the install command needs no `-t`.
2. Add `example/engineering-skills` to `dependencies.apm` without installing it. This is the failing CI case. The package is a PLACEHOLDER: `github.com/example/engineering-skills` returns 404. The manifest shape is real; the package is not. If you replace it with a real package, `apm audit --ci` may then behave differently, so re-check the output.

The fixture `src/pasted-prompt.md` (text with U+200B and U+202E) is written by `printf` in the script; it is a demo fixture, not something `apm install` produces.

## TODO

- Replace `public/qr-code.svg` with a real QR code once the deployed URL exists, then decide whether to show it on scene 6 again (the visible placeholder was removed from the slide).
