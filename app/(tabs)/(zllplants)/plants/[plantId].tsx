import { useState, useEffect } from 'react';
import { StyleSheet, Text, Image, ScrollView, Button, Alert } from 'react-native';
import usePlants from '@/data/plants';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Api';

export default function PlantDetail() {
  const { plantId } = useLocalSearchParams(); // Get plantId from route params
  const { data, isLoading, isError } = usePlants(); // Fetch plant data
  const [userId, setUserId] = useState(null); // Store userId in state
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const user = await AsyncStorage.getItem('userId');
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserId(parsedUser.id); // Save userId in state
      }
    };
    getUserId();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading data</Text>;
  }

  const plant = data.find((item: any) => item._id === plantId);

  if (!plant) {
    return <Text>Plant not found</Text>;
  }

  const savePlant = async () => {
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
  
      // Log the response to check for unexpected HTML content
      const responseText = await response.text(); // Get raw response text
      console.log('Response:', responseText);
  
      if (response.ok) {
        Alert.alert('Success', 'Plant saved to your collection!');
      } else {
        const errorData = JSON.parse(responseText); // Try parsing the response text
        Alert.alert('Error', `Failed to save the plant. ${errorData.message || ''}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', `An error occurred while saving the plant. ${error.message}`);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
      
    } finally {
      setSaving(false);
    }
  };
  
  console.log("plantId:", plantId);
  console.log("userId:", userId);
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

      <Button
        title={saving ? 'Saving...' : 'Save this plant'}
        onPress={savePlant}
        disabled={saving}
      />
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
});
