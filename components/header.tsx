import { StyleSheet, View, Image, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import useUsers from '@/data/users';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header(props: any) {
    const [userId, setUserId] = useState<any>('');

    async function getUserId() {    
        const user = await AsyncStorage.getItem('userId');
        setUserId(user);
    }
    useEffect(() => {
        getUserId();
    } , []);


    console.log('User data:', userId);
    console.log('all User data:', props.data);

    const id = userId ? JSON.parse(userId).id : null;
    const user = props.data?.find((user: any) => user._id === id);
    const username = user?.name || 'User';
    
    const profilePicture = user?.profilePicture || 'https://via.placeholder.com/35'; // Fallback image

  return (
    <View style={styles.container}>
      <View>
        <ThemedText style={styles.title}>Good morning, {username}</ThemedText>
      </View>
      <View style={styles.profileContainer}>
        <Link href={`../profile/`}>
        <Image
          style={styles.profile}
          source={{ uri: profilePicture }}
        />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    
    profileContainer: {
        backgroundColor: 'rgb(255, 255, 255)'
      },

    profile: {
      width: 35,
      height: 35,
      borderRadius: 50,
    }
  });
  