export default ({ config }) => ({
  ...config,
  expo: {
    name: "Dil Say Care",
    slug: "dilsaycare-mobile",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    jsEngine: "hermes",
    extra: {
      WEB_URL: process.env.WEB_URL || "https://dev.dilsaycare.in",
      eas: {
        projectId: config?.extra?.eas?.projectId
      }
    },
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff",
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
        backgroundColor: "#ffffff",
      },
      statusBar: {
        translucent: true,
        backgroundColor: "#ffffff",
      },
    },
  },
});
