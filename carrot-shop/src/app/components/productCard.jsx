'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ProductCard({ product, compact = false }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // 할인율 계산
  const getDiscountRate = () => {
    if (product.originalPrice && product.price && !product.isFree) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  const discountRate = getDiscountRate();

  // 네이버 스타일 가격 표시 로직
  const renderNaverPrice = () => {
    if (product.isFree) {
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="discount-badge">나눔</span>
          </div>
          <div className="text-lg font-bold text-green-600">무료 나눔</div>
          <div className="text-xs text-green-500">🥕 따뜻한 나눔</div>
        </div>
      );
    }
    
    if (product.acceptOffersOnly || product.price === null) {
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500 text-white font-bold rounded px-2 py-1 text-xs">제안받기</span>
          </div>
          <div className="text-lg font-bold text-blue-600">가격제안</div>
          <div className="text-xs text-blue-500">💰 원하는 가격 제안</div>
        </div>
      );
    }
    
    return (
      <div className="space-y-1">
        {discountRate > 0 && (
          <div className="flex items-center space-x-2">
            <span className="discount-badge">{discountRate}%</span>
            {product.negotiable && (
              <span className="brand-badge">네고가능</span>
            )}
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          {product.originalPrice && discountRate > 0 && (
            <span className="original-price text-sm">
              {product.originalPrice.toLocaleString()}원
            </span>
          )}
        </div>
        
        <div className="sale-price text-xl font-bold">
          {product.price.toLocaleString()}원
        </div>
        
        {!discountRate && product.negotiable && (
          <div className="text-xs text-blue-500">💬 가격제안 가능</div>
        )}
      </div>
    );
  };

  // Compact 모드 (지도용) - 네이버 스타일 적용
  if (compact) {
    return (
      <Link href={`/products/${product.id}`}>
        <div className="naver-card overflow-hidden group">
          <div className="flex">
            {/* 이미지 */}
            <div className="relative flex-shrink-0">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* 할인 배지 */}
              {discountRate > 0 && (
                <div className="absolute top-1 left-1">
                  <span className="discount-badge text-xs">{discountRate}%</span>
                </div>
              )}
              
              {/* 상태 배지 */}
              <div className="absolute top-1 right-1">
                <span className={`text-xs px-1 py-0.5 rounded font-medium ${
                  product.status === '판매중' 
                    ? 'bg-green-500 text-white' 
                    : product.status === '예약중'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>

            {/* 내용 */}
            <div className="flex-1 p-3 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm mb-1 truncate leading-tight">
                {product.title}
              </h3>
              
              {/* 가격 (간소화) */}
              <div className="mb-1">
                {product.isFree ? (
                  <span className="text-sm font-bold text-green-600">나눔</span>
                ) : product.acceptOffersOnly || product.price === null ? (
                  <span className="text-sm font-bold text-blue-600">제안받기</span>
                ) : (
                  <div className="flex items-center space-x-1">
                    {discountRate > 0 && (
                      <span className="discount-badge text-xs">{discountRate}%</span>
                    )}
                    <span className="text-sm font-bold text-gray-900">
                      {product.price.toLocaleString()}원
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1 truncate">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="truncate">{typeof product.location === 'object' ? product.location.name : product.location}</span>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{product.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // 일반 모드 - 네이버 플러스스토어 스타일
  return (
    <Link href={`/products/${product.id}`}>
      <div className="naver-card overflow-hidden group relative">
        {/* 할인율 배지 (상단 좌측) */}
        {discountRate > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="discount-badge">{discountRate}%</span>
          </div>
        )}

        {/* 상태 배지 (상단 우측) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col space-y-1">
          {/* 좋아요 버튼 */}
          <button
            onClick={handleLikeClick}
            className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all duration-200 shadow-sm"
          >
            <svg
              className={`w-4 h-4 ${
                isLiked ? 'text-red-500 fill-current' : 'text-gray-600'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          
          {/* 상태 배지 */}
          <div className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
            product.status === '판매중' 
              ? 'bg-green-500 text-white' 
              : product.status === '예약중'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {product.status}
          </div>
        </div>

        {/* 이미지 */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* 그라데이션 오버레이 (하단) */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-4">
          {/* 카테고리 & 브랜드 정보 */}
          <div className="flex items-center justify-between mb-2">
            <span className="brand-badge">{product.category}</span>
            <span className="text-xs text-gray-500">{product.createdAt}</span>
          </div>

          {/* 상품명 */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight text-base">
            {product.title}
          </h3>
          
          {/* 상품 설명 */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {product.desc}
          </p>

          {/* 가격 섹션 */}
          <div className="mb-4">
            {renderNaverPrice()}
          </div>

          {/* 하단 정보 */}
          <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
            <div className="flex items-center space-x-1 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 616 0z" />
              </svg>
              <span className="truncate">{typeof product.location === 'object' ? product.location.name : product.location}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-500">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{product.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{product.chats}</span>
              </div>
            </div>
          </div>

          {/* 특별 태그들 */}
          <div className="flex items-center space-x-2 mt-3">
            {product.isFree && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                🥕 나눔
              </span>
            )}
            {product.acceptOffersOnly && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                💰 제안
              </span>
            )}
            {!product.isFree && !product.acceptOffersOnly && product.negotiable && (
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                💬 네고
              </span>
            )}
            {discountRate > 15 && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                🔥 특가
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
