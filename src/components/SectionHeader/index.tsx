import React from 'react';
import {View, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {Typography} from '../shared';

interface SectionHeaderProps {
  icon: React.ReactNode | string;
  title: string;
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
      <Typography variant="body" style={iconStyle}>
        {icon}
      </Typography>
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
    gap: 4,
  },
  sectionTitle: {
    // Typography component handles styling
  },
});
