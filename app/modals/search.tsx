import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@/components/ui/Header";
import { Icon, Tag } from "@/types/app";
import { View } from "react-native";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { SortOptions } from "@/components/search/SortOptions";
import { TagSelector } from "@/components/search/TagSelector";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { BookService } from "@/services/bookService";
import { use$ } from "@legendapp/state/react";
import { exploreStore$, searchStore$, SortType } from "@/stores/appStores";

// Define sort types

export default function Page() {
  const router = useRouter();
  const { category } = useLocalSearchParams();

  // State for search functionality
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Get all tags from the exploreStore's topCategoryBooks
  const selectedTags = use$(searchStore$.tags);
  const searchString = use$(searchStore$.searchString);
  const sort = use$(searchStore$.sort);
  const topCategoryBooks = use$(exploreStore$.topCategoryBooks);
  const allTags: Tag[] = topCategoryBooks ? Array.from(topCategoryBooks.keys()) : [];

  // Toggle sort options visibility
  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  // Handle tag selection
  const handleTagSelect = (tag: Tag) => {
    if (selectedTags?.includes(tag)) {
      const updatedTags = selectedTags.filter((t) => t.id !== tag.id);
      searchStore$.tags.set(updatedTags);
    } else {
      searchStore$.tags.set([...(selectedTags || []), tag]);
    }
  };

  // Handle sort selection
  const handleSortSelect = (sort: SortType) => {
    searchStore$.sort.set(sort);
    setShowSortOptions(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={["top", "left", "right"]}>
      <View
        className="bg-background-light dark:bg-background-dark"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.5,
          shadowRadius: 5,
        }}>
        <Header
          bottomBorder={false}
          title="Search"
          rightActions={[{ icon: Icon.close, onPress: () => router.back() }]}
        />
        <View className="px-4">
          <SearchBar
            value={searchString || ""}
            onChangeText={(text) => searchStore$.searchString.set(text)}
            onSortPress={toggleSortOptions}
          />

          <Animated.View layout={LinearTransition.springify()}>
            {showSortOptions && (
              <Animated.View
                entering={FadeIn.duration(400)}
                exiting={FadeOut.duration(150)}
                layout={LinearTransition.springify()}>
                <SortOptions
                  selectedSort={sort || "most_viewed"}
                  // onSortPress={toggleSortOptions}
                  onSortSelect={handleSortSelect}
                />
              </Animated.View>
            )}
            {!showSortOptions && (
              <Animated.View
                entering={FadeIn.duration(400)}
                exiting={FadeOut.duration(150)}
                layout={LinearTransition.springify()}>
                <TagSelector tags={allTags} selectedTags={selectedTags || []} onTagSelect={handleTagSelect} />
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </View>

      <View className="flex-1 px-4">
        <SearchResults />
      </View>
    </SafeAreaView>
  );
}
