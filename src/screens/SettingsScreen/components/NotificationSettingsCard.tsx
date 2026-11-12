import React from 'react';
import {View, Pressable, Platform, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, {Path, Circle} from 'react-native-svg';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import Typography from '../../../components/shared/Typography';
import SettingsToggle from '../../../components/shared/SettingsToggle';
import SettingsCard from './SettingsCard';
import Row from './Row';
import Divider from './Divider';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {spacing} from '../../../styles/spacing';
import {useNotificationSettings} from '../hooks/useNotificationSettings';

function ClockIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 16 16" fill="none">
      <Circle cx={8} cy={8} r={6.5} stroke={colors.primary} strokeWidth={1.2} />
      <Path
        d="M8 4.5V8l2.5 1.5"
        stroke={colors.primary}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function NotificationSettingsCard() {
  const {t} = useTranslation();
  const {
    pickerDate,
    formattedTime,
    showPicker,
    togglePicker,
    notificationsEnabled,
    handleToggleNotifications,
    handleTimeChange,
    devOverride,
    devTime,
  } = useNotificationSettings();

  return (
    <SettingsCard>
      <Row
        label={t('settings.notificationsEnabled')}
        trailing={
          <SettingsToggle
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
          />
        }
      />
      {notificationsEnabled ? (
        <Animated.View
          entering={FadeIn.duration(240)}
          exiting={FadeOut.duration(240)}>
          <Divider />
          <View style={styles.timeRow}>
            <Typography family="cairo" style={styles.timeRowLabel}>
              {t('settings.notificationTime')}
            </Typography>
            <Pressable onPress={togglePicker} style={styles.timePill}>
              <ClockIcon />
              <Typography
                family="cairo"
                weight="bold"
                style={styles.timePillText}>
                {formattedTime}
              </Typography>
            </Pressable>
          </View>
          {showPicker ? (
            <DateTimePicker
              value={pickerDate}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
              style={styles.picker}
            />
          ) : null}
          {__DEV__ && devOverride ? (
            <Typography family="cairo" style={styles.devOverride}>
              {t('settings.devOverride', {time: devTime})}
            </Typography>
          ) : null}
        </Animated.View>
      ) : null}
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  timeRow: {
    paddingVertical: spacing[12] + 1,
    paddingHorizontal: spacing[16],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeRowLabel: {
    fontSize: 14,
    color: 'rgba(237,231,220,0.55)',
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing[6] + 1,
    paddingHorizontal: spacing[12],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.28)',
    backgroundColor: 'rgba(196,154,60,0.1)',
  },
  timePillText: {
    fontSize: 15,
    color: colors.primary,
  },
  picker: {
    alignSelf: 'stretch',
    color: 'white',
  },
  devOverride: {
    fontSize: 11,
    color: colors.mutedForeground,
    paddingHorizontal: spacing[16],
    paddingBottom: spacing[8],
  },
});
