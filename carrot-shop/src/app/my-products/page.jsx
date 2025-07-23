'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import ProductCard from '@/app/components/productCard';

// 데스크톱용 상태 필터 컴포넌트 (간단 버전)
function StatusFilterDesktop({ statusOptions, selectedStatus, onStatusChange }) {
  return (
    <div className="flex space-x-1">
      {statusOptions.map(status => (
        <button
          key={status}
          onClick={() => onStatusChange(status)}
          className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${
            selectedStatus === status
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

export default function MyProductsPage() {
  const router = useRouter();
  const [myProducts, setMyProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [statusFilter, setStatusFilter] = useState('전체');
  const [sortBy, setSortBy] = useState('latest');

  // 내 상품 불러오기
  useEffect(() => {
    const loadMyProducts = () => {
      const savedProducts = localStorage.getItem('userProducts');
      if (savedProducts) {
        setMyProducts(JSON.parse(savedProducts));
      }
      setIsLoading(false);
    };

    loadMyProducts();
    
    // storage 이벤트 리스너 (다른 탭에서 변경 시)
    window.addEventListener('storage', loadMyProducts);
    window.addEventListener('focus', loadMyProducts);

    return () => {
      window.removeEventListener('storage', loadMyProducts);
      window.removeEventListener('focus', loadMyProducts);
    };
  }, []);

  // 상품 상태 변경
  const updateProductStatus = (productId, newStatus) => {
    const updatedProducts = myProducts.map(product => 
      product.id === productId 
        ? { ...product, status: newStatus }
        : product
    );
    setMyProducts(updatedProducts);
    localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
  };

  // 상품 삭제
  const deleteProduct = (productId) => {
    if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      const updatedProducts = myProducts.filter(product => product.id !== productId);
      setMyProducts(updatedProducts);
      localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
      
      // 선택된 상품에서도 제거
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  // 선택된 상품들 일괄 삭제
  const deleteSelectedProducts = () => {
    if (selectedProducts.length === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }

    if (confirm(`선택한 ${selectedProducts.length}개 상품을 삭제하시겠습니까?`)) {
      const updatedProducts = myProducts.filter(product => !selectedProducts.includes(product.id));
      setMyProducts(updatedProducts);
      localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
      setSelectedProducts([]);
    }
  };

  // 체크박스 토글
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  // 필터링된 상품 목록
  const filteredProducts = myProducts
    .filter(product => statusFilter === '전체' || product.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'oldest':
          return a.id - b.id;
        case 'latest':
        default:
          return b.id - a.id;
      }
    });

  const statusOptions = ['전체', '판매중', '예약중', '완료'];
  const statusColors = {
    '판매중': 'bg-green-100 text-green-800',
    '예약중': 'bg-yellow-100 text-yellow-800',
    '완료': 'bg-gray-100 text-gray-800'
  };

  // 헤더 커스텀 액션
  const customActions = (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-500">총 {myProducts.length}개</span>
      <button
        onClick={() => router.push('/sell')}
        className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        + 상품 등록
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">상품 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="내 상품 관리" 
        showBackButton={true} 
        customActions={customActions} 
      />

      {/* 필터 및 관리 도구 */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="space-y-4">
            {/* 상단: 주요 필터들 */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* 왼쪽: 상태 필터 */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">상태:</span>
                
                {/* 데스크톱: 버튼 형태 */}
                <div className="hidden sm:block">
                  <StatusFilterDesktop 
                    statusOptions={statusOptions}
                    selectedStatus={statusFilter}
                    onStatusChange={setStatusFilter}
                  />
                </div>

                {/* 모바일: 드롭다운 */}
                <div className="sm:hidden">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white min-w-[100px]"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 오른쪽: 보기 모드 */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="그리드 보기"
                >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="리스트 보기"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 하단: 정렬 옵션 및 선택 관리 */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {/* 정렬 */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">정렬:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[120px]"
                  >
                    <option value="latest">최신순</option>
                    <option value="oldest">등록순</option>
                    <option value="price-low">가격 낮은순</option>
                    <option value="price-high">가격 높은순</option>
                    <option value="views">조회수순</option>
                    <option value="likes">관심순</option>
                  </select>
                </div>

                {/* 필터 결과 표시 */}
                <div className="text-sm text-gray-500">
                  {statusFilter !== '전체' && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                      {statusFilter}
                    </span>
                  )}
                  <span>{filteredProducts.length}개 상품</span>
                </div>
              </div>

              {/* 선택 관리 */}
              {filteredProducts.length > 0 && (
                <div className="flex items-center space-x-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">전체 선택</span>
                  </label>
                  
                  {selectedProducts.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{selectedProducts.length}개 선택됨</span>
                      <button
                        onClick={deleteSelectedProducts}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      >
                        일괄 삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {myProducts.length === 0 ? '등록한 상품이 없습니다' : '조건에 맞는 상품이 없습니다'}
            </h3>
            <p className="text-gray-500 mb-6">
              {myProducts.length === 0 
                ? '첫 번째 상품을 등록해보세요!' 
                : '다른 조건으로 검색해보세요.'
              }
            </p>
            <button
              onClick={() => router.push('/sell')}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              + 상품 등록하기
            </button>
          </div>
        ) : (
          <>
            {/* 그리드 보기 */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="relative bg-white rounded-lg shadow-sm overflow-hidden group">
                    {/* 선택 체크박스 */}
                    <div className="absolute top-3 left-3 z-10">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-5 h-5"
                      />
                    </div>

                    {/* 상태 배지 */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[product.status]}`}>
                        {product.status}
                      </span>
                    </div>

                    {/* 상품 카드 */}
                    <div className="cursor-pointer" onClick={() => router.push(`/products/${product.id}`)}>
                      <ProductCard product={product} />
                    </div>

                    {/* 관리 버튼들 */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/sell/${product.id}`);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProduct(product.id);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 리스트 보기 */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
                    {/* 선택 체크박스 */}
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />

                    {/* 상품 이미지 */}
                    <div className="flex-shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>

                    {/* 상품 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 truncate">{product.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.desc}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{product.category}</span>
                            <span>{product.location}</span>
                            <span>조회 {product.views}</span>
                            <span>관심 {product.likes}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-orange-600">
                            {product.isFree ? '나눔' : product.acceptOffersOnly ? '제안받기' : `${product.price.toLocaleString()}원`}
                          </div>
                          <div className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${statusColors[product.status]}`}>
                            {product.status}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 상태 변경 및 관리 버튼 */}
                    <div className="flex flex-col space-y-2">
                      <select
                        value={product.status}
                        onChange={(e) => updateProductStatus(product.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="판매중">판매중</option>
                        <option value="예약중">예약중</option>
                        <option value="완료">완료</option>
                      </select>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => router.push(`/sell/${product.id}`)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
} 