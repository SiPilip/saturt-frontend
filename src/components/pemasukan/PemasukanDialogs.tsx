import { useState, useEffect } from 'react';
import { useCreatePemasukan, useUpdatePemasukan, useDeletePemasukan } from '@/api/hooks/usePemasukan';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import type { Pemasukan } from '@/types/pemasukan';

interface CreatePemasukanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePemasukanDialog({ open, onOpenChange }: CreatePemasukanDialogProps) {
  const createPemasukan = useCreatePemasukan();

  const [formData, setFormData] = useState({
    nama: '',
    biaya: 0,
    jenis: 'lainnya' as 'pembayaran_iuran' | 'donasi' | 'hibah' | 'lainnya',
    tanggal: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        nama: '',
        biaya: 0,
        jenis: 'lainnya',
        tanggal: new Date().toISOString().split('T')[0],
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPemasukan.mutate(formData, {
      onSuccess: () => {
        toast.success('Berhasil', { description: 'Data Pemasukan berhasil ditambahkan' });
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error('Gagal', {
          description: error.response?.data?.message || 'Gagal menambahkan pemasukan',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catat Pemasukan Manual Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Pemasukan / Keterangan</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Bantuan Pemda, Donasi Warga"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="biaya">Nominal (Rp)</Label>
            <Input
              id="biaya"
              type="number"
              min="0"
              value={formData.biaya || ''}
              onChange={(e) => setFormData({ ...formData, biaya: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jenis">Jenis Pemasukan</Label>
            <Select
              value={formData.jenis}
              onValueChange={(val: any) => setFormData({ ...formData, jenis: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="donasi">Donasi</SelectItem>
                <SelectItem value="hibah">Hibah / Bantuan</SelectItem>
                <SelectItem value="pembayaran_iuran">Pembayaran Iuran (Luar Sistem)</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input
              id="tanggal"
              type="date"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={createPemasukan.isPending}>
              {createPemasukan.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditPemasukanDialogProps {
  pemasukan: Pemasukan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPemasukanDialog({ pemasukan, open, onOpenChange }: EditPemasukanDialogProps) {
  const updatePemasukan = useUpdatePemasukan();

  const [formData, setFormData] = useState({
    nama: '',
    biaya: 0,
    jenis: 'lainnya' as 'pembayaran_iuran' | 'donasi' | 'hibah' | 'lainnya',
    tanggal: '',
  });

  useEffect(() => {
    if (pemasukan && open) {
      setFormData({
        nama: pemasukan.nama,
        biaya: pemasukan.biaya,
        jenis: pemasukan.jenis,
        tanggal: pemasukan.tanggal,
      });
    }
  }, [pemasukan, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pemasukan) return;

    updatePemasukan.mutate(
      { id: pemasukan.id, payload: formData },
      {
        onSuccess: () => {
          toast.success('Berhasil', { description: 'Data Pemasukan berhasil diperbarui' });
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error('Gagal', {
            description: error.response?.data?.message || 'Gagal memperbarui pemasukan',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pemasukan Manual</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit_nama">Nama Pemasukan / Keterangan</Label>
            <Input
              id="edit_nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_biaya">Nominal (Rp)</Label>
            <Input
              id="edit_biaya"
              type="number"
              min="0"
              value={formData.biaya || ''}
              onChange={(e) => setFormData({ ...formData, biaya: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_jenis">Jenis Pemasukan</Label>
            <Select
              value={formData.jenis}
              onValueChange={(val: any) => setFormData({ ...formData, jenis: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="donasi">Donasi</SelectItem>
                <SelectItem value="hibah">Hibah / Bantuan</SelectItem>
                <SelectItem value="pembayaran_iuran">Pembayaran Iuran (Luar Sistem)</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_tanggal">Tanggal</Label>
            <Input
              id="edit_tanggal"
              type="date"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={updatePemasukan.isPending}>
              {updatePemasukan.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeletePemasukanDialogProps {
  pemasukan: Pemasukan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePemasukanDialog({ pemasukan, open, onOpenChange }: DeletePemasukanDialogProps) {
  const deletePemasukan = useDeletePemasukan();

  const handleConfirm = () => {
    if (!pemasukan) return;

    deletePemasukan.mutate(pemasukan.id, {
      onSuccess: () => {
        toast.success('Berhasil', { description: 'Data Pemasukan berhasil dihapus' });
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error('Gagal', {
          description: error.response?.data?.message || 'Gagal menghapus pemasukan',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus data pemasukan <strong>{pemasukan?.nama}</strong> senilai Rp{pemasukan?.biaya?.toLocaleString('id-ID')}?
            Data yang dihapus akan mengurangi kalkulasi saldo Kas RT secara otomatis.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={deletePemasukan.isPending}>
            {deletePemasukan.isPending ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
