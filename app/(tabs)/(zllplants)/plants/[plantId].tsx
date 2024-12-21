// plantId.tsx
import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import usePlants from '@/data/plants';
import { useLocalSearchParams } from 'expo-router';


export default function PlantDetail() {
  const { plantId } = useLocalSearchParams();
  const { data, isLoading, isError } = usePlants();


  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading data</Text>;
  }

  // Find the plant by its ID
  const plant = data.find((item: any) => item._id === plantId);

  if (!plant) {
    return <Text>Plant not found</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: plant.image }} style={styles.image} />
      <Text style={styles.name}>{plant.name}</Text>
      <Text style={styles.subtitle}>About the plant</Text>
      <Text style={styles.details}>{plant.description}</Text>
      <Text style={styles.subtitle}>Water Info</Text>
      <Text style={styles.details}>{plant.waterinfo}</Text>
      <Text style={styles.subtitle}>Light requirments</Text>
      <Text style={styles.details}>{plant.lightrequirements}</Text>
      <Text style={styles.subtitle}>Potting</Text>
      <Text style={styles.details}>{plant.potting}</Text>
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
  description: {
    fontSize: 16,
    marginVertical: 5,
  },
  details: {
    fontSize: 16,
    marginVertical: 2,
    
  },
});
