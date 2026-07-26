import React, {useCallback, useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, ActivityIndicator} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute} from '@react-navigation/native';
import QuranPager from '../../components/QuranPager';
import Button from '../../components/shared/Button';
import {colors} from '../../styles/colors';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  completeTodayWerd,
  skipTodayWerd,
  fetchTodayWerd,
} from '../../features/RevisionLog/revisionLogAction';
import {
  selectTodayWerd,
  selectRevisionLogLoading,
} from '../../features/RevisionLog/revisionLogSlice';

export default function RevisionScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const today = useAppSelector(selectTodayWerd);
  const loading = useAppSelector(selectRevisionLogLoading);

  const werd = today?.werd;
  const werdId = route.params?.werdId || werd?._id;

  useEffect(() => {
    if (!werd) {
      dispatch(fetchTodayWerd());
    }
  }, [dispatch, werd]);

  const handleComplete = useCallback(async () => {
    if (!werdId) {
      return;
    }
    await dispatch(completeTodayWerd(werdId)).unwrap();
    navigation.navigate('Home');
  }, [dispatch, werdId, navigation]);

  const handleSkip = useCallback(async () => {
    if (!werdId) {
      return;
    }
    await dispatch(skipTodayWerd(werdId)).unwrap();
    navigation.navigate('Home');
  }, [dispatch, werdId, navigation]);

  if (!werd) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <QuranPager
        initialPage={1}
        fontSize={22}
        showHeader={true}
        selectionMode={false}
      />
      <View style={styles.actions}>
        <Button
          title={t('revision.complete')}
          onPress={handleComplete}
          loading={loading}
          fullWidth
        />
        <Button
          title={t('revision.skip')}
          onPress={handleSkip}
          variant="outline"
          loading={loading}
          fullWidth
          style={styles.skipButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  actions: {
    padding: 16,
    gap: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  skipButton: {marginTop: 0},
});
