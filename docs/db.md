# Database Overview

## Tables

### users

- id (uuid) (foreign key to auth.users)
- credits (number)
- premium_user (boolean)
- dark_mode (boolean)
- font_size (number)

### profiles

- id (uuid) (foreign key to users.id)
- username
- profile_url
- profile_placeholder

### books

- id (uuid)
- title (string)
- author (string)
- description (string)
- cover_url (string)
- cover_placeholder (string)
- chapter_count (number)
- price (number)
- reader_count (number)
- reading_time (number)
- created_at (timestamp)
- updated_at (timestamp)

### chapters

- id (uuid)
- book_id (uuid) (foreign key to books.id)
- title (string)
- content_url (string)
- price (number)
- created_at (timestamp)
- updated_at (timestamp)

### tags

- id (uuid)
- name (string)
- created_at (timestamp)
- updated_at (timestamp)

### book_tags

- id (uuid)
- book_id (uuid) (foreign key to books.id)
- tag_id (uuid) (foreign key to tags.id)
- created_at (timestamp)
- updated_at (timestamp)

### chapter_progress

- id (uuid)
- user_id (uuid) (foreign key to users.id)
- chapter_id (uuid) (foreign key to chapters.id)
- status (enum 'reading', 'unread', 'completed')
- created_at (timestamp)
- updated_at (timestamp)

### liked_chapters

- id (uuid)
- user_id (uuid) (foreign key to users.id)
- chapter_id (uuid) (foreign key to chapters.id)
- book_id (uuid) (foreign key to books.id)
- created_at (timestamp)
- updated_at (timestamp)

### saved_books

- id (uuid)
- user_id (uuid) (foreign key to users.id)
- book_id (uuid) (foreign key to books.id)
- created_at (timestamp)
- updated_at (timestamp)

### user_unocks

- id (uuid)
- book_id (uuid) (foreign key to books.id)
- chapter_id (uuid) (foreign key to chapters.id)
- is_full_book (boolean)
- created_at (timestamp)
- updated_at (timestamp)

### transactions

- id (uuid)
- user_id (uuid) (foreign key to users.id)
- transaction_type (enum'purchase', 'unlock', 'refund')
- credits (number) (cherry number)
- book_id (uuid) (foreign key to books.id)
- chapter_id (uuid) (foreign key to chapters.id)
- status (enum'completed', 'failed', 'pending', 'refund')
- payment_intent_id (string) (revenue cat id)
- price (number) (dollar number)
- created_at (timestamp)
- updated_at (timestamp)

### interactions

- id (uuid)
- user_id (uuid) (foreign key to users.id)
- type (enum'share', 'like', 'read', 'purchase', 'open', 'save', 'comment')
- book_id (uuid) (foreign key to chapters.id)
- chapter_id (uuid) (foreign key to chapters.id)
- created_at (timestamp)
- updated_at (timestamp)

### book_progress (keep track of which chapter the user is on)

- id (uuid)
- user_id (uuid) (foreign key to users.id)
- book_id (uuid) (foreign key to books.id)
- current_chapter_id (uuid) (foreign key to chapters.id)
- status enum('finished','reading', 'unread')
- created_at (timestamp)
- updated_at (timestamp)

### cherry_ledger

- id (uuid)
- user_id (uuid) (foreign key to users.id)
- transaction_id (uuid) (foreign key to transactions.id)
- amount (number) (cherry number)
- previous_balance (number) (cherry number)
- new_balance (number) (cherry number)
- created_at (timestamp)
- updated_at (timestamp)

### comments

- id (uuid)
- user_id (uuid) (foreign key to users.id)
- book_id (uuid) (foreign key to books.id)
- chapter_id (uuid) (foreign key to chapters.id)
- content (string)
- created_at (timestamp)
- updated_at (timestamp)

## Buckets

- user_profiles
- book_covers
- chapter_content 

## RLS Policies

- Any auth user can access books, tags, book_tag, profiles, liked_chapters, and comments
- all users can access chapters with chapter number 1
- Only users with matching user_unlock entries for their id, and a chapter, can access that chapter value in the chapters table for chapters with a higher chapter number than 1
- Only user with matching id to the id/user_id can access: chapter_progress, user account, user_unlock, book_progress, saved_books, transactions
- cherry_ledger is for admin only

## Triggers

- when a user moves a book to status reading from unread in the book_progress table, it will update the book read_count in books table
- trigger for when a user marks a chapter as complete in chapter_progress table, it will update the book_progress table to the next chapter, if its the last chapter change the status of the book progress to completed
- when a transaction is marked as completed and its of type purchase in the transactions tbale, it will update the user's credit balance in the users table, and add the information to the cherry_ledger table
- when a transaction is marked as completed in the transaction table, and its of type unlock and it has either the book or chapter field filled out, add this chapter or book to the user_unlocks table
