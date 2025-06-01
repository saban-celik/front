//C:\javacelikoglu\frontend\src\app\admin\news\page.tsx
"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import { createNews, deleteNews, fetchNews, updateNews } from "@/utils/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NewsItem {
  id?: number;
  title: string;
  content: string;
  media?: string | File; // frontend için medya (yeni dosya veya URL)
  image?: string; // backend'den gelen url (image)
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<NewsItem>({ title: "", content: "", media: "" });
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchNews();
        if (Array.isArray(data)) {
          setNewsItems(data);
        } else {
          throw new Error("Beklenmedik veri formatı");
        }
      } catch (err: any) {
        console.error("📛 Haberler getirilemedi:", err);
        setError(err.message || "Haberler alınırken hata oluştu");
        toast.error("Haberler yüklenemedi.");
      }
    };
    loadNews();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "media" && files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("Lütfen yalnızca resim veya video dosyası yükleyin.");
        return;
      }
      setForm((prev) => ({ ...prev, media: file }));
      setMediaPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddNewsItem = async () => {
    if (!form.title || !form.content || (!form.media && !editingId)) {
      toast.error("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }
    setError(null);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);

    if (form.media instanceof File) {
      formData.append("media", form.media);
    }

    try {
      if (editingId !== null) {
        const updatedNews = await updateNews(editingId, formData);
        setNewsItems((prev) =>
          prev.map((item) => (item.id === editingId ? updatedNews : item))
        );
        toast.success("Haber güncellendi!");
        setEditingId(null);
      } else {
        const newNews = await createNews(formData);
        setNewsItems((prev) => [...prev, newNews]);
        toast.success("Haber eklendi!");
      }
      setForm({ title: "", content: "", media: "", image: "" });
      setMediaPreview(null);
    } catch (err: any) {
      console.error("❌ Haber işlemi hatası:", err);
      const errorMessage = err.message || "Haber işlemi başarısız.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDeleteNewsItem = async (id?: number) => {
    if (!id) {
      toast.error("Haber ID'si bulunamadı.");
      return;
    }
    if (confirm("Bu haberi silmek istediğinize emin misiniz?")) {
      setError(null);
      try {
        await deleteNews(id);
        setNewsItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Haber silindi!");
      } catch (err: any) {
        console.error("❌ Silme hatası:", err);
        const errorMessage = err.message || "Haber silinemedi.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handleEditNewsItem = (item: NewsItem) => {
    if (!item.id) {
      toast.error("Haber ID'si bulunamadı.");
      return;
    }
    setForm({
      ...item,
      media: item.media ?? item.image ?? "",
    });
    setEditingId(item.id);

    if (item.media) {
      if (typeof item.media === "string") {
        setMediaPreview(
          item.media.startsWith("/uploads/")
            ? `http://localhost:8080${item.media}`
            : item.media
        );
      } else {
        setMediaPreview(URL.createObjectURL(item.media));
      }
    } else if (item.image) {
      setMediaPreview(
        item.image.startsWith("/uploads/")
          ? `http://localhost:8080${item.image}`
          : item.image
      );
    } else {
      setMediaPreview(null);
    }
  };

  return (
    <AdminLayout>
      <div className="container">
        <h2 className="mb-4 dashboard__title">
          {editingId ? "Haber Düzenle" : "Yeni Haber Ekle"}
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="product-form">
          <div className="form-group mb-3">
            <label htmlFor="title" className="form-label">Başlık</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="Haber Başlığı"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="content" className="form-label">İçerik</label>
            <textarea
              id="content"
              name="content"
              className="form-control"
              placeholder="Haber İçeriği"
              value={form.content}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="media" className="form-label">Resim veya Video</label>
            <div className="image-upload">
              {mediaPreview && (
                <div className="image-preview mb-2">
                  {form.media instanceof File && form.media.type.startsWith("video/") ? (
                    <video
                      src={mediaPreview}
                      controls
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid var(--primary)",
                      }}
                    />
                  ) : (
                    <img
                      src={mediaPreview}
                      alt="Önizleme"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid var(--primary)",
                      }}
                    />
                  )}
                </div>
              )}
              <input
                type="file"
                id="media"
                name="media"
                className="form-control"
                accept="image/*,video/*"
                onChange={handleChange}
                required={!editingId}
              />
            </div>
          </div>

          <button onClick={handleAddNewsItem} className="btn btn-success">
            {editingId ? "Güncelle" : "Ekle"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setForm({ title: "", content: "", media: "", image: "" });
                setEditingId(null);
                setMediaPreview(null);
              }}
              className="btn btn-secondary ms-2"
            >
              İptal
            </button>
          )}
        </div>

        <div className="row mt-5">
          {newsItems.length === 0 ? (
            <p>Henüz haber eklenmemiş.</p>
          ) : (
            newsItems.map((item, idx) => {
              const src =
                item.media
                  ? typeof item.media === "string"
                    ? item.media.startsWith("/uploads/")
                      ? `http://localhost:8080${item.media}`
                      : item.media
                    : URL.createObjectURL(item.media)
                  : item.image
                  ? item.image.startsWith("/uploads/")
                    ? `http://localhost:8080${item.image}`
                    : item.image
                  : "https://via.placeholder.com/150?text=No+Media";

              const isVideo =
                (typeof item.media === "string" && item.media.toLowerCase().endsWith(".mp4")) ||
                (typeof item.media !== "string" && item.media?.type?.startsWith("video/"));

              return (
                <div key={item.id ?? `news-${idx}`} className="col-md-3 mb-4">
                  <div className="product-card">
                    {isVideo ? (
                      <video
                        src={src}
                        controls
                        style={{
                          width: "100%",
                          maxHeight: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Media")}
                      />
                    ) : (
                      <img
                        src={src}
                        alt={item.title}
                        style={{
                          width: "100%",
                          maxHeight: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Media")}
                      />
                    )}
                    <h5 className="mt-2">{item.title}</h5>
                    <p>{item.content.substring(0, 100)}...</p>
                    <div className="product-card__actions">
                      <button
                        onClick={() => handleEditNewsItem(item)}
                        className="btn btn-primary btn-sm"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteNewsItem(item.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}