import React, {createContext, useContext} from 'react';
import {MushafLocalStoreData} from '../../types/mushaf-local-store.types';

const MushafLocalStoreContext = createContext<MushafLocalStoreData | null>(null);

interface MushafLocalStoreProviderProps {
  store: MushafLocalStoreData | null;
  children: React.ReactNode;
}

export const MushafLocalStoreProvider: React.FC<MushafLocalStoreProviderProps> = ({
  store,
  children,
}) => (
  <MushafLocalStoreContext.Provider value={store}>
    {children}
  </MushafLocalStoreContext.Provider>
);

/**
 * Reads the Mushaf Local Store, or null while it is still being built. The
 * gate renders the app before the store is ready (the build runs in the
 * background on the login page), so screens can mount before it exists.
 */
export const useOptionalMushafLocalStoreData =
  (): MushafLocalStoreData | null => useContext(MushafLocalStoreContext);

/**
 * Reads the built Mushaf Local Store. Throws if it isn't ready yet — only
 * use it below a component that has checked
 * useOptionalMushafLocalStoreData first.
 */
export const useMushafLocalStoreData = (): MushafLocalStoreData => {
  const store = useContext(MushafLocalStoreContext);
  if (!store) {
    throw new Error(
      'useMushafLocalStoreData must be used within MushafLocalStoreProvider',
    );
  }
  return store;
};
