//includes all info needed for UI elements

import { computed, observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { Book, BookProgress, ExtendedBook, ExtendedChapter, ExtendedTag, SavedTag, Tag } from "@/types/app";
import { bookProgress$, books$, generateId, tags$ } from "./supabaseStores";
import { BookService } from "@/services/bookService";
import { authStore$ } from "./authStore";
import { ChapterService } from "@/services/chapterService";
import { LoggingService } from "@/services/loggingService";

// Type interfaces for the stores
interface AppStore {
  fontsReady: boolean;
  loggedIn: boolean;
  storesLoaded: boolean;
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
interface ReaderStore {
  book: ExtendedBook | null;
  chapters: ExtendedChapter[] | null;
  chapterContent: string | null;
  currentChapter: ExtendedChapter | null;
  loading: boolean;
  error: string | null;
  initialize: (bookId: string) => void;
  setChapter: (chapterId: string) => void;
  finishChapter: () => void;
}

// Create the observables with their respective types
export const appStore$ = observable<AppStore>({
  fontsReady: false,
  loggedIn: false,
  storesLoaded: false,
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
  loading: false,
  error: null,
});
export const readerStore$ = observable<ReaderStore>({
  book: null,
  chapters: null, //id, is_owned
  currentChapter: null,
  chapterContent: null,
  loading: true,
  error: null,
  initialize: async (bookId: string) => {
    // get book details
    // Setup progress for this chapter, and chapter progress, if they don't exist yet
    // get id/is_owned for all chapters
    // get most recently read chapter, set as current chapter
    // get chapter_content
    readerStore$.loading.set(true);
    const userId = authStore$.userId.get();
    if (!userId) {
      readerStore$.error.set("no user found");
      return;
    }
    const book = BookService.getBookDetails(bookId);
    if (!book) {
      readerStore$.error.set("no book found");
      LoggingService.handleError("Book not found", { bookId: bookId }, false);
      return;
    }
    readerStore$.book.set(book);

    const chapters = ChapterService.getChapters(bookId);
    if (!chapters || chapters.length === 0) {
      readerStore$.error.set("no chapters found");
      LoggingService.handleError("Chapters not found", { bookId: bookId }, false);
      return;
    }
    readerStore$.chapters.set(chapters);
    //update book progress
    const bookProgress = book.progress;
    if (!bookProgress) {
      const currentChapter = chapters[0];
      //create book progress
      const bookProgressId = generateId();
      const bookProgress = {
        id: bookProgressId,
        user_id: userId,
        book_id: bookId,
        current_chapter_id: currentChapter.id,
        status: "reading",
      } as BookProgress;
      bookProgress$[bookProgressId].set(bookProgress);
      readerStore$.book.progress.set(bookProgress);
      readerStore$.setChapter(currentChapter.id);
    } else {
      //we already have a bookProgress & hopefully chapterProgress
      const currentChapterId = bookProgress.current_chapter_id;
      if (!currentChapterId) {
        readerStore$.error.set("no current chapter found");
        LoggingService.handleError("Current chapter not found", { currentChapterId: currentChapterId }, false);
        return;
      }
      readerStore$.setChapter(currentChapterId);
    }
    readerStore$.error.set(null);
    readerStore$.loading.set(false);
  },
  setChapter: async (chapterId: string) => {
    readerStore$.loading.set(true);
    const bookProgress = readerStore$.book.progress.get();
    if (!bookProgress) {
      readerStore$.error.set("no book progress found");
      LoggingService.handleError("Book progress not found", { bookProgress: bookProgress }, false);
      return;
    }
    const newChapter = readerStore$.chapters.get()?.find((chapter) => chapter.id === chapterId);
    if (!newChapter) {
      readerStore$.error.set("no chapter found");
      LoggingService.handleError("Chapter not found", { chapterId: chapterId }, false);
      return;
    }
    readerStore$.currentChapter.set(newChapter);
    const content = await ChapterService.getChapterContent(newChapter);
    readerStore$.chapterContent.set(content);
    readerStore$.loading.set(false);
    if (!content) {
      readerStore$.error.set("no chapter content found");
      LoggingService.handleError("Chapter content not found", { chapterId: chapterId }, false);
      return;
    }
    bookProgress$[bookProgress.id].current_chapter_id.set(chapterId);
    ChapterService.startReadingChapter(newChapter, bookProgress.id);
  },
  finishChapter: () => {
    const bookProgress = readerStore$.book.progress.get();
    if (!bookProgress) {
      readerStore$.error.set("no book progress found");
      LoggingService.handleError("Book progress not found", { bookProgress: bookProgress }, false);
      return;
    }
    const currentChapter = readerStore$.currentChapter.get();
    if (!currentChapter) {
      readerStore$.error.set("no current chapter found");
      LoggingService.handleError("Current chapter not found", { currentChapter: currentChapter }, false);
      return;
    }
    ChapterService.finishReadingChapter(currentChapter, bookProgress.id);
  },
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
