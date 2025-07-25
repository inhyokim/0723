'use client';
import Link from 'next/link';

export default function SimpleProductCard({ product }) {
  // 안전한 데이터 접근
  const title = product?.title || '상품명 없음';
  const price = product?.price || 0;
  const isFree = product?.isFree || false;
  const image = product?.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
  const category = product?.category || '기타';
  const location = product?.location || '위치 없음';
  const likes = product?.likes || 0;
  const chats = product?.chats || 0;
  const status = product?.status || '판매중';

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        {/* 이미지 */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
            }}
          />
          
          {/* 상태 배지 */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              status === '판매중' 
                ? 'bg-green-500 text-white' 
                : status === '예약중'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              {status}
            </span>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-4">
          {/* 카테고리 */}
          <div className="text-xs text-gray-500 mb-1">{category}</div>
          
          {/* 상품명 */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
          
          {/* 가격 */}
          <div className="mb-3">
            {isFree ? (
              <div className="text-lg font-bold text-green-600">무료 나눔</div>
            ) : (
              <div className="text-lg font-bold text-gray-900">
                {price.toLocaleString()}원
              </div>
            )}
          </div>

          {/* 하단 정보 */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="truncate">{location}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{likes}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{chats}</span>
              </div>
            </div>
          </div>

          {/* 태그들 */}
          <div className="flex items-center space-x-2 mt-3">
            {isFree && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                🥕 나눔
              </span>
            )}
            {product?.negotiable && (
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                💬 네고가능
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 