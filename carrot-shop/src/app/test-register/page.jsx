'use client';
import { useState } from 'react';
import { supabaseUtils } from '@/lib/supabase';

export default function TestRegisterPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBasicProduct = async () => {
    setLoading(true);
    setResult('상품 등록 테스트 시작...\n');
    
    try {
      // 기본 상품 데이터
      const testProduct = {
        title: '테스트 상품 ' + Date.now(),
        description: '이것은 상품 등록 테스트입니다',
        price: 10000,
        category: '테스트',
        condition: '새상품',
        location: '테스트 지역',
        is_free: false,
        is_negotiable: true,
        main_image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        seller_id: '550e8400-e29b-41d4-a716-446655440000',
        status: '판매중',
        likes: 0,
        chats: 0,
        views: 0
      };

      setResult(prev => prev + '데이터 준비 완료\n');
      setResult(prev => prev + JSON.stringify(testProduct, null, 2) + '\n\n');

      // Supabase에 저장
      setResult(prev => prev + 'Supabase에 저장 중...\n');
      const createdProduct = await supabaseUtils.products.create(testProduct);
      
      setResult(prev => prev + '✅ 상품 등록 성공!\n');
      setResult(prev => prev + 'ID: ' + createdProduct.id + '\n');
      setResult(prev => prev + 'Title: ' + createdProduct.title + '\n');
      setResult(prev => prev + 'Created: ' + createdProduct.created_at + '\n\n');

      // localStorage 플래그 설정
      localStorage.setItem('newProductAdded', 'true');
      localStorage.setItem('newProductId', createdProduct.id.toString());
      
      setResult(prev => prev + '📢 메인 페이지 새로고침 플래그 설정 완료\n');
      setResult(prev => prev + '🎉 모든 테스트 완료! 메인 페이지를 확인해보세요.\n');

    } catch (error) {
      setResult(prev => prev + '❌ 오류 발생:\n');
      setResult(prev => prev + error.message + '\n');
      setResult(prev => prev + JSON.stringify(error, null, 2) + '\n');
    } finally {
      setLoading(false);
    }
  };

  const testFreeProduct = async () => {
    setLoading(true);
    setResult('무료 나눔 상품 등록 테스트 시작...\n');
    
    try {
      const freeProduct = {
        title: '무료 나눔 ' + Date.now(),
        description: '무료로 나눔합니다',
        price: 0,
        category: '나눔',
        condition: '상태 좋음',
        location: '서울시 강남구',
        is_free: true,
        is_negotiable: false,
        main_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        seller_id: '550e8400-e29b-41d4-a716-446655440000',
        status: '판매중',
        likes: 0,
        chats: 0,
        views: 0
      };

      const createdProduct = await supabaseUtils.products.create(freeProduct);
      
      setResult(prev => prev + '✅ 무료 나눔 상품 등록 성공!\n');
      setResult(prev => prev + 'ID: ' + createdProduct.id + '\n');
      setResult(prev => prev + 'Price: ' + createdProduct.price + ' (무료)\n');

      localStorage.setItem('newProductAdded', 'true');
      setResult(prev => prev + '🎉 무료 나눔 테스트 완료!\n');

    } catch (error) {
      setResult(prev => prev + '❌ 무료 나눔 오류:\n' + error.message + '\n');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 상품 등록 테스트</h1>
          
          <div className="space-y-4 mb-6">
            <button 
              onClick={testBasicProduct}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '테스트 중...' : '🛍️ 기본 상품 등록 테스트'}
            </button>
            
            <button 
              onClick={testFreeProduct}
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? '테스트 중...' : '🥕 무료 나눔 등록 테스트'}
            </button>
            
            <button 
              onClick={clearResults}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600"
            >
              🗑️ 결과 지우기
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
            <pre>{result || '테스트 버튼을 클릭하세요...'}</pre>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 테스트 후 확인사항</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>1. 메인 페이지(/)에서 새 상품이 보이는지 확인</li>
              <li>2. 상품 목록(/products)에서 새 상품이 보이는지 확인</li>
              <li>3. 데이터베이스 진단(/debug-db)에서 저장 확인</li>
              <li>4. 오류가 있다면 브라우저 콘솔에서 자세한 로그 확인</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 