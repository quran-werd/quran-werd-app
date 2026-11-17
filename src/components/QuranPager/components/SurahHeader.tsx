import React, {useState} from 'react';
import {View, Text, StyleSheet, LayoutChangeEvent} from 'react-native';
import {colors} from '../../../styles/colors';

// Both fonts come from QUL (qul.tarteel.ai) and are loaded in App.tsx:
// - SurahHeaderFrame (quran-common.ttf): U+E000 is the ornamental Madani
//   Mushaf surah header frame, 8240 units wide with a 1024-unit em.
// - SurahNames (surah-name-v4.ttf): U+E000 is "سورة" and U+E000 + n is the
//   calligraphic name of surah n (1..114).
const FRAME_GLYPH = String.fromCharCode(0xe000);
const FRAME_ADVANCE = 8240;
const UNITS_PER_EM = 1024;
// Name size relative to the frame's font size, so it sits inside the middle
// panel of the frame.
const NAME_SCALE = 0.52;

function surahNameGlyphs(chapterId: number) {
  // The glyphs are Private Use characters (laid out left-to-right), so put
  // the surah name first and "سورة" second to read correctly right-to-left.
  return `${String.fromCharCode(0xe000 + chapterId)} ${String.fromCharCode(0xe000)}`;
}

export default function SurahHeader({chapterId}: {chapterId: number}) {
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.floor(e.nativeEvent.layout.width);
    if (w !== width) {
      setWidth(w);
    }
  };

  // Font size that makes the frame glyph span the full width; the font's
  // line box (ascent + descent = 1 em) then matches the frame's height.
  const frameSize = (width * UNITS_PER_EM) / FRAME_ADVANCE;
  const nameSize = frameSize * NAME_SCALE;

  return (
    <View
      style={[styles.container, {height: frameSize || 40}]}
      onLayout={onLayout}>
      {width > 0 ? (
        <>
          <Text
            allowFontScaling={false}
            style={[
              styles.frame,
              {fontSize: frameSize, lineHeight: frameSize},
            ]}>
            {FRAME_GLYPH}
          </Text>
          <View style={styles.nameWrap} pointerEvents="none">
            <Text
              allowFontScaling={false}
              style={[
                styles.name,
                {
                  fontSize: nameSize,
                  lineHeight: nameSize,
                  // The glyphs sit a little low in their line box.
                  marginTop: -nameSize * 0.1,
                },
              ]}>
              {surahNameGlyphs(chapterId)}
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
  },
  frame: {
    fontFamily: 'SurahHeaderFrame',
    color: colors.mushafBrown,
    includeFontPadding: false,
    writingDirection: 'ltr',
    textAlign: 'center',
  },
  nameWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'SurahNames',
    color: colors.mushafText,
    includeFontPadding: false,
    writingDirection: 'ltr',
    textAlign: 'center',
  },
});
