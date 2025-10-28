# QuranPager Component

A Quran page viewer with proper Mushaf layout, built with React Native. The architecture is adapted from quran.com-frontend-next's ReadingView component.

## Features

- ✅ Static single page rendering (simplified version)
- ✅ Line-by-line rendering matching physical Mushaf layout
- ✅ Verse text display using `getVerseQCF()` from `quran.ts`
- ✅ Proper verse and word structure
- ✅ Juz information in header
- ✅ Previous/Next button navigation
- ✅ Page indicator showing current page / total pages
- 🎨 Page-specific QCF fonts for authentic Quranic script
- ⚡ Optimized rendering with React.memo

**Note**: Currently implemented as a static single-page view with Previous/Next buttons. Swipe navigation can be added later using PagerView.

## Usage

```tsx
import QuranPager from '../components/QuranPager';

// In your screen component:
<QuranPager 
  initialPage={1}  // Start at page 1
  onPageChange={(page) => console.log('Switched to page:', page)}
/>
```

## Adding Quran Fonts

To display authentic Quranic text, you'll need to add the QCF (Quranic Composite Font) files.

### 1. Download QCF Fonts

You can get the fonts from:
- **Flutter Skoon project**: `assets/fonts/v2woff/` folder
- **Alternative**: Download from [Quran.com fonts repository](https://github.com/quran/quran.com-images/tree/master/fonts)

### 2. Add Fonts to React Native Project

**For iOS:**
1. Create folder: `ios/QuranWerd/fonts/`
2. Copy all `p1.woff`, `p2.woff`, ..., `p604.woff` files
3. Add to `Info.plist`:

```xml
<key>UIAppFonts</key>
<array>
    <string>fonts/p1.woff</string>
    <string>fonts/p2.woff</string>
    <!-- ... all 604 fonts ... -->
</array>
```

**For Android:**
1. Create folder: `android/app/src/main/assets/fonts/`
2. Copy all font files (rename `.woff` to `.ttf` if needed)
3. Fonts will be auto-detected

### 3. Update Font Reference in Component

In `QuranPager/index.tsx`, update the `PageSection` component:

```tsx
<Text
  key={`${surah}-${verseNumber}`}
  style={[
    styles.verse,
    {
      // Dynamic font per page
      fontFamily: `QCF_P${pageNumber.toString().padStart(3, '0')}`,
    },
  ]}>
  {verseText}
</Text>
```

### 4. iOS-specific: Convert WOFF to TTF (Optional)

If React Native can't use WOFF files:

```bash
# Install fonttools
pip install fonttools

# Convert all woff files
for file in assets/fonts/v2woff/*.woff; do
    ttx -f -o "${file%.woff}.ttf" "$file"
done
```

## Performance Optimization

The current implementation renders all 604 pages at once. For better performance with large datasets:

### Option 1: Lazy Loading (Recommended)

```tsx
// Only render visible pages + buffer
const BUFFER = 2; // pages before/after visible

const renderPage = (pageNumber: number) => {
  if (Math.abs(pageNumber - currentPage) > BUFFER) {
    return <View style={styles.pageContainer} />; // Empty placeholder
  }
  
  // Full page rendering
  return (
    <View style={styles.pageContainer}>
      {/* Full page content */}
    </View>
  );
};
```

### Option 2: Virtualization

Use `react-native-recyclerlistview` for better memory management:

```bash
npm install react-native-recyclerlistview
```

## Customization

### Colors & Themes

Update `styles` in the component:

```tsx
container: {
  backgroundColor: '#FFFCE7', // Quran page color
},
verse: {
  color: '#1a1a1a', // Arabic text color
  fontSize: 24,
  lineHeight: 36,
}
```

### RTL Support

The component automatically supports RTL text direction. Make sure:

1. iOS: Set `supportsRTL: true` in `Info.plist`
2. Android: Set `supportsRtl: true` in `AndroidManifest.xml`
3. Text components use `textAlign: 'right'`

## Architecture

The component architecture is inspired by quran.com-frontend-next's ReadingView:

### Component Hierarchy
```
QuranPager (Main)
  └── PageContainer (Data loader)
      └── Page (Layout manager)
          └── Line (Text renderer)
```

### Files Structure
```
QuranPager/
├── index.tsx                 # Main pager component with navigation
├── PageContainer.tsx         # Loads and prepares page data
├── Page.tsx                  # Renders page with lines
├── Line.tsx                  # Renders individual line
├── types.ts                  # TypeScript interfaces
├── utils/
│   ├── groupLinesByVerses.ts    # Groups verses into lines
│   ├── groupPagesByVerses.ts    # Groups verses into pages
│   └── transformPageData.ts     # Transforms content data
└── README.md
```

### Key Technologies
- **`react-native-pager-view`**: Native pager for smooth swiping
- **`src/content/page_data.ts`**: Page structure data
- **`src/content/quran.ts`**: `getPageData()` and `getVerseQCF()` functions
- **`src/content/surah_data.ts`**: Surah metadata

### Data Flow
1. **QuranPager** manages page navigation and state
2. **PageContainer** fetches verses for current page using `getPageVerses()`
3. **transformPageData** converts content data into Verse/Word structure
4. **groupLinesByVerses** organizes words into lines (simulating Mushaf layout)
5. **Page** renders all lines for the page
6. **Line** renders individual line with proper font and styling

## Future Enhancements

- [ ] Bookmark functionality
- [ ] Search functionality
- [ ] Translation overlay
- [ ] Audio playback sync
- [ ] Night mode theme
- [ ] Font size adjustment
- [ ] Verse highlighting on tap

## Comparison with Web Version

### Similarities
- **Component structure**: PageContainer → Page → Line hierarchy
- **Grouping logic**: Lines and pages grouped by verse structure
- **Memoization**: Uses React.memo for performance optimization
- **Font handling**: Page-specific fonts for accurate rendering

### Differences
- **Virtual scrolling**: Web uses Virtuoso, mobile uses PagerView
- **Data source**: Web fetches from API, mobile uses local content
- **Line numbers**: Web has real line data from API, mobile simulates based on word count
- **Navigation**: Mobile has explicit Previous/Next buttons for better touch UI

## Troubleshooting

**Fonts not displaying:**
- Check font files are in correct directory
- Verify font name matches exactly (case-sensitive)
- Try restarting Metro bundler: `npm start -- --reset-cache`

**Performance issues:**
- Implement lazy loading (see above)
- Use `console.time()` to profile rendering
- Consider using `React.memo` for PageSection

**Memory issues:**
- Implement virtualization
- Limit number of rendered pages
- Use `FlatList` instead of full rendering
