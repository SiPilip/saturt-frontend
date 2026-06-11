import { useState } from "react";
import { useGenerateTagihan, useDeleteTagihan, usePayTagihanManual } from "@/api/hooks/useTagihan";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Tagihan } from "@/types/tagihan";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GenerateTagihanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function GenerateTagihanDialog({
  open,
  onOpenChange,
  onSuccess,
}: GenerateTagihanDialogProps) {
  const generateTagihan = useGenerateTagihan();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [bulan, setBulan] = useState<string>(currentMonth.toString());
  const [tahun, setTahun] = useState<string>(currentYear.toString());

  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const years = Array.from({ length: 5 }, (_, i) =>
    (currentYear - 1 + i).toString(),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateTagihan.mutate(
      { bulan: parseInt(bulan), tahun: parseInt(tahun) },
      {
        onSuccess: (data) => {
          toast.success("Berhasil", {
            description: data.message || "Tagihan berhasil di-generate",
          });
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error("Gagal", {
            description:
              error.response?.data?.message || "Gagal generate tagihan",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Tagihan Massal</DialogTitle>
          <DialogDescription>
            Pilih bulan dan tahun untuk men-generate tagihan. Sistem akan
            membuatkan tagihan ke seluruh rumah yang "Terisi" untuk setiap jenis
            iuran yang ada.
          </DialogDescription>
        </DialogHeader>

        <Alert className="p-3">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informasi</AlertTitle>
          <AlertDescription>
            Tagihan yang sudah ada (duplikat) di bulan dan tahun yang sama akan
            dilewati secara otomatis.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bulan">Bulan</Label>
              <Select value={bulan} onValueChange={setBulan}>
                <SelectTrigger id="bulan">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tahun">Tahun</Label>
              <Select value={tahun} onValueChange={setTahun}>
                <SelectTrigger id="tahun">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={generateTagihan.isPending}>
              {generateTagihan.isPending ? "Memproses..." : "Generate Tagihan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteTagihanDialogProps {
  tagihan: Tagihan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteTagihanDialog({
  tagihan,
  open,
  onOpenChange,
  onSuccess,
}: DeleteTagihanDialogProps) {
  const deleteTagihan = useDeleteTagihan();

  const handleConfirm = () => {
    if (!tagihan) return;

    deleteTagihan.mutate(tagihan.id, {
      onSuccess: () => {
        toast.success("Berhasil", { description: "Tagihan berhasil dihapus" });
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error("Gagal", {
          description:
            error.response?.data?.message || "Gagal menghapus Tagihan",
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
            Apakah Anda yakin ingin menghapus tagihan{" "}
            <strong>{tagihan?.iuran?.nama}</strong> untuk Blok{" "}
            <strong>{tagihan?.rumah?.blok_nomor}</strong> bulan{" "}
            <strong>
              {tagihan?.bulan}/{tagihan?.tahun}
            </strong>
            ? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        {tagihan?.is_paid && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Perhatian</AlertTitle>
            <AlertDescription>
              Tagihan ini sudah lunas. Sistem tidak akan mengizinkan penghapusan
              tagihan yang sudah dibayar.
            </AlertDescription>
          </Alert>
        )}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteTagihan.isPending || tagihan?.is_paid}
          >
            {deleteTagihan.isPending ? "Menghapus..." : "Hapus Tagihan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface PayTagihanManualDialogProps {
  tagihan: Tagihan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PayTagihanManualDialog({
  tagihan,
  open,
  onOpenChange,
  onSuccess,
}: PayTagihanManualDialogProps) {
  const payTagihan = usePayTagihanManual();

  const handleConfirm = () => {
    if (!tagihan || !tagihan.penghuni) {
      toast.error("Gagal", { description: "Data penghuni tidak valid" });
      return;
    }

    const payload = {
      nik: tagihan.penghuni.nik,
      iuran: [
        {
          id_tagihan: tagihan.id,
          jangka: 1, // manual 1 bulan saja
          tagihan: tagihan.nominal,
        },
      ],
    };

    payTagihan.mutate(payload, {
      onSuccess: () => {
        toast.success("Berhasil", { description: "Tagihan berhasil dilunaskan secara manual" });
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error("Gagal", {
          description: error.response?.data?.message || "Gagal melunaskan tagihan",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Pelunasan Manual</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menandai tagihan <strong>{tagihan?.iuran?.nama}</strong> bulan <strong>{tagihan?.bulan}/{tagihan?.tahun}</strong> milik <strong>{tagihan?.penghuni?.nama}</strong> sebagai <strong>LUNAS</strong>?
          </DialogDescription>
        </DialogHeader>
        <Alert className="mt-2 bg-blue-50 text-blue-800 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle>Informasi</AlertTitle>
          <AlertDescription>
            Tindakan ini akan langsung mencatatkan Rp {tagihan?.nominal.toLocaleString('id-ID')} ke dalam sistem pemasukan RT.
          </AlertDescription>
        </Alert>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleConfirm}
            disabled={payTagihan.isPending}
          >
            {payTagihan.isPending ? "Memproses..." : "Lunaskan Tagihan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
