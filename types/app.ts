import { Database } from "./database";

// Base types from database
export type Book = Database["public"]["Tables"]["books"]["Row"];
export type SavedBook = Database["public"]["Tables"]["saved_books"]["Row"];
export type Chapter = Database["public"]["Tables"]["chapters"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type SavedTag = Database["public"]["Tables"]["saved_tags"]["Row"];
export type BookTag = Database["public"]["Tables"]["book_tags"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserUnlock = Database["public"]["Tables"]["user_unlocks"]["Row"];
export type BookProgress = Database["public"]["Tables"]["book_progress"]["Row"];
export type ChapterProgress = Database["public"]["Tables"]["chapter_progress"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type ChapterLike = Database["public"]["Tables"]["liked_chapters"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type CherryLedger = Database["public"]["Tables"]["cherry_ledger"]["Row"];

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

export enum PurchaseError {
  NeedsMoreCherries = "NEEDS_MORE_CHERRIES",
  ChapterNotFound = "CHAPTER_NOT_FOUND",
  AlreadyOwned = "ALREADY_OWNED",
  NetworkError = "NETWORK_ERROR",
  Unknown = "UNKNOWN_ERROR",
  NotLoggedIn = "NOT_LOGGED_IN",
  BookNotFound = "BOOK_NOT_FOUND",
}

// Extended types for frontend use
export interface ExtendedChapter extends Chapter {
  is_owned: boolean;
  progress?: ChapterProgress;
  comments?: Comment[];
  likes_count?: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface ExtendedBook extends Book {
  tags: BookTag[];
  progress?: BookProgress;
  comments_count?: number;
  total_views?: number;
  is_owned?: boolean;
  is_saved?: boolean;
  is_hot?: boolean;
}

export interface UserProfile extends Profile {
  user: User;
  saved_books?: ExtendedBook[];
  reading_history?: ExtendedBook[];
}
export interface ExtendedTag extends Tag {
  is_saved?: boolean;
  is_hot?: boolean;
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
  "heart_empty" = "heart_empty",
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
