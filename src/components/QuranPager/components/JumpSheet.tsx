import React, {useState, useMemo} from 'react';
import {View, StyleSheet, Pressable, ScrollView, TextInput, Alert} from 'react-native';
import Svg, {Path, Circle} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
import BottomSheet from '../../shared/BottomSheet';
import Typography from '../../shared/Typography';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {totalPagesCount, getSurahPages, toArabicNumerals} from '../../../content';
import {SURAHS_INFO} from '../../../content/surah_data';

interface JumpSheetProps {
  visible: boolean;
  onClose: () => void;
  onJumpToChapter: (chapterNumber: number) => void;
  onJumpToPage: (pageNumber: number) => void;
}

function SearchIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={colors.mutedForeground} strokeWidth={1.5} />
      <Path
        d="m20 20-3.5-3.5"
        stroke={colors.mutedForeground}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Bottom sheet component for jumping to a chapter or page
 */
export const JumpSheet: React.FC<JumpSheetProps> = ({
  visible,
  onClose,
  onJumpToChapter,
  onJumpToPage,
}) => {
  const {t} = useTranslation();
  const [pageInput, setPageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handlePageJump = () => {
    const pageNum = parseInt(pageInput.trim(), 10);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPagesCount) {
      Alert.alert(
        t('memorization.selection.jumpInvalid'),
        t('memorization.selection.jumpInvalidMessage'),
      );
      return;
    }

    onJumpToPage(pageNum);
    setPageInput('');
  };

  const handleChapterPress = (chapterNumber: number) => {
    onJumpToChapter(chapterNumber);
  };

  // Filter chapters based on search query
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) {
      return SURAHS_INFO;
    }

    const query = searchQuery.toLowerCase().trim();
    return SURAHS_INFO.filter(
      chapter =>
        chapter.arabic.includes(query) || chapter.id.toString().includes(query),
    );
  }, [searchQuery]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={t('memorization.selection.jumpTitle')}>
      <View style={styles.pageInputSection}>
        <Typography variant="caption" color="muted" style={styles.sectionTitle}>
          {t('memorization.selection.jumpToPage')}
        </Typography>
        <View style={styles.pageInputRow}>
          <TextInput
            style={styles.pageInput}
            value={pageInput}
            onChangeText={setPageInput}
            placeholder={t('memorization.selection.jumpPagePlaceholder')}
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
            onSubmitEditing={handlePageJump}
          />
          <Pressable style={styles.goButton} onPress={handlePageJump}>
            <Typography variant="caption" family="cairo" weight="bold" style={styles.goButtonText}>
              {t('memorization.selection.go')}
            </Typography>
          </Pressable>
        </View>
      </View>

      <View style={styles.chaptersSection}>
        <View style={styles.searchInputContainer}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('memorization.selection.searchChapter')}
            placeholderTextColor={colors.mutedForeground}
          />
        </View>
        <ScrollView
          style={styles.chaptersList}
          contentContainerStyle={styles.chaptersListContent}
          showsVerticalScrollIndicator={false}>
          {filteredChapters.map(chapter => {
            const surahPages = getSurahPages(chapter.id);
            const startPage = surahPages.length > 0 ? surahPages[0] : null;

            return (
              <Pressable
                key={chapter.id}
                style={styles.chapterItem}
                onPress={() => handleChapterPress(chapter.id)}>
                <View style={styles.chapterBadge}>
                  <Typography variant="caption" family="cairo" weight="bold" color="primary">
                    {chapter.id}
                  </Typography>
                </View>
                <View style={styles.chapterInfo}>
                  <Typography variant="body" family="amiriBold">
                    {chapter.arabic}
                  </Typography>
                  {startPage ? (
                    <Typography variant="caption" color="muted">
                      {t('quran.ayahCountShort', {value: toArabicNumerals(chapter.aya)})}
                      {' - '}
                      {t('quran.pageShort', {page: toArabicNumerals(startPage)})}
                    </Typography>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  pageInputSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  pageInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    fontSize: 14,
    color: colors.foreground,
    backgroundColor: colors.secondary,
    textAlign: 'right',
  },
  goButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    borderRadius: radius.xl,
    justifyContent: 'center',
  },
  goButtonText: {
    color: colors.background,
  },
  chaptersSection: {
    paddingHorizontal: 20,
    maxHeight: 380,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.foreground,
  },
  chaptersList: {
    flexGrow: 0,
  },
  chaptersListContent: {
    paddingBottom: 16,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radius.xl,
    marginBottom: 8,
  },
  chapterBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.goldWashSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterInfo: {
    flex: 1,
    gap: 2,
  },
});
