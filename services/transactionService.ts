import { authStore$ } from "@/stores/authStore";
import {
  books$,
  chapters$,
  cherryLedger$,
  generateId,
  transactions$,
  users$,
  userUnlocks$,
} from "@/stores/supabaseStores";
import { LoggingService } from "./loggingService";
import { CherryLedger, PurchaseError, Transaction, UserUnlock } from "@/types/app";
import { purchaseStore$ } from "@/stores/appStores";
import { currentISOTime } from "posthog-react-native/lib/posthog-core/src/utils";

export class TransactionService {
  //eventually need to move this to use supabse functions to handle checking

  static buyBook(bookId: string): { success: boolean; error?: PurchaseError } {
    purchaseStore$.purchaseStatus.set("pending");
    const userId = authStore$.userId.get();
    if (!userId) {
      LoggingService.handleError(
        new Error("User not logged in"),
        { collection: "transactions", action: "buyBook" },
        false
      );
      purchaseStore$.purchaseStatus.set("failed");
      purchaseStore$.error.set(PurchaseError.NotLoggedIn);
      return { success: false, error: PurchaseError.NotLoggedIn };
    }
    const book = books$[bookId].get();

    if (!book) {
      LoggingService.handleError(new Error("Book not found"), { collection: "transactions", action: "buyBook" }, false);
      const transactionId = generateId();
      transactions$[transactionId].set({
        id: transactionId,
        user_id: userId,
        transaction_type: "UNLOCK_BOOK",
        book_id: bookId,
        status: "failed",
        error: PurchaseError.BookNotFound,
      } as Transaction);
      purchaseStore$.purchaseStatus.set("failed");
      purchaseStore$.error.set(PurchaseError.BookNotFound);
      return { success: false, error: PurchaseError.BookNotFound };
    }
    //start transaction
    const transactionId = generateId();
    transactions$[transactionId].set({
      id: transactionId,
      user_id: userId,
      transaction_type: "UNLOCK_BOOK",
      book_id: bookId,
      price: book.price,
      status: "pending",
    } as Transaction);
    const cherries = users$[userId].credits.get();
    if (cherries === null) {
      LoggingService.handleError(new Error("User not found"), { collection: "transactions", action: "buyBook" }, false);
      transactions$[transactionId].assign({ status: "failed", error: PurchaseError.NotLoggedIn });
      purchaseStore$.purchaseStatus.set("failed");
      purchaseStore$.error.set(PurchaseError.NotLoggedIn);
      return { success: false, error: PurchaseError.NotLoggedIn };
    }
    //check if we have enough cherries
    if (cherries < book.price) {
      LoggingService.handleError(
        new Error("Not enough cherries"),
        { collection: "transactions", action: "buyBook" },
        false
      );
      transactions$[transactionId].assign({ status: "failed", error: PurchaseError.NeedsMoreCherries });
      purchaseStore$.purchaseStatus.set("failed");
      purchaseStore$.error.set(PurchaseError.NeedsMoreCherries);
      return { success: false, error: PurchaseError.NeedsMoreCherries };
    }
    // if so  remove cherries, buy, then complete transaction

    users$[userId].credits.set(cherries - book.price);
    //update user_unlocks
    const unlockId = generateId();
    userUnlocks$[userId].set({
      id: unlockId,
      user_id: userId,
      book_id: bookId,
    } as UserUnlock);
    //update ledger
    // const ledgerId = generateId();
    // cherryLedger$[ledgerId].set({
    //   id: ledgerId,
    //   user_id: userId,
    //   transaction_id: transactionId,
    //   amount: book.price,
    //   previous_balance: cherries,
    //   new_balance: cherries - book.price,
    // } as CherryLedger);
    //complete transaction
    transactions$[transactionId].status.set("completed");
    purchaseStore$.purchaseStatus.set("completed");
    purchaseStore$.error.set(null);
    return { success: true };
  }

