import { Image, StyleSheet, Text, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import ToWater from '@/components/towater';
import MyPlants from '@/components/myplants';
import useUsers from '@/data/users';
import Header from '@/components/header';


export default function HomeScreen() {
  const {data, isLoading, isError} = useUsers();
  console.log(data);
  // Use the theme to set the background color dynamically

  if (isLoading && !data) {
        return <Text>Loading...</Text>;
        }
    
  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <Header data={data} />
      <ToWater />
      <MyPlants />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25, // Apply 15px padding to the entire screen
  }
});
