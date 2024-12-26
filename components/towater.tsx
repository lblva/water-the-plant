import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import useUserGet from '@/data/user-get';
import usePlants from '@/data/plants'; 
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

type Plant = {
  _id: string;
  name: string;
};

export default function MyPlants() {
  const params = useLocalSearchParams();
  const { data: userData, isLoading: userLoading, isError: userError } = useUserGet(params.userId);
  const { data: allPlants, isLoading: plantsLoading, isError: plantsError } = usePlants();
  const [userPlants, setUserPlants] = useState<Plant[]>([]);
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);  // State to track selected plant IDs

  useEffect(() => {
    if (userData && allPlants) {
      // Filter the allPlants data based on the user.plants array
      const filteredPlants = allPlants.filter((plant: any) =>
        userData.plants.includes(plant._id)
      );
      setUserPlants(filteredPlants);
    }
  }, [userData, allPlants]);

  const handleSelectPlant = (plantId: string) => {
    setSelectedPlants((prevSelected) => {
      if (prevSelected.includes(plantId)) {
        // If already selected, remove it
        return prevSelected.filter(id => id !== plantId);
      } else {
        // Otherwise, add it to the selected list
        return [...prevSelected, plantId];
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleButtonContainer}>
        <Text style={styles.title}>Plants to water</Text>
      </View>

      <ScrollView horizontal={true}>
        {userPlants.map((plant) => (
          <View key={plant._id} style={styles.plantContainer}>
            <TouchableOpacity
              style={styles.circle}
              onPress={() => handleSelectPlant(plant._id)}
            >
              {selectedPlants.includes(plant._id) && (
                <Icon name="check" size={20} color="#B79CD5" /> // Right icon when selected
              )}
            </TouchableOpacity>
            <Text style={styles.plantTitle}>{plant.name}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 30,
  },
  titleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 13,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  plantTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5, // Add some space between the circle and the text
  },
  plantContainer: {
    alignItems: 'center', // Center items horizontally
    padding: 10,
    marginRight: 10,
    backgroundColor: '#E8EFE1',
    borderRadius: 8,
    flexDirection: 'column', // Stack items vertically
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20, // This makes it a circle
    backgroundColor: '#fff', // Default color for unselected
    marginBottom: 5, // Space between the circle and the text
    justifyContent: 'center',
    alignItems: 'center',
  },
});