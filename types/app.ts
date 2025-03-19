import { Database } from "./database";

export type Book = Database["public"]["Tables"]["books"]["Row"];
export type Chapter = Database["public"]["Tables"]["chapters"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];

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
  "lock" = "lock",
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
}
