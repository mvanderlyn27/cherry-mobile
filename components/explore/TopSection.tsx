import React from "react";
import { View, Text, ScrollView } from "react-native";
import { BookCoverCarousel } from "../ui/BookCoverCarousel";
import { Book } from "@/types/app";

type Props = {
  onBookPress: (id: string) => void;
};

export const TopSection: React.FC<Props> = ({ onBookPress }) => {
  const books: Book[] = [
    {
      id: "1",
      title: "The Secret Promise 1",
      cover_url: "https://picsum.photos/200/300",
      preview_text: "A thrilling romance that will keep you on the edge of your seat...",
      price: 40,
      created_at: "2023-09-15",
      updated_at: "2023-09-15",
      reading_time: 120,
      deleted: false,
    },
    {
      id: "2",
      title: "The Secret Promise 2",
      cover_url: "https://picsum.photos/200/301",
      preview_text: "A thrilling romance that will keep you on the edge of your seat...",
      price: 40,
      created_at: "2023-09-15",
      updated_at: "2023-09-15",
      reading_time: 120,
      deleted: false,
    },
    {
      id: "3",
      title: "The Secret Promise 3",
      cover_url: "https://picsum.photos/200/302",
      preview_text: "A thrilling romance that will keep you on the edge of your seat...",
      price: 40,
      created_at: "2023-09-15",
      updated_at: "2023-09-15",
      reading_time: 120,
      deleted: false,
    },
    {
      id: "4",
      title: "The Secret Promise 4",
      cover_url: "https://picsum.photos/200/303",
      preview_text: "A thrilling romance that will keep you on the edge of your seat...",
      price: 40,
      created_at: "2023-09-15",
      updated_at: "2023-09-15",
      reading_time: 120,
      deleted: false,
    },
    {
      id: "5",
      title: "The Secret Promise 5",
      cover_url: "https://picsum.photos/200/304",
      preview_text: "A thrilling romance that will keep you on the edge of your seat...",
      price: 40,
      created_at: "2023-09-15",
      updated_at: "2023-09-15",
      reading_time: 120,
      deleted: false,
    },
  ];

  return (
    <ScrollView className="flex-1">
      <Text className="text-xl font-bold mb-4 px-4">Trending Now</Text>
      <BookCoverCarousel books={books} onBookPress={onBookPress} />
    </ScrollView>
  );
};
