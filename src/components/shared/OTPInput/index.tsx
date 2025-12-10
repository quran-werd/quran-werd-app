import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  I18nManager,
} from 'react-native';
import {colors} from '../../../styles/colors';
import Typography from '../Typography';

interface OTPInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  length?: number;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
}

export default function OTPInput({
  length = 6,
  value,
  onChangeText,
  error,
  label,
  ...props
}: OTPInputProps) {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChangeText = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replace(/\D/g, '').slice(0, 1);
    
    if (digit) {
      const newValue = value.split('');
      newValue[index] = digit;
      const updatedValue = newValue.join('').slice(0, length);
      onChangeText(updatedValue);

      // Auto-focus next input
      if (index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      // Handle backspace
      const newValue = value.split('');
      newValue[index] = '';
      onChangeText(newValue.join('').slice(0, length));
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="caption" color="secondary" style={styles.label}>
          {label}
        </Typography>
      )}
      <View style={[styles.inputsContainer, {direction: 'ltr'}]}>
        {Array.from({length}).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => {
              inputRefs.current[index] = ref;
            }}
            style={[
              styles.input,
              focusedIndex === index && styles.inputFocused,
              error && styles.inputError,
            ]}
            value={value[index] || ''}
            onChangeText={text => handleChangeText(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            textAlign="center"
            {...props}
          />
        ))}
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
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 56,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    marginTop: 4,
    color: '#EF4444',
  },
});

