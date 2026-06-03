import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {useTranslation} from 'react-i18next';
import Typography from '../../components/shared/Typography';
import Button from '../../components/shared/Button';
import {colors} from '../../styles/colors';
import {clearError, selectAuth} from '../../features/Auth/authSlice';
import {signInWithGoogle} from '../../features/Auth/authAction';
import {useAppDispatch, useAppSelector} from '../../store/hooks';

export default function AuthScreen() {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  const handleGoogleSignIn = () => {
    dispatch(clearError());
    dispatch(signInWithGoogle());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h1" align="center" style={styles.title}>
          {t('auth.title')}
        </Typography>
        <Typography variant="body" color="secondary" align="center">
          {t('auth.subtitle')}
        </Typography>
        {auth.error ? (
          <Typography variant="caption" color="secondary" align="center">
            {auth.error}
          </Typography>
        ) : null}
        <Button
          title={t('auth.googleSignIn')}
          onPress={handleGoogleSignIn}
          loading={auth.loading}
          fullWidth
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
  },
});
