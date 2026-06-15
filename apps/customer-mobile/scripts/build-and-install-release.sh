#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_ID="com.baawa.customer"
APK_PATH="$ROOT_DIR/android/app/build/outputs/apk/release/app-release.apk"
RELEASE_DIR="$ROOT_DIR/android/app/build/outputs/apk/release"

cd "$ROOT_DIR"

echo "Building web app..."
bun run build

echo "Syncing Capacitor..."
bunx cap sync

echo "Building release APK..."
cd "$ROOT_DIR/android"
./gradlew assembleRelease
cd "$ROOT_DIR"

if [ ! -f "$APK_PATH" ] && [ -d "$RELEASE_DIR" ]; then
  APK_PATH="$(find "$RELEASE_DIR" -name '*.apk' -type f | sort | head -n 1)"
fi

if [ -z "$APK_PATH" ] || [ ! -f "$APK_PATH" ]; then
  echo "Release APK was not found."
  exit 1
fi

mkdir -p "$HOME/Downloads/build-apps"
cp "$APK_PATH" "$HOME/Downloads/build-apps/bawaa-customer-$(date +%Y%m%d-%H%M%S)-release.apk"

echo "Installing release APK..."
adb install -r "$APK_PATH"

echo "Launching app..."
adb shell monkey -p "$APP_ID" 1

echo "Release build installed."
