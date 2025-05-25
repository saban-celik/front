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

interface Product {
  id?: number;
  name: string;
  weight: string;
  price: number;
  image: string | File;
  variants?: { id: number; name: string; material: string; price: number }[];
}

export default function YoreselUrunlerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({ name: "", weight: "", price: 0, image: "" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegionalProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        setError("Ürünler yüklenirken bir hata oluştu: " + err.message);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === "price" ? (isNaN(parseFloat(value)) ? 0 : parseFloat(value)) : value,
      }));
    }
  };

  const handleAddProduct = async () => {
    if (!form.name || !form.weight || !form.price || form.price <= 0) {
      setError("Lütfen tüm alanları doldurun ve geçerli bir fiyat girin.");
      return;
    }
    if (!form.image) {
      setError("Lütfen bir ürün resmi seçin.");
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("weight", form.weight);
    formData.append("price", form.price.toString());
    if (typeof form.image !== "string") {
      formData.append("image", form.image);
    }

    try {
      if (editingId !== null) {
        const updatedProduct = await updateRegionalProduct(editingId, formData);
        setProducts((prev) =>
          prev.map((product) => (product.id === editingId ? updatedProduct : product))
        );
        setEditingId(null);
      } else {
        const newProduct = await createRegionalProduct(formData);
        setProducts((prev) => [...prev, newProduct]);
      }
      setForm({ name: "", weight: "", price: 0, image: "" });
      setImagePreview(null);
    } catch (err: any) {
      setError("İşlem başarısız: " + err.message);
    }
  };

  const handleDeleteProduct = async (id?: number) => {
    if (!id) {
      setError("Ürün silinemedi: Ürün ID'si bulunamadı.");
      return;
    }
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      setError(null);
      try {
        await deleteRegionalProduct(id);
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } catch (err: any) {
        setError("Ürün silinirken hata oluştu: " + err.message);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    if (!product.id) {
      setError("Ürün düzenlenemedi: Ürün ID'si bulunamadı.");
      return;
    }
    setForm({
      name: product.name,
      weight: product.weight,
      price: product.price,
      image: product.image as string,
    });
    setEditingId(product.id);
    setImagePreview(
      typeof product.image === "string" ? `http://localhost:5000${product.image}` : null
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
          {/* Form Alanları */}
          <div className="form-group mb-3">
            <label htmlFor="name" className="form-label">Ürün Adı</label>
            <input type="text" id="name" name="name" className="form-control" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="weight" className="form-label">Kaç Kilo?</label>
            <input type="text" id="weight" name="weight" className="form-control" value={form.weight} onChange={handleChange} />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="price" className="form-label">Fiyat (₺)</label>
            <input type="number" id="price" name="price" className="form-control" value={form.price} onChange={handleChange} />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="image" className="form-label">Ürün Resmi</label>
            <div className="image-upload">
              {imagePreview && (
                <div className="image-preview mb-2">
                  <img
                    src={imagePreview}
                    alt="Önizleme"
                    style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px", border: `1px solid var(--primary)` }}
                  />
                </div>
              )}
              <input type="file" id="image" name="image" className="form-control" accept="image/*" onChange={handleChange} />
            </div>
          </div>

          <button onClick={handleAddProduct} className="btn btn-success">
            {editingId ? "Güncelle" : "Ekle"}
          </button>
          {editingId && (
            <button onClick={() => {
              setForm({ name: "", weight: "", price: 0, image: "" });
              setEditingId(null);
              setImagePreview(null);
            }} className="btn btn-secondary ms-2">İptal</button>
          )}
        </div>

        <div className="row mt-5">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="col-md-3 mb-4">
                <div className="product-card">
                  <img
                    src={
                      typeof product.image === "string"
                        ? `http://localhost:5000${product.image}`
                        : "https://via.placeholder.com/150?text=No+Image"
                    }
                    alt={product.name}
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image")}
                  />
                  <h5 className="mt-2">{product.name}</h5>
                  <p>{product.weight}</p>
                 <strong>{Number(product.price).toFixed(2)} ₺</strong>
                  <div className="product-card__actions">
                    <button onClick={() => handleEditProduct(product)} className="btn btn-primary btn-sm">Düzenle</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="btn btn-danger btn-sm">Sil</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Henüz yöresel ürün eklenmemiş.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
