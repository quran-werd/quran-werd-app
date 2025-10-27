# QuranPager Component

A full-featured Quran page viewer with horizontal swipe navigation, built with React Native and using your converted content files.

## Features

- ✅ Horizontal swipe navigation through all 604 Quran pages
- ✅ Page-by-page rendering using `page_data.ts`
- ✅ Verse text display using `getVerse()` from `quran.ts`
- ✅ Juz information in header
- ✅ Previous/Next controls
- ✅ Page indicator showing current page / total pages
- 🎨 Supports custom fonts (QCF fonts for authentic Quranic script)

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

The component uses:
- **`react-native-pager-view`**: Native pager for smooth swiping
- **`src/content/page_data.ts`**: Page structure data
- **`src/content/quran.ts`**: `getPageData()` and `getVerse()` functions
- **`src/content/surah_data.ts`**: Surah metadata

## Future Enhancements

- [ ] Bookmark functionality
- [ ] Search functionality
- [ ] Translation overlay
- [ ] Audio playback sync
- [ ] Night mode theme
- [ ] Font size adjustment
- [ ] Verse highlighting on tap

## Data Flow

```
Page Swipe
  ↓
handlePageChange(page)
  ↓
getPageData(page)
  ↓
For each section in page:
  For each verse in section:
    getVerse(surah, verseNumber)
      ↓
    Render Text with QCF font
```

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
