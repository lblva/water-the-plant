// import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
// import { useEffect, useState } from 'react';
// import useToWater from '@/data/logs-toWater';



// export default function ToWater({ userId }) {

//   const { data: plants, isLoading, isError } = useToWater(userId);

//     if (isLoading) return <Text>Loading...</Text>;
//     if (isError) return <Text>Error fetching data</Text>;

//     const renderPlantCard = ({ item }) => (
//         <View style={styles.card}>
//             <Image source={{ uri: item.image }} style={styles.image} />
//             <Text style={styles.plantName}>{item.plantName}</Text>
//             <Text style={styles.nextWater}>
//                 {item.nextWateringDate
//                     ? `Next water: ${new Date(item.nextWateringDate).toLocaleDateString()}`
//                     : 'Never watered'}
//             </Text>
//         </View>
//     );

//   return (
//     <View>
//       <Text style={styles.title}>To water</Text>
//       <FlatList
//             data={plants}
//             renderItem={renderPlantCard}
//             keyExtractor={(item) => item.plantId.toString()}
//         />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
// title: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginVertical: 10,
// },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 10,
//     marginHorizontal: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 5 },
// },
// image: {
//     width: '100%',
//     height: 150,
//     borderRadius: 10,
// },
// plantName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 10,
// },
// nextWater: {
//     fontSize: 16,
//     marginTop: 5,
// },
// });
  
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
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleButtonContainer}>
        <Text style={styles.title}>Plants to water</Text>
      </View>

      <ScrollView horizontal={true}>
        <TouchableOpacity style={styles.selectButton}>

        </TouchableOpacity>
        {userPlants.map((plant) => (
          <View key={plant._id} style={styles.plantContainer}>
            <Image source={{ uri: plant.image }} style={styles.image} />
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
  edit: {
    width: 30,
    height: 30,
    marginRight: 3,
  },
  plantTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 7,
  },
  plantContainer: {
    alignItems: 'center',
    padding: 10,
    paddingVertical: 15,
    margin: 10,
    backgroundColor: '#E8EFE1',
    borderRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
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
});
