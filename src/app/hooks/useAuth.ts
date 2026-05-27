import { useState, useEffect } from "react";

export interface AuthUser {
  user_id: number;
  username: string;
  profile_picture?: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on load
  useEffect(() => {
    fetch("/api/auth/me.php", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success)
          setUser({
            user_id: data.user_id,
            username: data.username,
            profile_picture: data.profile_picture,
          });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch("/api/auth/login.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser({
        user_id: data.user_id,
        username: data.username,
        profile_picture: data.profile_picture,
      });
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    bio?: string,
    avatar?: File | null,
  ) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (bio) formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar);

    const res = await fetch("/api/auth/register.php", {
      method: "POST",
      credentials: "include",
      body: formData, // no Content-Type header — browser sets multipart boundary
    });
    const data = await res.json();
    if (data.success) {
      setUser({
        user_id: data.user_id,
        username: data.username,
        profile_picture: data.profile_picture,
      });
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = async () => {
    await fetch("/api/auth/logout.php", { credentials: "include" });
    setUser(null);
  };

  return { user, loading, login, register, logout };
}
