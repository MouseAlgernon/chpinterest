import { useState, useEffect, useCallback } from "react";

export interface UserSettings {
  friend_requests_from: "everyone" | "nobody";
  messages_from: "everyone" | "friends" | "nobody";
  follow_mode: "open" | "approval";
  profile_visibility: "public" | "friends";
}

const DEFAULTS: UserSettings = {
  friend_requests_from: "everyone",
  messages_from: "everyone",
  follow_mode: "open",
  profile_visibility: "public",
};

const API_BASE = "/api";

// Use this hook only for the current user settings screen.
export function useSettings(userId: number) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`${API_BASE}/settings.php?user_id=${userId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setSettings({ ...DEFAULTS, ...data }))
      .catch((err) => console.error("Failed to fetch settings:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  const updateSetting = useCallback(
    async (name: keyof UserSettings, value: string) => {
      // Keep the old state so a failed save can roll back.
      const prev = settings;
      // Update first so the UI feels instant.
      setSettings((s) => ({ ...s, [name]: value }));
      setSaving(true);
      try {
        const res = await fetch(`${API_BASE}/settings.php`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            setting_name: name,
            setting_value: value,
          }),
        });
        if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      } catch (err) {
        console.error("Failed to save setting:", err);
        setSettings(prev);
      } finally {
        setSaving(false);
      }
    },
    [userId, settings],
  );

  return { settings, loading, saving, updateSetting };
}

// Read another user settings without storing local hook state.
export async function fetchUserSettings(userId: number): Promise<UserSettings> {
  const res = await fetch(`${API_BASE}/settings.php?user_id=${userId}`, {
    credentials: "include",
  });
  const data = await res.json();
  return { ...DEFAULTS, ...data };
}
