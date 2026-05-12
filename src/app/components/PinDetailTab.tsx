import { useState, useEffect } from "react";
import { Heart, Download, Send } from "lucide-react";
import { useAppContext } from "../../AppContext";
import { usePinActions } from "../hooks/usePinActions";
import { useComments } from "../hooks/useComments";
import { downloadImage } from "../utils/download";

export default function PinDetailTab() {
  const { selectedPin, currentUser } = useAppContext();
  const [scale, setScale] = useState(100);
  const [commentText, setCommentText] = useState("");
  
  const { state: pinState, toggleLike, toggleSave, fetchState } = usePinActions(
    selectedPin?.pin_id ?? 0, 
    currentUser?.user_id
  );
  const { comments, loading: commentsLoading, fetchComments, addComment, toggleCommentLike } = useComments(selectedPin?.pin_id ?? 0);

  useEffect(() => {
    if (selectedPin) {
      fetchState();
      fetchComments();
    }
  }, [selectedPin, fetchState, fetchComments]);

  if (!selectedPin) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a pin from the gallery
      </div>
    );
  }

  const handleAddComment = async () => {
    if (!commentText.trim() || !currentUser) return;
    await addComment(currentUser.user_id, commentText);
    setCommentText("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Zoom slider */}
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

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <img
          src={selectedPin.image_url}
          alt={selectedPin.title}
          style={{ width: `${scale}%`, height: "auto" }}
          className="rounded-2xl"
        />
        
        <h2 className="text-2xl font-bold mt-4">{selectedPin.title}</h2>
        <p className="text-gray-500 mt-1">{selectedPin.category}</p>
        <p className="text-gray-700 mt-3 leading-relaxed">{selectedPin.description}</p>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
              pinState.liked
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Heart className="w-4 h-4" fill={pinState.liked ? "currentColor" : "none"} />
            Like ({pinState.likesCount})
          </button>
          <button
            onClick={() => downloadImage(selectedPin.image_url, `${selectedPin.title || 'pin'}.jpg`)}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all bg-blue-100 text-blue-600 hover:bg-blue-200"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        {/* Comments section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold mb-4">Comments ({comments.length})</h3>

          {/* Add comment */}
          {currentUser && (
            <div className="flex gap-3 mb-6">
              <img
                src={currentUser.profile_picture || "https://via.placeholder.com/32"}
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

          {/* Comments list */}
          <div className="space-y-4">
            {commentsLoading ? (
              <p className="text-gray-400 text-sm">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-400 text-sm">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.comment_id} className="flex gap-3 pb-4 border-b border-gray-100">
                  <img
                    src={comment.profile_picture || "https://via.placeholder.com/32"}
                    alt={comment.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{comment.username}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                    <button
                      onClick={() => {
                        if (currentUser) {
                          toggleCommentLike(comment.comment_id, currentUser.user_id);
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