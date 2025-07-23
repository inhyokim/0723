'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // 가격 표시 로직
  const renderPrice = () => {
    if (product.isFree) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-green-600">나눔</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            🥕 무료나눔
          </span>
        </div>
      );
    }
    
    if (product.acceptOffersOnly || product.price === null) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-blue-600">제안받기</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            💰 가격제안
          </span>
        </div>
      );
    }
    
    // 일반 가격 표시
    return (
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold text-gray-900">
          {product.price.toLocaleString()}원
        </span>
        {product.originalPrice && (
          <span className="text-sm text-gray-400 line-through">
            {product.originalPrice.toLocaleString()}원
          </span>
        )}
      </div>
    );
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer">
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
          
          {/* 상태 배지 */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              product.status === '판매중' 
                ? 'bg-orange-500 text-white' 
                : product.status === '예약중'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              {product.status}
            </span>
          </div>

          {/* 좋아요 버튼 */}
          <button
            onClick={handleLikeClick}
            className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all duration-200"
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
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.desc}
          </p>

          {/* 가격 표시 */}
          <div className="mb-3">
            {renderPrice()}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{product.location}</span>
            </div>
            <span>{product.createdAt}</span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3 text-sm text-gray-500">
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
            
            {/* 특별 표시 */}
            <div className="flex items-center space-x-1 text-xs">
              {product.isFree && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  나눔
                </span>
              )}
              {product.acceptOffersOnly && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  제안
                </span>
              )}
              {!product.isFree && !product.acceptOffersOnly && product.negotiable && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                  네고
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
