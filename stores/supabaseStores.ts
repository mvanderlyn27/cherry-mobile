import { observable } from "@legendapp/state";
import { configureSyncedSupabase, syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { supabase } from "@/services/supabase";
import uuid from "react-native-uuid";
import { LoggingService } from "@/services/loggingService";
import { appStore$ } from "./appStores";
import { WaitForSetCrudFnParams } from "@legendapp/state/sync-plugins/crud";
import { ChapterProgress, CherryLedger } from "@/types/app";

// provide a function to generate ids locally
export const generateId = () => uuid.v4();
configureSyncedSupabase({
  generateId,
});

export const books$ = observable(
  syncedSupabase({
    supabase,
    collection: "books",
    realtime: true,
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
    realtime: true,
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "users" }, false);
    },
  })
);

export const cherryLedger$ = observable(
  syncedSupabase({
    supabase,
    collection: "cherry_ledger",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "users" }, false);
    },
    waitForSet: ({ value }: WaitForSetCrudFnParams<CherryLedger>) =>
      transactions$[value.transaction_id].created_at && users$[value.user_id].created_at, // Wait until the created_at timestamp is set before setting the value in the state
  })
);
export const profiles$ = observable(
  syncedSupabase({
    supabase,
    collection: "profiles",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
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
    realtime: true,
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
    onError: (error, params) => {
      console.log("chapterProgress onError", error, params);
      LoggingService.handleError(error, { collection: "chapter_progress" }, false);
    },
    waitForSet: ({ value }: WaitForSetCrudFnParams<ChapterProgress>) =>
      bookProgress$[value.book_progress_id].created_at,
  })
);
export const likedChapters$ = observable(
  syncedSupabase({
    supabase,
    collection: "liked_chapters",
    realtime: true,
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
    actions: ["read", "create", "update", "delete"],
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
    actions: ["read", "create", "update", "delete"],
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
    realtime: true,
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
    onError: (error) => {
      LoggingService.handleError(error, { collection: "user_unlocks" }, false);
    },
  })
);

// Add this function to check if all stores are loaded
export const areStoresLoaded = () => {
  // Create an array of all stores to check
  const stores = [
    books$,
    chapters$,
    tags$,
    savedTags$,
    bookTags$,
    users$,
    profiles$,
    savedBooks$,
    bookProgress$,
    chapterProgress$,
    likedChapters$,
    comments$,
    interactions$,
    transactions$,
    userUnlocks$,
    cherryLedger$,
  ];

  // Check if all stores have been initialized (not in loading state)
  return stores.every((store) => {
    const storeState = store.get();
    // A store is considered loaded if it's not null and not in a loading state
    return storeState !== null && !store.loading?.get();
  });
};

// Function to wait until all stores are loaded
export const waitForStoresLoaded = () => {
  return new Promise<boolean>((resolve) => {
    // Check immediately first
    if (areStoresLoaded()) {
      appStore$.storesLoaded.set(true);
      resolve(true);
      return;
    }

    // Set up an interval to check periodically
    const checkInterval = setInterval(() => {
      if (areStoresLoaded()) {
        clearInterval(checkInterval);
        resolve(true);
      }
    }, 100); // Check every 100ms

    // Set a timeout to prevent infinite waiting
    setTimeout(() => {
      clearInterval(checkInterval);
      console.warn("Store loading timed out after 10 seconds");
      resolve(false);
    }, 10000); // 10 second timeout
  });
};
