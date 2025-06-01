// C:\javacelikoglu\frontend\src\components\admin\AdminSidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaBoxOpen,
  FaChartBar,
  FaCog,
  FaNewspaper,
  FaSignOutAlt,
  FaStore,
} from "react-icons/fa";

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar?: () => void;  // opsiyonel olarak ekledim
}


const AdminSidebar = ({ isOpen }: AdminSidebarProps) => {
  const pathname = usePathname();
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleProducts = () => {
    setIsProductsOpen((prev) => !prev);
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`} aria-label="Admin panel yan menü">
      <nav className="admin-sidebar__nav d-flex flex-column gap-1">
        <Link href="/admin" className={`admin-sidebar__link ${isActive("/admin") ? "active" : ""}`}>
          <FaStore />
          <span>Panel Anasayfa</span>
        </Link>

        <button
          className={`admin-sidebar__link ${isProductsOpen ? "active" : ""}`}
          onClick={toggleProducts}
          style={{ cursor: "pointer" }}
          aria-expanded={isProductsOpen}
          aria-controls="products-submenu"
        >
          <FaBoxOpen />
          <span>Ürünler</span>
        </button>
        {isProductsOpen && (
          <div id="products-submenu" className="admin-sidebar__submenu">
            <Link
              href="/admin/products/baklavalar"
              className={`admin-sidebar__link ${isActive("/admin/products/baklavalar") ? "active" : ""}`}
            >
              <span>Baklavalar</span>
            </Link>
            <Link
              href="/admin/products/yoresel-urunler"
              className={`admin-sidebar__link ${isActive("/admin/products/yoresel-urunler") ? "active" : ""}`}
            >
              <span>Yöresel Ürünler</span>
            </Link>
          </div>
        )}

        <Link
          href="/admin/video"
          className={`admin-sidebar__link ${isActive("/admin/video") ? "active" : ""}`}
        >
          <FaNewspaper />
          <span>Videolar</span>
        </Link>
        <Link
          href="/admin/news"
          className={`admin-sidebar__link ${isActive("/admin/news") ? "active" : ""}`}
        >
          <FaNewspaper />
          <span>Haberler</span>
        </Link>

        <Link
          href="/admin/statistics"
          className={`admin-sidebar__link ${isActive("/admin/statistics") ? "active" : ""}`}
        >
          <FaChartBar />
          <span>İstatistikler</span>
        </Link>

        <Link
          href="/admin/settings"
          className={`admin-sidebar__link ${isActive("/admin/settings") ? "active" : ""}`}
        >
          <FaCog />
          <span>Profil Ayarları</span>
        </Link>

        <Link
          href="/logout"
          className={`admin-sidebar__link ${isActive("/logout") ? "active" : ""}`}
        >
          <FaSignOutAlt />
          <span>Çıkış Yap</span>
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;