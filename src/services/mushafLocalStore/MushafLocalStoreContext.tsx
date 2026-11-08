import React, {createContext, useContext} from 'react';
import {MushafLocalStoreData} from '../../types/mushaf-local-store.types';

const MushafLocalStoreContext = createContext<MushafLocalStoreData | null>(null);

interface MushafLocalStoreProviderProps {
  store: MushafLocalStoreData;
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
 * Reads the built Mushaf Local Store. Must be used under
 * MushafLocalStoreProvider — in practice, anywhere under
 * MushafLocalStoreGate once it's finished loading, since the gate doesn't
 * render its children until the store is ready.
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
