import React from 'react';
import {View, StyleSheet} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {colors} from '../../../styles/colors';
import Typography from '../Typography';

interface OTPInputProps {
  length?: number;
  value?: string; // Optional since library manages its own state
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
  editable?: boolean;
}

export default function OTPInput({
  length = 6,
  onChangeText,
  error,
  label,
  editable = true,
}: OTPInputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="caption" color="secondary" style={styles.label}>
          {label}
        </Typography>
      )}
      <OtpInput
        numberOfDigits={length}
        focusColor={colors.primary}
        focusStickBlinkingDuration={500}
        onTextChange={onChangeText}
        onFilled={onChangeText}
        textInputProps={{
          accessibilityLabel: 'One-Time Password',
          autoComplete: 'sms-otp',
          textContentType: 'oneTimeCode',
          keyboardType: 'number-pad',
        }}
        theme={{
          containerStyle: {
            direction: 'ltr',
          },
          pinCodeContainerStyle: {
            ...styles.pinCodeContainer,
            ...(error ? styles.pinCodeContainerError : {}),
          },
          pinCodeTextStyle: styles.pinCodeText,
          focusStickStyle: styles.focusStick,
          focusedPinCodeContainerStyle: styles.pinCodeContainerFocused,
        }}
        disabled={!editable}
      />
      {error && (
        <Typography variant="small" color="secondary" style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  pinCodeContainer: {
    height: 56,
    width: 48,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pinCodeContainerFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  pinCodeContainerError: {
    borderColor: '#EF4444',
  },
  pinCodeText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
  },
  focusStick: {
    backgroundColor: colors.primary,
    height: 25,
  },
  errorText: {
    marginTop: 4,
    color: '#EF4444',
  },
});
