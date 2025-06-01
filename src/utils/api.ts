//C:\javacelikoglu\frontend\src\utils\api.ts
const API_BASE = 'http://localhost:8080/api';

export interface VideoItem {
  id?: number;
  url: string;
  createdAt: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image?: string;
  media?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id?: number;
  name: string;
  weight: string;
  price: number;
  image: string;
}

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Giriş başarısız');
  }
  return res.json();
};

export const register = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim(), email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Kayıt başarısız');
  }
  return res.json();
};

export const fetchVideos = async (): Promise<VideoItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/videos`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
    });
    console.log('fetchVideos status:', res.status, res.statusText);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Videolar alınamadı: ${res.statusText}`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('Videolar beklenmedik formatta geldi');
    }

    return data.map((v: any) => ({
      id: v.id || undefined,
      url: String(v.url || ''),
      createdAt: String(v.createdAt || ''),
    }));
  } catch (err: any) {
    console.error('Videolar çekilirken hata:', err);
    throw err;
  }
};

export const createVideo = async (formData: FormData): Promise<VideoItem> => {
  try {
    const res = await fetch(`${API_BASE}/videos`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Video eklenemedi');
    }
    const data = await res.json();
    return {
      id: data.id,
      url: data.url,
      createdAt: data.createdAt,
    };
  } catch (err: any) {
    console.error('Video ekleme hatası:', err);
    throw err;
  }
};

export const updateVideo = async (id: number, formData: FormData): Promise<VideoItem> => {
  try {
    const res = await fetch(`${API_BASE}/videos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Video güncellenemedi');
    }
    const data = await res.json();
    return {
      id: data.id,
      url: data.url,
      createdAt: data.createdAt,
    };
  } catch (err: any) {
    console.error('Video güncelleme hatası:', err);
    throw err;
  }
};

export const deleteVideo = async (id: number): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE}/videos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Video silinemedi');
    }
  } catch (err: any) {
    console.error('Video silme hatası:', err);
    throw err;
  }
};

export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/news`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
    });
    console.log('fetchNews status:', res.status, res.statusText);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Haberler alınamadı: ${res.statusText}`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('Haberler beklenmedik formatta geldi');
    }

    return data.map((n: any) => ({
      id: typeof n.id === 'number' ? n.id : 0,
      title: String(n.title || ''),
      content: String(n.content || ''),
      image: n.image ? String(n.image) : undefined,
      media: n.media ? String(n.media) : undefined,
      createdAt: String(n.createdAt || ''),
      updatedAt: String(n.updatedAt || ''),
    }));
  } catch (err: any) {
    console.error('Haberler çekilirken hata:', err);
    throw err;
  }
};

export const createNews = async (formData: FormData): Promise<NewsItem> => {
  try {
    const res = await fetch(`${API_BASE}/news`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Haber eklenemedi');
    }
    const data = await res.json();
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      image: data.image,
      media: data.media,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (err: any) {
    console.error('Haber ekleme hatası:', err);
    throw err;
  }
};

export const updateNews = async (id: number, formData: FormData): Promise<NewsItem> => {
  try {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Haber güncellenemedi');
    }
    const data = await res.json();
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      image: data.image,
      media: data.media,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (err: any) {
    console.error('Haber güncelleme hatası:', err);
    throw err;
  }
};

export const deleteNews = async (id: number): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Haber silinemedi');
    }
  } catch (err: any) {
    console.error('Haber silme hatası:', err);
    throw err;
  }
};

export const fetchBaklavaProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_BASE}/products/baklava-products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
    });
    console.log('fetchBaklavaProducts Status:', res.status, res.statusText);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Baklava ürünleri alınamadı: ${res.statusText}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('Beklenmedik veri formatı');
    }
    return data.map((item: any) => ({
      id: item.id,
      name: String(item.name || ''),
      weight: String(item.weight || ''),
      price: Number(item.price || 0),
      image: String(item.image || ''),
    }));
  } catch (err: any) {
    console.error('Baklava ürünleri çekilirken hata:', err);
    throw err;
  }
};

export const createBaklavaProduct = async (formData: FormData): Promise<Product> => {
  try {
    const res = await fetch(`${API_BASE}/products/baklava-products`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Baklava ürünü eklenemedi');
    }
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      weight: data.weight,
      price: data.price,
      image: data.image,
    };
  } catch (err: any) {
    console.error('Baklava ekleme hatası:', err);
    throw err;
  }
};

export const updateBaklavaProduct = async (id: number, formData: FormData): Promise<Product> => {
  try {
    const res = await fetch(`${API_BASE}/products/baklava-products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Baklava ürünü güncellenemedi');
    }
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      weight: data.weight,
      price: data.price,
      image: data.image,
    };
  } catch (err: any) {
    console.error('Baklava güncelleme hatası:', err);
    throw err;
  }
};

export const deleteBaklavaProduct = async (id: number): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE}/products/baklava-products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Baklava ürünü silinemedi');
    }
  } catch (err: any) {
    console.error('Baklava silme hatası:', err);
    throw err;
  }
};

export const fetchRegionalProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_BASE}/products/regional-products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
    });
    console.log('fetchRegionalProducts Status:', res.status, res.statusText);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Yöresel ürünler alınamadı: ${res.statusText}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('Beklenmedik veri formatı');
    }
    return data.map((item: any) => ({
      id: item.id,
      name: String(item.name || ''),
      weight: String(item.weight || ''),
      price: Number(item.price || 0),
      image: String(item.image || ''),
    }));
  } catch (err: any) {
    console.error('Yöresel ürünler çekilirken hata:', err);
    throw err;
  }
};

export const createRegionalProduct = async (formData: FormData): Promise<Product> => {
  try {
    const res = await fetch(`${API_BASE}/products/regional-products`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Yöresel ürün eklenemedi');
    }
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      weight: data.weight,
      price: data.price,
      image: data.image,
    };
  } catch (err: any) {
    console.error('Yöresel ürün ekleme hatası:', err);
    throw err;
  }
};

export const updateRegionalProduct = async (id: number, formData: FormData): Promise<Product> => {
  try {
    const res = await fetch(`${API_BASE}/products/regional-products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Yöresel ürün güncellenemedi');
    }
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      weight: data.weight,
      price: data.price,
      image: data.image,
    };
  } catch (err: any) {
    console.error('Yöresel ürün güncelleme hatası:', err);
    throw err;
  }
};

export const deleteRegionalProduct = async (id: number): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE}/products/regional-products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Yöresel ürün silinemedi');
    }
  } catch (err: any) {
    console.error('Yöresel ürün silme hatası:', err);
    throw err;
  }
};

export const fetchUserById = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE}/auth/user/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.warn(`fetchUserById başarısız: ${res.status} - ${res.statusText}`);
      console.error('Hata Detayı:', errorData);
      throw new Error(errorData.message || 'Kullanıcı alınamadı');
    }
    return res.json();
  } catch (err: any) {
    console.error('Kullanıcı çekilirken hata:', err);
    throw err;
  }
};

export const fetchSimpleBaklavaProducts = async () => {
  try {
    const res = await fetch(`${API_BASE}/products/simple-baklava-products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:1234'),
      },
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.warn(`fetchSimpleBaklavaProducts başarısız: ${res.status}`);
      throw new Error(errorData.message || `Basit baklava ürünleri alınamadı: ${res.statusText}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    console.error('Basit baklava ürünleri çekilirken hata:', err);
    throw err;
  }
};