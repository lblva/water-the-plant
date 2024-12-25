import mutation from './_mutation';
import useSWRMutation from 'swr/mutation'
import { API_URL } from '@/constants/Api'

export default function useUserPlantPut(id: any) {
  const { trigger, data, error, isMutating } = useSWRMutation(`${API_URL}/users/${id}/plants`, (url, { arg }: { arg: any }) => {
    return mutation(url, {
      method: 'PUT',
      body: arg, // { plantId: plantId, plantName: 'Name', plantImage: 'image_url' }
    });
  });

  return {
    data,
    isMutating,
    isError: error,
    trigger
  };
}
