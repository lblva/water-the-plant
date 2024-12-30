import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useLocalSearchParams } from 'expo-router';
import useUserGet from '@/data/user-get';
import usePlants from '@/data/plants'; 
import useToWater from '@/data/log-get';
import useLogs from '@/data/log-post'; 
import useSWR, { mutate } from 'swr';  // import mutate from SWR
import { API_URL } from '@/constants/Api';

type Plant = {
  _id: string;
  name: string;
};

export default function ToWater() {
  const params = useLocalSearchParams();
  const { data: userData, isLoading: userLoading, isError: userError } = useUserGet(params.userId);
  const { data: allPlants, isLoading: plantsLoading, isError: plantsError } = usePlants();
  const { data: toWaterData, isError, isLoading: toWaterLoading, isError: toWaterError } = useToWater(params.userId);
  const { logData } = useLogs();  // Get logData function from useLogs
  const [userPlants, setUserPlants] = useState<Plant[]>([]);
  const [toWaterMap, setToWaterMap] = useState<Record<string, { isWatered: boolean, nextWateringDate: string }>>({});
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null); // Tracks plant for modal confirmation
  const [modalVisible, setModalVisible] = useState(false);

  // Filters all plants to include only those associated with the current user (userData.plants) and updates userPlants.
  useEffect(() => {
    if (userData && allPlants) {
      const filteredPlants = allPlants.filter((plant: any) =>
        userData.plants.includes(plant._id)
      );
      setUserPlants(filteredPlants);
    }
  }, [userData, allPlants]);

  // Manually update the toWaterMap whenever toWaterData changes
  useEffect(() => {
    if (toWaterData) {
        const formattedData = toWaterData.reduce((acc: any, item: any) => {
            acc[item.plantId] = {
                isWatered: item.isWatered,
                nextWateringDate: item.nextWateringDate,  // Store the date here
            };
            return acc;
        }, {});
        setToWaterMap(formattedData);
    }
  }, [toWaterData]);

  // Re-fetch toWaterData when user or plants change by triggering mutate
  useEffect(() => {
    if (userData && allPlants) {
      mutate(`${API_URL}/logs/user/${params.userId}/to-water`);
    }
  }, [userData, allPlants]);

  // Calculates the number of days until the next watering date. Computes the difference (in days) between the current date (now) and the nextWateringDate.
  const calculateDaysUntilWatering = (nextWateringDate: string) => {
    const now = new Date();
    const wateringDate = new Date(nextWateringDate);
    const diffTime = wateringDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));  // Returns days until watering
  };

  // Event Handler, Updates selectedPlant and opens the confirmation modal when a plant is selected.
  const handleSelectPlant = (plantId: string) => {
    setSelectedPlant(plantId);
    setModalVisible(true);
  };

  const confirmWatering = async () => {
    if (!selectedPlant || !params.userId) return;

    // Optimistically update the state to reflect the "watered" status
    setToWaterMap((prev) => ({
      ...prev,
      [selectedPlant]: {
        ...prev[selectedPlant],
        isWatered: true, // Mark the selected plant as watered
      },
    }));

    // Log the watering action after confirmation
    try {
      await logData(0, selectedPlant, params.userId);  // Log watering action with 0 days (watered today)
      
      // Use mutate to trigger a refetch or re-sync the data if necessary
      mutate(`${API_URL}/logs/user/${params.userId}/to-water`);
      
      // Close the modal after updating the state
      setModalVisible(false);
    } catch (error) {
      console.error('Error logging watering:', error);

      // Revert the state change in case of an error
      setToWaterMap((prev) => ({
        ...prev,
        [selectedPlant]: {
          ...prev[selectedPlant],
          isWatered: false, // Or any fallback state
        },
      }));
    }
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
              style={[
                styles.circle,
                toWaterMap[plant._id]?.isWatered && styles.disabledCircle,
              ]}
              onPress={() => handleSelectPlant(plant._id)}
              disabled={toWaterMap[plant._id]?.isWatered} // Disable if watered
            >
              {toWaterMap[plant._id]?.isWatered ? (
                <Icon name="check" size={20} color="#4CAF50" />
              ) : (
                ""
              )}
            </TouchableOpacity>
            <Text style={styles.toWaterText}>
              {toWaterMap[plant._id]?.isWatered
                ? "Watered"
                : `Water in ${calculateDaysUntilWatering(toWaterMap[plant._id]?.nextWateringDate)} days`}
            </Text>
            <Text style={styles.plantTitle}>{plant.name}</Text>
          </View>
        ))}
      </ScrollView>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to mark this plant as watered?</Text>
            <View style={styles.modalButtons}>
              <Button title="Yes" onPress={confirmWatering} />
              <Button title="No" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    padding: 10,
    marginRight: 10,
    backgroundColor: '#E8EFE1',
    borderRadius: 8,
    flexDirection: 'column',
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledCircle: {
    backgroundColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
});
