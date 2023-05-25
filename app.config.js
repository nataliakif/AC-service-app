import "dotenv/config";

export default {
  expo: {
    name: "AC-service-app",
    slug: "ac-service-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    owner: "natalka23",

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "9c1afb50-3cee-463c-924f-4b2cf94cf484",
    },
    android: {
      package: "com.ac.service",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      eas: {
        projectId: "9c1afb50-3cee-463c-924f-4b2cf94cf484",
      },
    },
  },
};
