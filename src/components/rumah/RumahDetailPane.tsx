import { useGetRiwayatPenghuni, useGetRiwayatPembayaran } from '@/api/hooks/useRumah';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Home, User, CheckCircle, XCircle } from 'lucide-react';
import type { Rumah } from '@/types/rumah';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

interface RumahDetailPaneProps {
  rumah: Rumah;
}

export function RumahDetailPane({ rumah }: RumahDetailPaneProps) {
  const { data: penghuniData, isLoading: isLoadingPenghuni } = useGetRiwayatPenghuni(rumah.id);
  const { data: pembayaranData, isLoading: isLoadingPembayaran } = useGetRiwayatPembayaran(rumah.id);

  const activePenghuni = rumah.penghuni_aktif && rumah.penghuni_aktif.length > 0 
    ? rumah.penghuni_aktif[0].penghuni 
    : null;

  return (
    <Card className="h-full flex flex-col shadow-md border-primary/10 overflow-hidden">
      <CardHeader className="pb-4 bg-muted/30">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-inner">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl text-primary font-bold">Blok {rumah.blok_nomor}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              {rumah.is_filled ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600 shadow-sm">Terisi</Badge>
              ) : (
                <Badge variant="secondary" className="shadow-sm">Kosong</Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto space-y-6 pt-6">
        {/* Info Penghuni Saat Ini */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Penghuni Saat Ini</h4>
          {activePenghuni ? (
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">{activePenghuni.nama}</p>
                <p className="text-xs text-muted-foreground">{activePenghuni.telephone || '-'}</p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-muted/50 rounded-lg border border-dashed text-center">
              <p className="text-sm text-muted-foreground">Tidak ada penghuni aktif</p>
            </div>
          )}
        </div>

        {/* Tabs Riwayat */}
        <Tabs defaultValue="penghuni" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="penghuni">Riwayat Penghuni</TabsTrigger>
            <TabsTrigger value="pembayaran">Riwayat Pembayaran</TabsTrigger>
          </TabsList>
          
          <TabsContent value="penghuni" className="mt-4 space-y-4">
            {isLoadingPenghuni ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : penghuniData?.data && penghuniData.data.length > 0 ? (
              <div className="space-y-3">
                {penghuniData.data.map((riwayat) => (
                  <div key={riwayat.id} className="p-3 border rounded-lg bg-card text-sm">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold">{riwayat.penghuni?.nama || 'Unknown'}</p>
                      {riwayat.tanggal_keluar ? (
                        <Badge variant="outline" className="text-xs">Selesai</Badge>
                      ) : (
                        <Badge className="bg-green-500 hover:bg-green-600 text-xs">Aktif</Badge>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Masuk: {dayjs(riwayat.tanggal_masuk).format('DD MMM YYYY')}
                      </div>
                      {riwayat.tanggal_keluar && (
                        <div className="flex items-center">
                          <XCircle className="mr-1 h-3 w-3" />
                          Keluar: {dayjs(riwayat.tanggal_keluar).format('DD MMM YYYY')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground">Belum ada riwayat penghuni</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pembayaran" className="mt-4 space-y-4">
            {isLoadingPembayaran ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : pembayaranData?.data && pembayaranData.data.length > 0 ? (
              <div className="space-y-3">
                {pembayaranData.data.map((tagihan) => (
                  <div key={tagihan.id} className="p-3 border rounded-lg bg-card text-sm flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {tagihan.iuran?.nama || 'Iuran'} ({tagihan.bulan}/{tagihan.tahun})
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <User className="h-3 w-3 mr-1" />
                        {tagihan.penghuni?.nama || 'Tidak ada info'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold mb-1">
                        Rp {tagihan.nominal.toLocaleString('id-ID')}
                      </p>
                      {tagihan.is_paid ? (
                        <Badge className="bg-green-500 hover:bg-green-600 text-xs">Lunas</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">Belum Bayar</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground">Belum ada riwayat pembayaran</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
