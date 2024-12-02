import { Image, StyleSheet, TouchableOpacity, Alert, Text, Platform, } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor'; 
import { API_URL } from '@/constants/Api';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';


export default function LoginScreen() {
    const router = useRouter();

    useEffect(() => {
        const checkLogin = async () => {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                router.replace('/(tabs)');
            }
        };

        checkLogin();
    }, []);

    const handleGoogleLogin = async () => {
        try{
            const authUrl = `${API_URL}/auth/google`;
            const redirectUrl= AuthSession.makeRedirectUri();

            const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

            console.log(result);

            if (result.type === 'success') {
                //Handle the redirected URL
                const params = new URL(result.url).searchParams;

                //Extract usder ID or other paramaters (e.g. tokens, profile data)
                const user = params.get('user');// replace with correct parameter
                if (user) {
                    //Store the user ID
                    await AsyncStorage.setItem('userId', user);

                    //Navigate to tabs after succesful login
                    router.replace('/(tabs)');
                }
            } else {
                Alert.alert('Error', 'Failed to authenticate with Google');
            }


        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to authenticate with Google');
        }
    } 

return (
    <SafeAreaView style={[styles.mainContainer,]}>
        <TouchableOpacity onPress={() => handleGoogleLogin()}>
            <ThemedText type="defaultSemiBold">LOGIN WITH GOOGLE</ThemedText>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainContainer: {
    flex: 1,
    padding: 25, // Apply 15px padding to the entire screen
  }
});
