# QuranPager API Integration

## Overview

The QuranPager component now fetches data from the **same Quran.com API** used by the web version, ensuring data consistency and accuracy.

## ✅ What Changed

### Before: Local Data
```typescript
// Old approach - local files
const verses = getPageVerses(pageNumber);
// Returns: verses with SIMULATED line numbers
```

### After: API Data
```typescript
// New approach - API fetch
const verses = await getPageVerses(pageNumber);
// Returns: verses with REAL line numbers from API
```

## 🌐 API Details

### Endpoint
```
GET https://api.qurancdn.com/api/qdc/verses/by_page/{pageNumber}
```

### Example Request
```
https://api.qurancdn.com/api/qdc/verses/by_page/3?
  words=true
  &per_page=all
  &word_fields=text_uthmani,code_v1,code_v2,page_number,line_number
  &mushaf_id=1
```

### Response Structure
```json
{
  "verses": [
    {
      "id": 18,
      "verse_number": 6,
      "verse_key": "2:6",
      "juz_number": 1,
      "hizb_number": 1,
      "page_number": 3,
      "words": [
        {
          "id": 67,
          "position": 1,
          "text_uthmani": "إِنَّ",
          "page_number": 3,
          "line_number": 1,  // ← REAL LINE NUMBER!
          "verse_key": "2:6",
          "code_v1": "...",
          "code_v2": "..."
        }
        // ... more words
      ]
    }
  ],
  "pagination": {
    "per_page": "all",
    "current_page": 1,
    "total_pages": 1,
    "total_records": 11
  }
}
```

## 📁 New File Structure

```
src/
├── api/                           # NEW: API integration
│   ├── index.ts                   # Main exports
│   ├── config.ts                  # API configuration
│   ├── client.ts                  # Axios client with interceptors
│   ├── types.ts                   # API response types
│   └── transformers.ts            # Response transformers
│
└── components/QuranPager/
    ├── types.ts                   # Updated with API structure
    ├── PageContainer.tsx          # Now async with API
    ├── Line.tsx                   # Uses textUthmani field
    └── utils/
        ├── transformPageData.ts   # Now fetches from API
        └── groupLinesByVerses.ts  # Uses real line numbers
```

## 🔄 Data Flow

### Complete Flow
```
User navigates to page 3
  ↓
PageContainer mounts
  ↓
getPageVerses(3) called
  ↓
fetchPageVerses(3)
  - Makes API request to:
    https://api.qurancdn.com/api/qdc/verses/by_page/3
  ↓
API returns VersesResponse
  {
    verses: [...],
    pagination: {...}
  }
  ↓
transformApiVersesResponse()
  - Converts snake_case to camelCase
  - Maps ApiVerse → Verse
  - Maps ApiWord → Word
  ↓
Verses with REAL line numbers
  [
    {
      verseKey: "2:6",
      words: [
        {
          textUthmani: "إِنَّ",
          lineNumber: 1,  // ← From API!
          pageNumber: 3
        }
      ]
    }
  ]
  ↓
groupLinesByVerses()
  - Groups by page and line: "Page3-Line1"
  ↓
Page renders lines
  ↓
User sees accurate Mushaf layout!
```

## 🎯 Key Benefits

### 1. Real Line Numbers
**Before:** `lineNumber: Math.floor(wordId / 15) + 1` (simulated)  
**After:** `lineNumber: word.line_number` (from API)

### 2. Complete Word Data
```typescript
interface Word {
  id: number;
  position: number;
  textUthmani: string;    // ✅ Official text
  pageNumber: number;     // ✅ Accurate
  lineNumber: number;     // ✅ Real from API
  codeV1: string;         // ✅ Font code
  codeV2: string;         // ✅ Font code
  verseKey: string;       // ✅ Reference
}
```

### 3. Consistent with Web
- Uses same API endpoint
- Same data structure
- Same line layout
- Same font codes

### 4. Future-Proof
- Easy to add translations
- Easy to add audio
- Easy to add word-by-word
- API updates automatically propagate

## 📊 Comparison

