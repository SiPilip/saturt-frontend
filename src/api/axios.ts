import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Disesuaikan dengan URL backend dari swagger
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Wajib agar HttpOnly cookie (JWT token) otomatis dikirim
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Jika response 401 Unauthorized dan request belum pernah di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Jangan coba refresh jika request yang gagal adalah request login atau refresh itu sendiri
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        // Jika sedang di halaman login, biarkan errornya dilempar
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        // Coba untuk refresh token
        await api.post('/auth/refresh');
        
        // Jika refresh berhasil, kirim ulang request yang tadinya gagal
        return api(originalRequest);
      } catch (refreshError) {
        // Jika refresh juga gagal (misal session benar-benar habis)
        localStorage.removeItem('is_authenticated');
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
       localStorage.removeItem('is_authenticated');
    }

    return Promise.reject(error);
  }
);

export default api;
