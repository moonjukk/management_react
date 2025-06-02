import React, { useState, useEffect } from 'react';
import '../css/admin.css';

const Main: React.FC = () => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('idToken');
        if (token) {
            setUserLoggedIn(true);
            // 필요 시 서버에 토큰 검증 요청 가능
        }
    }, []);
    const handleLogout = () => {
        //googleLogout();
        localStorage.removeItem('idToken');
        setUserLoggedIn(false);
    };
    return (
        <nav className='nav'>
            <li><a href="/">메인</a></li>
            <li><a href="/admin">엔진관리</a></li>
            <div>
                {!userLoggedIn ? (
                    <span></span>
                ) : (
                    <li>
                        <a href="#" onClick={(e) => {
                          e.preventDefault(); // 페이지 이동 막기
                          handleLogout();
                        }}>
                          로그아웃
                        </a>
                    </li>
                )}
            </div>
        </nav>
    );
};

export default Main;
