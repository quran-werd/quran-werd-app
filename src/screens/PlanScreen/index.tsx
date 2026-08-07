import React, {useCallback, useEffect} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import Typography from '../../components/shared/Typography';
import ScreenGlow from '../../components/shared/icons/ScreenGlow';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {spacing} from '../../styles/spacing';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  fetchRevisionPlan,
  generatePlan,
} from '../../features/RevisionPlan/revisionPlanAction';
import {
  selectRevisionPlan,
  selectRevisionPlanLoading,
} from '../../features/RevisionPlan/revisionPlanSlice';
import {selectTodayWerd} from '../../features/RevisionLog/revisionLogSlice';
import {toArabicNumerals} from '../../content';
import EmptyState from './components/EmptyState';
import CapacityGoalCard from './components/CapacityGoalCard';
import WerdCard from './components/WerdCard';
import {DEFAULT_CAPACITY} from './hooks/usePlanCapacity';

export default function PlanScreen() {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const plan = useAppSelector(selectRevisionPlan);
  const loading = useAppSelector(selectRevisionPlanLoading);
  const today = useAppSelector(selectTodayWerd);
  const insets = useSafeAreaInsets();

  const loadPlan = useCallback(() => {
    dispatch(fetchRevisionPlan());
  }, [dispatch]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const handleGenerate = () => {
    dispatch(generatePlan(DEFAULT_CAPACITY));
  };

  const awrad = plan?.awrad ?? [];

  if (!plan) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, {paddingTop: insets.top + spacing[16]}]}>
          <ScreenGlow
            style={styles.ambientGlow}
            width={200}
            height={60}
            stops={[
              {
                id: 'planHeaderGlow',
                cx: '50%',
                cy: '0%',
                rx: '50%',
                ry: '90%',
                opacity: 0.07,
              },
            ]}
          />
          <View style={styles.headerRow}>
            <Typography variant="subtitle" family="cairo" weight="bold">
              {t('plan.title')}
            </Typography>
          </View>
        </View>
        <EmptyState onGenerate={handleGenerate} loading={loading} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={awrad}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadPlan} />
        }
        ListHeaderComponent={
          <View>
            <View style={[styles.header, {paddingTop: insets.top + spacing[16]}]}>
              <ScreenGlow
                style={styles.ambientGlow}
                width={200}
                height={60}
                stops={[
                  {
                    id: 'planHeaderGlow',
                    cx: '50%',
                    cy: '0%',
                    rx: '50%',
                    ry: '90%',
                    opacity: 0.07,
                  },
                ]}
              />
              <View style={styles.headerRow}>
                <Typography variant="subtitle" family="cairo" weight="bold">
                  {t('plan.title')}
                </Typography>
                {awrad.length > 0 ? (
                  <Typography
                    family="cairo"
                    color="muted"
                    style={styles.werdCountLabel}>
                    {t('plan.werdCount', {n: toArabicNumerals(awrad.length)})}
                  </Typography>
                ) : null}
              </View>
            </View>

            <CapacityGoalCard />

            {awrad.length > 0 ? (
              <Typography family="cairo" style={styles.sectionLabel}>
                {t('plan.sectionLabel')}
              </Typography>
            ) : null}
          </View>
        }
        renderItem={({item, index}) => (
          <View style={styles.werdCardWrap}>
            <WerdCard
              werd={item}
              isToday={today?.werd?._id === item._id}
              index={index}
            />
          </View>
        )}
        ListFooterComponent={
          awrad.length > 0 ? (
            <View style={styles.summaryFooter}>
              <Typography
                family="cairo"
                align="center"
                style={styles.summaryText}>
                {t('plan.summaryDays', {n: toArabicNumerals(awrad.length)})}
              </Typography>
            </View>
          ) : null
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  list: {paddingBottom: spacing[24]},
  header: {
    paddingHorizontal: spacing[20],
    paddingBottom: spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorderSubtle,
  },
  ambientGlow: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  werdCountLabel: {
    fontSize: 11,
  },
  sectionLabel: {
    fontSize: 11,
    color: 'rgba(138,154,184,0.45)',
    letterSpacing: 0.04 * 11,
    paddingHorizontal: spacing[16] + spacing[4],
    paddingTop: spacing[16],
    marginBottom: spacing[8],
  },
  werdCardWrap: {
    paddingHorizontal: spacing[16],
    paddingBottom: spacing[6],
  },
  summaryFooter: {
    marginHorizontal: spacing[16],
    marginTop: spacing[16],
    paddingVertical: spacing[12],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(138,154,184,0.1)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(138,154,184,0.04)',
  },
  summaryText: {
    fontSize: 12,
    color: 'rgba(138,154,184,0.5)',
  },
});
