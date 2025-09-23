import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {PageTypes} from '../../types/page.types';
import Line from '../Line';
import {StyleSheet, Text, View} from 'react-native';
import {APITypes} from '../../types/api.types';
import {fetchChapterInfo} from '../../features/Chapter/chapterAction';

interface IProps {
  chapter: PageTypes.Chapter;
}

export default function Chapter({chapter}: IProps) {
  const [info, setInfo] = useState<APITypes.Chapter>({} as APITypes.Chapter);
  const {chapterNumber, lines} = chapter;
  const {t} = useTranslation();

  async function getChapterInfo() {
    const chapterInfo = await fetchChapterInfo(chapterNumber);
    chapterInfo && setInfo(chapterInfo);
  }

  useEffect(() => {
    getChapterInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.chapterName}>{info.name_arabic}</Text>
      {info.bismillah_pre && (
        <Text style={styles.basmala}>{t('memorization.surah.bismillah')}</Text>
      )}
      {lines.map(line => (
        <Line key={line.lineNumber} line={line} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chapterName: {
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#aaa',
    fontFamily: 'ScheherazadeNew-Regular',
  },
  basmala: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'ScheherazadeNew-Regular',
  },
});
