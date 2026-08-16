import React, {useCallback, useEffect, useMemo} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import Typography from '../../components/shared/Typography';
import ScreenTitle from '../../components/shared/ScreenTitle';
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
import {toArabicNumerals} from '../../content';
import EmptyState from './components/EmptyState';
import CapacityGoalCard from './components/CapacityGoalCard';
import WerdCard from './components/WerdCard';
import CompletedWerdRow from './components/CompletedWerdRow';
import {DEFAULT_CAPACITY} from './hooks/usePlanCapacity';
import type {Werd, CompletedWerd} from '../../services/revisionPlan.service';

type PlanListItem =
  | {kind: 'sectionHeader'; key: string; label: string}
  | {kind: 'completed'; werd: CompletedWerd}
  | {kind: 'incomplete'; werd: Werd; isToday: boolean};

export default function PlanScreen() {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const plan = useAppSelector(selectRevisionPlan);
  const loading = useAppSelector(selectRevisionPlanLoading);
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

  const completedAwrad = useMemo(() => plan?.completedAwrad ?? [], [plan]);
  const incompleteAwrad = useMemo(() => plan?.incompleteAwrad ?? [], [plan]);

  const items = useMemo<PlanListItem[]>(() => {
    const list: PlanListItem[] = [];
    if (completedAwrad.length > 0) {
      list.push({
        kind: 'sectionHeader',
        key: 'header-completed',
        label: t('plan.completedSectionLabel'),
      });
      completedAwrad.forEach(werd => list.push({kind: 'completed', werd}));
    }
    if (incompleteAwrad.length > 0) {
      list.push({
        kind: 'sectionHeader',
        key: 'header-incomplete',
        label: t('plan.sectionLabel'),
      });
      incompleteAwrad.forEach((werd, index) =>
        list.push({kind: 'incomplete', werd, isToday: index === 0}),
      );
    }
    return list;
  }, [completedAwrad, incompleteAwrad, t]);

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
            <ScreenTitle>{t('plan.title')}</ScreenTitle>
          </View>
        </View>
        <EmptyState onGenerate={handleGenerate} loading={loading} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item =>
          item.kind === 'sectionHeader' ? item.key : item.werd._id
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadPlan} />
        }
        ListHeaderComponent={
          <View>
            <View
              style={[styles.header, {paddingTop: insets.top + spacing[16]}]}>
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
                <ScreenTitle>{t('plan.title')}</ScreenTitle>
                {incompleteAwrad.length > 0 ? (
                  <Typography
                    family="cairo"
                    color="muted"
                    style={styles.werdCountLabel}>
                    {t('plan.werdCount', {
                      n: toArabicNumerals(incompleteAwrad.length),
                    })}
                  </Typography>
                ) : null}
              </View>
            </View>

            <CapacityGoalCard />
          </View>
        }
        renderItem={({item, index}) => {
          if (item.kind === 'sectionHeader') {
            return (
              <Typography family="cairo" style={styles.sectionLabel}>
                {item.label}
              </Typography>
            );
          }
          if (item.kind === 'completed') {
            return (
              <View style={styles.werdCardWrap}>
                <CompletedWerdRow werd={item.werd} />
              </View>
            );
          }
          return (
            <View style={styles.werdCardWrap}>
              <WerdCard
                werd={item.werd}
                isToday={item.isToday}
                completedCount={completedAwrad.length}
                index={index}
              />
            </View>
          );
        }}
        ListFooterComponent={
          incompleteAwrad.length > 0 ? (
            <View style={styles.summaryFooter}>
              <Typography
                family="cairo"
                align="center"
                style={styles.summaryText}>
                {t('plan.summaryDays', {
                  n: toArabicNumerals(incompleteAwrad.length),
                })}
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
