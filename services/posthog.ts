import PostHog from "posthog-react-native";

export const posthog = new PostHog(process.env.EXPO_PUBLIC_POSTHOG_KEY!, {
  // usually 'https://us.i.posthog.com' or 'https://eu.i.posthog.com'
  host: "https://us.i.posthog.com", // host is optional if you use https://us.i.posthog.com
  enableSessionReplay: true,
  sessionReplayConfig: {
    // optionally set a mask for the session replay
    maskAllTextInputs: true,
    maskAllImages: false,
  },
});
