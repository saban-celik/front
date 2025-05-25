//C:\javacelikoglu\frontend\src\app\admin\page.tsx
"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useauth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (!user.isAdmin) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (!user || loading) {
    return <p className="text-center my-5">Yükleniyor...</p>;
  }

  return (
    <AdminLayout>
      <div className="container">
        <div className="dashboard">
          <h2 className="dashboard__title mb-4">Admin Paneli</h2>
          <p className="mb-3">
            Hoş geldiniz, <strong>{user.name}</strong> 👋
          </p>
          <p>
            Bu panelden ürün ekleyebilir, yorumları yönetebilir, haberleri düzenleyebilir ve daha
            fazlasını yapabilirsiniz. Sol menüden gezinmeye başlayın.
          </p>
          <div className="mt-4">
            <a href="/admin/products/baklavalar" className="quick-action__btn">
              Yeni Baklava Ekle
            </a>
            <a href="/admin/products/yoresel-urunler" className="quick-action__btn ms-2">
              Yeni Yöresel Ürün Ekle
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}