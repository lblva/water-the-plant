import { Image, StyleSheet, Text, View, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useUsers from '@/data/users';
import LogoutButton from '@/components/logoutButton';


export default function HomeScreen() {
  const {data, isLoading, isError} = useUsers();
  console.log(data);
  // Use the theme to set the background color dynamically

  if (isLoading && !data) {
        return <Text>Loading...</Text>;
        }
    
  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <Link href={`/`} style={[styles.arrow]}>
        <Image source={require('@/assets/images/arrow.png')}  />
      </Link>
      <Text style={styles.title}> Account </Text>
      <View style={[styles.profileImageContainer]}>
        <Image source={require('@/assets/images/profile.png')} style={[styles.profileImage]} />
      </View>
      
      <Text style={styles.inputTitle} >Name</Text>
      <View style={styles.inputContainer}>
      <Image
        source={require('@/assets/images/naam-icon.png')} // Replace with your image path
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder="name"
        placeholderTextColor="gray"
      />
      </View>

      <Text style={styles.inputTitle}>E-mail</Text>
      <View style={styles.inputContainer}>
      <Image
        source={require('@/assets/images/email-icon.png')} // Replace with your image path
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder="email"
        placeholderTextColor="gray"
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
    padding: 25, // Apply 15px padding to the entire screen
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
    },
    inputTitle: {
        fontSize: 16,
        marginTop: 20,
    },
    inputContainer: {
      flexDirection: 'row', // Align image and input horizontally
      alignItems: 'center', // Align items vertically within the container
      borderWidth: 1,
      height: 40,
      borderColor: '#E8E8E8',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 7,
      backgroundColor: '#fff', // Optional: Add a background color
    },
    icon: {
      width: 20, // Adjust width of the image
      height: 20, // Adjust height of the image
      marginRight: 10, // Space between image and TextInput
    },
    input: {
      flex: 1, // Allow the TextInput to take the remaining space
      fontSize: 16,
      color: 'black',
    },
});
