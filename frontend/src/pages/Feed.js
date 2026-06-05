import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  FiBell, FiSearch, FiMoon, FiSun, FiLogOut
} from 'react-icons/fi';

export default function Feed() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('All Post');
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const tabs = ['All Post', 'For You', 'Most Liked', 'Most Commented'];

  const fetchPosts = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await API.get(`/posts?page=${pageNum}&limit=10`);
      if (pageNum === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts(prev => [...prev, ...res.data.posts]);
      }
      setHasMore(pageNum < res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handleNewPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleDelete = (id) => {
    setPosts(prev => prev.filter(p => p._id !== id));
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(next);
  };

  const getSortedPosts = () => {
    let filtered = [...posts];
    if (search.trim()) {
      filtered = filtered.filter(p =>
        p.text?.toLowerCase().includes(search.toLowerCase()) ||
        p.username?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (activeTab === 'Most Liked') {
      return filtered.sort((a, b) => b.likes.length - a.likes.length);
    }
    if (activeTab === 'Most Commented') {
      return filtered.sort((a, b) => b.comments.length - a.comments.length);
    }
    if (activeTab === 'For You') {
      return filtered.filter(p => p.username !== user?.username);
    }
    return filtered;
  };

  return (
    <div style={{
      background: darkMode ? '#18191a' : '#f0f2f5',
      minHeight: '100vh',
      transition: 'background 0.3s'
    }}>

      {/* Header */}
      <div style={{
        position: 'fixed', top: 0,
        width: '100%', maxWidth: 480,
        left: '50%', transform: 'translateX(-50%)',
        background: darkMode ? '#242526' : 'white',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        boxShadow: '0 1px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: 20, fontWeight: 700,
          color: darkMode ? 'white' : '#1a1a1a'
        }}>
          Social
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Points */}
          <div className="points-badge">
            ⭐ 0
          </div>
          {/* Balance */}
          <div className="balance-badge">
            ₹0.00
          </div>
          {/* Bell */}
          <button style={{
            background: '#f0f2f5', border: 'none',
            width: 36, height: 36, borderRadius: '50%',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
            color: '#65676b', fontSize: 17, position: 'relative'
          }}>
            <FiBell />
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 8, height: 8,
              background: '#e53935', borderRadius: '50%'
            }} />
          </button>
          {/* Dark mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: '#f0f2f5', border: 'none',
              width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer',
              color: '#65676b', fontSize: 17
            }}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          {/* Logout */}
          <button
            onClick={logout}
            style={{
              background: '#fdecea', border: 'none',
              width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer',
              color: '#e53935', fontSize: 17
            }}
          >
            <FiLogOut />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-wrapper" style={{
        background: 'transparent'
      }}>

        {/* Search Bar */}
        <div className="search-bar" style={{
          background: darkMode ? '#3a3b3c' : '#f0f2f5',
          border: `1.5px solid ${darkMode ? '#4a4b4c' : '#e0e0e0'}`
        }}>
          <FiSearch style={{ color: '#65676b', fontSize: 16 }} />
          <input
            placeholder="Search promotions, users, posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ color: darkMode ? 'white' : '#1a1a1a' }}
          />
        </div>

        {/* Create Post */}
        <CreatePost onPost={handleNewPost} />

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab
                  ? '#1a73e8'
                  : darkMode ? '#3a3b3c' : 'white',
                color: activeTab === tab
                  ? 'white'
                  : darkMode ? '#e4e6ea' : '#1a1a1a',
                borderColor: activeTab === tab
                  ? '#1a73e8'
                  : darkMode ? '#4a4b4c' : '#e0e0e0'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading && posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{
              width: 40, height: 40,
              border: '3px solid #e0e0e0',
              borderTop: '3px solid #1a73e8',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px'
            }} />
            <p style={{ color: '#65676b', fontSize: 13 }}>
              Loading posts...
            </p>
          </div>
        ) : getSortedPosts().length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 40,
            color: '#65676b'
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
            <p style={{ fontSize: 14 }}>No posts yet. Be the first!</p>
          </div>
        ) : (
          <>
            {getSortedPosts().map(post => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handleDelete}
              />
            ))}

            {/* Load More */}
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'white',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#1a73e8',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  marginBottom: 12
                }}
              >
                {loading ? 'Loading...' : 'Load More Posts'}
              </button>
            )}
          </>
        )}
      </div>

      {/* FAB Button */}
      <button
        className="fab-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Back to top"
      >
        +
      </button>

      {/* Bottom Nav */}
      <Navbar active="social" />

      {/* Animations */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}