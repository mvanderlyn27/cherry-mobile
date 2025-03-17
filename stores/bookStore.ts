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
    // Optional:
    // Select only id and text fields
    select: (from) => from.select("*"),
    // Don't allow delete
    actions: ["read"],
    // Realtime filter by user_id
    // persist: { name: "books", retrySync: true, plugin: ObservablePersistMMKV },
    // Sync only diffs
    // changesSince: "last-sync",
  })
);
export const chapters$ = observable(
  syncedSupabase({
    supabase,
    collection: "chapters",
    // Optional:
    // Select only id and text fields
    select: (from) => from.select("*"),
    // Don't allow delete
    actions: ["read"],
    // Realtime filter by user_id
    // persist: { name: "chapters", retrySync: true, plugin: ObservablePersistMMKV },
    // Sync only diffs
    // changesSince: "last-sync",
  })
);
export const tags$ = observable(
  syncedSupabase({
    supabase,
    collection: "tags",
    // Optional:
    // Select only id and text fields
    select: (from) => from.select("*"),
    // Don't allow delete
    actions: ["read"],
    // Realtime filter by user_id
    // persist: { name: "tags", retrySync: true, plugin: ObservablePersistMMKV },
    // Sync only diffs
    // changesSince: "last-sync",
  })
);
export const categories$ = observable(
  syncedSupabase({
    supabase,
    collection: "categories",
    // Optional:
    // Select only id and text fields
    select: (from) => from.select("*"),
    // Don't allow delete
    actions: ["read"],
    // Realtime filter by user_id
    // persist: { name: "categories", retrySync: true, plugin: ObservablePersistMMKV },
    // Sync only diffs
    // changesSince: "last-sync",
  })
);
