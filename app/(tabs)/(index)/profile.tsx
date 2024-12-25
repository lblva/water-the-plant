import { Image, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoutButton from '@/components/logoutButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import useUserGet from '@/data/user-get';
import useUserPut from '@/data/user-put';
import { useLocalSearchParams } from 'expo-router'

export default function HomeScreen() {
  
  const [email, setEmail] = useState<string>(''); // State for the email input ///  DEZE MAG MSS WEG
  const [user, setUser] = useState<any>(null);  // Initialize user state

  const params = useLocalSearchParams();
  const { data, isLoading, isError } = useUserGet(params.userId);
  const { trigger, isMutating } = useUserPut(params.userId);
  const [name, setName] = useState('');

useEffect(() => {
    if (data) {
      setName(data.name);
    }
  }, [data]);

  if (isMutating || isLoading || !data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Use the profile picture if available, otherwise use a fallback image
  const profilePicture = data?.profilePicture || 'https://via.placeholder.com/35';

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
         <Button title="Save" onPress={() => trigger({name})} />
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
          value={data.email} // Bind the input value to the email state
          editable={false}
        />
      </View>

      <LogoutButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor:"#ccc",
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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