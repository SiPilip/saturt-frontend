import { Link } from "react-router-dom";
import {
  Wallet,
  Users,
  TreePine,
  ShieldCheck,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  Handshake,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center">
                <TreePine className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-base">RT 05 / RW 02</span>
            </div>
            <Link to="/pembayaran">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Wallet className="mr-2 h-4 w-4" />
                Bayar Iuran
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Photo */}
      <section
        className="relative pt-16 overflow-hidden"
        style={{
          backgroundImage: "url(/images/hero-rt.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm text-white/90">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Selamat Datang, Warga!
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Perumahan
              <br />
              <span className="text-emerald-400">RT 05 / RW 02</span>
            </h1>

            <p className="text-lg text-white/80 leading-relaxed max-w-lg">
              Portal resmi Rukun Tetangga 05 / RW 02. Tempat warga mendapatkan
              informasi lingkungan dan melakukan pembayaran iuran secara
              mandiri.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/pembayaran">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 h-12 text-base bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Bayar Iuran Warga
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#tentang">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 h-12 text-base border-white/30 text-black hover:bg-white/10 "
                >
                  Tentang RT Kami
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang RT Section */}
      <section id="tentang" className="scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
                <Handshake className="h-4 w-4" />
                Tentang Kami
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Bersama Membangun
                <br />
                Lingkungan yang Lebih Baik
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                RT 05 / RW 02 berkomitmen mewujudkan lingkungan yang aman,
                bersih, dan nyaman untuk seluruh warga. Melalui sistem digital
                ini, kami mempermudah akses informasi dan layanan administrasi
                bagi seluruh penghuni perumahan.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { value: "Aman", label: "Lingkungan Terjaga" },
                  { value: "Bersih", label: "Kebersihan Terpelihara" },
                  { value: "Nyaman", label: "Hunian Harmonis" },
                  { value: "Transparan", label: "Keuangan Terbuka" },
                ].map((item) => (
                  <div key={item.value} className="space-y-0.5">
                    <p className="text-lg font-bold text-emerald-600">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Keamanan 24 Jam",
                  desc: "Pos keamanan aktif dengan sistem ronda malam dan CCTV di titik strategis.",
                  color: "bg-blue-500/10 text-blue-600",
                },
                {
                  icon: TreePine,
                  title: "Lingkungan Hijau",
                  desc: "Taman bermain, ruang terbuka hijau, dan pepohonan rindang di sepanjang jalan.",
                  color: "bg-emerald-500/10 text-emerald-600",
                },
                {
                  icon: Users,
                  title: "Komunitas Aktif",
                  desc: "Kegiatan rutin seperti kerja bakti, arisan, dan perayaan hari besar bersama.",
                  color: "bg-amber-500/10 text-amber-600",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-xl border bg-background p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div
                    className={`flex-shrink-0 h-11 w-11 rounded-lg ${item.color} flex items-center justify-center`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Warga Section */}
      <section className="border-t bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 mb-4">
              <Megaphone className="h-4 w-4" />
              Layanan Warga
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Kemudahan untuk Warga
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Nikmati kemudahan layanan administrasi RT tanpa harus datang ke
              pos secara langsung.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Wallet,
                title: "Bayar Iuran Online",
                desc: "Cek tagihan dan bayar iuran RT kapan saja melalui portal pembayaran digital dengan sistem QR Code.",
                action: "/pembayaran",
                actionText: "Bayar Sekarang",
              },
              {
                icon: ShieldCheck,
                title: "Transparansi Keuangan",
                desc: "Seluruh pemasukan dan pengeluaran kas RT tercatat dan dapat dipertanggungjawabkan kepada warga.",
                action: null,
                actionText: null,
              },
              {
                icon: Users,
                title: "Data Warga Terkelola",
                desc: "Informasi penghuni dan rumah tersimpan dengan rapi, memudahkan koordinasi dan komunikasi antar warga.",
                action: null,
                actionText: null,
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border bg-background p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  {feature.desc}
                </p>
                {feature.action && (
                  <Link to={feature.action} className="mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:border-emerald-600 group-hover:text-emerald-600 transition-colors"
                    >
                      {feature.actionText}
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-10 md:p-16 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-white/5 rounded-full" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Sudah Bayar Iuran Bulan Ini?
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Yuk lunasi tagihan iuran RT Anda melalui portal pembayaran
                online. Cepat, mudah, dan tidak perlu antri!
              </p>
              <Link to="/pembayaran">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-10 h-12 text-base mt-2 shadow-lg"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Cek Tagihan Saya
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <TreePine className="h-5 w-5 text-white" />
                </div>
                <div className="leading-tight">
                  <span className="font-bold block">RT 05 / RW 02</span>
                  <span className="text-xs text-muted-foreground">
                    Perumahan RT 05 / RW 02.
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bersama mewujudkan lingkungan yang aman, bersih, nyaman, dan
                sejahtera untuk seluruh warga perumahan.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Layanan
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/pembayaran"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Portal Pembayaran Iuran
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Kontak Pengurus RT
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>Pos RT 05</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>+62 812-xxxx-xxxx (Ketua RT)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>Senin — Jumat, 08.00 — 17.00 WIB</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-10 pt-8 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} RT 05 / RW 02 SatuRT App
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
