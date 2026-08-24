import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal';
import SurahProgressCard from '../SurahProgressCard';
import Typography from '../shared/Typography';
import {getSurahNameArabic, toArabicNumerals} from '../../content';
import {
  MemorizationVerseRange,
  ServerMemorizationRanges,
} from '../../types/memorization.types';

interface SurahDetailsListProps {
  surahs: ServerMemorizationRanges;
  onDeleteRange?: (surah: number, range: MemorizationVerseRange) => void;
  style?: object;
}

export const SurahDetailsList: React.FC<SurahDetailsListProps> = ({
  surahs,
  onDeleteRange,
  style,
}) => {
  const {t} = useTranslation();
  const [pendingDelete, setPendingDelete] = useState<{
    surah: number;
    range: MemorizationVerseRange;
  } | null>(null);

  const handleConfirmDelete = () => {
    if (pendingDelete) {
      onDeleteRange?.(pendingDelete.surah, pendingDelete.range);
    }
    setPendingDelete(null);
  };

  return (
    <View style={[styles.section, style]}>
      {Object.keys(surahs).map(surahNumber => {
        const ranges = surahs[surahNumber] || [];
        return (
          <SurahProgressCard
            key={surahNumber}
            surahNumber={Number(surahNumber)}
            ranges={ranges}
            onDeleteRange={
              onDeleteRange
                ? range => setPendingDelete({surah: Number(surahNumber), range})
                : undefined
            }
          />
        );
      })}

      <DeleteConfirmationModal
        visible={!!pendingDelete}
        title={t('memorization.delete.title')}
        message={
          pendingDelete ? (
            <>
              {t('memorization.delete.messagePrefix')}
              <Typography weight="semibold" color="primary">
                {' '}
                {toArabicNumerals(pendingDelete.range.from)} — {toArabicNumerals(pendingDelete.range.to)}{' '}
              </Typography>
              {t('memorization.delete.messageSuffix', {
                surah: getSurahNameArabic(pendingDelete.surah),
              })}
            </>
          ) : null
        }
        cancelLabel={t('memorization.delete.cancel')}
        confirmLabel={t('common.delete')}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {marginBottom: 28},
});
