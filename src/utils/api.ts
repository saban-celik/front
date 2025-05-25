//C:\javacelikoglu\frontend\src\utils\api.ts
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
const API_BASE = 'http://localhost:8080/api'; 

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Giriş başarısız");
  }
  return res.json();
};

export const register = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name.trim(), email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Kayıt başarısız");
  }
  return res.json();
};

export const fetchVideos = async (): Promise<VideoItem[]> => {
  const res = await fetch(`${API_BASE}/videos`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'   // gerekliyse
  });
  console.log('fetchVideos status:', res.status, res.statusText);

  if (!res.ok) {
    throw new Error(`Videolar alınamadı: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('Videolar beklenmedik formatta geldi');
  }

  // Gelen her nesneyi VideoItem tipine sıkı sıkıya eşle
  return data.map((v: any) => ({
    id: typeof v.id === 'number' ? v.id : undefined,
    url: String(v.url || ''),
    createdAt: String(v.createdAt || '')
  }));
};

export const createVideo = async (fd: FormData): Promise<VideoItem> => {
  const res = await fetch(`${API_BASE}/videos`, {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) throw new Error('Video eklenemedi');
  return res.json();
};

export const updateVideo = async (id: number, fd: FormData): Promise<VideoItem> => {
  const res = await fetch(`${API_BASE}/videos/${id}`, {
    method: 'PUT',
    body: fd,
  });
  if (!res.ok) throw new Error('Video güncellenemedi');
  return res.json();
};

export const deleteVideo = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/videos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Video silinemedi');
};

export const fetchNews = async (): Promise<NewsItem[]> => {
  const res = await fetch(`${API_BASE}/news`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include' // gerekliyse kaldırabilirsiniz
  });

  console.log('fetchNews status:', res.status, res.statusText);

  if (!res.ok) {
    throw new Error(`Haberler alınamadı: ${res.status} ${res.statusText}`);
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
    updatedAt: String(n.updatedAt || '')
  }));
};

export const createNews = async (formData: FormData) => {
  const res = await fetch(`${API_BASE}/news`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Haber eklenemedi');
  return res.json();
};

export const updateNews = async (id: number, formData: FormData) => {
  const res = await fetch(`${API_BASE}/news/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) throw new Error('Haber güncellenemedi');
  return res.json();
};

export const deleteNews = async (id: number) => {
  const res = await fetch(`${API_BASE}/news/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Haber silinemedi');
  return res.json();
};

export const fetchBaklavaProducts = async () => {
  try {
    const res = await fetch(`${API_BASE}/products/baklava-products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:1234'), // Kimlik doğrulama
      },
      credentials: 'include',
    });
    console.log("fetchBaklavaProducts Status:", res.status, res.statusText);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.warn("📛 fetchBaklavaProducts başarısız:", res.status, errorData);
      return [];
    }
    const data = await res.json();
    console.log("fetchBaklavaProducts Data:", data);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ Baklava ürünleri çekilirken hata:", err);
    return [];
  }
};



export const createBaklavaProduct = async (formData: FormData) => {
  const res = await fetch(`${API_BASE}/products/baklava-products`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Baklava ürünü eklenemedi: ${errorData.error || res.statusText}`);
  }
  return res.json();
};

export const updateBaklavaProduct = async (id: number, formData: FormData) => {
  const res = await fetch(`${API_BASE}/products/baklava-products/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) throw new Error('Baklava ürünü güncellenemedi');
  return res.json();
};

export const deleteBaklavaProduct = async (id: number) => {
  const res = await fetch(`${API_BASE}/products/baklava-products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Baklava ürünü silinemedi');
  return res.json();
};

export const fetchRegionalProducts = async () => {
  try {
    const res = await fetch(`${API_BASE}/products/regional-products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:1234'), // Kimlik doğrulama
      },
      credentials: 'include',
    });
    console.log("fetchRegionalProducts Status:", res.status, res.statusText);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.warn("📛 fetchRegionalProducts başarısız:", res.status, errorData);
      return [];
    }
    const data = await res.json();
    console.log("fetchRegionalProducts Data:", data);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ Yöresel ürünler çekilirken hata:", err);
    return [];
  }
};

export const createRegionalProduct = async (formData: FormData) => {
  const res = await fetch(`${API_BASE}/products/regional-products`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Yöresel ürün eklenemedi');
  return res.json();
};

export const updateRegionalProduct = async (id: number, formData: FormData) => {
  const res = await fetch(`${API_BASE}/products/regional-products/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) throw new Error('Yöresel ürün güncellenemedi');
  return res.json();
};

export const deleteRegionalProduct = async (id: number) => {
  const res = await fetch(`${API_BASE}/products/regional-products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Yöresel ürün silinemedi');
  return res.json();
};

// api.ts
export const fetchUserById = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE}/auth/user/${id}`, {
      headers: {
        "Authorization": "Basic " + btoa("admin:1234"),
      },
    });
    if (!res.ok) {
      console.warn(`📛 fetchUserById başarısız: ${res.status} - ${res.statusText}`);
      const errorData = await res.json().catch(() => ({}));
      console.error("Hata Detayı:", errorData);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error("❌ Kullanıcı çekilirken hata:", err);
    return null;
  }
};
export const fetchSimpleBaklavaProducts = async () => {
  try {
    const res = await fetch(`${API_BASE}/products/simple-baklava-products`);
    if (!res.ok) {
      console.warn("📛 fetchSimpleBaklavaProducts başarısız:", res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ Basit baklava ürünleri çekilirken hata:", err);
    return [];
  }
};