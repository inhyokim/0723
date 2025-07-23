'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/app/components/Header';
import MannerTemperature from '@/app/components/MannerTemperature';
import { getProductById } from '@/app/data/products';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id);

  const product = getProductById(productId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // 카테고리 클릭 시 해당 카테고리로 필터링된 상품 페이지로 이동
  const handleCategoryClick = (category) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h2>
          <button 
            onClick={() => router.back()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 공유 및 좋아요 액션
  const customActions = (
    <div className="flex items-center space-x-3">
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>
      <button 
        onClick={() => setIsLiked(!isLiked)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 사용 (뒤로가기 버튼 활성화) */}
      <Header 
        title={product.title} 
        showBackButton={true} 
        customActions={customActions} 
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* 이미지 섹션 */}
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src={product.images[selectedImageIndex]} 
                  alt={product.title}
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    product.status === '판매중' 
                      ? 'bg-orange-500 text-white' 
                      : product.status === '예약중'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
              
              {/* 이미지 썸네일 */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 p-4 bg-gray-50">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 상품 정보 섹션 */}
            <div className="md:w-1/2 p-6">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <button 
                    onClick={() => handleCategoryClick(product.category)}
                    className="text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors"
                  >
                    #{product.category}
                  </button>
                  <span>•</span>
                  <span>{product.createdAt}</span>
                  <span>•</span>
                  <span>조회 {product.views}</span>
                </div>
              </div>

              {/* 가격 */}
              <div className="mb-6">
                {/* 나눔 상품 */}
                {product.isFree ? (
                  <div className="mb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-4xl font-bold text-green-600">나눔</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        🥕 무료나눔
                      </span>
                    </div>
                    <p className="text-lg text-green-700 font-medium">따뜻한 나눔으로 드려요!</p>
                  </div>
                ) : product.acceptOffersOnly || product.price === null ? (
                  /* 가격제안만 받기 상품 */
                  <div className="mb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-4xl font-bold text-blue-600">제안받기</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        💰 가격제안
                      </span>
                    </div>
                    <p className="text-lg text-blue-700 font-medium">원하시는 가격을 제안해주세요!</p>
                  </div>
                ) : (
                  /* 일반 상품 */
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-orange-600">
                      {product.price.toLocaleString()}원
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                    )}
                  </div>
                )}
                
                <div className="text-sm text-gray-600">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {product.location}
                </div>
              </div>

              {/* 상품 설명 */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">상품 설명</h3>
                <p className="text-gray-700 leading-relaxed">{product.desc}</p>
              </div>

              {/* 상품 정보 */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">상품 정보</h3>
                <div className="space-y-2">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600">{spec.label}</span>
                      <span className="font-medium text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 관심 표시 */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>관심 {product.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>채팅 {product.chats}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 판매자 정보 */}
          <div className="border-t bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">판매자 정보</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={product.seller.profileImage} 
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900 mb-2">{product.seller.name}</div>
                  {/* 매너온도 컴포넌트 */}
                  <div className="mb-2">
                    <MannerTemperature 
                      rating={product.seller.rating} 
                      reviewCount={product.seller.reviewCount}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    응답률 {product.seller.responseRate} • {product.seller.responseTime}
                  </div>
                </div>
              </div>
              <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                판매자 상품 더보기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-lg border transition-colors ${isLiked ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
          >
            <svg className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className={`flex-1 text-white py-4 rounded-lg font-semibold text-lg transition-colors ${
            product.isFree 
              ? 'bg-green-500 hover:bg-green-600' 
              : product.acceptOffersOnly || product.price === null
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-orange-500 hover:bg-orange-600'
          }`}>
            {product.isFree 
              ? '🥕 나눔 문의하기' 
              : product.acceptOffersOnly || product.price === null
              ? '💰 가격 제안하기'
              : '채팅하기'
            }
          </button>
        </div>
      </div>

      {/* 하단 여백 (고정 버튼 때문에) */}
      <div className="h-20"></div>
    </div>
  );
} 