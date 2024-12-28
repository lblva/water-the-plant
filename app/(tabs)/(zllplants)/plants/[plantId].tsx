import { useState, useEffect } from 'react';
import { StyleSheet, Text, Image, ScrollView, Modal, View, TouchableOpacity, Alert } from 'react-native';
import usePlants from '@/data/plants';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Import useRouter
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Api';
import useSWR, { mutate } from 'swr'; // Import mutate from swr

// Define the types for the plant data
type Plant = {
  _id: string;
  name: string;
  image: string;
  description: string;
  waterinfo: string;
  lightrequirements: string;
  potting: string;
};

export default function PlantDetail() {
  const { plantId } = useLocalSearchParams();
  const { data, isLoading, isError } = usePlants();
  const [userId, setUserId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter(); // Use the router hook

  useEffect(() => {
    const getUserId = async () => {
      const user = await AsyncStorage.getItem('userId');
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserId(parsedUser.id);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (isSaved) {
      router.push('/(tabs)/(zllplants)/' as any);

    }
  }, [isSaved, router]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading data</Text>;
  }

  // Define the correct type for item
  const plant = data.find((item: Plant) => item._id === plantId);

  if (!plant) {
    return <Text>Plant not found</Text>;
  }

  // Function to save plant to user account (after successful log)
  const savePlantToUser = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not found. Please log in.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/users/${userId}/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plantId: plant._id,
        }),
      });

      const responseText = await response.text();
      console.log('Response:', responseText);

      if (response.ok) {
        setModalVisible(false);
        Alert.alert('Success', 'Plant saved successfully!');
        mutate(`${API_URL}/users/${userId}`);
        setIsSaved(true);
      } else {
        const errorData = JSON.parse(responseText);
        Alert.alert('Error', `Failed to save the plant. ${errorData.message || ''}`);
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred while saving the plant. ${(error as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  // Function to log the watering action
  const logWatering = async (days: number) => {
    if (!userId) {
      Alert.alert('Error', 'User not found. Please log in.');
      return;
    }

    const currentDate = new Date();
    if (days !== 0) {
      currentDate.setDate(currentDate.getDate() - days);
    }

    const logDate = currentDate.toISOString();

    console.log('Request Body:', { days, plantId: plant._id, user: userId, logDate });

    try {
      const response = await fetch(`${API_URL}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          days,
          plantId: plant._id,
          user: userId,
        }),
      });

      const responseText = await response.text();
      console.log('Response:', responseText);

      if (response.ok) {
        console.log(`Logged ${days} days for plant ${plant.name}`);
        savePlantToUser();
      } else {
        const errorData = JSON.parse(responseText);
        Alert.alert('Error', `Failed to log watering. ${errorData.message || ''}`);
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred while logging watering. ${(error as Error).message}`);
    }
  };

  const handleSavePlantClick = () => {
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: plant.image }} style={styles.image} />
      <Text style={styles.name}>{plant.name}</Text>
      <Text style={styles.subtitle}>About the plant</Text>
      <Text style={styles.details}>{plant.description}</Text>
      <Text style={styles.subtitle}>Water Info</Text>
      <Text style={styles.details}>{plant.waterinfo}</Text>
      <Text style={styles.subtitle}>Light requirements</Text>
      <Text style={styles.details}>{plant.lightrequirements}</Text>
      <Text style={styles.subtitle}>Potting</Text>
      <Text style={styles.details}>{plant.potting}</Text>

      {/* Save Plant Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSavePlantClick} disabled={saving}>
        <Text style={styles.saveButtonText}>Save Plant</Text>
      </TouchableOpacity>

      {/* Modal for the overlay effect */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Plant Saved!</Text>
            <Text style={styles.modalSubtitle}>Choose your next action:</Text>

            <TouchableOpacity style={styles.modalButton} onPress={() => logWatering(0)}>
              <Text style={styles.modalButtonText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => logWatering(1)}>
              <Text style={styles.modalButtonText}>Yesterday</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => logWatering(3)}>
              <Text style={styles.modalButtonText}>3 Days Ago</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => logWatering(7)}>
              <Text style={styles.modalButtonText}>1 Week Ago</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => logWatering(14)}>
              <Text style={styles.modalButtonText}>2 Weeks Ago</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  details: {
    fontSize: 16,
    marginVertical: 2,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
