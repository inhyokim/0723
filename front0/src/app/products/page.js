'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiInfo, setApiInfo] = useState(null);

  useEffect(() => {
    console.log('🛍️ Products API 호출 시작...');
    
    // 쿼리 파라미터 예제: 재고 있는 상품만 가져오기
    fetch('/api/products?includeOutOfStock=false')
      .then(res => {
        console.log('API 응답 상태:', res.status);
        console.log('API 응답 헤더:', Object.fromEntries(res.headers.entries()));
        
        if (!res.ok) {
          throw new Error(`API 호출 실패: ${res.status}`);
        }
        return res.json();
      })
      .then(response => {
        console.log('🛍️ Products API 응답:', response);
        
        if (response.success) {
          // 새로운 응답 구조에 맞게 데이터 추출
          setProducts(response.data.products);
          setApiInfo({
            total: response.data.total,
            filters: response.data.filters,
            source: 'Products API',
            timestamp: response.timestamp,
            version: response.version,
            message: response.message
          });
        } else {
          throw new Error(response.message || '알 수 없는 에러');
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Products API 에러:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-secondary)' }}>상품 목록을 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">❌ API 에러: {error}</p>
          <Link 
            href="/" 
            className="inline-block font-semibold px-6 py-3 rounded-lg transition-colors text-white"
            style={{ backgroundColor: 'var(--button-bg)' }}
          >
            🏠 홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center font-medium transition-colors"
            style={{ color: 'var(--text-accent)' }}
          >
            ← 홈으로 돌아가기
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            🛍️ 상품 목록 (커스텀 API)
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {apiInfo?.message || `API에서 가져온 ${products.length}개의 상품`}
          </p>

          {/* 향상된 API 정보 표시 */}
          {apiInfo && (
            <div 
              className="mt-6 border rounded-lg p-6 text-sm"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>📊 상품 정보</strong>
                  <p>총 상품 수: {apiInfo.total}개</p>
                  <p>API 버전: {apiInfo.version}</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>🔧 필터 설정</strong>
                  <p>카테고리: {apiInfo.filters?.category}</p>
                  <p>재고 없는 상품: {apiInfo.filters?.includeOutOfStock ? '포함' : '제외'}</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>⏰ API 정보</strong>
                  <p>출처: {apiInfo.source}</p>
                  <p>호출 시간: {new Date(apiInfo.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 상품이 없는 경우 */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              상품이 없습니다
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              조건에 맞는 상품이 없거나 재고가 모두 소진되었습니다.
            </p>
          </div>
        ) : (
          /* 상품 목록 */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map(product => (
              <div 
                key={product.id} 
                className="rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border"
                style={{ 
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  boxShadow: '0 4px 6px -1px var(--shadow-color)'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-accent)' }}
                  >
                    상품 #{product.id}
                  </span>
                  <div className="flex flex-col items-end">
                    <span 
                      className="text-xs px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: product.stock > 0 ? '#10b981' : '#ef4444',
                        color: 'white'
                      }}
                    >
                      {product.stock > 0 ? `재고 ${product.stock}개` : '품절'}
                    </span>
                    <span 
                      className="text-xs mt-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <h2 
                  className="text-lg font-semibold mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {product.title}
                </h2>
                
                <div className="flex items-center justify-between mt-6">
                  <span 
                    className="text-xl font-bold"
                    style={{ color: 'var(--text-accent)' }}
                  >
                    {product.price.toLocaleString()}원
                  </span>
                  
                  <button 
                    className="text-sm font-medium px-4 py-2 rounded transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: product.stock > 0 ? 'var(--button-bg)' : '#6b7280' }}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? '장바구니 담기' : '품절'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* API 테스트 섹션 */}
        <div className="mt-16 text-center">
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            🧪 API 테스트
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/api/products"
              target="_blank"
              className="inline-block px-4 py-2 rounded text-white text-sm transition-colors"
              style={{ backgroundColor: 'var(--button-bg)' }}
            >
              전체 상품 API
            </a>
            <a
              href="/api/products?category=컴퓨터"
              target="_blank"
              className="inline-block px-4 py-2 rounded text-white text-sm transition-colors"
              style={{ backgroundColor: '#8b5cf6' }}
            >
              컴퓨터 카테고리만
            </a>
            <a
              href="/api/products?limit=2"
              target="_blank"
              className="inline-block px-4 py-2 rounded text-white text-sm transition-colors"
              style={{ backgroundColor: '#f59e0b' }}
            >
              2개 제한
            </a>
            <a
              href="/api/products?includeOutOfStock=true"
              target="_blank"
              className="inline-block px-4 py-2 rounded text-white text-sm transition-colors"
              style={{ backgroundColor: '#ef4444' }}
            >
              품절 상품 포함
            </a>
          </div>
        </div>

        <div className="text-center mt-12">
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            데이터 출처: <span style={{ color: 'var(--text-accent)' }}>커스텀 API (/api/products)</span>
          </p>
          <p 
            className="text-xs mt-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            💡 다양한 상태코드와 헤더 커스터마이징이 적용된 RESTful API
          </p>
        </div>
      </div>
    </div>
  );
} 