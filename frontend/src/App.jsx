import React, { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/globals.css';

function App() {
  const { user, token, fetchUser } = useAuthStore();
  const [currentPage, setCurrentPage] = React.useState('dashboard');

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  // Simple routing based on URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/login') setCurrentPage('login');
    else if (path === '/register') setCurrentPage('register');
    else setCurrentPage('dashboard');
  }, []);

  // Handle navigation
  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/login') setCurrentPage('login');
      else if (path === '/register') setCurrentPage('register');
      else setCurrentPage('dashboard');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPage === 'login') return <Login />;
  if (currentPage === 'register') return <Register />;
  return <Dashboard />;
}

export default App;
