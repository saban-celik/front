//C:\javacelikoglu\frontend\src\app\layout.tsx
"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");

  const handleAddToFavorites = () => {
    setFavoritesCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).addToFavorites = handleAddToFavorites;
    }
  }, []);

  return (
    <html lang="tr">
      <body style={{ margin: 0, padding: 0 }}>
        {!isAdminPage && <Header favoritesCount={favoritesCount} />}
        {/* Admin sayfalarında boşluk bırakma */}
        <main className={isAdminPage ? "" : "my-4"}>{children}</main>
      </body>
    </html>
  );
}
