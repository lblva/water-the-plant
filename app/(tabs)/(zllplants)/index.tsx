import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Dimensions, Image, SafeAreaView, Text, View, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import usePlants from '@/data/plants';
import SearchBar from '@/components/search'; // Import the SearchBar component


const { width } = Dimensions.get('window'); // Get the screen width

export default function AllPlants() {
  const { data, isLoading, isError } = usePlants();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading plants data.</Text>;
  }

  const renderPlant = ({ item }: { item: any }) => (
    <Link href={`/(tabs)/(zllplants)/plants/${item._id}`}>
      <View style={styles.card}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          onError={(error) => console.log('Image load error:', error.nativeEvent)}
        />
        <Text style={styles.plantName}>{item.name}</Text>
      </View>
    </Link>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ThemedText type="defaultSemiBold" style={styles.header}>
        All Plants
      </ThemedText> 
      <SearchBar />
      <FlatList
        data={data}
        renderItem={renderPlant}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer} // Padding applied here
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        indicatorStyle="black" // Set the scrollbar indicator color

      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 25, // Add padding only to the header text
    paddingVertical: 10,
  },
  listContainer: {
    paddingHorizontal: 25, // Content padding for list items
    paddingBottom: 10, // Optional for spacing at the bottom
  },
  card: {
    width: '100%', // Ensure full width for the card
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EFE1',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 15, // Space between cards
  },
});
