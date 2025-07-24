'use client';
import { useState, useEffect } from 'react';
import { supabaseUtils, supabase } from '@/lib/supabase';

export default function DatabaseDebugPage() {
  const [products, setProducts] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 데이터베이스 직접 조회 시작...');
      
      // 1. 원시 데이터 직접 조회
      const { data: rawProducts, error: rawError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (rawError) {
        console.error('❌ 원시 데이터 조회 오류:', rawError);
        setError('원시 데이터 조회 실패: ' + rawError.message);
        return;
      }
      
      console.log('✅ 원시 데이터 조회 성공:', rawProducts?.length || 0, '개');
      console.log('📄 원시 데이터:', rawProducts);
      setRawData(rawProducts || []);
      
      // 2. supabaseUtils를 통한 조회
      const utilsData = await supabaseUtils.products.getAll();
      console.log('✅ supabaseUtils 조회 성공:', utilsData?.length || 0, '개');
      console.log('📄 Utils 데이터:', utilsData);
      
      // 3. 조인 쿼리 테스트
      try {
        const joinData = await supabaseUtils.products.getAllWithSeller();
        console.log('✅ 조인 쿼리 성공:', joinData?.length || 0, '개');
        console.log('📄 조인 데이터:', joinData);
        setProducts(joinData || []);
      } catch (joinError) {
        console.warn('⚠️ 조인 쿼리 실패:', joinError);
        setProducts(utilsData || []);
      }
      
    } catch (err) {
      console.error('💥 전체 오류:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDatabase();
  }, []);

  const deleteAllProducts = async () => {
    if (!confirm('정말로 모든 상품을 삭제하시겠습니까?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .gte('id', 0);
        
      if (error) throw error;
      
      alert('모든 상품이 삭제되었습니다.');
      checkDatabase();
    } catch (err) {
      alert('삭제 실패: ' + err.message);
    }
  };

  const testInsert = async () => {
    try {
      const testProduct = {
        title: '테스트 상품 ' + Date.now(),
        description: '데이터베이스 테스트용 상품입니다',
        price: 10000,
        category: '테스트',
        condition: '새 상품',
        location: '테스트 지역',
        is_negotiable: false,
        is_free: false,
        main_image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
        seller_id: '550e8400-e29b-41d4-a716-446655440000',
        created_at: new Date().toISOString()
      };
      
      const result = await supabaseUtils.products.create(testProduct);
      console.log('✅ 테스트 상품 생성 성공:', result);
      alert('테스트 상품이 생성되었습니다!');
      checkDatabase();
    } catch (err) {
      console.error('❌ 테스트 상품 생성 실패:', err);
      alert('테스트 상품 생성 실패: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">🔍 데이터베이스 진단</h1>
            <div className="space-x-4">
              <button 
                onClick={checkDatabase}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? '조회 중...' : '새로고침'}
              </button>
              <button 
                onClick={testInsert}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                테스트 상품 추가
              </button>
              <button 
                onClick={deleteAllProducts}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                모든 상품 삭제
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <strong>오류:</strong> {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 원시 데이터 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">📄 원시 데이터 ({rawData.length}개)</h2>
              <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                <pre className="text-sm">
                  {JSON.stringify(rawData.slice(0, 3), null, 2)}
                </pre>
              </div>
            </div>

            {/* 변환된 데이터 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">🔧 변환된 데이터 ({products.length}개)</h2>
              <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                <pre className="text-sm">
                  {JSON.stringify(products.slice(0, 3), null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* 최신 상품 목록 */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">📋 최신 상품 목록</h2>
            <div className="space-y-4">
              {rawData.slice(0, 10).map((product, index) => (
                <div key={product.id} className="bg-gray-50 p-4 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{product.title}</h3>
                      <p className="text-gray-600">{product.description}</p>
                      <p className="text-orange-600 font-bold">
                        {product.is_free ? '무료 나눔' : `${product.price?.toLocaleString()}원`}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>ID: {product.id}</p>
                      <p>생성: {new Date(product.created_at).toLocaleString()}</p>
                      <p>판매자: {product.seller_id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 