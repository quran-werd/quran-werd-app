import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../../styles/colors';
import Typography from '../../components/shared/Typography';
import PhoneInput from '../../components/shared/PhoneInput';
import OTPInput from '../../components/shared/OTPInput';
import Button from '../../components/shared/Button';
import {
  sendOTP,
  verifyOTP,
  setPhoneNumber,
  setResendCooldown,
  clearError,
  selectAuth,
} from '../../features/Auth/authSlice';

export default function Login() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const [otp, setOtp] = useState('');

  // Cooldown timer effect
  useEffect(() => {
    if (auth.resendCooldown > 0) {
      const timer = setInterval(() => {
        const newCooldown = auth.resendCooldown - 1;
        dispatch(setResendCooldown(newCooldown));
        if (newCooldown <= 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [auth.resendCooldown, dispatch]);

  // Clear error when component mounts or phone/otp changes
  useEffect(() => {
    if (auth.error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [auth.error, dispatch]);

  const handlePhoneChange = (text: string) => {
    dispatch(setPhoneNumber(text));
    if (auth.error) {
      dispatch(clearError());
    }
  };

  const handleOTPChange = (text: string) => {
    setOtp(text);
    if (auth.error) {
      dispatch(clearError());
    }
  };

  const handleSendOTP = () => {
    if (auth.phoneNumber.length < 10) {
      return;
    }
    dispatch(sendOTP(auth.phoneNumber));
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      return;
    }
    dispatch(verifyOTP({phoneNumber: auth.phoneNumber, otp}));
  };

  const handleResendOTP = () => {
    if (auth.resendCooldown > 0) {
      return;
    }
    dispatch(sendOTP(auth.phoneNumber));
  };

  const canSendOTP = auth.phoneNumber.length >= 10 && !auth.loading;
  const canVerifyOTP = otp.length === 6 && !auth.loading && auth.otpSent;
  const canResend = auth.resendCooldown === 0 && auth.otpSent;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Typography variant="h1" align="center" style={styles.title}>
                {t('login.title', 'Welcome')}
              </Typography>
              <Typography
                variant="body"
                color="secondary"
                align="center"
                style={styles.subtitle}>
                {t(
                  'login.subtitle',
                  'Enter your phone number to continue',
                )}
              </Typography>
            </View>

            {/* Phone Input Section */}
            <View style={styles.formSection}>
              <PhoneInput
                value={auth.phoneNumber}
                onChangeText={handlePhoneChange}
                label={t('login.phoneLabel', 'Phone Number')}
                error={auth.error && !auth.otpSent ? auth.error : undefined}
                editable={!auth.loading && !auth.otpSent}
              />

              {!auth.otpSent ? (
                <Button
                  title={t('login.sendOTP', 'Send OTP')}
                  onPress={handleSendOTP}
                  disabled={!canSendOTP}
                  loading={auth.loading}
                  fullWidth
                />
              ) : (
                <>
                  {/* OTP Input Section */}
                  <OTPInput
                    value={otp}
                    onChangeText={handleOTPChange}
                    label={t('login.otpLabel', 'Enter OTP')}
                    error={auth.error && auth.otpSent ? auth.error : undefined}
                    editable={!auth.loading}
                  />

                  <Button
                    title={t('login.verifyOTP', 'Verify OTP')}
                    onPress={handleVerifyOTP}
                    disabled={!canVerifyOTP}
                    loading={auth.loading}
                    fullWidth
                    style={styles.verifyButton}
                  />

                  {/* Resend OTP Section */}
                  <View style={styles.resendContainer}>
                    <Typography
                      variant="caption"
                      color="secondary"
                      align="center"
                      style={styles.resendText}>
                      {t('login.didntReceive', "Didn't receive the code?")}
                    </Typography>
                    <Button
                      title={
                        auth.resendCooldown > 0
                          ? t('login.resendOTPWithTimer', {
                              seconds: auth.resendCooldown,
                            })
                          : t('login.resendOTP', 'Resend OTP')
                      }
                      onPress={handleResendOTP}
                      disabled={!canResend}
                      variant="outline"
                      style={styles.resendButton}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 8,
  },
  formSection: {
    width: '100%',
  },
  verifyButton: {
    marginTop: 8,
  },
  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    marginBottom: 12,
  },
  resendButton: {
    minWidth: 120,
  },
});

