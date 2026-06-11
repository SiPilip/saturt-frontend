import { useState, useEffect } from 'react';
import { useCreateRumah, useUpdateRumah, useDeleteRumah, useAssignPenghuni, useCheckoutPenghuni } from '@/api/hooks/useRumah';
import { useGetPenghuni } from '@/api/hooks/usePenghuni';
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
import type { Rumah } from '@/types/rumah';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateRumahDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRumahDialog({ open, onOpenChange }: CreateRumahDialogProps) {
  const createRumah = useCreateRumah();

  const [formData, setFormData] = useState({
    blok_nomor: '',
    is_filled: false,
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        blok_nomor: '',
        is_filled: false,
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRumah.mutate(formData, {
      onSuccess: () => {
        toast.success('Berhasil', { description: 'Data Rumah berhasil ditambahkan' });
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error('Gagal', {
          description: error.response?.data?.message || 'Gagal menambahkan Rumah',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Data Rumah</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="blok_nomor">Blok & Nomor</Label>
            <Input
              id="blok_nomor"
              value={formData.blok_nomor}
              onChange={(e) => setFormData({ ...formData, blok_nomor: e.target.value })}
              placeholder="Contoh: A1, B2"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="is_filled">Status Terisi</Label>
            <Select
              value={formData.is_filled ? 'true' : 'false'}
              onValueChange={(val) => setFormData({ ...formData, is_filled: val === 'true' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Terisi</SelectItem>
                <SelectItem value="false">Kosong</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={createRumah.isPending}>
              {createRumah.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditRumahDialogProps {
  rumah: Rumah | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRumahDialog({ rumah, open, onOpenChange }: EditRumahDialogProps) {
  const updateRumah = useUpdateRumah();

  const [formData, setFormData] = useState({
    blok_nomor: '',
    is_filled: false,
  });

  useEffect(() => {
    if (rumah && open) {
      setFormData({
        blok_nomor: rumah.blok_nomor,
        is_filled: rumah.is_filled,
      });
    }
  }, [rumah, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rumah) return;

    updateRumah.mutate(
      { id: rumah.id, payload: formData },
      {
        onSuccess: () => {
          toast.success('Berhasil', { description: 'Data Rumah berhasil diperbarui' });
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error('Gagal', {
            description: error.response?.data?.message || 'Gagal memperbarui Rumah',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Data Rumah</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit_blok_nomor">Blok & Nomor</Label>
            <Input
              id="edit_blok_nomor"
              value={formData.blok_nomor}
              onChange={(e) => setFormData({ ...formData, blok_nomor: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_is_filled">Status Terisi</Label>
            <Select
              value={formData.is_filled ? 'true' : 'false'}
              onValueChange={(val) => setFormData({ ...formData, is_filled: val === 'true' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Terisi</SelectItem>
                <SelectItem value="false">Kosong</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={updateRumah.isPending}>
              {updateRumah.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteRumahDialogProps {
  rumah: Rumah | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteRumahDialog({ rumah, open, onOpenChange, onSuccess }: DeleteRumahDialogProps) {
  const deleteRumah = useDeleteRumah();

  const handleConfirm = () => {
    if (!rumah) return;

    deleteRumah.mutate(rumah.id, {
      onSuccess: () => {
        toast.success('Berhasil', { description: 'Data Rumah berhasil dihapus' });
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error('Gagal', {
          description: error.response?.data?.message || 'Gagal menghapus Rumah',
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
            Apakah Anda yakin ingin menghapus data rumah blok <strong>{rumah?.blok_nomor}</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={deleteRumah.isPending}>
            {deleteRumah.isPending ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AssignPenghuniDialogProps {
  rumah: Rumah | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AssignPenghuniDialog({ rumah, open, onOpenChange, onSuccess }: AssignPenghuniDialogProps) {
  const assignPenghuni = useAssignPenghuni();
  
  // Ambil data penghuni (limit besar agar semua termuat di dropdown)
  const { data: penghuniData, isLoading: isLoadingPenghuni } = useGetPenghuni(1, '', 100);

  const [formData, setFormData] = useState({
    id_penghuni: '',
    tanggal_masuk: new Date().toISOString().split('T')[0],
  });
  const [openCombobox, setOpenCombobox] = useState(false);

  useEffect(() => {
    if (!open) {
      setFormData({
        id_penghuni: '',
        tanggal_masuk: new Date().toISOString().split('T')[0],
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rumah) return;

    assignPenghuni.mutate(
      { idRumah: rumah.id, payload: formData },
      {
        onSuccess: () => {
          toast.success('Berhasil', { description: 'Penghuni berhasil di-assign ke rumah' });
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error('Gagal', {
            description: error.response?.data?.message || 'Gagal assign penghuni',
          });
        },
      }
    );
  };

  // Hanya tampilkan penghuni yang belum memiliki rumah (belum di-assign)
  const availablePenghuni = (penghuniData?.data || []).filter(
    (p) => !p.penghuni_rumah || p.penghuni_rumah.length === 0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Penghuni ke Rumah</DialogTitle>
          <DialogDescription>
            Masukkan penghuni baru ke Blok <strong>{rumah?.blok_nomor}</strong>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="id_penghuni">Pilih Penghuni</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                  disabled={isLoadingPenghuni}
                >
                  {formData.id_penghuni
                    ? availablePenghuni.find((p) => p.id === formData.id_penghuni)?.nama || "Pilih penghuni"
                    : isLoadingPenghuni ? "Memuat..." : "Pilih penghuni"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Cari nama penghuni..." />
                  <CommandList>
                    <CommandEmpty>Penghuni tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {availablePenghuni.map((p) => (
                        <CommandItem
                          key={p.id}
                          value={`${p.nama} ${p.nik}`}
                          onSelect={() => {
                            setFormData({ ...formData, id_penghuni: p.id });
                            setOpenCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.id_penghuni === p.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {p.nama} ({p.nik})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggal_masuk">Tanggal Masuk</Label>
            <Input
              id="tanggal_masuk"
              type="date"
              value={formData.tanggal_masuk}
              onChange={(e) => setFormData({ ...formData, tanggal_masuk: e.target.value })}
              required
            />
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={assignPenghuni.isPending || !formData.id_penghuni}>
              {assignPenghuni.isPending ? 'Menyimpan...' : 'Assign Penghuni'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface CheckoutPenghuniDialogProps {
  rumah: Rumah | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CheckoutPenghuniDialog({ rumah, open, onOpenChange, onSuccess }: CheckoutPenghuniDialogProps) {
  const checkoutPenghuni = useCheckoutPenghuni();

  const [tanggalKeluar, setTanggalKeluar] = useState(new Date().toISOString().split('T')[0]);

  // Penghuni aktif = penghuni yang tanggal_keluarnya null
  const penghuniAktifRelation = rumah?.penghuni_aktif?.[0];
  const penghuniAktifId = penghuniAktifRelation?.id_penghuni;
  const namaPenghuni = penghuniAktifRelation?.penghuni?.nama || 'Unknown';

  useEffect(() => {
    if (open) {
      setTanggalKeluar(new Date().toISOString().split('T')[0]);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rumah || !penghuniAktifId) return;

    checkoutPenghuni.mutate(
      { idRumah: rumah.id, idPenghuni: penghuniAktifId, payload: { tanggal_keluar: tanggalKeluar } },
      {
        onSuccess: () => {
          toast.success('Berhasil', { description: 'Penghuni berhasil di-checkout' });
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error('Gagal', {
            description: error.response?.data?.message || 'Gagal checkout penghuni',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout Penghuni</DialogTitle>
          <DialogDescription>
            Keluarkan <strong>{namaPenghuni}</strong> dari Blok <strong>{rumah?.blok_nomor}</strong>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="tanggal_keluar">Tanggal Keluar</Label>
            <Input
              id="tanggal_keluar"
              type="date"
              value={tanggalKeluar}
              onChange={(e) => setTanggalKeluar(e.target.value)}
              required
            />
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" variant="destructive" disabled={checkoutPenghuni.isPending || !penghuniAktifId}>
              {checkoutPenghuni.isPending ? 'Memproses...' : 'Checkout Penghuni'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
