import { useState, useCallback } from "react";

interface PinActionState {
  liked: boolean;
  saved: boolean;
  likesCount: number;
}

// Pin actions are kept separate from the pin list payload.
const API_BASE = "/api";

export function usePinActions(pinId: number, userId: number | undefined) {
  const [state, setState] = useState<PinActionState>({
    liked: false,
    saved: false,
    likesCount: 0,
  });

  // Guard early when the user is not logged in.
  const toggleLike = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `${API_BASE}/pin-actions.php?action=toggle-like&pin_id=${pinId}&user_id=${userId}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setState((prev) => ({
        ...prev,
        liked: data.liked,
        likesCount: data.liked
          ? prev.likesCount + 1
          : Math.max(0, prev.likesCount - 1),
      }));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  }, [pinId, userId]);

  // Save state is independent from likes, so it has its own request.
  const toggleSave = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `${API_BASE}/pin-actions.php?action=toggle-save&pin_id=${pinId}&user_id=${userId}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setState((prev) => ({
        ...prev,
        saved: data.saved,
      }));
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  }, [pinId, userId]);

  // Load both counters in parallel for one pin.
  const fetchState = useCallback(async () => {
    if (!userId) return;
    try {
      const [likesRes, saveRes] = await Promise.all([
        fetch(
          `${API_BASE}/pin-actions.php?action=get-likes&pin_id=${pinId}&user_id=${userId}`,
          {
            credentials: "include",
          },
        ),
        fetch(
          `${API_BASE}/pin-actions.php?action=get-save-status&pin_id=${pinId}&user_id=${userId}`,
          {
            credentials: "include",
          },
        ),
      ]);

      const likesData = await likesRes.json();
      const saveData = await saveRes.json();

      setState({
        liked: likesData.liked,
        saved: saveData.saved,
        likesCount: likesData.count,
      });
    } catch (error) {
      console.error("Failed to fetch pin state:", error);
    }
  }, [pinId, userId]);

  return { state, toggleLike, toggleSave, fetchState };
}
