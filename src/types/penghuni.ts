export interface Penghuni {
  id: string;
  nama: string;
  nik: string;
  foto_ktp: string; // URL ke foto KTP
  status_penghuni: 'tetap' | 'kontrak';
  telephone: string;
  is_menikah: boolean;
  penghuni_rumah?: { id: string; id_rumah: string; tanggal_keluar: string | null; rumah?: { id: string; blok_nomor: string } }[];
  tagihan_belum_bayar_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PenghuniPaginationResponse {
  data: Penghuni[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
  };
}

export interface PenghuniPayload {
  nama: string;
  nik: string;
  foto_ktp?: File; // File objek untuk upload
  status_penghuni: 'tetap' | 'kontrak';
  telephone: string;
  is_menikah: boolean;
}
