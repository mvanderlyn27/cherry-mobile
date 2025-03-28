# Services & Stores

## Services

### Auth Service

- need to be able to create anonymous accounts with supabase
- needs to be able to login via apple, or google
- needs to be able to merge an existing anonymous account with the google/apple account

### Transaction Service

- handles all transaction
- users can purchase more credits via real money, this uses revenue cat to handle IAP with google/apple, then on success will update the transaction table in supabase, which will have triggers to handle all the credit modification/unlocks
- users can unlock a whole book, this will update a transaction table in supabase, which will have triggers to handle all the credit modification/unlocks
- users can unlock a chapter, this will update a transaction table in supabase, which will have triggers to handle all the credit modification/unlocks
- Setup how to handle refunds ?

### Revenue Cat Service

- should handle all the interactiosn with revenue cat
- should handle modifying the premium field for a user if their subscription is paid for, or if its over
- should handle checking for subscription status on app open

### Logging Service

- logs for errors with posthog, and logs them via toasts to the user

### Book Service

- handles all things related to managing book states for a user

### Chapter Service

- handles all things related to managing chapter states for a user

### User Service

- handles all things related to managing user info for a user

  - username, profile picture, ratings/comments

## Stores

### User Store (persistent)

- new_user
- ftux
- user
- credits
- preferences
- username
- profile_url
- profile_placeholder

### Book Store (non-persistent)

- load all the books from supabase

### Chapter Store (non-persistent)

- loads all the chapters from supabase

### Tags

- loads all the tags from supabase

### BookTags

- load the book-tag pairings from supabase

### Users

- load the users from supabase

### Profiles

- loads all the profiles from supabase

### SavedBooks

- loads all the saved_books from supabase

### BookProgress

- loads all the book_progress from supabase

### ChapterProgress

- loads all the chapter_progress from supabase

### LikedChapters

- loads all the liked_chapters from supabase

### UserUnlocks

- loads all the user_unlocks from supabase

### Transactions

- loads all the transactions from supabase

### Comments

- loads all the comments from supabase

### Explore Store (non-persistent)

- stores all the info needed for the explore store (top 5 books, top 8 categories, which books are top in each category, and all categories sorted by top)

### Library Store

- stores all info needed for rendering the library page, including all the users currently being read books, all the books that the user has saved or owns that aren't read, and all the books a user has completed
