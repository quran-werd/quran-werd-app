import React, {useEffect, useMemo} from 'react';
import {View} from 'react-native';
import Line from '../Line';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {RootState} from '../../store';
import {fetchVersesFullInfo} from '../../features/Page/pageAction';

const Page: React.FC<{pageNumber: number}> = ({pageNumber}) => {
  const {pages} = useAppSelector((state: RootState) => state.page);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (pages[pageNumber]) {
      return;
    }

    dispatch(fetchVersesFullInfo(pageNumber));
  }, [pageNumber]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        direction: 'rtl',
      }}>
      {pages[pageNumber]?.map((chapter, index) => (
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
