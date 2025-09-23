import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SectionHeader} from '../SectionHeader';
import SurahProgressCard from '../SurahProgressCard';
import {SurahProgress} from '../../types/memorization.types';

interface SurahDetailsListProps {
  surahs: SurahProgress[];
  onToggleExpansion: (surahId: string) => void;
  style?: any;
}

export const SurahDetailsList: React.FC<SurahDetailsListProps> = ({
  surahs,
  onToggleExpansion,
  style,
}) => {
  const {t} = useTranslation();

  return (
    <View style={[styles.section, style]}>
      <SectionHeader
        icon="📚"
        title={t('memorization.progress.surahDetails')}
      />
      {surahs.map(surah => (
        <SurahProgressCard
          key={surah.id}
          surah={surah}
          onToggleExpansion={onToggleExpansion}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
});
