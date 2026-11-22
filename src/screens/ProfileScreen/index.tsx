import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  I18nManager,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {LinearGradient} from 'expo-linear-gradient';
import Svg, {Path} from 'react-native-svg';
import ScreenTitle from '../../components/shared/ScreenTitle';
import Typography from '../../components/shared/Typography';
import Button from '../../components/shared/Button';
import SettingsCard from '../SettingsScreen/components/SettingsCard';
import Divider from '../SettingsScreen/components/Divider';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {spacing} from '../../styles/spacing';
import {fontFamilies} from '../../styles/typography';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {selectUser} from '../../features/Auth/authSlice';
import {updateUserName} from '../../features/Auth/authAction';

// Must match the server's limit on PATCH /auth/me.
const MAX_NAME_LENGTH = 50;

// Points "back": left in LTR, right in RTL.
function BackIcon() {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 16 16"
      fill="none"
      style={I18nManager.isRTL ? styles.flip : undefined}>
      <Path
        d="M10 4L6 8l4 4"
        stroke={colors.foreground}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function ProfileScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const user = useAppSelector(selectUser);

  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = name.trim();
  const unchanged = trimmed === (user?.name ?? '').trim();
  const initial = trimmed[0] ?? user?.name?.trim()?.[0] ?? 'و';

  const handleChange = (value: string) => {
    setName(value);
    setError(null);
  };

  const handleSave = async () => {
    if (!trimmed) {
      setError(t('profile.nameRequired'));
      return;
    }
    setSaving(true);
    const result = await dispatch(updateUserName(trimmed));
    setSaving(false);
    if (updateUserName.fulfilled.match(result)) {
      navigation.goBack();
    } else {
      setError((result.payload as string) ?? null);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, {paddingTop: insets.top + spacing[12]}]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          style={styles.backButton}>
          <BackIcon />
        </Pressable>
        <ScreenTitle>{t('profile.title')}</ScreenTitle>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.avatarWrap}>
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
        </View>

        <SettingsCard>
          <View style={styles.field}>
            <Typography family="cairo" style={styles.fieldLabel}>
              {t('profile.nameLabel')}
            </Typography>
            <TextInput
              value={name}
              onChangeText={handleChange}
              placeholder={t('profile.namePlaceholder')}
              placeholderTextColor={colors.mutedForeground}
              maxLength={MAX_NAME_LENGTH}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleSave}
              selectionColor={colors.primary}
              style={styles.input}
            />
          </View>
          <Divider />
          <View style={styles.field}>
            <Typography family="cairo" style={styles.fieldLabel}>
              {t('profile.emailLabel')}
            </Typography>
            <Typography family="cairo" color="muted" style={styles.email}>
              {user?.email}
            </Typography>
          </View>
        </SettingsCard>

        {error ? (
          <Typography
            variant="caption"
            color="destructive"
            align="center"
            style={styles.error}>
            {error}
          </Typography>
        ) : null}

        <Button
          title={t('profile.save')}
          onPress={handleSave}
          loading={saving}
          disabled={unchanged || !trimmed}
          fullWidth
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
    paddingBottom: spacing[10],
    paddingHorizontal: spacing[20],
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorderSubtle,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mutedTintFaint,
  },
  flip: {
    transform: [{scaleX: -1}],
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: spacing[16],
    paddingBottom: spacing[48],
  },
  avatarWrap: {
    alignItems: 'center',
    marginTop: spacing[28],
    marginBottom: spacing[24],
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(196,154,60,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 34,
    lineHeight: 44,
  },
  field: {
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
    gap: spacing[4],
  },
  fieldLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  input: {
    fontFamily: fontFamilies.cairo.semibold,
    fontSize: 16,
    color: colors.foreground,
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[12],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.goldBorderStrong,
    backgroundColor: colors.insetSubCard,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  email: {
    fontSize: 14,
  },
  error: {
    marginTop: spacing[12],
  },
  saveButton: {
    marginTop: spacing[24],
  },
});
