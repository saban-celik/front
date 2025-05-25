//C:\javacelikoglu\frontend\src\app\admin\news\page.tsx
"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import { createNews, deleteNews, fetchNews, updateNews } from "@/utils/api";
import { useEffect, useState } from "react";

interface NewsItem {
  id?: number;
  title: string;
  content: string;
  media?: string | File;  // frontend için medya (yeni dosya veya URL)
  image?: string;         // backend'den gelen url (image)
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<NewsItem>({ title: "", content: "", media: "" });
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews()
      .then((data) => setNewsItems(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "media" && files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, media: file }));
      setMediaPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddNewsItem = async () => {
    if (!form.title || !form.content || (!form.media && !form.image)) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    setError(null);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);

    // Sadece yeni yüklenen dosya varsa ekle
    if (form.media instanceof File) {
      formData.append("media", form.media);
    }

    try {
      if (editingId !== null) {
        const updatedNews = await updateNews(editingId, formData);
        setNewsItems((prev) =>
          prev.map((item) => (item.id === editingId ? updatedNews : item))
        );
        setEditingId(null);
      } else {
        const newNews = await createNews(formData);
        setNewsItems((prev) => [...prev, newNews]);
      }
      setForm({ title: "", content: "", media: "", image: "" });
      setMediaPreview(null);
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    }
  };

  const handleDeleteNewsItem = async (id: number) => {
    if (confirm("Bu haberi silmek istediğinize emin misiniz?")) {
      setError(null);
      try {
        await deleteNews(id);
        setNewsItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err: any) {
        setError(err.message);
        alert(err.message);
      }
    }
  };

  const handleEditNewsItem = (item: NewsItem) => {
    setForm({
      ...item,
      media: item.media ?? item.image ?? "",
    });
    setEditingId(item.id ?? null);

    if (item.media) {
      if (typeof item.media !== "string") {
        setMediaPreview(URL.createObjectURL(item.media));
      } else {
        // backend'den gelen image yolu varsa, tam url yap
        if (item.media.startsWith("/uploads/")) {
          setMediaPreview(`http://localhost:5000${item.media}`);
        } else {
          setMediaPreview(item.media);
        }
      }
    } else if (item.image) {
      if (item.image.startsWith("/uploads/")) {
        setMediaPreview(`http://localhost:5000${item.image}`);
      } else {
        setMediaPreview(item.image);
      }
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
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="media" className="form-label">Resim veya Video</label>
            <div className="image-upload">
              {mediaPreview && (
                <div className="image-preview mb-2">
                  {form.media && typeof form.media !== "string" && form.media.type?.startsWith("video/") ? (
                    <video
                      src={mediaPreview}
                      controls
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: `1px solid var(--primary)`,
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
                        border: `1px solid var(--primary)`,
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
          {newsItems.map((item, idx) => {
            const src = item.media
              ? typeof item.media === "string"
                ? item.media.startsWith("/uploads/")
                  ? `http://localhost:5000${item.media}`
                  : item.media
                : URL.createObjectURL(item.media)
              : item.image
              ? item.image.startsWith("/uploads/")
                ? `http://localhost:5000${item.image}`
                : item.image
              : "";

            const isVideo =
              (typeof item.media !== "string" && item.media?.type?.startsWith("video/")) ||
              src.toLowerCase().endsWith(".mp4");

            return (
              <div key={item.id ?? idx} className="col-md-3 mb-4">
                <div className="product-card">
                  {isVideo ? (
                    <video
                      src={src}
                      controls
                      style={{
                        width: "100%",
                        maxHeight: "150px",
                        objectFit: "cover",
                        borderRadius: "var(--border-radius)",
                        marginBottom: "0.5rem",
                      }}
                    />
                  ) : (
                    <img
                      src={src}
                      alt={item.title}
                      style={{
                        width: "100%",
                        maxHeight: "150px",
                        objectFit: "cover",
                        borderRadius: "var(--border-radius)",
                        marginBottom: "0.5rem",
                      }}
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
                      onClick={() => handleDeleteNewsItem(item.id!)}
                      className="btn btn-danger btn-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
