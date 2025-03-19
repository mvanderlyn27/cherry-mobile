import React, { useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { observer, use$ } from "@legendapp/state/react";
import { books$ } from "@/stores/bookStore";
import { syncState } from "@legendapp/state";
import Header from "@/components/ui/Header";
import { TabFilter } from "@/components/ui/TabFilter";
import { ListBookCard } from "@/components/ui/ListBookCard";
import { Icon } from "@/types/app";
import { userStore$ } from "@/stores/userStore";

type LibraryTab = "reading" | "unread" | "completed";

const Page = observer(() => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LibraryTab>("reading");
  const isLoading = syncState(books$).isGetting;
  const credits = use$(userStore$.credits.get());

  const handleBookPress = (bookId: string) => {
    router.push(`/reader/${bookId}`);
  };

  const handleUnlockBook = (bookId: string) => {
    // Handle unlocking book
    console.log("Unlock book:", bookId);
  };

  // Sample data for demonstration
  const sampleBooks = [
    {
      id: "1",
      title: "I Want You...Both",
      coverUrl: "https://picsum.photos/200/300",
      description:
        "When your possessive stepbrother invites his flirty best friend to stay over, things get a little heated in the house.",
      readingTime: 120,
      tags: [{ label: "18+", color: "bg-nsfw-light dark:bg-nsfw-dark" }, { label: "2M+" }, { label: "Stalking" }],
      credits: 40,
      owned: false,
      progress: 0,
    },
    {
      id: "2",
      title: "The Secret Promise",
      coverUrl: "https://picsum.photos/200/301",
      description:
        "When you meet him again after moving away for 8 years, he asks you to be his fake girlfriend. You pretend not to remember the promise about...",
      readingTime: 90,
      tags: [{ label: "Fluff", color: "bg-nsfw-light dark:bg-nsfw-dark" }, { label: "Childhood Sweetheart" }],
      owned: true,
      progress: 0,
      started: false,
    },
    {
      id: "3",
      title: "CEO's Plus One",
      coverUrl: "https://picsum.photos/200/302",
      description:
        "After you announced you're leaving the company, the toxic CEO forces you to become his fake partner at the annual charity ball. Under the...",
      readingTime: 150,
      tags: [{ label: "18+", color: "bg-nsfw-light dark:bg-nsfw-dark" }, { label: "Office" }, { label: "Billionaire" }],
      credits: 45,
      owned: false,
      progress: 0,
    },
    {
      id: "4",
      title: "Anonymous Roses 2",
      coverUrl: "https://picsum.photos/200/303",
      description:
        "You've been receiving anonymous roses every Monday for the past month. You're determined to find out who's behind them.",
      readingTime: 180,
      tags: [{ label: "18+", color: "bg-nsfw-light dark:bg-nsfw-dark" }, { label: "Dark" }, { label: "Biker" }],
      owned: true,
      progress: 90,
      started: true,
    },
    {
      id: "4",
      title: "Anonymous Roses",
      coverUrl: "https://picsum.photos/200/303",
      description:
        "You've been receiving anonymous roses every Monday for the past month. You're determined to find out who's behind them.",
      readingTime: 180,
      tags: [{ label: "18+", color: "bg-nsfw-light dark:bg-nsfw-dark" }, { label: "Dark" }, { label: "Biker" }],
      owned: true,
      progress: 100,
      started: true,
    },
  ];
  const getFilteredBooks = () => {
    switch (activeTab) {
      case "reading":
        return sampleBooks.filter((book) => book.started && book.progress < 100);
      case "unread":
        return sampleBooks.filter((book) => !book.started);
      case "completed":
        return sampleBooks.filter((book) => book.started && book.progress === 100);
      default:
        return [];
    }
  };

  // Replace the existing sampleBooks assignment with:
  const sampleFilteredBooks = getFilteredBooks();
  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-6">
      <Text className="font-kaisei-bold text-xl text-gray-800 mb-2">Your library is empty</Text>
      <Text className="text-center text-gray-600 mb-6">
        Save books from the Explore tab to add them to your library
      </Text>
      <TouchableOpacity className="bg-[#E57373] px-6 py-3 rounded-lg" onPress={() => router.push("/explore")}>
        <Text className="text-white font-medium">Explore Books</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBook = ({ item }: { item: any }) => (
    <ListBookCard
      id={item.id}
      title={item.title}
      coverUrl={item.coverUrl}
      description={item.description}
      readingTime={item.readingTime}
      tags={item.tags}
      owned={item.owned}
      progress={item.progress}
      onPress={handleBookPress}
      buyBook={handleUnlockBook}
      credits={item.credits}
      canBuy={credits >= item.credits}
      started={item.started}
      rateStory={() => console.log("Rate story")}
    />
  );

  const tabOptions = [
    { id: "reading", label: "In Progress" },
    { id: "unread", label: "Unread" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <SafeAreaView className="flex-1  bg-background-light dark:bg-background-dark" edges={["top", "left", "right"]}>
      <Header
        title="My Library"
        rightActions={[
          { icon: Icon.edit, onPress: () => console.log("Edit") },
          { icon: Icon.sort, onPress: () => console.log("Sort") },
          { icon: Icon.search, onPress: () => console.log("Search") },
        ]}
      />

      <TabFilter
        options={tabOptions}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as LibraryTab)}
      />

      {isLoading.get() ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Loading...</Text>
        </View>
      ) : sampleFilteredBooks.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={sampleFilteredBooks}
          className="flex-1 px-6"
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
});

export default Page;
