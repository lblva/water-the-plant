import fetcher from './_fetcher';
import useSWR from 'swr';
import { API_URL } from '@/constants/Api';

export default function useToWater(userId) {
    const { data, error, isLoading, mutate } = useSWR(
        userId ? `${API_URL}/logs/user/${userId}/to-water` : null,
        fetcher
    );

    return {
        data,
        isLoading,
        isError: error,
        refetch: mutate, // Expose SWR's mutate function as refetch
    };
}
