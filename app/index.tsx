import { Redirect } from "expo-router";

//check if we need to display onboarding, otherwise go to explore
const Page = () => {
  return <Redirect href="/(tabs)/explore" />;
};
export default Page;
