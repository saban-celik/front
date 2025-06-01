import { fetchUserById } from '@/utils/api';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin?: boolean;
}

let globalSetUser: ((u: User | null) => void) | null = null;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    globalSetUser = setUser;

    const stored = localStorage.getItem("user");

    if (stored && stored !== "undefined") {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.id) {
          fetchUserById(parsed.id)
            .then(data => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (e) {
        console.error("Geçersiz localStorage verisi:", e);
        setUser(null);
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
    }

    return () => {
      globalSetUser = null;
    };
  }, []);

  return { user, loading };
};

export const loginUser = (user: User) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
    if (globalSetUser) globalSetUser(user);
  } catch (err) {
    console.error("localStorage yazılamadı:", err);
  }
};

export const logoutUser = () => {
  localStorage.removeItem("user");
  if (globalSetUser) globalSetUser(null);
};
