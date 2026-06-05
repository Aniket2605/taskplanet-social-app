import { useState, useRef } from 'react';
import { FiImage, FiSmile, FiSend, FiX } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CreatePost({ onPost }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const avatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg, #1a73e8, #0d47a1)',
      'linear-gradient(135deg, #e53935, #b71c1c)',
      'linear-gradient(135deg, #43a047, #1b5e20)',
    ];
    const index = name?.charCodeAt(0) % colors.length;
    return colors[index] || colors[0];
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImage(reader.result); // base64
    };
    reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!text.trim() && !image) return;
    try {
      setLoading(true);
      const res = await API.post('/posts', { text, image });
      onPost(res.data);
      setText('');
      setImage('');
      setPreview('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-box" style={{
      background: 'white',
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
    }}>

      {/* Top Row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div className="avatar" style={{
          background: avatarColor(user?.username),
          flexShrink: 0, marginTop: 2
        }}>
          {user?.username?.charAt(0).toUpperCase()}
        </div>

        <textarea
          className="create-post-input"
          placeholder={`What's on your mind, ${user?.username}?`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={text.length > 60 ? 3 : 1}
          style={{
            resize: 'none',
            width: '100%',
            transition: 'all 0.2s',
            background: '#f0f2f5',
            borderRadius: 20,
            padding: '10px 14px',
            border: 'none',
            outline: 'none',
            fontFamily: 'Poppins, sans-serif',
            fontSize: 13,
            lineHeight: 1.5
          }}
        />
      </div>

      {/* Image Preview */}
      {preview && (
        <div style={{ position: 'relative', marginTop: 10 }}>
          <img
            src={preview}
            alt="preview"
            style={{
              width: '100%', borderRadius: 10,
              maxHeight: 200, objectFit: 'cover'
            }}
          />
          <button
            onClick={() => { setPreview(''); setImage(''); }}
            style={{
              position: 'absolute', top: 6, right: 6,
              background: 'rgba(0,0,0,0.6)',
              border: 'none', color: 'white',
              width: 28, height: 28, borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer',
              fontSize: 14
            }}
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Divider */}
      <div style={{
        height: 1, background: '#f0f2f5',
        margin: '12px 0'
      }} />

      {/* Bottom Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: 4 }}>

          {/* Image Upload */}
          <button
            onClick={() => fileRef.current.click()}
            style={{
              display: 'flex', alignItems: 'center',
              gap: 6, background: 'none',
              border: 'none', color: '#45bd62',
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer', padding: '6px 10px',
              borderRadius: 8,
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            <FiImage style={{ fontSize: 18 }} />
            <span>Photo</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImage}
          />

          {/* Emoji */}
          <button style={{
            display: 'flex', alignItems: 'center',
            gap: 6, background: 'none',
            border: 'none', color: '#f7b928',
            fontSize: 13, fontWeight: 600,
            cursor: 'pointer', padding: '6px 10px',
            borderRadius: 8,
            fontFamily: 'Poppins, sans-serif'
          }}>
            <FiSmile style={{ fontSize: 18 }} />
            <span>Feeling</span>
          </button>
        </div>

        {/* Post Button */}
        <button
          className="post-submit-btn"
          onClick={handlePost}
          disabled={loading || (!text.trim() && !image)}
          style={{
            opacity: (!text.trim() && !image) ? 0.5 : 1,
            transition: 'all 0.2s',
            background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
            boxShadow: '0 3px 10px rgba(26,115,232,0.35)',
            borderRadius: 20,
            padding: '8px 20px'
          }}
        >
          <FiSend style={{ fontSize: 14 }} />
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}