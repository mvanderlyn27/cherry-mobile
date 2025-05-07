import React from "react";
import Header from "@/components/ui/Header";
import { Icon, Chapter } from "@/types/app";

type ReaderHeaderProps = {
  title: string;
  chapter: Chapter;
  onMenuPress: () => void;
  onClosePress: () => void;
};

export const ReaderHeader = ({ title, chapter, onMenuPress, onClosePress }: ReaderHeaderProps) => {
  return (
    <Header
      title={title}
      subTitle={`${chapter.title}`}
      leftActions={[{ icon: Icon.menu, onPress: onMenuPress }]}
      rightActions={[{ icon: Icon.close, onPress: onClosePress }]}
    />
  );
};
