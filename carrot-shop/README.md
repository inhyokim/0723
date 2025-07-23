# 🥕 당근마켓 클론 - Carrot Shop

> **나눔문화와 매너온도 시스템이 있는 중고거래 플랫폼**

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ 주요 기능

### 🛍️ 상품 관리
- **3단계 폼 시스템**: 기본정보 → 상세정보 → 최종확인
- **실시간 미리보기**: 입력과 동시에 결과 확인
- **상품 등록/조회/수정**: 완전한 CRUD 기능

### 🔍 검색 & 필터링
- **통합 검색**: 상품명, 설명, 카테고리, 지역 검색
- **카테고리 필터링**: 20개+ 카테고리 지원
- **URL 공유**: 검색 결과와 필터 상태 URL로 공유 가능

### 🔥 고급 기능
- **🥕 나눔 시스템**: 따뜻한 나눔 문화 구현
- **💰 가격 제안 시스템**: 유연한 거래 협상
- **🌡️ 매너온도**: 별점을 온도로 변환, 캐릭터 표정 변화
- **📸 이미지 업로드**: 파일 업로드 및 URL 입력 지원
- **💾 영구 저장**: LocalStorage 기반 데이터 영속성

## 🛠️ 기술 스택

### Frontend
- **⚛️ React 19**: 최신 React 기능 활용
- **🚀 Next.js 15**: App Router, Turbopack 적용
- **🎨 Tailwind CSS**: 반응형 디자인 시스템
- **🪝 React Hooks**: 상태 관리 및 URL 상태 관리

### UI/UX
- **🎯 당근마켓 디자인 시스템**: 완벽한 UI 구현
- **🌈 컬러 시스템**: 
  - 나눔: 초록색 (#10B981)
  - 가격 제안: 파란색 (#3B82F6)  
  - 일반 거래: 주황색 (#FF6B35)
- **🎪 마이크로 인터랙션**: 부드러운 애니메이션
- **📱 모바일 최적화**: 터치 친화적 인터페이스

## 🚀 설치 및 실행

### 1. 프로젝트 클론
\`\`\`bash
git clone [repository-url]
cd carrot-shop
\`\`\`

### 2. 의존성 설치
\`\`\`bash
npm install
# 또는
yarn install
# 또는
pnpm install
\`\`\`

### 3. 개발 서버 실행
\`\`\`bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
\`\`\`

### 4. 브라우저에서 확인
[http://localhost:3000](http://localhost:3000)에서 결과를 확인하세요.

## 📁 프로젝트 구조

\`\`\`
src/
├── app/
│   ├── api/
│   │   └── products/          # 상품 API 엔드포인트
│   ├── components/
│   │   ├── Header.jsx         # 네비게이션 헤더
│   │   ├── MannerTemperature.jsx  # 매너온도 컴포넌트
│   │   └── productCard.jsx    # 상품 카드 컴포넌트
│   ├── data/
│   │   └── products.js        # 상품 데이터
│   ├── products/
│   │   ├── [id]/
│   │   │   └── page.jsx       # 상품 상세 페이지
│   │   └── page.jsx           # 상품 목록 페이지
│   ├── sell/
│   │   └── page.jsx           # 상품 판매 등록 페이지
│   ├── globals.css            # 글로벌 스타일
│   ├── layout.js              # 레이아웃 컴포넌트
│   └── page.js                # 홈 페이지
\`\`\`

## 🎯 주요 페이지

- **🏠 홈페이지** (`/`): 최신 상품 및 나눔 아이템 표시
- **🛍️ 상품 목록** (`/products`): 전체 상품 검색 및 필터링
- **📋 상품 상세** (`/products/[id]`): 상품 상세 정보 및 가격 제안
- **📝 상품 등록** (`/sell`): 3단계 상품 등록 프로세스

## 🌡️ 매너온도 시스템

매너온도는 사용자의 거래 매너를 나타내는 독특한 시스템입니다:

- **36.5°C**: 기본 온도 (😐)
- **37°C 이상**: 따뜻한 사용자 (😊)
- **40°C 이상**: 매우 매너 좋은 사용자 (😄)
- **36°C 미만**: 주의가 필요한 사용자 (😟)

## 🥕 나눔 문화

당근마켓의 특별한 나눔 문화를 구현했습니다:
- 무료 나눔 상품 별도 표시
- 나눔 전용 카테고리 및 필터
- 따뜻한 나눔 메시지 시스템

## 📱 반응형 디자인

모든 화면 크기에서 최적화된 경험을 제공합니다:
- **📱 모바일**: 터치 최적화, 하단 네비게이션
- **💻 태블릿**: 그리드 레이아웃 조정
- **🖥️ 데스크톱**: 넓은 화면 활용

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요.

---

**Made with ❤️ by [Your Name] - 따뜻한 나눔문화를 만들어가는 당근마켓 클론**
