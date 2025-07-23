'use client';
import ProductCard from '@/app/components/productCard';
import Header from '@/app/components/Header';
import { sampleProducts } from '@/app/data/products';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 사용자 등록 상품과 기본 샘플 상품 합치기
  const [userProducts, setUserProducts] = useState([]);

  // 컴포넌트 마운트 시 localStorage에서 사용자 등록 상품 불러오기
  useEffect(() => {
    const savedProducts = localStorage.getItem('userProducts');
    if (savedProducts) {
      setUserProducts(JSON.parse(savedProducts));
    }
  }, []);

  // 모든 상품 (사용자 등록 + 샘플 데이터) 합치기
  const allProducts = useMemo(() => {
    return [...userProducts, ...sampleProducts];
  }, [userProducts]);

  // 🔍 검색 및 필터 상태 관리
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [sortBy, setSortBy] = useState('latest'); // latest, price-low, price-high, popular

  // URL 쿼리 파라미터에서 초기값 설정
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const keywordParam = searchParams.get('keyword');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (keywordParam) {
      setKeyword(keywordParam);
    }
  }, [searchParams]);

  // 카테고리 목록 (모든 상품 카테고리 포함)
  const categories = [
    '전체', '디지털기기', '생활가전', '가구/인테리어', '생활/주방', 
    '유아동', '유아도서', '여성의류', '여성잡화', '남성패션/잡화',
    '뷰티/미용', '스포츠/레저', '취미/게임/음반', '도서', '티켓/교환권',
    '가공식품', '건강기능식품', '반려동물용품', '식물', '기타 중고물품'
  ];
  const statusOptions = ['전체', '판매중', '예약중', '완료'];

  // 필터링 및 정렬된 상품 목록
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts;

    // 🔍 검색어 필터
    if (keyword.trim()) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(keyword.toLowerCase()) ||
        product.desc.toLowerCase().includes(keyword.toLowerCase()) ||
        product.category.toLowerCase().includes(keyword.toLowerCase()) ||
        product.location.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // 상태 필터
    if (selectedStatus !== '전체') {
      filtered = filtered.filter(product => product.status === selectedStatus);
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          return (b.likes + b.chats) - (a.likes + a.chats);
        case 'latest':
        default:
          // 사용자 등록 상품을 최신 순으로 우선 표시
          if (userProducts.includes(a) && !userProducts.includes(b)) return -1;
          if (!userProducts.includes(a) && userProducts.includes(b)) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [allProducts, keyword, selectedCategory, selectedStatus, sortBy, userProducts]);

  // 페이지가 다시 로드될 때마다 사용자 상품 새로고침
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProducts = localStorage.getItem('userProducts');
      if (savedProducts) {
        setUserProducts(JSON.parse(savedProducts));
      }
    };

    // storage 이벤트 리스너 (다른 탭에서 변경 시)
    window.addEventListener('storage', handleStorageChange);
    
    // 페이지가 포커스될 때마다 체크 (같은 탭에서 변경 시)
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  // 사용자 상품 개수를 표시하는 커스텀 액션
  const customHeaderActions = (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-500">총 {filteredAndSortedProducts.length}개</span>
      {userProducts.length > 0 && (
        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
          내 상품 {userProducts.length}개
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 사용 */}
      <Header customActions={customHeaderActions} />

      {/* 🔍 검색창 */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="상품명, 설명, 카테고리, 지역으로 검색하세요"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                // URL 업데이트 (디바운싱 없이 즉시)
                const params = new URLSearchParams();
                if (e.target.value.trim()) params.set('keyword', e.target.value);
                if (selectedCategory !== '전체') params.set('category', selectedCategory);
                const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
                window.history.pushState({}, '', newUrl);
              }}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
            {keyword && (
              <button
                onClick={() => {
                  setKeyword('');
                  // URL에서 keyword 제거
                  const params = new URLSearchParams();
                  if (selectedCategory !== '전체') params.set('category', selectedCategory);
                  const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
                  window.history.pushState({}, '', newUrl);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {keyword && (
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">
                '<span className="font-medium text-orange-600">{keyword}</span>' 검색결과 {filteredAndSortedProducts.length}개
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 필터 및 정렬 바 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            {/* 카테고리 필터 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">카테고리:</span>
              <div className="flex space-x-1">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      // URL 업데이트
                      const params = new URLSearchParams();
                      if (category !== '전체') params.set('category', category);
                      if (keyword) params.set('keyword', keyword);
                      const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
                      window.history.pushState({}, '', newUrl);
                    }}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 상태 필터 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">상태:</span>
              <div className="flex space-x-1">
                {statusOptions.map(status => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedStatus === status
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* 정렬 옵션 */}
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm font-medium text-gray-700">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="latest">최신순</option>
                <option value="price-low">가격 낮은순</option>
                <option value="price-high">가격 높은순</option>
                <option value="popular">인기순</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 상품 그리드 */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">상품이 없습니다</h3>
            <p className="text-gray-500">다른 조건으로 검색해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedProducts.map(product => (
              <div key={product.id} className="relative">
                {userProducts.some(p => p.id === product.id) && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      내 상품
                    </span>
                  </div>
                )}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 