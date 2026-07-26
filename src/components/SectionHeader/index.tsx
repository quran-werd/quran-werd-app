import React from 'react';
import {View, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {Typography} from '../shared';

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode | string;
  style?: ViewStyle;
  iconStyle?: TextStyle;
  titleStyle?: TextStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  style,
  iconStyle,
  titleStyle,
}) => {
  return (
    <View style={[styles.sectionHeader, style]}>
      <View style={styles.iconContainer}>
        {typeof icon === 'string' ? (
          <Typography variant="body" style={iconStyle}>
            {icon}
          </Typography>
        ) : (
          icon
        )}
      </View>
      <Typography variant="h3" weight="semibold" style={titleStyle}>
        {title}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    // Typography component handles styling
  },
});
