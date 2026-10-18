#!/usr/bin/env bash
# Rebuild site/assets/site.css. Needs the Tailwind v4 standalone CLI:
#   https://github.com/tailwindlabs/tailwindcss/releases (tailwindcss-linux-x64 / -macos-arm64 / -windows-x64.exe)
set -euo pipefail
cd "$(dirname "$0")/.."
TW="${TAILWIND_BIN:-tailwindcss}"
"$TW" -i tools/tw/input.css -o site/assets/site.css --minify
