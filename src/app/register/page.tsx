// C:\javacelikoglu\frontend\src\app\register\page.tsx
"use client";
import { loginUser } from "@/hooks/useauth"; // loginUser fonksiyonu useauth.ts'den
import { register } from "@/utils/api"; // register fonksiyonu api.ts'den
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    try {
      const data = await register(name, email, password); // api.ts'deki register fonksiyonu
      loginUser(data.user);

      if (data.user.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) { // err tipini any olarak belirtiyoruz
      alert(err.message || "Sunucu hatası");
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Kayıt Ol</h1>
      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Ad Soyad</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">E-posta</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Şifre</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Şifre Tekrar</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="custom-button w-100 mb-3">Kayıt Ol</button>
        <div className="text-center">
          <Link href="/login">Zaten hesabın var mı? Giriş Yap</Link>
        </div>
      </form>
    </div>
  );
}