export interface Iuran {
  id: string;
  nama: string;
  biaya: number;
  created_at: string;
  updated_at: string;
}

export interface IuranPayload {
  nama: string;
  biaya: number;
}

export interface IuranPaginationResponse {
  status: boolean;
  message: string;
  data: Iuran[];
  meta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
  };
}
