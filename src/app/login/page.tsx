//C:\javacelikoglu\frontend\src\app\login\page.tsx
"use client";
import { loginUser } from "@/hooks/useauth"; // loginUser fonksiyonu useauth.ts'den
import { login } from "@/utils/api"; // login fonksiyonu api.ts'den
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await login(email, password); // api.ts'deki login fonksiyonu
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
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "80vh",
        backgroundColor: "var(--background)",
        padding: "2rem",
      }}
    >
      <div
        className="bg-white shadow rounded p-4"
        style={{ maxWidth: "450px", width: "100%", border: "1px solid #eee" }}
      >
        <h2 className="text-center mb-4" style={{ color: "var(--darkGreen)" }}>
          Giriş Yap
        </h2>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="custom-button w-100 mb-3">Giriş Yap</button>

          <div className="text-center">
            <Link href="/forgot-password">Şifremi Unuttum</Link>
          </div>
          <div className="text-center mt-2">
            <Link href="/register">Hesabın yok mu? Kayıt Ol</Link>
          </div>
        </form>
      </div>
    </div>
  );
}