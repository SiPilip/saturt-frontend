import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import type { PenghuniPaginationResponse, PenghuniPayload } from '@/types/penghuni';

const PENGHUNI_KEYS = {
  all: ['penghuni'] as const,
  list: (page: number, search: string, limit: number, sortBy?: string, sortDir?: string) => 
    [...PENGHUNI_KEYS.all, { page, search, limit, sortBy, sortDir }] as const,
};

export const useGetPenghuni = (page: number = 1, search: string = '', limit: number = 15, sortBy?: string, sortDir?: string) => {
  return useQuery({
    queryKey: PENGHUNI_KEYS.list(page, search, limit, sortBy, sortDir),
    queryFn: async () => {
      const { data } = await api.get<PenghuniPaginationResponse>('/penghuni/pagination', {
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

export const useCreatePenghuni = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PenghuniPayload) => {
      const formData = new FormData();
      formData.append('nama', payload.nama);
      formData.append('nik', payload.nik);
      formData.append('status_penghuni', payload.status_penghuni);
      formData.append('telephone', payload.telephone);
      // Backend mungkin membutuhkan string "1" atau "0" untuk boolean di FormData
      formData.append('is_menikah', payload.is_menikah ? '1' : '0');
      
      if (payload.foto_ktp) {
        formData.append('foto_ktp', payload.foto_ktp);
      }

      const { data } = await api.post('/penghuni', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENGHUNI_KEYS.all });
    },
  });
};

export const useUpdatePenghuni = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<PenghuniPayload> }) => {
      const formData = new FormData();
      
      // Method spoofing untuk Laravel jika menggunakan FormData pada PUT/PATCH request
      formData.append('_method', 'PATCH');
      
      if (payload.nama) formData.append('nama', payload.nama);
      if (payload.nik) formData.append('nik', payload.nik);
      if (payload.status_penghuni) formData.append('status_penghuni', payload.status_penghuni);
      if (payload.telephone) formData.append('telephone', payload.telephone);
      if (payload.is_menikah !== undefined) formData.append('is_menikah', payload.is_menikah ? '1' : '0');
      
      if (payload.foto_ktp) {
        formData.append('foto_ktp', payload.foto_ktp);
      }

      const { data } = await api.post(`/penghuni/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENGHUNI_KEYS.all });
    },
  });
};

export const useDeletePenghuni = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/penghuni/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENGHUNI_KEYS.all });
    },
  });
};
