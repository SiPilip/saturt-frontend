import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../axios';
import type { Tagihan } from '@/types/tagihan';
import type { Penghuni } from '@/types/penghuni';

export interface GetTagihanPublikResponse {
  status: boolean;
  message: string;
  data: {
    penghuni: Pick<Penghuni, 'id' | 'nama' | 'nik'>;
    tagihan: Tagihan[];
  };
}

export interface PaymentPayloadItem {
  id_tagihan: string;
  jangka: number;
  tagihan: number; // nominal
}

export interface PaymentPayload {
  nik: string;
  iuran: PaymentPayloadItem[];
}

const PEMBAYARAN_KEYS = {
  all: ['pembayaran-publik'] as const,
  byNik: (nik: string) => [...PEMBAYARAN_KEYS.all, nik] as const,
};

export const useGetTagihanPublik = (nik: string, enabled: boolean) => {
  return useQuery({
    queryKey: PEMBAYARAN_KEYS.byNik(nik),
    queryFn: async () => {
      const { data } = await api.get<GetTagihanPublikResponse>('/pembayaran', {
        params: { nik },
      });
      return data;
    },
    enabled,
    retry: false, // Don't retry if NIK is not found (404)
  });
};

export const useProsesPembayaran = () => {
  return useMutation({
    mutationFn: async (payload: PaymentPayload) => {
      const { data } = await api.post('/payment', payload);
      return data;
    },
  });
};
