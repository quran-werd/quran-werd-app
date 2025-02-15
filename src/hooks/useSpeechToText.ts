import {useCallback, useEffect, useRef, useState} from 'react';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {requestMicrophonePermission} from '../utils/speechToText.utils';

function useSpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [partialResults, setPartialResults] = useState<string[]>([]);
  const _recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopListening = useCallback(async () => {
    try {
      // Clear timeout
      if (_recordingTimeoutRef.current) {
        clearTimeout(_recordingTimeoutRef.current);
      }

      await Voice.stop();
      await Voice.destroy();
      setIsRecording(false);
    } catch (error) {}
  }, []);

  const startListening = useCallback(async () => {
    try {
      // Clear previous results
      setPartialResults([]);

      // Check and request microphone permission
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Microphone access is required for speech recognition.',
        );
        return;
      }

      // Destroy any existing voice recognition session
      try {
        await Voice.destroy();
      } catch (destroyError) {}

      // Platform-specific configuration
      const options = {
        partialResults: true,
        locale: 'ar-SA',
        EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 10000,
      };

      // Check Voice library status before starting
      const isAvailable = await Voice.isAvailable();

      if (!isAvailable) {
        Alert.alert(
          'Speech Recognition Unavailable',
          'Speech recognition service is not available on this device.',
        );
        return;
      }

      // Start listening
      await Voice.start('ar-SA', options);
      setIsRecording(true);
    } catch (error) {
      setIsRecording(false);

      console.log('Speech Recognition Error\nFailed to start listening', {
        error,
      });
    }
  }, [isRecording, stopListening]);

  useEffect(() => {
    // Setup voice event listeners
    const onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setPartialResults(e.value);
      }
    };

    const onSpeechError = (error: SpeechErrorEvent) => {
      setIsRecording(false);

      console.log('Speech Recognition Error\nFailed to start listening', {
        error,
      });
    };

    const onSpeechStart = () => {
      console.log('Speech recognition started');
    };

    const onSpeechEnd = () => {
      console.log('Speech recognition ended');
    };

    // Attach listeners
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    // Cleanup listeners
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const toggleListening = () => {
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    isRecording,
    partialResults,
    stopListening,
    startListening,
    toggleListening,
  };
}

export default useSpeechToText;
