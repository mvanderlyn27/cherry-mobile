import { createClient } from "@supabase/supabase-js";
import { copycat, faker } from "@snaplet/copycat";
import { Database } from "@/types/database";

const PASSWORD = "testuser";

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

async function createSupabaseUser(seed: string): Promise<void> {
  const email = copycat.email(seed).toLowerCase();
  await supabase.auth.signUp({
    email,
    password: PASSWORD,
    options: {
      data: {},
    },
  });
}
const clearUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    console.error("Error fetching users:", error);
    return;
  }
  console.log(`Found ${data?.length || 0} existing users`);
  if (data) {
    for (const user of data) {
      await supabase.auth.admin.deleteUser(user.id);
    }
  }
};
const createUsers = async () => {
  for (let i = 0; i < 50; i++) {
    await createSupabaseUser(i.toString());
  }
};
clearUsers();
createUsers();
