//C:\javacelikoglu\frontend\src\components\Footer.tsx
"use client";
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer mt-5 py-3 bg-dark-green text-white text-center">
      <div className="container">
        <p className="mb-1">&copy; {new Date().getFullYear()} Çelikoğlu Baklava. Tüm hakları saklıdır.</p>
        <small>Lezzetin en tatlı adresi.</small>
      </div>
    </footer>
  );
};

export default Footer;
