import { useState, useEffect, useCallback } from "react";

export interface FriendUser {
  user_id: number;
  username: string;
  profile_picture: string | null;
  created_at: string;
}

// Friend state is split into accepted, incoming, and sent lists.
const API_BASE = "/api";

export function useFriends(userId: number) {
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [incoming, setIncoming] = useState<FriendUser[]>([]);
  const [sent, setSent] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Pull all lists together so the screen stays in sync.
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/friends.php?user_id=${userId}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setFriends(Array.isArray(data.friends) ? data.friends : []);
      setIncoming(Array.isArray(data.incoming) ? data.incoming : []);
      setSent(Array.isArray(data.sent) ? data.sent : []);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Re-fetch after each action to avoid stale mixed lists.
  const postAction = useCallback(
    async (action: string, friendId: number) => {
      try {
        await fetch(`${API_BASE}/friends.php`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            user_id: userId,
            friend_id: friendId,
          }),
        });
        await fetchAll();
      } catch (error) {
        console.error(`Failed to ${action} friend request:`, error);
      }
    },
    [userId, fetchAll],
  );

  const sendRequest = useCallback(
    (friendId: number) => postAction("send", friendId),
    [postAction],
  );
  const accept = useCallback(
    (friendId: number) => postAction("accept", friendId),
    [postAction],
  );
  const reject = useCallback(
    (friendId: number) => postAction("reject", friendId),
    [postAction],
  );
  const cancel = useCallback(
    (friendId: number) => postAction("cancel", friendId),
    [postAction],
  );
  const remove = useCallback(
    (friendId: number) => postAction("remove", friendId),
    [postAction],
  );

  return {
    friends,
    incoming,
    sent,
    loading,
    sendRequest,
    accept,
    reject,
    cancel,
    remove,
    refetch: fetchAll,
  };
}

// This helper is used by profile and pin detail views.
export async function getFriendStatus(
  userId: number,
  otherId: number,
): Promise<{
  status: "none" | "pending" | "accepted" | "blocked";
  is_sender: boolean;
}> {
  const response = await fetch(
    `${API_BASE}/friends.php?user_id=${userId}&check_with=${otherId}`,
    {
      credentials: "include",
    },
  );
  return response.json();
}
