import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Home,
  CreditCard,
  Receipt,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  LogOut,
  Settings,
} from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { toast } from "sonner";

const menus = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Data Penghuni", url: "/admin/penghuni", icon: Users },
  { title: "Data Rumah", url: "/admin/rumah", icon: Home },
  { title: "Master Iuran", url: "/admin/iuran", icon: CreditCard },
  { title: "Manajemen Tagihan", url: "/admin/tagihan", icon: Receipt },
  { title: "Pemasukan Manual", url: "/admin/pemasukan", icon: ArrowDownToLine },
  {
    title: "Pengeluaran Kas",
    url: "/admin/pengeluaran",
    icon: ArrowUpFromLine,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("is_authenticated");
      toast.success("Berhasil Logout", { description: "Sesi telah diakhiri." });
      // Redirect ke login
      navigate("/login");
    } catch (error) {
      toast.error("Gagal Logout", { description: "Silakan coba lagi." });
    }
  };

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="pt-4 pb-2">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner">
            S
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-foreground">RT 05 / RW 02</span>
            <span className="text-xs text-muted-foreground">Admin Portal</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menus.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              tooltip="Keluar Aplikasi"
            >
              <LogOut />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
