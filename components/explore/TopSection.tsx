import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ListBookCard } from "../ui/ListBookCard";

type Props = {
  onBookPress: (id: string) => void;
};

export const TopSection: React.FC<Props> = ({ onBookPress }) => {
  return (
    <ScrollView className="flex-1 px-4">
      <Text className="text-xl font-bold mb-4">Trending Now</Text>
      {/* Sample data - replace with real data */}
      <ListBookCard
        id="1"
        title="The Secret Promise"
        coverUrl="https://picsum.photos/200/300"
        description="A thrilling romance that will keep you on the edge of your seat..."
        readingTime="120"
        tags={[{ label: "Romance" }]}
        onPress={onBookPress}
      />
    </ScrollView>
  );
};