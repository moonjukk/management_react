import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type SearchEngineSetting = {
  id: number;
  userId: string;
  titleNm: string;
  logoFileId: number;
  colorThemeNm: string;
  articleYn: string;
  snsYn: string;
  videoYn: string;
  imageYn: string;
  blogYn: string;
};
//const colorOptions = ['GOLD', 'RED', 'GREEN', 'BLUE', 'BLACK', 'SILVER'];
const colorOptions = ['BLACK', 'WHITE'];
const Admin: React.FC = () => {
	const [settings, setSettings] = useState<SearchEngineSetting[]>([]);
	const [editIndex, setEditIndex] = useState<number | null>(null);
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
            const userId = user.id; // 백엔드 User 객체의 ID
            return fetch(`http://localhost:8080/api/settings/admin/${userId}`);
        })
        .then(res => res.json())
        .then(data => setSettings(data))
        .catch(err => {
            console.error(err);
            // 필요 시 로그인 페이지로 이동 등 처리
        });
    }, []);

  	/**  */
	const handleTitleChange = (index: number, value: string) => {
		const newSettings = [...settings];
		newSettings[index].titleNm = value;
		setSettings(newSettings);
	};

  	/** 컬러 변경 */
	const handleColorChange = (index: number, value: string) => {
		const newSettings = [...settings];
		newSettings[index].colorThemeNm = value;
		setSettings(newSettings);
	};

  	/**  */
	const handleEditClick = (index: number) => {
		setEditIndex(index);
	};

  	/** select box 토글 */
	type YnKey = 'articleYn' | 'snsYn' | 'videoYn' | 'imageYn' | 'blogYn';
	const handleToggle = (index: number, key: YnKey) => {
		const newSettings = [...settings];
		newSettings[index][key] = newSettings[index][key] === 'Y' ? 'N' : 'Y';
		setSettings(newSettings);
	};

  	/** 저장 action */
  	const handleSave = (setting: SearchEngineSetting) => {
		if (!setting.titleNm) {
			alert("제목은 필수입니다.");
			return;
		}
		fetch(`http://localhost:8080/api/settings/admin/update/${setting.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(setting),
			})
			.then(res => res.json())
			.then(data => {
				alert("저장되었습니다.");
				setEditIndex(null);
			})
			.catch(err => {
				console.error(err);
				alert("저장 실패");
		});
 	};

	/** WebSearch 이동 */
	const navigate = useNavigate();
	const goToWebSearch = () => {
		// 로컬 스토리지 저장
		localStorage.setItem('titleNm', settings[0].titleNm);
		localStorage.setItem('colorThemeNm', settings[0].colorThemeNm);

		// 페이지 이동
		navigate('/webSearch');
	}

  	return (
		<div>
			<div className='adminBody'>
				<h2>검색엔진 세팅 목록</h2>
				{settings.map((s, index) => (
					<div key={s.id} style={{ border: '1px solid gray', marginBottom: '10px', padding: '10px' }}>
					{editIndex === index ? (
						<>
						<div>
							<label><strong>제목:</strong></label>
							<input
							type="text"
							value={s.titleNm}
							onChange={(e) => handleTitleChange(index, e.target.value)}
							/>
						</div>
						<div>
							<label><strong>컬러 테마:</strong></label>
							<select
							value={s.colorThemeNm}
							onChange={(e) => handleColorChange(index, e.target.value)}
							>
							{colorOptions.map((color) => (
								<option key={color} value={color}>{color}</option>
							))}
							</select>
							<span
							style={{
								display: 'inline-block',
								width: '20px',
								height: '20px',
								backgroundColor: s.colorThemeNm.toLowerCase(),
								marginLeft: '10px',
								border: '1px solid #ccc',
							}}
							></span>
						</div>
						<label>
							기사 여부:
							<input type="checkbox"
									checked={s.articleYn === 'Y'}
									onChange={() => handleToggle(index, 'articleYn')}/>
						</label>
						<br />
						<label>
							SNS 여부:
							<input type="checkbox"
									checked={s.snsYn === 'Y'}
									onChange={() => handleToggle(index, 'snsYn')}/>
						</label>
						<br />
						<label>
							동영상 여부:
							<input type="checkbox"
									checked={s.videoYn === 'Y'}
									onChange={() => handleToggle(index, 'videoYn')}/>
						</label>
						<br />
						<label>
							이미지 여부:
							<input type="checkbox"
									checked={s.imageYn === 'Y'}
									onChange={() => handleToggle(index, 'imageYn')}/>
						</label>
						<br />
						<label>
							블로그 여부:
							<input type="checkbox"
									checked={s.blogYn === 'Y'}
									onChange={() => handleToggle(index, 'blogYn')}/>
						</label>
						<br />

						<button onClick={() => setEditIndex(null)}>취소</button>
						<button onClick={() => handleSave(s)}>저장</button>
						</>
					) : (
						<>
						<p><strong>제목:</strong> {s.titleNm}</p>
						<p><strong>컬러 테마:</strong> {s.colorThemeNm}
							<span
							style={{
								display: 'inline-block',
								width: '20px',
								height: '20px',
								backgroundColor: s.colorThemeNm.toLowerCase(),
								marginLeft: '10px',
								border: '1px solid #ccc',
							}}
							></span>
						</p>
						<p><strong>기사 여부:</strong> {s.articleYn}</p>
						<p><strong>SNS 여부:</strong> {s.snsYn}</p>
						<p><strong>동영상 여부:</strong> {s.videoYn}</p>
						<p><strong>이미지 여부:</strong> {s.imageYn}</p>
						<p><strong>블로그 여부:</strong> {s.blogYn}</p>
						<button onClick={() => handleEditClick(index)}>수정</button>
						<button onClick={goToWebSearch}>실행</button>
						</>
					)}
					</div>
				))}
			</div>
		</div>
  	);
};

export default Admin;
