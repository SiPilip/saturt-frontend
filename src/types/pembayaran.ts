import type { Penghuni } from "./penghuni";
import type { Tagihan } from "./tagihan";

export interface Pembayaran {
  id: string;
  id_penghuni: string;
  tanggal_bayar: string;
  total_bayar: number;
  metode_pembayaran: string;
  created_at: string;
  updated_at: string;
  penghuni?: Penghuni;
  tagihan?: Tagihan[];
}
