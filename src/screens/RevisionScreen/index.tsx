import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute} from '@react-navigation/native';
import Animated, {ZoomIn} from 'react-native-reanimated';
import QuranPager from '../../components/QuranPager';
import Button from '../../components/shared/Button';
import {colors} from '../../styles/colors';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  completeWerd,
  fetchCurrentWerd,
} from '../../features/RevisionSession/revisionSessionAction';
import {
  selectRevisionSessionCurrent,
  selectRevisionSessionLoading,
} from '../../features/RevisionSession/revisionSessionSlice';
import {getPageForVerse} from '../../content';

export default function RevisionScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const current = useAppSelector(selectRevisionSessionCurrent);
  const loading = useAppSelector(selectRevisionSessionLoading);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const insets = useSafeAreaInsets();

  const paramWerd = useMemo(
    () =>
      route.params?.werdId && route.params?.surah && route.params?.range
        ? {
            _id: route.params.werdId as string,
            surah: route.params.surah as number,
            range: route.params.range as {from: number; to: number},
          }
        : null,
    [route.params?.werdId, route.params?.surah, route.params?.range],
  );

  const werd = paramWerd ?? current?.werd ?? null;
  const werdId = route.params?.werdId || werd?._id;

  useEffect(() => {
    if (!paramWerd && !current) {
      dispatch(fetchCurrentWerd());
    }
  }, [dispatch, paramWerd, current]);

  const startPage = useMemo(
    () => (werd ? getPageForVerse(werd.surah, werd.range.from) : null),
    [werd],
  );
  const lastPage = useMemo(
    () => (werd ? getPageForVerse(werd.surah, werd.range.to) : null),
    [werd],
  );

  const hasReachedWard = useMemo(() => {
    if (!lastPage || currentPage === null) {
      return false;
    }
    return currentPage >= lastPage;
  }, [currentPage, lastPage]);

  const handleComplete = useCallback(async () => {
    if (!werdId) {
      return;
    }
    await dispatch(completeWerd(werdId)).unwrap();
    await dispatch(fetchCurrentWerd()).unwrap();
    navigation.navigate('Home');
  }, [dispatch, werdId, navigation]);

  if (!werd || startPage === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QuranPager
        initialPage={startPage}
        fontSize={21}
        showHeader={true}
        selectionMode={false}
        onPageChange={setCurrentPage}
      />
      {hasReachedWard ? (
        <Animated.View
          entering={ZoomIn.stiffness(260).damping(20)}
          style={[styles.actions, {paddingBottom: 12 + insets.bottom}]}>
          <Button
            title={t('revision.complete')}
            onPress={handleComplete}
            loading={loading}
            fullWidth
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  actions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
