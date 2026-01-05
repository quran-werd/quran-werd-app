import React, {useCallback} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import QuranPager from '../../components/QuranPager';
import {MemorizationSelectionProps as RouteProps} from '../../routes/MemorizationStack';
import {SaveMemorizationRange} from '../../types/memorization.types';
import {saveMemorization} from '../../features/Memorization/memorizationAction';
import {useAppDispatch} from '../../store/hooks';

interface MemorizationSelectionScreenProps extends RouteProps {
  // Additional props if needed
}

/**
 * Memorization Selection Screen
 * Allows users to select verse ranges for memorization tracking
 * Uses QuranPager with selectionMode enabled
 */
export default function MemorizationSelection({
  route,
}: MemorizationSelectionScreenProps) {
  const initialPage = route.params?.initialPage || 1;
  const dispatch = useAppDispatch();

  const handleSave = useCallback(
    async (ranges: SaveMemorizationRange[]) => {
      await dispatch(saveMemorization(ranges)).unwrap();
    },
    [dispatch],
  );

  return (
    <SafeAreaView style={styles.container}>
      <QuranPager
        initialPage={initialPage}
        fontSize={22}
        showHeader={true}
        selectionMode={true}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
