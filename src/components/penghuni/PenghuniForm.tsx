import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Penghuni, PenghuniPayload } from "@/types/penghuni"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Loader2 } from "lucide-react"

// Zod Schema
const penghuniSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  nik: z.string().length(16, "NIK harus 16 digit angka").regex(/^\d+$/, "NIK harus berupa angka"),
  status_penghuni: z.enum(["tetap", "kontrak"]),
  telephone: z.string().min(10, "No HP tidak valid"),
  is_menikah: z.boolean(),
  // file validation depends on create vs update
})

interface PenghuniFormProps {
  initialData?: Penghuni
  onSubmit: (data: PenghuniPayload) => Promise<void>
  isLoading?: boolean
}

export function PenghuniForm({ initialData, onSubmit, isLoading }: PenghuniFormProps) {
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  
  const isUpdate = !!initialData

  const form = useForm<z.infer<typeof penghuniSchema>>({
    resolver: zodResolver(penghuniSchema),
    defaultValues: {
      nama: initialData?.nama || "",
      nik: initialData?.nik || "",
      status_penghuni: initialData?.status_penghuni || "tetap",
      telephone: initialData?.telephone || "",
      is_menikah: initialData?.is_menikah || false,
    },
  })

  const handleSubmit = async (values: z.infer<typeof penghuniSchema>) => {
    if (!isUpdate && !fotoFile) {
      form.setError("root", { message: "Foto KTP wajib diupload saat menambah data baru." })
      return
    }

    const payload: PenghuniPayload = {
      ...values,
    }
    if (fotoFile) {
      payload.foto_ktp = fotoFile
    }

    await onSubmit(payload)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <div className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nik"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIK</FormLabel>
              <FormControl>
                <Input placeholder="16 Digit NIK" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status_penghuni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Penghuni</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tetap">Tetap</SelectItem>
                    <SelectItem value="kontrak">Kontrak</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. Telepon</FormLabel>
                <FormControl>
                  <Input placeholder="08..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Foto KTP {isUpdate && <span className="text-muted-foreground font-normal">(Biarkan kosong jika tidak diubah)</span>}
          </label>
          <Input 
            type="file" 
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFotoFile(e.target.files[0])
              } else {
                setFotoFile(null)
              }
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="is_menikah"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Sudah Menikah
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUpdate ? "Simpan Perubahan" : "Tambahkan Penghuni"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
