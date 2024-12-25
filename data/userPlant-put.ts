import mutation from './_mutation';  // Import your mutation logic
import { API_URL } from '@/constants/Api';

const updateUserPlants = async (userId: string, plantId: string) => {
  const url = `${API_URL}/users/${userId}`;
  const options = {
    method: 'PATCH', // Use PATCH to update the user's plant list
    body: JSON.stringify({
      $push: { plants: plantId },  // Assuming you're appending to the plants array
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await mutation(url, options);  // Use the mutation for the API request
    return response;  // Expect the updated user object or a success message from the server
  } catch (error) {
    console.error('Error updating user plants:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

export default updateUserPlants;
