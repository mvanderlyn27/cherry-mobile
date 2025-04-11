
module.exports = () => {
  const baseConfig = {
    expo: {
      name: process.env.APP_ENV === 'development' 
        ? "Cherry (Dev)" 
        : process.env.APP_ENV === 'staging' 
          ? "Cherry (Preview)" 
          : "Cherry",
      slug: "cherry-mobile",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "myapp",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: {
        usesAppleSignIn: true,
        supportsTablet: true,
        bundleIdentifier: "com.cherrystories.cherrystories",
        infoPlist: {
          ITSAppUsesNonExemptEncryption: false
        }
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#ffffff"
        },
        package: "com.cherrystories.cherrystories",
        minSdkVersion: 26
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png"
      },
      plugins: [
        [
          "expo-apple-authentication",
        ],
        [
          "@react-native-google-signin/google-signin",
          {
            "iosUrlScheme": "com.googleusercontent.apps.603703582907-vkt8sgl9o3tb0l2mmcr6oq7vlauh8p37"
          }
        ],
        "expo-router",
        [
          "expo-splash-screen",
          {
            image: "./assets/images/splash-icon.png",
            imageWidth: 200,
            resizeMode: "contain",
            backgroundColor: "#ffffff"
          }
        ],
        [
          "expo-build-properties",
          {
            "android": {
              "minSdkVersion": 26
            }
          }
        ],
              ],
      experiments: {
        typedRoutes: true
      },
      extra: {
        router: {
          origin: false
        },
        eas: {
          projectId: "84247f00-34fa-4e15-89b9-60ac59961167"
        }
      },
      owner: "cherrystories"
    }
  };


  return baseConfig;
};
