//C:\javacelikoglu\frontend\src\components\Header.tsx
"use client";

import { logoutUser, useAuth } from "@/hooks/useauth";
import { Heart, Search, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AuthModal from "./AuthModal";

interface HeaderProps {
  favoritesCount: number;
}

export default function Header({ favoritesCount }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
        setShowAuthModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (pathname !== "/admin") {
      setShowAuthModal((prev) => !prev);
    }
  };

  return (
    <header
      className="bg-dark-green text-white py-3 px-4 position-relative"
      style={{ zIndex: 1000 }}
    >
      <div className="d-flex justify-content-between align-items-center container">
        <Link href="/" className="fw-bold fs-4 text-white text-decoration-none">
          UsluOğlu Baklava
        </Link>

        <nav className="d-flex gap-4">
          <Link
            href="/products/baklavalar"
            className="text-white text-decoration-none"
          >
            BAKLAVALAR
          </Link>
          <Link
            href="/products/yoresel-urunler"
            className="text-white text-decoration-none"
          >
            YÖRESEL ÜRÜNLER
          </Link>
        </nav>

        <div className="d-flex gap-3 align-items-center position-relative">
          <div className="d-flex align-items-center gap-2 position-relative">
            {showSearch && (
              <input
                type="text"
                placeholder="Ürün Ara..."
                className="form-control rounded shadow border-0"
                style={{ width: "200px", zIndex: 1001 }}
              />
            )}
            <Search
              role="button"
              style={{ cursor: "pointer" }}
              onClick={() => setShowSearch(!showSearch)}
            />
          </div>

          <Link href="/favorites" className="position-relative text-white">
            <Heart role="button" style={{ cursor: "pointer" }} />
            {favoritesCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "0.6rem" }}
              >
                {favoritesCount}
              </span>
            )}
          </Link>

          <div className="position-relative" ref={profileRef}>
            <div
              onClick={handleProfileClick}
              className="d-flex align-items-center"
              style={{ cursor: "pointer", gap: "6px" }}
              role="button"
              aria-label="Profil Menüsünü Aç"
            >
              <UserCircle size={24} />
              {user && (
                <span className="text-white profile-name">Kullanıcı</span>
              )}
            </div>
            {pathname !== "/admin" && showAuthModal && (
              <div className="position-absolute end-0 mt-2">
                {user ? (
                  <div
                    className="bg-white text-dark rounded shadow p-3"
                    style={{ minWidth: "180px", zIndex: 1001 }}
                  >
                    <div className="dropdown-item py-1">
                      Merhaba, {user.name}
                    </div>
                    <Link
                      href="/profile"
                      className="dropdown-item d-block py-1 text-dark text-decoration-none"
                    >
                      Profil
                    </Link>
                    <Link
                      href="/settings"
                      className="dropdown-item d-block py-1 text-dark text-decoration-none"
                    >
                      Ayarlar
                    </Link>
                    <div
                      className="dropdown-item py-1 text-dark cursor-pointer"
                      onClick={() => {
                        logoutUser();
                        setShowAuthModal(false);
                        window.location.href = "/";
                      }}
                    >
                      Çıkış Yap
                    </div>
                  </div>
                ) : (
                  <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
