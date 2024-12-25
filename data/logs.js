import fetcher from './_fetcher';
import useSWR from 'swr';
import { API_URL } from '@/constants/Api';

export default function useLogs() {
  const { data, error, isLoading } = useSWR(`${API_URL}/logs`, fetcher);

  // Function to send logs data with number of days
  const logData = async (days, plantId, userId) => {
    try {
      const response = await fetch(`${API_URL}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          days,            // Days to track
          plantId,         // Plant ID
          user: userId     // User ID (to associate the log with the user)
        }),
      });
  
      const responseText = await response.text();
      if (response.ok) {
        console.log(`Logged ${days} days for plant ${plantId}`);
      } else {
        const errorData = JSON.parse(responseText);
        console.error(`Failed to log data. ${errorData.message || ''}`);
      }
    } catch (error) {
      console.error(`An error occurred while logging data. ${error.message}`);
    }
  };
  
  return {
    data,
    isLoading,
    isError: error,
    logData,
  };
}
