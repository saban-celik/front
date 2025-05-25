"use client";

import Footer from "@/components/Footer";
import { fetchNews, fetchVideos, NewsItem, VideoItem } from "@/utils/api";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const images = [
    "https://www.celebiogullari.com.tr/UserFiles/Fotograflar/1868-slider-1.png",
    "https://www.celebiogullari.com.tr/UserFiles/Fotograflar/1869-slider-2.jpg",
    "https://www.celebiogullari.com.tr/UserFiles/Fotograflar/1674-basliksiz-1.png",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slider interval
  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(iv);
  }, [images.length]);

  // Haberleri fetchNews ile yükle
  useEffect(() => {
    (async () => {
      try {
        const fetchedNews = await fetchNews();
        setNewsItems(fetchedNews);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Videoları fetchVideos ile yükle
  useEffect(() => {
    (async () => {
      try {
        const fetchedVideos = await fetchVideos();
        setVideos(fetchedVideos);
      } catch (e: any) {
        setVideoError(e.message);
      } finally {
        setVideoLoading(false);
      }
    })();
  }, []);

  // Medya kaynağı URL'i
  const getMediaSrc = (item: NewsItem | VideoItem) => {
    const src =
      (item as NewsItem).media ||
      (item as NewsItem).image ||
      (item as VideoItem).url ||
      "";
    return src.startsWith("/uploads/") ? `http://localhost:8080${src}` : src;
  };

  const isVideo = (s: string) => /\.(mp4|webm)$/i.test(s);

  return (
    <>
      <div
        className="responsive-wrapper mt-2 text-center position-relative"
        style={{ maxWidth: "100%", padding: 0, margin: 0, paddingTop: "30px" }}
      >
        {/* Başlık */}
        <h1 className="title">Çelikoğlu Baklava'ya Hoş Geldiniz</h1>
        <p className="hoverMoveUp" title="Yukarıdaki menüden seçim yapınız">
          Bir şey seçin
          <span aria-hidden="true" className="bounceArrow">
            ↑
          </span>
        </p>

        {/* Slider */}
        <div className="sliderContainer" aria-label="Ana slider">
          <img
            src={images[currentIndex]}
            alt={`Slider ${currentIndex + 1}`}
            className="sliderImage"
          />
          <button
            className="prev"
            onClick={() =>
              setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))
            }
            aria-label="Önceki"
          >
            ‹
          </button>
          <button
            className="next"
            onClick={() =>
              setCurrentIndex((i) =>
                i === images.length - 1 ? 0 : i + 1
              )
            }
            aria-label="Sonraki"
          >
            ›
          </button>
        </div>

        {/* Videolarımız */}
        <div className="video-section" style={{ marginTop: "3rem" }}>
          <div className="container" style={{ maxWidth: 1400, padding: 0 }}>
            <h2 className="dashboard__title">Videolarımız</h2>
            {videoLoading && <p>Videolar yükleniyor...</p>}
            {videoError && (
              <p style={{ color: "var(--badge-red)" }}>Hata: {videoError}</p>
            )}
            {!videoLoading && !videoError && videos.length === 0 && (
              <p>Henüz yayınlanmış video bulunmamaktadır.</p>
            )}
            {!videoLoading && !videoError && videos.length > 0 && (
              <div className="video-showcase">
                {videos.map((v) => {
                  const src = getMediaSrc(v);
                  return (
                    <div
                      key={v.id}
                      className="video-showcase__card"
                      onClick={() => setActiveVideo(src)}
                    >
                      <video
                        src={src}
                        className="video-showcase__video"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Son Haberler */}
        <h2 className="dashboard__title" style={{ marginTop: "3rem" }}>
          Son Haberler
        </h2>
        {loading && <p>Haberler yükleniyor...</p>}
        {error && <p style={{ color: "var(--badge-red)" }}>Hata: {error}</p>}
        {!loading && !error && newsItems.length === 0 && (
          <p>Henüz yayınlanmış haber bulunmamaktadır.</p>
        )}
        <div className="news-grid">
          {newsItems.map((item) => {
            const src = getMediaSrc(item);
            return (
              <article
                key={item.id}
                className="news-card"
                tabIndex={0}
                aria-label={`Haber: ${item.title}`}
              >
                <div className="news-media">
                  {src ? (
                    isVideo(src) ? (
                      <video src={src} controls preload="metadata" />
                    ) : (
                      <img src={src} alt={item.title} loading="lazy" />
                    )
                  ) : (
                    <div style={{ color: "var(--secondary)" }}>
                      Medya Yok
                    </div>
                  )}
                </div>
                <div className="news-content">
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-desc">
                    {item.content.length > 200
                      ? item.content.slice(0, 200) + "..."
                      : item.content}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Lightbox Modal */}
      {activeVideo && (
        <div className="video-modal">
          <div
            className="video-modal__backdrop"
            onClick={() => setActiveVideo(null)}
          />
          <div className="video-modal__content">
            <video
              src={activeVideo}
              className="video-modal__video"
              controls
              autoPlay
            />
            <button
              className="video-modal__close"
              onClick={() => setActiveVideo(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
