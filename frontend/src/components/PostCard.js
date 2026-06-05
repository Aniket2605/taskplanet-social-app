import { useState } from 'react';
import { FiHeart, FiMessageCircle, FiShare2, FiSend, FiTrash2 } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);

  const isLiked = likes.includes(user?.username);
  const isOwner = post.username === user?.username;

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleLike = async () => {
    try {
      const res = await API.put(`/posts/${post._id}/like`);
      setLikes(res.data.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      setSending(true);
      const res = await API.post(`/posts/${post._id}/comment`, {
        text: commentText
      });
      setComments(res.data.comments);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  const avatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg, #1a73e8, #0d47a1)',
      'linear-gradient(135deg, #e53935, #b71c1c)',
      'linear-gradient(135deg, #43a047, #1b5e20)',
      'linear-gradient(135deg, #fb8c00, #e65100)',
      'linear-gradient(135deg, #8e24aa, #4a148c)',
      'linear-gradient(135deg, #00acc1, #006064)',
    ];
    const index = name?.charCodeAt(0) % colors.length;
    return colors[index] || colors[0];
  };

  return (
    <div className="post-card" style={{
      animation: 'fadeSlideUp 0.3s ease forwards'
    }}>
      {/* Post Header */}
      <div className="post-header">
        <div className="post-user">
          <div className="avatar" style={{
            background: avatarColor(post.username)
          }}>
            {post.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="post-username">@{post.username}</div>
            <div className="post-time">{timeAgo(post.createdAt)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isOwner && (
            <button
              onClick={handleDelete}
              style={{
                background: '#fdecea',
                border: 'none',
                color: '#e53935',
                width: 32, height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              <FiTrash2 />
            </button>
          )}
          {!isOwner && (
            <button className="follow-btn">Follow</button>
          )}
        </div>
      </div>

      {/* Post Text */}
      {post.text && (
        <p className="post-text">{post.text}</p>
      )}

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="post-image"
          onError={(e) => e.target.style.display = 'none'}
        />
      )}

      {/* Stats Row */}
      <div style={{
        display: 'flex',
        gap: 12,
        padding: '6px 0',
        fontSize: 12,
        color: '#65676b'
      }}>
        {likes.length > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <AiFillHeart style={{ color: '#e53935' }} />
            {likes.length} {likes.length === 1 ? 'like' : 'likes'}
          </span>
        )}
        {comments.length > 0 && (
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => setShowComments(!showComments)}
          >
            💬 {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          style={{
            background: isLiked ? '#fdecea' : 'transparent',
            borderRadius: 8,
            transition: 'all 0.2s'
          }}
        >
          {isLiked
            ? <AiFillHeart style={{ color: '#e53935', fontSize: 18 }} />
            : <FiHeart />
          }
          <span>{likes.length}</span>
        </button>

        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
          style={{
            background: showComments ? '#e8f0fe' : 'transparent',
            color: showComments ? '#1a73e8' : '#65676b'
          }}
        >
          <FiMessageCircle />
          <span>{comments.length}</span>
        </button>

        <button className="action-btn">
          <FiShare2 />
          <span>0</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">

          {/* Existing Comments */}
          {comments.length === 0 && (
            <p style={{
              fontSize: 12, color: '#65676b',
              textAlign: 'center', padding: '8px 0'
            }}>
              No comments yet. Be the first!
            </p>
          )}

          {comments.map((c, i) => (
            <div key={i} className="comment-item">
              <div className="comment-avatar"
                style={{ background: avatarColor(c.username) }}>
                {c.username?.charAt(0).toUpperCase()}
              </div>
              <div className="comment-bubble">
                <div className="comment-username">@{c.username}</div>
                <div style={{ fontSize: 12, marginTop: 2 }}>{c.text}</div>
              </div>
            </div>
          ))}

          {/* Comment Input */}
          <div className="comment-input-row">
            <div className="comment-avatar"
              style={{ background: avatarColor(user?.username) }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <input
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            />
            <button
              className="comment-send-btn"
              onClick={handleComment}
              disabled={sending}
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}