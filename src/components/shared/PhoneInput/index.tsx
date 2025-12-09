import React from 'react';
import {View, TextInput, StyleSheet, TextInputProps} from 'react-native';
import {colors} from '../../../styles/colors';
import Typography from '../Typography';
import {formatPhoneNumber} from '../../../utils/phone.utils';

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
