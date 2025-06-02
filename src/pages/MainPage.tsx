// src/pages/MainPage.tsx
import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import Menu from '../components/Menu';
import axios from 'axios';

const MainPage: React.FC = () => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('idToken');
        if (token) {
            setUserLoggedIn(true);
            // 필요 시 서버에 토큰 검증 요청 가능
        }
    }, []);

    const handleSuccess = async (credentialResponse: any) => {
        const idToken = credentialResponse.credential;
        try {
            const res = await axios.post(
                'http://localhost:8080/api/auth/google-login',
                { idToken },
                { withCredentials: true } // 서버에서 쿠키 전달받기
            );
            console.log('로그인 성공:', res.data);
            localStorage.setItem('idToken', idToken);
            setUserLoggedIn(true);
        } catch (err) {
            console.error('서버 로그인 실패:', err);
        }
    };

    const handleLogout = () => {
        googleLogout();
        localStorage.removeItem('idToken');
        setUserLoggedIn(false);
    };

    return (
        <div>
        <Menu />
        <div className='adminBody'>
            <h1>메인 페이지</h1>
            <div>
                {!userLoggedIn ? (
                    <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />
                ) : (
                    <button onClick={handleLogout}>로그아웃</button>
                )}
            </div>
        </div>
        </div>
    );
};

export default MainPage;
