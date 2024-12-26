import { useState, useEffect } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import useUserGet from '@/data/user-get';
import usePlants from '@/data/plants';  // Your existing usePlants hook
import { API_URL } from '@/constants/Api';  // Make sure you have API_URL

type Plant = {
  _id: string;
  name: string;
  image: string;
};

export default function MyPlants() {
  const params = useLocalSearchParams();
  const { data: userData, isLoading: userLoading, isError: userError } = useUserGet(params.userId);
  const { data: allPlants, isLoading: plantsLoading, isError: plantsError } = usePlants();
  const [userPlants, setUserPlants] = useState<Plant[]>([]);
  const [modalVisible, setModalVisible] = useState(false);  // State to control modal visibility
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

  // Log modal visibility when it changes
  useEffect(() => {
    console.log('Modal Visible:', modalVisible);  // Log the modal visibility state after it changes
  }, [modalVisible]);  // This will run whenever modalVisible changes

  if (userLoading || plantsLoading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (userError || plantsError) {
    return (
      <SafeAreaView>
        <Text>Error loading data!</Text>
      </SafeAreaView>
    );
  }

  const handlePlantSelect = (plantId: string) => {
    setSelectedPlants((prevSelected) => {
      if (prevSelected.includes(plantId)) {
        return prevSelected.filter((id) => id !== plantId);  // Deselect the plant
      } else {
        return [...prevSelected, plantId];  // Select the plant
      }
    });
  };

  const handleDeletePlants = async () => {
    if (selectedPlants.length === 0) {
      Alert.alert('No plants selected', 'Please select at least one plant to delete.');
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/users/${params.userId}/plants`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plantIds: selectedPlants }),
      });
  
      // Log the response to check for any errors or additional info
      const responseText = await response.text();  // Get the response body as text
      console.log('API Response:', responseText);  // Log the response text for debugging
  
      if (response.ok) {
        Alert.alert('Success', 'Selected plants have been deleted.');
  
        // Remove the deleted plants from the current userPlants state
        setUserPlants((prevUserPlants) => 
          prevUserPlants.filter((plant) => !selectedPlants.includes(plant._id))
        );
  
        // Close the modal and reset selected plants
        setModalVisible(false);
        setSelectedPlants([]);  // Clear the selected plants
      } else {
        Alert.alert('Error', `Failed to delete plants: ${responseText}`);
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred while deleting plants: ${(error as Error).message}`);
    }
  };
  
  

  const handleEditButtonPress = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleButtonContainer}>
        <Text style={styles.title}>My Plants</Text>
        {/* Edit button that logs modal visibility */}
        <TouchableOpacity onPress={handleEditButtonPress}>
          <Image source={require('@/assets/images/edit_icon.png')} style={styles.edit} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer}>
        {userPlants.map((plant) => (
          <View key={plant._id} style={styles.plantContainer}>
            <Image source={{ uri: plant.image }} style={styles.image} />
            <Text style={styles.plantTitle}>{plant.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Modal for deleting plants */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select plants to delete</Text>
            <ScrollView>
              {userPlants.map((plant) => (
                <View key={plant._id} style={styles.plantItem}>
                  {/* Replacing CheckBox with TouchableOpacity */}
                  <TouchableOpacity onPress={() => handlePlantSelect(plant._id)} style={styles.selectButton}>
                    <Image source={{ uri: plant.image }} style={styles.image} />
                    <Text style={styles.plantTitle}>{plant.name}</Text>
                    <Text style={styles.plantTitle}>
                      {selectedPlants.includes(plant._id) ? 'Selected' : 'Not Selected'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePlants}>
              <Text style={styles.deleteButtonText}>Delete Selected Plants</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 100,
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
  edit: {
    width: 30,
    height: 30,
    marginRight: 3,
  },
  listContainer: {
    marginBottom: 160,
  },
  plantTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 7,
  },
  plantContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
    paddingVertical: 15,
    marginBottom: 10,
    backgroundColor: '#E8EFE1',
    borderRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  plantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
