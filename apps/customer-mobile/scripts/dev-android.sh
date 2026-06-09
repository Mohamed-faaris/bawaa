#!/bin/bash

# Bawaa Medicals - Dev loop: build, sync, install on file change
# Usage: ./scripts/dev-android.sh
# Requires: inotifywait (sudo apt install inotify-tools)

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}👀 Watching src/ for changes...${NC}"

while true; do
  inotifywait -r -e modify,create,delete src/ 2>/dev/null

  echo -e "${YELLOW}📦 Rebuilding...${NC}"
  npx vite build

  echo -e "${YELLOW}🔄 Syncing...${NC}"
  npx cap sync

  echo -e "${YELLOW}📲 Installing...${NC}"
  adb install -r android/app/build/outputs/apk/debug/app-debug.apk 2>/dev/null

  echo -e "${GREEN}✅ Updated${NC}"
done
