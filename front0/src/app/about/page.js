import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900 py-12 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-8 border dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">🏢 회사 소개</h1>
          
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              안녕하세요! 저희는 최신 웹 기술을 활용하여 혁신적인 솔루션을 제공하는 회사입니다.
            </p>
            
            <p>
              <strong className="text-gray-900 dark:text-white">주요 기술 스택:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Next.js & React</li>
              <li>Tailwind CSS</li>
              <li>JavaScript ES6+</li>
              <li>RESTful API</li>
              <li>다크모드 지원 🌙</li>
            </ul>

            <p>
              이 프로젝트는 JSONPlaceholder API를 활용하여 데이터 페칭과 상태 관리를 
              보여주는 예제 애플리케이션입니다.
            </p>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
              <p className="text-green-800 dark:text-green-400 font-medium">
                ✨ 새로운 기능: 다크모드 지원!
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm mt-2">
                우측 상단의 버튼으로 라이트/다크 모드를 자유롭게 전환하세요.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/" 
              className="inline-block bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg mr-4"
            >
              🏠 Home
            </Link>
            
            <Link 
              href="/posts" 
              className="inline-block bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              📝 Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
  