import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[Supabase] Missing environment variables", supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const getAnonymousUser = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Create anonymous session if none exists
    const { error } = await supabase.auth.signUp({
      email: `anonymous_${Date.now()}@example.com`,
      password: `anon_${Math.random().toString(36).substring(2, 15)}`,
    });

    if (error) {
      console.error("[Supabase] Error creating anonymous user:", error);
    }
  }

  return supabase.auth.getUser();
};
