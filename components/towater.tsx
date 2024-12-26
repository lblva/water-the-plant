import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useLocalSearchParams } from 'expo-router';
import useUserGet from '@/data/user-get';
import usePlants from '@/data/plants'; 
import useToWater from '@/data/logs-toWater';

type Plant = {
  _id: string;
  name: string;
};

export default function ToWater() {
  const params = useLocalSearchParams();
  const { data: userData, isLoading: userLoading, isError: userError } = useUserGet(params.userId);
  const { data: allPlants, isLoading: plantsLoading, isError: plantsError } = usePlants();
  const { data: toWaterData, isLoading: toWaterLoading, isError: toWaterError } = useToWater(params.userId);
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

  const [toWaterMap, setToWaterMap] = useState<Record<string, string>>({});

  useEffect(() => {
      if (toWaterData) {
          const formattedData = toWaterData.reduce((acc : any, item : any) => {
              acc[item.plantId] = item.nextWateringDate;
              return acc;
          }, {});
          setToWaterMap(formattedData);
      }
  }, [toWaterData]);

  const calculateDaysUntilWatering = (nextWateringDate : any) => {
    const now = new Date();
    const wateringDate = new Date(nextWateringDate);
    const diffTime = wateringDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  };





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
                    <Icon name="check" size={20} color="#B79CD5" />
                )}
            </TouchableOpacity>
            <Text style={styles.toWaterText}>
                Water in{" "}
                {toWaterMap[plant._id]
                    ? calculateDaysUntilWatering(toWaterMap[plant._id])
                    : "unknown"}{" "}
                days
            </Text>
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
  toWaterText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  plantTitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 3,
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
    width: 35,
    height: 35,
    borderRadius: 20, // This makes it a circle
    backgroundColor: '#fff', // Default color for unselected
    marginTop: 5, // Space between the circle and the text
    justifyContent: 'center',
    alignItems: 'center',
  },
});