#!/usr/bin/env bash
# Render, encode and poster the two interior loops.
#
# The hero is NOT rebuilt here: it is already-rendered pixels and
# re-rendering it would move the poster frame that has been signed off.
#
#   cd scene && ./qa/build-scene-loops.sh
set -euo pipefail
cd "$(dirname "$0")/.."
BASE=http://127.0.0.1:4180/index.html
mkdir -p out/media

render () {  # scene w h frame tag
  if [ "$(ls "out/frames-$5" 2>/dev/null | wc -l)" = "336" ]; then
    echo "frames-$5 already complete, skipping render"
    return
  fi
  BASE_URL="$BASE?scene=$1" W=$2 H=$3 DPR=1 FPS=24 OUT="out/frames-$5" FRAME=$4 \
    node qa/render-loop.mjs | tail -1
}

ship () {    # tag  -> assets/scene/<tag>.{mp4,webm} + <tag>.webp poster
  ./qa/encode.sh "out/frames-$1" "out/media/$1" 24 0000
  cp "out/media/$1.mp4"  "../assets/scene/$1.mp4"
  cp "out/media/$1.webm" "../assets/scene/$1.webm"
  # The poster IS frame 0, so the crossfade is between identical
  # geometry. Lossless, because a lossy poster next to a palette-snapped
  # loop shows its artefacts the moment the video fades in.
  ffmpeg -y -loglevel error -i "out/media/$1-poster-src.png" -lossless 1 "../assets/scene/$1.webp"
  printf '  %-12s mp4 %6s   webm %6s   poster %6s\n' "$1" \
    "$(du -h "../assets/scene/$1.mp4"  | cut -f1)" \
    "$(du -h "../assets/scene/$1.webm" | cut -f1)" \
    "$(du -h "../assets/scene/$1.webp" | cut -f1)"
}

render room 620 460 desk  room-desk
render room 390 300 phone room-phone
render seat 520 420 desk  seat-desk
render seat 390 330 phone seat-phone

echo
echo "encoded:"
ship room-desk
ship room-phone
ship seat-desk
ship seat-phone
