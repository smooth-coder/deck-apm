#!/usr/bin/env bash
# Re-records the APM session behind src/playground/recorded.ts (see scripts/README.md).
#
# Everything happens in a throwaway directory created with mktemp -d. Nothing is written into
# the project. Afterwards run `python3 -I scripts/gen_recorded.py <out-dir>` (the path is printed
# at the end), which is the only step that writes src/playground/recorded.ts.
#
# Usage:
#   scripts/record.sh            run the full recording (needs uv and network access)
#   scripts/record.sh --help     show this help and exit
#   scripts/record.sh --dry-run  print the plan and exit without touching anything
#
# Environment:
#   APM_VERSION   apm-cli version to install (default below)
#   KEEP_WORKDIR  set to 0 to delete the temp directory on exit (default 1: keep it so that
#                 gen_recorded.py can read the outputs)
set -euo pipefail

APM_VERSION="${APM_VERSION:-0.33.0}"
KEEP_WORKDIR="${KEEP_WORKDIR:-1}"

usage() { sed -n '2,16p' "$0" | sed 's/^# \{0,1\}//'; }

DRY_RUN=0
case "${1:-}" in
  -h | --help) usage; exit 0 ;;
  --dry-run) DRY_RUN=1 ;;
  "") ;;
  *) echo "unknown argument: $1" >&2; usage >&2; exit 2 ;;
esac

if [ "$DRY_RUN" = 1 ]; then
  echo "Would create a temp dir with mktemp -d, run: uv venv + uv pip install apm-cli==${APM_VERSION},"
  echo "then record: init, install, audit, audit --file, audit --ci (clean, drifted), install --frozen,"
  echo "audit --ci (fixed), deps list. Outputs go to <tmp>/out. Nothing is written to the project."
  exit 0
fi

command -v uv >/dev/null 2>&1 || { echo "uv is required (brew install uv)" >&2; exit 1; }

R="$(mktemp -d "${TMPDIR:-/tmp}/apmrec.XXXXXX")"
[ "$KEEP_WORKDIR" = 0 ] && trap 'rm -rf "$R"' EXIT

# Venv created on demand, inside the temp dir.
uv venv "$R/venv" >/dev/null
uv pip install --python "$R/venv/bin/python" "apm-cli==${APM_VERSION}" >/dev/null
export PATH="$R/venv/bin:$PATH" COLUMNS=120 NO_COLOR=1

mkdir -p "$R/proj" "$R/out"
cd "$R/proj"
O="$R/out"

apm --version > "$O/00-version.out" 2>&1
apm init --yes > "$O/01-init.out" 2>&1 && echo "init 0" >> "$O/exit.txt" || echo "init $?" >> "$O/exit.txt"
cp apm.yml "$O/01-apm.init.yml"

# HAND EDIT 1: uncomment the targets block (apm init writes it commented out).
python3 -I -c "
p='apm.yml';s=open(p).read()
s=s.replace('# targets:','targets:').replace('#   - ','  - ').replace('(uncomment to pin)','(uncommented to pin)')
open(p,'w').write(s)"
cp apm.yml "$O/02-apm.before-install.yml"

# The remaining commands are expected to fail sometimes (exit codes are the recording), so no -e.
set +e
rec() { # rec <label> <outfile> <cmd...>
  local label="$1" out="$2"; shift 2
  "$@" > "$O/$out" 2>&1
  echo "$label $?" >> "$O/exit.txt"
}

rec install 03-install.out apm install microsoft/apm-sample-package#v1.0.0
cp apm.yml "$O/04-apm.after-install.yml"
cp apm.lock.yaml "$O/05-lock.yaml"
rec audit 06-audit.out apm audit

# Fixture: text "pasted from a web page" with U+200B and U+202E.
mkdir -p src
printf '# Review notes\nAlways run the style checker\xe2\x80\x8b before you open a pull request.\nNever skip the design review.\xe2\x80\xae\n' > src/pasted-prompt.md
cp src/pasted-prompt.md "$O/07-fixture.md"
rec audit-file 07-audit-file.out apm audit --file src/pasted-prompt.md
rec ci-clean 08-ci-clean.out apm audit --ci

# HAND EDIT 2: declare a dependency without installing it. example/engineering-skills is a
# PLACEHOLDER (github.com/example/engineering-skills 404s); only the manifest shape is real.
python3 -I -c "
p='apm.yml';s=open(p).read();k='    - microsoft/apm-sample-package#v1.0.0\n';assert k in s
open(p,'w').write(s.replace(k,k+'    - example/engineering-skills\n'))"
cp apm.yml "$O/09-apm.drifted.yml"
rec ci-fail 10-ci-fail.out apm audit --ci
rec frozen 11-frozen.out apm install --frozen

python3 -I -c "
p='apm.yml';s=open(p).read();open(p,'w').write(s.replace('    - example/engineering-skills\n',''))"
cp apm.yml "$O/12-apm.fixed.yml"
rec ci-pass 13-ci-pass.out apm audit --ci
cp .gitignore "$O/15-gitignore"
rec deps-list 14-deps-list.out apm deps list

echo "Recorded into: $O"
echo "Next: python3 -I scripts/gen_recorded.py \"$O\"   (rewrites src/playground/recorded.ts)"
