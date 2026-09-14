import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { ToastProvider } from "@/components/admin/ToastProvider";

// Auth enforcement already happens in src/middleware.ts for everything
// under /admin/:path* except /admin/login (NextAuth's own signIn page
// redirect handles that split). This layout is purely shell/chrome.

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-red-500 selection:text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <AdminTopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <ToastProvider>{children}</ToastProvider>
        </main>
      </div>
    </div>
  );
}
