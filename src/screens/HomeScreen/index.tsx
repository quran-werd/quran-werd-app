import React, {useEffect, useCallback, useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Typography from '../../components/shared/Typography';
import Button from '../../components/shared/Button';
import {colors} from '../../styles/colors';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchTodayWerd} from '../../features/RevisionLog/revisionLogAction';
import {
  selectTodayWerd,
  selectRevisionLogLoading,
} from '../../features/RevisionLog/revisionLogSlice';
import {fetchRevisionPlan} from '../../features/RevisionPlan/revisionPlanAction';
import {selectRevisionPlan} from '../../features/RevisionPlan/revisionPlanSlice';
import {getSurahNameArabic} from '../../content';
import {
  loadNotificationTime,
  type NotificationTime,
} from '../../utils/storage/notification.storage';
import {
  formatNotificationTime,
  getNextWerdInPlan,
} from '../../utils/nextWerd.utils';

export default function HomeScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const today = useAppSelector(selectTodayWerd);
  const plan = useAppSelector(selectRevisionPlan);
  const loading = useAppSelector(selectRevisionLogLoading);
  const [reminderTime, setReminderTime] = useState<NotificationTime | null>(
    null,
  );

  const loadReminderTime = useCallback(async () => {
    const time = await loadNotificationTime();
    setReminderTime(time);
  }, []);

  const loadHome = useCallback(() => {
    dispatch(fetchTodayWerd());
    dispatch(fetchRevisionPlan());
    loadReminderTime();
  }, [dispatch, loadReminderTime]);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  useFocusEffect(
    useCallback(() => {
      loadReminderTime();
    }, [loadReminderTime]),
  );

  const werd = today?.werd;
  const status = today?.status || 'pending';

  const nextWerd = useMemo(() => {
    if (!werd || !plan?.awrad.length) {
      return null;
    }
    const next = getNextWerdInPlan(plan.awrad, werd);
    if (!next || next._id === werd._id) {
      return null;
    }
    return next;
  }, [werd, plan?.awrad]);

  const statusLabel = {
    pending: t('home.statusPending'),
    completed: t('home.statusCompleted'),
    skipped: t('home.statusSkipped'),
  }[status];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadHome} />
        }>
        <Typography variant="h1">{t('home.title')}</Typography>
        <Typography variant="body" color="secondary">
          {t('home.subtitle')}
        </Typography>

        {loading && !today ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : werd ? (
          <>
            <View style={styles.card}>
              <Typography variant="h2">
                {getSurahNameArabic(werd.surah)}
              </Typography>
              <Typography variant="body">
                {t('home.range', {from: werd.range.from, to: werd.range.to})}
              </Typography>
              <Typography variant="caption" color="secondary">
                {t('home.status', {status: statusLabel})}
              </Typography>
              {status === 'pending' && (
                <Button
                  title={t('home.startRevision')}
                  onPress={() =>
                    navigation.navigate('Revision', {werdId: werd._id})
                  }
                  fullWidth
                  style={styles.button}
                />
              )}
            </View>

            {nextWerd ? (
              <View style={styles.card}>
                <Typography variant="h2">{t('home.nextWerdTitle')}</Typography>
                <Typography variant="caption" color="secondary">
                  {t('home.nextWerdSubtitle')}
                </Typography>
                <Typography variant="body">
                  {getSurahNameArabic(nextWerd.surah)}
                </Typography>
                <Typography variant="body">
                  {t('home.range', {
                    from: nextWerd.range.from,
                    to: nextWerd.range.to,
                  })}
                </Typography>
              </View>
            ) : null}

            {reminderTime ? (
              <Typography variant="caption" color="secondary" align="center">
                {t('home.reminderTime', {
                  time: formatNotificationTime(reminderTime),
                })}
              </Typography>
            ) : null}
          </>
        ) : (
          <View style={styles.card}>
            <Typography variant="body">{t('home.noWerd')}</Typography>
            <Button
              title={t('home.addMemorization')}
              onPress={() => navigation.navigate('MemorizationStack')}
              variant="outline"
              fullWidth
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: 24, gap: 16},
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    gap: 8,
    marginTop: 16,
  },
  button: {marginTop: 16},
});
