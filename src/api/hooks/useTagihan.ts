import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import type { TagihanPaginationResponse, GenerateTagihanPayload } from '@/types/tagihan';

const TAGIHAN_KEYS = {
  all: ['tagihan'] as const,
  list: (
    page: number, 
    limit: number, 
    sortBy?: string, 
    sortDir?: string,
    bulan?: number,
    tahun?: number,
    isPaid?: boolean | null,
    id_rumah?: string
  ) => 
    [...TAGIHAN_KEYS.all, { page, limit, sortBy, sortDir, bulan, tahun, isPaid, id_rumah }] as const,
};

export const useGetTagihan = (
  page: number = 1, 
  limit: number = 15, 
  sortBy?: string, 
  sortDir?: string,
  bulan?: number,
  tahun?: number,
  isPaid?: boolean | null,
  id_rumah?: string
) => {
  return useQuery({
    queryKey: TAGIHAN_KEYS.list(page, limit, sortBy, sortDir, bulan, tahun, isPaid, id_rumah),
    queryFn: async () => {
      // Build params dynamically
      const params: Record<string, any> = { 
        page, 
        limit,
        sort_by: sortBy,
        sort_dir: sortDir
      };
      
      if (bulan) params.bulan = bulan;
      if (tahun) params.tahun = tahun;
      if (isPaid !== null && isPaid !== undefined) params.is_paid = isPaid;
      if (id_rumah) params.id_rumah = id_rumah;

      const { data } = await api.get<TagihanPaginationResponse>('/tagihan', { params });
      return data;
    },
  });
};

export const useGenerateTagihan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: GenerateTagihanPayload) => {
      const formData = new FormData();
      formData.append('bulan', payload.bulan.toString());
      formData.append('tahun', payload.tahun.toString());

      const { data } = await api.post('/tagihan/generate', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGIHAN_KEYS.all });
    },
  });
};

export const useDeleteTagihan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/tagihan/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGIHAN_KEYS.all });
    },
  });
};

export const usePayTagihanManual = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      nik: string;
      iuran: {
        id_tagihan: string;
        jangka: number;
        tagihan: number;
      }[];
    }) => {
      const { data } = await api.post('/payment', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGIHAN_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // update saldo
    },
  });
};
