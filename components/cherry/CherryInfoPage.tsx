import { ScrollView, View, TouchableOpacity, Linking, Text } from "react-native";

export default function CherryInfoPage() {
  return (
    <ScrollView className="flex-1 px-4">
      <View className="p-4">
        <Text className="text-2xl font-kaisei-bold text-text-light dark:text-text-dark mb-4">About Cherries</Text>
        <Text className="text-text-light dark:text-text-dark mb-6">
          Cherries are our in-app currency that allow you to unlock premium stories and features.
        </Text>

        <Text className="text-xl font-kaisei-bold text-text-light dark:text-text-dark mb-3">How to Get Cherries</Text>
        <View className="mb-6">
          <Text className="text-text-light dark:text-text-dark mb-2">
            • Subscribe for unlimited access to the book library
          </Text>
          <Text className="text-text-light dark:text-text-dark mb-2">• Purchase cherry bundles</Text>
          <Text className="text-text-light dark:text-text-dark mb-2">• Claim daily streak rewards</Text>
          <Text className="text-text-light dark:text-text-dark">• Watch ads for free cherries</Text>
        </View>

        <Text className="text-xl font-kaisei-bold text-text-light dark:text-text-dark mb-3">Purchase Issues?</Text>
        <Text className="text-text-light dark:text-text-dark mb-6">
          If you're experiencing any issues with purchases or cherry credits, please contact our support team.
        </Text>

        <Text className="text-xl font-kaisei-bold text-text-light dark:text-text-dark mb-3">Contact Us</Text>
        <TouchableOpacity onPress={() => Linking.openURL("mailto:cherry@sliceoflifeapp.com")} className="mb-2">
          <Text className="text-cherry-light dark:text-cherry-dark">cherry@sliceoflifeapp.com</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("https://cherryapp.vercel.app/support")} className="mb-6">
          <Text className="text-cherry-light dark:text-cherry-dark">Visit our Support Center</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
