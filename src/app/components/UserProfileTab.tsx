import { useState, useEffect } from "react";
import {
  MessageCircle,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Grid,
  Heart,
} from "lucide-react";
import Masonry from "react-responsive-masonry";
import { Pin, useAppContext } from "../../AppContext";
import { getFriendStatus } from "../hooks/useFriends";

interface UserProfile {
  user_id: number;
  username: string;
  profile_picture: string | null;
  pins_count: number;
  friends_count: number;
  followers_count: number;
  pins: (Pin & { likes_count: number })[];
}

type FriendStatus = "none" | "pending" | "accepted" | "blocked";

interface UserProfileTabProps {
  userId: number;
  /** If true — own profile, hides friend/chat buttons */
  isOwnProfile?: boolean;
}

export default function UserProfileTab({
  userId,
  isOwnProfile = false,
}: UserProfileTabProps) {
  const { currentUser, openChat, openUserProfile } = useAppContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");
  const [isSender, setIsSender] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const profileRes = await fetch(
        `/api/users.php?action=profile&user_id=${userId}`,
        { credentials: "include" },
      );
      const profileData = await profileRes.json();
      setProfile(profileData);

      if (!isOwnProfile && currentUser && currentUser.user_id !== userId) {
        const statusData = await getFriendStatus(currentUser.user_id, userId);
        setFriendStatus(statusData.status);
        setIsSender(statusData.is_sender);
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleFriendAction = async (action: string) => {
    if (!currentUser || actionLoading) return;
    setActionLoading(true);
    try {
      await fetch("/api/friends.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          user_id: currentUser.user_id,
          friend_id: userId,
        }),
      });
      const statusData = await getFriendStatus(currentUser.user_id, userId);
      setFriendStatus(statusData.status);
      setIsSender(statusData.is_sender);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        User not found
      </div>
    );
  }

  const avatar =
    profile.profile_picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&size=96&background=random`;

  return (
    <div className="h-full overflow-auto">
      {/* ── Header ── */}
      <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <img
          src={avatar}
          alt={profile.username}
          className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow"
        />
        <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>

        {/* Stats */}
        <div className="flex justify-center gap-10 mt-5">
          {[
            { label: "Pins", value: profile.pins_count },
            { label: "Friends", value: profile.friends_count },
            { label: "Followers", value: profile.followers_count },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        {!isOwnProfile && currentUser && currentUser.user_id !== userId && (
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => openChat(profile.user_id, profile.username)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </button>

            {friendStatus === "none" && (
              <button
                onClick={() => handleFriendAction("send")}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 font-medium text-sm transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Add Friend
              </button>
            )}

            {friendStatus === "pending" && isSender && (
              <button
                onClick={() => handleFriendAction("cancel")}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-60 font-medium text-sm transition-all"
              >
                <Clock className="w-4 h-4" />
                Request sent
              </button>
            )}

            {friendStatus === "pending" && !isSender && (
              <button
                onClick={() => handleFriendAction("accept")}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-60 font-medium text-sm transition-all"
              >
                <UserCheck className="w-4 h-4" />
                Accept request
              </button>
            )}

            {friendStatus === "accepted" && (
              <button
                onClick={() => handleFriendAction("remove")}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-60 font-medium text-sm transition-all group"
              >
                <UserCheck className="w-4 h-4 group-hover:hidden" />
                <UserX className="w-4 h-4 hidden group-hover:block" />
                <span className="group-hover:hidden">Friends</span>
                <span className="hidden group-hover:inline">Remove</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Pins grid ── */}
      <div className="px-4 py-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
          <Grid className="w-3.5 h-3.5" />
          Pins ({profile.pins_count})
        </h2>

        {profile.pins.length === 0 ? (
          <p className="text-center py-16 text-gray-400 text-sm">No pins yet</p>
        ) : (
          <Masonry columnsCount={3} gutter="10px">
            {profile.pins.map((pin) => (
              <div
                key={pin.pin_id}
                className="rounded-xl overflow-hidden group relative cursor-pointer"
                onClick={() => {
                  /* открываем в галерее — pin.pin_id */
                }}
              >
                <img
                  src={pin.image_url}
                  alt={pin.title}
                  className="w-full h-auto object-cover transition-all duration-200 group-hover:brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
                  <p className="text-white text-sm font-semibold truncate">
                    {pin.title}
                  </p>
                  <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                    <Heart className="w-3 h-3" />
                    {pin.likes_count}
                  </p>
                </div>
              </div>
            ))}
          </Masonry>
        )}
      </div>
    </div>
  );
}
