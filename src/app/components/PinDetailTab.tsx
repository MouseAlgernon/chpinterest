import { useState, useEffect } from "react";
import {
  Heart,
  Download,
  Send,
  MessageCircle,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import { useAppContext } from "../../AppContext";
import { usePinActions } from "../hooks/usePinActions";
import { useComments } from "../hooks/useComments";
import { downloadImage } from "../utils/download";
import { getFriendStatus } from "../hooks/useFriends";
import { fetchUserSettings, UserSettings } from "../hooks/useSettings";

type FriendStatus = "none" | "pending" | "accepted" | "blocked";

export default function PinDetailTab() {
  const { selectedPin, currentUser, openUserProfile, openChat } =
    useAppContext();
  const [scale, setScale] = useState(100);
  const [commentText, setCommentText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Keep author relation state next to the detail view.
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");
  const [isSender, setIsSender] = useState(false);
  const [targetSettings, setTargetSettings] = useState<UserSettings | null>(
    null,
  );
  const [authorActionLoading, setAuthorActionLoading] = useState(false);

  const {
    state: pinState,
    toggleLike,
    toggleSave,
    fetchState,
  } = usePinActions(selectedPin?.pin_id ?? 0, currentUser?.user_id);
  const {
    comments,
    loading: commentsLoading,
    fetchComments,
    addComment,
    toggleCommentLike,
  } = useComments(selectedPin?.pin_id ?? 0);

  // Reload pin state and comments when the viewed pin changes.
  useEffect(() => {
    if (selectedPin) {
      fetchState();
      fetchComments();
    }
  }, [selectedPin, fetchState, fetchComments]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedPin?.pin_id]);

  // Load author access rules for message and friend buttons.
  useEffect(() => {
    if (
      !selectedPin ||
      !currentUser ||
      selectedPin.user_id === currentUser.user_id
    ) {
      setFriendStatus("none");
      setIsSender(false);
      setTargetSettings(null);
      return;
    }

    Promise.all([
      getFriendStatus(currentUser.user_id, selectedPin.user_id),
      fetchUserSettings(selectedPin.user_id),
    ])
      .then(([statusData, settingsData]) => {
        setFriendStatus(statusData.status);
        setIsSender(statusData.is_sender);
        setTargetSettings(settingsData);
      })
      .catch((err) => console.error("Failed to load author info:", err));
  }, [selectedPin]);

  if (!selectedPin) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a pin from the gallery
      </div>
    );
  }

  const pin = selectedPin;
  const isOwnPin = currentUser && pin.user_id === currentUser.user_id;

  const imageSources =
    pin.images && pin.images.length > 0
      ? [...pin.images]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((image) => image.image_path)
      : [pin.image_url];

  const safeImageIndex = Math.min(currentImageIndex, imageSources.length - 1);
  const currentImage = imageSources[safeImageIndex];
  const hasMultipleImages = imageSources.length > 1;

  const avatar =
    (pin as any).author_picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(pin.username ?? "U")}&size=72&background=random`;

  const handleAddComment = async () => {
    if (!commentText.trim() || !currentUser) return;
    await addComment(currentUser.user_id, commentText);
    setCommentText("");
  };

  const handleFriendAction = async (action: string) => {
    if (!currentUser || authorActionLoading) return;
    setAuthorActionLoading(true);
    try {
      await fetch("/api/friends.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          user_id: currentUser.user_id,
          friend_id: pin.user_id,
        }),
      });
      const statusData = await getFriendStatus(
        currentUser.user_id,
        pin.user_id,
      );
      setFriendStatus(statusData.status);
      setIsSender(statusData.is_sender);
    } catch (err) {
      console.error("Friend action failed:", err);
    } finally {
      setAuthorActionLoading(false);
    }
  };

  const canMessage =
    !isOwnPin &&
    targetSettings !== null &&
    targetSettings.messages_from !== "nobody" &&
    (targetSettings.messages_from === "everyone" ||
      friendStatus === "accepted");

  const canAddFriend =
    !isOwnPin &&
    targetSettings !== null &&
    targetSettings.friend_requests_from === "everyone" &&
    friendStatus === "none";

  return (
    <div className="flex flex-col h-full">
      {/* Scale only changes the current image preview size. */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100">
        <span className="text-sm text-gray-400">25%</span>
        <input
          type="range"
          min={25}
          max={100}
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-gray-400">100%</span>
        <span className="text-sm font-medium w-12 text-right">{scale}%</span>
        <button
          onClick={() => setScale(100)}
          className="text-sm text-gray-400 hover:text-black transition-all"
        >
          reset
        </button>
      </div>

      {/* Author row also exposes social actions. */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <button
          onClick={() => openUserProfile(pin.user_id, pin.username ?? "")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src={avatar} className="w-9 h-9 rounded-full object-cover" />
          <div className="text-left">
            <p className="font-semibold text-sm">{pin.username ?? "Unknown"}</p>
            <p className="text-xs text-gray-400">Author</p>
          </div>
        </button>

        {!isOwnPin && (
          <div className="flex gap-2">
            {/* Allow chat only when the target settings permit it. */}
            {canMessage && (
              <button
                onClick={() => openChat(pin.user_id, pin.username ?? "")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Message
              </button>
            )}

            {/* Show request action only in the idle state. */}
            {canAddFriend && (
              <button
                onClick={() => handleFriendAction("send")}
                disabled={authorActionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 font-medium text-xs transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Friend
              </button>
            )}

            {/* Sender can cancel an outgoing pending request. */}
            {!isOwnPin && friendStatus === "pending" && isSender && (
              <button
                onClick={() => handleFriendAction("cancel")}
                disabled={authorActionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-60 font-medium text-xs transition-all"
              >
                <Clock className="w-3.5 h-3.5" />
                Pending
              </button>
            )}

            {/* Receiver can accept an incoming pending request. */}
            {!isOwnPin && friendStatus === "pending" && !isSender && (
              <button
                onClick={() => handleFriendAction("accept")}
                disabled={authorActionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-60 font-medium text-xs transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Accept
              </button>
            )}

            {/* Friends can be removed from the same place. */}
            {!isOwnPin && friendStatus === "accepted" && (
              <button
                onClick={() => handleFriendAction("remove")}
                disabled={authorActionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-60 font-medium text-xs transition-all group"
              >
                <UserCheck className="w-3.5 h-3.5 group-hover:hidden" />
                <UserX className="w-3.5 h-3.5 hidden group-hover:block" />
                <span className="group-hover:hidden">Friends</span>
                <span className="hidden group-hover:inline">Remove</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main pin content and media viewer. */}
      <div className="flex-1 overflow-auto p-6">
        <img
          src={currentImage}
          alt={`${pin.title} ${hasMultipleImages ? `(${safeImageIndex + 1}/${imageSources.length})` : ""}`.trim()}
          style={{ width: `${scale}%`, height: "auto" }}
          className="rounded-2xl"
        />

        {hasMultipleImages && (
          <div className="mt-4 max-w-xl">
            <div className="mb-2 flex items-center justify-between gap-3">
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={safeImageIndex === 0}
                className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-500">
                Slide {safeImageIndex + 1} of {imageSources.length}
              </span>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    Math.min(imageSources.length - 1, prev + 1),
                  )
                }
                disabled={safeImageIndex === imageSources.length - 1}
                className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <input
              type="range"
              min={0}
              max={imageSources.length - 1}
              step={1}
              value={safeImageIndex}
              onChange={(e) => setCurrentImageIndex(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <h2 className="text-2xl font-bold mt-4">{pin.title}</h2>
        <p className="text-gray-500 mt-1">{pin.category}</p>
        <p className="text-gray-700 mt-3 leading-relaxed">{pin.description}</p>

        {/* Pin actions use server state from the hooks. */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
              pinState.liked
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Heart
              className="w-4 h-4"
              fill={pinState.liked ? "currentColor" : "none"}
            />
            Like ({pinState.likesCount})
          </button>
          <button
            onClick={() =>
              downloadImage(
                currentImage,
                `${pin.title || "pin"}-${safeImageIndex + 1}.jpg`,
              )
            }
            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all bg-blue-100 text-blue-600 hover:bg-blue-200"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        {/* Comments are loaded separately to keep pin data lighter. */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold mb-4">
            Comments ({comments.length})
          </h3>

          {/* Logged in users can post a new comment here. */}
          {currentUser && (
            <div className="flex gap-3 mb-6">
              <img
                src={
                  currentUser.profile_picture ||
                  "https://via.placeholder.com/32"
                }
                alt={currentUser.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-full transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Keep newest comments first for quick feedback. */}
          <div className="space-y-4">
            {commentsLoading ? (
              <p className="text-gray-400 text-sm">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-400 text-sm">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.comment_id}
                  className="flex gap-3 pb-4 border-b border-gray-100"
                >
                  <img
                    src={
                      comment.profile_picture ||
                      "https://via.placeholder.com/32"
                    }
                    alt={comment.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {comment.username}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {comment.content}
                    </p>
                    <button
                      onClick={() => {
                        if (currentUser) {
                          toggleCommentLike(
                            comment.comment_id,
                            currentUser.user_id,
                          );
                        }
                      }}
                      className="text-xs text-gray-500 hover:text-red-600 mt-2 transition-all flex items-center gap-1"
                    >
                      <Heart className="w-3 h-3" /> {comment.likes_count}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
