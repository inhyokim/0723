import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🏢 회사 소개</h1>
          
          <div className="space-y-4 text-gray-600">
            <p>
              안녕하세요! 저희는 최신 웹 기술을 활용하여 혁신적인 솔루션을 제공하는 회사입니다.
            </p>
            
            <p>
              <strong>주요 기술 스택:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Next.js & React</li>
              <li>Tailwind CSS</li>
              <li>JavaScript ES6+</li>
              <li>RESTful API</li>
            </ul>

            <p>
              이 프로젝트는 JSONPlaceholder API를 활용하여 데이터 페칭과 상태 관리를 
              보여주는 예제 애플리케이션입니다.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              href="/" 
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              🏠 홈으로 돌아가기
            </Link>
            
            <Link 
              href="/posts" 
              className="ml-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              📝 Posts 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
  