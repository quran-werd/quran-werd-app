// src/components/QuranRecitationChecker/index.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import useSpeechToText from '../../hooks/useSpeechToText';

const QuranRecitationChecker: React.FC = () => {
  const {isRecording, partialResults, toggleListening} = useSpeechToText();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: isRecording ? 'red' : 'green'},
        ]}
        onPress={toggleListening}>
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop' : 'Start'} Listening
        </Text>
      </TouchableOpacity>

      {partialResults.length > 0 && (
        <View style={styles.partialResultsContainer}>
          <Text style={styles.partialResultsTitle}>Partial Results:</Text>
          {partialResults.map((result, index) => (
            <Text key={index} style={styles.partialResultText}>
              {result}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212', // Dark background
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  partialResultsContainer: {
    width: '90%',
    padding: 15,
    backgroundColor: '#1E1E1E', // Slightly lighter dark background
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  partialResultsTitle: {
    color: '#4CAF50', // Vibrant green
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  partialResultText: {
    color: '#B0BEC5', // Soft grey-blue
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default QuranRecitationChecker;
