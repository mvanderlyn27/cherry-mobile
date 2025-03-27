//includes all info needed for UI elements

import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";

export const exploreStore$ = null;
export const libraryStore$ = null;
//need to figure out how we actually want to handle this
//probably just grab from users in supabase table
export const cherryStore$ = observable({
  premiumUser: false,
  credits: 0,
});
export const userPreferencesStore$ = observable({
  theme: "light",
  fontSize: 20,
  backgroundTexture: "",
});

syncObservable(userPreferencesStore$, {
  persist: {
    name: "documents",
    plugin: ObservablePersistMMKV,
  },
});
