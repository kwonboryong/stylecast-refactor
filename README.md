# ⛅ StyleCast – Refactor Edition

로그인·룩북·룩북 상세 핵심 리팩토링 기록 <br/>

### 목적

- 팀 프로젝트 원본을 포크한 뒤, 내가 담당했던 페이지의 성능·접근성·안정성·보안 관점 리팩토링 결과를 정리한다.
- 리팩토링 내역과 Before/After 근거를 남긴다.

<br/>

### 기간

2025.09.04 - 09.09

<br/>

### 담당 범위

- 로그인 페이지
- 룩북 페이지
- 룩북 상세 페이지

<br/>

### 기술 스택

- React, React Router, Vite, SCSS, PocketBase
- 접근성/품질 점검: Lighthouse, axe DevTools
- 상태/성능: useReducer, useCallback, React.lazy, Suspense, Custom Hooks

<br/>

### 측정 기준

- Lighthouse: Performance / Accessibility / SEO
- 핵심 웹 지표: CLS, LCP 등
- axe DevTools: issue 수(Critical/Serious)

<br/>

---

## 핵심 변경 요약

### 로그인(Login)

- **상태 관리**
  - useReducer 도입: 흩어져 있던 상태(email, password, showPassword, warnings, isSubmitting 등)를 하나의 리듀서로 통합
  - useLoginForm 훅으로 분리해 컴포넌트 로직 단순화
- **성능 최적화**
  - 자식 컴포넌트로 내려가는 핸들러(handleEmailChange, handlePasswordChange, handleBlur)에만 useCallback 적용
  - toggleShowPassword는 DOM 직결 이벤트로 이점이 적어 useCallback 제거
- **리다이렉트 UX**
  - getAuthToken 유틸로 인증 체크
  - setTimeout 제거
  - 로그인 상태면 즉시 navigate('/main', { replace: true })로 이동해 히스토리 문제 해결
- **중복 제출 방지**
  - isSubmitting 가드, try/finally 패턴으로 상태 복구 보장
  - 버튼 disabled와 라벨(“로그인 중…”)로 사용자 피드백 제공
  - 폼 aria-busy 적용

<br/>

### 룩북(LookBook)

- **UI/로직 분리**
  - WeatherIcon, RefreshButton 분리
  - 새로고침 비즈니스 로직은 useRefresh 훅으로 이동(의존성 배열 관리 포함).
- **계절 판별 훅**: useSeason 훅으로 월/기온→계절 로직을 분리
- **코드 스플리팅**
  - LookBookSwiper를 React.lazy + Suspense로 지연 로딩. 상단 텍스트/버튼은 먼저 표시, 스와이퍼는 뒤따라 로드
  - Suspense fallback에 aria-live="polite"로 접근성 강화
- **안전성**
  - localStorage JSON.parse 가드
  - Swiper ref 접근은 옵셔널 체이닝
- **접근성 개선**: 아이콘 버튼에 aria-label과 title 부여, 아이콘은 aria-hidden 처리

<br/>

### 룩북 상세(LookBook Detail)

- **접근성/시맨틱**
  - 버튼에 aria-label 및 title 속성 추가
  - 페이지 헤딩을 h2 → h1로 수정
- **구조 정리**
  - 날씨 아이콘 로직을 커스텀 훅으로 분리
  - 날씨 아이콘 전용 UI 컴포넌트 적용

<br/>

---

## Before / After 지표

(범위: 룩북 페이지)

**Lighthouse Performance: 100 (유지)**

- 스와이퍼 지연 로딩(React.lazy+Suspense)로 초기 번들 부담 완화, Above-the-fold 텍스트·버튼 우선 페인트
<p align="center">
  <img src="https://github.com/user-attachments/assets/08d4d867-8bb7-49cf-b482-094350581966" alt="룩북 퍼포먼스 점수" width="49%" />
  <img src="https://github.com/user-attachments/assets/8a3144ac-4534-4f72-bdf3-d1daa7bacb68" alt="룩북 퍼포먼스 상세 점수" width="49%" />
</p>

<br/>

**Lighthouse Accessibility: 89 → 96 (+7)**

