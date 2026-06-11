import { useState, useEffect } from 'react';
import { useCreateIuran, useUpdateIuran, useDeleteIuran } from '@/api/hooks/useIuran';
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
import { toast } from "sonner";
import type { Iuran } from '@/types/iuran';

interface CreateIuranDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateIuranDialog({ open, onOpenChange }: CreateIuranDialogProps) {
  const createIuran = useCreateIuran();

  const [formData, setFormData] = useState({
    nama: '',
    biaya: 0,
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        nama: '',
        biaya: 0,
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createIuran.mutate(formData, {
      onSuccess: () => {
        toast.success('Berhasil', { description: 'Data Iuran berhasil ditambahkan' });
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error('Gagal', {
          description: error.response?.data?.message || 'Gagal menambahkan Iuran',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Master Iuran</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Iuran</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Iuran Kebersihan, Iuran Keamanan"
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
              placeholder="Contoh: 50000"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={createIuran.isPending}>
              {createIuran.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditIuranDialogProps {
  iuran: Iuran | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditIuranDialog({ iuran, open, onOpenChange }: EditIuranDialogProps) {
  const updateIuran = useUpdateIuran();

  const [formData, setFormData] = useState({
    nama: '',
    biaya: 0,
  });

  useEffect(() => {
    if (iuran && open) {
      setFormData({
        nama: iuran.nama,
        biaya: iuran.biaya,
      });
    }
  }, [iuran, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!iuran) return;

    updateIuran.mutate(
      { id: iuran.id, payload: formData },
      {
        onSuccess: () => {
          toast.success('Berhasil', { description: 'Data Iuran berhasil diperbarui' });
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error('Gagal', {
            description: error.response?.data?.message || 'Gagal memperbarui Iuran',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Master Iuran</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit_nama">Nama Iuran</Label>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={updateIuran.isPending}>
              {updateIuran.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteIuranDialogProps {
  iuran: Iuran | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteIuranDialog({ iuran, open, onOpenChange, onSuccess }: DeleteIuranDialogProps) {
  const deleteIuran = useDeleteIuran();

  const handleConfirm = () => {
    if (!iuran) return;

    deleteIuran.mutate(iuran.id, {
      onSuccess: () => {
        toast.success('Berhasil', { description: 'Data Iuran berhasil dihapus' });
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error('Gagal', {
          description: error.response?.data?.message || 'Gagal menghapus Iuran',
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
            Apakah Anda yakin ingin menghapus iuran <strong>{iuran?.nama}</strong>?
            Tindakan ini tidak dapat dibatalkan dan akan ditolak jika iuran ini sudah pernah digunakan dalam tagihan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={deleteIuran.isPending}>
            {deleteIuran.isPending ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
