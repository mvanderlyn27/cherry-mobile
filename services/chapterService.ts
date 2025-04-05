import { authStore$ } from "@/stores/authStore";
import { readerStore$ } from "@/stores/appStores";
import {
  chapterProgress$,
  chapters$,
  comments$,
  generateId,
  likedChapters$,
  userUnlocks$,
} from "@/stores/supabaseStores";
import { ChapterProgress, ExtendedChapter } from "@/types/app";
import { LoggingService } from "./loggingService";

export class ChapterService {
  static async getChapterContent(chapter: ExtendedChapter): Promise<string> {
    console.log("Getting chapter content");
    try {
      if (chapter.content_url && chapter.content_url !== "" && chapter.is_owned) {
        // Fetch the content from the storage bucket URL
        const response = await fetch(chapter.content_url);

        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`Failed to fetch chapter content: ${response.status} ${response.statusText}`);
        }

        // Extract the text content from the downloaded file
        const textContent = await response.text();

        // Process the text content if needed (e.g., remove BOM characters)
        const cleanedContent = textContent.replace(/^\uFEFF/, ""); // Remove BOM if present
        return cleanedContent;
      }

      // Return empty string if no content URL or chapter is not owned
      return "";
    } catch (error) {
      console.error("Error downloading chapter content:", error);
      //   readerStore$.error.set(`Error downloading chapter content: ${error}`);
      return ""; // Return empty string on error
    }
  }

  static getChapters(bookId: string): ExtendedChapter[] {
    const userId = authStore$.userId.get();
    const chapters = Object.values(chapters$.get() || {}).filter((chapter) => chapter.book_id === bookId);
    const comments = Object.values(comments$.get() || {}).filter((comment) => comment.book_id === bookId);
    const owns_book =
      Object.values(userUnlocks$.get() || {}).find(
        (chapter) => chapter.book_id === bookId && userId === chapter.user_id && chapter.chapter_id === null
      ) !== undefined;
    const unlocked_chapters = Object.values(userUnlocks$.get() || {}).filter(
      (chapter) => chapter.book_id === bookId && userId === chapter.user_id
    );
    const chapter_likes = Object.values(likedChapters$.get() || {}).filter((chapter) => chapter.book_id === bookId);
    const chapter_ids = chapters.map((chapter) => chapter.id);
    const chapter_progress = Object.values(chapterProgress$.get() || {}).filter(
      (chapterProgress) => chapter_ids.includes(chapterProgress.chapter_id) && chapterProgress.user_id === userId
    );
    console.log("chapter_progress", chapter_progress);
    const extendedChapters: ExtendedChapter[] = chapters.map((chapter) => {
      const likes = chapter_likes.filter((like) => like.chapter_id === chapter.id).length;
      const comments_count = comments.filter((comment) => comment.chapter_id === chapter.id).length;
      const is_owned = owns_book || unlocked_chapters.some((chapter) => chapter.id === chapter.id);
      const is_liked =
        chapter_likes.filter((like) => like.chapter_id === chapter.id && like.user_id === userId).length > 0;
      const is_unlocked = unlocked_chapters.filter((chapter) => chapter.id === chapter.id).length > 0;
      const progress = chapter_progress.find((progress) => progress.chapter_id === chapter.id);
      console.log("progress found", progress);
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
    return sorted;
  }

  static startReadingChapter(chapter: ExtendedChapter, bookProgressId: string) {
    const progress = chapter.progress;
    if (progress) {
      console.log("reading progress found", progress);
      chapterProgress$[progress.id].status.set("reading");
    } else {
      const chapterProgressId = generateId();
      chapterProgress$[chapterProgressId].set({
        id: chapterProgressId,
        user_id: authStore$.userId.get()!,
        chapter_id: chapter.id,
        status: "reading",
        book_progress_id: bookProgressId,
      } as ChapterProgress);
    }
  }
  static finishReadingChapter(chapter: ExtendedChapter, bookProgressId: string) {
    const progress = chapter.progress;
    console.log("Finishing Chapter", chapter.id);
    if (progress) {
      console.log("completed progress found", progress);
      console.log("chapterProgress", chapterProgress$[progress.id].peek());

      chapterProgress$[progress.id].set({ ...progress, status: "completed" });
    } else {
      const chapterProgressId = generateId();
      chapterProgress$[chapterProgressId].set({
        id: chapterProgressId,
        user_id: authStore$.userId.get()!,
        chapter_id: chapter.id,
        status: "completed",
        book_progress_id: bookProgressId,
      } as ChapterProgress);
    }
  }
}

//          // Get all chapters for this book
//          const allChapters = Object.values(chapters$.get() || {});
//          const bookChapters = allChapters.filter((chapter) => chapter.book_id === bookId);

//          // Sort chapters by their order
//          const sortedChapters = [...bookChapters].sort((a, b) => {
//            const aOrder = a.chapter_number || 0;
//            const bOrder = b.chapter_number || 0;
//            return aOrder - bOrder;
//          });
//       // Get all liked chapters
//       const allLikedChapters = Object.values(likedChapters$.get() || {});
//       const bookChapterIds = bookChapters.map((chapter) => chapter.id);

//       // Count likes per chapter
//       const chapterLikesMap = new Map<string, number>();
//       allLikedChapters.forEach((like) => {
//         if (bookChapterIds.includes(like.chapter_id)) {
//           if (chapterLikesMap.has(like.chapter_id)) {
//             chapterLikesMap.set(like.chapter_id, (chapterLikesMap.get(like.chapter_id) || 0) + 1);
//           } else {
//             chapterLikesMap.set(like.chapter_id, 1);
//           }
//         }
//       });

// const userChapterProgress = Object.values(chapterProgress$.get() || {}).filter(
//     (progress) => progress.user_id === userId
//   );
//   const extendedChapters: ExtendedChapter[] = sortedChapters.map((chapter) => {
//     // Check if this specific chapter is unlocked
//     const isChapterUnlocked = userBookUnlocks.some((unlock) => unlock.chapter_id === chapter.id);

//     // Chapter is unlocked if either the entire book is unlocked or this specific chapter is unlocked
//     const is_owned = userId ? isEntireBookUnlocked || isChapterUnlocked : false;

//     // Get progress for this chapter
//     const progress = userChapterProgress.find((progress) => progress.chapter_id === chapter.id);

//     return {
//       ...chapter,
//       likes: chapterLikesMap.get(chapter.id) || 0,
//       is_owned,
//       status: progress?.status || "unread",
//     };
//   });
