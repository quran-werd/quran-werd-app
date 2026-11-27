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
import {useAppSelector} from '../../store/hooks';
import {selectIsAuthenticated} from '../../features/Auth/authSlice';
import {toArabicNumerals} from '../../content';
import {QCF_TOTAL_PAGES} from '../../services/qcfFonts/constants';

interface MushafLocalStoreGateProps {
  children: React.ReactNode;
}

/**
 * Builds the Mushaf Local Store in the background as soon as the app starts
 * (first launch, a resumed interrupted build, or a rebuild after a Mushaf
 * data version bump). The app is always rendered: on the login page the
 * download runs silently, and only once the user is signed in does a
 * progress popup cover the app until the pages are ready.
 */
export default function MushafLocalStoreGate({
  children,
}: MushafLocalStoreGateProps) {
  const {t} = useTranslation();
  const {store, isReady, progress, error, retry} = useMushafLocalStore();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const totalPages = progress?.totalPages ?? 0;
  const pagesCompleted = progress?.pagesCompleted ?? 0;
  // Fonts download right after the page data, so the bar covers both.
  const totalFonts = progress?.totalFonts ?? QCF_TOTAL_PAGES;
  const fontsCompleted = progress?.fontsCompleted ?? 0;
  const isDownloadingFonts = progress?.phase === 'downloading-fonts';
  const totalWork = totalPages + totalFonts;
  const percent =
    totalPages > 0
      ? Math.round(((pagesCompleted + fontsCompleted) / totalWork) * 100)
      : 0;

  return (
    <MushafLocalStoreProvider store={store}>
      {children}
      <Modal
        visible={isAuthenticated && !isReady}
        transparent
        animationType="fade">
        <View style={styles.backdrop}>
          <BlurView
            intensity={12}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
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
                  {t(
                    isDownloadingFonts
                      ? 'mushafStore.downloadingFonts'
                      : 'mushafStore.downloading',
                    {percent},
                  )}
                </Typography>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, {width: `${percent}%`}]} />
                </View>
                <Typography variant="label" color="dimmed" align="center">
                  {isDownloadingFonts
                    ? t('mushafStore.fontsCount', {
                        completed: toArabicNumerals(fontsCompleted),
                        total: toArabicNumerals(totalFonts),
                      })
                    : t('mushafStore.pagesCount', {
                        completed: toArabicNumerals(pagesCompleted),
                        total: toArabicNumerals(totalPages),
                      })}
                </Typography>
              </>
            )}
          </View>
        </View>
      </Modal>
    </MushafLocalStoreProvider>
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
    width: '80%',
    maxWidth: 320,
    borderRadius: radius.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.goldBorderStrong,
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
