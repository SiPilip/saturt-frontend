import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetTagihanPublik } from '@/api/hooks/usePembayaranPublik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Search, Wallet, ArrowRight, Shield, ArrowLeft, ScanLine, CreditCard, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import QRCode from 'react-qr-code';

export default function PortalPembayaran() {
  const [nikInput, setNikInput] = useState('');
  const [searchNik, setSearchNik] = useState('');
  
  const [selectedTagihansMap, setSelectedTagihansMap] = useState<Record<string, number>>({});
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useGetTagihanPublik(searchNik, !!searchNik);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nikInput.trim()) {
      toast.error('NIK tidak boleh kosong');
      return;
    }
    setSearchNik(nikInput);
    setSelectedTagihansMap({});
  };

  const tagihans = data?.data?.tagihan || [];
  const penghuni = data?.data?.penghuni;

  const handleToggleSelect = (id: string) => {
    setSelectedTagihansMap(prev => {
      const newMap = { ...prev };
      if (newMap[id]) {
        delete newMap[id];
      } else {
        newMap[id] = 1;
      }
      return newMap;
    });
  };

  const handleUpdateJangka = (id: string, jangka: number) => {
    setSelectedTagihansMap(prev => ({
      ...prev,
      [id]: jangka
    }));
  };

  const handleSelectAll = () => {
    if (Object.keys(selectedTagihansMap).length === tagihans.length) {
      setSelectedTagihansMap({});
    } else {
      const newMap: Record<string, number> = {};
      tagihans.forEach(t => {
        newMap[t.id] = 1;
      });
      setSelectedTagihansMap(newMap);
    }
  };

  const selectedTagihansList = useMemo(() => {
    return tagihans
      .filter(t => selectedTagihansMap[t.id] !== undefined)
      .map(t => ({
        ...t,
        jangka: selectedTagihansMap[t.id],
        totalTagihanItem: t.nominal * selectedTagihansMap[t.id]
      }));
  }, [tagihans, selectedTagihansMap]);

  const totalBayar = selectedTagihansList.reduce((sum, t) => sum + t.totalTagihanItem, 0);

  const generatePaymentUrl = () => {
    if (!penghuni || selectedTagihansList.length === 0) return '';
    
    const payloadObject = {
      nik: penghuni.nik,
      iuran: selectedTagihansList.map(t => ({
        id_tagihan: t.id,
        jangka: t.jangka,
        tagihan: t.totalTagihanItem
      }))
    };
    
    const base64Payload = btoa(JSON.stringify(payloadObject));
    const url = `${window.location.origin}/pembayaran/process?payload=${base64Payload}`;
    
    return url;
  };

  const paymentUrl = generatePaymentUrl();

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Compact Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm">SaturtApp</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">
          
          {/* Header Portal */}
          <div className="text-center space-y-3 mb-2 mt-4">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Portal Pembayaran Warga</h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Cek dan bayar tagihan iuran Rukun Tetangga secara mandiri.
            </p>
          </div>

          {/* How it Works - Steps */}
          {!data?.status && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {[
                { icon: Search, step: '1', title: 'Cari NIK', desc: 'Masukkan 16 digit NIK Anda yang terdaftar di RT' },
                { icon: ScanLine, step: '2', title: 'Pilih Tagihan', desc: 'Centang tagihan yang ingin dibayar saat ini' },
                { icon: CreditCard, step: '3', title: 'Bayar via QR', desc: 'Scan QR Code untuk memproses pembayaran' },
              ].map((item) => (
                <div key={item.step} className="relative rounded-xl border bg-background p-5 text-center space-y-2">
                  <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {item.step}
                  </div>
                  <item.icon className="h-6 w-6 text-primary mx-auto" />
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Form Pencarian NIK */}
          <Card className="shadow-sm border-muted">
            <CardHeader>
              <CardTitle className="text-lg">Cari Data Tagihan</CardTitle>
              <CardDescription>Masukkan Nomor Induk Kependudukan (NIK) Anda yang terdaftar.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Masukkan 16 digit NIK..." 
                    className="pl-10 h-10" 
                    value={nikInput}
                    onChange={(e) => setNikInput(e.target.value)}
                  />
                </div>
                <Button type="submit" className="h-10 px-8" disabled={isLoading}>
                  {isLoading ? 'Mencari...' : 'Cari'}
                </Button>
              </form>
              {isError && (
                <p className="text-sm text-destructive mt-3">
                  {(error as any)?.response?.data?.message || 'Penghuni tidak ditemukan atau terjadi kesalahan.'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Hasil Pencarian & Daftar Tagihan */}
          {data?.status && penghuni && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              {/* Info Penghuni */}
              <Card className="bg-primary text-primary-foreground border-none">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold">{penghuni.nama}</h2>
                  <p className="text-primary-foreground/80">NIK: {penghuni.nik}</p>
                  {tagihans.length > 0 && tagihans[0].rumah && (
                    <p className="text-primary-foreground/80 mt-1">Blok: {tagihans[0].rumah.blok_nomor}</p>
                  )}
                </CardContent>
              </Card>

              {tagihans.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent className="space-y-3">
                    <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold">Semua Lunas!</h3>
                    <p className="text-muted-foreground">Anda tidak memiliki tagihan yang tertunggak saat ini.</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Daftar Tagihan Belum Lunas</CardTitle>
                      <CardDescription>Pilih tagihan yang ingin Anda bayar saat ini.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSelectAll}>
                      {Object.keys(selectedTagihansMap).length === tagihans.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tagihans.map((tagihan) => {
                      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
                      const b = tagihan.bulan;
                      const mName = b >= 1 && b <= 12 ? monthNames[b - 1] : b;
                      const isSelected = selectedTagihansMap[tagihan.id] !== undefined;
                      const jangka = selectedTagihansMap[tagihan.id] || 1;

                      return (
                        <div 
                          key={tagihan.id} 
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg transition-colors ${
                            isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center space-x-4 cursor-pointer flex-1" onClick={() => handleToggleSelect(tagihan.id)}>
                            <Checkbox 
                              checked={isSelected}
                              onCheckedChange={() => handleToggleSelect(tagihan.id)}
                            />
                            <div>
                              <p className="font-semibold">{tagihan.iuran?.nama}</p>
                              <p className="text-sm text-muted-foreground">Periode awal: {mName} {tagihan.tahun}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end mt-4 sm:mt-0 space-x-4 ml-8 sm:ml-0">
                            {isSelected && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">Jangka:</span>
                                <select 
                                  className="h-8 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm"
                                  value={jangka}
                                  onChange={(e) => handleUpdateJangka(tagihan.id, parseInt(e.target.value))}
                                >
                                  {[1, 2, 3, 4, 5, 6, 12].map(n => (
                                    <option key={n} value={n}>{n} Bulan</option>
                                  ))}
                                </select>
                              </div>
                            )}
                            <div className="font-bold text-lg text-right min-w-[120px]">
                              Rp {(tagihan.nominal * jangka).toLocaleString('id-ID')}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Total & Action Bar */}
              {tagihans.length > 0 && (
                <div className="sticky bottom-4 bg-white p-4 rounded-xl shadow-lg border border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total yang harus dibayar ({selectedTagihansList.length} tagihan)</p>
                    <p className="text-2xl font-bold text-primary">Rp {totalBayar.toLocaleString('id-ID')}</p>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto px-8" 
                    disabled={selectedTagihansList.length === 0}
                    onClick={() => setIsQrModalOpen(true)}
                  >
                    Bayar Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compact Footer */}
      <footer className="border-t bg-background mt-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SaturtApp — Sistem Administrasi Terpadu RT</p>
            <Link to="/" className="hover:text-foreground transition-colors">Kembali ke Beranda</Link>
          </div>
        </div>
      </footer>

      {/* QR Code Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Scan untuk Membayar</DialogTitle>
            <DialogDescription className="text-center">
              Arahkan kamera HP Anda ke QR Code ini, atau klik QR Code jika Anda mengakses dari HP.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-6">
            {paymentUrl && (
              <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="p-4 bg-white rounded-xl shadow-sm border border-muted hover:shadow-md transition-shadow cursor-pointer block">
                <QRCode value={paymentUrl} size={250} />
              </a>
            )}
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-semibold text-lg">Total: Rp {totalBayar.toLocaleString('id-ID')}</p>
            <p className="text-sm text-muted-foreground mt-1">Pembayaran otomatis diverifikasi setelah link dibuka</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
