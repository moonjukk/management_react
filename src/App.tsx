import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import MainPage from './pages/MainPage';
import Admin from './pages/Admin';
import WebSearch from './pages/webSearch';
import WebSearchDetail from './pages/WebSearchDetail';
import './css/common.css';
import './css/admin.css';

const AppContent: React.FC<{
    userLoggedIn: boolean;
    handleSuccess: (cred: any) => void;
    handleLogout: () => void;
}> = ({ userLoggedIn, handleSuccess, handleLogout }) => {
    const location = useLocation();
    const hideNav = location.pathname === '/webSearch' || location.pathname === '/websearchdetail';

  return (
    <>
      {!hideNav && (
        <nav className='nav'>
          <li><a href="/">메인</a></li>
          <li><a href="/admin">엔진관리</a></li>
          <div>
            {!userLoggedIn ? (
              <li className='GoogleLogin'>
                <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />
              </li>
            ) : (
              <li>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}>로그아웃</a>
              </li>
            )}
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/webSearch" element={<WebSearch />} />
        <Route path="/webSearchDetail" element={<WebSearchDetail />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('idToken');
    if (token) {
      setUserLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('idToken');
    setUserLoggedIn(false);
    window.location.reload();
  };

  const handleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    try {
      const res = await axios.post(
        'http://localhost:8080/api/auth/google-login',
        { idToken },
        { withCredentials: true }
      );
      console.log('로그인 성공:', res.data);
      localStorage.setItem('idToken', idToken);
      setUserLoggedIn(true);
      window.location.reload();
    } catch (err) {
      console.error('서버 로그인 실패:', err);
    }
  };

  return (
    <GoogleOAuthProvider clientId="1026582183557-u3jdf55opro77pkkrgqkcl17ak30n7hv.apps.googleusercontent.com">
      <Router>
        <AppContent
          userLoggedIn={userLoggedIn}
          handleSuccess={handleSuccess}
          handleLogout={handleLogout}
        />
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