- 아이콘 버튼 aria-label/title, aria-live 로딩 알림, 아이콘 aria-hidden 적용
  <img src="https://github.com/user-attachments/assets/ea249225-ad1a-4011-b9e7-42d578221886" alt="룩북 스크린샷 A" width="900">

<br/>

**axe DevTools Critical: 3건 → 0건**

- Accessible Name 누락 해결(아이콘 버튼 라벨), 나머지 Color Contrast는 디자인 협의 과제로 분리
  <img width="900" alt="룩북 - 접근성 axe 이슈 개선" src="https://github.com/user-attachments/assets/aa1e215f-6209-4954-ae6b-1ada62ee4a41" />

<br/>

---

### Changelog

- 2025-09-08
  - Merged
    - PR #4: 룩북/상세/로그인 전반 리팩토링(커스텀 훅 분리, 성능 최적화, 접근성 개선)
  - Changed
    - \[login] handleBlur, toggleShowPassword에 useCallback 적용 후, toggleShowPassword는 DOM 직결 이벤트라 이점 미미하여 useCallback 제거
    - \[login] pb.authStore.save 설정 코드 분리
    - \[login] 로그인 페이지 Helmet 주소(메타/캐노니컬) 수정
    - \[lookbook] 컴포넌트 파일명 PascalCase로 정리
    - \[lookbook] 메타 링크를 /lookbook으로 수정, Suspense 로딩 영역에 aria-live 추가
    - \[lookbook] 날씨 아이콘 로직 커스텀 훅 분리 및 useMemo 적용(파일명 변경에 따른 경로 업데이트 포함)
    - \[lookbook] 계절 판별 로직을 커스텀 훅(useSeason)으로 분리
    - \[lookbook-detail] 버튼 aria-label/title 추가, 페이지 헤딩 h2 → h1
    - \[lookbook-detail] 날씨 아이콘 커스텀 훅 적용 및 전용 UI 컴포넌트 사용
- 2025-09-05
  - Merged
    - PR #3: Refactor/lookbook
  - Added
    - \[lookbook] LookBookSwiper를 별도 컴포넌트로 분리
  - Changed
    - \[lookbook] 스와이퍼 첫 슬라이드 LCP 설정 → 후속 커밋에서 설정 제거(최종적으로 LCP 지정 해제)
    - \[lookbook] 접근성 보강: 시맨틱 태그 적용, aria-label 추가, button type 명시
    - \[lookbook] 아이콘 aria-hidden 추가(스크린리더 중복 읽기 방지)
  - Fixed
    - \[lookbook] 파일명 대문자 변경에 따른 경로 업데이트
- 2025-09-04
  - Merged
    - PR #2: 로그인 페이지 최적화(입력 함수 useCallback, 즉시 리다이렉트, 중복 제출 방지)
    - PR #1: 로그인 페이지 useState → useReducer 통합 & useLoginForm 훅 분리
  - Added
    - \[lookbook] 새로고침 버튼 UI 컴포넌트 분리
    - \[lookbook] 날씨 아이콘 UI 컴포넌트 분리
    - \[lookbook] 기존 새로고침 로직을 커스텀 훅(useRefresh)으로 분리
  - Changed
    - \[login] 인증 체크 로직 유틸로 분리(getAuthToken), navigate(..., { replace: true }) 적용
    - \[login] 2초 지연 제거에 따라 redirecting 상태 및 조건부 렌더링 제거
    - \[login] 로그인 관련 입력 핸들러에 useCallback 적용
    - \[login] LoginPage의 기존 state들을 useReducer를 사용하여 정리 및 커스텀 훅으로 분리
    - \[login] useLoginForm으로 커스텀 훅 분리로 인한 기존 state 및 set 함수 수정
  - Updated
    - \[infra] npm 업데이트

<br/>

### Credits

본 리포지토리는 원본 StyleCast 팀 프로젝트를 바탕으로 리팩토링 내용을 정리한 저장소입니다. <br/>
팀 프로젝트 소개/구현 내용은 원문 README를 참고해 주세요. <br/>
StyleCast: https://github.com/FRONTENDSCHOOL10/Topten

<br/><br/>
<br/>
