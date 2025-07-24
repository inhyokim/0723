'use client';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabaseUtils } from '@/lib/supabase';
import ProductCard from './components/productCard';

export default function Home() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // 최신 상품 로드
  const loadRecentProducts = async () => {
    try {
      setLoading(true);
      console.log('메인 페이지: 최신 상품 로딩 시작', new Date().toISOString());
      const data = await supabaseUtils.products.getAllWithSeller();
      
      console.log('🔍 메인 페이지: 원본 데이터 확인', {
        isArray: Array.isArray(data),
        length: data?.length || 0,
        firstItem: data?.[0] || null
      });
        
      if (!Array.isArray(data)) {
        console.error('❌ 메인 페이지: data가 배열이 아님!', typeof data, data);
        setRecentProducts([]);
        return;
      }
        
        // 최신 6개 상품만 가져오기
        const recentData = data.slice(0, 6).map(product => ({
          ...product,
          desc: product.description || '상품 설명이 없습니다',
          image: product.main_image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
          images: product.product_images && product.product_images.length > 0 
            ? product.product_images
                .sort((a, b) => a.sort_order - b.sort_order)
                .map(img => img.image_url)
            : product.main_image ? [product.main_image] : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'],
          createdAt: new Date(product.created_at).toLocaleDateString(),
          
          // ProductCard가 기대하는 모든 필드들 안전하게 설정
          title: product.title || '제목 없음',
          price: product.is_free ? 0 : (product.price || 0),
          originalPrice: product.original_price || null,
          isFree: product.is_free || false,
          acceptOffersOnly: product.accept_offers_only || false,
          negotiable: product.is_negotiable || false,
          status: product.status || '판매중',
          category: product.category || '기타',
          condition: product.condition || '사용감 있음',
          location: product.location || '위치 정보 없음',
          likes: product.likes || 0,
          chats: product.chats || 0,
          views: product.views || 0,
          
          seller: product.user_profiles ? {
            id: product.user_profiles.id,
            name: product.user_profiles.name || '판매자',
            profileImage: product.user_profiles.profile_image || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
            rating: product.user_profiles.rating || 4.5,
            reviewCount: product.user_profiles.review_count || 0,
            responseRate: product.user_profiles.response_rate || '95%',
            responseTime: product.user_profiles.response_time || '보통 1시간 이내'
          } : {
            id: product.seller_id || 'unknown',
            name: '판매자',
            profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
            rating: 4.5,
            reviewCount: 0,
            responseRate: '95%',
            responseTime: '보통 1시간 이내'
          }
        }));
        
        console.log(`메인 페이지: ${data.length}개 상품 로딩 완료, 최신 6개 표시:`, recentData.map(p => ({ id: p.id, title: p.title, created_at: p.created_at })));
        
        console.log('🎯 메인 페이지: recentProducts 설정 전', { 
          currentLength: recentProducts.length,
          newLength: recentData.length,
          loading: loading
        });
        
        setRecentProducts(recentData);
        
        console.log('✅ 메인 페이지: recentProducts 설정 완료');
      } catch (error) {
        console.error('상품 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };

  // 컴포넌트 마운트 시 & 페이지 포커스 시 데이터 로드
  useEffect(() => {
    // URL에 refresh 파라미터가 있으면 즉시 새로고침
    const refreshParam = searchParams.get('refresh');
    if (refreshParam) {
      console.log('URL refresh 파라미터 감지, 즉시 데이터 새로고침');
      loadRecentProducts();
      // URL 정리 (브라우저 히스토리는 유지)
      window.history.replaceState({}, '', '/');
      return;
    }

    loadRecentProducts();

    // 페이지 포커스 시 데이터 새로고침
    const handleFocus = () => {
      loadRecentProducts();
    };

    // 상품 등록 완료 플래그 체크
    const checkNewProduct = () => {
      const hasNewProduct = localStorage.getItem('newProductAdded');
      if (hasNewProduct) {
        console.log('새 상품 등록 감지, 데이터 새로고침');
        loadRecentProducts();
        localStorage.removeItem('newProductAdded');
      }
    };

    // 페이지 로드 시 즉시 체크
    checkNewProduct();
    
    // 주기적 체크 (3초마다)
    const intervalCheck = setInterval(checkNewProduct, 3000);

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalCheck);
    };
  }, [searchParams]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🥕</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">당근샵</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/products" className="text-gray-700 hover:text-orange-600 font-medium">
                중고거래
              </Link>
              <Link href="/map" className="text-gray-700 hover:text-orange-600 font-medium">
                근처 상품
              </Link>
              <Link href="/sell" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                판매하기
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* 히어로 섹션 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            우리 동네 중고거래
            <br />
            <span className="text-orange-500">당근샵</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            믿을 수 있는 이웃과 가깝고 따뜻한 거래를 지금 경험해보세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/products"
              className="w-full sm:w-auto bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg"
            >
              상품 둘러보기
            </Link>
            <Link 
              href="/map"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              🗺️ 근처 상품 찾기
            </Link>
            <Link 
              href="/sell"
              className="w-full sm:w-auto border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              내 상품 판매하기
            </Link>
          </div>
        </div>

        {/* 특징 섹션 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 616 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">우리 동네 거래</h3>
            <p className="text-gray-600">가까운 거리에서 직접 만나서 안전하게 거래하세요.</p>
          </div>

          {/* 새로운 지도 기능 카드 */}
          <Link href="/map" className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:scale-105 group">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-blue-800">지도로 찾기</h3>
            <p className="text-blue-600">지도에서 우리 동네 상품들을 한눈에 확인하세요.</p>
          </Link>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">믿을 수 있는 거래</h3>
            <p className="text-gray-600">실명 인증과 후기 시스템으로 안전한 거래를 보장합니다.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">간편한 거래</h3>
            <p className="text-gray-600">채팅으로 소통하고 몇 번의 클릭으로 쉽게 거래하세요.</p>
          </div>
        </div>

        {/* 지도 기능 하이라이트 섹션 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center mb-16 shadow-xl">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              🗺️ 새로운 지도 기능을 경험해보세요!
            </h2>
            <p className="text-xl text-blue-100 mb-6">
              내 위치 주변의 상품들을 지도에서 한눈에 확인하고, 거리별로 필터링해서 가장 가까운 상품부터 찾아보세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/map"
                className="w-full sm:w-auto bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                🗺️ 지도에서 상품 찾기
              </Link>
              <Link 
                href="/products"
                className="w-full sm:w-auto border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                목록으로 보기
              </Link>
            </div>
          </div>
        </div>

        {/* 최신 상품 섹션 */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 className="text-3xl font-bold text-gray-900">🔥 최신 등록 상품</h2>
              <button
                onClick={loadRecentProducts}
                disabled={loading}
                className={`p-2 rounded-lg transition-all ${
                  loading 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed animate-spin' 
                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                }`}
                title="새로고침"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              지금 막 등록된 따끈따끈한 상품들을 확인해보세요
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentProducts.length > 0 ? (
            <>
              {console.log('🎨 메인 페이지: 상품 렌더링 시작', { count: recentProducts.length, products: recentProducts.map(p => p.title) })}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProducts.map(product => {
                  console.log('🔧 ProductCard 렌더링:', { id: product.id, title: product.title });
                  // 임시로 간단한 div로 렌더링해서 문제 진단
                  return (
                    <div key={product.id} className="bg-white rounded-lg shadow-md p-4 border">
                      <div className="mb-3">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-48 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
                          }}
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{product.desc}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-600 font-bold">
                          {product.isFree ? '무료 나눔' : `${(product.price || 0).toLocaleString()}원`}
                        </span>
                        <span className="text-gray-500 text-sm">{product.location}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        ❤️ {product.likes} | 💬 {product.chats}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-8">
                <Link 
                  href="/products"
                  className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg"
                >
                  더 많은 상품 보기
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              {console.log('📭 메인 페이지: 빈 상태 렌더링', { loading, recentProductsLength: recentProducts.length })}
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8h4m-4 8h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">아직 등록된 상품이 없어요</h3>
              <p className="text-gray-500 mb-6">첫 번째 상품을 등록해보세요!</p>
              <Link 
                href="/sell"
                className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                상품 등록하기
              </Link>
            </div>
          )}
        </div>

        {/* CTA 섹션 */}
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            지금 바로 시작해보세요!
          </h2>
          <p className="text-gray-600 mb-6">
            우리 동네 이웃들과 따뜻한 거래를 경험해보세요.
          </p>
          <Link 
            href="/sell"
            className="inline-block bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg"
          >
            지금 판매 시작하기
          </Link>
        </div>
      </main>
    </div>
  );
}
