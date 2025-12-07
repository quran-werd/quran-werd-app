import React from 'react';
import {View, TextInput, StyleSheet, Text, TextInputProps} from 'react-native';
import {colors} from '../../../styles/colors';
import Typography from '../Typography';

interface PhoneInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
}

export default function PhoneInput({
  value,
  onChangeText,
  error,
  label,
  style,
  ...props
}: PhoneInputProps) {
  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');

    if (cleaned.length === 0) return '';

    // Handle different country code lengths
    // Try to detect country code (1-3 digits)
    let countryCode = '';
    let number = cleaned;

    // Common country codes: 1 (US/Canada), 20 (Egypt), 212 (Morocco), 962 (Jordan), etc.
    if (cleaned.startsWith('1') && cleaned.length > 1) {
      // US/Canada format: +1 (234) 567-8900
      countryCode = cleaned.slice(0, 1);
      number = cleaned.slice(1);
      if (number.length === 0) return `+${countryCode}`;
      if (number.length <= 3) return `+${countryCode} (${number}`;
      if (number.length <= 6)
        return `+${countryCode} (${number.slice(0, 3)}) ${number.slice(3)}`;
      return `+${countryCode} (${number.slice(0, 3)}) ${number.slice(
        3,
        6,
      )}-${number.slice(6, 10)}`;
    } else if (cleaned.startsWith('962') && cleaned.length > 3) {
      // Jordan format: +962 7 8535 2060
      countryCode = cleaned.slice(0, 3);
      number = cleaned.slice(3);
      if (number.length === 0) return `+${countryCode}`;
      if (number.length <= 1) return `+${countryCode} ${number}`;
      if (number.length <= 5)
        return `+${countryCode} ${number.slice(0, 1)} ${number.slice(1)}`;
      return `+${countryCode} ${number.slice(0, 1)} ${number.slice(
        1,
        5,
      )} ${number.slice(5, 9)}`;
    } else if (cleaned.startsWith('20') && cleaned.length > 2) {
      // Egypt format: +20 123 456 7890
      countryCode = cleaned.slice(0, 2);
      number = cleaned.slice(2);
      if (number.length === 0) return `+${countryCode}`;
      if (number.length <= 3) return `+${countryCode} ${number}`;
      if (number.length <= 6)
        return `+${countryCode} ${number.slice(0, 3)} ${number.slice(3)}`;
      return `+${countryCode} ${number.slice(0, 3)} ${number.slice(
        3,
        6,
      )} ${number.slice(6, 10)}`;
    } else if (cleaned.length <= 3) {
      // Generic format for short numbers (likely country code only)
      return `+${cleaned}`;
    } else {
      // Generic international format: +XXX XXX XXX XXXX
      // Try to detect country code (1-3 digits)
      if (cleaned.length <= 4) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      } else if (cleaned.length <= 7) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
          6,
        )}`;
      } else if (cleaned.length <= 10) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
          6,
          9,
        )} ${cleaned.slice(9)}`;
      } else {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
          6,
          9,
        )} ${cleaned.slice(9, 13)}`;
      }
    }
  };

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    // Allow up to 15 digits (international standard E.164 allows up to 15 digits)
    if (cleaned.length <= 15) {
      onChangeText(cleaned);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="caption" color="secondary" style={styles.label}>
          {label}
        </Typography>
      )}
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputContainerError : {},
        ]}>
        <TextInput
          style={[styles.input, style]}
          value={formatPhoneNumber(value)}
          onChangeText={handleChangeText}
          placeholder="+962 78 xxx xxxx"
          placeholderTextColor={colors.text.light}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          {...props}
        />
      </View>
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
  inputContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  input: {
    fontSize: 16,
    color: colors.text.primary,
    padding: 0,
  },
  errorText: {
    marginTop: 4,
    color: '#EF4444',
  },
});
