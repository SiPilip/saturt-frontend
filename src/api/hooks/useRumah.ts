import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import type { 
  RumahPaginationResponse, 
  RiwayatPenghuniResponse, 
  RiwayatPembayaranResponse,
  RumahPayload
} from '@/types/rumah';

const RUMAH_KEYS = {
  all: ['rumah'] as const,
  list: (page: number, search: string, limit: number, sortBy?: string, sortDir?: string) => 
    [...RUMAH_KEYS.all, { page, search, limit, sortBy, sortDir }] as const,
  riwayatPenghuni: (id: string, page: number, limit: number, sortBy?: string, sortDir?: string) => 
    [...RUMAH_KEYS.all, 'riwayat-penghuni', id, { page, limit, sortBy, sortDir }] as const,
  riwayatPembayaran: (id: string, page: number, limit: number, sortBy?: string, sortDir?: string) => 
    [...RUMAH_KEYS.all, 'riwayat-pembayaran', id, { page, limit, sortBy, sortDir }] as const,
};

export const useGetRumah = (page: number = 1, search: string = '', limit: number = 15, sortBy?: string, sortDir?: string) => {
  return useQuery({
    queryKey: RUMAH_KEYS.list(page, search, limit, sortBy, sortDir),
    queryFn: async () => {
      const { data } = await api.get<RumahPaginationResponse>('/rumah/pagination', {
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

export const useGetRiwayatPenghuni = (id: string | undefined, page: number = 1, limit: number = 15, sortBy?: string, sortDir?: string) => {
  return useQuery({
    queryKey: RUMAH_KEYS.riwayatPenghuni(id!, page, limit, sortBy, sortDir),
    queryFn: async () => {
      const { data } = await api.get<RiwayatPenghuniResponse>(`/rumah/${id}/riwayat-penghuni/pagination`, {
        params: { page, limit, sort_by: sortBy, sort_dir: sortDir },
      });
      return data;
    },
    enabled: !!id,
  });
};

export const useGetRiwayatPembayaran = (id: string | undefined, page: number = 1, limit: number = 15, sortBy?: string, sortDir?: string) => {
  return useQuery({
    queryKey: RUMAH_KEYS.riwayatPembayaran(id!, page, limit, sortBy, sortDir),
    queryFn: async () => {
      const { data } = await api.get<RiwayatPembayaranResponse>(`/rumah/${id}/riwayat-pembayaran/pagination`, {
        params: { page, limit, sort_by: sortBy, sort_dir: sortDir },
      });
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateRumah = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RumahPayload) => {
      const formData = new FormData();
      formData.append('blok_nomor', payload.blok_nomor);
      formData.append('is_filled', payload.is_filled ? '1' : '0');

      const { data } = await api.post('/rumah', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RUMAH_KEYS.all });
    },
  });
};

export const useUpdateRumah = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<RumahPayload> }) => {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      
      if (payload.blok_nomor) formData.append('blok_nomor', payload.blok_nomor);
      if (payload.is_filled !== undefined) formData.append('is_filled', payload.is_filled ? '1' : '0');

      const { data } = await api.post(`/rumah/${id}`, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RUMAH_KEYS.all });
    },
  });
};

export const useDeleteRumah = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/rumah/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RUMAH_KEYS.all });
    },
  });
};

export const useAssignPenghuni = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ idRumah, payload }: { idRumah: string; payload: { id_penghuni: string; tanggal_masuk: string } }) => {
      const { data } = await api.post(`/rumah/${idRumah}/penghuni`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RUMAH_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['penghuni'] });
    },
  });
};

export const useCheckoutPenghuni = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ idRumah, idPenghuni, payload }: { idRumah: string; idPenghuni: string; payload: { tanggal_keluar: string } }) => {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('tanggal_keluar', payload.tanggal_keluar);

      const { data } = await api.post(`/rumah/${idRumah}/penghuni/${idPenghuni}`, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RUMAH_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['penghuni'] });
    },
  });
};
