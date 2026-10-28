#!/usr/bin/env bash
# One Remotion bundle at a time (2026-09-11: six parallel `npx remotion still` runs OOM-killed WSL four times).
# Usage: tools/remotion-one.sh <npx remotion args...>   e.g. tools/remotion-one.sh still <CompId> out.png --frame=10
cd "$(dirname "$0")/../remotion" && exec flock /tmp/remotion.lock npx remotion "$@"
