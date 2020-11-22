import "dotenv/config";

const { EXPO_ENV, EXPO_DEV_HOST, EXPO_PROD_HOST } = process.env;
const host = EXPO_ENV === "development" ? EXPO_DEV_HOST : "localhost";

export default {
  name: "LogiCall",
  slug: "logicall",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    host,
  },
};
