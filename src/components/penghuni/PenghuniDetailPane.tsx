import type { Penghuni } from "@/types/penghuni"
import { useGetPaymentHistory } from "@/api/hooks/usePayment"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Phone, CreditCard, Heart, CheckCircle2, FileImage, ExternalLink } from "lucide-react"

interface PenghuniDetailPaneProps {
  penghuni: Penghuni | null
}

export function PenghuniDetailPane({ penghuni }: PenghuniDetailPaneProps) {
  if (!penghuni) return null

  // Resolve KTP URL based on whether it's absolute or relative from backend
  const ktpUrl = penghuni.foto_ktp 
    ? (penghuni.foto_ktp.startsWith('http') 
        ? penghuni.foto_ktp 
        : (penghuni.foto_ktp.startsWith('/') 
            ? `http://localhost:8000${penghuni.foto_ktp}` 
            : `http://localhost:8000/storage/${penghuni.foto_ktp}`))
    : '#';

  return (
    <Card className="h-full flex flex-col shadow-md border-primary/10 overflow-hidden">
      <CardHeader className="pb-4 bg-muted/30">
        <CardTitle className="text-2xl">{penghuni.nama}</CardTitle>
        <CardDescription className="capitalize font-medium">
          Penghuni {penghuni.status_penghuni}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto space-y-6 pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">Nomor Induk Kependudukan</p>
              <p className="font-semibold">{penghuni.nik}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">Nomor Telepon / WhatsApp</p>
              <p className="font-semibold">{penghuni.telephone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">Status Pernikahan</p>
              <div className="flex items-center gap-1 font-semibold mt-1">
                {penghuni.is_menikah ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Sudah Menikah
                  </>
                ) : (
                  "Belum Menikah"
                )}
              </div>
            </div>
          </div>

          {penghuni.foto_ktp && (
            <div className="flex items-start gap-3 pt-2">
              <FileImage className="h-5 w-5 text-primary mt-0.5" />
              <div className="w-full">
                <p className="text-sm text-muted-foreground font-medium mb-2">Dokumen KTP</p>
                <a href={ktpUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>Lihat File KTP</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Payment History Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Riwayat Pembayaran</h4>
          <PaymentHistoryList nik={penghuni.nik} />
        </div>

      </CardContent>
    </Card>
  )
}

function PaymentHistoryList({ nik }: { nik: string }) {
  const { data, isLoading, isError } = useGetPaymentHistory(nik);

  if (isLoading) {
    return <div className="text-sm text-center py-4 text-muted-foreground">Memuat riwayat...</div>;
  }

  if (isError || !data?.status) {
    return <div className="text-sm text-center py-4 text-destructive">Gagal memuat riwayat.</div>;
  }

  const history = Array.isArray(data?.data?.riwayat) ? data.data.riwayat : [];

  if (history.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Belum ada riwayat pembayaran untuk penghuni ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
      {history.map((payment, idx) => (
        <div key={payment.id || idx} className="flex justify-between items-center p-3 border rounded-md bg-muted/20">
          <div>
            <p className="font-medium text-sm">
              {payment.tagihan?.iuran?.nama || `Pembayaran`} — {payment.tagihan?.bulan}/{payment.tagihan?.tahun}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tgl: {new Date(payment.tanggal_bayar).toLocaleDateString('id-ID')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-green-600 mb-0.5">
              Rp {payment.jumlah_bayar?.toLocaleString('id-ID')}
            </p>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500 border-green-500/20">
              Lunas
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
