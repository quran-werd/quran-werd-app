import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {Icon, Button} from '@ui-kitten/components';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../styles/colors';
import {totalPagesCount, getSurahPages} from '../../../content';
import {surah} from '../../../content/surah_data';

interface JumpSheetProps {
  visible: boolean;
  onClose: () => void;
  onJumpToChapter: (chapterNumber: number) => void;
  onJumpToPage: (pageNumber: number) => void;
}

const CloseIcon = (props: any) => <Icon {...props} name="close-outline" />;

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
        t('memorization.selection.jumpInvalid', 'Invalid input'),
        t(
          'memorization.selection.jumpInvalidMessage',
          `Please enter a valid page number (1-${totalPagesCount})`,
        ),
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
      return surah;
    }

    const query = searchQuery.toLowerCase().trim();
    return surah.filter(
      chapter =>
        chapter.arabic.includes(query) || chapter.id.toString().includes(query),
    );
  }, [searchQuery]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.overlayPressable} onPress={onClose} />
        <View style={styles.container}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {t('memorization.selection.jumpTitle', 'Jump to Page or Chapter')}
            </Text>
            <Button
              appearance="ghost"
              status="basic"
              accessoryLeft={CloseIcon}
              onPress={onClose}
              style={styles.closeButton}
              size="small"
            />
          </View>

          {/* Page number input section */}
          <View style={styles.pageInputSection}>
            <Text style={styles.sectionTitle}>
              {t('memorization.selection.jumpToPage', 'Jump to Page')}
            </Text>
            <View style={styles.pageInputContainer}>
              <TextInput
                style={styles.pageInput}
                value={pageInput}
                onChangeText={setPageInput}
                placeholder={t(
                  'memorization.selection.jumpPagePlaceholder',
                  `Enter page number (1-${totalPagesCount})`,
                )}
                placeholderTextColor={colors.text.light}
                keyboardType="number-pad"
                onSubmitEditing={handlePageJump}
              />
              <Pressable style={styles.goButton} onPress={handlePageJump}>
                <Text style={styles.goButtonText}>
                  {t('memorization.selection.go', 'Go')}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Chapter search and list section */}
          <View style={styles.chaptersSection}>
            <Text style={styles.sectionTitle}>
              {t('memorization.selection.selectChapter', 'Select Chapter')}
            </Text>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t(
                'memorization.selection.searchChapter',
                'Search chapters...',
              )}
              placeholderTextColor={colors.text.light}
            />
            <ScrollView
              style={styles.chaptersList}
              contentContainerStyle={styles.chaptersListContent}>
              {filteredChapters.map(chapter => {
                const surahPages = getSurahPages(chapter.id);
                const startPage = surahPages.length > 0 ? surahPages[0] : null;

                return (
                  <Pressable
                    key={chapter.id}
                    style={styles.chapterItem}
                    onPress={() => handleChapterPress(chapter.id)}>
                    <View style={styles.chapterInfo}>
                      <Text style={styles.chapterNumber}>{chapter.id}</Text>
                      <Text style={styles.chapterArabic}>{chapter.arabic}</Text>
                      {startPage && (
                        <Text style={styles.chapterPage}>{startPage}</Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayPressable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
  },
  pageInputSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'left',
  },
  pageInputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  pageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background,
    textAlign: 'right',
  },
  goButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  goButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  chaptersSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background,
    marginBottom: 12,
    textAlign: 'right',
  },
  chaptersList: {
    flex: 1,
  },
  chaptersListContent: {
    paddingBottom: 16,
  },
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  chapterNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    width: 32,
    textAlign: 'left',
  },
  chapterArabic: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'left',
  },
  chapterPage: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    textAlign: 'left',
  },
});
