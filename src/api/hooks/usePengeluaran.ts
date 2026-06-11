import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import type { PengeluaranPaginationResponse, PengeluaranPayload } from '@/types/pengeluaran';

export const PENGELUARAN_KEYS = {
  all: ['pengeluaran'] as const,
  list: (page: number, search: string, limit: number, jenis?: string, sortBy?: string, sortDir?: string) => 
    [...PENGELUARAN_KEYS.all, { page, search, limit, jenis, sortBy, sortDir }] as const,
};

export const useGetPengeluaran = (
  page: number = 1, 
  search: string = '', 
  limit: number = 15, 
  jenis?: string,
  sortBy?: string, 
  sortDir?: string
) => {
  return useQuery({
    queryKey: PENGELUARAN_KEYS.list(page, search, limit, jenis, sortBy, sortDir),
    queryFn: async () => {
      const { data } = await api.get<PengeluaranPaginationResponse>('/keuangan/pengeluaran/pagination', {
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

export const useCreatePengeluaran = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PengeluaranPayload) => {
      const { data } = await api.post('/keuangan/pengeluaran', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENGELUARAN_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdatePengeluaran = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<PengeluaranPayload> }) => {
      // Because we use POST with _method=PATCH
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      
      if (payload.nama) formData.append('nama', payload.nama);
      if (payload.biaya !== undefined) formData.append('biaya', payload.biaya.toString());
      if (payload.jenis) formData.append('jenis', payload.jenis);
      if (payload.tanggal) formData.append('tanggal', payload.tanggal);

      const { data } = await api.post(`/keuangan/pengeluaran/${id}`, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENGELUARAN_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeletePengeluaran = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/keuangan/pengeluaran/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENGELUARAN_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
