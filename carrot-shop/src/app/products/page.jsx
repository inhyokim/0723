'use client';
import ProductCard from '@/app/components/productCard';
import Header from '@/app/components/Header';
import { supabaseUtils } from '@/lib/supabase';
import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
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
    </div>
  );
}

// 모바일용 카테고리 드롭다운 컴포넌트
function CategoryFilterMobile({ categories, selectedCategory, onCategoryChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      >
        <span className="text-gray-700">{selectedCategory}</span>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                onCategoryChange(category);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// useSearchParams를 사용하는 메인 컴포넌트를 분리
function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL에서 초기값 가져오기
  const initialKeyword = searchParams.get('keyword') || '';
  const initialCategory = searchParams.get('category') || '전체';
  
  // 상태 관리
  const [searchInput, setSearchInput] = useState(initialKeyword); // 입력 상태
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword); // 실제 검색 상태
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('latest');
  
  // Supabase 상태 관리
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Supabase에서 상품 데이터 로드
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [상품둘러보기] 데이터 로딩 시작...');
      
      // 판매자 정보와 함께 조회 시도
      let data;
      try {
        console.log('📊 [상품둘러보기] getAllWithSeller 호출...');
        data = await supabaseUtils.products.getAllWithSeller();
        console.log('✅ [상품둘러보기] getAllWithSeller 성공:', {
          isArray: Array.isArray(data),
          length: data?.length || 0,
          firstItem: data?.[0] || null
        });
      } catch (joinError) {
        console.warn('⚠️ [상품둘러보기] 조인 쿼리 실패, 기본 쿼리로 대체:', joinError);
        // 조인 쿼리 실패 시 기본 쿼리로 대체
        data = await supabaseUtils.products.getAll();
        console.log('✅ [상품둘러보기] getAll 성공:', {
          isArray: Array.isArray(data),
          length: data?.length || 0,
          firstItem: data?.[0] || null
        });
      }
      
      if (!Array.isArray(data)) {
        console.error('❌ [상품둘러보기] data가 배열이 아님!', typeof data, data);
        setProducts([]);
        return;
      }

      console.log('🔄 [상품둘러보기] 데이터 변환 시작...');
      
      // 데이터 변환 (기존 구조와 호환되도록)
      const transformedData = data.map((product, index) => {
        console.log(`📦 [상품둘러보기] 상품 ${index + 1} 변환:`, {
          id: product.id,
          title: product.title,
          description: product.description,
          main_image: product.main_image,
          category: product.category,
          price: product.price
        });
        
        return {
          ...product,
          desc: product.description || '상품 설명이 없습니다', // description -> desc로 변환
          image: product.main_image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',  // main_image -> image로 변환
          images: product.product_images && product.product_images.length > 0 
            ? product.product_images
                .sort((a, b) => a.sort_order - b.sort_order)
                .map(img => img.image_url)
            : product.main_image ? [product.main_image] : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'],
          createdAt: new Date(product.created_at).toLocaleDateString(),
          
          // ProductCard가 기대하는 모든 필드들 안전하게 설정
          title: product.title || '제목 없음',
          price: product.is_free ? 0 : (product.price || 0),
          originalPrice: product.original_price || null,
          isFree: product.is_free || false,
          acceptOffersOnly: product.accept_offers_only || false,
          negotiable: product.is_negotiable || false,
          status: product.status || '판매중',
          category: product.category || '기타',
          condition: product.condition || '사용감 있음',
          location: product.location || '위치 정보 없음',
          likes: product.likes || 0,
          chats: product.chats || 0,
          views: product.views || 0,
          
          seller: product.user_profiles ? {
            id: product.user_profiles.id,
            name: product.user_profiles.name || '판매자',
            profileImage: product.user_profiles.profile_image || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
            rating: product.user_profiles.rating || 4.5,
            reviewCount: product.user_profiles.review_count || 0,
            responseRate: product.user_profiles.response_rate || '95%',
            responseTime: product.user_profiles.response_time || '보통 1시간 이내'
          } : {
            id: product.seller_id || 'unknown',
            name: '판매자',
            profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
            rating: 4.5,
            reviewCount: 0,
            responseRate: '95%',
            responseTime: '보통 1시간 이내'
          }
        };
      });
      
      console.log('🎯 [상품둘러보기] 최종 변환 결과:', {
        count: transformedData.length,
        samples: transformedData.slice(0, 2).map(p => ({
          id: p.id,
          title: p.title,
          price: p.price,
          category: p.category,
          status: p.status
        }))
      });
      
      setProducts(transformedData);
      console.log('✅ [상품둘러보기] setProducts 완료');
    } catch (err) {
      console.error('❌ [상품둘러보기] 오류 발생:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('🏁 [상품둘러보기] 로딩 완료');
    }
  }, []);

  useEffect(() => {
    loadProducts();
    
    // 페이지 포커스 시 데이터 새로고침
    const handleFocus = () => {
      loadProducts();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadProducts]);

  // 검색 실행 함수
  const executeSearch = useCallback(() => {
    setSearchKeyword(searchInput);
    
    // URL 업데이트
    const params = new URLSearchParams();
    if (searchInput) params.set('keyword', searchInput);
    if (selectedCategory !== '전체') params.set('category', selectedCategory);
    
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl);
  }, [searchInput, selectedCategory, router]);

  // 엔터키 핸들러
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    
    // URL 업데이트
    const params = new URLSearchParams();
    if (searchKeyword) params.set('keyword', searchKeyword);
    if (category !== '전체') params.set('category', category);
    
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl);
  }, [searchKeyword, router]);

  // URL 파라미터 변경 감지
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || '';
    const urlCategory = searchParams.get('category') || '전체';
    
    setSearchInput(urlKeyword);
    setSearchKeyword(urlKeyword);
    setSelectedCategory(urlCategory);
  }, [searchParams]);

  // 카테고리 목록 생성
  const categories = useMemo(() => {
    const uniqueCategories = ['전체', ...new Set(products.map(product => product.category))];
    return uniqueCategories;
  }, [products]);

  // 필터링된 상품 목록
  const filteredProducts = useMemo(() => {
    console.log('🔍 [상품둘러보기] 필터링 시작:', {
      totalProducts: products.length,
      selectedCategory,
      searchKeyword,
      sortBy
    });
    
    let filtered = products;

    // 카테고리 필터링
    if (selectedCategory !== '전체') {
      const beforeCount = filtered.length;
      filtered = filtered.filter(product => product.category === selectedCategory);
      console.log(`📂 [상품둘러보기] 카테고리 필터링 (${selectedCategory}):`, {
        before: beforeCount,
        after: filtered.length
      });
    }

    // 검색어 필터링
    if (searchKeyword) {
      const beforeCount = filtered.length;
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(product => {
        const locationText = product.location && typeof product.location === 'object' 
          ? product.location.name || ''
          : product.location || '';
        
        const titleMatch = product.title.toLowerCase().includes(keyword);
        const descMatch = product.desc && product.desc.toLowerCase().includes(keyword);
        const locationMatch = locationText.toLowerCase().includes(keyword);
        
        return titleMatch || descMatch || locationMatch;
      });
      console.log(`🔍 [상품둘러보기] 검색어 필터링 (${searchKeyword}):`, {
        before: beforeCount,
        after: filtered.length
      });
    }

    // 정렬
    switch (sortBy) {
      case 'priceHigh':
        filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
        console.log('💰 [상품둘러보기] 가격 높은순 정렬');
        break;
      case 'priceLow':
        filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
        console.log('💰 [상품둘러보기] 가격 낮은순 정렬');
        break;
      case 'likes':
        filtered = [...filtered].sort((a, b) => b.likes - a.likes);
        console.log('❤️ [상품둘러보기] 좋아요순 정렬');
        break;
      case 'latest':
      default:
        console.log('📅 [상품둘러보기] 최신순 정렬 (기본)');
        break;
    }
    
    console.log('✅ [상품둘러보기] 최종 필터링 결과:', {
      count: filtered.length,
      samples: filtered.slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        price: p.price
      }))
    });

    return filtered;
  }, [products, searchKeyword, selectedCategory, sortBy]);

  // 로딩 상태 처리
  if (loading) {
    return <ProductsLoading />;
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center py-16">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">데이터 로딩 오류</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              새로고침
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 검색 섹션 */}
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="상품명, 지역명으로 검색해보세요"
                className="w-full px-4 py-3 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={executeSearch}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              검색
            </button>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-6">
          {/* 데스크톱용 카테고리 (md 이상에서 표시) */}
          <div className="hidden md:block">
            <CategoryFilterDesktop 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          {/* 모바일용 카테고리 (md 미만에서 표시) */}
          <div className="block md:hidden">
            <CategoryFilterMobile 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>

        {/* 정렬 및 결과 개수 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div className="text-gray-600">
            총 <span className="font-semibold text-orange-600">{filteredProducts.length}</span>개의 상품
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadProducts}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              title="새로고침"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>새로고침</span>
            </button>
            <span className="text-sm text-gray-500">정렬:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
            >
              <option value="latest">최신순</option>
              <option value="priceHigh">높은 가격순</option>
              <option value="priceLow">낮은 가격순</option>
              <option value="likes">인기순</option>
            </select>
          </div>
        </div>

        {/* 상품 그리드 */}
        {filteredProducts.length > 0 ? (
          <>
            {console.log('🎨 [상품둘러보기] 상품 그리드 렌더링 시작:', { 
              count: filteredProducts.length,
              products: filteredProducts.slice(0, 3).map(p => ({ id: p.id, title: p.title }))
            })}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => {
                console.log(`🛍️ [상품둘러보기] ProductCard ${index + 1} 렌더링:`, {
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  category: product.category
                });
                return (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {console.log('📭 [상품둘러보기] 빈 상태 렌더링:', { 
              filteredProductsLength: filteredProducts.length,
              totalProductsLength: products.length,
              selectedCategory,
              searchKeyword
            })}
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-500">다른 검색어나 카테고리를 시도해보세요.</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// 로딩 컴포넌트
function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// 메인 exports - Suspense로 감싸기
export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
} 