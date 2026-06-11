export interface Pemasukan {
  id: string;
  nama: string;
  biaya: number;
  jenis: 'pembayaran_iuran' | 'donasi' | 'hibah' | 'lainnya';
  tanggal: string;
  created_at: string;
  updated_at: string;
}

export interface PemasukanPayload {
  nama: string;
  biaya: number;
  jenis: 'pembayaran_iuran' | 'donasi' | 'hibah' | 'lainnya';
  tanggal: string;
}

export interface PemasukanPaginationResponse {
  status: boolean;
  message: string;
  data: Pemasukan[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
  };
}
