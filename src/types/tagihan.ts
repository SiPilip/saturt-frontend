import type { Rumah } from './rumah';
import type { Iuran } from './iuran';
import type { Penghuni } from './penghuni';

export interface Tagihan {
  id: string;
  id_rumah: string;
  id_iuran: string;
  id_penghuni: string;
  bulan: number;
  tahun: number;
  nominal: number;
  is_paid: boolean;
  created_at: string;
  updated_at: string;

  rumah?: Rumah;
  iuran?: Iuran;
  penghuni?: Penghuni;
  // pembayaran?: Pembayaran; // Nanti ditambahkan ketika membuat modul Keuangan/Pembayaran
}

export interface TagihanPaginationResponse {
  status: boolean;
  message: string;
  data: Tagihan[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
  };
}

export interface GenerateTagihanPayload {
  bulan: number;
  tahun: number;
}
