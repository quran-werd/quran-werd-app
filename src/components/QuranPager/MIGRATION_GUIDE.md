# QuranPager Migration Guide

This document explains the changes made to the QuranPager component to match the architecture of quran.com-frontend-next's ReadingView.

## What Changed?

### Before (Old Structure)
```
QuranPager/
  ├── index.tsx    # Single file with all logic
  └── README.md
```

**Old Approach**:
- Single component with all logic
- Concatenated all verses into one string
- Simple text rendering without line structure
- No separation of concerns

### After (New Structure)
```
QuranPager/
  ├── index.tsx                    # Main navigation component
  ├── PageContainer.tsx            # Data loader
  ├── Page.tsx                     # Page layout manager
  ├── Line.tsx                     # Line renderer
  ├── types.ts                     # TypeScript interfaces
  ├── utils/
  │   ├── groupLinesByVerses.ts    # Line grouping logic
  │   ├── groupPagesByVerses.ts    # Page grouping logic
  │   ├── transformPageData.ts     # Data transformation
  │   └── index.ts                 # Utility exports
  ├── README.md                    # Usage guide
  ├── ARCHITECTURE.md              # Architecture documentation
  └── MIGRATION_GUIDE.md           # This file
```

**New Approach**:
- Modular component architecture
- Line-by-line rendering matching Mushaf layout
- Proper data structures (Verse → Word → Line)
- Clear separation of concerns
- Optimized with React.memo

## Key Improvements

### 1. **Proper Mushaf Layout**
**Old**: All verses concatenated into single text
```tsx
const allVerses = pageData.map(/* ... */).join(' ');
<Text>{allVerses}</Text>
```

**New**: Line-by-line rendering
```tsx
{lines.map(line => (
  <Line key={line.lineKey} words={line.words} />
))}
```

### 2. **Data Structure**
**Old**: Simple string concatenation
```tsx
const verses = Array.from({length: end - start + 1}, (_, i) => {
  return getVerseQCF(surah, start + i);
}).join(' ');
```

**New**: Structured data with Word and Verse interfaces
```tsx
interface Word {
  id: number;
  text: string;
  verseKey: string;
  pageNumber: number;
  lineNumber: number;
  // ... more properties
}

interface Verse {
  id: number;
  verseNumber: number;
  words: Word[];
  // ... more properties
}
```

### 3. **Component Separation**
**Old**: Everything in one component
```tsx
export default function QuranPager() {
  // All logic here
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>{allVerses}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
```

**New**: Separated concerns
```tsx
// QuranPager: Navigation
export default function QuranPager() {
  return (
    <PagerView>
      {pages.map(pageNum => (
        <PageContainer pageNumber={pageNum} />
      ))}
    </PagerView>
  );
}

// PageContainer: Data loading
const PageContainer = ({pageNumber}) => {
  const verses = getPageVerses(pageNumber);
  return <Page verses={verses} />;
};

// Page: Layout
const Page = ({verses}) => {
  const lines = groupLinesByVerses(verses);
  return lines.map(line => <Line {...line} />);
};

// Line: Rendering
const Line = ({words}) => {
  return <Text>{words.map(w => w.text).join(' ')}</Text>;
};
```

### 4. **Performance Optimization**
**Old**: No memoization
```tsx
export default function QuranPager() {
  // Re-renders on every update
}
```

**New**: Optimized with React.memo
```tsx
const Line = memo(({words}) => {
  // Only re-renders when props actually change
}, arePropsEqual);

const Page = ({verses}) => {
  const lines = useMemo(
    () => groupLinesByVerses(verses),
    [verses]
  );
  // ...
};
```

### 5. **Type Safety**
**Old**: Minimal types
```tsx
export default function QuranPager() {
  const pageNumber = 3; // hardcoded
  // ...
}
```

**New**: Full TypeScript interfaces
```tsx
interface QuranPagerProps {
  initialPage?: number;
  fontSize?: number;
  showPageFooter?: boolean;
  showHeader?: boolean;
  onPageChange?: (page: number) => void;
}

interface Word {
  id: number;
  text: string;
  // ... all properties typed
}
```

## Breaking Changes

### Props API

**Old API**:
```tsx
<QuranPager />  // No props, hardcoded page 3
```

**New API**:
```tsx
<QuranPager
  initialPage={1}              // Starting page
  fontSize={24}                // Font size
  showPageFooter={true}        // Show page number
  showHeader={true}            // Show header
  onPageChange={(page) => {}}  // Page change callback
/>
```

