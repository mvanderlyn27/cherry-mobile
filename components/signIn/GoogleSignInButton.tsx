import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View, Platform } from "react-native";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";

export const GoogleSignInButton: React.FC = () => {
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  return null;
  //   useEffect(() => {
  //     // Configure Google Sign In
  //     GoogleSignin.configure({
  //       // The webClientId should match what you have in your Google Cloud Console
  //       webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
  //       offlineAccess: true,
  //     });
  //   }, []);

  //   const handleGoogleSignIn = async () => {
  //     try {
  //       setIsSigninInProgress(true);

  //       // Check if your device supports Google Play
  //       await GoogleSignin.hasPlayServices();

  //       // Sign in
  //       const userInfo = await GoogleSignin.signIn();

  //       console.log("Google authentication successful", userInfo);
  //       // You would typically send this credential to your backend

  //     } catch (error: any) {
  //       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //         console.log("User canceled Google sign in");
  //       } else if (error.code === statusCodes.IN_PROGRESS) {
  //         console.log("Google sign in already in progress");
  //       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //         console.log("Google Play services not available");
  //       } else {
  //         console.error("Google authentication error:", error);
  //       }
  //     } finally {
  //       setIsSigninInProgress(false);
  //     }
  //   };

  //   return (
  //     <View className="w-full">
  //       {Platform.OS === 'ios' ? (
  //         <TouchableOpacity
  //           className="w-full h-[50px] bg-white rounded-lg border border-gray-300 flex-row items-center justify-center"
  //           onPress={handleGoogleSignIn}
  //           disabled={isSigninInProgress}
  //         >
  //           <View className="flex-row items-center">
  //             <View className="w-5 h-5 mr-2">
  //               {/* SVG Google logo for better quality */}
  //               <View className="w-full h-full">
  //                 <svg viewBox="0 0 24 24" width="100%" height="100%">
  //                   <path
  //                     fill="#4285F4"
  //                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
  //                   />
  //                   <path
  //                     fill="#34A853"
  //                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
  //                   />
  //                   <path
  //                     fill="#FBBC05"
  //                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
  //                   />
  //                   <path
  //                     fill="#EA4335"
  //                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
  //                   />
  //                   <path fill="none" d="M1 1h22v22H1z" />
  //                 </svg>
  //               </View>
  //             </View>
  //             <Text className="text-gray-700 font-medium text-base">Sign in with Google</Text>
  //           </View>
  //         </TouchableOpacity>
  //       ) : (
  //         <View className="w-full h-[50px]">
  //           <GoogleSigninButton
  //             style={{ width: '100%', height: 50 }}
  //             size={GoogleSigninButton.Size.Wide}
  //             color={GoogleSigninButton.Color.Light}
  //             onPress={handleGoogleSignIn}
  //             disabled={isSigninInProgress}
  //           />
  //         </View>
  //       )}
  //     </View>
  //   );
};
