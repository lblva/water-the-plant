import { useState, useEffect } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import useUserGet from '@/data/user-get';
import usePlants from '@/data/plants'; // Your existing usePlants hook
import { API_URL } from '@/constants/Api'; // Make sure you have API_URL



type Plant = {
  _id: string;
  name: string;
  image: string;
};

export default function MyPlants() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { data: userData, isLoading: userLoading, isError: userError } = useUserGet(params.userId);
  const { data: allPlants, isLoading: plantsLoading, isError: plantsError } = usePlants(); // Removed refetch here
  const [userPlants, setUserPlants] = useState<Plant[]>([]);
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);  // State to track selected plant IDs
  const [modalVisible, setModalVisible] = useState(false);  // State to control modal visibility

  useEffect(() => {
    if (userData && allPlants) {
      const filteredPlants = allPlants.filter((plant: any) =>
        userData.plants.includes(plant._id)
      );
      setUserPlants(filteredPlants);
    }
  }, [userData, allPlants]);  // Only run this when userData or allPlants changes

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
  
      const responseText = await response.text();
      console.log('API Response:', responseText);
  
      if (response.ok) {
        Alert.alert('Success', 'Selected plants have been deleted.');
  
        // Cast navigation to the correct type before using replace
        (navigation as any).replace(
          navigation.getState().routes[navigation.getState().index].name
        );
        
      } else {
        Alert.alert('Error', `Failed to delete plants: ${responseText}`);
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred while deleting plants: ${(error as Error).message}`);
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleButtonContainer}>
        <Text style={styles.title}>My Plants</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
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
              <TouchableOpacity
                onPress={() =>
                  setSelectedPlants((prev) =>
                    prev.includes(plant._id)
                      ? prev.filter((id) => id !== plant._id)
                      : [...prev, plant._id]
                  )
                }
                style={styles.selectButton}
              >
                <Image source={{ uri: plant.image }} style={styles.image} />
                <Text style={styles.plantTitle}>{plant.name}</Text>
              </TouchableOpacity>

              {/* Circle with icon */}
              <TouchableOpacity
                style={[styles.circle, selectedPlants.includes(plant._id) && styles.disabledCircle]}
                onPress={() => setSelectedPlants((prev) =>
                  prev.includes(plant._id) ? prev.filter((id) => id !== plant._id) : [...prev, plant._id]
                )}
              >
                <Icon
                  name={selectedPlants.includes(plant._id) ? "check" : "circle-o"}
                  size={20}
                  color={selectedPlants.includes(plant._id) ? "#4CAF50" : "#ccc"}
                />
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
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  titleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  edit: {
    width: 24,
    height: 24,
  },
  listContainer: {
    marginTop: 20,
  },
  plantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  plantTitle: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Position content at the bottom
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Make the rest of the screen transparent
  },
  modalContent: {
    width: '100%',
    height: '80%', // Adjust this height as needed
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  
  modalTitle: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  plantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
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
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectText: {
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 13,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#F1F0F0',
    padding: 13,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 25,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
