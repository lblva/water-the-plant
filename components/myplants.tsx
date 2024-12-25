import { useState, useEffect } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import useUserGet from '@/data/user-get';
import usePlants from '@/data/plants';  // Your existing usePlants hook

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

  useEffect(() => {
    if (userData && allPlants) {
      // Filter the allPlants data based on the user.plants array
      const filteredPlants = allPlants.filter((plant) =>
        userData.plants.includes(plant._id)
      );
      setUserPlants(filteredPlants);
    }
  }, [userData, allPlants]);

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

  if (!userData || userPlants.length === 0) {
    return (
      <SafeAreaView>
        <Text>No plants found for this user!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container }>
      <ScrollView>
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
    flex: 1,  
    marginBottom: 100,
  }, 
  plantTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginLeft: 7,
  },
  plantContainer: { 
    flexDirection: 'row',
    justifyContent: 'flex-start',  // Ensures items are aligned at the top vertically
    alignItems: 'flex-start',      // Aligns the text at the top along the cross axis
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
    marginRight: 10 
  },
});