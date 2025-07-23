import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">🏠 홈페이지</h1>
        <p className="text-lg text-gray-600 mb-8">Next.js와 React를 활용한 웹 애플리케이션</p>
        
        <div className="space-y-4">
          <Link 
            href="/posts" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            📝 Blog Posts 보기
          </Link>
          
          <br />
          
          <Link 
            href="/async-demo" 
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            ⚡ Async/Await Demo
          </Link>
          
          <br />
          
          <Link 
            href="/about" 
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            ℹ️ 회사 소개
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>JSONPlaceholder API와 내부 API를 활용한 데이터 페치 예제</p>
        </div>
      </div>
    </div>
  );
}
