import { observable } from "@legendapp/state";
import { configureSyncedSupabase, syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { supabase } from "@/services/supabase";
import uuid from "react-native-uuid";
import { LoggingService } from "@/services/loggingService";

// provide a function to generate ids locally
export const generateId = () => uuid.v4();
configureSyncedSupabase({
  generateId,
});

export const books$ = observable(
  syncedSupabase({
    supabase,
    collection: "books",
    select: (from) => from.select("*"),
    actions: ["read"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "books" }, false);
    },
  })
);
export const chapters$ = observable(
  syncedSupabase({
    supabase,
    collection: "chapters",
    select: (from) => from.select("*"),
    actions: ["read"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "chapters" }, false);
    },
  })
);
export const tags$ = observable(
  syncedSupabase({
    supabase,
    collection: "tags",
    select: (from) => from.select("*"),
    actions: ["read"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "tags" }, false);
    },
  })
);
export const savedTags$ = observable(
  syncedSupabase({
    supabase,
    collection: "saved_tags",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "saved_tags" }, false);
    },
  })
);

export const bookTags$ = observable(
  syncedSupabase({
    supabase,
    collection: "book_tags",
    select: (from) => from.select("*"),
    actions: ["read"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "book_tags" }, false);
    },
  })
);

export const users$ = observable(
  syncedSupabase({
    supabase,
    collection: "users",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "users" }, false);
    },
  })
);
export const profiles$ = observable(
  syncedSupabase({
    supabase,
    collection: "profiles",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "profiles" }, false);
    },
  })
);
export const savedBooks$ = observable(
  syncedSupabase({
    supabase,
    collection: "saved_books",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "saved_books" }, false);
    },
  })
);
export const bookProgress$ = observable(
  syncedSupabase({
    supabase,
    collection: "book_progress",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "book_progress" }, false);
    },
  })
);
export const chapterProgress$ = observable(
  syncedSupabase({
    supabase,
    collection: "chapter_progress",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "chapter_progress" }, false);
    },
  })
);
export const likedChapters$ = observable(
  syncedSupabase({
    supabase,
    collection: "liked_chapters",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "liked_chapters" }, false);
    },
  })
);
export const comments$ = observable(
  syncedSupabase({
    supabase,
    collection: "comments",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "comments" }, false);
    },
  })
);
export const interactions$ = observable(
  syncedSupabase({
    supabase,
    collection: "interactions",
    select: (from) => from.select("*"),
    actions: ["create"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "interactions" }, false);
    },
  })
);
//shoud be realtime?
export const transactions$ = observable(
  syncedSupabase({
    supabase,
    collection: "transactions",
    select: (from) => from.select("*"),
    actions: ["read", "create"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "transactions" }, false);
    },
  })
);
//should be realtime?
export const userUnlocks$ = observable(
  syncedSupabase({
    supabase,
    collection: "user_unlocks",
    select: (from) => from.select("*"),
    actions: ["read"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "user_unlocks" }, false);
    },
  })
);
