import { useState, useCallback } from 'react';

export interface Comment {
  comment_id: number;
  pin_id: number;
  user_id: number;
  content: string;
  created_at: string;
  username: string;
  profile_picture: string | null;
  likes_count: number;
}

const API_BASE = '/api';

export function useComments(pinId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/comments.php?action=get-comments&pin_id=${pinId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  }, [pinId]);

  const addComment = useCallback(async (userId: number, content: string) => {
    try {
      const response = await fetch(`${API_BASE}/comments.php?action=add-comment`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin_id: pinId, user_id: userId, content }),
      });
      const comment = await response.json();
      setComments(prev => [comment, ...prev]);
      return comment;
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }, [pinId]);

  const toggleCommentLike = useCallback(async (commentId: number, userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/comments.php?action=toggle-comment-like`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: commentId, user_id: userId }),
      });
      const data = await response.json();

      setComments(prev => prev.map(comment =>
        comment.comment_id === commentId
          ? { ...comment, likes_count: data.liked ? comment.likes_count + 1 : Math.max(0, comment.likes_count - 1) }
          : comment
      ));
    } catch (error) {
      console.error('Failed to toggle comment like:', error);
    }
  }, []);

  return { comments, loading, fetchComments, addComment, toggleCommentLike };
}
