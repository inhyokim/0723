'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import ProductCard from '@/app/components/productCard';
import { sampleProducts } from '@/app/data/products';

// 거리 계산 유틸리티 (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// 지도 마커 컴포넌트
const MapMarker = ({ product, onClick, isSelected }) => (
  <div 
    className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300 hover:scale-110 ${
      isSelected ? 'z-50 scale-125' : 'z-10'
    }`}
    onClick={() => onClick(product)}
    style={{
      left: `${product.mapPosition?.x || 50}%`,
      top: `${product.mapPosition?.y || 50}%`
    }}
  >
    <div className={`relative ${isSelected ? 'animate-bounce' : ''}`}>
      {/* 마커 핀 */}
      <div className={`w-8 h-8 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold ${
        product.isFree ? 'bg-green-500' : 'bg-orange-500'
      }`}>
        {product.isFree ? '🥕' : '₩'}
      </div>
      
      {/* 가격 라벨 */}
      <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium shadow-lg border ${
        product.isFree 
          ? 'bg-green-500 text-white border-green-400' 
          : 'bg-white text-gray-800 border-gray-200'
      }`}>
        {product.isFree ? '나눔' : `${product.price?.toLocaleString()}원`}
      </div>
      
      {/* 선택된 마커 강조 */}
      {isSelected && (
        <div className="absolute -inset-4 rounded-full border-2 border-orange-400 border-dashed animate-ping opacity-75"></div>
      )}
    </div>
  </div>
);

