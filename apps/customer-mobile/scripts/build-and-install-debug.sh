#!/bin/bash

# Bawaa Medicals - Build & Install Debug APK
# Usage: ./scripts/build-and-install-debug.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔨 Building Bawaa Medicals...${NC}"

echo -e "${YELLOW}📦 Building web app...${NC}"
npx vite build

echo -e "${YELLOW}🔄 Syncing Capacitor...${NC}"
npx cap sync

echo -e "${YELLOW}🏗️  Building Android APK...${NC}"
cd android
./gradlew assembleDebug
cd ..

echo -e "${YELLOW}📲 Installing on device...${NC}"
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

echo -e "${YELLOW}🚀 Launching app...${NC}"
adb shell monkey -p com.baawa.customer 1

echo -e "${GREEN}✅ Done!${NC}"
