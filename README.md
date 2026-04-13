# campus-navi-frontend
대학생 정보 파편화를 해결하는 AI 기반 캠퍼스 네비 서비스 프론트엔드

## Tech Stack
- Vite
- React
- TypeScript
- react-router-dom
- Tailwind CSS
- ESLint / Prettier

## Getting Started
```bash
npm install
npm run dev
```

기본 개발 서버는 보통 `http://localhost:5173` 에서 실행됩니다.

## Available Scripts
- `npm run dev`: 개발 서버 실행
- `npm run build`: 타입 체크 후 프로덕션 빌드
- `npm run preview`: 빌드 결과 미리보기
- `npm run lint`: ESLint 실행
- `npm run format`: Prettier 실행

## Folder Structure
```text
src
├─ assets
├─ components
├─ pages
├─ styles
├─ App.tsx
└─ main.tsx
```

## Environment Variables
`.env.example`을 기준으로 `.env.local` 파일을 만들어 사용합니다.

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Frontend Starter
```

## Collaboration Guide
프로젝트 협업 규칙은 아래 문서를 참고해주세요.

- Git 전략 및 협업 규칙: [docs/git-strategy.md](./docs/git-strategy.md)
