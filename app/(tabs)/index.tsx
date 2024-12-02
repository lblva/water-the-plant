import { Image, StyleSheet, Text, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor'; 
import ToWater from '@/components/towater';
import MyPlants from '@/components/myplants';
import useUsers from '@/data/users';
//import usePlants from '@/data/plants';


export default function HomeScreen() {
  const {data, isLoading, isError} = useUsers();
  console.log(data);
  // Use the theme to set the background color dynamically
  const backgroundColor = useThemeColor({}, 'background');

  if (isLoading) {
        return <Text>Loading...</Text>;
        }
    
  return (
    <SafeAreaView style={[styles.mainContainer, { backgroundColor }]}>
      <ThemedText type="defaultSemiBold">Goodmorning, user</ThemedText>
      {data.map((user:any) => (
         <Text key={user.id}>{user.email}</Text>
      ))}
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
    padding: 25, // Apply 15px padding to the entire screen
  }
});
