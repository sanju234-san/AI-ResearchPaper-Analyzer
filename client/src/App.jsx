import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';

function AppRoutes() {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    const user = sessionStorage.getItem('auth_user');
    if (token && user) {
      try {
        const parsed = JSON.parse(user);
        setUserName(parsed.name || parsed.email);
        setIsAuthenticated(true);
      } catch {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = sessionStorage.getItem('auth_token');
      const user = sessionStorage.getItem('auth_user');
      if (!token || !user) {
        setIsAuthenticated(false);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogin = (name) => {
    setUserName(name);
    setIsAuthenticated(true);
    navigate('/');
  };

  const handleNavigate = (path) => {
    if (path === 'logout') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUserName(null);
      setIsAuthenticated(false);
      navigate('/login');
    } else {
      const routeMap = {
        home: '/',
        login: '/login',
        upload: '/upload',
        analysis: '/analysis',
        dashboard: '/dashboard',
        settings: '/settings'
      };
      navigate(routeMap[path] || '/');
    }
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} /> : <Navigate to="/" />} />
        <Route path="/" element={<HomePage onNavigate={handleNavigate} userName={userName} />} />
        <Route path="/upload" element={<UploadPage onNavigate={handleNavigate} userName={userName} onUploadComplete={(paper) => { setSelectedPaper(paper); navigate('/analysis'); }} />} />
        <Route path="/analysis" element={<AnalysisPage paper={selectedPaper} onNavigate={handleNavigate} userName={userName} />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage onNavigate={handleNavigate} userName={userName} onViewAnalysis={(paper) => { setSelectedPaper(paper); navigate('/analysis'); }} /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <SettingsPage onNavigate={handleNavigate} userName={userName} /> : <Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;