import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PenghuniForm } from "./PenghuniForm"
import type { Penghuni, PenghuniPayload } from "@/types/penghuni"
import { useCreatePenghuni, useDeletePenghuni, useUpdatePenghuni } from "@/api/hooks/usePenghuni"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface CreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePenghuniDialog({ open, onOpenChange }: CreateDialogProps) {
  const { mutateAsync: createPenghuni, isPending } = useCreatePenghuni()

  const handleSubmit = async (data: PenghuniPayload) => {
    try {
      await createPenghuni(data)
      toast.success("Berhasil", { description: "Data penghuni baru telah ditambahkan." })
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Gagal", { description: error?.response?.data?.message || "Terjadi kesalahan saat menyimpan data." })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Penghuni Baru</DialogTitle>
        </DialogHeader>
        <PenghuniForm onSubmit={handleSubmit} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  )
}

interface EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  penghuni: Penghuni | null
}

export function EditPenghuniDialog({ open, onOpenChange, penghuni }: EditDialogProps) {
  const { mutateAsync: updatePenghuni, isPending } = useUpdatePenghuni()

  if (!penghuni) return null

  const handleSubmit = async (data: PenghuniPayload) => {
    try {
      await updatePenghuni({ id: penghuni.id, payload: data })
      toast.success("Berhasil", { description: "Data penghuni telah diperbarui." })
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Gagal", { description: error?.response?.data?.message || "Terjadi kesalahan saat mengupdate data." })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Data Penghuni</DialogTitle>
        </DialogHeader>
        {/* Key prop ensures form reinitializes when selected penghuni changes */}
        <PenghuniForm key={penghuni.id} initialData={penghuni} onSubmit={handleSubmit} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  )
}

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  penghuni: Penghuni | null
}

export function DeletePenghuniDialog({ open, onOpenChange, penghuni }: DeleteDialogProps) {
  const { mutateAsync: deletePenghuni, isPending } = useDeletePenghuni()

  if (!penghuni) return null

  const handleDelete = async () => {
    try {
      await deletePenghuni(penghuni.id)
      toast.success("Berhasil", { description: "Data penghuni telah dihapus." })
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Gagal", { description: error?.response?.data?.message || "Terjadi kesalahan saat menghapus data." })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data Penghuni?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Data penghuni <strong>{penghuni.nama}</strong> akan dihapus secara permanen dari sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ya, Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
