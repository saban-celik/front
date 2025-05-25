//C:\javacelikoglu\frontend\src\app\forgot-password\page.tsx

"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Şifre sıfırlama bağlantısı e-postanıza gönderilecektir.");
    // 🔐 Şifre sıfırlama API'si buraya entegre edilir
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '80vh',
        backgroundColor: 'var(--background)',
        padding: '2rem',
      }}
    >
      <div
        className="bg-white shadow rounded p-4"
        style={{ maxWidth: '450px', width: '100%', border: '1px solid #eee' }}
      >
        <h2 className="text-center mb-4" style={{ color: 'var(--darkGreen)' }}>
          Şifremi Unuttum
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">E-posta</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Kayıtlı e-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="custom-button w-100 mb-3">
            Şifre Sıfırlama Bağlantısı Gönder
          </button>

          <div className="text-center">
            <Link href="/login" className="text-decoration-none">
              Giriş Yap
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
