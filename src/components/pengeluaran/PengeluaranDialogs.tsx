import { useState, useEffect } from 'react';
import { useCreatePengeluaran, useUpdatePengeluaran, useDeletePengeluaran } from '@/api/hooks/usePengeluaran';
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
import type { Pengeluaran } from '@/types/pengeluaran';

interface CreatePengeluaranDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePengeluaranDialog({ open, onOpenChange }: CreatePengeluaranDialogProps) {
  const createPengeluaran = useCreatePengeluaran();

  const [formData, setFormData] = useState({
    nama: '',
    biaya: 0,
    jenis: 'operasional' as 'operasional' | 'perbaikan' | 'gaji' | 'lainnya',
    tanggal: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        nama: '',
        biaya: 0,
        jenis: 'operasional',
        tanggal: new Date().toISOString().split('T')[0],
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPengeluaran.mutate(formData, {
      onSuccess: () => {
        toast.success('Berhasil', { description: 'Data Pengeluaran berhasil ditambahkan' });
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error('Gagal', {
          description: error.response?.data?.message || 'Gagal menambahkan pengeluaran',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catat Pengeluaran Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Pengeluaran / Keterangan</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Gaji Satpam, Perbaikan Selokan"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="biaya">Biaya (Rp)</Label>
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
            <Label htmlFor="jenis">Jenis Pengeluaran</Label>
            <Select
              value={formData.jenis}
              onValueChange={(val: any) => setFormData({ ...formData, jenis: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operasional">Operasional</SelectItem>
                <SelectItem value="gaji">Gaji</SelectItem>
                <SelectItem value="perbaikan">Perbaikan</SelectItem>
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
            <Button type="submit" disabled={createPengeluaran.isPending}>
              {createPengeluaran.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditPengeluaranDialogProps {
  pengeluaran: Pengeluaran | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPengeluaranDialog({ pengeluaran, open, onOpenChange }: EditPengeluaranDialogProps) {
  const updatePengeluaran = useUpdatePengeluaran();

  const [formData, setFormData] = useState({
    nama: '',
    biaya: 0,
    jenis: 'operasional' as 'operasional' | 'perbaikan' | 'gaji' | 'lainnya',
    tanggal: '',
  });

  useEffect(() => {
    if (pengeluaran && open) {
      setFormData({
        nama: pengeluaran.nama,
        biaya: pengeluaran.biaya,
        jenis: pengeluaran.jenis,
        tanggal: pengeluaran.tanggal,
      });
    }
  }, [pengeluaran, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pengeluaran) return;

    updatePengeluaran.mutate(
      { id: pengeluaran.id, payload: formData },
      {
        onSuccess: () => {
          toast.success('Berhasil', { description: 'Data Pengeluaran berhasil diperbarui' });
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error('Gagal', {
            description: error.response?.data?.message || 'Gagal memperbarui pengeluaran',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pengeluaran</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit_nama">Nama Pengeluaran / Keterangan</Label>
            <Input
              id="edit_nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_biaya">Biaya (Rp)</Label>
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
            <Label htmlFor="edit_jenis">Jenis Pengeluaran</Label>
            <Select
              value={formData.jenis}
              onValueChange={(val: any) => setFormData({ ...formData, jenis: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operasional">Operasional</SelectItem>
                <SelectItem value="gaji">Gaji</SelectItem>
                <SelectItem value="perbaikan">Perbaikan</SelectItem>
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
            <Button type="submit" disabled={updatePengeluaran.isPending}>
              {updatePengeluaran.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeletePengeluaranDialogProps {
  pengeluaran: Pengeluaran | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePengeluaranDialog({ pengeluaran, open, onOpenChange }: DeletePengeluaranDialogProps) {
  const deletePengeluaran = useDeletePengeluaran();

  const handleConfirm = () => {
    if (!pengeluaran) return;

    deletePengeluaran.mutate(pengeluaran.id, {
      onSuccess: () => {
        toast.success('Berhasil', { description: 'Data Pengeluaran berhasil dihapus' });
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error('Gagal', {
          description: error.response?.data?.message || 'Gagal menghapus pengeluaran',
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
            Apakah Anda yakin ingin menghapus data pengeluaran <strong>{pengeluaran?.nama}</strong> senilai Rp{pengeluaran?.biaya?.toLocaleString('id-ID')}?
            Data yang dihapus akan mempengaruhi kalkulasi saldo Kas RT.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={deletePengeluaran.isPending}>
            {deletePengeluaran.isPending ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
