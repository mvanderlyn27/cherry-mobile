import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Database } from "@/types/database";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
console.log("supabase", supabaseUrl, supabaseAnonKey);
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[Supabase] Missing environment variables", supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient<Database>(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
