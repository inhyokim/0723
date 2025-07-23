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
    
    fetch('/api/products')
      .then(res => {
        if (!res.ok) {
          throw new Error(`API 호출 실패: ${res.status}`);
        }
        return res.json();
      })
      .then(response => {
        console.log('🛍️ Products API 응답:', response);
        
        // API 응답 구조에 따라 데이터 처리
        if (response.success) {
          setProducts(response.data?.products || response.data || []);
          setApiInfo({
            totalProducts: response.data?.totalProducts || response.data?.length || 0,
            source: response.source || 'Products API',
            timestamp: response.timestamp
          });
        } else {
          // 단순 배열 응답인 경우
          setProducts(Array.isArray(response) ? response : []);
          setApiInfo({
            totalProducts: Array.isArray(response) ? response.length : 0,
            source: 'Products API',
            timestamp: new Date().toISOString()
          });
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
            🛍️ 상품 목록
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            API에서 가져온 {products.length}개의 상품
          </p>

          {/* API 정보 표시 */}
          {apiInfo && (
            <div 
              className="mt-4 border rounded-lg p-4 text-sm"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>📊 상품 정보:</strong>
                  <p>총 상품 수: {apiInfo.totalProducts}개</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>🔧 API 정보:</strong>
                  <p>출처: {apiInfo.source}</p>
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
              아직 등록된 상품이 없습니다.
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
                  <span 
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {product.category || '기타'}
                  </span>
                </div>
                
                <h2 
                  className="text-lg font-semibold mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {product.title || product.name || '제품명 없음'}
                </h2>
                
                <p 
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {product.description || product.body || '설명 없음'}
                </p>

                <div className="flex items-center justify-between">
                  <span 
                    className="text-lg font-bold"
                    style={{ color: 'var(--text-accent)' }}
                  >
                    {product.price ? `${product.price.toLocaleString()}원` : '가격 미정'}
                  </span>
                  
                  <button 
                    className="text-sm font-medium px-4 py-2 rounded transition-colors text-white"
                    style={{ backgroundColor: 'var(--button-bg)' }}
                  >
                    상세보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            데이터 출처: <span style={{ color: 'var(--text-accent)' }}>내부 API (/api/products)</span>
          </p>
          <p 
            className="text-xs mt-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            💡 실시간 API 데이터로 업데이트됩니다
          </p>
        </div>
      </div>
    </div>
  );
} 