import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.baawa.customer",
  appName: "Bawaa Medicals",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#168C67",
      androidSplashResourceName: "splash",
    },
  },
};

export default config;
