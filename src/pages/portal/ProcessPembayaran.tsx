import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import type { PaymentPayload } from '@/api/hooks/usePembayaranPublik';

export default function ProcessPembayaran() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const payloadBase64 = searchParams.get('payload');

  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Gunakan ref untuk mencegah double fire di React 18 Strict Mode
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    if (!payloadBase64) {
      setStatus('error');
      setErrorMessage('Payload pembayaran tidak valid atau hilang.');
      return;
    }

    try {
      const decodedPayload = atob(payloadBase64);
      const parsedPayload: PaymentPayload = JSON.parse(decodedPayload);

      if (!parsedPayload.nik || !parsedPayload.iuran || !Array.isArray(parsedPayload.iuran)) {
        throw new Error('Format payload salah');
      }

      // Jalankan request bayar secara langsung (tanpa useMutation) 
      // agar callback then/catch tidak dibatalkan oleh React Query saat remount (Strict Mode)
      api.post('/payment', parsedPayload)
        .then(() => {
          setStatus('success');
        })
        .catch((err: any) => {
          setStatus('error');
          setErrorMessage(err.response?.data?.message || 'Gagal memproses pembayaran ke server.');
        });
      
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Terjadi kesalahan saat memecah kode QR.');
    }
  }, [payloadBase64]);

  return (
    <div className="min-h-screen bg-muted/30 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="text-center pb-2">
          {status === 'processing' && (
             <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
               <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
             </div>
          )}
          {status === 'success' && (
             <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
               <CheckCircle className="h-8 w-8 text-green-600" />
             </div>
          )}
          {status === 'error' && (
             <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
               <XCircle className="h-8 w-8 text-red-600" />
             </div>
          )}

          <CardTitle className="text-2xl font-bold">
            {status === 'processing' && 'Memproses Pembayaran...'}
            {status === 'success' && 'Pembayaran Berhasil!'}
            {status === 'error' && 'Pembayaran Gagal'}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {status === 'processing' && 'Mohon tunggu sebentar sementara kami memverifikasi pembayaran Anda.'}
            {status === 'success' && 'Terima kasih, tagihan Anda telah lunas dan tercatat di sistem otomatis.'}
            {status === 'error' && errorMessage}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Button 
            className="w-full" 
            variant={status === 'error' ? 'destructive' : 'default'}
            onClick={() => navigate('/pembayaran')}
          >
            {status === 'error' ? (
              <>Kembali ke Portal</>
            ) : (
              <><ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Portal</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
