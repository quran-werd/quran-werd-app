import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {LinearGradient} from 'expo-linear-gradient';
import Svg, {Path} from 'react-native-svg';
import Typography from '../../../components/shared/Typography';
import SettingsCard from './SettingsCard';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {spacing} from '../../../styles/spacing';
import type {User} from '../../../services/auth.service';

function ChevronLeftIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <Path
        d="M10 4L6 8l4 4"
        stroke={colors.mutedForeground}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface UserCardProps {
  user: User | null;
}

export default function UserCard({user}: UserCardProps) {
  const {t} = useTranslation();
  const initial = user?.name?.trim()?.[0] ?? 'و';

  return (
    <SettingsCard style={styles.userCard}>
      <Pressable style={styles.userRow}>
        <LinearGradient
          colors={['rgba(196,154,60,0.25)', 'rgba(196,154,60,0.08)']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.avatar}>
          <Typography
            family="cairo"
            weight="bold"
            color="primary"
            style={styles.avatarInitial}>
            {initial}
          </Typography>
        </LinearGradient>
        <View style={styles.userTextWrap}>
          <Typography family="cairo" weight="bold" style={styles.userName}>
            {user?.name}
          </Typography>
          <Typography family="cairo" style={styles.userSublabel}>
            {t('settings.editProfile')}
          </Typography>
        </View>
        <ChevronLeftIcon />
      </Pressable>
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  userCard: {
    marginTop: spacing[18],
    marginBottom: spacing[4],
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[14],
    padding: spacing[16],
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(196,154,60,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
  },
  userTextWrap: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 16,
  },
  userSublabel: {
    fontSize: 12,
    color: 'rgba(138,154,184,0.6)',
  },
});
