import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import '../css/news.css';

interface SearchNews {
  id: number;
  userId: number;
  searchEngineId: number;
  newsTitle: string;
  newsContent: string;
  newsThumbnailId?: number;
  regDt: string;
  modDt?: string;
}

export default function News() {
  const [newsList, setNewsList] = useState<SearchNews[]>([]);
  const [formData, setFormData] = useState({
    id: null as number | null,
    userId: '',
    searchEngineId: '',
    newsTitle: '',
    newsContent: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchNewsList();
  }, []);

  const fetchNewsList = () => {
    axios.get<SearchNews[]>('http://localhost:8080/api/searchNews/admin/1')
      .then(res => setNewsList(res.data))
      .catch(console.error);
  };

  const handleSubmit = () => {
    const payload = {
      userId: Number(formData.userId),
      searchEngineId: Number(formData.searchEngineId),
      newsTitle: formData.newsTitle,
      newsContent: formData.newsContent,
      newsThumbnailId: null,
      regDt: new Date().toISOString(),
      modDt: new Date().toISOString(),
    };

    if (isEditing && formData.id !== null) {
      // 수정
      axios.put<SearchNews>(`http://localhost:8080/api/searchNews/admin/update/${formData.id}`, {
        ...payload,
        id: formData.id,
      }).then(() => {
        fetchNewsList();
        resetForm();
      }).catch(console.error);
    } else {
      // 등록
      axios.put<SearchNews>('http://localhost:8080/api/searchNews/admin/update/2', payload)
        .then(res => {
          setNewsList(prev => [...prev, res.data]);
          resetForm();
        })
        .catch(console.error);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      axios.delete(`http://localhost:8080/api/searchNews/admin/delete/${id}`)
        .then(() => {
          setNewsList(prev => prev.filter(news => news.id !== id));
        })
        .catch(console.error);
    }
  };

  const handleEdit = (news: SearchNews) => {
    setFormData({
      id: news.id,
      userId: news.userId.toString(),
      searchEngineId: news.searchEngineId.toString(),
      newsTitle: news.newsTitle,
      newsContent: news.newsContent,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 폼으로 스크롤
  };

  const resetForm = () => {
    setFormData({
      id: null,
      userId: '',
      searchEngineId: '',
      newsTitle: '',
      newsContent: '',
    });
    setIsEditing(false);
  };

  return (
    <div className="news-container">
      <h2>뉴스 {isEditing ? '수정' : '추가'} 및 관리</h2>

      <div className="card">
        <Input name="userId" placeholder="User ID" value={formData.userId} onChange={handleChange} type="number" />
        <Input name="searchEngineId" placeholder="Search Engine ID" value={formData.searchEngineId} onChange={handleChange} type="number" />
        <Input name="newsTitle" placeholder="뉴스 제목" value={formData.newsTitle} onChange={handleChange} />
        <Textarea name="newsContent" placeholder="뉴스 콘텐츠" value={formData.newsContent} onChange={handleChange} rows={6} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button onClick={handleSubmit}>{isEditing ? '수정 완료' : '뉴스 등록'}</Button>
          {isEditing && <Button variant="outline" onClick={resetForm}>취소</Button>}
        </div>
      </div>

      <div className="news-list">
        {newsList.map(news => (
          <div className="card" key={news.id}>
            <h3 className="news-item">{news.newsTitle}</h3>
            <p className="news-item">작성일: {new Date(news.regDt).toLocaleString()}</p>
            <div className="news-content" dangerouslySetInnerHTML={{ __html: news.newsContent }} />
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <Button variant="outline" onClick={() => handleEdit(news)}>수정</Button>
              <Button variant="destructive" onClick={() => handleDelete(news.id)}>삭제</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
