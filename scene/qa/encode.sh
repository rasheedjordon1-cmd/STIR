#!/usr/bin/env bash
# Encode a rendered frame sequence into the two web formats plus a poster.
#
#   ./qa/encode.sh <frames-dir> <out-basename> <fps> <poster-frame>
#
# H.264 high profile for Safari/iOS, VP9 for everything else. Both are
# -an (no audio track at all, so no decoder is woken for silence) and
# +faststart so the moov atom precedes the media data.
set -euo pipefail
DIR=${1:?frames dir}; OUT=${2:?out basename}; FPS=${3:-24}; POSTER=${4:-0000}

ffmpeg -y -loglevel error -framerate "$FPS" -i "$DIR/f%04d.png" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 22 -preset slow -tune animation \
  -g $((FPS * 2)) -movflags +faststart -an "$OUT.mp4"

ffmpeg -y -loglevel error -framerate "$FPS" -i "$DIR/f%04d.png" \
  -c:v libvpx-vp9 -pix_fmt yuv420p -crf 30 -b:v 0 -tune-content screen -row-mt 1 \
  -deadline good -cpu-used 2 -g $((FPS * 2)) -an "$OUT.webm"

# Poster from the frame we actually chose, not from a re-decode of the video.
cp "$DIR/f$POSTER.png" "$OUT-poster-src.png"
