//C:\javacelikoglu\frontend\src\components\admin\AdminTopbar.tsx
"use client";
import { FaBars } from "react-icons/fa";

interface AdminTopbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const AdminTopbar = ({ toggleSidebar, isSidebarOpen }: AdminTopbarProps) => {
  return (
    <header
      className="d-flex align-items-center justify-content-between px-4 py-3 bg-dark-green text-white admin-topbar"
      aria-label="Admin panel üst bar"
    >
      <button
        onClick={toggleSidebar}
        className="btn btn-sm text-white d-md-none"
        style={{
          background: "transparent",
          border: "none",
          fontSize: "1.5rem",
        }}
        aria-label="Menüyü Aç/Kapat"
      >
        <FaBars />
      </button>

      <div className="fw-bold fs-4">Çelikoğlu Admin Paneli</div>
      <div className="d-none d-md-block" style={{ fontSize: "1rem" }}>
        Yönetici Ekranı
      </div>
    </header>
  );
};

export default AdminTopbar;