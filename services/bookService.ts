import { supabase } from "./supabase";
import { appStore$, exploreStore$, libraryStore$ } from "../stores/appStores";
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
} from "../stores/supabaseStores";
import { LoggingService } from "./loggingService";
import { syncState, when } from "@legendapp/state";

// Types
interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  cover_placeholder: string;
  chapter_count: number;
  price: number;
  reader_count: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  tag_image_url: string;
  tag_image_placeholder: string;
}

export class BookService {
  // Get book details by ID, get the tags, get the like counts
  static getBookDetails(bookId: string): Book | null {
    try {
      return books$[bookId].peek() || null;
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getBookDetails", bookId }, false);
      return null;
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
  static searchBooks(options: { categoryId?: string; title?: string; page?: number; pageSize?: number }): {
    books: Book[];
    totalCount: number;
  } {
    try {
      const { categoryId, title, page = 1, pageSize = 10 } = options;
      let filteredBooks: Book[] = [];

      // Get all books
      const allBooks = Object.values(books$.peek());

      // Filter by category if provided
      if (categoryId) {
        const allBookTags = Object.values(bookTags$.peek());
        const bookIdsInCategory = allBookTags
          .filter((bookTag) => bookTag.tag_id === categoryId)
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

      // Calculate total count before pagination
      const totalCount = filteredBooks.length;

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const paginatedBooks = filteredBooks.slice(startIndex, startIndex + pageSize);

      return {
        books: paginatedBooks,
        totalCount,
      };
    } catch (error) {
      LoggingService.handleError(
        error,
        {
          method: "BookService.searchBooks",
          options,
        },
        false
      );
      return { books: [], totalCount: 0 };
    }
  }

  // Get book likes from chapter likes
  static getBookLikes() {
    try {
      const allLikedChapters = Object.values(likedChapters$.get() || {});
      const allChapters = Object.values(chapters$.get() || {});

      // Create a map of chapter IDs to book IDs
      const chapterToBookMap = allChapters.reduce((map, chapter) => {
        map[chapter.id] = chapter.book_id;
        return map;
      }, {});

      // Count likes per book
      const bookLikesMap = allLikedChapters.reduce((map, like) => {
        const bookId = chapterToBookMap[like.chapter_id];
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
      const allBooks = Object.values(books$.get() || {});
      const bookLikes = this.getBookLikes();

      return [...allBooks]
        .sort((a, b) => {
          // Sort by combined score of reader_count and likes
          const aLikes = bookLikes[a.id] || 0;
          const bLikes = bookLikes[b.id] || 0;
          return b.reader_count + bLikes - (a.reader_count + aLikes);
        })
        .slice(0, 10);
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
  static getRecommendedBooks() {
    try {
      const allBooks = Object.values(books$.get() || {});
      // Using a deterministic "random" sort to avoid constant reshuffling
      return [...allBooks].sort((a, b) => a.id.localeCompare(b.id)).slice(0, 10);
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
  static getUnreadBooks(userId: string) {
    try {
      if (!userId) return [];

      const allBooks = books$.get() || {};
      const allUserUnlocks = Object.values(userUnlocks$.get() || {});
      const allBookProgress = Object.values(bookProgress$.get() || {});

      // Get all books the user owns
      const ownedBookIds = allUserUnlocks
        .filter((unlock) => unlock.user_id === userId && unlock.book_id !== null)
        .map((unlock) => unlock.book_id);

      // Get all books the user has any reading progress on
      const booksWithProgressIds = allBookProgress
        .filter((progress) => progress.user_id === userId)
        .map((progress) => progress.book_id);

      // Filter for books the user owns but hasn't started reading
      const unreadBookIds = ownedBookIds.filter((bookId) => !booksWithProgressIds.includes(bookId));

      // Get the actual book objects
      return unreadBookIds.map((id) => allBooks[id]).filter(Boolean);
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

      const savedBookIds = allSavedBooks.filter((saved) => saved.user_id === userId).map((saved) => saved.book_id);

      return savedBookIds.map((id) => allBooks[id]).filter(Boolean);
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getSavedBooks", userId }, false);
      return [];
    }
  }

  // Get recently read books
  static getReadingBooks(userId: string) {
    try {
      if (!userId) return [];

      const allBooks = books$.get() || {};
      const allBookProgress = Object.values(bookProgress$.get() || {});

      const readProgress = [...allBookProgress]
        .filter((progress) => progress.user_id === userId)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      return readProgress.map((progress) => allBooks[progress.book_id]).filter(Boolean);
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getRecentlyReadBooks", userId }, false);
      return [];
    }
  }

  // Get completed books
  static getCompletedBooks(userId: string) {
    try {
      if (!userId) return [];

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
}
