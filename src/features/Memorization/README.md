# Memorization Progress Feature

This feature provides a comprehensive memorization progress tracking system for the Quran app.

## Components

### MemorizationProgress Screen

- Main screen displaying overall memorization progress
- Shows completed and in-progress surahs
- Displays detailed surah progress with expandable ranges
- Recent activity tracking

### ProgressCard Component

- Reusable card component for displaying progress metrics
- Supports icons, percentages, and custom styling
- Used for main progress display and summary cards

### SurahProgressCard Component

- Displays individual surah memorization progress
- Expandable to show memorized verse ranges
- Shows Arabic and English surah names
- Displays progress percentage and verse counts

### MemorizedRangeItem Component

- Shows specific memorized verse ranges within a surah
- Displays Arabic text snippets for start and end verses
- Shows word and verse counts for each range

## State Management

### Redux Slice

- `memorizationSlice.ts` - Manages memorization progress state
- Actions for toggling surah expansion, updating progress
- Sample data included for development

### Types

- `memorization.types.ts` - TypeScript interfaces for all memorization data
- Includes SurahProgress, MemorizedRange, and MemorizationProgress types

## Color Palette

- Primary: #6B9080 (Dark green)
- Secondary: #A4C3B2 (Medium green)
- Light: #CCE3DE (Light green)
- Background: #EAF4F4 (Very light green)
- White: #F6FFF8 (Off-white)

## Usage

The memorization progress screen is accessible via the bottom tab navigation with the "التقدم" (Progress) tab. Users can:

1. View overall memorization progress
2. See completed and in-progress surah counts
3. Expand individual surahs to see detailed memorized ranges
4. Track recent review activity

## Future Enhancements

- Add ability to mark verses as memorized
- Implement progress persistence
- Add review scheduling
- Include memorization streaks and statistics
