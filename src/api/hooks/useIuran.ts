import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import type { IuranPaginationResponse, IuranPayload } from '@/types/iuran';

const IURAN_KEYS = {
  all: ['iuran'] as const,
  list: (page: number, search: string, limit: number, sortBy?: string, sortDir?: string) => 
    [...IURAN_KEYS.all, { page, search, limit, sortBy, sortDir }] as const,
};

export const useGetIuran = (page: number = 1, search: string = '', limit: number = 15, sortBy?: string, sortDir?: string) => {
  return useQuery({
    queryKey: IURAN_KEYS.list(page, search, limit, sortBy, sortDir),
    queryFn: async () => {
      const { data } = await api.get<IuranPaginationResponse>('/iuran/pagination', {
        params: { 
          page, 
          search, 
          limit,
          sort_by: sortBy,
          sort_dir: sortDir
        },
      });
      return data;
    },
  });
};

export const useCreateIuran = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IuranPayload) => {
      const formData = new FormData();
      formData.append('nama', payload.nama);
      formData.append('biaya', payload.biaya.toString());

      const { data } = await api.post('/iuran', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IURAN_KEYS.all });
    },
  });
};

export const useUpdateIuran = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<IuranPayload> }) => {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      
      if (payload.nama) formData.append('nama', payload.nama);
      if (payload.biaya !== undefined) formData.append('biaya', payload.biaya.toString());

      const { data } = await api.post(`/iuran/${id}`, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IURAN_KEYS.all });
    },
  });
};

export const useDeleteIuran = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/iuran/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IURAN_KEYS.all });
    },
  });
};
