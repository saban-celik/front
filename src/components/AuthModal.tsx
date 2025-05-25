// C:\javacelikoglu\frontend\src\components\AuthModal.tsx
"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="position-absolute end-0 mt-2 p-3 bg-white rounded shadow"
      style={{
        minWidth: "180px",
        zIndex: 9999,
        top: "100%",
        right: "0",
      }}
    >
      <Link href="/login" className="dropdown-item d-block py-1 text-dark text-decoration-none">
        Giriş
      </Link>
      <Link href="/register" className="dropdown-item d-block py-1 text-dark text-decoration-none">
        Üye Ol
      </Link>
      <Link href="/forgot-password" className="dropdown-item d-block py-1 text-dark text-decoration-none">
        Şifremi Unuttum
      </Link>
    </div>
  );
};

export default AuthModal;

