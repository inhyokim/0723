import Link from "next/link";

export default function Home() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: `linear-gradient(to bottom right, var(--bg-gradient-from), var(--bg-gradient-to))`,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="text-center">
        <h1 
          className="text-4xl font-bold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          🏠 홈페이지
        </h1>
        <p 
          className="text-lg mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          Next.js와 React를 활용한 웹 애플리케이션
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/posts" 
            className="inline-block font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg text-white transition-all duration-200"
            style={{ 
              backgroundColor: 'var(--button-bg)',
              boxShadow: '0 4px 6px -1px var(--shadow-color)'
            }}
          >
            📝 Blog Posts 보기
          </Link>
          
          <br />
          
          <Link 
            href="/products" 
            className="inline-block font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg text-white transition-all duration-200"
            style={{ 
              backgroundColor: '#10b981',
              boxShadow: '0 4px 6px -1px var(--shadow-color)'
            }}
          >
            🛍️ Products 보기
          </Link>
          
          <br />
          
          <Link 
            href="/async-demo" 
            className="inline-block font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg text-white transition-all duration-200"
            style={{ 
              backgroundColor: '#8b5cf6',
              boxShadow: '0 4px 6px -1px var(--shadow-color)'
            }}
          >
            ⚡ Async/Await Demo
          </Link>
          
          <br />
          
          <Link 
            href="/about" 
            className="inline-block font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg text-white transition-all duration-200"
            style={{ 
              backgroundColor: '#6b7280',
              boxShadow: '0 4px 6px -1px var(--shadow-color)'
            }}
          >
            ℹ️ 회사 소개
          </Link>
        </div>

        <div 
          className="mt-12 text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          <p>JSONPlaceholder API와 내부 API를 활용한 데이터 페치 예제</p>
          <p className="mt-2 text-xs">🌙 우측 상단에서 다크모드를 전환하세요!</p>
        </div>
      </div>
    </div>
  );
}
