import { supabase } from "./supabase";
import {
  books$,
  chapters$,
  tags$,
  bookTags$,
  savedBooks$,
  bookProgress$,
  chapterProgress$,
  userUnlocks$,
  likedChapters$,
  savedTags$,
  generateId,
} from "../stores/supabaseStores";
import { LoggingService } from "./loggingService";
import { Observable, syncState, when } from "@legendapp/state";
import {
  ExtendedBook,
  ExtendedChapter,
  Tag,
  Book,
  SavedTag,
  SavedBook,
  BookTag,
  ExtendedTag,
  BookProgress,
} from "@/types/app";
import { authStore$ } from "@/stores/authStore";

const HOT_THRESHOLD = 5;

export class BookService {
  /**
   * Gets detailed information about a book including chapters, likes, and user-specific data
   * @param bookId The ID of the book to get details for
   * @param userId The ID of the current user
   * @returns Detailed book information with chapters and user-specific data
   */
  static getBookDetails(bookId: string): ExtendedBook | null {
    const userId = authStore$.userId.get();
    if (!userId) return null;
    try {
      // Get the book data
      const book = books$[bookId].get();
      //   console.log("book", book, "bookid", bookId, "userid", userId);
      if (!book) return null;

      // get is saved
      const is_saved = userId
        ? Object.values(savedBooks$.get() || {}).some((saved) => saved.book_id === bookId && saved.user_id === userId)
        : false;

      // get is  hot
      const is_hot = (book.like_count || 0) > HOT_THRESHOLD;
      //map of sums of likes per book

      // Get book Tags
      const bookTags: BookTag[] = Object.values(bookTags$.get() || {}).filter((tag) => tag.book_id === bookId);
      // Get user unlocks for this book
      const allUserUnlocks = Object.values(userUnlocks$.get() || {});
      const userBookUnlocks = allUserUnlocks.filter((unlock) => unlock.user_id === userId && unlock.book_id === bookId);

      // Check if the entire book is unlocked (user has an unlock entry with just the book_id)
      const isEntireBookUnlocked = userBookUnlocks.some((unlock) => unlock.book_id === bookId && !unlock.chapter_id);
      const bookProgress = Object.values(bookProgress$.get() || {}).find(
        (progress) => progress.book_id === bookId && userId === progress.user_id
      );
      // Extended chapter data with likes and locked status, and progress
      // Might need to move to chapter service

      // Return enhanced book data
      return {
        ...book,
        tags: bookTags,
        is_owned: userId ? isEntireBookUnlocked : false,
        is_saved,
        is_hot,
        progress: bookProgress,
      };
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getBookDetails", bookId, userId }, false);
      return null;
    }
  }
  static getUserTags(): ExtendedTag[] {
    const userId = authStore$.userId.get();
    if (!userId) return [];
    try {
      // Get all tags and book tags
      const allBookTags = Object.values(bookTags$.get() || {});
      const allTags = Object.values(tags$.get() || {});
      const allSavedTags = Object.values(savedTags$.get() || {});

      // Find user's saved tags
      const userSavedTagIds = allSavedTags
        .filter((savedTag) => savedTag.user_id === userId)
        .map((savedTag) => savedTag.tag_id);

      // Count books per tag for popularity
      const tagPopularity: Record<string, number> = {};
      allBookTags.forEach((bookTag) => {
        if (bookTag.tag_id) {
          tagPopularity[bookTag.tag_id] = (tagPopularity[bookTag.tag_id] || 0) + 1;
        }
      });

      // Create extended tags with saved status and popularity
      const extendedTags: ExtendedTag[] = allTags.map((tag) => ({
        ...tag,
        is_saved: userSavedTagIds.includes(tag.id),
        is_hot: tagPopularity[tag.id] > HOT_THRESHOLD,
      }));

      // Sort: saved tags first, then by popularity
      const sortedTags = extendedTags.sort((a, b) => {
        // First sort by saved status
        if (a.is_saved && !b.is_saved) return -1;
        if (!a.is_saved && b.is_saved) return 1;

        // Then sort by popularity
        return tagPopularity[b.id] - tagPopularity[b.id];
      });
      return sortedTags;
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getUserTags", userId }, false);
      return [];
    }
  }
  static toggleSaveTag(tagId: string) {
    console.log("saving tag");
    try {
      const userId = authStore$.userId.get();
      if (!userId) return;
      const savedTags = BookService.getSavedTags();
      const existingSavedTagId = Object.values(savedTags).find(
        (savedTag) => savedTag.user_id === userId && savedTag.tag_id === tagId
      )?.id;
      if (existingSavedTagId) {
        console.log("existing tag");
        savedTags$[existingSavedTagId].delete();
      } else {
        console.log("new save tag");
        const id = generateId();
        savedTags$[id].set({ id, user_id: userId, tag_id: tagId } as SavedTag);
      }
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.handleSaveTag", tagId }, false);
    }
  }

