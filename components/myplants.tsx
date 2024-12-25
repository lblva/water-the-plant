import { useState, useEffect } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView } from 'react-native';
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
    <SafeAreaView>
      <ScrollView>
        {userPlants.map((plant) => (
          <View key={plant._id} style={{ marginBottom: 20 }}>
            <Text>{plant.name}</Text>
            <Image source={{ uri: plant.image }} style={{ width: 100, height: 100 }} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
