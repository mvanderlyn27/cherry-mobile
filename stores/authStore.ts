// should hold user preferences,

import { observable, syncState } from "@legendapp/state";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { syncObservable } from "@legendapp/state/sync";
import { User } from "@supabase/supabase-js";

// user preferences, local only, unless user creates an account
// Define auth store state
interface AuthStoreState {
  userId: string | null;
  authState: AuthState;
  isNew: boolean;
  isLoading: boolean;
}
// Auth state types
export type AuthState = "initializing" | "authenticated" | "anonymous" | "unauthenticated";
//add an init that sets up
export const authStore$ = observable<AuthStoreState>({
  userId: null,
  authState: "initializing",
  isNew: true,
  isLoading: false,
});

// Setup persistence
syncObservable(authStore$, {
  persist: {
    name: "auth-store",
    plugin: ObservablePersistMMKV,
  },
});
// const sync$ = syncState(authStore$);
// sync$.clearPersist();
