# Campus Navi Frontend

대학생 정보 파편화를 해결하는 AI 기반 캠퍼스 네비 서비스의 프론트엔드 레포지토리입니다.

Campus Navi는 대학 공지, 학사 정보, 관심사 기반 추천 흐름을 하나의 서비스 안에서 제공하여 사용자가 필요한 정보를 더 빠르게 발견하고 놓치지 않도록 돕는 것을 목표로 합니다.

---

## 목차

- [Status](#status)
- [Service](#service)
- [주요 기능](#주요-기능)
- [주요 페이지](#주요-페이지)
- [기술 스택](#기술-스택)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [프로젝트 구조](#프로젝트-구조)
- [API 및 인증 기준](#api-및-인증-기준)
- [Routing Policy](#routing-policy)
- [협업 규칙](#협업-규칙)
- [개발 원칙](#개발-원칙)

---

## Status

Campus Navi는 현재 MVP 개발 및 배포 단계에 있습니다.

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
- 로그인 / 로그아웃
- 인증 상태 기반 라우팅 보호

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
- 신청 기간, 마감일, 첨부 정보 확인
- AI 요약 영역 제공

### 맞춤 공지 관심사

- 관심사 선택
- 최소 선택 개수 검증
- 관심사 저장
- 설정 완료 화면 제공

### 카드뉴스

- 카드뉴스 상세 조회
- 슬라이드 / 드래그 기반 탐색

---

## 주요 페이지

| 경로 | 설명 |
| --- | --- |
| `/` | 온보딩 |
| `/login` | 로그인 |
| `/signup` | 회원가입 |
| `/signup/complete` | 회원가입 완료 |
| `/home` | 홈 |
| `/info` | 교내 정보 |
| `/info/search` | 교내 정보 검색 |
| `/info/posts/:postId` | 교내 정보 상세 |
| `/official-posts/:postId` | 공식 공지 상세 |
| `/notice-interests` | 맞춤 공지 관심사 설정 |
| `/notice-interests/complete` | 맞춤 공지 설정 완료 |
| `/card-news/:postId` | 카드뉴스 상세 |

---

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Language | TypeScript |
| Framework | React |
| Build Tool | Vite |
| Routing | React Router |
| Styling | Tailwind CSS |
| Server State | TanStack Query |
| Client State | Zustand |
| HTTP Client | Axios |
| Lint / Format | ESLint, Prettier |

---

## Getting Started

### Requirements

- Node.js 20+
- npm 10+

`.nvmrc`가 있는 경우 해당 버전을 기준으로 실행 환경을 맞춥니다.

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 파일 생성

macOS / Linux:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

### 3. 개발 서버 실행

```bash
npm run dev
```

기본 실행 주소:

```text
http://localhost:5173
```

---

## Environment Variables

환경 변수는 `.env.example`을 기준으로 설정합니다.

| 변수명 | 설명 |
| --- | --- |
| `VITE_API_BASE_URL` | API 서버 기본 주소 |
| `VITE_API_REFRESH_PATH` | access token 재발급 API 경로 |
| `VITE_API_TIMEOUT_MS` | API 요청 timeout |
| `VITE_ACCESS_TOKEN_STORAGE_KEY` | access token 저장 키 |
| `VITE_REFRESH_TOKEN_STORAGE_KEY` | refresh token 저장 키 |
| `VITE_SIGNUP_USE_MOCK` | 회원가입 mock 사용 여부 |
| `VITE_SIGNUP_MOCK_CODE` | mock 인증 코드 |

---

## Scripts

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run typecheck` | TypeScript 타입 검사 |
| `npm run lint` | ESLint 검사 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run format` | 코드 포맷팅 |

PR 생성 전 아래 명령 실행을 권장합니다.

```bash
npm run typecheck
npm run lint
npm run build
```

---

## 프로젝트 구조

```text
src
├─ api
│  ├─ client.ts
│  ├─ config.ts
│  ├─ errors.ts
│  ├─ response.ts
│  └─ modules
├─ components
│  ├─ routing
│  └─ ui
├─ features
│  ├─ home
│  ├─ official-posts
│  └─ signup
├─ pages
├─ shared
│  └─ auth
├─ styles
└─ App.tsx
```

| 경로 | 설명 |
| --- | --- |
| `src/api` | API client, 공통 응답 처리, API 모듈 |
| `src/components/ui` | 공통 UI 컴포넌트 |
| `src/components/routing` | 인증 기반 라우팅 가드 |
| `src/features` | 기능 단위 코드 |
| `src/pages` | 라우트 단위 페이지 |
| `src/shared` | 여러 기능에서 공유하는 로직 |
| `src/styles` | 전역 스타일 |

---

## API 및 인증 기준

API 요청은 `src/api/client.ts`의 Axios 인스턴스를 기준으로 관리합니다.

- 공통 API 설정은 `src/api/config.ts`에서 관리합니다.
- 인증 관련 API는 `src/api/modules/auth.ts`에서 관리합니다.
- access token은 클라이언트 메모리 기반 storage를 통해 관리합니다.
- refresh token은 서버의 HttpOnly cookie 정책을 따릅니다.
- API 응답 검증과 에러 처리는 공통 유틸을 통해 처리합니다.

---

## Routing Policy

### Protected Route

로그인한 사용자만 접근 가능한 페이지는 `ProtectedRoute`로 보호합니다.

예:

- `/home`
- `/info`
- `/notice-interests`
- `/card-news/:postId`

### Public Only Route

로그인하지 않은 사용자만 접근해야 하는 페이지는 `PublicOnlyRoute`로 보호합니다.

예:

- `/`
- `/login`
- `/signup`

로그인 상태에서 public-only 페이지에 접근하면 `/home`으로 이동합니다.

---

## 협업 규칙

자세한 Git / Issue / PR 규칙은 `docs/git-strategy.md`를 기준으로 따릅니다.

기본 흐름:

```text
이슈 생성 → 브랜치 생성 → 개발 → 커밋 → PR → 리뷰 → Merge
```

브랜치 네이밍:

```text
type/short-description-issueNumber
```

커밋 메시지:

```text
type: 작업 내용 (#이슈번호)
```

PR 본문에는 관련 이슈를 연결합니다.

```md
Closes #이슈번호
```

---

## 개발 원칙

- 하나의 PR은 하나의 목적만 가진다.
- 기능 변경과 디자인 변경은 가능한 분리한다.
- 공통 컴포넌트 수정 시 기존 사용처 영향 범위를 확인한다.
- API 연동 작업은 로딩 / 에러 / 빈 상태를 함께 고려한다.
- 인증 흐름 변경 시 로그인 / 로그아웃 / 새로고침 / 뒤로가기 시나리오를 확인한다.
- 브라우저 storage를 다룰 때는 초기화 시점과 사용자 흐름을 명확히 한다.
  
