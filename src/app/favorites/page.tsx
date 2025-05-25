// C:\javacelikoglu\frontend\src\app\favorites\page.tsx

"use client";

import Footer from "@/components/Footer";
import WhatsAppChat from "@/components/WhatsAppChat";
import { useEffect, useState } from "react";

interface FavoriteItem {
  id: number;
  title: string;
  description: string;
  image: string;
  price?: number;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("favorites");
      if (raw) {
        const data = JSON.parse(raw) as FavoriteItem[];
        setFavorites(
          data.map(item => ({
            ...item,
            price: typeof item.price === "number" ? item.price : 0
          }))
        );
      }
    } catch {
      setFavorites([]);
    }
  }, []);

  const removeFavorite = (id: number) => {
    const updated = favorites.filter(item => item.id !== id);
    setFavorites(updated);
    window.localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const resolveImage = (src: string) =>
    src.startsWith("/uploads/")
      ? `http://localhost:8080${src}`
      : src;

  return (
    <>
      <div className="responsive-wrapper mt-24 mb-8">
        <h1 className="dashboard__title">Favori Ürünleriniz</h1>

        {favorites.length === 0 ? (
          <p>Henüz favori ürün eklemediniz.</p>
        ) : (
          <div className="favorites-grid mt-6">
            {favorites.map(item => {
              const numPrice = Number(item.price);
              const imgSrc = resolveImage(item.image);
              return (
                <div key={item.id} className="product-card">
                  <img
                    src={imgSrc}
                    alt={item.title}
                    className="product-card__img"
                  />
                  <h3 className="product-card__title">{item.title}</h3>
                  <p className="product-card__desc">{item.description}</p>
                  <p className="product-card__price">
                    <strong>Fiyat:</strong> {numPrice.toFixed(2)} TL
                  </p>
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="custom-button bg-red-500 hover:bg-red-600 mt-2"
                  >
                    Sil
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <WhatsAppChat
          items={favorites.map(f => ({
            title: f.title,
            description: f.description,
            price: f.price,
          }))}
          phone="905527981021"
        />
      </div>

      <Footer />
    </>
  );
}
