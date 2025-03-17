# AI Implementation Plan: Romantic Short Stories App

## 🚀 Product Vision

A mobile app that allows users to read and purchase romantic short stories. Users can browse stories by category, save stories to their library, and purchase story content. The app also features a story reader with customizable text settings and a guest mode for frictionless previewing.


## 🎯 Target Audience

- Women romance readers age 18-35

## Tech Stack

- React Native
- Expo
- Supabase
- Typescript
- Posthog for analytics
- Superwall for paywall
- legend app state (react app state management/persistence and db sync)

## 📱 Core Architecture Priorities

1. **Performance First**: Optimize lists with virtualization, prioritize memoization
2. **State Consistency**: Synchronize library/credits/auth states globally
3. **Reusability**: Build 6 core UI components with strict props contracts
4. **Theming**: Implement dark/light modes with extendable color variables
5. **Auth Optionality**: Guest-first design with frictionless viewing/purchasing of content, need to sign-up for comments
6. **Offline access** Users should be able to save and access stories they own offline
7. **Payment Integration**: Allow users to purchase premium content with in app purchases
8. **Analytics**: Track user behavior with Posthog
9. **Paywall**: Use Superwall to manage in app purchases and subscriptions
10. **App State Management**: Use legend app state to manage app state, persistence and sync with Supabase, don't use any contexts or redux

---

## Supabase Schema Design

- **Books Table**: ID, title, price, cover URL, preview text
- **Books Category Table**: Book ID, category ID
- **Books Tag Table**: Book ID, tag ID
- **Users Table**: Credits balance, saved books array, reading progress JSON
- **User Purchases Table**: User ID, book ID, purchase date
- **User Saved Books Table**: User ID, book ID, save date
- **Categories Table**: Name, cover image, popularity score
- **Chapters Table**: Book ID, chapter number, text, word count
- **Comments Table**: User ID, book ID, chapter number, comment text, timestamp
- **Likes Table**: User ID, book ID, chapter number, timestamp
- **Dislikes Table**: User ID, book ID, chapter number, timestamp
- **Bookmarks Table**: User ID, book ID, chapter number, timestamp

## Supabase Storage Buckets

- **Book Chapters**: Chapter text files organized by book ID
- **Book Covers**: Chapter text files organized by book ID

## Supabse Implementation
- create cli commands to create all these tables and buckets, with proper RLS policies
- Setup oauth with google and apple for authentication
---

## Component Development Strategy

### Core Reusable Components

1. **Book Card**: Supports 3D/horizontal/vertical layouts + save/purchase states
2. **Story Reader**: Chapter navigation, text scaling, background textures
3. **Auth Gate**: Handles Apple/Google login flows with haptic feedback

---

## Screen Implementation Priority

### 1. Explore Screen

- **Segmented Control**: Top/For You/Categories sections
- **3D Carousel**: Parallax effect for top books
- **Category Shelves**: Horizontal scroll per genre
- **For You Recommendations**: Full-screen swipeable cards

### 2. Library Screen

- **Tri-State Tabs**: Auto-categorize books by progress
- **Ownership States**: Grey out unowned books with CTAs
- **Progress Sync**: Background updates to Supabase

### 3. Story Reader

- **Chapter Locking**: Restrict unowned content
- **Reading Tools**: Font/size/theme controls
- **Performance**: Preload owned chapters

---

## State Management Strategy

- **User Store**: Credits, preferences, saved books
- **Library Store**: Computed progress states + filtering
- **Theme Store**: Color schemes + UI settings

---

## Performance Critical Paths

1. **Image Handling**: Caching + prefetching strategies
2. **Text Rendering**: Chapter preloading + memory management
3. **Animation Budget**: Prioritize key interactions only

---

## Quality Assurance Checklist

- [ ] Cross-theme rendering validation
- [ ] Offline access to saved content
- [ ] Progress sync error handling
- [ ] Payment flow rollback safety
- [ ] Accessibility audit (WCAG 2.1)

---

## Documentation Standards

1. **Component Contracts**: Strict TypeScript interfaces
2. **JSDoc Rules**: All functions include usage examples
3. **Storybook-style**: Component headers show visual states

---

✅ **Implementation Order**:  

1. Backend Schema → 2. Core Components → 3. Explore UI →  
4. Library Logic → 5. Reader Features → 6. Auth System →  
7. Theming → 8. Performance Tuning → 9. Final QA

⚠️ **Key Constraints**:  

- 3D carousel must maintain 60fps on low-end devices  
- Chapter text loads <1s on 4G connections  
- Guest mode requires zero auth prompts, can use supabase anonymous users 