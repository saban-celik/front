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

export default function VideoPage() {
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [formFile, setFormFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos()
      .then(setVideoItems)
      .catch((err) => setError(err.message));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Lütfen yalnızca video dosyası yükleyin.");
      return;
    }
    setFormFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!formFile && editingId === null) {
      alert("Lütfen bir video seçin.");
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
        setEditingId(null);
      } else {
        const added = await createVideo(fd);
        setVideoItems((v) => [...v, added]);
      }
      setFormFile(null);
      setPreview(null);
    } catch (e: any) {
      setError(e.message);
      alert(e.message);
    }
  };

  const edit = (item: VideoItem) => {
    setEditingId(item.id!);
    setPreview(
      typeof item.url === "string" && item.url.startsWith("/uploads/")
        ? `http://localhost:5000${item.url}`
        : item.url
    );
    setFormFile(null);
  };

  const remove = async (id: number) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await deleteVideo(id);
      setVideoItems((v) => v.filter((x) => x.id !== id));
    } catch (e: any) {
      setError(e.message);
      alert(e.message);
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
                />
              </div>
            )}
            <input
              type="file"
              id="media"
              accept="video/*"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          <button onClick={submit} className="btn-success">
            {editingId ? "Güncelle" : "Ekle"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setFormFile(null);
                setPreview(null);
              }}
              className="btn-secondary ms-2"
            >
              İptal
            </button>
          )}
        </div>

        <div className="row mt-5">
          {videoItems.map((item) => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="video-card">
                <video
                  src={
                    item.url.startsWith("/uploads/")
                      ? `http://localhost:5000${item.url}`
                      : item.url
                  }
                  controls
                  className="video-card__video"
                />
                <div className="product-card__actions">
                  <button
                    onClick={() => edit(item)}
                    className="btn-primary"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => remove(item.id!)}
                    className="btn-danger"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}