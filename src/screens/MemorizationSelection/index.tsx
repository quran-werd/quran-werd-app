import React, {useCallback} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import QuranPager from '../../components/QuranPager';
import {MemorizationSelectionProps as RouteProps} from '../../routes/MemorizationStack';
import {MemorizedRange} from '../../types/memorization.types';

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
  navigation,
}: MemorizationSelectionScreenProps) {
  const initialPage = route.params?.initialPage || 1;

  const handleSave = useCallback(
    (ranges: MemorizedRange[]) => {
      // TODO: Replace with actual API call when backend is ready
      console.log('Saving memorization ranges:', ranges);
      // After saving, navigate back
      navigation.goBack();
    },
    [navigation],
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

