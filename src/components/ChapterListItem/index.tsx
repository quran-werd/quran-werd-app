import React from 'react';
import {View, StyleSheet} from 'react-native';
import {APITypes} from '../../types/api.types';
import {useNavigation} from '@react-navigation/native';
import {ChaptersProps} from '../../routes/ChaptersStack';
import Card from '../shared/Card';
import Typography from '../shared/Typography';
import Badge from '../shared/Badge';

interface IProps {
  chapter: APITypes.Chapter;
}

export default function ChapterListItem({chapter}: IProps) {
  const {
    id: chapterNumber,
    name_arabic,
    verses_count,
    revelation_place,
  } = chapter;

  const navigation = useNavigation<ChaptersProps['navigation']>();

  const handleChapterPress = () =>
    navigation.navigate('Page', {
      chapterNumber,
    });

  return (
    <Card
      onPress={handleChapterPress}
      padding={16}
      margin={4}
      borderRadius={12}>
      <View style={styles.content}>
        <Badge variant="light" size="medium">
          <Typography variant="small" weight="semibold" color="primary">
            {chapterNumber}
          </Typography>
        </Badge>

        <View style={styles.mainInfo}>
          <Typography variant="h3" color="primary" weight="semibold">
            {name_arabic}
          </Typography>
          <View style={styles.detailsRow}>
            <Typography variant="small" color="secondary">
              {revelation_place === 'makkah' ? 'مكية' : 'مدنية'}
            </Typography>
            <Typography variant="small" color="secondary">
              {verses_count} آية
            </Typography>
          </View>
        </View>
      </View>
    </Card>
  );
}
const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mainInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
