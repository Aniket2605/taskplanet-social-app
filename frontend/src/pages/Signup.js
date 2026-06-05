import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Signup() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirm: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password) {
      setError('Please fill all fields');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/signup', {
        username: form.username,
        email: form.email,
        password: form.password
      });
      login(res.data.user, res.data.token);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Top decoration */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '40%',
        background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
        zIndex: 0
      }} />

      <div className="auth-card" style={{ position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div className="auth-logo">
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 4px 14px rgba(26,115,232,0.4)'
          }}>
            <span style={{ fontSize: 28 }}>🌍</span>
          </div>
          <h1>TaskPlanet</h1>
          <p>Social • Tasks • Rewards</p>
        </div>

        <h2 style={{
          fontSize: 18, fontWeight: 700,
          marginBottom: 20, color: '#1a1a1a'
        }}>
          Create Account 🚀
        </h2>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fdecea',
            color: '#c62828',
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 13,
            marginBottom: 14
          }}>
            {error}
          </div>
        )}

        {/* Username */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <FiUser style={{
            position: 'absolute', left: 14,
            top: '50%', transform: 'translateY(-50%)',
            color: '#9e9e9e', fontSize: 16
          }} />
          <input
            className="auth-input"
            style={{ paddingLeft: 40, marginBottom: 0 }}
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <FiMail style={{
            position: 'absolute', left: 14,
            top: '50%', transform: 'translateY(-50%)',
            color: '#9e9e9e', fontSize: 16
          }} />
          <input
            className="auth-input"
            style={{ paddingLeft: 40, marginBottom: 0 }}
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <FiLock style={{
            position: 'absolute', left: 14,
            top: '50%', transform: 'translateY(-50%)',
            color: '#9e9e9e', fontSize: 16
          }} />
          <input
            className="auth-input"
            style={{ paddingLeft: 40, paddingRight: 40, marginBottom: 0 }}
            type={showPass ? 'text' : 'password'}
            name="password"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={handleChange}
          />
          <div
            onClick={() => setShowPass(!showPass)}
            style={{
              position: 'absolute', right: 14,
              top: '50%', transform: 'translateY(-50%)',
              cursor: 'pointer', color: '#9e9e9e'
            }}
          >
            {showPass ? <FiEyeOff /> : <FiEye />}
          </div>
        </div>

        {/* Confirm Password */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <FiLock style={{
            position: 'absolute', left: 14,
            top: '50%', transform: 'translateY(-50%)',
            color: '#9e9e9e', fontSize: 16
          }} />
          <input
            className="auth-input"
            style={{ paddingLeft: 40, marginBottom: 0 }}
            type="password"
            name="confirm"
            placeholder="Confirm password"
            value={form.confirm}
            onChange={handleChange}
          />
        </div>

        {/* Signup Button */}
        <button
          className="auth-btn"
          onClick={handleSubmit}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        {/* Switch to Login */}
        <div className="auth-switch">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>
            Login
          </span>
        </div>

      </div>
    </div>
  );
}