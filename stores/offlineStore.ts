// Should keep track of books/chapters user has saved to read offline

import { observable } from "@legendapp/state";

// can save chapters in asyncstorage, or filesystem, save paths here for use while offline
export const offlineStore$ = observable({});