// 거리 표시 컴포넌트
const DistanceBadge = ({ distance }) => {
  const getDistanceColor = (dist) => {
    if (dist < 0.5) return 'bg-green-100 text-green-800';
    if (dist < 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDistanceColor(distance)}`}>
      📍 {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
    </span>
  );
};

export default function MapPage() {
  const router = useRouter();
  const mapRef = useRef(null);
  
  // 상태 관리
  const [userLocation, setUserLocation] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchRadius, setSearchRadius] = useState(3); // km
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 서울 기본값
  
  // 필터 상태
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState(['전체']);
  const [onlyFree, setOnlyFree] = useState(false);

  // 사용자 위치 가져오기
  const getUserLocation = () => {
    setIsLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
          setIsLocationLoading(false);
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          setIsLocationLoading(false);
          // 서울 강남구로 기본 설정
          const defaultLocation = { lat: 37.5175, lng: 127.0473 };
          setUserLocation(defaultLocation);
          setMapCenter(defaultLocation);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
      );
    }
  };

  // 컴포넌트 마운트 시 위치 정보 가져오기
  useEffect(() => {
    getUserLocation();
  }, []);

  // 상품 데이터에 위치 정보 추가 (Mock 데이터)
  const productsWithLocation = sampleProducts.map((product, index) => ({
    ...product,
    location: userLocation ? 
      // 사용자 위치 주변 랜덤 분포
      {
        name: product.location,
        lat: userLocation.lat + (Math.random() - 0.5) * 0.02, // ±1km 정도
        lng: userLocation.lng + (Math.random() - 0.5) * 0.02
      } : 
      // 서울 강남구 주변 기본값
      {
        name: product.location,
        lat: 37.5175 + (Math.random() - 0.5) * 0.02,
        lng: 127.0473 + (Math.random() - 0.5) * 0.02
      },
    mapPosition: {
      x: 20 + (index % 6) * 12 + Math.random() * 8, // 20-80% 범위에서 분산
      y: 20 + Math.floor(index / 6) * 15 + Math.random() * 10 // 20-80% 범위에서 분산
    }
  }));

  // 필터링된 상품 목록
  const filteredProducts = productsWithLocation.filter(product => {
    // 거리 필터
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        product.location.lat, product.location.lng
      );
      if (distance > searchRadius) return false;
    }
    
    // 카테고리 필터
    if (!selectedCategories.includes('전체') && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // 나눔 필터
    if (onlyFree && !product.isFree) return false;
    
    // 가격 범위 필터
    if (!product.isFree && (product.price < priceRange[0] || product.price > priceRange[1])) {
      return false;
    }
    
    return true;
  });

  // 거리 순으로 정렬
  const sortedProducts = filteredProducts
    .map(product => ({
      ...product,
      distance: userLocation ? calculateDistance(
        userLocation.lat, userLocation.lng,
        product.location.lat, product.location.lng
      ) : 0
    }))
    .sort((a, b) => a.distance - b.distance);

  const categories = ['전체', '디지털기기', '생활가전', '가구/인테리어', '생활/주방', '여성의류', '남성패션/잡화'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="근처 상품 찾기" 
        showBackButton={true}
        customActions={
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {userLocation ? `반경 ${searchRadius}km` : '위치 확인 중...'}
            </span>
            <button
              onClick={() => setShowProductList(!showProductList)}
              className="md:hidden bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition-colors"
            >
              {showProductList ? '지도 보기' : '목록 보기'}
            </button>
          </div>
        }
      />

      <div className="flex h-[calc(100vh-80px)]">
        {/* 왼쪽 사이드바: 필터 및 상품 목록 */}
        <div className={`${showProductList ? 'block' : 'hidden'} md:block w-full md:w-96 bg-white border-r shadow-lg overflow-hidden flex flex-col`}>
          {/* 필터 섹션 */}
          <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-yellow-50">
            <div className="space-y-4">
              {/* 내 위치 버튼 */}
              <button
                onClick={getUserLocation}
                disabled={isLocationLoading}
                className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all ${
                  isLocationLoading 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {isLocationLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                    <span>위치 확인 중...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>내 위치로 이동</span>
                  </>
                )}
              </button>

              {/* 검색 반경 조절 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  검색 반경: {searchRadius}km
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5km</span>
                  <span>10km</span>
                </div>
              </div>

              {/* 카테고리 필터 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                <div className="flex flex-wrap gap-1">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        if (category === '전체') {
                          setSelectedCategories(['전체']);
                        } else {
                          setSelectedCategories(prev => {
                            const filtered = prev.filter(c => c !== '전체');
                            if (filtered.includes(category)) {
                              const result = filtered.filter(c => c !== category);
                              return result.length === 0 ? ['전체'] : result;
                            } else {
                              return [...filtered, category];
                            }
                          });
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded-full transition-all ${
                        selectedCategories.includes(category)
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* 나눔 필터 */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="onlyFree"
                  checked={onlyFree}
                  onChange={(e) => setOnlyFree(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="onlyFree" className="ml-2 text-sm text-gray-700">
                  🥕 나눔만 보기
                </label>
              </div>
            </div>
          </div>

          {/* 상품 목록 */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  근처 상품 ({sortedProducts.length}개)
                </h3>
                {userLocation && (
                  <span className="text-xs text-gray-500">거리순 정렬</span>
                )}
              </div>
              
              {sortedProducts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">반경 내 상품이 없습니다</p>
                  <p className="text-xs text-gray-400 mt-1">검색 반경을 늘려보세요</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedProducts.map(product => (
                    <div 
                      key={product.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedProduct?.id === product.id 
                          ? 'ring-2 ring-orange-500 shadow-lg scale-105' 
                          : 'hover:shadow-md hover:scale-102'
                      }`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="relative">
                        <ProductCard product={product} compact />
                        {userLocation && (
                          <div className="absolute top-2 right-2">
                            <DistanceBadge distance={product.distance} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽: 지도 영역 */}
        <div className={`${showProductList ? 'hidden' : 'block'} md:block flex-1 relative bg-gradient-to-br from-blue-50 to-green-50`}>
          {/* 지도 컨테이너 (임시 - 실제로는 Kakao Map이 들어갈 영역) */}
          <div 
            ref={mapRef}
            className="w-full h-full relative overflow-hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='nonzero'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            {/* 지도 중심 표시 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-6xl opacity-20">🗺️</div>
            </div>

            {/* 사용자 위치 마커 */}
            {userLocation && (
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ left: '50%', top: '50%' }}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute -inset-2 border-2 border-blue-400 rounded-full animate-ping opacity-30"></div>
                </div>
              </div>
            )}

            {/* 상품 마커들 */}
            {sortedProducts.map(product => (
              <MapMarker
                key={product.id}
                product={product}
                onClick={setSelectedProduct}
                isSelected={selectedProduct?.id === product.id}
              />
            ))}

            {/* 검색 반경 표시 */}
            {userLocation && (
              <div 
                className="absolute border-2 border-blue-300 border-opacity-50 rounded-full pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${searchRadius * 40}px`, // 대략적인 비율
                  height: `${searchRadius * 40}px`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }}
              />
            )}
          </div>

          {/* 지도 컨트롤 */}
          <div className="absolute top-4 right-4 space-y-2">
            <button 
              className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
              onClick={getUserLocation}
            >
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 선택된 상품 상세 팝업 */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">상품 정보</h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <ProductCard product={selectedProduct} />
              
              {userLocation && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">거리</span>
                    <DistanceBadge distance={selectedProduct.distance} />
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => router.push(`/products/${selectedProduct.id}`)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  상세보기
                </button>
                <button
                  onClick={() => {
                    const sellerId = selectedProduct.seller?.id || (200 + selectedProduct.id);
                    router.push(`/chat/${selectedProduct.id}/${sellerId}`);
                  }}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  채팅하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 