### Import Paths

**Old**:
```tsx
import QuranPager from './components/QuranPager';
```

**New** (same):
```tsx
import QuranPager from './components/QuranPager';
// Component exports and utilities available
```

### Internal Structure

If you extended the old component, you'll need to update your code:

**Old**: Single component modification
```tsx
// Modified the main component directly
```

**New**: Multiple extension points
```tsx
// Extend specific parts:
// - Custom Line rendering → modify Line.tsx
// - Custom Page layout → modify Page.tsx
// - Custom data loading → modify PageContainer.tsx
// - Custom navigation → modify index.tsx
```

## Migration Steps

### Step 1: Update Usage (If Different)
```tsx
// Old
<QuranPager />

// New - Add props as needed
<QuranPager
  initialPage={currentPage}
  onPageChange={(page) => savePageToState(page)}
  fontSize={userFontSize}
/>
```

### Step 2: Test Page Navigation
```tsx
// Make sure navigation works
<QuranPager
  initialPage={1}
  onPageChange={(page) => console.log('Page:', page)}
/>
```

### Step 3: Verify Font Loading
- Ensure QCF fonts are properly loaded
- Check that page-specific fonts are applied
- Verify Arabic text displays correctly

### Step 4: Check Performance
- Test smooth page swiping
- Verify no lag when switching pages
- Check memory usage with all 604 pages

## Backward Compatibility

### What Still Works
- ✅ Same component name
- ✅ Same import path
- ✅ Basic rendering without props
- ✅ Page navigation
- ✅ Font support

### What Changed
- ⚠️ Internal structure (not breaking if using as black box)
- ⚠️ Props API enhanced (old usage still works)
- ⚠️ Component hierarchy (for extensions)

## Benefits of New Architecture

### 1. **Maintainability**
- Clear separation of concerns
- Each component has single responsibility
- Easy to locate and fix bugs
- Code is self-documenting

### 2. **Extensibility**
- Easy to add features like:
  - Word-by-word translation
  - Verse highlighting
  - Audio synchronization
  - Bookmarks
  - Search

### 3. **Performance**
- Memoized components reduce re-renders
- Optimized line grouping with useMemo
- Better memory management

### 4. **Testability**
- Each component can be tested in isolation
- Utility functions are pure and testable
- Mock data easily injectable

### 5. **Consistency**
- Matches proven architecture from web version
- Uses same patterns and conventions
- Easier for developers familiar with web version

## Common Issues & Solutions

### Issue 1: Fonts Not Displaying
**Problem**: Arabic text showing as boxes or default font

**Solution**:
```tsx
// Make sure fonts are loaded in your app
// Check that getPageQCFontName returns correct font name
const fontName = getPageQCFontName(pageNumber);
console.log('Font:', fontName); // Should be like "QCF2001"
```

### Issue 2: Performance Lag
**Problem**: Slow page switching

**Solution**:
```tsx
// The new architecture is already optimized
// If still slow, check if too many pages render at once
// PagerView should handle this, but you can adjust buffer
```

### Issue 3: Line Breaks Don't Match Mushaf
**Problem**: Line breaks are approximate

**Note**: This is expected since we don't have real line data from API
```tsx
// Line numbers are simulated based on word count
// To fix: Integrate real line data from quran.com API
const WORDS_PER_LINE = 15; // Adjust this value if needed
```

### Issue 4: Missing TypeScript Types
**Problem**: TypeScript errors

**Solution**:
```tsx
// Make sure to import types
import type {Word, Verse, LineData} from './types';
```

## Next Steps

### Immediate
1. Test the new component thoroughly
2. Verify all 604 pages render correctly
3. Check navigation works smoothly
4. Ensure fonts display properly

### Short Term
1. Add word-by-word features
2. Implement verse highlighting
3. Add bookmark functionality
4. Integrate with audio player

### Long Term
1. Fetch real line data from API
2. Add translation overlays
3. Implement search functionality
4. Add memorization features

## Questions or Issues?

If you encounter any problems with the migration:

1. Check the [README.md](./README.md) for usage examples
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for design details
3. Look at component code - it's well-commented
4. Check console for error messages

## Conclusion

The new architecture provides:
- ✅ Better code organization
- ✅ Improved performance
- ✅ Enhanced maintainability
- ✅ Easier extensibility
- ✅ Consistent with web version

While the internal structure changed significantly, the component is backward compatible and provides a much better foundation for future features.

