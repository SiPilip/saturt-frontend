import type { Tagihan } from "./tagihan";
import type { Pembayaran } from "./pembayaran";

export interface DashboardRingkasan {
  bulan_ini: {
    pemasukan: number;
    pengeluaran: number;
    saldo: number;
    tagihan_total: number;
    tagihan_lunas: number;
    tagihan_belum_bayar: number;
  };
  all_time: {
    total_pemasukan: number;
    total_pengeluaran: number;
    saldo: number;
  };
}

export interface DashboardGrafik {
  labels: string[];
  pemasukan: number[];
  pengeluaran: number[];
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export type DashboardRingkasanResponse = ApiResponse<DashboardRingkasan>;
export type DashboardGrafikResponse = ApiResponse<DashboardGrafik>;
export type DashboardBelumBayarResponse = ApiResponse<Tagihan[]> & {
  meta?: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
  };
};
export type DashboardPembayaranTerakhirResponse = ApiResponse<Pembayaran[]>;
