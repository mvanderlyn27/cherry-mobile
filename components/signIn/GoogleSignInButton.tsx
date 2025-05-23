import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";
import { AuthService } from "@/services/authService";
import { router } from "expo-router";
import { LoggingService } from "@/services/loggingService";
import { IconSymbol } from "../ui/IconSymbol";
import { Icon } from "@/types/app";
import { TouchableOpacity, Text } from "react-native";

const GoogleSignInButton = ({ onPress }: { onPress?: () => void }) => {
  GoogleSignin.configure({
    // scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
    // webClientId: "",
  });
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.data && userInfo.data.idToken) {
        await AuthService.signInWithGoogle(userInfo.data.idToken);
        if (onPress) {
          onPress();
        } else {
          router.back();
        }
      } else {
        throw new Error("no ID token present!");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        LoggingService.handleError(
          error,
          { component: "GoogleSignInButton", method: "signIn", details: "play service unavailable" },
          false
        );
      } else {
        // some other error happened
        LoggingService.handleError(error, { component: "GoogleSignInButton", method: "signIn" }, false);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={signIn}
      className="bg-black w-full p-4 rounded-lg items-center justify-center flex flex-row">
      <IconSymbol name={Icon.google} size={16} color={"white"} />
      <Text className="text-white text-xl font-bold ml-2">Sign in with Google</Text>
    </TouchableOpacity>
  );
};
export default GoogleSignInButton;
