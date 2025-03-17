import React, { useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { observer } from "@legendapp/state/react";
import { books$ } from "@/stores/bookStore";
import { syncState } from "@legendapp/state";
import { Header } from "@/components/ui/Header";
import { TabFilter } from "@/components/ui/TabFilter";
import { ListBookCard } from "@/components/ui/ListBookCard";
import { Icon } from "@/types/app";

type LibraryTab = "all" | "reading" | "completed";

const Page = observer(() => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LibraryTab>("reading");
  const isLoading = syncState(books$).isGetting;

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
      readingTime: "2 hrs",
      tags: [
        { label: "18+", color: "bg-[#E57373]" },
        { label: "2M+", color: "bg-[#BA68C8]" },
        { label: "Stalking", color: "bg-[#4DB6AC]" },
      ],
      credits: 49,
      isLocked: true,
    },
    {
      id: "2",
      title: "The Secret Promise",
      coverUrl: "https://picsum.photos/200/301",
      description:
        "When you meet him again after moving away for 8 years, he asks you to be his fake girlfriend. You pretend not to remember the promise about...",
      readingTime: "1.5 hrs",
      tags: [
        { label: "Fluff", color: "bg-[#E57373]" },
        { label: "Childhood Sweetheart", color: "bg-[#BA68C8]" },
      ],
    },
    {
      id: "3",
      title: "CEO's Plus One",
      coverUrl: "https://picsum.photos/200/302",
      description:
        "After you announced you're leaving the company, the toxic CEO forces you to become his fake partner at the annual charity ball. Under the...",
      readingTime: "2.5 hrs",
      tags: [
        { label: "18+", color: "bg-[#E57373]" },
        { label: "Office", color: "bg-[#BA68C8]" },
        { label: "Billionaire", color: "bg-[#4DB6AC]" },
      ],
      credits: 45,
      isLocked: true,
    },
    {
      id: "4",
      title: "Anonymous Roses",
      coverUrl: "https://picsum.photos/200/303",
      description:
        "You've been receiving anonymous roses every Monday for the past month. You're determined to find out who's behind them.",
      readingTime: "3 hrs",
      tags: [
        { label: "18+", color: "bg-[#E57373]" },
        { label: "Dark", color: "bg-[#BA68C8]" },
        { label: "Biker", color: "bg-[#4DB6AC]" },
      ],
    },
  ];

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-6">
      <Text className="font-kaisei-bold text-xl text-gray-800 mb-2">Your library is empty</Text>
      <Text className="text-center text-gray-600 mb-6">
        Save books from the Explore tab to add them to your library
      </Text>
      <TouchableOpacity className="bg-[#E57373] px-6 py-3 rounded-lg" onPress={() => router.push("/")}>
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
      isLocked={item.isLocked}
      onPress={handleBookPress}
      onUnlock={handleUnlockBook}
      credits={item.credits}
    />
  );

  const tabOptions = [
    { id: "reading", label: "In Progress" },
    { id: "all", label: "Unread" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <SafeAreaView className="flex-1 px-4 bg-background-light dark:bg-background-dark" edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

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
      ) : sampleBooks.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={sampleBooks}
          className="flex-1"
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
});

export default Page;
