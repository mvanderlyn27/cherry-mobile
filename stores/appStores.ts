//includes all info needed for UI elements

import { computed, observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import {
  Book,
  BookProgress,
  ExtendedBook,
  ExtendedChapter,
  ExtendedTag,
  PurchaseError,
  SavedTag,
  Tag,
} from "@/types/app";
import { bookProgress$, books$, chapters$, generateId, tags$ } from "./supabaseStores";
import { BookService } from "@/services/bookService";
import { authStore$ } from "./authStore";
import { ChapterService } from "@/services/chapterService";
import { LoggingService } from "@/services/loggingService";
import { PurchasesPackage } from "react-native-purchases";

// Type interfaces for the stores
interface AppStore {
  fontsReady: boolean;
  loggedIn: boolean;
  anonymous: boolean;
  storesLoaded: boolean;
  revenueCatReady: boolean;
  subscriptionStatusReady: boolean;
  cherryPackagesReady: boolean;
  error: string | null;
  userId: string | null;
}

interface ExploreStore {
  featuredBooks: ExtendedBook[];
  topTagBooks: Map<string, ExtendedBook[]>;
  topTags: ExtendedTag[];
  popularBooks: ExtendedBook[];
  newReleases: ExtendedBook[];
  recommendedBooks: ExtendedBook[];
  userTags: ExtendedTag[];
  savedTags: SavedTag[];
  isLoading: boolean;
  error: string | null;
}

interface LibraryStore {
  //owned books unread
  unreadBooks: Book[];
  //unowned books unread
  savedBooks: Book[];
  //owned books reading
  readingBooks: Book[];
  //owned books completed
  completedBooks: Book[];
  isLoading: boolean;
  error: string | null;
}
export type SortType = "most_liked" | "newest" | "oldest" | "most_viewed";

interface SearchStore {
  searchString: string | null;
  tags: Tag[] | null;
  sort: SortType | null;
  results: Book[];
}

interface CherryStore {
  premiumUser: boolean;
  credits: number;
}

interface UserPreferencesStore {
  theme: string;
  fontSize: number;
  backgroundTexture: string;
}

interface BookDetailsStore {
  bookIds: string[] | null; // Assuming this is a string, adjust as needed for your use case and data structure
  books: ExtendedBook[] | null;
  refreshBooks: () => void; // Function typ
  loading: boolean;
  error: string | null;
}
interface ReaderStore {
  book: ExtendedBook | null;
  chapters: Record<number, ExtendedChapter> | null;
  chapterContent: string | null;
  currentChapterNumber: number | null;
  loading: boolean;
  error: string | null;
  initialize: (bookId: string) => void;
  setChapter: (chapterNumber: number) => void;
}
interface PurchaseStore {
  cherryPackages: PurchasesPackage[] | null;
  purchaseType: string | null;
  purchaseAmount: number;
  purchaseStatus: "pending" | "completed" | "failed" | null;
  bookId: string | null;
  chapterId: string | null;
  error: PurchaseError | null;
}

// Create the observables with their respective types
export const appStore$ = observable<AppStore>({
  fontsReady: false,
  loggedIn: false,
  anonymous: false,
  storesLoaded: false,
  revenueCatReady: false,
  subscriptionStatusReady: false,
  cherryPackagesReady: false,
  error: null,
  userId: null,
});

// export const exploreStore$ = observable<ExploreStore>({
//   // Featured books - top 5 by reader count
//   featuredBooks: () => {
//     return BookService.getFeaturedBooks();
//   },

//   // topCategoryBooks - top 10 by reader count and likes
//   topTagBooks: () => {
//     return BookService.getTopTagsBooks();
//   },

//   topTags: () => {
//     return BookService.getTopTags();
//   },

//   // Popular books - top 10 by reader count and likes
//   popularBooks: () => {
//     return BookService.getPopularBooks();
//   },

//   // New releases - top 10 by created_at
//   newReleases: () => {
//     return BookService.getNewReleases();
//   },

//   // Recommended books
//   recommendedBooks: () => {
//     const userId = authStore$.userId.get();
//     return userId ? BookService.getRecommendedBooks() : [];
//   },

//   // Categories from tags
//   userTags: () => {
//     const userId = authStore$.userId.get();
//     return userId ? BookService.getUserTags(userId) : [];
//   },
//   // Loading state
//   savedTags: () => {
//     const userId = authStore$.userId.get();
//     return BookService.getSavedTags(userId);
//   },

//   isLoading: true,
//   error: null,
// });

// export const libraryStore$ = observable<LibraryStore>({
//   // Books the user has unlocked
//   unreadBooks: () => {
//     const userId = appStore$.userId.get();
//     return userId ? BookService.getUnreadBooks(userId) : [];
//   },

//   // Books the user has saved
//   savedBooks: () => {
//     const userId = appStore$.userId.get();
//     return userId ? BookService.getSavedBooks(userId) : [];
//   },

//   // Recently read books
//   readingBooks: () => {
//     const userId = appStore$.userId.get();
//     return userId ? BookService.getReadingBooks(userId) : [];
//   },

//   // Completed books
//   completedBooks: () => {
//     const userId = appStore$.userId.get();
//     return userId ? BookService.getCompletedBooks(userId) : [];
//   },

//   isLoading: true,
//   error: null,
// });

//set search, category, and sort
export const searchStore$ = observable<SearchStore>({
  searchString: null,
  tags: null,
  sort: null,
  results: () => {
    const searchString = searchStore$.searchString.get();
    const tags = searchStore$.tags.get();
    const sort = searchStore$.sort.get();
    return BookService.searchBooks({ title: searchString, tags: tags, sort });
  },
});

//set bookIds to update bookdetails
export const bookDetailsStore$ = observable<BookDetailsStore>({
  // Used for the reader screen, and details
  bookIds: null,
  books: () => {
    const userId = authStore$.userId.get();
    const bookIds = bookDetailsStore$.bookIds.get();
    return userId && bookIds && bookIds.length > 0 ? bookIds.map((bookId) => BookService.getBookDetails(bookId)) : [];
  },
  refreshBooks() {
    const bookIds = bookDetailsStore$.bookIds.get();
    if (!bookIds) return;
    const books = bookIds.map((bookId) => BookService.getBookDetails(bookId)).filter((book) => book) as ExtendedBook[];
    bookDetailsStore$.books.set(books);
  },
  loading: false,
  error: null,
});
export const readerStore$ = observable<ReaderStore>({
  book: null,
  chapters: null,
  currentChapterNumber: null,
  chapterContent: null,
  loading: true,
  error: null,

  initialize: async (bookId: string) => {
    console.log("initializing reader", bookId);
    readerStore$.loading.set(true);

    try {
      const userId = authStore$.userId.get();
      if (!userId) {
        throw new Error("No user found");
      }

      // Delegate initialization to ChapterService
      const { book, chapters, currentChapterNumber } = await ChapterService.initializeReader(bookId, userId);

      // Update store with initialized data
      readerStore$.book.set(book);
      readerStore$.chapters.set(chapters);
      readerStore$.currentChapterNumber.set(currentChapterNumber);

      // Load content for the current chapter
      readerStore$.setChapter(currentChapterNumber);

      readerStore$.error.set(null);
    } catch (error) {
      console.error("Reader initialization error:", error);
      readerStore$.error.set(JSON.stringify(error) || "Failed to initialize reader");
      LoggingService.handleError("Reader initialization failed", { bookId, error }, false);
    } finally {
      readerStore$.loading.set(false);
    }
  },

  setChapter: async (chapterNumber: number) => {
    console.log("setting chapter", chapterNumber);
    readerStore$.loading.set(true);

    try {
      const book = readerStore$.book.get();
      const chapters = readerStore$.chapters.get();

      if (!book || !chapters) {
        throw new Error("Book or chapters not loaded");
      }

      const chapter: ExtendedChapter = chapters[chapterNumber];
      if (!chapter) {
        throw new Error(`Chapter ${chapterNumber} not found`);
      }

      // Delegate chapter loading to ChapterService
      const { content, bookProgressId } = await ChapterService.loadChapter(chapter.chapter_number, book.id);

      // Update store with chapter data
      readerStore$.currentChapterNumber.set(chapterNumber);
      readerStore$.chapterContent.set(content);

      // Update book progress in store if needed
      if (bookProgressId && book.progress && book.progress.id !== bookProgressId) {
        readerStore$.book.progress.set({
          ...book.progress,
          id: bookProgressId,
          current_chapter_id: chapter.id,
        });
      }

      readerStore$.error.set(null);
    } catch (error) {
      console.error("Chapter loading error:", error);
      readerStore$.error.set(JSON.stringify(error) || "Failed to load chapter");
      LoggingService.handleError("Chapter loading failed", { chapterNumber, error }, false);
    } finally {
      readerStore$.loading.set(false);
    }
  },
});

export const purchaseStore$ = observable<PurchaseStore>({
  // Add any state related to the purchase process here
  cherryPackages: null,
  purchaseType: null,
  purchaseAmount: 0,
  purchaseStatus: null,
  bookId: null,
  chapterId: null,
  error: null,
});
//need to figure out how we actually want to handle this
//probably just grab from users in supabase table
export const cherryStore$ = observable<CherryStore>({
  premiumUser: false,
  credits: 0,
});

export const userPreferencesStore$ = observable<UserPreferencesStore>({
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
