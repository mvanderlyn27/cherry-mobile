// should hold user preferences,

import { observable } from "@legendapp/state";

// user preferences, local only, unless user creates an account
//add an init that sets up
export const userStore$ = observable({
  credits: 40,
  readerSettings: {
    fontSize: 16,
    lineHeight: 1.5,
    fontFamily: "serif",
    backgroundTexture: "paper",
  },
});
