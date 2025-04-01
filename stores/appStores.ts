//includes all info needed for UI elements

import { computed, observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { Book, ExtendedBook, ExtendedChapter, ExtendedTag, SavedTag, Tag } from "@/types/app";
import { books$, tags$ } from "./supabaseStores";
import { BookService } from "@/services/bookService";
import { authStore$ } from "./authStore";

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
    return userId && bookIds && bookIds.length > 0
      ? bookIds.map((bookId) => BookService.getBookDetails(bookId, userId))
      : [];
  },
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
