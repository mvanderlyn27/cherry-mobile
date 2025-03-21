import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@/components/ui/Header";
import { Icon } from "@/types/app";
import { View, Text } from "react-native";
import { SearchBar } from "@/components/search/SearchBar";
import { categoryData } from "@/config/testData";
import { SearchResults } from "@/components/search/SearchResults";
import { SortOptions } from "@/components/search/SortOptions";
import { TagSelector } from "@/components/search/TagSelector";

// Define sort types
type SortType = "topRated" | "mostViewed" | "newest";

export default function Page() {
  const router = useRouter();
  const { category } = useLocalSearchParams();

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(category ? [category as string] : []);
  const [sortBy, setSortBy] = useState<SortType>("topRated");

  // Extract all unique tags from category data
  const allTags = Array.from(new Set(categoryData.map((cat) => cat.name)));

  // Handle search query change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Toggle sort options visibility
  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle sort selection
  const handleSortSelect = (sort: SortType) => {
    setSortBy(sort);
    setShowSortOptions(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={["top", "left", "right"]}>
      <Header title="Search" rightActions={[{ icon: Icon.close, onPress: () => router.back() }]} />

      <View className="flex-1 px-4">
        {/* Search bar with sort toggle */}
        <SearchBar value={searchQuery} onChangeText={handleSearch} onSortPress={toggleSortOptions} />

        {/* Conditional rendering of tags or sort options */}
        {showSortOptions ? (
          <SortOptions selectedSort={sortBy} onSortSelect={handleSortSelect} />
        ) : (
          <TagSelector tags={allTags} selectedTags={selectedTags} onTagSelect={handleTagSelect} />
        )}

        {/* Search results */}
        <SearchResults searchQuery={searchQuery} selectedTags={selectedTags} sortBy={sortBy} />
      </View>
    </SafeAreaView>
  );
}
