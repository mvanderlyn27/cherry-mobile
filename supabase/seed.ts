/**
 * ! Executing this script will delete all data in your database and seed it with 10 auth_users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";
import { copycat } from "@snaplet/copycat";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);
const main = async () => {
  try {
    // First, fetch existing users from Supabase
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }
    const userMap = users.map((user) => ({ id: user.id }));

    // console.log(`Found ${users?.length || 0} existing users`);

    // Initialize seed client
    const seed = await createSeedClient({ dryRun: true });
    // const seed = await createSeedClient({ dryRun: false });

    // console.log("Seed client initialized");

    // Skip database reset in this example to preserve existing users
    // await seed.$resetDatabase(["!*auth*", "!*users", "!*public.users"]);

    // console.log("Creating test data...");

    // Create tags
    const { tags } = await seed.tags((x) =>
      x(20, {
        id: (i) => uuidv4(),
        name: (i) => copycat.word(Math.random()),
        tag_image_url: (i) => `https://picsum.photos/400/600?random=${Math.random()}`,
      })
    );
    // Create books
    const { books } = await seed.books(
      (x) =>
        x(100, {
          id: (i) => uuidv4(),
          title: (i) => copycat.word(i.seed),
          author: (i) => copycat.word(i.seed) + " " + copycat.word(i.seed),
          description: (i) => copycat.paragraph(""),
          cover_url: (i) => `https://picsum.photos/400/600?random=${Math.random()}`,
          // book_progress: (x) =>
          //   x({ min: 1, max: 5 }, { user_id: (i) => users[Math.floor(Math.random() * users.length)].id }),
          // saved_books: (x) =>
          //   x({ min: 1, max: 5 }, { user_id: (i) => users[Math.floor(Math.random() * users.length)].id }),
          // user_unlocks: (x) =>
          //   x({ min: 1, max: 5 }, { user_id: (i) => users[Math.floor(Math.random() * users.length)].id }),
          // chapters: (x) =>
          //   x(
          //     { min: 30, max: 100 },
          //     {
          //       title: (i) => copycat.word("") + " " + copycat.word("1"),
          //       content_url: (i) =>
          //         "https://udanvhxljxoypvmabmel.supabase.co/storage/v1/object/public/chapter_content/e736f3cd-2ca6-43c8-a0e8-9c1d3f7eff02/f1b32472-5836-43e7-873d-4538843f32a1/1.txt",
          //       user_unlocks: (x) => x({ min: 1, max: 5 }),
          //     }
          //   ),
          // comments: (x) =>
          //   x(
          //     { min: 1, max: 5 },
          //     {
          //       content: (i) => copycat.paragraph(""),
          //       user_id: (i) => users[Math.floor(Math.random() * users.length)].id,
          //     }
          //   ),
          // liked_chapters: (x) =>
          //   x(
          //     { min: 1, max: 30 },
          //     {
          //       user_id: (i) => users[Math.floor(Math.random() * users.length)].id,
          //     }
          //   ),
        })
      // { connect: { tags, public_users: userMap } }
    );

    //create book_tags
    await seed.book_tags((x) => x(200), { connect: { books, tags } });
    const { chapters } = await seed.chapters(
      (x) =>
        x(200, {
          title: (i) => copycat.word("") + " " + copycat.word("1"),
          content_url: (i) =>
            "https://udanvhxljxoypvmabmel.supabase.co/storage/v1/object/public/chapter_content/e736f3cd-2ca6-43c8-a0e8-9c1d3f7eff02/f1b32472-5836-43e7-873d-4538843f32a1/1.txt",
          // user_unlocks: (x) => x({ min: 1, max: 5 }),
        }),
      { connect: { books } }
    );
    await seed.comments((x) => x(200), { connect: { books, public_users: userMap } });
    await seed.liked_chapters((x) => x(200), { connect: { books, public_users: userMap } });
    await seed.book_progress((x) => x(200), { connect: { books, public_users: userMap } });
    await seed.chapter_progress((x) => x(200), { connect: { books, chapters, public_users: userMap } });
    await seed.saved_books((x) => x(200), { connect: { books, public_users: userMap } });
    await seed.user_unlocks((x) => x(200), { connect: { books, public_users: userMap } });
    await seed.user_unlocks((x) => x(200), { connect: { books, chapters, public_users: userMap } });

    // Create chapters
    // await seed.user_unlocks((x) => x(200), { connect: { books, users } });
    // create saved_books
    // await seed.saved_books((x) => x(200), { connect: { books, users } });
    // create chapter_progress
    // create book_progress
    // create book_likes

    // console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error in seeding:", error);
  } finally {
    process.exit();
  }
};

main();
