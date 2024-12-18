import { View, Text, TextInput, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import React, { useState } from "react";
import usePlants from '@/data/plants';

export default function SearchBar() {
  const [filter, setFilter] = useState('');
  const { data, isLoading, isError } = usePlants();

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading plants</Text>;

  const filteredPlants = filter
    ? data.filter(plant => plant.name.toLowerCase().startsWith(filter.toLowerCase()))
    : [];


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor="gray"
        value={filter}
        onChangeText={setFilter} // Correct event handler
      />
      {filter && (
        <View style={styles.results}>
          {filteredPlants.slice(0, 10).map(plant => (
            <Link href={`/plants/${plant._id}`} key={plant._id} style={styles.resultLink}>
              <Text>{plant.name}</Text>
            </Link>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    padding: 20,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    color: 'black',
  },
  results: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    maxHeight: 200, // Limit height for scrollable list
  },
  resultLink: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    color: '#000',
  },
});
