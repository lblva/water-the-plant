import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Api'; // Your API URL

type Plant = {
  _id: string;
  name: string;
  image: string;
};

export default function MyPlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await AsyncStorage.getItem('userId');
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserId(parsedUser.id);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchPlants = async () => {
      if (userId) {
        try {
          const response = await fetch(`${API_URL}/users/${userId}/plants`);
          const data = await response.json();
          setPlants(data); // Set the plants state with the received data
        } catch (error) {
          Alert.alert('Error', 'Failed to load plants');
        }
      }
    };

    fetchPlants();
  }, [userId]);
  
  return (
    <View>
      <View style={styles.editContainer}>
        <ThemedText type="defaultSemiBold">My plants</ThemedText>
        <Image style={styles.edit} source={require('@/assets/images/edit_icon.png')} />
      </View>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>My Plants</Text>
        <View style={styles.plantList}>
          {plants.map((plant) => (
            <TouchableOpacity key={plant._id} style={styles.card}>
              <Image source={{ uri: plant.image }} style={styles.image} />
              <Text style={styles.plantName}>{plant.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
    
    editContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    
    plantsContainer: {
      backgroundColor: 'rgba(232, 239, 225, 1)'
    },

    edit: {
      width: 24,
      height: 24,
    },
    container: {
      padding: 20,
      backgroundColor: 'white',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    plantList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    card: {
      width: '48%',
      backgroundColor: '#f8f8f8',
      borderRadius: 10,
      marginBottom: 20,
      alignItems: 'center',
      padding: 10,
    },
    image: {
      width: '100%',
      height: 150,
      borderRadius: 10,
      resizeMode: 'cover',
    },
    plantName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
    },
  });
  