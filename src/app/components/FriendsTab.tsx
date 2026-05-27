import { useState, ReactNode } from "react";
import {
  MessageCircle,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  X,
  Clock,
  Users,
} from "lucide-react";
import { useAppContext } from "../../AppContext";
import { useFriends, FriendUser } from "../hooks/useFriends";

type Section = "friends" | "requests" | "search";

export default function FriendsTab() {
  const { currentUser, openChat, openUserProfile } = useAppContext();
  const {
    friends,
    incoming,
    sent,
    loading,
    sendRequest,
    accept,
    reject,
    cancel,
    remove,
  } = useFriends(currentUser?.user_id ?? 0);

  const [section, setSection] = useState<Section>("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FriendUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(
        `/api/users.php?action=search&q=${encodeURIComponent(q)}&exclude_id=${currentUser?.user_id ?? 0}`,
        { credentials: "include" },
      );
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    } finally {
      setSearchLoading(false);
    }
  };

  const isAlreadyFriend = (uid: number) => friends.some((f) => f.user_id === uid);
  const hasSentRequest = (uid: number) => sent.some((f) => f.user_id === uid);
  const hasIncomingRequest = (uid: number) => incoming.some((f) => f.user_id === uid);

  return (
    <div className="flex flex-col h-full">
      {/* ── Section tabs ── */}
      <div className="flex border-b border-gray-100 px-4 pt-3 flex-shrink-0">
        {(
          [
            { id: "friends", label: "Friends", badge: friends.length },
            { id: "requests", label: "Requests", badge: incoming.length, badgeRed: true },
            { id: "search", label: "Find People" },
          ] as { id: Section; label: string; badge?: number; badgeRed?: boolean }[]
        ).map(({ id, label, badge, badgeRed }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all -mb-px ${
              section === id
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
            {badge != null && badge > 0 && (
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  badgeRed ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto p-4">
        {/* ── Friends list ── */}
        {section === "friends" && (
          <>
            {loading ? (
              <Spinner />
            ) : friends.length === 0 ? (
              <Empty
                icon={<Users className="w-8 h-8" />}
                text="No friends yet"
                sub='Go to "Find People" to add some'
              />
            ) : (
              <div className="space-y-1">
                {friends.map((f) => (
                  <FriendRow
                    key={f.user_id}
                    user={f}
                    onProfile={() => openUserProfile(f.user_id, f.username)}
                    actions={
                      <>
                        <IconBtn
                          icon={<MessageCircle className="w-4 h-4" />}
                          label="Message"
                          hoverColor="text-blue-500 hover:bg-blue-50"
                          onClick={() => openChat(f.user_id, f.username)}
                        />
                        <IconBtn
                          icon={<UserX className="w-4 h-4" />}
                          label="Remove friend"
                          hoverColor="text-red-400 hover:bg-red-50"
                          onClick={() => remove(f.user_id)}
                        />
                      </>
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Requests ── */}
        {section === "requests" && (
          <>
            {loading ? (
              <Spinner />
            ) : incoming.length === 0 && sent.length === 0 ? (
              <Empty
                icon={<UserPlus className="w-8 h-8" />}
                text="No pending requests"
                sub='Go to "Find People" to add friends'
              />
            ) : (
              <>
                {incoming.length > 0 && (
                  <section className="mb-6">
                    <SectionLabel>Incoming ({incoming.length})</SectionLabel>
                    <div className="space-y-1">
                      {incoming.map((u) => (
                        <FriendRow
                          key={u.user_id}
                          user={u}
                          sub="Wants to be friends"
                          onProfile={() => openUserProfile(u.user_id, u.username)}
                          actions={
                            <>
                              <button
                                onClick={() => accept(u.user_id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 text-xs font-medium transition-all"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                Accept
                              </button>
                              <button
                                onClick={() => reject(u.user_id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-medium transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                                Decline
                              </button>
                            </>
                          }
                        />
                      ))}
                    </div>
                  </section>
                )}

                {sent.length > 0 && (
                  <section>
                    <SectionLabel>Sent ({sent.length})</SectionLabel>
                    <div className="space-y-1">
                      {sent.map((u) => (
                        <FriendRow
                          key={u.user_id}
                          user={u}
                          onProfile={() => openUserProfile(u.user_id, u.username)}
                          actions={
                            <button
                              onClick={() => cancel(u.user_id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 text-xs transition-all"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          }
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}

        {/* ── Find People ── */}
        {section === "search" && (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username…"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {searchLoading && <Spinner />}

            {!searchLoading && searchQuery && searchResults.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">
                No users found
              </p>
            )}

            {!searchQuery && (
              <p className="text-center text-gray-400 text-sm py-8">
                Type a name to search
              </p>
            )}

            <div className="space-y-1">
              {searchResults.map((u) => {
                const friend = isAlreadyFriend(u.user_id);
                const pendingSent = hasSentRequest(u.user_id);
                const pendingIn = hasIncomingRequest(u.user_id);

                return (
                  <FriendRow
                    key={u.user_id}
                    user={u}
                    onProfile={() => openUserProfile(u.user_id, u.username)}
                    actions={
                      friend ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium px-3 py-1.5 bg-green-50 rounded-full">
                          <UserCheck className="w-3.5 h-3.5" /> Friends
                        </span>
                      ) : pendingSent ? (
                        <button
                          onClick={() => cancel(u.user_id)}
                          className="flex items-center gap-1 text-xs text-gray-500 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
                        >
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </button>
                      ) : pendingIn ? (
                        <button
                          onClick={() => accept(u.user_id)}
                          className="flex items-center gap-1 text-xs text-green-600 px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-full transition-all"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Accept
                        </button>
                      ) : (
                        <button
                          onClick={() => sendRequest(u.user_id)}
                          className="flex items-center gap-1 text-xs text-red-600 font-medium px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-full transition-all"
                        >
                          <UserPlus className="w-3.5 h-3.5" /> Add
                        </button>
                      )
                    }
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Small helper components ── */

function FriendRow({
  user,
  sub,
  onProfile,
  actions,
}: {
  user: FriendUser;
  sub?: string;
  onProfile: () => void;
  actions: ReactNode;
}) {
  const avatar =
    user.profile_picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&size=40&background=random`;

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-all">
      <button onClick={onProfile} className="flex-shrink-0">
        <img
          src={avatar}
          alt={user.username}
          className="w-10 h-10 rounded-full object-cover"
        />
      </button>
      <button className="flex-1 text-left min-w-0" onClick={onProfile}>
        <p className="font-medium text-gray-900 text-sm truncate">
          {user.username}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </button>
      <div className="flex items-center gap-1 flex-shrink-0">{actions}</div>
    </div>
  );
}

function IconBtn({
  icon,
  label,
  onClick,
  hoverColor = "hover:bg-gray-100",
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  hoverColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-2 rounded-full text-gray-400 transition-all ${hoverColor}`}
    >
      {icon}
    </button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 px-1">
      {children}
    </p>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
    </div>
  );
}

function Empty({
  icon,
  text,
  sub,
}: {
  icon: ReactNode;
  text: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
      <div className="text-gray-300">{icon}</div>
      <p className="font-medium text-gray-600">{text}</p>
      {sub && <p className="text-sm">{sub}</p>}
    </div>
  );
}
