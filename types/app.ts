import { Database } from "./database";

// Base types from database
export type Book = Database["public"]["Tables"]["books"]["Row"];
export type Chapter = Database["public"]["Tables"]["chapters"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type BookTag = Database["public"]["Tables"]["book_tags"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];
export type BookProgress = Database["public"]["Tables"]["book_progress"]["Row"];
export type ChapterProgress = Database["public"]["Tables"]["chapter_progress"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type ChapterLike = Database["public"]["Tables"]["liked_chapters"]["Row"];

// Enums
export enum ChapterStatus {
  READING = "reading",
  UNREAD = "unread",
  COMPLETED = "completed",
}

export enum BookStatus {
  FINISHED = "finished",
  READING = "reading",
  UNREAD = "unread",
}

// Extended types for frontend use
export interface ExtendedChapter extends Chapter {
  content: string;
  is_locked: boolean;
  progress?: ChapterProgress;
  comments?: Comment[];
  likes_count?: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface ExtendedBook extends Book {
  tags: Tag[];
  chapters: ExtendedChapter[];
  progress?: BookProgress;
  current_chapter?: ExtendedChapter;
  is_saved?: boolean;
  comments_count?: number;
  likes_count?: number;
  user_progress?: number; // Percentage of completed chapters
  is_purchased?: boolean;
}

export interface UserProfile extends Profile {
  user: User;
  saved_books?: ExtendedBook[];
  reading_history?: ExtendedBook[];
}

export enum Icon {
  "book" = "book",
  "cherry" = "cherry",
  "save" = "save",
  "saved" = "saved",
  "like" = "like",
  "explore" = "explore",
  "settings" = "settings",
  "menu" = "menu",
  "order" = "order",
  "search" = "search",
  "account" = "account",
  "time" = "time",
  "left-arrow" = "left-arrow",
  "right-arrow" = "right-arrow",
  "arrow-down" = "arrow-down",
  "close" = "close",
  "share" = "share",
  "download" = "download",
  "lock_fill" = "lock_fill",
  "sun" = "sun",
  "moon" = "moon",
  "font" = "font",
  "star" = "star",
  "play" = "play",
  "watch-ads" = "watch-ads",
  "diamond" = "diamond",
  "heart" = "heart",
  "question" = "question",
  "google" = "google",
  "apple" = "apple",
  "person" = "person",
  "edit" = "edit",
  "filter" = "filter",
  "sort" = "sort",
  "bell" = "bell",
  "document" = "document",
  "shield" = "shield",
  "logout" = "logout",
  "fire" = "fire",
  "eye" = "eye",
  "tv" = "tv",
  "info" = "info",
  "help" = "help",
  "lock" = "lock",
  "trash" = "trash",
  "warning" = "warning",
  "mail" = "mail",
  "globe" = "globe",
  "checkmark" = "checkmark",
  "error" = "error",
  "comment" = "comment",
  "bookmark" = "bookmark",
}
