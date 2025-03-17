// should hold user preferences,

import { observable } from "@legendapp/state";

// user preferences, local only, unless user creates an account
export const userPreferences$ = observable({
  theme: "light",
  readerSettings: {
    fontSize: 16,
    lineHeight: 1.5,
    fontFamily: "serif",
    backgroundTexture: "paper",
  },
});
