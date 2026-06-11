import type { Penghuni } from './penghuni';

export interface Rumah {
  id: string;
  blok_nomor: string;
  is_filled: boolean;
  created_at: string;
  updated_at: string;
  tagihan_belum_bayar_count?: number;
  penghuni_aktif?: {
    id: string;
    id_rumah: string;
    id_penghuni: string;
    tanggal_masuk: string;
    tanggal_keluar: string | null;
    penghuni: Penghuni;
  }[];
}

export interface RumahPayload {
  blok_nomor: string;
  is_filled: boolean;
}

export interface RumahPaginationResponse {
  status: boolean;
  message: string;
  data: Rumah[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
  };
}

export interface RiwayatPenghuni {
  id: string;
  id_rumah: string;
  id_penghuni: string;
  tanggal_masuk: string;
  tanggal_keluar: string | null;
  created_at: string;
  penghuni: Penghuni;
}

export interface RiwayatPenghuniResponse {
  status: boolean;
  message: string;
  data: RiwayatPenghuni[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
  };
}

export interface Iuran {
  id: string;
  nama: string;
  biaya: number;
  created_at: string;
}

export interface RiwayatPembayaran {
  id: string;
  id_rumah: string;
  id_iuran: string;
  id_penghuni: string | null;
  bulan: number;
  tahun: number;
  nominal: number;
  is_paid: boolean;
  created_at: string;
  iuran?: Iuran;
  penghuni?: Penghuni;
  pembayaran?: any[];
}

export interface RiwayatPembayaranResponse {
  status: boolean;
  message: string;
  data: RiwayatPembayaran[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
  };
}
