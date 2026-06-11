import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import PenghuniList from '@/pages/penghuni/PenghuniList';
import RumahList from '@/pages/rumah/RumahList';
import IuranList from '@/pages/iuran/IuranList';
import TagihanList from '@/pages/tagihan/TagihanList';
import PengeluaranList from '@/pages/pengeluaran/PengeluaranList';
import PemasukanList from '@/pages/pemasukan/PemasukanList';
import AdminLayout from '@/components/layout/AdminLayout';

import PortalPembayaran from '@/pages/portal/PortalPembayaran';
import ProcessPembayaran from '@/pages/portal/ProcessPembayaran';
import LandingPage from '@/pages/LandingPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />, // Sisi publik / auth
  },
  {
    path: '/pembayaran',
    element: <PortalPembayaran />,
  },
  {
    path: '/pembayaran/process',
    element: <ProcessPembayaran />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '', // Akan me-resolve /admin
        element: <Dashboard />,
      },
      {
        path: 'penghuni', // Akan me-resolve /admin/penghuni
        element: <PenghuniList />,
      },
      {
        path: 'rumah', // Akan me-resolve /admin/rumah
        element: <RumahList />,
      },
      {
        path: 'iuran', // Akan me-resolve /admin/iuran
        element: <IuranList />,
      },
      {
        path: 'tagihan', // Akan me-resolve /admin/tagihan
        element: <TagihanList />,
      },
      {
        path: 'pemasukan', // Akan me-resolve /admin/pemasukan
        element: <PemasukanList />,
      },
      {
        path: 'pengeluaran', // Akan me-resolve /admin/pengeluaran
        element: <PengeluaranList />,
      },
    ],
  },
  {
    path: '*',
    element: <div className="p-8 text-center text-red-500">404 - Halaman Tidak Ditemukan</div>,
  }
]);

import { Toaster } from '@/components/ui/sonner';

export function AppRouter() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
