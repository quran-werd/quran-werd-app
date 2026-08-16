import React from 'react';
import {Modal, View, StyleSheet} from 'react-native';
import {BlurView} from 'expo-blur';
import {useTranslation} from 'react-i18next';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {shadows} from '../../styles/shadows';
import Typography from '../shared/Typography';
import Button from '../shared/Button';
import {useMushafLocalStore} from '../../hooks/useMushafLocalStore';
import {MushafLocalStoreProvider} from '../../services/mushafLocalStore';

interface MushafLocalStoreGateProps {
  children: React.ReactNode;
}

/**
 * Blocks app content behind a loading popup while the Mushaf Local Store is
 * being built (first launch, a resumed interrupted build, or a rebuild
 * triggered by a Mushaf data version bump). Once ready, renders children
 * with nothing further shown — this only gates first readiness, it doesn't
 * wrap the app permanently.
 */
export default function MushafLocalStoreGate({children}: MushafLocalStoreGateProps) {
  const {t} = useTranslation();
  const {store, isReady, progress, error, retry} = useMushafLocalStore();

  if (isReady && store) {
    return (
      <MushafLocalStoreProvider store={store}>
        {children}
      </MushafLocalStoreProvider>
    );
  }

  const totalPages = progress?.totalPages ?? 0;
  const pagesCompleted = progress?.pagesCompleted ?? 0;
  const percent =
    totalPages > 0 ? Math.round((pagesCompleted / totalPages) * 100) : 0;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <BlurView intensity={12} tint="dark" style={StyleSheet.absoluteFill} />
      </View>
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={[styles.card, shadows.deleteModal]}>
          <Typography
            variant="subtitle"
            family="amiri"
            weight="bold"
            align="center"
            style={styles.title}>
            {t('mushafStore.title')}
          </Typography>

          {error ? (
            <>
              <Typography color="muted" align="center" style={styles.message}>
                {t('mushafStore.error')}
              </Typography>
              <Button
                title={t('common.retry')}
                onPress={retry}
                style={styles.retryButton}
                fullWidth
              />
            </>
          ) : (
            <>
              <Typography color="muted" align="center" style={styles.message}>
                {t('mushafStore.downloading', {percent})}
              </Typography>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, {width: `${percent}%`}]} />
              </View>
              <Typography variant="label" color="dimmed" align="center">
                {t('mushafStore.pagesCount', {
                  completed: pagesCompleted,
                  total: totalPages,
                })}
              </Typography>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.modalBackdrop,
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: radius.xl,
    backgroundColor: colors.card,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 16,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  retryButton: {
    marginTop: 4,
  },
});
