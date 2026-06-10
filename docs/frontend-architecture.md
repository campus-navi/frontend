# Frontend Architecture

이 문서는 Campus Navi Frontend의 화면 구조와 기능 코드 배치 기준을 정리한다.

기본 방향은 Feature-based Architecture를 유지하면서, 복잡한 화면에는 ViewModel Hook 구조를 적용하는 것이다.

## 1. 핵심 원칙

Campus Navi FE는 다음 흐름을 기준으로 한다.

- Page: 연결
- ViewModel Hook: 상태와 액션 준비
- View: 표시
- Components: 작은 UI 조각

목적은 View 컴포넌트에 복잡한 논리 로직이 들어가지 않도록 하고, 데이터 조회와 화면 상태 계산의 책임을 명확히 분리하는 것이다.

## 2. 전체 폴더 역할

### src/pages

라우팅 entry 역할만 담당한다.

- feature page를 렌더링한다.
- 데이터 조회를 직접 하지 않는다.
- 복잡한 상태 계산을 직접 하지 않는다.
- UI 세부 구현을 직접 갖지 않는다.

### src/features

기능 단위 코드를 모은다.

예시 feature:

- home
- signup
- official-posts
- mypage

각 feature는 필요한 계층만 가진다. 모든 feature가 반드시 pages, view-models, views, components, hooks를 모두 가질 필요는 없다.

### src/components/ui

서비스 전역에서 재사용하는 공통 UI 컴포넌트를 둔다.

예시:

- CtaButton
- BottomSheet
- Modal
- RadioBtn
- RadioChip
- Tags
- AppHeader
- MobileGnb
- LoadingSpinner
- SvgIcon

공통 UI 컴포넌트는 특정 feature의 API 호출, store 접근, 라우팅 정책 판단, 도메인 데이터 해석을 하지 않는다.

### src/api

API client, API module, 응답 normalize, API 공통 타입을 둔다.

현재 프로젝트에서는 API module을 src/api/modules에 유지한다. feature 내부로 API module을 옮기는 것은 별도 구조 개편 이슈에서 판단한다.

## 3. Feature 내부 권장 구조

복잡한 feature는 아래 구조를 권장한다.

- pages
- view-models
- views
- components
- hooks
- constants
- utils
- types.ts

### pages

feature 내부의 화면 연결 지점이다.

- ViewModel Hook을 호출한다.
- ViewModel 결과를 View에 props로 전달한다.
- 직접 UI 세부 구현을 갖지 않는다.

### view-models

View에 필요한 상태와 액션을 준비한다.

담당할 수 있는 책임:

- feature hook 호출
- API query 또는 mutation hook 호출
- fallback 데이터 계산
- loading, error, empty 상태 계산
- 화면 노출 조건 계산
- 이벤트 핸들러 구성
- View에 전달할 props 구성

단, 모든 로직을 ViewModel에 몰아넣지 않는다. 재사용 가능한 순수 계산은 utils로, 재사용 가능한 이벤트 hook은 hooks로 분리한다.

### views

props 기반으로 화면을 렌더링한다.

View가 직접 하지 않는 일:

- useQuery 또는 useMutation 호출
- API hook 호출
- fallback 데이터 생성
- 복잡한 상태 조합
- 라우팅 정책 판단
- 드래그 상태 관리
- 비동기 요청 정합성 판단

View가 할 수 있는 일:

- props 기반 JSX 렌더링
- 단순 조건부 렌더링
- map 기반 리스트 렌더링
- props로 받은 이벤트 핸들러 연결
- className 구성
- 접근성 속성 설정

### components

feature 전용 작은 UI 조각을 둔다.

작은 카드, 리스트 아이템, 섹션 컴포넌트에는 별도 ViewModel을 만들지 않는다.

### hooks

feature에서 재사용되는 hook을 둔다.

예시:

- query hook
- mutation hook
- UI interaction hook
- debounce hook
- timer hook

단일 페이지의 View props를 구성하는 hook은 view-models에 둔다.

### utils

순수 계산 함수를 둔다.

예시:

- 날짜 포맷팅
- 상태 계산
- 데이터 변환
- 조건 판단

React hook이나 컴포넌트 렌더링 책임은 갖지 않는다.

### constants

feature에서 사용하는 상수를 둔다.

예시:

- 탭 목록
- 메뉴 목록
- 옵션 배열
- 고정 문구

## 4. ViewModel Hook 적용 기준

모든 화면에 ViewModel Hook을 강제하지 않는다.

아래 조건 중 2개 이상 해당하면 ViewModel Hook 적용을 검토한다.

- API hook이 있다.
- loading, error, empty 상태가 있다.
- fallback 데이터가 있다.
- 화면 노출 조건 계산이 있다.
- 이벤트 핸들러가 3개 이상이다.
- 하위 컴포넌트가 3개 이상이다.
- 페이지 파일이 150줄에서 200줄 이상이다.
- 드래그, 키보드, 포커스 등 UI interaction 상태가 있다.

## 5. ViewModel Hook을 만들지 않아도 되는 경우

아래 경우에는 별도 ViewModel Hook을 만들지 않는다.

- 단순 버튼 컴포넌트
- 카드 컴포넌트
- 리스트 아이템 컴포넌트
- props만 받아 렌더링하는 컴포넌트
- API 호출이 없는 정적 화면
- 조건부 렌더링이 거의 없는 단순 화면

예시:

- RecentScrapCard
- ScrapFolderRow
- MyPageProfileSummary
- MyPageInfoTags
- CtaButton
- Modal
- BottomSheet

## 6. 마이페이지 적용 예시

마이페이지는 Feature-based + ViewModel Hook 구조를 적용한다.

권장 구조:

- src/features/mypage/pages/MyPagePage.tsx
- src/features/mypage/pages/MyPageScrapsPage.tsx
- src/features/mypage/view-models/useMyPageViewModel.ts
- src/features/mypage/view-models/useMyPageScrapsViewModel.ts
- src/features/mypage/views/MyPageView.tsx
- src/features/mypage/views/MyPageScrapsView.tsx
- src/features/mypage/components/profile
- src/features/mypage/components/summary
- src/features/mypage/components/guide
- src/features/mypage/components/menu
- src/features/mypage/components/scraps
- src/features/mypage/hooks/useMyPageSummary.ts
- src/features/mypage/hooks/useMyPageScraps.ts
- src/features/mypage/types.ts

역할 예시:

### src/pages/MyPage.tsx

라우팅 entry만 담당한다.

### features/mypage/pages/MyPagePage.tsx

useMyPageViewModel을 호출하고 MyPageView에 props를 전달한다.

### features/mypage/view-models/useMyPageViewModel.ts

- summary API hook 호출
- fallback summary 계산
- 관심사 안내 카드 노출 여부 계산
- 관심사 안내 카드 닫기 핸들러 구성
- loading, error 표시 조건 계산

### features/mypage/views/MyPageView.tsx

props 기반으로 화면을 렌더링한다.

## 7. 작업 시 주의사항

구조 정리 작업에서는 아래를 지킨다.

- 신규 기능을 추가하지 않는다.
- 디자인 스타일을 변경하지 않는다.
- API 요청 로직을 변경하지 않는다.
- 라우팅 path를 변경하지 않는다.
- 다른 feature 구조를 한 PR에서 함께 변경하지 않는다.
- import 경로 변경은 작업 feature 범위로 제한한다.

구조 변경 PR은 기능 변경 PR과 분리한다.

## 8. 한 줄 원칙

복잡한 화면은 feature 안에서 Page, ViewModel Hook, View, Components 흐름으로 분리한다.
