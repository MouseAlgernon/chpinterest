import { useState, useEffect, useCallback } from "react";
import { Pin } from "../../AppContext";

// Fetch the public pin feed for the gallery.
export function usePins() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPins = useCallback(() => {
    setLoading(true);
    fetch("/api/pins.php")
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка сервера");
        return res.json();
      })
      .then((data) => setPins(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Load once and reuse the same fetch callback for manual refresh.
  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  return { pins, loading, error, refetch: fetchPins };
}
