import Link from "next/link";

export default function Home() {
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
            <p className="text-gray-600">내 위치 근처 상품을 지도에서 한눈에 확인하세요.</p>
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

        {/* CTA 섹션 */}
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            지금 바로 시작해보세요!
          </h2>
          <p className="text-gray-600 mb-6">
            우리 동네 이웃들과 따뜻한 거래를 경험해보세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/products"
              className="w-full sm:w-auto inline-block bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg"
            >
              당근샵 둘러보기
            </Link>
            <Link 
              href="/map"
              className="w-full sm:w-auto inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              🗺️ 지도에서 찾기
            </Link>
            <Link 
              href="/sell"
              className="w-full sm:w-auto inline-block border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              상품 판매하기
            </Link>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white text-sm">🥕</span>
            </div>
            <span className="text-xl font-bold">당근샵</span>
          </div>
          <p className="text-gray-400">우리 동네 중고거래의 새로운 경험</p>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
              중고거래
            </Link>
            <Link href="/map" className="text-gray-400 hover:text-white transition-colors">
              지도에서 찾기
            </Link>
            <Link href="/sell" className="text-gray-400 hover:text-white transition-colors">
              판매하기
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
