//C:\javacelikoglu\frontend\src\app\admin\products\yoresel-urunler\page.tsx
"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  createRegionalProduct,
  deleteRegionalProduct,
  fetchRegionalProducts,
  updateRegionalProduct,
} from "@/utils/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  id?: number;
  name: string;
  weight: string;
  price: number;
  image: string | File;
}

export default function YoreselUrunlerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({
    name: "",
    weight: "",
    price: 0,
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchRegionalProducts();
        console.log("Admin fetched regional products:", data);
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error("Beklenmedik veri formatı");
        }
      } catch (err: any) {
        console.error("Yöresel ürünler getirilemedi:", err);
        setError(err.message || "Ürünler alınırken hata oluştu");
        toast.error(err.message || "Ürünler yüklenemedi.");
      }
    };
    loadProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Lütfen yalnızca resim dosyası yükleyin.");
        return;
      }
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === "price" ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleAddProduct = async () => {
    if (!form.name || !form.weight || form.price <= 0) {
      toast.error("Lütfen tüm zorunlu alanları doldurun!");
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("weight", form.weight);
    formData.append("price", form.price.toString());
    if (typeof form.image !== "string" && form.image) {
      formData.append("image", form.image);
    }

    try {
      if (editingId !== null) {
        const updated = await updateRegionalProduct(editingId, formData);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? updated : p))
        );
        toast.success("Ürün güncellendi!");
        setEditingId(null);
      } else {
        if (!form.image) {
          toast.error("Yeni ürün için resim zorunludur!");
          return;
        }
        const added = await createRegionalProduct(formData);
        setProducts((prev) => [...prev, added]);
        toast.success("Ürün eklendi!");
      }

      setForm({ name: "", weight: "", price: 0, image: "" });
      setImagePreview(null);
    } catch (err: any) {
      console.error("Ürün işlemi hatası:", err);
      const errorMessage = err.message || "Ürün işlemi başarısız.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDeleteProduct = async (id?: number) => {
    if (!id) {
      toast.error("Ürün ID'si bulunamadı.");
      return;
    }
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      try {
        await deleteRegionalProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Ürün silindi!");
      } catch (err: any) {
        console.error("Silme hatası:", err);
        const errorMessage = err.message || "Ürün silinemedi.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    if (!product.id) {
      toast.error("Ürün ID'si bulunamadı.");
      return;
    }
    setForm(product);
    setEditingId(product.id);
    setImagePreview(
      typeof product.image === "string"
        ? product.image.startsWith("http")
          ? product.image
          : `http://localhost:8080${product.image}`
        : URL.createObjectURL(product.image)
    );
  };

  return (
    <AdminLayout>
      <div className="container">
        <h2 className="mb-4 dashboard__title">
          {editingId ? "Yöresel Ürün Düzenle" : "Yeni Yöresel Ürün Ekle"}
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="product-form">
          <div className="form-group mb-3">
            <label htmlFor="name" className="form-label">Ürün Adı</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="weight" className="form-label">Kaç Kilo?</label>
            <input
              type="text"
              name="weight"
              className="form-control"
              value={form.weight}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="price" className="form-label">Fiyat (₺)</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="image" className="form-label">Ürün Resmi</label>
            <div className="image-upload">
              {imagePreview && (
                <div className="image-preview mb-2">
                  <img
                    src={imagePreview}
                    alt="Önizleme"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid var(--primary)",
                    }}
                  />
                </div>
              )}
              <input
                type="file"
                name="image"
                className="form-control"
                accept="image/*"
                onChange={handleChange}
                required={!editingId}
              />
            </div>
          </div>

          <button onClick={handleAddProduct} className="btn btn-success">
            {editingId ? "Güncelle" : "Ekle"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setForm({ name: "", weight: "", price: 0, image: "" });
                setEditingId(null);
                setImagePreview(null);
              }}
              className="btn btn-secondary ms-2"
            >
              İptal
            </button>
          )}
        </div>

        <div className="row mt-5">
          {products.length === 0 ? (
            <p>Henüz yöresel ürün eklenmemiş.</p>
          ) : (
            products.map((product, idx) => (
              <div key={product.id || `regional-${idx}`} className="col-md-3 mb-4 d-flex">
                <div className="product-card">
                  <img
                    src={
                      typeof product.image === "string"
                        ? product.image.startsWith("http")
                          ? product.image
                          : `http://localhost:8080${product.image}`
                        : "https://via.placeholder.com/150?text=No+Image"
                    }
                    alt={product.name}
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image")}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <h5 className="mt-2">{product.name}</h5>
                  <p>{product.weight}</p>
                  <p>
                    <strong>{Number(product.price).toFixed(2)} ₺</strong>
                  </p>
                  <div className="product-card__actions">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="btn btn-primary btn-sm"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
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