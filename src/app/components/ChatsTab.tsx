import { useAppContext } from "../../AppContext";
import { useConversations } from "../hooks/useMessages";

export default function ChatsTab() {
  const { currentUser, openChat } = useAppContext();
  const { conversations, loading } = useConversations(currentUser?.user_id ?? 0);

  const formatTime = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    const yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    if (d.toDateString() === yest.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { day: "numeric", month: "short" });
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-red-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!loading && conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
          />
        </svg>
        <p className="text-sm font-medium text-gray-500">No messages yet</p>
        <p className="text-xs">Go to Friends and start a chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
        <h2 className="font-semibold text-gray-900">Messages</h2>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-auto">
        {conversations.map((conv) => {
          const avatar =
            conv.partner_picture ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.partner_username)}&size=48&background=random`;

          const isMyMessage =
            conv.sender_id === currentUser?.user_id;

          return (
            <button
              key={conv.partner_id}
              onClick={() =>
                openChat(conv.partner_id, conv.partner_username)
              }
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all text-left"
            >
              <img
                src={avatar}
                alt={conv.partner_username}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {conv.partner_username}
                  </p>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {formatTime(conv.last_at)}
                  </p>
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {isMyMessage && (
                    <span className="text-gray-400">You: </span>
                  )}
                  {conv.last_message}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
