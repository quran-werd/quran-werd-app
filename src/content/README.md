# Content Data Files

This directory contains Quran-related data files converted from Dart to TypeScript.

## Converted Files

### ✅ TypeScript Files (Ready to use)

- **surah_data.ts** - Surah/chapter information (name, ayah count, place of revelation)
- **sajdah_verses.ts** - Map of surah numbers to verse numbers that contain prostration
- **reciters.ts** - List of Quran reciters with identifiers
- **juz_data.ts** - Juz (part) data with surah and verse mappings
- **page_data.ts** - Page-by-page data mapping surahs and verses

### 📦 Large Data Files (Not converted)

These files are too large (>1MB) to convert directly:
- **quran_text.dart** (2.2MB) - Full Quranic text with diacritics
- **quran_text_normal.dart** (1.1MB) - Quranic text without diacritics
- **quran.dart** (22KB) - Utility functions for Quran data

If you need these files converted, consider:
1. Splitting them into smaller chunks
2. Using lazy loading
3. Loading from a separate API/service

## Usage

```typescript
import { surah, surahVerses, reciters, juz, pageData } from './content';

// Access surah data
console.log(surah[0]); // First surah (Al Fatiha)

// Access reciters
console.log(reciters);

// Access juz data
console.log(juz[0]); // First juz
```

## Types

All files export TypeScript interfaces:
- `Surah` - Surah information
- `Reciter` - Reciter information  
- `Juz` - Juz data structure
- `PageDataItem` - Page data structure

