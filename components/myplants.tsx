import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
export default function MyPlants() {
  return (
    <View>
        <View style={styles.editContainer}>
            <ThemedText type="defaultSemiBold">My plants</ThemedText>
            <Image style={styles.edit} source={require('@/assets/images/edit_icon.png')} />
        </View>
        <View style={styles.plantsContainer}>
            <ThemedText type="defaultSemiBold">test</ThemedText>
        </View>
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
    }
  });
  