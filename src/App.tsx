// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MainPage from './pages/MainPage';
import Admin from './pages/Admin';
import './css/common.css';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="1026582183557-u3jdf55opro77pkkrgqkcl17ak30n7hv.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
