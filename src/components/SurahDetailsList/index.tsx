import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SectionHeader} from '../SectionHeader';
import SurahProgressCard from '../SurahProgressCard';
import {ServerMemorizationRanges} from '../../types/memorization.types';

interface SurahDetailsListProps {
  surahs: ServerMemorizationRanges;
  onToggleExpansion: (surahId: string) => void;
  style?: any;
}

export const SurahDetailsList: React.FC<SurahDetailsListProps> = ({
  surahs,
  onToggleExpansion,
  style,
}) => {
  const {t} = useTranslation();

  console.log(1111, 'SurahDetailsList', {surahs});

  return (
    <View style={[styles.section, style]}>
      <SectionHeader
        icon="📚"
        title={t('memorization.progress.surahDetails')}
      />
      {Object.keys(surahs).map(surahNumber => {
        const ranges = surahs[Number(surahNumber) as keyof typeof surahs];
        return (
          <SurahProgressCard
            key={surahNumber}
            surahNumber={Number(surahNumber)}
            ranges={ranges}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
});
