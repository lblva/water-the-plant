import { Image, StyleSheet, Text, View, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useUsers from '@/data/users';
import LogoutButton from '@/components/logoutButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const { data, isLoading, isError } = useUsers();
  const [userId, setUserId] = useState<any>(''); // Initialize userId state
  const [user, setUser] = useState<any>(null);  // Initialize user state
  const [name, setName] = useState<string>(''); // State for the name input
  const [email, setEmail] = useState<string>(''); // State for the email input

  // Fetch the userId from AsyncStorage
  useEffect(() => {
    const getUserId = async () => {
      const user = await AsyncStorage.getItem('userId');
      setUserId(user);
    };

    getUserId();
  }, []);

  // Find the user based on userId and set user
  useEffect(() => {
    if (data && userId) {
      const id = JSON.parse(userId)?.id; // Make sure userId is parsed correctly
      const foundUser = data.find((user: any) => user._id === id);
      setUser(foundUser);
      if (foundUser) {
        setName(foundUser.name); // Set the name state
        setEmail(foundUser.email); // Set the email state
      }
    }
  }, [data, userId]);

  if (isLoading || !user) {
    return <Text>Loading...</Text>;
  }

  // Use the profile picture if available, otherwise use a fallback image
  const profilePicture = user?.profilePicture || 'https://via.placeholder.com/35';

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Link href={`/`} style={styles.arrow}>
        <Image source={require('@/assets/images/arrow.png')} />
      </Link>
      <Text style={styles.title}>Account</Text>

      {/* Profile image */}
      <View style={styles.profileImageContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: profilePicture }}
        />
      </View>

      <Text style={styles.inputTitle}>Name</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('@/assets/images/naam-icon.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="name"
          placeholderTextColor="gray"
          value={name} // Bind the input value to the name state
          onChangeText={setName} // Update the state when the user types
        />
      </View>

      <Text style={styles.inputTitle}>E-mail</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('@/assets/images/email-icon.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="email"
          placeholderTextColor="gray"
          value={email} // Bind the input value to the email state
          onChangeText={setEmail} // Update the state when the user types
        />
      </View>

      <LogoutButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  arrow: {
    width: 34,
    height: 24,
    marginBottom: 10,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // To make the profile picture circular
  },
  inputTitle: {
    fontSize: 16,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 40,
    borderColor: '#E8E8E8',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 7,
    backgroundColor: '#fff',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
});
