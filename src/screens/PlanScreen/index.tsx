import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  RefreshControl,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Typography from '../../components/shared/Typography';
import Button from '../../components/shared/Button';
import {colors} from '../../styles/colors';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  fetchRevisionPlan,
  generatePlan,
  updateCapacity,
} from '../../features/RevisionPlan/revisionPlanAction';
import {
  selectRevisionPlan,
  selectRevisionPlanLoading,
  selectRevisionPlanError,
} from '../../features/RevisionPlan/revisionPlanSlice';
import {getSurahNameArabic} from '../../content';

export default function PlanScreen() {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const plan = useAppSelector(selectRevisionPlan);
  const loading = useAppSelector(selectRevisionPlanLoading);
  const error = useAppSelector(selectRevisionPlanError);
  const [capacity, setCapacity] = useState('20');

  const loadPlan = useCallback(() => {
    dispatch(fetchRevisionPlan());
  }, [dispatch]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  useEffect(() => {
    if (plan?.dailyCapacity) {
      setCapacity(String(plan.dailyCapacity));
    }
  }, [plan?.dailyCapacity]);

  const handleGenerate = () => {
    const value = parseInt(capacity, 10);
    if (value > 0) {
      dispatch(generatePlan(value));
    }
  };

  const handleUpdateCapacity = () => {
    const value = parseInt(capacity, 10);
    if (value > 0) {
      dispatch(updateCapacity(value));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={plan?.awrad || []}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadPlan} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Typography variant="h1">{t('plan.title')}</Typography>
            <Typography variant="body" color="secondary">
              {t('plan.subtitle')}
            </Typography>
            <Typography variant="caption">{t('plan.capacity')}</Typography>
            <TextInput
              style={styles.input}
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="number-pad"
            />
            <Button
              title={t('plan.generate')}
              onPress={handleGenerate}
              loading={loading}
              fullWidth
            />
            {plan ? (
              <Button
                title={t('plan.updateCapacity')}
                onPress={handleUpdateCapacity}
                variant="outline"
                loading={loading}
                fullWidth
                style={styles.updateButton}
              />
            ) : null}
            {error ? (
              <Typography variant="caption" color="secondary">
                {error}
              </Typography>
            ) : null}
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.werdItem}>
            <Typography variant="body">
              {t('plan.werdOrder', {order: item.order})} —{' '}
              {getSurahNameArabic(item.surah)} ({item.range.from}-{item.range.to})
            </Typography>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <Typography variant="body" color="secondary" align="center">
              {t('plan.empty')}
            </Typography>
          ) : null
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  list: {padding: 24, gap: 8},
  header: {gap: 12, marginBottom: 24},
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
    textAlign: 'right',
  },
  updateButton: {marginTop: 8},
  werdItem: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
});
