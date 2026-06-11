import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import type { PemasukanPaginationResponse, PemasukanPayload } from '@/types/pemasukan';

export const PEMASUKAN_KEYS = {
  all: ['pemasukan'] as const,
  list: (page: number, search: string, limit: number, jenis?: string, sortBy?: string, sortDir?: string) => 
    [...PEMASUKAN_KEYS.all, { page, search, limit, jenis, sortBy, sortDir }] as const,
};

export const useGetPemasukan = (
  page: number = 1, 
  search: string = '', 
  limit: number = 15, 
  jenis?: string,
  sortBy?: string, 
  sortDir?: string
) => {
  return useQuery({
    queryKey: PEMASUKAN_KEYS.list(page, search, limit, jenis, sortBy, sortDir),
    queryFn: async () => {
      const { data } = await api.get<PemasukanPaginationResponse>('/keuangan/pemasukan/pagination', {
        params: { 
          page, 
          search, 
          limit,
          jenis: jenis && jenis !== 'all' ? jenis : undefined,
          sort_by: sortBy,
          sort_dir: sortDir
        },
      });
      return data;
    },
  });
};

export const useCreatePemasukan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PemasukanPayload) => {
      const { data } = await api.post('/keuangan/pemasukan', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEMASUKAN_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdatePemasukan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<PemasukanPayload> }) => {
      // POST + _method=PATCH
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      
      if (payload.nama) formData.append('nama', payload.nama);
      if (payload.biaya !== undefined) formData.append('biaya', payload.biaya.toString());
      if (payload.jenis) formData.append('jenis', payload.jenis);
      if (payload.tanggal) formData.append('tanggal', payload.tanggal);

      const { data } = await api.post(`/keuangan/pemasukan/${id}`, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEMASUKAN_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeletePemasukan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/keuangan/pemasukan/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEMASUKAN_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
