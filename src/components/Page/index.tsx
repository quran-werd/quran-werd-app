import React, {useMemo} from 'react';
import {View} from 'react-native';
import Line from '../Line';
import {useAppSelector} from '../../store/hooks';
import {RootState} from '../../store';

const Page: React.FC<{pageNumber: number}> = ({pageNumber}) => {
  const {pages} = useAppSelector((state: RootState) => state.page);
  const page = useMemo(() => pages[pageNumber], [pageNumber]);

  return (
    <View style={{flex: 1}}>
      {page.map((chapter, index) => (
        <View key={`${chapter.chapterNumber}-${index}`}>
          {chapter.lines.map((line, lineIndex) => (
            <Line key={`${line.lineNumber}-${lineIndex}`} line={line} />
          ))}
        </View>
      ))}
    </View>
  );
};

export default Page;
