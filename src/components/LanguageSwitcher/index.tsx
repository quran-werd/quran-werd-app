import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useLanguage} from '../../hooks/useLanguage';
import {Typography} from '../shared';
import {colors} from '../../styles/colors';

interface LanguageSwitcherProps {
  style?: any;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({style}) => {
  const {currentLanguage, changeLanguage, t} = useLanguage();

  const languages = [
    {code: 'ar', label: t('common.arabic')},
    {code: 'en', label: t('common.english')},
  ];

  return (
    <View style={[styles.container, style]}>
      <Typography variant="body" weight="medium" style={styles.label}>
        {t('common.language')}:
      </Typography>
      <View style={styles.languageButtons}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              currentLanguage === lang.code && styles.activeLanguageButton,
            ]}
            onPress={() => changeLanguage(lang.code)}>
            <Typography
              variant="small"
              weight="medium"
              color={currentLanguage === lang.code ? 'white' : 'primary'}
              style={styles.languageText}>
              {lang.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  label: {
    marginRight: 12,
  },
  languageButtons: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  activeLanguageButton: {
    backgroundColor: colors.primary,
  },
  languageText: {
    fontSize: 14,
  },
});
