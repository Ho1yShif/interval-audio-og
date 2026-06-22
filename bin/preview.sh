#!/usr/bin/env bash
# Serve the site locally.
#
#   bin/preview.sh            Vite dev server with hot reload (HMR) — edits to
#                             source files update the browser instantly.
#
#   bin/preview.sh prod       Build the static site and serve dist/. This mirrors
#                             what ships to production, so there is NO hot reload.
#
# Extra args are forwarded to the underlying npm script, e.g.
#   bin/preview.sh -- --port 4000
#   bin/preview.sh prod -- --port 4000
set -euo pipefail

cd "$(dirname "$0")/.."

npm install

# The site is served from a base path (matches the GitHub Pages project URL),
# so the app lives under this sub-path rather than "/".
echo "NOTE: the site is served under /interval-audio-og/ — open the URL Vite prints, not bare localhost:PORT/."

if [[ "${1:-}" == "prod" || "${1:-}" == "build" ]]; then
  shift
  npm run build
  npm run preview "$@"
else
  npm run dev "$@"
fi
