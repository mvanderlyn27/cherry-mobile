import { authStore$ } from "@/stores/authStore";
import { readerStore$ } from "@/stores/appStores";
import {
  bookProgress$,
  chapterProgress$,
  chapters$,
  comments$,
  generateId,
  likedChapters$,
  userUnlocks$,
} from "@/stores/supabaseStores";
import { BookProgress, ChapterLike, ChapterProgress, ExtendedChapter } from "@/types/app";
import { LoggingService } from "./loggingService";
import { BookService } from "./bookService";

export class ChapterService {
  /**
   * Initialize the reader with book and chapter data
   * Creates book progress and chapter progress if they don't exist
   */
  static async initializeReader(bookId: string, userId: string) {
    // Get book details
    const book = BookService.getBookDetails(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    // Get chapters for the book
    const chapters = this.getChapters(bookId);
    if (!chapters || Object.values(chapters).length === 0) {
      throw new Error("No chapters found");
    }

    let currentChapterNumber: number;
    let bookProgressId: string;

    // Check if book progress exists
    if (!book.progress) {
      console.log("No book progress found, creating new progress");

      // Find the first chapter (chapter_number 1)
      const firstChapter = Object.values(chapters).find((chapter) => chapter.chapter_number === 1);

      if (!firstChapter) {
        throw new Error("First chapter not found");
      }

      // Create new book progress
      bookProgressId = generateId();
      const newBookProgress = {
        id: bookProgressId,
        user_id: userId,
        book_id: bookId,
        current_chapter_id: firstChapter.id,
        status: "reading",
        percent_done: 0,
      } as BookProgress;

      // Save to store
      bookProgress$[bookProgressId].set(newBookProgress);

      // Update book with new progress
      book.progress = newBookProgress;

      // Create chapter progress for the first chapter if it doesn't exist
      if (!firstChapter.progress) {
        this.getOrCreateChapterProgress(firstChapter.id, bookProgressId, userId, "reading");
      }

      currentChapterNumber = 1; // First chapter
    } else {
      console.log("Book progress found", book.progress);
      bookProgressId = book.progress.id;

      // Get current chapter from existing progress
      const currentChapterId = book.progress.current_chapter_id;

      // Find the chapter with matching id
      const chapterEntry = Object.values(chapters).find((chapter) => chapter.id === currentChapterId);

      if (chapterEntry) {
        currentChapterNumber = chapterEntry.chapter_number || 1;

        // Ensure chapter progress exists for current chapter
        if (!chapterEntry.progress) {
          this.getOrCreateChapterProgress(chapterEntry.id, bookProgressId, userId, "reading");
        }
      } else {
        // Fallback to first chapter if current chapter not found
        const firstChapter = Object.values(chapters).find((chapter) => chapter.chapter_number === 1);
        if (!firstChapter) {
          throw new Error("First chapter not found");
        }

        currentChapterNumber = 1;

        // Update book progress with first chapter
        bookProgress$[bookProgressId].current_chapter_id.set(firstChapter.id);

        // Ensure chapter progress exists
        if (!firstChapter.progress) {
          this.getOrCreateChapterProgress(firstChapter.id, bookProgressId, userId, "reading");
        }
      }
    }

    return { book, chapters, currentChapterNumber };
  }

  /**
   * Get or create chapter progress for a chapter
   */
  static getOrCreateChapterProgress(
    chapterId: string,
    bookProgressId: string,
    userId: string,
    status: "reading" | "completed" = "reading"
  ): ChapterProgress {
    // Check if progress already exists
    const existingProgress = Object.values(chapterProgress$.get() || {}).find(
      (progress) => progress.chapter_id === chapterId && progress.user_id === userId
    );

    if (existingProgress) {
      // Don't downgrade from completed to reading
      if (existingProgress.status === "completed" && status === "reading") {
        return existingProgress;
      }

      // Update status if needed
      if (existingProgress.status !== status) {
        chapterProgress$[existingProgress.id].status.set(status);
        chapterProgress$[existingProgress.id].updated_at.set(new Date().toISOString());
      }

      return existingProgress;
    }

    // Create new progress
    const chapterProgressId = generateId();
    const chapterProgress = {
      id: chapterProgressId,
      chapter_id: chapterId,
      book_progress_id: bookProgressId,
      user_id: userId,
      status: status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as ChapterProgress;

    // Save to store
    chapterProgress$[chapterProgressId].set(chapterProgress);

    return chapterProgress;
  }

  /**
   * Load chapter content and update reading progress
   */
  static async loadChapter(chapterNumber: number, bookId: string) {
    const userId = authStore$.userId.get();
    if (!userId) {
      throw new Error("No user found");
    }
    console.log("Loading chapter", chapterNumber);

    const chapters = this.getChapters(bookId);
    if (!chapters || !chapters[chapterNumber]) {
      throw new Error(`Chapter ${chapterNumber} not found`);
    }

    const chapter = chapters[chapterNumber];

    // Get chapter content
    const content = await this.getChapterContent(chapter);
    if (!content) {
      throw new Error("Chapter content not found");
    }

    // Get book progress
    const book = BookService.getBookDetails(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    let bookProgressId: string;

    // Create book progress if it doesn't exist
    if (!book.progress) {
      bookProgressId = generateId();
      const newBookProgress = {
        id: bookProgressId,
        user_id: userId,
        book_id: bookId,
        current_chapter_id: chapter.id,
        status: "reading",
        percent_done: 0,
      } as BookProgress;

      bookProgress$[bookProgressId].set(newBookProgress);
      book.progress = newBookProgress;
    } else {
      bookProgressId = book.progress.id;
      // Update current chapter in book progress
      bookProgress$[bookProgressId].current_chapter_id.set(chapter.id);
    }

    // Mark chapter as reading if not already completed
    this.startReadingChapter(chapter, bookProgressId);

    return { content, bookProgressId };
  }

  /**
   * Get all chapters for a book indexed by chapter number
   */
  static getChapters(bookId: string): Record<number, ExtendedChapter> {
    const userId = authStore$.userId.get();
    const chapters = Object.values(chapters$.get() || {}).filter((chapter) => chapter.book_id === bookId);
    const comments = Object.values(comments$.get() || {}).filter((comment) => comment.book_id === bookId);
    const owns_book =
      Object.values(userUnlocks$.get() || {}).find(
        (unlock) => unlock.book_id === bookId && userId === unlock.user_id && unlock.chapter_id === null
      ) !== undefined;
    const unlocked_chapters = Object.values(userUnlocks$.get() || {}).filter(
      (unlock) => unlock.book_id === bookId && userId === unlock.user_id
    );
    const chapter_likes = Object.values(likedChapters$.get() || {}).filter((like) => like.book_id === bookId);
    const chapter_ids = chapters.map((chapter) => chapter.id);
    const chapter_progress = Object.values(chapterProgress$.get() || {}).filter(
      (progress) => chapter_ids.includes(progress.chapter_id) && progress.user_id === userId
    );

    const extendedChapters: ExtendedChapter[] = chapters.map((chapter) => {
      const likes = chapter_likes.filter((like) => like.chapter_id === chapter.id).length;
      const comments_count = comments.filter((comment) => comment.chapter_id === chapter.id).length;
      const is_owned = owns_book || unlocked_chapters.some((unlock) => unlock.chapter_id === chapter.id);
      const is_liked =
        chapter_likes.filter((like) => like.chapter_id === chapter.id && like.user_id === userId).length > 0;
      const is_unlocked = unlocked_chapters.filter((unlock) => unlock.chapter_id === chapter.id).length > 0;
      const progress = chapter_progress.find((progress) => progress.chapter_id === chapter.id);

      return {
        ...chapter,
        likes,
        comments_count,
        is_owned,
        is_liked,
        is_unlocked,
        progress,
      };
    });

    const sorted = extendedChapters.sort((a, b) => {
      const aOrder = a.chapter_number || 0;
      const bOrder = b.chapter_number || 0;
      return aOrder - bOrder;
    });

    const chapterRecord: Record<number, ExtendedChapter> = {};
    sorted.forEach((chapter) => {
      if (chapter.chapter_number !== undefined) {
        chapterRecord[chapter.chapter_number] = chapter;
      }
    });

    return chapterRecord;
  }

  /**
   * Get content for a specific chapter
   */
  static async getChapterContent(chapter: ExtendedChapter): Promise<string> {
    try {
      if (chapter.content_url && chapter.content_url !== "" && chapter.is_owned) {
        const response = await fetch(chapter.content_url);

        if (!response.ok) {
          throw new Error(`Failed to fetch chapter content: ${response.status} ${response.statusText}`);
        }

        const textContent = await response.text();
        const cleanedContent = textContent.replace(/^\uFEFF/, ""); // Remove BOM if present
        return cleanedContent;
      }

      return "";
    } catch (error) {
      console.error("Error downloading chapter content:", error);
      return "";
    }
  }

  /**
   * Mark a chapter as started reading
   */
  static startReadingChapter(chapter: ExtendedChapter, bookProgressId: string) {
    const userId = authStore$.userId.get();
    if (!userId) return;

    // Only update if not already completed
    if (chapter.progress?.status === "completed") return;

    // Get or create chapter progress with "reading" status
    const progress = this.getOrCreateChapterProgress(chapter.id, bookProgressId, userId, "reading");

    // Update the chapter in the reader store if needed
    if (chapter.chapter_number !== undefined && (!chapter.progress || chapter.progress.id !== progress.id)) {
      readerStore$.chapters[chapter.chapter_number].progress.set(progress);
    }
  }

  /**
   * Mark a chapter as finished reading and update book progress
   */
  static finishReadingChapter(chapter: ExtendedChapter, bookId: string, percentDone: number) {
    const userId = authStore$.userId.get();
    if (!userId) return;

    // Get book progress
    const book = BookService.getBookDetails(bookId);
    if (!book || !book.progress) {
      console.error("Book progress not found");
      return;
    }

    const bookProgressId = book.progress.id;

    // Get or create chapter progress with "completed" status
    const progress = this.getOrCreateChapterProgress(chapter.id, bookProgressId, userId, "completed");

    // Update the chapter in the reader store if needed
    if (chapter.chapter_number !== undefined) {
      readerStore$.chapters[chapter.chapter_number].progress.set(progress);
    }

    // Calculate accurate completion percentage
    const chapters = this.getChapters(bookId);
    const totalChapters = Object.keys(chapters).length;

    // Count completed chapters
    const completedChapters = Object.values(chapters).filter((ch) => ch.progress?.status === "completed").length;

    // Calculate percentage
    const accuratePercentDone = (completedChapters / totalChapters) * 100;

    // Update book progress
    const newStatus = accuratePercentDone >= 100 ? "finished" : "reading";
    BookService.updateBookProgress(bookId, newStatus, accuratePercentDone);
  }

  /**
   * Toggle like status for a chapter
   */
  static toggleChapterLike(chapterNumber: number) {
    const userId = authStore$.userId.get();
    if (!userId) return;

    const chapters = readerStore$.chapters.get();
    const chapter = chapters?.[chapterNumber];

    if (!chapter) {
      LoggingService.handleError("Current chapter not found", { currentChapter: chapterNumber }, false);
      return;
    }

    if (!chapter.is_liked) {
      // Add like
      const chapterLikeId = generateId();
      likedChapters$[chapterLikeId].set({
        id: chapterLikeId,
        user_id: userId,
        chapter_id: chapter.id,
        book_id: chapter.book_id,
      } as ChapterLike);
    } else {
      // Remove like
      const chapterLike = Object.values(likedChapters$.get() || {}).find(
        (like) => like.chapter_id === chapter.id && like.user_id === userId
      );

      if (chapterLike) {
        likedChapters$[chapterLike.id].delete();
      }
    }

    // Update UI state
    readerStore$.chapters[chapterNumber].is_liked.set(!chapter.is_liked);
  }
}
