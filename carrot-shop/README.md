# Carrot Shop

당근마켓 스타일의 중고거래 플랫폼입니다.

## Supabase 설정

이 프로젝트는 Supabase를 백엔드로 사용합니다.

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://terrepndmyhvbbghxwbt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcnJlcG5kbXlodmJiZ2h4d2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTU4NzAsImV4cCI6MjA2ODg5MTg3MH0.Zw0d7IFTDLqnNnEg6Wt8qynkLxeZFNxh3-aogkAXRPs
```

### 2. Supabase 클라이언트 사용법

#### 기본 사용법
```javascript
import { supabase, supabaseUtils } from '@/lib/supabase'

// 직접 Supabase 클라이언트 사용
const { data, error } = await supabase
  .from('products')
  .select('*')

// 유틸리티 함수 사용 (권장)
const products = await supabaseUtils.products.getAll()
```

#### 상품 관련 API
```javascript
// 모든 상품 조회
const products = await supabaseUtils.products.getAll()

// 특정 상품 조회
const product = await supabaseUtils.products.getById(1)

// 상품 추가
const newProduct = await supabaseUtils.products.create({
  title: '새 상품',
  description: '상품 설명',
  price: 50000,
  category: '디지털기기'
})

// 상품 수정
const updatedProduct = await supabaseUtils.products.update(1, {
  price: 45000
})

// 상품 삭제
await supabaseUtils.products.delete(1)

// 카테고리별 조회
const products = await supabaseUtils.products.getByCategory('디지털기기')

// 검색
const products = await supabaseUtils.products.search('아이폰')
```

#### 사용자 인증 API
```javascript
// 회원가입
const { user } = await supabaseUtils.users.signUp(
  'user@example.com', 
  'password',
  { name: '사용자명' }
)

// 로그인
const { user } = await supabaseUtils.users.signIn('user@example.com', 'password')

// 현재 사용자 조회
const user = await supabaseUtils.users.getCurrentUser()

// 로그아웃
await supabaseUtils.users.signOut()
```

#### 실시간 구독
```javascript
// 상품 변경사항 실시간 구독
const subscription = supabaseUtils.subscriptions.subscribeToProducts((payload) => {
  console.log('상품 변경:', payload)
})

// 채팅 메시지 실시간 구독
const chatSubscription = supabaseUtils.subscriptions.subscribeToChat(chatId, (payload) => {
  console.log('새 메시지:', payload)
})

// 구독 해제
subscription.unsubscribe()
```

### 3. Supabase 데이터베이스 스키마 예시

상품 테이블 (products):
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category TEXT,
  image_url TEXT,
  seller_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. 실행

```bash
npm install
npm run dev
```

## 기능

- 상품 등록/수정/삭제
- 상품 검색 및 필터링
- 카테고리별 상품 보기
- 실시간 채팅
- 사용자 인증
- 이미지 업로드

## 기술 스택

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, 실시간 기능, 인증)
- **배포**: Vercel (권장)

## 컴포넌트 구조

```
src/app/
├── components/
│   ├── Header.jsx
│   ├── ProductCard.jsx
│   ├── MannerTemperature.jsx
│   └── SupabaseExample.jsx    # Supabase 사용 예시
├── lib/
│   └── supabase.js            # Supabase 클라이언트 설정
└── data/
    └── products.js            # 임시 데이터 (개발용)
```
