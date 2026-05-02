# ✅ 업무 체크리스트 앱

여러 PC, 브라우저, 휴대폰에서 동일한 데이터를 사용하는 서버 기반 업무 체크리스트입니다.

## 기능

- 오늘 업무 / 월간 캘린더 / 주간 계획 / 업무 상세
- 체크리스트 / 처리절차 / 업무기록 / 반복업무 템플릿
- 모바일 하단 메뉴
- **서버 자동 저장** (data/database.json)
- 서버 오프라인 시 임시 localStorage 저장 → 복구 시 자동 동기화
- 저장 성공/실패 상태 화면 표시

## 로컬 실행

```bash
npm install
npm start
# → http://localhost:3000
```

## 같은 와이파이에서 다른 기기 접속

1. 서버 실행 PC의 IP 주소 확인 (예: `192.168.0.10`)
2. 다른 기기에서 `http://192.168.0.10:3000` 접속

> ⚠️ `index.html`을 직접 열지 마세요. 반드시 `npm start` 후 URL로 접속하세요.

## Render 배포

1. GitHub에 이 프로젝트 push
2. [Render](https://render.com) → New → Web Service → GitHub 연결
3. 설정:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: 프로젝트 루트
4. 배포 후 Render에서 제공하는 URL로 접속

> 💡 무료 Render 서버는 일정 시간 미사용 시 첫 접속이 느릴 수 있습니다.

## 파일 구조

```
├── server.js          # Express 서버
├── package.json
├── .gitignore
├── data/
│   └── database.json  # 공통 데이터 저장소
└── public/
    └── index.html     # 프론트엔드 앱
```

## API

| Method | Path | 설명 |
|--------|------|------|
| GET | /api/data | 전체 데이터 조회 |
| POST | /api/data | 전체 데이터 덮어쓰기 (동기화) |
| POST | /api/tasks | 업무 추가 |
| PUT | /api/tasks/:id | 업무 수정 |
| DELETE | /api/tasks/:id | 업무 삭제 |
| PUT | /api/tasks/:id/checklist/:checkId | 체크리스트 항목 수정 |
| POST | /api/records | 업무 기록 저장 |
| POST | /api/templates | 템플릿 저장 |
