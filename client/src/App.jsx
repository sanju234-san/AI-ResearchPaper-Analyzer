import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [userName, setUserName] = useState(null);

  // Restore auth state on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    if (token && user) {
      try {
        const parsed = JSON.parse(user);
        setUserName(parsed.name || parsed.email);
        setCurrentPage('home');
      } catch {
        // Invalid stored data, stay on login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const handleLogin = (name) => {
    setUserName(name);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUserName(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    if (page === 'logout') {
      handleLogout();
    } else {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'home':
        return <HomePage onNavigate={handleNavigate} userName={userName} />;
      case 'upload':
        return (
          <UploadPage
            onNavigate={handleNavigate}
            userName={userName}
            onUploadComplete={(paper) => {
              setSelectedPaper(paper);
              setCurrentPage('analysis');
            }}
          />
        );
      case 'analysis':
        return (
          <AnalysisPage
            paper={selectedPaper}
            onNavigate={handleNavigate}
            userName={userName}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            userName={userName}
            onViewAnalysis={(paper) => {
              setSelectedPaper(paper);
              setCurrentPage('analysis');
            }}
          />
        );
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} userName={userName} />;
      default:
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;