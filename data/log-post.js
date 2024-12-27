import { API_URL } from '@/constants/Api';
import useSWR from 'swr';

// Fetch data from the API using fetch
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
};

export default function useLogs() {
  // Fetch logs data using SWR
  const { data, error, isLoading } = useSWR(`${API_URL}/logs`, fetcher);

  // Function to send log data to the server
  const logData = async (days, plantId, userId) => {
    try {
      const response = await fetch(`${API_URL}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          days,            // Days to track (0 for watered today)
          plantId,         // Plant ID
          user: userId,    // User ID (to associate the log with the user)
          wateredAt: new Date().toISOString(),  // The exact timestamp when watered
        }),
      });

      const responseText = await response.text();
      if (response.ok) {
        console.log(`Logged watering for plant ${plantId}`);
      } else {
        const errorData = JSON.parse(responseText);
        console.error(`Failed to log data. ${errorData.message || ''}`);
      }
    } catch (error) {
      console.error(`An error occurred while logging data: ${error.message}`);
    }
  };

  return {
    data,
    isLoading,
    isError: error,
    logData,  // Return the logData function so it can be used in components
  };
}
