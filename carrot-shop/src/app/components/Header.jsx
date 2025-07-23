import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Header({ title, showBackButton = false, customActions = null }) {
  const router = useRouter();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (title) return title;
    
    switch (pathname) {
      case '/products':
        return '중고거래';
      case '/sell':
        return '상품 등록';
      default:
        if (pathname.startsWith('/products/')) {
          return '상품 상세';
        }
        return '당근샵';
    }
  };

  const isHomePage = pathname === '/';

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 로고/뒤로가기 + 제목 */}
          <div className="flex items-center space-x-4">
            {showBackButton ? (
              <button 
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">뒤로가기</span>
              </button>
            ) : (
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🥕</span>
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:inline">당근샵</span>
              </Link>
            )}
            
            {!isHomePage && (
              <div className="flex items-center space-x-2">
                <div className="w-px h-6 bg-gray-300"></div>
                <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
              </div>
            )}
          </div>

          {/* 오른쪽: 네비게이션 메뉴 */}
          <div className="flex items-center space-x-4">
            {customActions || (
              <>
                {/* 홈이 아닌 경우에만 네비게이션 표시 */}
                {!isHomePage && (
                  <>
                    <Link 
                      href="/"
                      className="text-gray-600 hover:text-orange-600 font-medium transition-colors hidden sm:inline-flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>홈</span>
                    </Link>
                    
                    <Link 
                      href="/products"
                      className={`font-medium transition-colors ${
                        pathname.startsWith('/products') 
                          ? 'text-orange-600' 
                          : 'text-gray-600 hover:text-orange-600'
                      }`}
                    >
                      중고거래
                    </Link>
                    
                    <Link 
                      href="/map"
                      className={`text-gray-600 hover:text-orange-600 font-medium transition-colors hidden sm:inline-flex items-center space-x-1 ${
                        pathname === '/map' ? 'text-orange-600' : ''
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>내 근처</span>
                    </Link>
                  </>
                )}
                
                <Link 
                  href="/my-products"
                  className={`text-gray-600 hover:text-orange-600 font-medium transition-colors hidden sm:inline-flex items-center space-x-1 ${
                    pathname === '/my-products' ? 'text-orange-600' : ''
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>내 상품</span>
                </Link>

                <Link 
                  href="/sell"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    pathname === '/sell' || pathname.startsWith('/sell/')
                      ? 'bg-orange-600 text-white'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  + 판매하기
                </Link>

                {/* 모바일 메뉴 버튼 */}
                <button className="sm:hidden p-2 text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 페이지별 추가 정보 */}
        {pathname === '/products' && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>우리 동네 중고거래</span>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>경기도 성남시</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 