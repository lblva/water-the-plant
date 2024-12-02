/*import fetcher from './_fetcher'
import useSWR from 'swr'
import { API_URL } from '@/constants/Api'

export default function usePlants () {
  const { data, error, isLoading } = useSWR(`${API_URL}/plants`, fetcher)
 
  return {
    data,
    isLoading,
    isError: error
  }
}*/

import fetcher from './_fetcher'
import useSWR from 'swr'
import { API_URL } from '@/constants/Api'

export default function usePlants () {
  const { data, error, isLoading } = useSWR(`${API_URL}/plants`, fetcher)
 
  return {
    data,
    isLoading,
    isError: error
  }
}