# Campus Navi Frontend

대학생 정보 파편화를 해결하는 AI 기반 캠퍼스 네비 서비스의 프론트엔드 레포지토리입니다.

Campus Navi는 대학 공지, 학사 정보, 관심사 기반 추천 흐름을 하나의 서비스 안에서 제공하여  
사용자가 필요한 정보를 더 빠르게 발견하고 놓치지 않도록 돕는 것을 목표로 합니다.

---

## Service

- Production: https://campus-navi.com
- API Server: https://campus-navi.com/api/v1
- Organization: Campus Navi

---

## 주요 기능

### 회원가입 및 인증

- 대학 선택
- 학교 이메일 인증
- 학과 / 입학년도 / 학년 선택
- 아이디, 비밀번호, 닉네임 검증
- 약관 동의 및 가입 완료

### 홈

- 사용자 정보 조회
- 관심사 설정 유도
- 신규 공지 / 추천 공지 카드 노출
- 교내 정보 진입 흐름 제공

### 교내 정보

- 공식 공지 목록 조회
- 카테고리 필터
- 정렬 및 검색
- 공지 상세 정보 확인
- 신청 기간, 마감일, 첨부 자료 표시

### 관심사 설정

- 관심 키워드 선택
- 관심사 저장 API 연동
- 맞춤 공지 추천 기반 마련

---

## Tech Stack

- Vite
- React
- TypeScript
- react-router-dom
- TanStack Query
- Zustand
- Axios
- Tailwind CSS
- ESLint / Prettier

---

## Getting Started

```bash
npm install
npm run dev
```

기본 개발 서버는 보통 아래 주소에서 실행됩니다.

```text
http://localhost:5173
```

---

## Available Scripts

```bash
npm run dev
```

개발 서버를 실행합니다.

```bash
npm run build
```

타입 체크 후 프로덕션 빌드를 실행합니다.

```bash
npm run preview
```

빌드 결과를 로컬에서 미리 확인합니다.

```bash
npm run lint
```

ESLint를 실행합니다.

```bash
npm run format
```

Prettier를 실행합니다.

---

## Environment Variables

`.env.example`을 기준으로 `.env.local` 파일을 만들어 사용합니다.

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_REFRESH_PATH=/auth/reissue
VITE_API_TIMEOUT_MS=10000
VITE_ACCESS_TOKEN_STORAGE_KEY=navi.accessToken
VITE_REFRESH_TOKEN_STORAGE_KEY=navi.refreshToken
VITE_SIGNUP_USE_MOCK=false
VITE_SIGNUP_MOCK_CODE=246810
```

### 배포 환경 예시

```env
VITE_API_BASE_URL=https://campus-navi.com/api/v1
VITE_API_REFRESH_PATH=/auth/reissue
VITE_API_TIMEOUT_MS=10000
VITE_ACCESS_TOKEN_STORAGE_KEY=navi.accessToken
VITE_REFRESH_TOKEN_STORAGE_KEY=navi.refreshToken
VITE_SIGNUP_USE_MOCK=false
VITE_SIGNUP_MOCK_CODE=246810
```

---

## Folder Structure

```text
src
├─ api
│  ├─ client.ts
│  ├─ config.ts
│  ├─ errors.ts
│  ├─ modules
│  └─ types.ts
├─ assets
├─ components
│  └─ ui
├─ features
│  ├─ home
│  ├─ official-posts
│  └─ signup
├─ pages
├─ shared
├─ styles
├─ App.tsx
└─ main.tsx
```

---

## Development Process

이 프로젝트는 Issue 기반 작업 관리와 Pull Request 기반 코드 리뷰 흐름을 따릅니다.

### 기본 흐름

```text
Issue 생성 → Branch 생성 → 개발 → Commit → Pull Request → Review → Merge
```

### 브랜치 규칙

```text
type/short-description-issueNumber
```

예시:

```text
feat/signup-grade-step-58
fix/login-token-refresh-61
task/apply-cta-button-design-49
```

### 커밋 메시지 규칙

```text
type: 작업 내용 (#이슈번호)
```

예시:

```text
feat: 회원가입 학년 선택 단계 추가 (#58)
fix: access token 재발급 응답 처리 수정 (#61)
task: CTA 버튼 디자인 variant 반영 (#49)
```

### PR 규칙

PR 본문에는 관련 이슈를 연결합니다.

```md
Closes #이슈번호
```

---

## Collaboration Guide

프로젝트 협업 규칙은 아래 문서를 참고합니다.

- Git 전략 및 협업 규칙: [docs/git-strategy.md](./docs/git-strategy.md)

---

## Review Checklist

PR 생성 전 아래 항목을 확인합니다.

- [ ] 관련 이슈가 연결되어 있는가
- [ ] 작업 범위가 이슈와 일치하는가
- [ ] 불필요한 파일 변경이 섞이지 않았는가
- [ ] `npm run typecheck` 또는 `npm run build`를 확인했는가
- [ ] `npm run lint`를 확인했는가
- [ ] 주요 사용자 흐름을 수동으로 확인했는가
