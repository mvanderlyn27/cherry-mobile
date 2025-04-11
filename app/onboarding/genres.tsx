import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Dimensions } from "react-native";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { appStore$ } from "@/stores/appStores";
import { authStore$ } from "@/stores/authStore";

const { width } = Dimensions.get("window");

// Mock genres for selection
const genres = [
  { id: "1", name: "Contemporary", icon: "city" },
  { id: "2", name: "Historical", icon: "castle" },
  { id: "3", name: "Paranormal", icon: "ghost" },
  { id: "4", name: "Fantasy", icon: "wand" },
  { id: "5", name: "LGBTQ+", icon: "rainbow" },
  { id: "6", name: "Spicy", icon: "fire" },
  { id: "7", name: "Sweet", icon: "heart" },
  { id: "8", name: "Mystery", icon: "magnify" },
  { id: "9", name: "Comedy", icon: "emoticon-happy" },
];

export default function GenresScreen() {
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState<any[]>([]);
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

  const toggleGenre = (id: string) => {
    if (selectedGenres.includes(id)) {
      setSelectedGenres(selectedGenres.filter((genreId) => genreId !== id));
    } else {
      setSelectedGenres([...selectedGenres, id]);
    }
  };

  const handleFinish = () => {
    // Navigate to main app
    authStore$.isNew.set(false);
    router.replace("/(tabs)/explore/forYou");
  };

  const handleSkip = () => {
    // Navigate to main app
    authStore$.isNew.set(false);
    router.replace("/(tabs)/explore/top");
  };

  const renderGenreItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(100 * index)
        .springify()
        .withInitialValues({ opacity: 0, translateY: 20 })}
      className="flex-1  justify-center items-center m-2">
      <TouchableOpacity
        className={`h-28 rounded-xl shadow-sm flex-col items-center justify-center p-4 ${
          selectedGenres.includes(item.id) ? "bg-cherry-light dark:bg-cherry-dark" : "bg-gray-100 dark:bg-gray-800"
        }`}
        onPress={() => toggleGenre(item.id)}>
        <View className="w-full">
          <MaterialCommunityIcons
            className="w-full"
            name={item.icon}
            size={32}
            color={selectedGenres.includes(item.id) ? "white" : "#E57373"}
          />
        </View>
        <Text
          className={`mt-2 w-full text-center font-medium ${
            selectedGenres.includes(item.id) ? "text-white" : "text-story-light dark:text-story-dark"
          }`}>
          {item.name}
        </Text>
        {selectedGenres.includes(item.id) && (
          <View className="absolute top-2 right-2">
            <MaterialCommunityIcons name="check-circle" size={20} color="white" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-4 py-6">
          <Animated.Text
            style={titleStyle}
            className="text-3xl font-bold text-center text-story-light dark:text-story-dark px-4 mb-2">
            Find your Fantasy
          </Animated.Text>

          <Animated.View style={textStyle} className="px-8 mb-6">
            <Text className="text-lg opacity-70 text-center text-story-light dark:text-story-dark leading-6">
              Select a few genres you love. We'll personalize your recommend stories!
            </Text>
          </Animated.View>

          <FlatList
            data={genres}
            renderItem={renderGenreItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            className="flex-1"
          />

          <View className="mt-4 px-4 gap-3 items-end">
            <Animated.View style={buttonStyle}>
              <TouchableOpacity
                className={`py-5 rounded-2xl items-center shadow-md ${
                  selectedGenres.length > 0 ? "bg-buttons-light dark:bg-buttons-dark" : "bg-gray-300 dark:bg-gray-700"
                }`}
                onPress={handleFinish}
                disabled={selectedGenres.length === 0}>
                <Text className="bg-cherry-light dark:bg-cherry-dark py-2 px-4 rounded-full text-white font-bold text-lg">
                  Show My Recommendations
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={buttonStyle}>
              <TouchableOpacity className="py-3 items-center" onPress={handleSkip}>
                <Text className="bg-tabs_selected-light dark:tabs_selected-dark py-2 px-4 rounded-full text-white text-lg">
                  Show Me Everything
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
