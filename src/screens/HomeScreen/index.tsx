import React, {useEffect, useCallback} from 'react';
import {View, StyleSheet, RefreshControl, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import Typography from '../../components/shared/Typography';
import ScreenGlow from '../../components/shared/icons/ScreenGlow';
import {colors} from '../../styles/colors';
import {spacing} from '../../styles/spacing';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchTodayWerd} from '../../features/RevisionSession/revisionSessionAction';
import {selectRevisionSessionLoading} from '../../features/RevisionSession/revisionSessionSlice';
import {fetchRevisionPlan} from '../../features/RevisionPlan/revisionPlanAction';
import GreetingHeader from './components/GreetingHeader';
import TodayWerdCard from './components/TodayWerdCard';

export default function HomeScreen() {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectRevisionSessionLoading);
  const insets = useSafeAreaInsets();

  const loadHome = useCallback(() => {
    dispatch(fetchTodayWerd());
    dispatch(fetchRevisionPlan());
  }, [dispatch]);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  return (
    <View style={styles.container}>
      <ScreenGlow
        style={StyleSheet.absoluteFillObject}
        stops={[
          {id: 'homeGlow', cx: '50%', cy: '0%', rx: '60%', ry: '50%', opacity: 0.07},
        ]}
      />
      <ScrollView
        contentContainerStyle={[styles.content, {paddingTop: insets.top}]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadHome} />
        }>
        <GreetingHeader />

        <View style={styles.divider} />

        <Typography family="cairo" color="muted" style={styles.werdLabel}>
          {t('home.title')}
        </Typography>

        <TodayWerdCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {paddingBottom: spacing[24]},
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing[28],
  },
  werdLabel: {
    fontSize: 14,
    letterSpacing: 0.08 * 14,
    paddingHorizontal: spacing[28],
    marginTop: spacing[16],
    marginBottom: spacing[12],
  },
});
