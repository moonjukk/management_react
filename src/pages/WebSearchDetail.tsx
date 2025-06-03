import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/googleMok.css';

const dummyResults = [
  {
    title: 'React – A JavaScript library for building user interfaces',
    link: 'https://reactjs.org/',
    snippet: 'React makes it painless to create interactive UIs. Design simple views for each state in your application.',
  },
  {
    title: 'Getting Started with React',
    link: 'https://reactjs.org/docs/getting-started.html',
    snippet: 'This page introduces the React documentation and how to get started with React.',
  },
  {
    title: 'React Tutorial',
    link: 'https://www.tutorialspoint.com/reactjs/',
    snippet: 'ReactJS Tutorial provides basic and advanced concepts of ReactJS.',
  },
];

const WebSearchDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');

    // 쿼리스트링에서 검색어 받아오기
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('q') || '';

    const [isDarkMode, setIsDarkMode] = useState(true);

    // 다크모드 상태 유지용 예시 (localStorage 연동)
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) setIsDarkMode(savedMode === 'true');
        
        const titleNm = localStorage.getItem('titleNm');
        if(titleNm !== null) setTitle(titleNm);

        const colorThemeNm = localStorage.getItem('colorThemeNm');
        setIsDarkMode(colorThemeNm === "BLACK"? true: false);
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode.toString());
    }, [isDarkMode]);

    // 검색창에서 바로 검색 가능하도록
    const [searchInput, setSearchInput] = useState(keyword);

    const handleSearch = () => {
        if (searchInput.trim()) {
        navigate(`/websearchdetail?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    return (
        <div className={`google-page ${isDarkMode ? 'dark' : 'light'}`}>
        <header className="google-header">
            <h1 className="google-logo-text" onClick={() => navigate('/')}>{title}</h1>
            <div className="search-container">
                <input
                    type="text"
                    className="search-box"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="검색어 입력"
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch}>검색</button>
            </div>
        </header>

        <main className="search-results">
            <p>검색어: <strong>{keyword}</strong></p>
            <ul>
                {dummyResults.map((item, idx) => (
                    <li key={idx} className="search-result-item">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="result-title">
                        {item.title}
                    </a>
                    <p className="result-snippet">{item.snippet}</p>
                    <a href={item.link} className="result-link">{item.link}</a>
                    </li>
                ))}
            </ul>
        </main>

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

export default WebSearchDetail;
