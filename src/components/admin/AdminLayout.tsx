// C:\javacelikoglu\frontend\src\components\admin\AdminLayout.tsx
"use client";
import { ReactNode, useState } from "react";
import "../../assets/styles/admin.css";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="admin-wrapper d-flex flex-column min-vh-100">
      <AdminTopbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="d-flex flex-grow-1">
        <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow-1" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;