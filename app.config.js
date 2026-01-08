export default () => ({
  expo: {
    name: "DilSayCare",
    slug: "dilsaycare-mobile",
    version: "1.0.0",

    orientation: "portrait",
    userInterfaceStyle: "light",

    jsEngine: "hermes",
    newArchEnabled: false,

    icon: "./assets/icon.png",

    plugins: ["expo-asset"],

    extra: {
      WEB_URL: process.env.WEB_URL || "https://dev.dilsaycare.in",
      eas: {
        projectId: "5fe97273-3491-47ea-b39a-bd5d8c4f0e5d",
      },
    },

    splash: {
      image: "./assets/splash-logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    statusBar: {
      backgroundColor: "#ffffff",
      style: "dark",
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.dilsaycare.mobile",
      infoPlist: {
        UIViewControllerBasedStatusBarAppearance: false,
      },
    },

    android: {
      package: "com.dilsaycare.mobile",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
    },
  },
});
