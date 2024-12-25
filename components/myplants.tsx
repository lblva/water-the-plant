import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import useUserGet from '@/data/user-get'; // Import your custom hook
import { useLocalSearchParams } from 'expo-router';

export default function MyPlants() {
  // Retrieve the userId from params (assuming it’s passed as a param)
  const params = useLocalSearchParams();
  const userId = params.userId; // Assuming the userId is available in params
  
  // Fetch user data using the userId
  const { data: user, isLoading, isError } = useUserGet(userId);

  if (isLoading || !user) {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !user.plants) {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text>Error fetching user data or plants.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>My Plants</Text>
        {user.plants.length > 0 ? (
          user.plants.map((plantId: string, index: number) => (
            <View key={index} style={styles.card}>
              <Text style={styles.plantText}>Plant ID: {plantId}</Text>
              {/* You can replace this with more plant data if you have it */}
            </View>
          ))
        ) : (
          <Text style={styles.noPlantsText}>You don’t have any plants yet!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  plantText: {
    fontSize: 16,
  },
  noPlantsText: {
    fontSize: 18,
    color: "#888",
  },
});
