import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          user ? <Navigate to="/feed" /> : <Navigate to="/login" />
        } />
        <Route path="/login" element={
          user ? <Navigate to="/feed" /> : <Login />
        } />
        <Route path="/signup" element={
          user ? <Navigate to="/feed" /> : <Signup />
        } />
        <Route path="/feed" element={
          user ? <Feed /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;