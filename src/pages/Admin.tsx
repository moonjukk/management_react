import React, { useEffect, useState } from 'react';
import Menu from '../components/Menu';

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
const colorOptions = ['GOLD', 'RED', 'GREEN', 'BLUE', 'BLACK', 'SILVER'];
const Admin: React.FC = () => {
	const [settings, setSettings] = useState<SearchEngineSetting[]>([]);
	const [editIndex, setEditIndex] = useState<number | null>(null);

	useEffect(() => {
		fetch("http://localhost:8080/api/settings/admin/1")
		.then((res) => res.json())
		.then((data) => setSettings(data))
		.catch((err) => console.error(err));
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

  	return (
		<div>
			<Menu />
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
						<button>실행</button>
						</>
					)}
					</div>
				))}
			</div>
		</div>
  	);
};

export default Admin;
