import { observable } from "@legendapp/state";
import { configureSyncedSupabase, syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { supabase } from "@/services/supabase";

// provide a function to generate ids locally
const generateId = () => uuidv4();
configureSyncedSupabase({
  generateId,
});

export const books$ = observable(
  syncedSupabase({
    supabase,
    collection: "books",
    select: (from) => from.select("*"),
    actions: ["read"],
  })
);
export const chapters$ = observable(
  syncedSupabase({
    supabase,
    collection: "chapters",
    select: (from) => from.select("*"),
    actions: ["read"],
  })
);
export const tags$ = observable(
  syncedSupabase({
    supabase,
    collection: "tags",
    select: (from) => from.select("*"),
    actions: ["read"],
  })
);
export const savedTags$ = observable(
  syncedSupabase({
    supabase,
    collection: "saved_tags",
    select: (from) => from.select("*"),
    actions: ["read"],
  })
);

export const bookTags$ = observable(
  syncedSupabase({
    supabase,
    collection: "book_tags",
    select: (from) => from.select("*"),
    actions: ["read"],
  })
);

export const users$ = observable(
  syncedSupabase({
    supabase,
    collection: "users",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update"],
  })
);
export const profiles$ = observable(
  syncedSupabase({
    supabase,
    collection: "profiles",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update"],
  })
);
export const savedBooks$ = observable(
  syncedSupabase({
    supabase,
    collection: "saved_books",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
  })
);
export const bookProgress$ = observable(
  syncedSupabase({
    supabase,
    collection: "book_progress",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
  })
);
export const chapterProgress$ = observable(
  syncedSupabase({
    supabase,
    collection: "chapter_progress",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
  })
);
export const likedChapters$ = observable(
  syncedSupabase({
    supabase,
    collection: "liked_chapters",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update", "delete"],
  })
);
export const comments$ = observable(
  syncedSupabase({
    supabase,
    collection: "comments",
    select: (from) => from.select("*"),
    actions: ["read", "create", "update"],
  })
);
export const interactions$ = observable(
  syncedSupabase({
    supabase,
    collection: "interactions",
    select: (from) => from.select("*"),
    actions: ["create"],
  })
);
//shoud be realtime?
export const transactions$ = observable(
  syncedSupabase({
    supabase,
    collection: "transactions",
    select: (from) => from.select("*"),
    actions: ["read", "create"],
  })
);
//should be realtime?
export const userUnlocks$ = observable(
  syncedSupabase({
    supabase,
    collection: "user_unlocks",
    select: (from) => from.select("*"),
    actions: ["read"],
  })
);
