import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SectionHeader} from '../SectionHeader';
import SurahProgressCard from '../SurahProgressCard';
import {MemorizationVerseRange} from '../../types/memorization.types';

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

  const handleDelete = (surah: number, range: MemorizationVerseRange) => {
    Alert.alert(t('memorization.delete.title'), t('memorization.delete.message'), [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => onDeleteRange?.(surah, range),
      },
    ]);
  };

  return (
    <View style={[styles.section, style]}>
      <SectionHeader
        icon="📚"
        title={t('memorization.progress.surahDetails')}
      />
      {Object.keys(surahs).map(surahNumber => {
        const ranges = surahs[surahNumber] || [];
        return (
          <SurahProgressCard
            key={surahNumber}
            surahNumber={Number(surahNumber)}
            ranges={ranges}
            onDeleteRange={
              onDeleteRange
                ? range => handleDelete(Number(surahNumber), range)
                : undefined
            }
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {marginBottom: 28},
});
