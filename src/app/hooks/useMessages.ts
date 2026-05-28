import { useState, useEffect, useCallback, useRef } from "react";

export interface Message {
  message_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  username: string;
  profile_picture: string | null;
}

export interface Conversation {
  partner_id: number;
  partner_username: string;
  partner_picture: string | null;
  last_message: string;
  last_at: string;
  sender_id: number;
}

// Chat polling is simple here and keeps both tabs fresh.
const API_BASE = "/api";

export function useConversations(userId: number) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  // Load one latest row per conversation partner.
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/messages.php?action=conversations&user_id=${userId}`,
        { credentials: "include" },
      );
      const data = await response.json();
      const list: Conversation[] = Array.isArray(data) ? data : [];
      setConversations(
        list.map((c) => ({ ...c, partner_id: Number(c.partner_id) })),
      );
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Poll slowly here because the list changes less often than chat.
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
}

export function useChat(userId: number, otherUserId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Poll the active thread so new messages appear without reload.
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/messages.php?action=messages&user_id=${userId}&other_id=${otherUserId}`,
        { credentials: "include" },
      );
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, otherUserId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    // Scroll after each fetch or send so the newest row stays visible.
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Append the created row returned by the API.
  const sendMessage = useCallback(
    async (content: string) => {
      try {
        const response = await fetch(`${API_BASE}/messages.php`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender_id: userId,
            receiver_id: otherUserId,
            content,
          }),
        });
        const newMessage: Message = await response.json();
        setMessages((prev) => [...prev, newMessage]);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [userId, otherUserId],
  );

  return { messages, loading, sendMessage, bottomRef, refetch: fetchMessages };
}
