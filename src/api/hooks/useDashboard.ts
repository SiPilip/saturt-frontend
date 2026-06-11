import { useQuery } from '@tanstack/react-query';
import api from '../axios';
import type { 
  DashboardRingkasanResponse, 
  DashboardGrafikResponse, 
  DashboardBelumBayarResponse, 
  DashboardPembayaranTerakhirResponse 
} from '@/types/dashboard';

export const DASHBOARD_KEYS = {
  all: ['dashboard'] as const,
  ringkasan: () => [...DASHBOARD_KEYS.all, 'ringkasan'] as const,
  grafik: (range: number) => [...DASHBOARD_KEYS.all, 'grafik', range] as const,
  belumBayar: (page: number, limit: number) => [...DASHBOARD_KEYS.all, 'belum-bayar', page, limit] as const,
  pembayaranTerakhir: () => [...DASHBOARD_KEYS.all, 'pembayaran-terakhir'] as const,
};

export const useGetRingkasan = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.ringkasan(),
    queryFn: async () => {
      const { data } = await api.get<DashboardRingkasanResponse>('/keuangan/ringkasan');
      return data;
    },
  });
};

export const useGetGrafik = (range: number = 12) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.grafik(range),
    queryFn: async () => {
      const { data } = await api.get<DashboardGrafikResponse>('/dashboard/grafik', {
        params: { range }
      });
      return data;
    },
  });
};

export const useGetBelumBayar = (page: number = 1, limit: number = 5) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.belumBayar(page, limit),
    queryFn: async () => {
      const { data } = await api.get<DashboardBelumBayarResponse>('/dashboard/penghuni-belum-bayar', {
        params: { page, limit }
      });
      return data;
    },
  });
};

export const useGetPembayaranTerakhir = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.pembayaranTerakhir(),
    queryFn: async () => {
      const { data } = await api.get<DashboardPembayaranTerakhirResponse>('/dashboard/pembayaran-terakhir');
      return data;
    },
  });
};
