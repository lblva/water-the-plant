import { Image, StyleSheet, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useUsers from '@/data/users';


export default function HomeScreen() {
  const {data, isLoading, isError} = useUsers();
  console.log(data);
  // Use the theme to set the background color dynamically

  if (isLoading && !data) {
        return <Text>Loading...</Text>;
        }
    
  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <Text style={styles.title}> Profile </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25, // Apply 15px padding to the entire screen
  },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    }
});
