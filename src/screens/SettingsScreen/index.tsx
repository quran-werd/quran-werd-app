import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  Pressable,
  ScrollView,
  Linking,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {LinearGradient} from 'expo-linear-gradient';
import Svg, {Path, Circle} from 'react-native-svg';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import Typography from '../../components/shared/Typography';
import SettingsToggle from '../../components/shared/SettingsToggle';
import SegmentedControl from '../../components/shared/SegmentedControl';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {spacing} from '../../styles/spacing';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {selectUser} from '../../features/Auth/authSlice';
import {signOut} from '../../features/Auth/authAction';
import {
  getDevNotificationTimeOverride,
  DEV_NOTIFICATION_TIME,
} from '../../services/config';
import {
  rescheduleDailyWerdNotification,
  cancelDailyNotifications,
} from '../../services/notifications.service';
import {
  loadNotificationTime,
  type NotificationTime,
} from '../../utils/storage/notification.storage';
const pkg = require('../../../package.json');

const timeToDate = (time: NotificationTime): Date => {
  const date = new Date();
  date.setHours(time.hour, time.minute, 0, 0);
  return date;
};

const dateToTime = (date: Date): NotificationTime => ({
  hour: date.getHours(),
  minute: date.getMinutes(),
});

const formatTime = (time: NotificationTime): string => {
  const hour = String(time.hour).padStart(2, '0');
  const minute = String(time.minute).padStart(2, '0');
  return `${hour}:${minute}`;
};

type ThemeMode = 'light' | 'dark';

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

function ExternalLinkIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <Path
        d="M9 2h5v5M14 2l-7 7M6 4H3a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-3"
        stroke={colors.mutedForeground}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

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

function SignOutIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 16 16" fill="none">
      <Path
        d="M10.5 2H13a1 1 0 011 1v10a1 1 0 01-1 1h-2.5"
        stroke={colors.destructiveSettings}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 11l3.5-3L7 5M10.5 8H3"
        stroke={colors.destructiveSettings}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SectionLabel({children}: {children: React.ReactNode}) {
  return (
    <Typography family="cairo" weight="bold" style={styles.sectionLabel}>
      {children}
    </Typography>
  );
}

function SettingsCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function Row({
  label,
  sublabel,
  trailing,
  destructive,
  onPress,
}: {
  label: string;
  sublabel?: string;
  trailing?: React.ReactNode;
  destructive?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.row}>
      <View style={styles.rowTextWrap}>
        <Typography
          family="cairo"
          style={[styles.rowLabel, destructive && styles.destructiveLabel]}>
          {label}
        </Typography>
        {sublabel ? (
          <Typography family="cairo" style={styles.rowSublabel}>
            {sublabel}
          </Typography>
        ) : null}
      </View>
      {trailing}
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

export default function SettingsScreen() {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [pickerDate, setPickerDate] = useState(() =>
    timeToDate({hour: 7, minute: 0}),
  );
  const [showPicker, setShowPicker] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  const devOverride = getDevNotificationTimeOverride();

  const loadSettings = useCallback(async () => {
    const time = await loadNotificationTime();
    setPickerDate(timeToDate(time));
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleTimeChange = async (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'set' && date) {
      setPickerDate(date);
      try {
        await rescheduleDailyWerdNotification(dateToTime(date));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      if (value) {
        await rescheduleDailyWerdNotification(dateToTime(pickerDate));
      } else {
        await cancelDailyNotifications();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const initial = user?.name?.trim()?.[0] ?? 'و';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="subtitle" family="cairo" weight="bold">
          {t('settings.title')}
        </Typography>
      </View>
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
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

        <SectionLabel>{t('settings.sections.customization')}</SectionLabel>
        <SettingsCard>
          <View style={[styles.row]}>
            <Typography family="cairo" style={[styles.rowLabel, {flex: 1}]}>
              {t('settings.themeLabel')}
            </Typography>
            <SegmentedControl
              value={themeMode}
              onChange={setThemeMode}
              options={[
                {label: t('settings.theme.dark'), value: 'dark'},
                {label: t('settings.theme.light'), value: 'light'},
              ]}
            />
          </View>
        </SettingsCard>

        <SectionLabel>{t('settings.sections.notifications')}</SectionLabel>
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
                <Pressable
                  onPress={() => setShowPicker(prev => !prev)}
                  style={styles.timePill}>
                  <ClockIcon />
                  <Typography
                    family="cairo"
                    weight="bold"
                    style={styles.timePillText}>
                    {formatTime(dateToTime(pickerDate))}
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
                  {t('settings.devOverride', {time: DEV_NOTIFICATION_TIME})}
                </Typography>
              ) : null}
            </Animated.View>
          ) : null}
        </SettingsCard>

        <SectionLabel>{t('settings.sections.app')}</SectionLabel>
        <SettingsCard>
          <Row
            label={t('settings.app.rate')}
            trailing={<ExternalLinkIcon />}
            onPress={() => Linking.openURL('https://play.google.com/store')}
          />
          <Divider />
          <Row
            label={t('settings.app.contact')}
            trailing={<ExternalLinkIcon />}
            onPress={() => Linking.openURL('mailto:support@example.com')}
          />
          <Divider />
          <Row
            label={t('settings.app.versionLabel')}
            trailing={
              <Typography family="cairo" style={styles.versionValue}>
                {pkg.version}
              </Typography>
            }
          />
        </SettingsCard>

        <View style={styles.signOutWrap}>
          <SettingsCard>
            <Row
              label={t('settings.signOut')}
              destructive
              trailing={<SignOutIcon />}
              onPress={handleSignOut}
            />
          </SettingsCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  destructiveLabel: {
    color: colors.destructiveSettings,
  },
  signOutWrap: {
    marginTop: spacing[28],
  },
  header: {
    paddingTop: 52,
    paddingBottom: spacing[10],
    paddingHorizontal: spacing[20],
    borderBottomWidth: 1,
    borderBottomColor: colors.goldTintSubtle,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: spacing[16],
    paddingBottom: spacing[48],
  },
  userCard: {
    marginTop: spacing[18],
    marginBottom: spacing[4],
  },
  card: {
    backgroundColor: 'rgba(19,29,48,0.85)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.goldBorderSubtle,
    overflow: 'hidden',
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
  sectionLabel: {
    fontSize: 11,
    color: 'rgba(138,154,184,0.55)',
    letterSpacing: 0.07 * 11,
    paddingTop: spacing[22],
    paddingBottom: spacing[8],
    paddingHorizontal: spacing[4],
  },
  row: {
    paddingVertical: spacing[14],
    paddingHorizontal: spacing[16],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[12],
  },
  rowTextWrap: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.foreground,
  },
  rowSublabel: {
    fontSize: 12,
    color: 'rgba(138,154,184,0.6)',
  },
  divider: {
    height: 1,
    backgroundColor: colors.goldBorderFaint,
    marginHorizontal: spacing[16],
  },
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
  },
  devOverride: {
    fontSize: 11,
    color: colors.mutedForeground,
    paddingHorizontal: spacing[16],
    paddingBottom: spacing[8],
  },
  versionValue: {
    fontSize: 13,
    color: 'rgba(138,154,184,0.5)',
  },
});
