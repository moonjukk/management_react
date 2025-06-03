import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/googleMok.css';

const WebSearch: React.FC = () => {
    const [title, setTitle] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const titleNm = localStorage.getItem('titleNm');
        if(titleNm !== null) setTitle(titleNm);

        const colorThemeNm = localStorage.getItem('colorThemeNm');
        setIsDarkMode(colorThemeNm === "BLACK"? true: false);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchInput.trim()) {
            // 검색어가 비어있지 않으면 이동
            navigate(`/websearchdetail?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    return (
        <div className={`google-page ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="google-body">
            <h1 className="google-logo-text">{title}</h1>
            <div className="search-container">
                <input type="text"
                        className="search-box"
                        placeholder="Google 검색 또는 URL 입력"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown} />
            </div>
            <div className="buttons">
                <button>{title} 검색</button>
                <button>I'm Feeling Lucky</button>
            </div>
            <div style={{ marginTop: '150px' }}>
            </div>
        </div>

        <footer className="footer">
            <div className="footer-left">대한민국</div>
            <div className="footer-links">
            <a href="#">광고</a>
            <a href="#">비즈니스</a>
            <a href="#">검색의 원리</a>
            </div>
            <div className="footer-links">
            <a href="#">개인정보처리방침</a>
            <a href="#">약관</a>
            <a href="#">설정</a>
            </div>
        </footer>
        </div>
    );
};

export default WebSearch;
