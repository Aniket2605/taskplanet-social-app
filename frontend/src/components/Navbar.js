import { FiHome, FiList, FiGlobe, FiAward, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ active = 'social' }) {
  const { logout } = useAuth();

  const items = [
    { id: 'home', icon: <FiHome />, label: 'Home' },
    { id: 'tasks', icon: <FiList />, label: 'Tasks' },
    { id: 'social', icon: <FiGlobe />, label: 'Social' },
    { id: 'leaderboard', icon: <FiAward />, label: 'Leader Board' },
    { id: 'chat', icon: <FiMessageCircle />, label: 'Chat' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <div
          key={item.id}
          className={`nav-item ${active === item.id ? 'active' : ''}`}
          
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  );
}