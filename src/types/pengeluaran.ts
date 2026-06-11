export interface Pengeluaran {
  id: string;
  nama: string;
  biaya: number;
  jenis: 'operasional' | 'perbaikan' | 'gaji' | 'lainnya';
  tanggal: string;
  created_at: string;
  updated_at: string;
}

export interface PengeluaranPayload {
  nama: string;
  biaya: number;
  jenis: 'operasional' | 'perbaikan' | 'gaji' | 'lainnya';
  tanggal: string;
}

export interface PengeluaranPaginationResponse {
  status: boolean;
  message: string;
  data: Pengeluaran[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
  };
}