  static buyChapter(chapterId: string): { success: boolean; error?: PurchaseError } {
    purchaseStore$.purchaseStatus.set("pending");
    const userId = authStore$.userId.get();
    if (!userId) {
      LoggingService.handleError(
        new Error("User not logged in"),
        { collection: "transactions", action: "buyChapter" },
        false
      );
      const transactionId = generateId();
      transactions$[transactionId].set({
        id: transactionId,
        user_id: "unknown",
        transaction_type: "UNLOCK_CHAPTER",
        chapter_id: chapterId,
        status: "failed",
        error: PurchaseError.NotLoggedIn,
      } as Transaction);
      purchaseStore$.purchaseStatus.set("failed");
      purchaseStore$.error.set(PurchaseError.NotLoggedIn);
      return { success: false, error: PurchaseError.NotLoggedIn };
    }
    const chapter = chapters$[chapterId].get();
    if (!chapter) {
      LoggingService.handleError(
        new Error("Chapter not found"),
        { collection: "transactions", action: "buyChapter" },
        false
      );
      const transactionId = generateId();
      transactions$[transactionId].set({
        id: transactionId,
        user_id: userId,
        transaction_type: "UNLOCK_CHAPTER",
        chapter_id: chapterId,
        status: "failed",
        error: PurchaseError.ChapterNotFound,
      } as Transaction);
      purchaseStore$.purchaseStatus.set("failed");
      purchaseStore$.error.set(PurchaseError.ChapterNotFound);
      return { success: false, error: PurchaseError.ChapterNotFound };
    }
    const book = books$[chapter.book_id].get();
    if (!book) {
      LoggingService.handleError(
        new Error("Book not found"),
        { collection: "transactions", action: "buyChapter" },
        false
      );
      const transactionId = generateId();
      transactions$[transactionId].set({
        id: transactionId,
        user_id: userId,
        transaction_type: "UNLOCK_CHAPTER",
        chapter_id: chapterId,
        book_id: chapter.book_id,
        status: "failed",
        error: PurchaseError.BookNotFound,
      } as Transaction);
      purchaseStore$.purchaseStatus.set("failed");
      purchaseStore$.error.set(PurchaseError.BookNotFound);
      return { success: false, error: PurchaseError.BookNotFound };
    }
    //start transaction
    const transactionId = generateId();
    transactions$[transactionId].set({
      id: transactionId,
      user_id: userId,
      transaction_type: "UNLOCK_CHAPTER",
      book_id: chapter.book_id,
      chapter_id: chapterId,
      price: chapter.price,
      status: "pending",
    } as Transaction);
    const cherries = users$[userId].credits.get();
    if (cherries === null) {
      LoggingService.handleError(
        new Error("User not found"),
        { collection: "transactions", action: "buyChapter" },
        false
      );
      transactions$[transactionId].assign({ status: "failed", error: PurchaseError.NotLoggedIn });
      purchaseStore$.purchaseStatus.set("failed");
      purchaseStore$.error.set(PurchaseError.NotLoggedIn);
      return { success: false, error: PurchaseError.NotLoggedIn };
    }
    //check if we have enough cherries
    if (cherries < chapter.price) {
      LoggingService.handleError(
        new Error("Not enough cherries"),
        { collection: "transactions", action: "buyChapter" },
        false
      );
      transactions$[transactionId].assign({ status: "failed", error: PurchaseError.NeedsMoreCherries });
      purchaseStore$.purchaseStatus.set("failed");
      purchaseStore$.error.set(PurchaseError.NeedsMoreCherries);
      return { success: false, error: PurchaseError.NeedsMoreCherries };
    }
    // if so  remove cherries, buy, then complete transaction

    users$[userId].credits.set(cherries - chapter.price);
    //update user_unlocks
    const unlockId = generateId();
    userUnlocks$[unlockId].set({
      id: unlockId,
      user_id: userId,
      book_id: chapter.book_id,
      chapter_id: chapterId,
    } as UserUnlock);
    //update ledger
    // const ledgerId = generateId();
    // cherryLedger$[ledgerId].set({
    //   id: ledgerId,
    //   user_id: userId,
    //   transaction_id: transactionId,
    //   amount: chapter.price,
    //   previous_balance: cherries,
    //   new_balance: cherries - chapter.price,
    // } as CherryLedger);
    //complete transaction
    transactions$[transactionId].status.set("completed");
    purchaseStore$.purchaseStatus.set("completed");
    purchaseStore$.error.set(null);
    return { success: true };
  }

  static buyCherries(cherries: number): { success: boolean; error?: PurchaseError } {
    purchaseStore$.purchaseStatus.set("pending");
    const userId = authStore$.userId.get();
    if (!userId) {
      LoggingService.handleError(
        new Error("User not logged in"),
        { collection: "transactions", action: "buyCherries" },
        false
      );
      const transactionId = generateId();
      transactions$[transactionId].set({
        id: transactionId,
        user_id: "unknown",
        transaction_type: "PURCHASE_CREDITS",
        credits: cherries,
        status: "failed",
        error: PurchaseError.NotLoggedIn,
      } as Transaction);
      purchaseStore$.purchaseStatus.set("failed");
      purchaseStore$.error.set(PurchaseError.NotLoggedIn);
      return { success: false, error: PurchaseError.NotLoggedIn };
    }

    //start transaction
    const transactionId = generateId();
    transactions$[transactionId].set({
      id: transactionId,
      user_id: userId,
      transaction_type: "PURCHASE_CREDITS",
      credits: cherries,
      status: "pending",
    } as Transaction);
    const curCherries = users$[userId].credits.get();
    if (curCherries === null) {
      LoggingService.handleError(
        new Error("User not found"),
        { collection: "transactions", action: "buyCherries" },
        false
      );
      transactions$[transactionId].assign({ status: "failed", error: PurchaseError.NotLoggedIn });
      purchaseStore$.purchaseStatus.set("failed");
      purchaseStore$.error.set(PurchaseError.NotLoggedIn);
      return { success: false, error: PurchaseError.NotLoggedIn };
    }

    // Do the IAP With revenue cat here

    users$[userId].credits.set(cherries + curCherries);
    //update user_unlocks
    //update ledger
    // const ledgerId = generateId();
    // cherryLedger$[ledgerId].set({
    //   id: ledgerId,
    //   user_id: userId,
    //   transaction_id: transactionId,
    //   amount: cherries,
    //   previous_balance: curCherries,
    //   new_balance: cherries + curCherries,
    // } as CherryLedger);
    //complete transaction
    transactions$[transactionId].status.set("completed");
    purchaseStore$.purchaseStatus.set("completed");
    purchaseStore$.error.set(null);
    return { success: true };
  }
}
