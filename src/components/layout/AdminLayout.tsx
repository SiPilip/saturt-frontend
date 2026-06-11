import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet, Navigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout() {
  const isAuthenticated = localStorage.getItem("is_authenticated");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen relative bg-muted/20">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 shadow-sm">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground/80">
              Admin RT 05 / RW 02
            </h1>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-auto">
          {/* Komponen page child akan dirender di sini */}
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
