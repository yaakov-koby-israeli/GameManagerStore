import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { GenreDto } from '../types';

export function useGenres() {
  return useQuery<GenreDto[]>({
    queryKey: ['genres'],
    queryFn: () => apiClient.get<GenreDto[]>('/genres'),
  });
}
