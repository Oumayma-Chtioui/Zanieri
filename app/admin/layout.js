import AdminAuthGate from "@/components/admin/AdminAuthGate";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-bone/40">
        <AdminNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {children}
        </main>
      </div>
    </AdminAuthGate>
  );
}