| Feature | Before (Local) | After (API) |
|---------|---------------|-------------|
| **Data Source** | Local files | Quran.com API |
| **Line Numbers** | Simulated (~15 words/line) | ✅ Real from API |
| **Accuracy** | Approximate | ✅ 100% accurate |
| **Updates** | App update required | ✅ Automatic |
| **Internet** | Not required | Required |
| **Speed** | Instant | Network dependent |
| **Data Freshness** | Static | ✅ Always current |
| **Font Codes** | Not available | ✅ Included |
| **Verse Metadata** | Basic | ✅ Complete |

## 🔧 Configuration

### API Configuration
```typescript
// src/api/config.ts
export const API_CONFIG = {
  PRODUCTION_HOST: 'https://api.qurancdn.com',
  API_ROOT_PATH: '/api/qdc',
  BASE_URL: 'https://api.qurancdn.com/api/qdc',
};

export const DEFAULT_VERSES_PARAMS = {
  words: true,
  perPage: 'all',
  wordFields: 'text_uthmani,code_v1,code_v2,page_number,line_number',
  mushafId: 1, // Madani Mushaf
};
```

### Axios Client
```typescript
// src/api/client.ts
import axios from 'axios';

// Configured axios instance with:
// - Base URL: https://api.qurancdn.com/api/qdc
// - Timeout: 10 seconds
// - Request interceptor: camelCase → snake_case conversion
// - Response interceptor: Error handling and logging

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Making API Requests
```typescript
import {fetchPageVerses} from '../../../api/client';

// Fetch verses for page 3
const response = await fetchPageVerses(3);
// Returns: ApiVersesResponse with all verse data
```

### Transforming Responses
```typescript
import {transformApiVersesResponse} from '../../../api/transformers';

const verses = transformApiVersesResponse(response);
// Returns: Verse[] in component-friendly format
```

## 🧪 Testing the Integration

### 1. Check Network Tab
When the app loads, you should see API requests to:
```
https://api.qurancdn.com/api/qdc/verses/by_page/3?words=true&per_page=all&...
```

### 2. Verify Line Numbers
Lines should match exactly with the physical Mushaf and web version.

### 3. Check Console
Should show:
```
Fetched verses from API: {
  pageVerses: [
    {
      verseKey: "2:6",
      words: [...]
    }
  ]
}
```

## 🚀 Usage

The component usage remains the same:
```tsx
import QuranPager from './components/QuranPager';

<QuranPager
  initialPage={3}
  fontSize={18}
  showHeader={true}
  showPageFooter={true}
/>
```

But now it fetches from the API automatically!

## ⚠️ Important Notes

### Internet Requirement
- App now requires internet connection to load pages
- Consider adding offline caching for better UX
- Show appropriate loading states

### Error Handling
```typescript
try {
  const verses = await getPageVerses(pageNumber);
} catch (error) {
  // Network error, API error, etc.
  console.error('Failed to load page:', error);
}
```

### Performance
- First load requires network request (~200-500ms)
- Consider implementing:
  - Request caching
  - Prefetching adjacent pages
  - Offline fallback

## 🔮 Future Enhancements

### 1. Add Caching
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const getCachedPage = async (pageNumber) => {
  const cached = await AsyncStorage.getItem(`page_${pageNumber}`);
  return cached ? JSON.parse(cached) : null;
};
```

### 2. Add Translations
```typescript
const response = await fetchPageVerses(pageNumber, {
  translations: '131,85', // English and Urdu
});
```

### 3. Add Audio
```typescript
const response = await fetchPageVerses(pageNumber, {
  reciter: 7, // Mishari Alafasy
});
```

### 4. Prefetch Next Page
```typescript
useEffect(() => {
  // Prefetch next page in background
  fetchPageVerses(pageNumber + 1);
}, [pageNumber]);
```

## 📝 Summary

The mobile app now:
- ✅ Uses Quran.com API (same as web)
- ✅ Gets real line numbers (not simulated)
- ✅ Has complete word metadata
- ✅ Matches web version exactly
- ✅ Future-proof for new features
- ✅ Always has latest data

The architecture matches the web version while being optimized for React Native! 🎉

