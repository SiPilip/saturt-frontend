import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export interface PaymentHistoryItem {
  id: string;
  tanggal_bayar: string;
  jumlah_bayar: number;
  tagihan?: {
    bulan: number;
    tahun: number;
    iuran?: {
      nama: string;
      biaya: number;
    };
    rumah?: {
      blok_nomor: string;
    };
  };
  [key: string]: any;
}

export interface PaymentHistoryResponse {
  status: boolean;
  message: string;
  data: {
    penghuni: { id: string; nama: string; nik: string };
    riwayat: PaymentHistoryItem[];
  };
}

export const useGetPaymentHistory = (nik?: string, limit: number = 2) => {
  return useQuery<PaymentHistoryResponse>({
    queryKey: ["payment-history", nik, limit],
    queryFn: async () => {
      const response = await api.get("/payment", {
        params: { nik, limit },
      });
      return response.data;
    },
    enabled: !!nik,
    staleTime: 5 * 1000,
  });
};
