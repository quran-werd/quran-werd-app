import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Typography from '../../../components/shared/Typography';
import {colors} from '../../../styles/colors';
import {spacing} from '../../../styles/spacing';
import {useAppSelector} from '../../../store/hooks';
import {selectUser} from '../../../features/Auth/authSlice';

export default function GreetingHeader() {
  const {t} = useTranslation();
  const user = useAppSelector(selectUser);

  const todayDate = useMemo(
    () =>
      new Intl.DateTimeFormat('ar', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(new Date()),
    [],
  );

  return (
    <View style={styles.greetingBlock}>
      <Typography
        variant="body"
        family="cairo"
        color="muted"
        style={styles.dateLabel}>
        {todayDate}
      </Typography>
      <Typography variant="title" family="amiriBold">
        {t('home.greeting')}
        {'،\n'}
        {user?.name ? (
          <Typography
            variant="title"
            family="amiriBold"
            style={styles.greetingName}>
            {user.name}
          </Typography>
        ) : null}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  greetingBlock: {
    paddingHorizontal: spacing[28],
    paddingTop: spacing[24],
    paddingBottom: spacing[8],
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: spacing[4],
  },
  greetingName: {
    color: colors.primary,
  },
});
