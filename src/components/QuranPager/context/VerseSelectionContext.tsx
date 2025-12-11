import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {VerseRange} from '../../../types/quran-pager.types';
import {
  splitRangeBySurah,
  parseVerseKey,
  getAllSelectedVerseKeys,
} from '../utils/verseSelection.utils';

export interface VerseSelectionContextType {
  ranges: VerseRange[];
  pendingStartVerse: string | null;
  addVerseRange: (startKey: string, endKey: string) => void;
  removeRange: (rangeId: string) => void;
  clearRanges: () => void;
  setPendingStartVerse: (verseKey: string | null) => void;
  getSelectedVerseKeys: () => Set<string>;
  isVerseSelected: (verseKey: string) => boolean;
}

const VerseSelectionContext = createContext<
  VerseSelectionContextType | undefined
>(undefined);

interface VerseSelectionProviderProps {
  children: ReactNode;
}

/**
 * VerseSelectionProvider - Provides verse range selection state management
 * Handles range creation with automatic splitting across surah boundaries
 */
export const VerseSelectionProvider: React.FC<VerseSelectionProviderProps> = ({
  children,
}) => {
  const [ranges, setRanges] = useState<VerseRange[]>([]);
  const [pendingStartVerse, setPendingStartVerseState] = useState<
    string | null
  >(null);

  const setPendingStartVerse = useCallback((verseKey: string | null) => {
    setPendingStartVerseState(verseKey);
  }, []);

  /**
   * Add a verse range, automatically splitting if it crosses surah boundaries
   */
  const addVerseRange = useCallback((startKey: string, endKey: string) => {
    const splitRanges = splitRangeBySurah(startKey, endKey);
    const startParsed = parseVerseKey(startKey);

    setRanges(prev => {
      const newRanges = [...prev];
      splitRanges.forEach(splitRange => {
        // Generate unique ID for the range
        const id = `${splitRange.startKey}-${
          splitRange.endKey
        }-${Date.now()}-${Math.random()}`;
        newRanges.push({
          id,
          startVerseKey: splitRange.startKey,
          endVerseKey: splitRange.endKey,
          surahId: splitRange.surahId,
          // If this is a cross-surah range, track the original start surah
          startSurahId:
            splitRange.surahId !== startParsed.chapterId
              ? startParsed.chapterId
              : undefined,
        });
      });
      return newRanges;
    });

    // Clear pending start after range is created
    setPendingStartVerseState(null);
  }, []);

  /**
   * Remove a range by ID
   */
  const removeRange = useCallback((rangeId: string) => {
    setRanges(prev => prev.filter(range => range.id !== rangeId));
  }, []);

  /**
   * Clear all ranges
   */
  const clearRanges = useCallback(() => {
    setRanges([]);
    setPendingStartVerseState(null);
  }, []);

  /**
   * Get all selected verse keys as a Set
   */
  const getSelectedVerseKeys = useCallback((): Set<string> => {
    return getAllSelectedVerseKeys(ranges);
  }, [ranges]);

  /**
   * Check if a verse is selected
   */
  const isVerseSelected = useCallback(
    (verseKey: string): boolean => {
      const selectedKeys = getSelectedVerseKeys();
      return selectedKeys.has(verseKey);
    },
    [getSelectedVerseKeys],
  );

  const value: VerseSelectionContextType = {
    ranges,
    pendingStartVerse,
    addVerseRange,
    removeRange,
    clearRanges,
    setPendingStartVerse,
    getSelectedVerseKeys,
    isVerseSelected,
  };

  return (
    <VerseSelectionContext.Provider value={value}>
      {children}
    </VerseSelectionContext.Provider>
  );
};

/**
 * Hook to access verse selection context
 * @throws Error if used outside VerseSelectionProvider
 */
export const useVerseSelection = (): VerseSelectionContextType => {
  const context = useContext(VerseSelectionContext);
  if (context === undefined) {
    throw new Error(
      'useVerseSelection must be used within a VerseSelectionProvider',
    );
  }
  return context;
};
