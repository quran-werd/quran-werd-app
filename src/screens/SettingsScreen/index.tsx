import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import Typography from '../../components/shared/Typography';
import SegmentedControl from '../../components/shared/SegmentedControl';
import {colors} from '../../styles/colors';
import {spacing} from '../../styles/spacing';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {selectUser} from '../../features/Auth/authSlice';
import {signOut} from '../../features/Auth/authAction';
import SettingsCard from './components/SettingsCard';
import SectionLabel from './components/SectionLabel';
import Row from './components/Row';
import UserCard from './components/UserCard';
import NotificationSettingsCard from './components/NotificationSettingsCard';
import AppInfoSection from './components/AppInfoSection';

type ThemeMode = 'light' | 'dark';

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

export default function SettingsScreen() {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  const handleSignOut = () => {
    dispatch(signOut());
  };

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
        <UserCard user={user} />

        <SectionLabel>{t('settings.sections.customization')}</SectionLabel>
        <SettingsCard>
          <Row
            label={t('settings.themeLabel')}
            trailing={
              <SegmentedControl
                value={themeMode}
                onChange={setThemeMode}
                options={[
                  {label: t('settings.theme.dark'), value: 'dark'},
                  {label: t('settings.theme.light'), value: 'light'},
                ]}
              />
            }
          />
        </SettingsCard>

        <SectionLabel>{t('settings.sections.notifications')}</SectionLabel>
        <NotificationSettingsCard />

        <SectionLabel>{t('settings.sections.app')}</SectionLabel>
        <AppInfoSection />

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
});
