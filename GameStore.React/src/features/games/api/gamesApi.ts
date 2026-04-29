import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, BASE_URL } from '@/shared/api/client';
import type { CreateGameDto, GameDetailsDto, GameSummaryDto, UpdateGameDto } from '../types';

export function useGames() {
  return useQuery<GameSummaryDto[]>({
    queryKey: ['games'],
    queryFn: () => apiClient.get<GameSummaryDto[]>('/games'),
  });
}

export function useGame(id: number) {
  return useQuery<GameDetailsDto>({
    queryKey: ['game', id],
    queryFn: () => apiClient.get<GameDetailsDto>(`/games/${id}`),
    enabled: Number.isFinite(id),
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();
  return useMutation<GameDetailsDto, Error, CreateGameDto>({
    mutationFn: (data) => apiClient.post<GameDetailsDto>('/games', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['games'] });
      toast.success('Game created successfully!');
    },
    onError: () => {
      toast.error('Failed to create game.');
    },
  });
}

export function useUpdateGame(id: number) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateGameDto>({
    mutationFn: (data) => apiClient.put(`/games/${id}`, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['games'] });
      void queryClient.invalidateQueries({ queryKey: ['game', id] });
      toast.success('Game updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update game.');
    },
  });
}

export function useUploadGameImage(id: number) {
  const queryClient = useQueryClient();
  return useMutation<GameDetailsDto, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      // fetch used directly — apiClient sets Content-Type: application/json which
      // corrupts the multipart boundary. Browser sets the correct boundary when
      // Content-Type is omitted and the body is FormData.
      const response = await fetch(`${BASE_URL}/games/${id}/image`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const body: { message?: string } = await response.json().catch(() => ({}));
        throw new Error(body.message ?? 'Upload failed');
      }
      return response.json() as Promise<GameDetailsDto>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['games'] });
      void queryClient.invalidateQueries({ queryKey: ['game', id] });
      toast.success('Image uploaded.');
    },
    onError: () => {
      toast.error('Failed to upload image.');
    },
  });
}

export function useDeleteGame() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => apiClient.delete(`/games/${id}`),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.removeQueries({ queryKey: ['game', id] });
      toast.success('Game deleted.');
    },
    onError: () => {
      toast.error('Failed to delete game.');
    },
  });
}
