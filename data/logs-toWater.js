import fetcher from './_fetcher';
import useSWR from 'swr';
import { API_URL } from '@/constants/Api';

export default function useToWater(userId) {
    const { data, error, isLoading } = useSWR(`${API_URL}/logs/user/${userId}/to-water`, fetcher);

    return {
        data,
        isLoading,
        isError: error,
    };
}
