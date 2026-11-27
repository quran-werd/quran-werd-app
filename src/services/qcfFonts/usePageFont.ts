import {useEffect, useState} from 'react';
import {
  ensurePageFontLoaded,
  getQcfFontFamily,
  isPageFontLoaded,
  subscribeToPageFontLoads,
} from './qcfFontStore';
import {QCF_TOTAL_PAGES} from './constants';

/** How many pages on each side of the visible one to warm up. */
const NEIGHBOR_PAGES = 1;

interface UsePageFontResult {
  fontFamily: string;
  isReady: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Loads a page's QCF font (downloading it first, ahead of the background
 * queue, if needed) and warms up its neighbours so swiping doesn't stall.
 */
export function usePageFont(pageNumber: number): UsePageFontResult {
  const [isReady, setIsReady] = useState(() => isPageFontLoaded(pageNumber));
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setError(null);
    setIsReady(isPageFontLoaded(pageNumber));

    const unsubscribe = subscribeToPageFontLoads(loaded => {
      if (active && loaded === pageNumber) {
        setIsReady(true);
      }
    });

    ensurePageFontLoaded(pageNumber)
      .then(() => {
        if (active) {
          setIsReady(true);
        }
      })
      .catch(err => {
        if (active) {
          setError(err instanceof Error ? err.message : String(err));
        }
      })
      .finally(() => {
        for (let offset = 1; offset <= NEIGHBOR_PAGES; offset++) {
          for (const neighbor of [pageNumber + offset, pageNumber - offset]) {
            if (neighbor >= 1 && neighbor <= QCF_TOTAL_PAGES) {
              ensurePageFontLoaded(neighbor).catch(() => {});
            }
          }
        }
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [pageNumber, attempt]);

  return {
    fontFamily: getQcfFontFamily(pageNumber),
    isReady,
    error,
    retry: () => setAttempt(current => current + 1),
  };
}
