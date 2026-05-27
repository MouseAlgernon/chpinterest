import { useState } from "react";
import { Send } from "lucide-react";
import { useAppContext } from "../../AppContext";
import { useChat } from "../hooks/useMessages";

interface ChatTabProps {
  toUserId: number;
}

export default function ChatTab({ toUserId }: ChatTabProps) {
  const { currentUser } = useAppContext();
  const [input, setInput] = useState("");
  const { messages, loading, sendMessage, bottomRef } = useChat(
    currentUser?.user_id ?? 0,
    toUserId,
  );

  // Derive partner display info from messages (first msg from them)
  const partnerMsg = messages.find((m) => m.sender_id === toUserId);
  const partnerName = partnerMsg?.username ?? `User #${toUserId}`;
  const partnerPic =
    partnerMsg?.profile_picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&size=40&background=random`;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !currentUser) return;
    setInput("");
    await sendMessage(text);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDateLabel = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return "Today";
    const yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    if (d.toDateString() === yest.toDateString()) return "Yesterday";
    return d.toLocaleDateString();
  };

  // Group messages by calendar day
  const groups: { date: string; items: typeof messages }[] = [];
  for (const msg of messages) {
    const label = formatDateLabel(msg.created_at);
    const last = groups[groups.length - 1];
    if (last?.date === label) {
      last.items.push(msg);
    } else {
      groups.push({ date: label, items: [msg] });
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Chat header ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <img
          src={partnerPic}
          alt={partnerName}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-sm text-gray-900 leading-tight">
            {partnerName}
          </p>
        </div>
      </div>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {loading && messages.length === 0 && (
          <div className="flex justify-center py-10">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-red-400 rounded-full animate-spin" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-1">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Say hi! 👋</p>
          </div>
        )}

        {groups.map((group) => (
          <div key={group.date}>
            {/* Date divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 bg-white px-2">{group.date}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {group.items.map((msg, i) => {
              const isMe = msg.sender_id === currentUser?.user_id;
              const prevItem = group.items[i - 1];
              const showAvatar =
                !isMe && prevItem?.sender_id !== msg.sender_id;

              return (
                <div
                  key={msg.message_id}
                  className={`flex items-end gap-2 mb-1 ${isMe ? "flex-row-reverse" : ""}`}
                >
                  {/* Partner avatar placeholder (keeps bubble alignment) */}
                  {!isMe && (
                    <div className="w-6 h-6 flex-shrink-0">
                      {showAvatar && (
                        <img
                          src={
                            msg.profile_picture ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.username)}&size=24`
                          }
                          alt={msg.username}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  <div
                    className={`group flex flex-col max-w-[68%] ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? "bg-red-500 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-xs text-gray-400 mt-0.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0">
        <input
          type="text"
          placeholder="Message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 text-sm transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white transition-all flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
