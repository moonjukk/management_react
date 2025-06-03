import React, { useState, useEffect } from 'react';
type LoginUserSetting = {
  id: number;
  email: String;
  loginProvider: String;
  name: String;
}
const MainPage: React.FC = () => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loginUser, setLoginUser] = useState<LoginUserSetting>();
    useEffect(() => {
        const idToken = localStorage.getItem("idToken");
        if (!idToken) return;

        // idToken 보내서 사용자 ID 요청
        fetch("http://localhost:8080/api/auth/getLoginInfo", {
        credentials: 'include', // 세션 쿠키 포함
        })
        .then(res => {
            if (!res.ok) throw new Error('Not logged in');
            return res.json();
        })
        .then(user => {
            setLoginUser(user);
        })
    }, []);

    return (
        <div>
        <div className='adminBody'>
            <h1>메인 페이지</h1>
            {loginUser ? (
                <span>{loginUser.name} 님, 환영합니다!</span>
                ) : (
                <span>로그인이 필요합니다.</span>
            )}
        </div>
        </div>
    );
};

export default MainPage;
