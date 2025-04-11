import { authStore$ } from "@/stores/authStore";
import { use$ } from "@legendapp/state/react";
import { Redirect } from "expo-router";

const Page = () => {
  const isNew = use$(authStore$.isNew);
  if (isNew) return <Redirect href="/onboarding" />;
  return <Redirect href="/explore/top" />;
};
export default Page;
