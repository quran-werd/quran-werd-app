import {View, Text, StyleSheet} from 'react-native';

export default function SurahHeader({name}: {name: string}) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    marginVertical: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5a3e12',
  },
});
