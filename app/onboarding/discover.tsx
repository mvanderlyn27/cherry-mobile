import React, { useEffect } from "react";
import { Text, View, Image, FlatList, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

// Mock book covers for the carousel
const bookCovers = [
  { id: "1", image: require("@/assets/images/book_cover/1.png") },
  { id: "2", image: require("@/assets/images/book_cover/2.png") },
  { id: "3", image: require("@/assets/images/book_cover/3.png") },
  { id: "4", image: require("@/assets/images/book_cover/4.png") },
  { id: "5", image: require("@/assets/images/book_cover/5.png") },
];

export default function DiscoverScreen() {
  const router = useRouter();
  const titleOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    textOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    buttonOpacity.value = withDelay(900, withTiming(1, { duration: 800 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
    };
  });

  const handleNext = () => {
    router.push("/onboarding/account");
  };

  const renderBookCover = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(200 * index).springify()} className="mx-2">
      <Image source={item.image} className="w-32 h-48 rounded-lg shadow-md" resizeMode="cover" />
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 justify-between py-6">
          <View className="flex-1 items-center justify-center gap-6">
            <View className="w-full py-4">
              <FlatList
                data={bookCovers}
                renderItem={renderBookCover}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
              />
            </View>

            <Animated.Text
              style={titleStyle}
              className="text-3xl font-bold text-center text-story-light dark:text-story-dark px-2 mt-6 font-kaisei-bold">
              Explore a World of Romance
            </Animated.Text>

            <Animated.View style={textStyle} className="px-8">
              <Text className="text-lg opacity-70 text-center text-story-light dark:text-story-dark leading-6 font-kaisei-bold">
                From sweet encounters to passionate sagas, our library has stories for every mood. New tales added
                regularly!
              </Text>
            </Animated.View>
          </View>

          <View className="items-end mt-4">
            <Animated.View style={buttonStyle}>
              <TouchableOpacity
                className="bg-buttons-light dark:bg-buttons-dark py-5 rounded-2xl items-center shadow-md"
                onPress={handleNext}>
                <Text className="bg-cherry-light rounded-full px-6 py-3 text-white font-bold text-lg font-kaisei-bold">
                  Next
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
