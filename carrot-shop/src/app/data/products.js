// 공통 상품 데이터 - 모든 페이지에서 사용
export const sampleProducts = [
  // 🥕 나눔 상품들
  { 
    id: 101, 
    title: '🥕 아이 옷 나눔 (90-100 사이즈)', 
    desc: '아이가 커서 입지 못하는 옷들 나눔해요! 총 15벌 정도 있고 모두 깨끗하게 세탁해서 보관중이에요. 브랜드는 자라키즈, 유니클로 등 좋은 브랜드들입니다. 정말 예쁜 옷들이라 버리기 아까워서 필요한 분께 나눔하고 싶어요. 택배비만 부담해주시면 됩니다!', 
    price: 0, 
    isFree: true,
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400',
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400',
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400'
    ],
    status: '판매중',
    location: '서울시 송파구',
    createdAt: '방금 전',
    likes: 28,
    chats: 12,
    views: 89,
    category: '유아동',
    condition: 'good',
    seller: {
      id: 201,
      name: '따뜻한엄마',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      rating: 4.9,
      reviewCount: 34,
      responseRate: '100%',
      responseTime: '보통 30분 이내'
    },
    specifications: [
      { label: '카테고리', value: '유아동 의류' },
      { label: '사이즈', value: '90-100' },
      { label: '수량', value: '약 15벌' },
      { label: '브랜드', value: '자라키즈, 유니클로 등' },
      { label: '상태', value: '깨끗함 (세탁완료)' },
      { label: '거래방식', value: '나눔 (택배비만 부담)' },
      { label: '특이사항', value: '모두 아이가 직접 착용했던 옷' }
    ]
  },
  { 
    id: 102, 
    title: '🥕 화분 다양하게 나눔해요', 
    desc: '베란다 정리하면서 키우던 식물들 나눔합니다! 스킨답서스, 몬스테라, 산세베리아 등 10여개 정도 되는 것 같아요. 모두 건강하게 잘 자라고 있고, 화분과 함께 드립니다. 식물 키우기 좋아하시는 분께 예쁘게 키워주셨으면 좋겠어요. 직접 와서 가져가실 분만 연락주세요!', 
    price: 0, 
    isFree: true,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400'
    ],
    status: '판매중',
    location: '서울시 관악구',
    createdAt: '5분 전',
    likes: 43,
    chats: 18,
    views: 156,
    category: '식물',
    condition: 'good',
    seller: {
      id: 202,
      name: '식물러버',
      profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
      rating: 4.8,
      reviewCount: 19,
      responseRate: '96%',
      responseTime: '보통 1시간 이내'
    },
    specifications: [
      { label: '카테고리', value: '식물' },
      { label: '종류', value: '관엽식물 (스킨답서스, 몬스테라 등)' },
      { label: '수량', value: '약 10개' },
      { label: '화분', value: '포함' },
      { label: '상태', value: '건강함' },
      { label: '거래방식', value: '나눔 (직거래만)' },
      { label: '거래장소', value: '관악구 신림동 인근' }
    ]
  },
  { 
    id: 103, 
    title: '🥕 중고 책들 나눔 (소설, 에세이)', 
    desc: '이사 정리하면서 읽었던 책들 나눔해요! 베스트셀러 소설들과 에세이 위주로 50권 정도 있습니다. 모두 한 번씩 읽었지만 상태는 깨끗해요. 책 좋아하시는 분께 도움이 되었으면 좋겠어요. 전체를 한 번에 가져가실 분을 찾습니다. 무겁기 때문에 직접 가져가실 수 있는 분만 연락주세요!', 
    price: 0, 
    isFree: true,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1544716278-e513176f20a5?w=400'
    ],
    status: '판매중',
    location: '서울시 영등포구',
    createdAt: '15분 전',
    likes: 67,
    chats: 23,
    views: 234,
    category: '도서',
    condition: 'good',
    seller: {
      id: 203,
      name: '책벌레',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 4.7,
      reviewCount: 12,
      responseRate: '92%',
      responseTime: '보통 2시간 이내'
    },
    specifications: [
      { label: '카테고리', value: '도서' },
      { label: '장르', value: '소설, 에세이' },
      { label: '수량', value: '약 50권' },
      { label: '상태', value: '읽은 흔적 있지만 깨끗함' },
      { label: '작가', value: '베스트셀러 작가들 위주' },
      { label: '거래방식', value: '나눔 (직거래만)' },
      { label: '참고사항', value: '전체 일괄 나눔만 가능' }
    ]
  },
  
  // 💰 가격제안만 받기 상품들
  
  { 
    id: 202, 
    title: '💰 손으로 만든 도예 작품들 (제안주세요)', 
    desc: '도예 취미로 만든 작품들이에요. 접시, 컵, 화분 등 다양하게 있습니다. 전문가가 아니라서 정확한 가격을 매기기 어려워서 관심있으신 분들이 제안해주시면 검토해보겠습니다. 손으로 직접 만든 것이라 완벽하지는 않지만 나름 정성을 들여 만들었어요. 도예에 관심있으신 분이나 독특한 그릇을 찾으시는 분께 추천드려요.', 
    price: null, 
    acceptOffersOnly: true,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
      'https://images.unsplash.com/photo-1594736797933-d0b22dc7f08c?w=400'
    ],
    status: '판매중',
    location: '서울시 성북구',
    createdAt: '1시간 전',
    likes: 19,
    chats: 5,
    views: 78,
    category: '생활/주방',
    condition: 'new',
    seller: {
      name: '도예애호가',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b60b6cd5?w=100',
      rating: 4.9,
      reviewCount: 28,
      responseRate: '100%',
      responseTime: '보통 1시간 이내'
    },
    specifications: [
      { label: '카테고리', value: '도예 작품' },
      { label: '종류', value: '접시, 컵, 화분 등' },
      { label: '제작', value: '핸드메이드' },
      { label: '상태', value: '새상품 (직접 제작)' },
      { label: '수량', value: '다양한 작품 여러개' },
      { label: '거래방식', value: '가격제안만' },
      { label: '특징', value: '유니크한 디자인' }
    ]
  },

  // 기존 일반 상품들
  { 
    id: 1, 
    title: '아이폰 14 Pro 128GB', 
    desc: '깨끗하게 사용했습니다. 케이스, 필름 부착상태로 판매해요! 구매한지 1년 정도 되었고, 떨어뜨린 적 없어서 흠집 거의 없습니다. 배터리 최대 용량도 89%로 양호해요. 정품 인증서와 구매 영수증도 함께 드립니다.', 
    price: 950000, 
    originalPrice: 1290000,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400'
    ],
    status: '판매중',
    location: '서울시 강남구',
    createdAt: '2분 전',
    likes: 12,
    chats: 3,
    views: 156,
    category: '디지털기기',
    condition: 'good',
    seller: {
      id: 101,
      name: '당근이',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 4.8,
      reviewCount: 23,
      responseRate: '95%',
      responseTime: '보통 1시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Apple' },
      { label: '모델명', value: 'iPhone 14 Pro' },
      { label: '용량', value: '128GB' },
      { label: '색상', value: '딥 퍼플' },
      { label: '상태', value: '중고 (상태 좋음)' },
      { label: '구매일', value: '2023년 1월' },
      { label: '배터리 상태', value: '89%' }
    ]
  },
  { 
    id: 2, 
    title: '맥북 프로 13인치 2022 M2', 
    desc: 'M2 칩셋, 512GB. 개발용으로 사용했고 상태 매우 좋습니다. 원래 포장 박스와 충전기 모두 포함이에요. 개발 작업용으로 구매했는데 새로운 맥북으로 업그레이드하면서 판매합니다. 사용 흔적 거의 없고 키보드도 깨끗해요.', 
    price: 1200000, 
    originalPrice: 1690000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'
    ],
    status: '판매중',
    location: '서울시 서초구',
    createdAt: '10분 전',
    likes: 8,
    chats: 1,
    views: 89,
    category: '디지털기기',
    condition: 'like-new',
    seller: {
      id: 102,
      name: '개발자김',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 4.9,
      reviewCount: 45,
      responseRate: '98%',
      responseTime: '보통 30분 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Apple' },
      { label: '모델명', value: 'MacBook Pro 13' },
      { label: '프로세서', value: 'M2 칩' },
      { label: '메모리', value: '8GB' },
      { label: '저장용량', value: '512GB SSD' },
      { label: '화면크기', value: '13.3인치' },
      { label: '배터리 사이클', value: '147회' }
    ]
  },
  { 
    id: 3, 
    title: '나이키 에어맥스 270 (270mm)', 
    desc: '3번 착용한 거의 새상품입니다. 박스 포함이에요. 정품 인증서도 있습니다. 발이 커져서 더 이상 신을 수 없어서 판매합니다. 실제로는 거의 신지 않아서 굽도 거의 닳지 않았어요. 운동화 수집하시는 분께 추천드립니다.', 
    price: 80000, 
    originalPrice: 149000,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400'
    ],
    status: '예약중',
    location: '서울시 마포구',
    createdAt: '1시간 전',
    likes: 24,
    chats: 8,
    views: 127,
    category: '패션의류',
    condition: 'like-new',
    seller: {
      name: '신발수집가',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b60b6cd5?w=100',
      rating: 4.6,
      reviewCount: 31,
      responseRate: '90%',
      responseTime: '보통 2시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Nike' },
      { label: '모델명', value: 'Air Max 270' },
      { label: '사이즈', value: '270mm (US 9)' },
      { label: '색상', value: '블랙/화이트' },
      { label: '상태', value: '거의 새상품' },
      { label: '구매일', value: '2024년 10월' }
    ]
  },
  { 
    id: 4, 
    title: '다이슨 V11 무선청소기', 
    desc: '1년 사용, A/S 받아서 깨끗합니다. 헤드 3개 포함해서 판매해요. 매뉴얼도 있습니다. 흡입력 여전히 강하고 배터리도 30분 정도 사용 가능해요. 이사가면서 새 청소기 구매해서 판매합니다. 정말 좋은 제품이라 아쉽지만 내놓게 되었네요.', 
    price: 200000, 
    originalPrice: 799000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=400'
    ],
    status: '판매중',
    location: '서울시 송파구',
    createdAt: '3시간 전',
    likes: 15,
    chats: 5,
    views: 98,
    category: '생활가전',
    condition: 'good',
    seller: {
      name: '깔끔한집',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      rating: 4.7,
      reviewCount: 28,
      responseRate: '92%',
      responseTime: '보통 1시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Dyson' },
      { label: '모델명', value: 'V11 Absolute' },
      { label: '배터리 수명', value: '최대 60분' },
      { label: '충전 시간', value: '3.5시간' },
      { label: '헤드 개수', value: '3개' },
      { label: 'A/S 이력', value: '2024년 5월 (필터 교체)' }
    ]
  },
  { 
    id: 5, 
    title: '아이패드 에어 5세대 와이파이 64GB', 
    desc: '케이스와 필름 부착상태로 판매합니다. 충전기 포함이에요. 학업용으로 사용했습니다. 노트 필기하고 PDF 보는 용도로만 사용해서 상태 매우 좋아요. 이번에 프로 모델로 업그레이드하면서 판매합니다. 학생분들께 추천드려요.', 
    price: 500000, 
    originalPrice: 779000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '1일 전',
    likes: 6,
    chats: 2,
    views: 67,
    category: '디지털기기',
    condition: 'good',
    seller: {
      name: '대학생',
      profileImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
      rating: 4.5,
      reviewCount: 12,
      responseRate: '85%',
      responseTime: '보통 3시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Apple' },
      { label: '모델명', value: 'iPad Air 5세대' },
      { label: '저장용량', value: '64GB' },
      { label: '연결방식', value: 'Wi-Fi' },
      { label: '색상', value: '스페이스 그레이' },
      { label: '화면크기', value: '10.9인치' }
    ]
  },
  { 
    id: 6, 
    title: '플레이스테이션 5 + 컨트롤러 2개', 
    desc: '게임 3개 포함해서 판매합니다. 구매한지 6개월. 박스 포함 풀구성입니다. 포함 게임은 스파이더맨, FIFA24, 갓 오브 워입니다. 취직하면서 게임할 시간이 없어서 아쉽지만 판매해요. 게임 좋아하시는 분께 잘 쓰였으면 좋겠어요.', 
    price: 450000, 
    originalPrice: 650000,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400'
    ],
    status: '완료',
    location: '서울시 영등포구',
    createdAt: '2일 전',
    likes: 31,
    chats: 12,
    views: 203,
    category: '취미게임',
    condition: 'good',
    seller: {
      name: '게이머였던자',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      rating: 4.8,
      reviewCount: 34,
      responseRate: '96%',
      responseTime: '보통 1시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Sony' },
      { label: '모델명', value: 'PlayStation 5' },
      { label: '저장용량', value: '825GB SSD' },
      { label: '컨트롤러', value: '듀얼센스 2개' },
      { label: '포함 게임', value: '3개 (스파이더맨, FIFA24, 갓 오브 워)' },
      { label: '구성품', value: '본체, 컨트롤러 2개, 케이블, 박스' }
    ]
  },
  { 
    id: 7, 
    title: 'USB-C to HDMI 어댑터 (미사용)', 
    desc: '미개봉 새상품입니다. 선물로 받았는데 사용할 일이 없어서 판매해요. 맥북이나 노트북 외부 모니터 연결할 때 쓰시면 됩니다. 4K 지원하고 브랜드는 유명한 곳 제품이라 품질 좋아요. 포장 그대로 드립니다.', 
    price: 5000, 
    originalPrice: 15000,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '30분 전',
    likes: 3,
    chats: 1,
    views: 23,
    category: '디지털기기',
    condition: 'new',
    seller: {
      name: '미니멀라이프',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b60b6cd5?w=100',
      rating: 4.3,
      reviewCount: 8,
      responseRate: '80%',
      responseTime: '보통 4시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Anker' },
      { label: '연결 방식', value: 'USB-C to HDMI' },
      { label: '지원 해상도', value: '4K@60Hz' },
      { label: '상태', value: '미개봉 새상품' },
      { label: '호환성', value: 'MacBook, Surface, 갤럭시북 등' }
    ]
  },
  { 
    id: 8, 
    title: '체리 G80-3000S TKL RGB 키보드 갈축', 
    desc: '게이밍용으로 구매했는데 직장에서 사용하기엔 소음이 있어서 판매합니다. 상태 좋아요. 갈축이라 타건감 좋고 RGB 백라이트도 예쁩니다. 프로그래머나 게이머분들께 추천드려요. 박스와 설명서 모두 포함입니다.', 
    price: 40000, 
    originalPrice: 85000,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '2시간 전',
    likes: 7,
    chats: 2,
    views: 45,
    category: '디지털기기',
    condition: 'good',
    seller: {
      name: '조용한개발자',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 4.6,
      reviewCount: 19,
      responseRate: '88%',
      responseTime: '보통 2시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Cherry' },
      { label: '모델명', value: 'G80-3000S TKL' },
      { label: '스위치', value: 'Cherry MX Brown (갈축)' },
      { label: '배열', value: '텐키리스 (87키)' },
      { label: '백라이트', value: 'RGB' },
      { label: '연결 방식', value: 'USB 유선' }
    ]
  },
  { 
    id: 9, 
    title: '아이폰 16 프로맥스 512GB S급 풀박스', 
    desc: '최신 출시작입니다. 사용기간 1주일 미만. 충동구매 후 판매합니다. 풀박스 구성품 모두 포함되어 있고, 보호필름과 케이스 부착 상태입니다. 거의 새상품 수준이에요. 색상은 타이타늄 블랙이고 정말 예쁩니다. 애플케어+ 미가입 상태입니다.', 
    price: 1690000, 
    originalPrice: 1950000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '1시간 전',
    likes: 45,
    chats: 18,
    views: 234,
    category: '디지털기기',
    condition: 'like-new',
    seller: {
      name: '최신폰매니아',
      profileImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
      rating: 4.7,
      reviewCount: 18,
      responseRate: '92%',
      responseTime: '보통 2시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Apple' },
      { label: '모델명', value: 'iPhone 16 Pro Max' },
      { label: '용량', value: '512GB' },
      { label: '색상', value: '타이타늄 블랙' },
      { label: '상태', value: '최상급 (거의 새상품)' },
      { label: '구매일', value: '2024년 12월' },
      { label: '배터리 상태', value: '100%' }
    ]
  },
  { 
    id: 10, 
    title: '메타 퀘스트2 128GB 악세서리 포함', 
    desc: 'VR게임용으로 구매했는데 사용 빈도가 낮아서 판매합니다. 전용 케이스와 추가 스트랩 포함. 오큘러스 링크 케이블도 함께 드려요. Beat Saber 게임도 계정에 포함돼있습니다. VR 입문용으로 최고예요. 어지럼증 때문에 못하게 되어서 판매합니다.', 
    price: 180000, 
    originalPrice: 399000,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400',
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '5시간 전',
    likes: 12,
    chats: 4,
    views: 78,
    category: '취미게임',
    condition: 'good',
    seller: {
      name: 'VR초보',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 4.4,
      reviewCount: 6,
      responseRate: '75%',
      responseTime: '보통 5시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Meta (Oculus)' },
      { label: '모델명', value: 'Quest 2' },
      { label: '저장용량', value: '128GB' },
      { label: '악세서리', value: '전용 케이스, 추가 스트랩, 링크 케이블' },
      { label: '포함 게임', value: 'Beat Saber 등' },
      { label: '배터리 수명', value: '2-3시간' }
    ]
  },
  // 나머지 18개 상품 (11-28번)
  { 
    id: 11, 
    title: 'HP Victus 게이밍 노트북 (미개봉)', 
    desc: '선물받았는데 이미 노트북이 있어서 미개봉 상태로 판매합니다. RTX 3060 탑재 모델입니다. 15-fa2710TX 모델이고 게이밍 성능 우수합니다. 완전 새상품이에요. 보증서 및 구성품 모두 포함되어 있습니다.', 
    price: 750000, 
    originalPrice: 1200000,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '3시간 전',
    likes: 28,
    chats: 9,
    views: 178,
    category: '디지털기기',
    condition: 'new',
    seller: {
      name: '게이머박',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      rating: 4.6,
      reviewCount: 32,
      responseRate: '88%',
      responseTime: '보통 3시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'HP' },
      { label: '모델명', value: 'Victus 15-fa2710TX' },
      { label: 'CPU', value: 'Intel i5-12450H' },
      { label: 'GPU', value: 'RTX 3060' },
      { label: '메모리', value: '16GB DDR4' },
      { label: '저장용량', value: '512GB NVMe SSD' },
      { label: '화면', value: '15.6인치 144Hz' }
    ]
  },
  { 
    id: 12, 
    title: '레노버 ideapad Slim1 라이젠3 노트북', 
    desc: '사무용으로 구매했는데 업그레이드하면서 판매합니다. 배터리 상태 양호해요. 문서 작업, 인터넷 서핑용으로 완벽합니다. 가성비 좋은 노트북 찾으시는 분께 추천드려요. 충전기 포함입니다.', 
    price: 320000, 
    originalPrice: 599000,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '1일 전',
    likes: 15,
    chats: 6,
    views: 89,
    category: '디지털기기',
    condition: 'good',
    seller: {
      name: '사무직직장인',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 4.4,
      reviewCount: 16,
      responseRate: '85%',
      responseTime: '보통 4시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Lenovo' },
      { label: '모델명', value: 'IdeaPad Slim 1' },
      { label: 'CPU', value: 'AMD Ryzen 3' },
      { label: '메모리', value: '8GB' },
      { label: '저장용량', value: '256GB SSD' },
      { label: '화면', value: '14인치 FHD' }
    ]
  },
  { 
    id: 13, 
    title: '삼성 블루투스 키보드', 
    desc: '태블릿용으로 구매했는데 사용 빈도가 낮아서 판매합니다. 충전케이블 포함. 타건감 좋고 연결도 안정적이에요. 아이패드나 갤럭시탭과 호환성 좋습니다. 거의 새상품 수준입니다.', 
    price: 18000, 
    originalPrice: 49000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '4시간 전',
    likes: 8,
    chats: 3,
    views: 34,
    category: '디지털기기',
    condition: 'like-new',
    seller: {
      name: '태블릿유저',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b60b6cd5?w=100',
      rating: 4.2,
      reviewCount: 9,
      responseRate: '78%',
      responseTime: '보통 6시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Samsung' },
      { label: '연결방식', value: 'Bluetooth 5.0' },
      { label: '배터리', value: '충전식 (USB-C)' },
      { label: '호환성', value: 'iOS, Android, Windows' },
      { label: '색상', value: '화이트' }
    ]
  },
  { 
    id: 14, 
    title: '무아스 네스트 Qi 무선충전 알람시계 (미개봉)', 
    desc: '선물용으로 구매했는데 중복되어서 판매합니다. 미개봉 새상품이에요. 무선충전과 알람시계가 합쳐진 제품으로 침실용으로 좋아요. 아이폰 무선충전 지원합니다.', 
    price: 20000, 
    originalPrice: 59000,
    image: 'https://images.unsplash.com/photo-1594736797933-d0bba5b8baeb?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594736797933-d0bba5b8baeb?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '2시간 전',
    likes: 5,
    chats: 2,
    views: 28,
    category: '디지털기기',
    condition: 'new',
    seller: {
      name: '깔끔한방',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      rating: 4.1,
      reviewCount: 7,
      responseRate: '72%',
      responseTime: '보통 8시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'MUAS' },
      { label: '기능', value: '무선충전 + 알람시계' },
      { label: '충전방식', value: 'Qi 무선충전' },
      { label: '호환성', value: 'iPhone, Galaxy 등' },
      { label: '상태', value: '미개봉 새상품' }
    ]
  },
  { 
    id: 15, 
    title: '아이패드 에어4 256GB + 애플펜슬 2세대', 
    desc: '로즈골드 색상입니다. 그림 그리기용으로 사용했고, 케이스와 필름 부착 상태예요. 애플펜슬도 함께 드립니다. 디지털 드로잉 입문용으로 완벽한 세트입니다. 충전기 포함이에요.', 
    price: 420000, 
    originalPrice: 899000,
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '6시간 전',
    likes: 22,
    chats: 8,
    views: 134,
    category: '디지털기기',
    condition: 'good',
    seller: {
      name: '아티스트지망생',
      profileImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
      rating: 4.7,
      reviewCount: 25,
      responseRate: '93%',
      responseTime: '보통 2시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Apple' },
      { label: '모델명', value: 'iPad Air 4세대' },
      { label: '저장용량', value: '256GB' },
      { label: '색상', value: '로즈골드' },
      { label: '포함품', value: 'Apple Pencil 2세대' },
      { label: '화면', value: '10.9인치 Liquid Retina' }
    ]
  },
  { 
    id: 16, 
    title: '갤럭시 A33 내부충격 고장 판매', 
    desc: '부품용으로 판매합니다. 화면은 정상 작동하지만 내부 손상이 있어요. 수리하실 분이나 부품 필요하신 분께 저렴하게 드립니다. 충전기 포함해서 드려요.', 
    price: 30000, 
    originalPrice: 449000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '1일 전',
    likes: 4,
    chats: 2,
    views: 45,
    category: '디지털기기',
    condition: 'damaged',
    seller: {
      name: '부품판매자',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 3.8,
      reviewCount: 12,
      responseRate: '65%',
      responseTime: '보통 12시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Samsung' },
      { label: '모델명', value: 'Galaxy A33' },
      { label: '상태', value: '고장 (부품용)' },
      { label: '문제점', value: '내부 충격으로 인한 동작 불량' },
      { label: '정상 부품', value: '화면, 배터리' }
    ]
  },
  { 
    id: 17, 
    title: '오디오테크니카 ATH-A900 헤드폰', 
    desc: '음향 작업용으로 사용했습니다. 상태 매우 좋고 음질 훌륭해요. 박스 포함. 오디오파일이나 음악 작업하시는 분께 추천드립니다. 장시간 착용해도 편안해요.', 
    price: 80000, 
    originalPrice: 189000,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '3시간 전',
    likes: 11,
    chats: 4,
    views: 67,
    category: '디지털기기',
    condition: 'good',
    seller: {
      name: '사운드엔지니어',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 4.8,
      reviewCount: 41,
      responseRate: '97%',
      responseTime: '보통 1시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Audio-Technica' },
      { label: '모델명', value: 'ATH-A900' },
      { label: '타입', value: '밀폐형 헤드폰' },
      { label: '드라이버', value: '53mm' },
      { label: '임피던스', value: '40Ω' },
      { label: '연결방식', value: '3.5mm 유선' }
    ]
  },
  { 
    id: 18, 
    title: '벨킨 USB-C 멀티포트 허브 (미개봉)', 
    desc: '새상품 미개봉입니다. 맥북용으로 구매했는데 중복 구매해서 판매해요. USB-A, HDMI, SD카드 슬롯 등 다양한 포트 지원합니다. 맥북 사용자에게 필수템이에요.', 
    price: 50000, 
    originalPrice: 89000,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '4시간 전',
    likes: 9,
    chats: 3,
    views: 56,
    category: '디지털기기',
    condition: 'new',
    seller: {
      name: '맥유저',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b60b6cd5?w=100',
      rating: 4.5,
      reviewCount: 18,
      responseRate: '89%',
      responseTime: '보통 3시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Belkin' },
      { label: '포트', value: 'USB-C, USB-A, HDMI, SD' },
      { label: '해상도 지원', value: '4K@60Hz' },
      { label: '호환성', value: 'MacBook, iPad Pro 등' },
      { label: '상태', value: '미개봉 새상품' }
    ]
  },
  { 
    id: 19, 
    title: '갤럭시탭 S9 플러스 256GB WIFI (미개봉)', 
    desc: '그라파이트 색상, 미개봉 새상품입니다. 선물받았는데 사용할 일이 없어서 판매합니다. 완전 새상품이고 12.4인치 대화면으로 업무나 엔터테인먼트 모두 완벽합니다. S펜 포함되어 있어요.', 
    price: 710000, 
    originalPrice: 980000,
    image: 'https://images.unsplash.com/photo-1572741430134-82b8b62e7bc2?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1572741430134-82b8b62e7bc2?w=400',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '2시간 전',
    likes: 35,
    chats: 12,
    views: 201,
    category: '디지털기기',
    condition: 'new',
    seller: {
      name: '태블릿러버',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b60b6cd5?w=100',
      rating: 4.9,
      reviewCount: 67,
      responseRate: '99%',
      responseTime: '보통 30분 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Samsung' },
      { label: '모델명', value: 'Galaxy Tab S9 Plus' },
      { label: '화면크기', value: '12.4인치' },
      { label: '저장용량', value: '256GB' },
      { label: '연결방식', value: 'Wi-Fi' },
      { label: '색상', value: '그라파이트' },
      { label: '포함품', value: 'S펜 포함' }
    ]
  },
  { 
    id: 20, 
    title: '갤럭시 폴드3 512GB', 
    desc: '접힘 부분 손상 없이 깨끗하게 사용했습니다. 폴더블폰 체험해보세요! 케이스와 필름 부착 상태로 판매해요. 혁신적인 폴딩 기술을 경험할 수 있는 기회입니다. 충전기 포함이에요.', 
    price: 139000, 
    originalPrice: 1980000,
    image: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
    ],
    status: '예약중',
    location: '경기도 성남시',
    createdAt: '5시간 전',
    likes: 18,
    chats: 7,
    views: 112,
    category: '디지털기기',
    condition: 'normal',
    seller: {
      name: '폴더블체험자',
      profileImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
      rating: 4.3,
      reviewCount: 22,
      responseRate: '81%',
      responseTime: '보통 4시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Samsung' },
      { label: '모델명', value: 'Galaxy Z Fold3' },
      { label: '저장용량', value: '512GB' },
      { label: '화면', value: '7.6인치 폴더블' },
      { label: '상태', value: '사용감 있음 (접힘 부분 정상)' },
      { label: '색상', value: '팬텀 블랙' }
    ]
  },
  { 
    id: 21, 
    title: '파인뷰 X900 POWER 블랙박스', 
    desc: '차량 교체하면서 판매합니다. 설치 후 6개월 사용. 32GB 메모리카드 포함. 야간 화질도 좋고 주차 감시 기능도 있어요. 설치 가이드도 함께 드립니다.', 
    price: 40000, 
    originalPrice: 159000,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '1일 전',
    likes: 6,
    chats: 2,
    views: 43,
    category: '디지털기기',
    condition: 'good',
    seller: {
      name: '자동차매니아',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 4.4,
      reviewCount: 15,
      responseRate: '83%',
      responseTime: '보통 5시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'FINEVU' },
      { label: '모델명', value: 'X900 POWER' },
      { label: '화질', value: 'FHD 1920x1080' },
      { label: '저장용량', value: '32GB 마이크로SD 포함' },
      { label: '특징', value: '주차 감시, 충격 감지' }
    ]
  },
  { 
    id: 22, 
    title: '브라운 면도기 9PRO+ (그라파이트)', 
    desc: '새상품과 같은 상태입니다. 선물받았는데 기존 면도기가 있어서 판매해요. 5단계 소닉 기술로 부드러운 면도가 가능해요. 충전 스탠드와 청소 브러시 포함입니다.', 
    price: 160000, 
    originalPrice: 359000,
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '3시간 전',
    likes: 12,
    chats: 5,
    views: 78,
    category: '생활가전',
    condition: 'like-new',
    seller: {
      name: '그루밍맨',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 4.6,
      reviewCount: 29,
      responseRate: '91%',
      responseTime: '보통 2시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Braun' },
      { label: '모델명', value: 'Series 9 Pro+' },
      { label: '색상', value: '그라파이트' },
      { label: '배터리', value: '60분 사용' },
      { label: '충전시간', value: '5분 급속충전' },
      { label: '포함품', value: '충전 스탠드, 청소 브러시' }
    ]
  },
  { 
    id: 23, 
    title: 'Apple TV 4K 3세대 64GB (USB-C)', 
    desc: '최신 모델입니다. 홈시어터 구성 변경으로 판매합니다. 리모컨 포함. A15 바이오닉 칩 탑재로 성능 우수해요. 4K HDR 지원하고 돌비 비전도 지원합니다.', 
    price: 160000, 
    originalPrice: 199000,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '2시간 전',
    likes: 15,
    chats: 6,
    views: 89,
    category: '디지털기기',
    condition: 'like-new',
    seller: {
      name: '홈시어터',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      rating: 4.7,
      reviewCount: 33,
      responseRate: '94%',
      responseTime: '보통 1시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Apple' },
      { label: '모델명', value: 'Apple TV 4K (3세대)' },
      { label: '저장용량', value: '64GB' },
      { label: '칩셋', value: 'A15 Bionic' },
      { label: '지원 화질', value: '4K HDR, 돌비 비전' },
      { label: '리모컨', value: 'Siri Remote (USB-C)' }
    ]
  },
  { 
    id: 24, 
    title: '인스탁스 미니 리플레이 즉석카메라', 
    desc: '파티용으로 구매했는데 몇 번 사용하지 않았어요. 필름 20장 포함해서 판매합니다. 하이브리드 즉석카메라로 디지털과 필름을 모두 지원해요. 젊은 분들께 인기 많은 제품입니다.', 
    price: 150000, 
    originalPrice: 259000,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '4시간 전',
    likes: 20,
    chats: 8,
    views: 145,
    category: '디지털기기',
    condition: 'like-new',
    seller: {
      name: '파티피플',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b60b6cd5?w=100',
      rating: 4.3,
      reviewCount: 14,
      responseRate: '79%',
      responseTime: '보통 6시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Fujifilm' },
      { label: '모델명', value: 'Instax Mini LiPlay' },
      { label: '타입', value: '하이브리드 즉석카메라' },
      { label: '필름', value: 'Instax Mini' },
      { label: '포함품', value: '필름 20장' },
      { label: '특징', value: '디지털 + 즉석인화' }
    ]
  },
  { 
    id: 25, 
    title: '갤럭시 S23+ 크림색', 
    desc: '1년 사용했습니다. 케이스 사용으로 외관 깨끗하고, 배터리 성능도 좋아요. 스냅드래곤 8 Gen 2 칩셋으로 게임도 잘 돌아가요. 무선충전 지원하고 카메라 성능도 우수합니다.', 
    price: 400000, 
    originalPrice: 1056000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '1시간 전',
    likes: 25,
    chats: 9,
    views: 167,
    category: '디지털기기',
    condition: 'good',
    seller: {
      name: '갤럭시유저',
      profileImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
      rating: 4.5,
      reviewCount: 27,
      responseRate: '87%',
      responseTime: '보통 3시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Samsung' },
      { label: '모델명', value: 'Galaxy S23+' },
      { label: '색상', value: '크림' },
      { label: '저장용량', value: '256GB' },
      { label: '칩셋', value: 'Snapdragon 8 Gen 2' },
      { label: '배터리', value: '4700mAh' },
      { label: '카메라', value: '50MP 트리플 카메라' }
    ]
  },
  { 
    id: 26, 
    title: '한성 27인치 커브드 모니터', 
    desc: '게이밍용으로 사용했습니다. 144Hz 지원하고 상태 매우 좋아요. 스탠드 포함. 곡면 모니터라 몰입감이 뛰어나고 게임이나 영상 시청에 최적화되어 있어요. HDMI, DP 포트 지원합니다.', 
    price: 100000, 
    originalPrice: 299000,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'
    ],
    status: '예약중',
    location: '경기도 성남시',
    createdAt: '6시간 전',
    likes: 17,
    chats: 11,
    views: 134,
    category: '디지털기기',
    condition: 'good',
    seller: {
      name: '게이밍족',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      rating: 4.6,
      reviewCount: 38,
      responseRate: '89%',
      responseTime: '보통 2시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'HANSUNG' },
      { label: '화면크기', value: '27인치' },
      { label: '해상도', value: 'FHD 1920x1080' },
      { label: '주사율', value: '144Hz' },
      { label: '곡률', value: '1800R 커브드' },
      { label: '포트', value: 'HDMI, DisplayPort' }
    ]
  },
  { 
    id: 27, 
    title: 'COX CK700 게이밍 키보드', 
    desc: 'RGB 백라이트 기계식 키보드입니다. 청축으로 타건감 좋아요. 박스 포함. 게이밍이나 타이핑 작업에 최적화된 키보드예요. LED 백라이트 효과도 다양하게 설정 가능합니다.', 
    price: 10000, 
    originalPrice: 79000,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '3시간 전',
    likes: 8,
    chats: 4,
    views: 56,
    category: '디지털기기',
    condition: 'normal',
    seller: {
      name: '키보드수집가',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 4.2,
      reviewCount: 21,
      responseRate: '76%',
      responseTime: '보통 5시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'COX' },
      { label: '모델명', value: 'CK700' },
      { label: '스위치', value: 'Blue Switch (청축)' },
      { label: '백라이트', value: 'RGB LED' },
      { label: '연결방식', value: 'USB 유선' },
      { label: '키 배열', value: '풀배열 (104키)' }
    ]
  },
  { 
    id: 28, 
    title: '고프로13 액션캠 + 아웃도어 악세서리 풀세트', 
    desc: '최신 모델 고프로13입니다. 방수케이스, 마운트, 배터리 등 악세서리 풀세트로 판매해요. 4K 120fps 촬영 가능하고 HyperSmooth 6.0 손떨림 방지 기능도 뛰어나요. 여행이나 익스트림 스포츠용으로 완벽합니다.', 
    price: 510000, 
    originalPrice: 799000,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400'
    ],
    status: '판매중',
    location: '경기도 성남시',
    createdAt: '1시간 전',
    likes: 33,
    chats: 14,
    views: 198,
    category: '디지털기기',
    condition: 'like-new',
    seller: {
      id: 128,
      name: '액션캠러',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 4.8,
      reviewCount: 42,
      responseRate: '96%',
      responseTime: '보통 1시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'GoPro' },
      { label: '모델명', value: 'HERO13 Black' },
      { label: '화질', value: '4K 120fps' },
      { label: '손떨림 방지', value: 'HyperSmooth 6.0' },
      { label: '방수', value: '10m 방수' },
      { label: '포함품', value: '방수케이스, 마운트, 배터리, SD카드' }
    ]
  }
];

