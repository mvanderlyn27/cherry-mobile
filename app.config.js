
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
        package: "com.cherrystories.cherrystories"
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png"
      },
      plugins: [
        "expo-router",
        [
          "expo-splash-screen",
          {
            image: "./assets/images/splash-icon.png",
            imageWidth: 200,
            resizeMode: "contain",
            backgroundColor: "#ffffff"
          }
        ]
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
