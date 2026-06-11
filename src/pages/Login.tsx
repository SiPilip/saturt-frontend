import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, UserCircle2, ArrowLeft } from "lucide-react";

// Validasi Form
const loginSchema = z.object({
  nik: z
    .string()
    .min(16, "NIK minimal 16 karakter")
    .max(16, "NIK maksimal 16 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // State untuk mode Lock Screen
  const savedNik = localStorage.getItem("saturt_admin_nik");
  const [isLockedMode, setIsLockedMode] = useState(!!savedNik);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nik: savedNik || "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", data);
      if (response.data.status) {
        // Simpan NIK untuk pengalaman "Lock Screen" berikutnya
        localStorage.setItem("saturt_admin_nik", data.nik);
        // Tandai user sedang login untuk proteksi rute frontend
        localStorage.setItem("is_authenticated", "true");

        toast.success("Login Berhasil", {
          description: "Selamat datang kembali, Bapak RT.",
        });
        navigate("/admin");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat login";
      toast.error("Gagal Masuk", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGantiAkun = () => {
    localStorage.removeItem("saturt_admin_nik");
    setIsLockedMode(false);
    reset({ nik: "", password: "" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Gambar Desa */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-rt.png')" }}
      />
      {/* Overlay Hijau Pastel dengan Opacity Rendah */}
      <div className="absolute inset-0 z-0 bg-primary/70 mix-blend-multiply backdrop-blur-[2px]" />

      {/* Background Ornamen Halus (opsional, untuk menambah estetika) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-overlay opacity-50">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-white blur-[100px]" />
      </div>

      <Card className="w-full max-w-[400px] shadow-2xl border-white/20 relative overflow-hidden z-10 bg-background/85 backdrop-blur-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/80 to-primary" />

        <CardHeader className="space-y-3 text-center mt-4">
          {isLockedMode ? (
            <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2 ring-4 ring-background shadow-inner">
                <UserCircle2 className="w-12 h-12 text-primary/80" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Selamat Datang
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Admin Ketua RT
              </CardDescription>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <UserCircle2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Portal Admin
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Sistem Manajemen Saturt
              </CardDescription>
            </div>
          )}
        </CardHeader>

        <CardContent className="px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Input NIK - Hanya Tampil Jika BUKAN mode Lock Screen */}
            {!isLockedMode && (
              <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500">
                <Label
                  htmlFor="nik"
                  className="font-semibold text-foreground/80"
                >
                  Nomor Induk Kependudukan
                </Label>
                <Input
                  id="nik"
                  placeholder="Misal: 3271xxxxxxxxxxxx"
                  {...register("nik")}
                  className={`transition-all duration-300 ${
                    errors.nik
                      ? "border-destructive focus-visible:ring-destructive/20 bg-destructive/5"
                      : "bg-muted/50"
                  }`}
                  disabled={isLoading}
                  autoFocus
                />
                {errors.nik && (
                  <p className="text-[13px] font-medium text-destructive flex items-center gap-1.5 animate-in slide-in-from-top-1 fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.nik.message}
                  </p>
                )}
              </div>
            )}

            <div
              className={`space-y-2 ${isLockedMode ? "animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150" : ""}`}
            >
              {!isLockedMode && (
                <Label
                  htmlFor="password"
                  className="font-semibold text-foreground/80"
                >
                  Password
                </Label>
              )}
              <Input
                id="password"
                type="password"
                placeholder={
                  isLockedMode ? "Masukkan Password untuk masuk..." : "••••••••"
                }
                {...register("password")}
                className={`transition-all duration-300 ${
                  errors.password
                    ? "border-destructive focus-visible:ring-destructive/20 bg-destructive/5"
                    : "bg-muted/50"
                } ${isLockedMode ? "h-12 text-center text-lg tracking-widest shadow-sm" : ""}`}
                disabled={isLoading}
                autoFocus={isLockedMode}
              />
              {errors.password && (
                <p className="text-[13px] font-medium text-destructive flex items-center gap-1.5 animate-in slide-in-from-top-1 fade-in duration-200 justify-center">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size={isLockedMode ? "lg" : "default"}
              className={`w-full transition-all active:scale-[0.98] ${isLockedMode ? "mt-4 shadow-md rounded-xl" : "mt-2"}`}
              disabled={isLoading}
            >
              {isLoading
                ? "Memverifikasi..."
                : isLockedMode
                  ? "Buka Sistem"
                  : "Masuk"}
            </Button>

            {/* Tombol Ganti Akun */}
            {isLockedMode && (
              <div className="pt-4 text-center animate-in fade-in duration-500 delay-300">
                <button
                  type="button"
                  onClick={handleGantiAkun}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Ganti Akun Admin
                </button>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-6"></CardFooter>
      </Card>
    </div>
  );
}
