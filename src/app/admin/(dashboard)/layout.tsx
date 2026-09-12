import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { ToastProvider } from "@/components/admin/ToastProvider";

// Auth enforcement already happens in src/middleware.ts for everything
// under /admin/:path* except /admin/login (NextAuth's own signIn page
// redirect handles that split). This layout is purely shell/chrome.

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-bg-primary)" }}>
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopBar />
        <main className="p-6">
          <ToastProvider>{children}</ToastProvider>
        </main>
      </div>
    </div>
  );
}
