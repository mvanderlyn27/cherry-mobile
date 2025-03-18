import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ListBookCard } from "../ui/ListBookCard";

type Props = {
  onBookPress: (id: string) => void;
};

export const ForYouSection: React.FC<Props> = ({ onBookPress }) => {
  return (
    <ScrollView className="flex-1 px-4">
      <Text className="text-xl font-bold mb-4">Recommended For You</Text>
      {/* Sample data - replace with real data */}
      <ListBookCard
        id="2"
        title="Midnight Tales"
        coverUrl="https://picsum.photos/200/301"
        description="Based on your reading history..."
        readingTime="90"
        tags={[{ label: "Mystery" }]}
        onPress={onBookPress}
      />
    </ScrollView>
  );
};