//C:\javacelikoglu\frontend\src\app\admin\video\page.tsx
"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  createVideo,
  deleteVideo,
  fetchVideos,
  updateVideo,
  VideoItem,
} from "@/utils/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VideoPage() {
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [formFile, setFormFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await fetchVideos();
        if (Array.isArray(data)) {
          setVideoItems(data);
        } else {
          throw new Error("Beklenmedik veri formatı");
        }
      } catch (err: any) {
        console.error("📛 Videolar getirilemedi:", err);
        setError(err.message || "Videolar alınırken hata oluştu");
        toast.error("Videolar yüklenemedi.");
      }
    };
    loadVideos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Lütfen yalnızca video dosyası yükleyin.");
      return;
    }
    setFormFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!formFile && editingId === null) {
      toast.error("Lütfen bir video seçin.");
      return;
    }
    setError(null);
    const fd = new FormData();
    if (formFile) {
      fd.append("media", formFile);
    }

    try {
      if (editingId !== null) {
        const updated = await updateVideo(editingId, fd);
        setVideoItems((v) =>
          v.map((x) => (x.id === editingId ? updated : x))
        );
        toast.success("Video güncellendi!");
        setEditingId(null);
      } else {
        const added = await createVideo(fd);
        setVideoItems((v) => [...v, added]);
        toast.success("Video eklendi!");
      }
      setFormFile(null);
      setPreview(null);
    } catch (e: any) {
      console.error("❌ Video işlemi hatası:", e);
      const errorMessage = e.message || "Video işlemi başarısız.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const edit = (item: VideoItem) => {
    if (!item.id) {
      toast.error("Video ID'si bulunamadı.");
      return;
    }
    setEditingId(item.id);
    setPreview(
      typeof item.url === "string" && item.url.startsWith("/uploads/")
        ? `http://localhost:8080${item.url}`
        : item.url || "https://via.placeholder.com/150?text=No+Video"
    );
    setFormFile(null);
  };

  const remove = async (id: number) => {
    if (!confirm("Bu videoyu silmek istediğinize emin misiniz?")) return;
    try {
      await deleteVideo(id);
      setVideoItems((v) => v.filter((x) => x.id !== id));
      toast.success("Video silindi!");
    } catch (e: any) {
      console.error("❌ Silme hatası:", e);
      const errorMessage = e.message || "Video silinemedi.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <AdminLayout>
      <div className="container">
        <h2 className="dashboard__title">
          {editingId ? "Videoyu Güncelle" : "Yeni Video Ekle"}
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="product-form">
          <div className="form-group mb-3">
            <label htmlFor="media" className="form-label">
              Video Yükle
            </label>
            {preview && (
              <div className="image-preview mb-2">
                <video
                  src={preview}
                  controls
                  className="video-card__video"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    border: "1px solid var(--primary)",
                  }}
                />
              </div>
            )}
            <input
              type="file"
              id="media"
              accept="video/*"
              className="form-control"
              onChange={handleFileChange}
              required={editingId === null}
            />
          </div>

          <button onClick={submit} className="btn btn-success">
            {editingId ? "Güncelle" : "Ekle"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setFormFile(null);
                setPreview(null);
              }}
              className="btn btn-secondary ms-2"
            >
              İptal
            </button>
          )}
        </div>

        <div className="row mt-5">
          {videoItems.length === 0 ? (
            <p>Henüz video eklenmemiş.</p>
          ) : (
            videoItems.map((item) => (
              <div key={item.id} className="col-md-4 mb-4">
                <div className="video-card">
                  <video
                    src={
                      typeof item.url === "string" && item.url.startsWith("/uploads/")
                        ? `http://localhost:8080${item.url}`
                        : item.url || "https://via.placeholder.com/150?text=No+Video"
                    }
                    controls
                    className="video-card__video"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Video")}
                  />
                  <div className="product-card__actions">
                    <button
                      onClick={() => edit(item)}
                      className="btn btn-primary btn-sm"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => remove(item.id!)}
                      className="btn btn-danger btn-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}