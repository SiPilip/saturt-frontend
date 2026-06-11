import { useState } from "react";
import { useGetRingkasan, useGetGrafik, useGetBelumBayar } from "@/api/hooks/useDashboard";
import api from "@/api/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, Wallet, Users, AlertCircle, FileDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Legend } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { toast } from "sonner";

const chartConfig = {
  Pemasukan: {
    label: "Pemasukan",
    color: "hsl(var(--chart-1))",
  },
  Pengeluaran: {
    label: "Pengeluaran",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

export default function Dashboard() {
  const { data: ringkasanData, isLoading: isLoadingRingkasan } = useGetRingkasan();
  const { data: grafikData, isLoading: isLoadingGrafik } = useGetGrafik(12);
  const [pageBelumBayar, setPageBelumBayar] = useState(1);
  const { data: belumBayarData, isLoading: isLoadingBelumBayar } = useGetBelumBayar(pageBelumBayar, 5);

  // Export state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportBulan, setExportBulan] = useState(currentMonth.toString());
  const [exportTahun, setExportTahun] = useState(currentYear.toString());
  const [isExporting, setIsExporting] = useState(false);

  const ringkasan = ringkasanData?.data;
  const grafik = grafikData?.data;
  const belumBayar = belumBayarData?.data || [];

  // Prepare chart data format for Recharts
  const chartData = grafik ? grafik.labels.map((label, index) => ({
    label,
    Pemasukan: grafik.pemasukan[index],
    Pengeluaran: grafik.pengeluaran[index]
  })) : [];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await api.get('/keuangan/export', {
        params: { bulan: exportBulan, tahun: exportTahun },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `keuangan-${exportTahun}-${exportBulan}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Berhasil", { description: "File Excel berhasil diunduh" });
      setIsExportOpen(false);
    } catch (error: any) {
      toast.error("Gagal", {
        description: error.response?.data?.message || "Gagal mengunduh file Excel",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Keuangan</h2>
          <p className="text-muted-foreground mt-1">Ringkasan kas Rukun Tetangga dan riwayat pengeluaran.</p>
        </div>
        <Button onClick={() => setIsExportOpen(true)} variant="outline" className="shadow-sm hover:shadow-md transition-all">
          <FileDown className="mr-2 h-4 w-4" /> Export Excel
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Pemasukan Bulan Ini */}
        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pemasukan (Bulan Ini)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoadingRingkasan ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  Rp {ringkasan?.bulan_ini.pemasukan.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total tagihan terkumpul: {ringkasan?.bulan_ini.tagihan_lunas} dari {ringkasan?.bulan_ini.tagihan_total}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Pengeluaran Bulan Ini */}
        <Card className="shadow-sm border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengeluaran (Bulan Ini)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {isLoadingRingkasan ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold text-red-600">
                  Rp {ringkasan?.bulan_ini.pengeluaran.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Berdasarkan data operasional</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Saldo Kas All-time */}
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Kas (All-time)</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoadingRingkasan ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  Rp {ringkasan?.all_time.saldo.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total surplus kas RT</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tagihan Tertunggak */}
        <Card className="shadow-sm border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tunggakan (Bulan Ini)</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {isLoadingRingkasan ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold text-orange-600">
                  {ringkasan?.bulan_ini.tagihan_belum_bayar} Tagihan
                </div>
                <p className="text-xs text-muted-foreground mt-1">Warga belum membayar iuran</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Grafik Keuangan (1 Tahun)</CardTitle>
            <CardDescription>Pemasukan vs Pengeluaran per bulan</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {isLoadingGrafik ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            ) : chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="label" 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar dataKey="Pemasukan" fill="var(--color-Pemasukan)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pengeluaran" fill="var(--color-Pengeluaran)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Tidak ada data grafik
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-muted flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Belum Bayar Iuran
            </CardTitle>
            <CardDescription>Bulan ini ({new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })})</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {isLoadingBelumBayar ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : belumBayar.length > 0 ? (
              <div className="space-y-4">
                {belumBayar.map((tagihan) => (
                  <div key={tagihan.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{tagihan.penghuni?.nama || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{tagihan.rumah?.blok_nomor || '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-orange-600">
                        Rp {tagihan.iuran?.biaya.toLocaleString('id-ID')}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase">{tagihan.iuran?.nama}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm space-y-2">
                <CheckCircleIcon className="h-10 w-10 text-green-500 opacity-50" />
                <p>Semua warga sudah membayar bulan ini!</p>
              </div>
            )}
          </CardContent>
          {belumBayarData?.meta && belumBayarData.meta.total_pages > 1 && (
            <div className="p-3 border-t flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageBelumBayar(p => Math.max(1, p - 1))}
                disabled={pageBelumBayar === 1 || isLoadingBelumBayar}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                Hal {pageBelumBayar} dari {belumBayarData.meta.total_pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageBelumBayar(p => p + 1)}
                disabled={pageBelumBayar >= belumBayarData.meta.total_pages || isLoadingBelumBayar}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Export Excel Dialog */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Laporan Keuangan</DialogTitle>
            <DialogDescription>
              Pilih periode bulan dan tahun untuk mengunduh laporan keuangan dalam format Excel (.xlsx). File akan berisi 3 sheet: Pemasukan, Pengeluaran, dan Ringkasan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="export_bulan">Bulan</Label>
              <Select value={exportBulan} onValueChange={setExportBulan}>
                <SelectTrigger id="export_bulan">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((m, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="export_tahun">Tahun</Label>
              <Select value={exportTahun} onValueChange={setExportTahun}>
                <SelectTrigger id="export_tahun">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => (currentYear - 1 + i).toString()).map(y => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              <FileDown className="mr-2 h-4 w-4" />
              {isExporting ? "Mengunduh..." : "Unduh Excel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simple helper component for empty state
function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
