'use client';
import ProductCard from '@/app/components/productCard';
import Header from '@/app/components/Header';
import { sampleProducts } from '@/app/data/products';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// 데스크톱용 카테고리 필터 컴포넌트
function CategoryFilterDesktop({ categories, selectedCategory, onCategoryChange }) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  // 주요 카테고리 (자주 사용되는 카테고리들)
  const mainCategories = ['전체', '디지털기기', '생활가전', '가구/인테리어', '생활/주방', '여성의류', '남성패션/잡화'];
  const additionalCategories = categories.filter(cat => !mainCategories.includes(cat));
  
  const displayCategories = showAllCategories ? categories : mainCategories;
  
  return (
    <div className="flex flex-wrap items-center gap-1">
      {displayCategories.map(category => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-all duration-200 ${
            selectedCategory === category
              ? 'bg-orange-500 text-white shadow-md transform scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
          }`}
        >
          {category}
        </button>
      ))}
      
      {/* 더보기/접기 버튼 */}
      {additionalCategories.length > 0 && (
        <button
          onClick={() => setShowAllCategories(!showAllCategories)}
          className="flex items-center space-x-1 px-3 py-1 text-sm rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 border border-gray-200"
        >
          <span>{showAllCategories ? '접기' : `더보기 (+${additionalCategories.length})`}</span>
          <svg 
            className={`w-3 h-3 transition-transform duration-200 ${showAllCategories ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      
      {/* 선택된 카테고리가 추가 카테고리인 경우 표시 */}
      {!mainCategories.includes(selectedCategory) && !showAllCategories && (
        <div className="flex items-center space-x-2">
          <div className="w-px h-4 bg-gray-300"></div>
          <button
            onClick={() => onCategoryChange(selectedCategory)}
            className="px-3 py-1 text-sm rounded-full bg-orange-500 text-white shadow-md"
          >
            {selectedCategory}
          </button>
        </div>
      )}
    </div>
  );
}

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

  // 🔍 검색 및 필터 상태 관리 - 개선된 버전
  const [inputKeyword, setInputKeyword] = useState(''); // 입력창의 값
  const [searchKeyword, setSearchKeyword] = useState(''); // 실제 검색에 사용되는 값
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [sortBy, setSortBy] = useState('latest'); // latest, price-low, price-high, popular
  const [isSearching, setIsSearching] = useState(false);

  // URL 쿼리 파라미터에서 초기값 설정
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const keywordParam = searchParams.get('keyword');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (keywordParam) {
      setInputKeyword(keywordParam);
      setSearchKeyword(keywordParam);
    }
  }, [searchParams]);

  // 검색 실행 함수
  const executeSearch = useCallback((keyword = inputKeyword.trim()) => {
    if (isSearching) return; // 이미 검색 중이면 무시
    
    setIsSearching(true);
    setSearchKeyword(keyword);
    
    // URL 업데이트
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (selectedCategory !== '전체') params.set('category', selectedCategory);
    const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
    window.history.pushState({}, '', newUrl);
    
    // 검색 애니메이션을 위한 약간의 지연
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  }, [inputKeyword, selectedCategory, isSearching]);

  // 검색어 초기화 함수
  const clearSearch = () => {
    setInputKeyword('');
    setSearchKeyword('');
    
    // URL에서 keyword 제거
    const params = new URLSearchParams();
    if (selectedCategory !== '전체') params.set('category', selectedCategory);
    const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
    window.history.pushState({}, '', newUrl);
  };

  // 엔터키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  };

  // 카테고리 목록 (모든 상품 카테고리 포함)
  const categories = [
    '전체', '디지털기기', '생활가전', '가구/인테리어', '생활/주방', 
    '유아동', '유아도서', '여성의류', '여성잡화', '남성패션/잡화',
    '뷰티/미용', '스포츠/레저', '취미/게임/음반', '도서', '티켓/교환권',
    '가공식품', '건강기능식품', '반려동물용품', '식물', '기타 중고물품'
  ];
  const statusOptions = ['전체', '판매중', '예약중', '완료'];

  // 필터링 및 정렬된 상품 목록 - searchKeyword 사용
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts;

    // 🔍 검색어 필터 - 실제 검색된 키워드만 사용
    if (searchKeyword.trim()) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        product.desc.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        product.category.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        product.location.toLowerCase().includes(searchKeyword.toLowerCase())
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
  }, [allProducts, searchKeyword, selectedCategory, selectedStatus, sortBy, userProducts]);

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

      {/* 🔍 검색창 - 개선된 버전 */}
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
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition-all duration-200"
            />
            
            {/* 검색 버튼과 클리어 버튼 */}
            <div className="absolute inset-y-0 right-0 flex items-center">
              {inputKeyword && (
                <button
                  onClick={clearSearch}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="검색어 지우기"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              <button
                onClick={() => executeSearch()}
                disabled={isSearching}
                className={`mr-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  inputKeyword.trim()
                    ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                } ${isSearching ? 'animate-pulse' : ''}`}
                title="검색하기 (Enter)"
              >
                {isSearching ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>검색중</span>
                  </div>
                ) : (
                  '검색'
                )}
              </button>
            </div>
          </div>
          
          {/* 검색 결과 표시 - 실제 검색된 키워드만 표시 */}
          {searchKeyword && (
            <div className="text-center mt-3">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-50 rounded-full">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm text-gray-700">
                  '<span className="font-medium text-orange-600">{searchKeyword}</span>' 검색결과 
                  <span className="font-semibold text-orange-700">{filteredAndSortedProducts.length}개</span>
                </span>
                <button
                  onClick={clearSearch}
                  className="text-orange-500 hover:text-orange-700 transition-colors"
                  title="검색 초기화"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* 검색어 힌트 */}
          {!searchKeyword && inputKeyword.trim() && (
            <div className="text-center mt-2">
              <span className="text-xs text-gray-500">
                💡 Enter키를 누르거나 검색 버튼을 클릭해주세요
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 필터 및 정렬 바 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            {/* 카테고리 필터 - 반응형 개선 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">카테고리:</span>
              
              {/* 데스크톱: 주요 카테고리 + 더보기 */}
              <div className="hidden md:flex items-center space-x-1">
                <CategoryFilterDesktop 
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={(category) => {
                    setSelectedCategory(category);
                    const params = new URLSearchParams();
                    if (category !== '전체') params.set('category', category);
                    if (searchKeyword) params.set('keyword', searchKeyword);
                    const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
                    window.history.pushState({}, '', newUrl);
                  }}
                />
              </div>

              {/* 모바일: 드롭다운 */}
              <div className="md:hidden">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    const params = new URLSearchParams();
                    if (e.target.value !== '전체') params.set('category', e.target.value);
                    if (searchKeyword) params.set('keyword', searchKeyword);
                    const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
                    window.history.pushState({}, '', newUrl);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white min-w-[120px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
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
                    className={`px-3 py-1 text-sm rounded-full transition-all ${
                      selectedStatus === status
                        ? 'bg-orange-500 text-white shadow-md'
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
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
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
        {isSearching ? (
          // 검색 중 로딩 상태
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">검색 중...</p>
              <p className="text-gray-500 text-sm">잠시만 기다려주세요</p>
            </div>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchKeyword ? '검색 결과가 없습니다' : '상품이 없습니다'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchKeyword 
                ? `'${searchKeyword}'에 대한 검색 결과를 찾을 수 없어요`
                : '다른 조건으로 검색해보세요'
              }
            </p>
            {searchKeyword && (
              <button
                onClick={clearSearch}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                전체 상품 보기
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedProducts.map(product => (
              <div key={product.id} className="relative">
                {userProducts.some(p => p.id === product.id) && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
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