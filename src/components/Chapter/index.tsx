import React, {useEffect, useState} from 'react';
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

  async function getChapterInfo() {
    const chapterInfo = await fetchChapterInfo(chapterNumber);
    chapterInfo && setInfo(chapterInfo);
  }

  useEffect(() => {
    getChapterInfo();
  }, []);

  return (
    <View>
      <Text style={styles.chapterName}>{info.name_arabic}</Text>
      {info.bismillah_pre && (
        <Text style={styles.basmala}>{`بسم الله الرحمن الرحيم`}</Text>
      )}
      {lines.map(line => (
        <Line key={line.lineNumber} line={line} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chapterName: {
    fontSize: 32,
    textAlign: 'center',
    backgroundColor: '#aaa',
  },
  basmala: {
    fontSize: 32,
    textAlign: 'center',
  },
});
