import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";
import { AuthService } from "@/services/authService";
import { router } from "expo-router";
import { LoggingService } from "@/services/loggingService";

const GoogleSignInButton = () => {
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
        router.back();
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
    <GoogleSigninButton size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={signIn} />
  );
};
export default GoogleSignInButton;
