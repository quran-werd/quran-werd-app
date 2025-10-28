# QuranPager Architecture

This document explains the architecture of the QuranPager component, adapted from the quran.com-frontend-next ReadingView component.

## Overview

The QuranPager component provides a page-by-page view of the Quran with proper Mushaf layout, matching how the Quran appears in physical copies. The architecture follows a component hierarchy that separates concerns: navigation, data loading, layout, and rendering.

## Component Hierarchy

```
QuranPager (index.tsx)
  │
  ├── Header (Page & Juz info)
  │
  ├── PagerView (604 pages)
  │     │
  │     └── PageContainer (for each page)
  │           │
  │           ├── Loading state
  │           └── Page
  │                 │
  │                 └── Line (multiple)
  │                       └── Text (words)
  │
  └── Navigation Controls
```

## Component Responsibilities

### QuranPager (`index.tsx`)
**Purpose**: Main container and navigation controller

**Responsibilities**:
- Manages current page state
- Handles page navigation (swipe, previous, next)
- Displays header with page and Juz information
- Renders navigation controls
- Provides callback for page changes

**Key Props**:
- `initialPage`: Starting page number (1-604)
- `fontSize`: Font size for Arabic text
- `showPageFooter`: Whether to show page number at bottom
- `showHeader`: Whether to show header with page info
- `onPageChange`: Callback when page changes

### PageContainer (`PageContainer.tsx`)
**Purpose**: Data loader and preparation layer

**Responsibilities**:
- Fetches verse data for the given page number
- Transforms raw data into Verse/Word structure
- Determines correct QCF font for the page
- Manages loading states
- Passes prepared data to Page component

**Key Features**:
- Uses `getPageVerses()` to fetch and transform data
- Uses `getPageQCFontName()` to get page-specific font
- Shows loading indicator while preparing data

### Page (`Page.tsx`)
**Purpose**: Page layout manager

**Responsibilities**:
- Groups verses into lines using `groupLinesByVerses()`
- Renders all lines for the page
- Displays page footer with page number
- Manages scroll behavior within page

**Key Features**:
- Uses `useMemo` to optimize line grouping
- Provides consistent spacing and layout
- Handles both scrollable and fixed layouts

### Line (`Line.tsx`)
**Purpose**: Individual line renderer

**Responsibilities**:
- Renders a single line of Quranic text
- Applies correct font and styling
- Handles highlighting state
- Manages RTL text direction

**Key Features**:
- Memoized with custom comparison function
- Only re-renders when lineKey, font, or highlight changes
- Properly handles Arabic text with RTL support

## Data Structures

### Word Interface
```typescript
interface Word {
  id: number;
  text: string;
  verseKey: string;        // e.g., "2:255"
  pageNumber: number;
  lineNumber: number;
  verseNumber: number;
  chapterId: number;
  position: number;
  isVerseEnd: boolean;
}
```

### Verse Interface
```typescript
interface Verse {
  id: number;
  verseNumber: number;
  chapterId: number;
  pageNumber: number;
  verseKey: string;
  words: Word[];
}
```

### LineData Interface
```typescript
interface LineData {
  lineKey: string;         // e.g., "Page1-Line5"
  words: Word[];
  pageNumber: number;
  lineNumber: number;
}
```

## Utility Functions

### `transformPageData.ts`
**Purpose**: Converts content data into Verse/Word structure

**Key Function**: `getPageVerses(pageNumber: number): Verse[]`
- Fetches page data using `getPageData()`
- Gets verse text using `getVerseQCF()`
- Splits verses into words
- Assigns line numbers (simulated based on word count)
- Returns array of Verse objects with Word arrays

**Note**: Since the mobile app doesn't have line number data from API, it simulates line breaks by assigning approximately 15 words per line to match typical Mushaf layout.

### `groupLinesByVerses.ts`
**Purpose**: Organizes words into lines

**Key Functions**:
1. `groupLinesByVerses(verses: Verse[]): Record<string, Word[]>`
   - Groups words by page and line number
   - Returns map with keys like "Page1-Line5"

2. `getLineDataFromVerses(verses: Verse[]): LineData[]`
   - Converts grouped lines into array of LineData objects
   - Easier to iterate in React components

### `groupPagesByVerses.ts`
**Purpose**: Organizes verses by page number

**Key Function**: `groupPagesByVerses(verses: Verse[]): Record<number, Verse[]>`
- Groups verses by page number
- Used for multi-page data management

## Data Flow

```
User swipes to new page
  ↓
QuranPager updates currentPage state
  ↓
PageContainer receives new pageNumber
  ↓
PageContainer fetches data:
  - getPageData(pageNumber) → sections
  - getVerseQCF(surah, verse) → text
  - getPageQCFontName(pageNumber) → font
  ↓
transformPageData creates Verse/Word structure
  ↓
Page groups words into lines
  ↓
Each Line renders with proper font
  ↓
User sees properly formatted Quran page
```

## Performance Optimizations

### React.memo
- **Line component**: Memoized with custom comparison
- **Page component**: Could be memoized (future enhancement)

### Custom Comparison (Line)
Only re-renders Line when:
- Line key changes (different line)
- Font changes
- Number of words changes
- Highlight state changes

### Lazy Rendering
- PagerView only renders visible pages + buffer
- Non-visible pages are unmounted

### UseMemo
- Line grouping is memoized per page
- Font calculations are memoized per page

## Integration with Content System

### Dependencies
```typescript
import {
  getPageData,       // Get page structure
  getVerseQCF,       // Get verse text with QCF data
  getPageQCFontName, // Get font name for page
  getJuzNumber,      // Get Juz information
  totalPagesCount,   // Total pages (604)
} from '../../content';
```

### Content Files Used
- `page_data.ts`: Page structure (which verses on each page)
- `quran_text.ts`: Verse text with QCF data
- `juz_data.ts`: Juz information
- `surah_data.ts`: Surah metadata

## Differences from Web Version

### Architecture
- ✅ Same component hierarchy
- ✅ Same grouping logic
- ✅ Same memoization strategy

### Implementation
- 🔄 PagerView instead of Virtuoso
- 🔄 Local data instead of API calls
- 🔄 Simulated line numbers instead of API data
- 🔄 Native navigation controls

### Benefits of Mobile Adaptation
- Offline-first: All data is local
- Faster: No network requests
- Touch-optimized: Explicit navigation buttons
- Native feel: Uses platform-specific pager

## Future Enhancements

### Data Quality
- [ ] Integrate real line number data from API
- [ ] Add word-by-word translation data
- [ ] Add transliteration data

### Features
- [ ] Verse highlighting during audio playback
- [ ] Tap word for translation
- [ ] Bookmark support
- [ ] Search within pages
- [ ] Share verse functionality

### Performance
- [ ] Implement true virtualization (only render visible + buffer)
- [ ] Lazy load fonts per page
- [ ] Cache transformed data
- [ ] Optimize word splitting algorithm

### UI/UX
- [ ] Pinch-to-zoom support
- [ ] Night mode
- [ ] Font size adjustment
- [ ] Reading progress indicator
- [ ] Quick jump to page/surah/juz

