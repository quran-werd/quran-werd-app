import React from 'react';
import {View, StyleSheet} from 'react-native';
import Card from '../shared/Card';
import Typography from '../shared/Typography';
import Icon from '../shared/Icon';

interface ProgressCardProps {
  title: string;
  subtitle?: string;
  percentage: number;
  value: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: any;
}

export default function ProgressCard({
  title,
  subtitle,
  percentage,
  value,
  icon,
  onPress,
  style,
}: ProgressCardProps) {
  return (
    <Card onPress={onPress} style={style} padding={20} margin={6}>
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View style={styles.textContainer}>
          <Typography variant="h3" style={styles.title}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              color="secondary"
              style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </View>
        <View style={styles.progressContainer}>
          <Typography variant="h1" color="primary" style={styles.percentage}>
            {percentage}%
          </Typography>
          <Typography
            variant="caption"
            color="secondary"
            align="right"
            style={styles.value}>
            {value}
          </Typography>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    // Typography component handles styling
  },
  progressContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  percentage: {
    marginBottom: 6,
  },
  value: {
    // Typography component handles styling
  },
});
