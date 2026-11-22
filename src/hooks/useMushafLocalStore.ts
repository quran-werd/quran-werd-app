import {useCallback, useEffect, useRef, useState} from 'react';
import {buildMushafLocalStore} from '../services/mushafLocalStore';
import {
  MushafLocalStoreBuildProgress,
  MushafLocalStoreData,
} from '../types/mushaf-local-store.types';

interface UseMushafLocalStoreResult {
  store: MushafLocalStoreData | null;
  progress: MushafLocalStoreBuildProgress | null;
  isReady: boolean;
  isDownloading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Loads the Mushaf Local Store, running the first-launch (or resumed, or
 * version-bump-triggered) download build when it isn't ready yet.
 */
export function useMushafLocalStore(): UseMushafLocalStoreResult {
  const [store, setStore] = useState<MushafLocalStoreData | null>(null);
  const [progress, setProgress] = useState<MushafLocalStoreBuildProgress | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setError(null);

    buildMushafLocalStore({
      onProgress: nextProgress => {
        if (isMounted.current) {
          setProgress(nextProgress);
        }
      },
    })
      .then(result => {
        if (isMounted.current) {
          setStore(result);
        }
      })
      .catch(err => {
        if (isMounted.current) {
          setError(
            err instanceof Error ? err.message : 'Failed to prepare mushaf data',
          );
        }
      });
  }, [attempt]);

  const retry = useCallback(() => {
    setAttempt(current => current + 1);
  }, []);

  return {
    store,
    progress,
    isReady: store !== null,
    isDownloading: store === null && error === null,
    error,
    retry,
  };
}