  // Get books by category/tag
  static getBooksByCategory(categoryId: string): Book[] {
    try {
      const allBookTags = Object.values(bookTags$.peek());
      const allBooks = books$.peek();

      // Find all book IDs that have this tag
      const bookIds = allBookTags.filter((bookTag) => bookTag.tag_id === categoryId).map((bookTag) => bookTag.book_id);

      // Get the actual book objects
      return bookIds.map((id) => allBooks[id]).filter(Boolean);
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getBooksByCategory", categoryId }, false);
      return [];
    }
  }

  /**
   * Search for books with optional filtering by category and title
   * @param options Search options including category, title, and pagination
   * @returns Array of books matching the search criteria
   */
  static searchBooks(options: {
    tags?: Tag[] | null;
    title?: string | null;
    sort?: "newest" | "oldest" | "most_read" | "most_liked" | "most_viewed" | null;
    page?: number;
    pageSize?: number;
  }): Book[] {
    try {
      //   console.log("searching books", options);
      const { tags, title, page = 1, pageSize = 10 } = options;
      let filteredBooks: Book[] = [];

      // Get all books
      const allBooks = Object.values(books$.get());
      //   console.log("all books", allBooks);
      //   console.log("supabase creds", process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
      // Filter by category if provided
      if (tags && tags.length > 0) {
        const tagIds = tags.map((tag) => tag.id);
        const allBookTags = Object.values(bookTags$.peek());
        const bookIdsInCategory = allBookTags
          .filter((bookTag) => bookTag.tag_id && tagIds.includes(bookTag.tag_id))
          .map((bookTag) => bookTag.book_id);

        filteredBooks = allBooks.filter((book) => bookIdsInCategory.includes(book.id));
      } else {
        filteredBooks = allBooks;
      }

      // Filter by title if provided
      if (title && title.trim() !== "") {
        const searchTerm = title.toLowerCase().trim();
        filteredBooks = filteredBooks.filter(
          (book) => book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm)
        );
      }
      //   console.log("filtered books", filteredBooks);
      // Apply pagination
      //   const startIndex = (page - 1) * pageSize;
      //   const paginatedBooks = filteredBooks.slice(startIndex, startIndex + pageSize);
      const paginatedBooks = filteredBooks;

      return paginatedBooks;
    } catch (error) {
      LoggingService.handleError(
        error,
        {
          method: "BookService.searchBooks",
          options,
        },
        false
      );
      return [];
    }
  }

  // Get book likes from chapter likes
  static getBookLikes() {
    try {
      const allLikedChapters = Object.values(likedChapters$.get() || {});
      const allChapters = Object.values(chapters$.get() || {});

      // Create a map of chapter IDs to book IDs
      const chapterToBookMap = allChapters.reduce<Record<string, string>>((map, chapter) => {
        if (!chapter.id) return map;
        map[chapter.id] = chapter.book_id;

        return map;
      }, {});

      // Count likes per book
      const bookLikesMap = allLikedChapters.reduce<Record<string, number>>((map, like) => {
        const bookId = like.chapter_id && chapterToBookMap[like.chapter_id];
        if (bookId) {
          map[bookId] = (map[bookId] || 0) + 1;
        }
        return map;
      }, {});

      return bookLikesMap;
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getBookLikes" }, false);
      return {};
    }
  }
  static getSavedTags() {
    const userId = authStore$.userId.get();
    if (!userId) return [];
    try {
      const allSavedTags = Object.values(savedTags$.get() || {}).filter((saved) => saved.user_id === userId);
      return allSavedTags;
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getSavedTags" }, false);
      return [];
    }
  }
  // Get featured books
  static getFeaturedBooks() {
    try {
      const allBooks = Object.values(books$.get() || {});
      return [...allBooks].sort((a, b) => b.reader_count - a.reader_count).slice(0, 5);
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getFeaturedBooks" }, false);
      return [];
    }
  }

  // Get popular books
  static getPopularBooks() {
    try {
      const userId = authStore$.userId.get();
      if (!userId) return [];
      const allBooks = Object.values(books$.get() || {});
      const bookLikes = BookService.getBookLikes();

      const topBooks = [...allBooks]
        .sort((a, b) => {
          // Sort by combined score of reader_count and likes
          const aLikes = bookLikes[a.id] || 0;
          const bLikes = bookLikes[b.id] || 0;
          return b.reader_count + bLikes - (a.reader_count + aLikes);
        })
        .slice(0, 10);
      const extendedBooks = topBooks.map((book) => BookService.getBookDetails(book.id));
      return extendedBooks.filter((book) => Boolean(book)) as ExtendedBook[];
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getPopularBooks" }, false);
      return [];
    }
  }

  // Get new releases
  static getNewReleases() {
    try {
      const allBooks = Object.values(books$.get() || {});
      return [...allBooks]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getNewReleases" }, false);
      return [];
    }
  }

  // Get recommended books
  static getRecommendedBooks(): ExtendedBook[] {
    try {
      const userId = authStore$.userId.get();
      if (!userId) return [];
      const allBooks = Object.values(books$.get() || {});
      // Using a deterministic "random" sort to avoid constant reshuffling
      const reccomendedBooks = [...allBooks].sort((a, b) => a.id.localeCompare(b.id)).slice(0, 10);
      const extendedBooks = reccomendedBooks
        .map((book) => BookService.getBookDetails(book.id))
        .filter((book) => book !== null);
      return extendedBooks;
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getRecommendedBooks" }, false);
      return [];
    }
  }

  // Get user's books
  static getUserBooks(userId: string) {
    try {
      if (!userId) return [];

      const allBooks = books$.get() || {};
      const allUserUnlocks = Object.values(userUnlocks$.get() || {});

      const myBookIds = allUserUnlocks
        .filter((unlock) => unlock.user_id === userId && unlock.book_id !== null)
        .map((unlock) => unlock.book_id);

      return myBookIds.map((id) => allBooks[id]).filter(Boolean);
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getUserBooks", userId }, false);
      return [];
    }
  }
  // Get books the user owns but hasn't started reading yet
  static getUnreadBooks() {
    const userId = authStore$.userId.get();
    if (!userId) return [];
    try {
      const allBooks = books$.get() || {};
      const allUserUnlocks = Object.values(userUnlocks$.get() || {});
      const allBookProgress = Object.values(bookProgress$.get() || {});
      const savedBooks = Object.values(savedBooks$.get() || {});

      // Get all books the user owns
      const ownedBookIds = allUserUnlocks
        .filter((unlock) => unlock.user_id === userId && unlock.book_id !== null)
        .map((unlock) => unlock.book_id);

      // Get all books the user has any reading progress on
      const allBookProgressIds = allBookProgress
        .filter((progress) => progress.user_id === userId && progress.status !== "unread")
        .map((progress) => progress.book_id);
      const unreadBookIds = allBookProgress
        .filter((progress) => progress.user_id === userId && progress.status === "unread")
        .map((progress) => progress.book_id);
      // get all savedBooksids not already in bookProgress
      const savedBookIds = savedBooks
        .map((saved) => saved.book_id)
        .filter((book_id) => !allBookProgressIds.includes(book_id));

      // Get the actual book objects
      return [...unreadBookIds, ...savedBookIds].map((id) => allBooks[id]).filter(Boolean);
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getUnreadingBooks", userId }, false);
      return [];
    }
  }

  // Get user's saved books
  static getSavedBooks(userId: string) {
    try {
      if (!userId) return [];

      const allBooks = books$.get() || {};
      const allSavedBooks = Object.values(savedBooks$.get() || {});

      const savedBookIds = allSavedBooks.filter((saved) => saved.user_id === userId);

      //   return savedBookIds.map((id) => allBooks[id]).filter(Boolean);
      return savedBookIds;
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getSavedBooks", userId }, false);
      return [];
    }
  }
  static toggleSavedBook(userId: string, bookId: string) {
    console.log("saving book");
    try {
      console.log(userId);
      if (!userId) return;
      const existingSavedBookId = Object.values(savedBooks$.get() || {}).find(
        (saved) => saved.user_id === userId && saved.book_id === bookId
      )?.id;
      if (existingSavedBookId) {
        console.log("existing book");
        savedBooks$[existingSavedBookId].delete();
      } else {
        console.log("new save book");
        const id = generateId();
        savedBooks$[id].set({ id, user_id: userId, book_id: bookId } as SavedBook);
      }
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.handleSaveBook", bookId }, false);
    }
  }

  // Get recently read books
  static getReadingBooks() {
    const userId = authStore$.userId.get();
    if (!userId) return [];
    try {
      const allBooks = books$.get() || {};
      const allBookProgress = Object.values(bookProgress$.get() || {});

      const readProgress = [...allBookProgress]
        .filter((progress) => progress.user_id === userId && progress.status === "reading")
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      return readProgress.map((progress) => allBooks[progress.book_id]).filter(Boolean);
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getRecentlyReadBooks", userId }, false);
      return [];
    }
  }

  // Get completed books
  static getCompletedBooks() {
    const userId = authStore$.userId.get(); // Replace with actual user ID from yo
    if (!userId) return [];
    try {
      const allBooks = books$.get() || {};
      const allBookProgress = Object.values(bookProgress$.get() || {});

      const completedBookIds = allBookProgress
        .filter((progress) => progress.user_id === userId && progress.status === "finished")
        .map((progress) => progress.book_id);

      return completedBookIds.map((id) => allBooks[id]).filter(Boolean);
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getCompletedBooks", userId }, false);
      return [];
    }
  }

  /**
   * Get top categories and their most popular books
   * @returns A map of category to array of popular books in that category
   */
  static getTopTagsBooks(): Map<string, ExtendedBook[]> {
    try {
      const result = new Map<string, ExtendedBook[]>();
      const userId = authStore$.userId.get();
      if (!userId) return result;
      // Get all tags and saved tags
      const allTags = tags$.get() || {};
      const allSavedTags = Object.values(savedTags$.get() || {});
      const allBooks = books$.get() || {};
      const allBookTags = Object.values(bookTags$.get() || {});

      // Count saves per tag
      const tagSaveCount: Record<string, number> = {};
      allSavedTags.forEach((savedTag) => {
        const tagId = savedTag.tag_id;
        tagSaveCount[tagId] = (tagSaveCount[tagId] || 0) + 1;
      });

      // Sort tags by popularity (number of saves)
      const sortedTags = Object.values(allTags)
        .map((tag) => ({
          tag,
          saveCount: tagSaveCount[tag.id] || 0,
        }))
        .sort((a, b) => b.saveCount - a.saveCount)
        .slice(0, 8); // Get top 8 categories

      // Get book likes for popularity sorting
      const bookLikes = BookService.getBookLikes();

      // For each popular category, get its most popular books
      sortedTags.forEach(({ tag }) => {
        // Find all books in this category
        const bookIdsInCategory = allBookTags
          .filter((bookTag) => bookTag.tag_id === tag.id)
          .map((bookTag) => bookTag.book_id);

        // Get the actual book objects
        const categoryBooks = bookIdsInCategory.map((id) => allBooks[id]).filter(Boolean);

        // Sort books by popularity (reader count + likes)
        const sortedBooks = [...categoryBooks]
          .sort((a, b) => {
            const aLikes = bookLikes[a.id] || 0;
            const bLikes = bookLikes[b.id] || 0;
            return b.reader_count + bLikes - (a.reader_count + aLikes);
          })
          .slice(0, 10); // Get top 10 books per category
        const extendedBooks = sortedBooks
          .map((book) => BookService.getBookDetails(book.id))
          .filter((book) => book !== null); // Add user_id and book_id to inde

        // Add to result map
        if (sortedBooks.length > 0) {
          result.set(tag.id, extendedBooks);
        }
      });
      return result;
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getTopCategoryBooks" }, false);
      return new Map();
    }
  }
  static getTopTags() {
    try {
      const topTagsBooks = BookService.getTopTagsBooks();
      const topTagIds = Array.from(topTagsBooks.keys());
      const allTags = Object.values(tags$.get() || {});
      const topTags = allTags.filter((tag) => topTagIds.includes(tag.id));
      return topTags;
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getTopTags" }, false);
      return [];
    }
  }
  static updateBookProgress(bookId: string, status: "reading" | "unread" | "finished", percentDone: number) {
    console.log("updating book progress");
    const userId = authStore$.userId.get();
    if (!userId) return;
    try {
      const bookProgress = bookProgress$.get() || {};
      const bookProgressId = Object.values(bookProgress).find((progress) => progress.book_id === bookId)?.id;
      console.log("bookProgressId", bookProgressId, percentDone);
      if (!bookProgressId) return;
      bookProgress$[bookProgressId].set({
        ...bookProgress[bookProgressId],
        percent_done: percentDone,
        status: status,
      });
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.updateBookProgress", bookId }, false);
    }
  }
}