// 더 많은 상품들을 위한 템플릿 함수
export const generateProductDetail = (baseProduct) => {
  const conditions = {
    'new': '새상품',
    'like-new': '거의 새상품', 
    'good': '상태 좋음',
    'normal': '사용감 있음',
    'damaged': '고장/파손'
  };

  // seller id가 없으면 자동으로 추가 (기존 데이터 호환성을 위해)
  const seller = baseProduct.seller ? {
    ...baseProduct.seller,
    id: baseProduct.seller.id || (200 + baseProduct.id) // id 없으면 자동 생성
  } : {
    id: 200 + baseProduct.id,
    name: '판매자',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: (Math.random() * 1 + 4).toFixed(1),
    reviewCount: Math.floor(Math.random() * 30) + 5,
    responseRate: '95%',
    responseTime: '보통 1시간 이내'
  };

  return {
    ...baseProduct,
    images: baseProduct.images || [baseProduct.image],
    views: baseProduct.views || Math.floor(Math.random() * 200) + 50,
    condition: baseProduct.condition || 'good',
    seller,
    specifications: baseProduct.specifications || [
      { label: '카테고리', value: baseProduct.category },
      { label: '상태', value: conditions[baseProduct.condition || 'good'] },
      { label: '거래방식', value: '직거래' }
    ]
  };
};

// 상품 상세 정보 가져오기 함수
export const getProductById = (id) => {
  const product = sampleProducts.find(p => p.id === parseInt(id));
  return product ? generateProductDetail(product) : null;
}; 