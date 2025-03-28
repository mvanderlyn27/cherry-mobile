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
  savedTags$,
} from "../stores/supabaseStores";
import { LoggingService } from "./loggingService";
import { Observable, syncState, when } from "@legendapp/state";
import { ExtendedBook, ExtendedChapter, Tag } from "@/types/app";

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
  // Get detailed book information including tags, chapters, and likes
  static getBookDetails(bookId: string | null): ExtendedBook | null {
    try {
      // Get the basic book data
      if (bookId === null) return null;
      const book = books$[bookId].get() || null;
      if (!book) return null;

      // Get all chapters for this book
      const allChapters = Object.values(chapters$.get() || {})
        .filter((chapter) => chapter.book_id === bookId)
        .sort((a, b) => a.chapter_number - b.chapter_number);

      // Get likes for all chapters
      const allLikedChapters = Object.values(likedChapters$.get() || {});

      // Get tags for this book
      const allBookTags = Object.values(bookTags$.get() || {}).filter((bookTag) => bookTag.book_id === bookId);

      const allTags = tags$.get() || {};
      const bookTags = allBookTags.map((bookTag) => allTags[bookTag.tag_id]).filter(Boolean);

      // Calculate likes for each chapter of this book
      const chapterLikesMap: Map<string, number> = new Map();
      // Get chapter IDs for this book to filter likes
      const bookChapterIds = allChapters.map((chapter) => chapter.id);

      // Only count likes for chapters of this book
      allLikedChapters.forEach((like) => {
        if (bookChapterIds.includes(like.chapter_id)) {
          if (chapterLikesMap.get(like.chapter_id)) {
            chapterLikesMap.set(like.chatper_id, (chapterLikesMap.get(like.chapter_id) || 0) + 1);
          } else {
            chapterLikesMap.set(like.chapter_id, 1);
          }
        }
      });

      // Get current user ID from auth store if available
      const userId = appStore$.userId.get();

      // Initialize user-specific properties
      let userProgress = 0;
      let isSaved = false;
      let isOwned = false;
      let userLikedChapterIds: string[] = [];

      // If user is logged in, get personalized data
      if (userId) {
        // Check if book is saved by user
        const savedBooksData = Object.values(savedBooks$.get() || {});
        isSaved = savedBooksData.some((saved) => saved.user_id === userId && saved.book_id === bookId);

        // Check if book is owned by user
        const userUnlocksData = Object.values(userUnlocks$.get() || {});
        isOwned = userUnlocksData.some((unlock) => unlock.user_id === userId && unlock.book_id === bookId);

        // Get user's progress for this book
        const bookProgressData = Object.values(bookProgress$.get() || {});
        const userBookProgress = bookProgressData.find(
          (progress) => progress.user_id === userId && progress.book_id === bookId
        );

        if (userBookProgress) {
          userProgress = userBookProgress.progress_percentage || 0;
        }

        // Get chapters liked by the user
        userLikedChapterIds = allLikedChapters
          .filter((like) => like.user_id === userId && bookChapterIds.includes(like.chapter_id))
          .map((like) => like.chapter_id);
      }

      // Create extended chapters with like counts and user-specific data
      const extendedChapters: ExtendedChapter[] = allChapters.map((chapter) => {
        return {
          ...chapter,
          content: chapter.content || "",
          is_locked: chapter.is_premium || false,
          likes_count: chapterLikesMap.get(chapter.id) || 0,
          is_liked: userId ? userLikedChapterIds.includes(chapter.id) : false,
          is_bookmarked: false, // Would need to implement bookmarks in the future
        };
      });

      // Calculate total likes for the book
      const totalLikes = extendedChapters.reduce((sum, chapter) => sum + (chapter.likes_count || 0), 0);

      // Create and return the extended book
      const extendedBook: ExtendedBook = {
        ...book,
        tags: bookTags,
        chapters: extendedChapters,
        likes_count: totalLikes,
        comments_count: 0, // Would need to fetch comments if available
        user_progress: userProgress,
        is_saved: isSaved,
        is_owned: isOwned,
      };

      return extendedBook;
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getBookDetails", bookId }, false);
      return null;
    }
  }

  static handleSaveTag(tagId: string) {
    console.log("saving tag");
    try {
      const userId = appStore$.userId.peek();
      console.log(userId);
      if (!userId) return;
      const existingSave = savedTags$[tagId].peek();
      if (existingSave) {
        console.log("existing tag");
        savedTags$[tagId].delete();
      } else {
        console.log("new save tag");
        savedTags$[tagId].save();
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

  /**
   * Get top categories and their most popular books
   * @returns A map of category to array of popular books in that category
   */
  static getTopCategoryBooks(): Map<Tag, Book[]> {
    try {
      const result = new Map<Tag, Book[]>();

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
      const bookLikes = this.getBookLikes();

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

        // Add to result map
        if (sortedBooks.length > 0) {
          result.set(tag, sortedBooks);
        }
      });

      return result;
    } catch (error) {
      LoggingService.handleError(error, { method: "BookService.getTopCategoryBooks" }, false);
      return new Map();
    }
  }
}
