//includes all info needed for UI elements

import { computed, observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { Book, ExtendedBook, ExtendedChapter, Tag } from "@/types/app";
import { books$, tags$ } from "./supabaseStores";
import { BookService } from "@/services/bookService";

// Type interfaces for the stores
interface AppStore {
  fontsReady: boolean;
  loggedIn: boolean;
  booksReady: boolean;
  chaptersReady: boolean;
  error: string | null;
  userId: string | null;
}

interface ExploreStore {
  featuredBooks: Book[];
  topCategoryBooks: Map<Tag, Book[]>;
  popularBooks: Book[];
  newReleases: Book[];
  recommendedBooks: Book[];
  categories: Tag[];
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
  currentBookId: string | null; // Assuming this is a string, adjust as needed for your use case and data structure
  currentBook: ExtendedBook | null;
  loading: boolean;
  error: string | null;
}

// Create the observables with their respective types
export const appStore$ = observable<AppStore>({
  fontsReady: false,
  loggedIn: false,
  booksReady: false,
  chaptersReady: false,
  error: null,
  userId: null,
});

export const exploreStore$ = observable<ExploreStore>({
  // Featured books - top 5 by reader count
  featuredBooks: () => {
    return BookService.getFeaturedBooks();
  },

  // topCategoryBooks - top 10 by reader count and likes
  topCategoryBooks: () => {
    return BookService.getTopCategoryBooks();
  },

  // Popular books - top 10 by reader count and likes
  popularBooks: () => {
    return BookService.getPopularBooks();
  },

  // New releases - top 10 by created_at
  newReleases: () => {
    return BookService.getNewReleases();
  },

  // Recommended books
  recommendedBooks: () => {
    return BookService.getRecommendedBooks();
  },

  // Categories from tags
  categories: () => {
    return Object.values(tags$.get() || {});
  },

  isLoading: true,
  error: null,
});

export const libraryStore$ = observable<LibraryStore>({
  // Books the user has unlocked
  unreadBooks: () => {
    const userId = appStore$.userId.get();
    return userId ? BookService.getUnreadBooks(userId) : [];
  },

  // Books the user has saved
  savedBooks: () => {
    const userId = appStore$.userId.get();
    return userId ? BookService.getSavedBooks(userId) : [];
  },

  // Recently read books
  readingBooks: () => {
    const userId = appStore$.userId.get();
    return userId ? BookService.getReadingBooks(userId) : [];
  },

  // Completed books
  completedBooks: () => {
    const userId = appStore$.userId.get();
    return userId ? BookService.getCompletedBooks(userId) : [];
  },

  isLoading: true,
  error: null,
});

//set bookId to update bookdetails
export const bookDetailsStore$ = observable<BookDetailsStore>({
  // Used for the reader screen, and details
  currentBookId: null,
  currentBook: () => BookService.getBookDetails(bookDetailsStore$.currentBookId.get()),
  loading: false,
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
