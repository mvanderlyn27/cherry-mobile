import { categoryData } from "./testData";

//make supabase table, and add some test data to replace
type BookStatus = {
  bookId: string;
  progress: number;
  started: boolean;
  lastReadAt: string;
};

export const userBookStatus: BookStatus[] = [
  // Reading books
  {
    bookId: "r1",
    progress: 45,
    started: true,
    lastReadAt: new Date().toISOString(),
  },
  {
    bookId: "m2",
    progress: 75,
    started: true,
    lastReadAt: new Date().toISOString(),
  },
  {
    bookId: "f3",
    progress: 30,
    started: true,
    lastReadAt: new Date().toISOString(),
  },
  // Completed books
  {
    bookId: "s1",
    progress: 100,
    started: true,
    lastReadAt: new Date().toISOString(),
  },
  {
    bookId: "h2",
    progress: 100,
    started: true,
    lastReadAt: new Date().toISOString(),
  },
];
