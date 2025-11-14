import React, {createContext, useContext, useState, useCallback, ReactNode} from 'react';

export interface LineSelectionContextType {
  selectedLineKeys: Set<string>;
  toggleLineSelection: (lineKey: string) => void;
  selectLine: (lineKey: string) => void;
  deselectLine: (lineKey: string) => void;
  clearSelections: () => void;
  isLineSelected: (lineKey: string) => boolean;
}

const LineSelectionContext = createContext<LineSelectionContextType | undefined>(
  undefined,
);

interface LineSelectionProviderProps {
  children: ReactNode;
}

/**
 * LineSelectionProvider - Provides line selection state management
 * Allows components to select/deselect lines by their lineKey
 */
export const LineSelectionProvider: React.FC<LineSelectionProviderProps> = ({
  children,
}) => {
  const [selectedLineKeys, setSelectedLineKeys] = useState<Set<string>>(new Set());

  const toggleLineSelection = useCallback((lineKey: string) => {
    setSelectedLineKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lineKey)) {
        newSet.delete(lineKey);
      } else {
        newSet.add(lineKey);
      }
      return newSet;
    });
  }, []);

  const selectLine = useCallback((lineKey: string) => {
    setSelectedLineKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(lineKey);
      return newSet;
    });
  }, []);

  const deselectLine = useCallback((lineKey: string) => {
    setSelectedLineKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(lineKey);
      return newSet;
    });
  }, []);

  const clearSelections = useCallback(() => {
    setSelectedLineKeys(new Set());
  }, []);

  const isLineSelected = useCallback(
    (lineKey: string) => {
      return selectedLineKeys.has(lineKey);
    },
    [selectedLineKeys],
  );

  const value: LineSelectionContextType = {
    selectedLineKeys,
    toggleLineSelection,
    selectLine,
    deselectLine,
    clearSelections,
    isLineSelected,
  };

  return (
    <LineSelectionContext.Provider value={value}>
      {children}
    </LineSelectionContext.Provider>
  );
};

/**
 * Hook to access line selection context
 * @throws Error if used outside LineSelectionProvider
 */
export const useLineSelection = (): LineSelectionContextType => {
  const context = useContext(LineSelectionContext);
  if (context === undefined) {
    throw new Error(
      'useLineSelection must be used within a LineSelectionProvider',
    );
  }
  return context;
};
