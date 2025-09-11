# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Starting the Application
```powershell
# Start Metro bundler (keep running in separate terminal)
npm start

# Run on Android (requires Android Studio/emulator)
npm run android

# Run on iOS (macOS only, requires Xcode/simulator)
npm run ios
```

### Testing and Quality
```powershell
# Run all tests
npm test

# Run specific test file
npm test -- App.test.tsx

# Lint code
npm run lint

# Build the app (if configured)
npm run build
```

### Platform-Specific Development
```powershell
# Clean and rebuild Android (if encountering issues)
cd android
./gradlew clean
cd ..
npm run android

# Clean iOS build (macOS only)
cd ios
xcodebuild clean
cd ..
npm run ios

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..
```

### Development Tools
```powershell
# Enable experimental debugger with Metro
npm start -- --experimental-debugger

# Reset Metro cache if needed
npm start -- --reset-cache
```

## Architecture Overview

### Core Application Structure
QuranWerd is a React Native app for Quran recitation practice with speech recognition capabilities. The app follows a feature-based architecture with Redux for state management.

**Key Architecture Patterns:**
- **Redux Toolkit**: Centralized state management with slices for chapters and individual chapter data
- **React Navigation**: Bottom tabs navigation with stack navigators for different sections
- **Feature-Based Organization**: Code organized by domain features (Chapter, Chapters) rather than technical layers
- **Custom Hooks**: Reusable logic extracted into hooks (e.g., `useSpeechToText`)

### State Management (Redux)
- **Store Configuration**: Located in `src/store/index.ts` with two main slices
- **Chapters Slice**: Manages list of Quran chapters/surahs
- **Chapter Slice**: Manages individual chapter content, verses, and page layout
- **Async Actions**: API calls handled via `createAsyncThunk` in action files
- **Type Safety**: Full TypeScript integration with typed selectors and dispatch

### API Integration
- **Base URL**: `https://api.quran.com/api/v4`
- **Axios Configuration**: Custom interceptor in `src/utils/axios/quran.interceptor.ts`
- **Data Flow**: API responses transformed and normalized before storing in Redux
- **Key Endpoints**:
  - `/verses/by_page/{pageNumber}?words=true` - Detailed verse information
  - `/quran/verses/uthmani?page_number={pageNumber}` - Uthmani text
  - `/chapters/{chapterNumber}` - Chapter metadata

### Speech Recognition Integration
- **Library**: `@react-native-voice/voice` for Arabic speech recognition
- **Locale**: Configured for Arabic (`ar-SA`)
- **Permissions**: Automatic microphone permission handling
- **Real-time**: Supports partial results during recording
- **Platform Support**: Cross-platform with Android/iOS specific configurations

### Navigation Structure
```
BottomTabs
└── ChaptersStack
    ├── Chapters (List view)
    └── Page (Individual chapter/page view)
```

### Component Architecture
- **Atomic Design**: Components organized by complexity (Word → Line → Chapter → Page)
- **Word Component**: Individual Quranic words with translation/transliteration
- **Line Component**: Groups words into lines matching Mushaf layout
- **Chapter Component**: Renders complete chapter with proper formatting
- **PagerView**: Handles page-by-page navigation through Quran

### Key Technical Considerations
- **RTL Support**: Proper right-to-left text direction for Arabic content
- **Typography**: Uthmani script rendering for authentic Quranic text display
- **Performance**: Page-based data fetching to avoid loading entire Quran
- **Offline Capability**: Consider implementing caching for frequently accessed pages
- **Audio Integration**: Architecture supports future audio playback features

### Development Environment
- **Node.js**: Requires ≥18
- **React Native**: v0.73.6
- **TypeScript**: Full type coverage with custom type definitions
- **Android**: Min SDK 21, Target SDK 34
- **iOS**: Min version 15.6
- **UI Framework**: UI Kitten with Eva Design System

### Testing Strategy
- **Unit Tests**: Jest configuration for component and utility testing
- **Integration Tests**: Focus on Redux actions and API interactions
- **Platform Testing**: Test speech recognition on both Android and iOS devices
- **Type Safety**: TypeScript compilation serves as additional testing layer

