'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AsyncDemoPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState(null);
  const [postLoading, setPostLoading] = useState(false);

  // GET 요청 - async/await 사용
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/hello');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const result = await res.json();
        console.log('GET 응답:', result);
        setData(result);
      } catch (err) {
        console.error('GET 에러:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // POST 요청 함수
  const handlePostRequest = async () => {
    try {
      setPostLoading(true);
      setPostData(null);
      
      const postBody = {
        name: "김인효",
        message: "POST 요청 테스트입니다!",
        timestamp: new Date().toISOString()
      };

      const res = await fetch('/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postBody)
      });

      if (!res.ok) {
        throw new Error(`POST 요청 실패: ${res.status}`);
      }

      const result = await res.json();
      console.log('POST 응답:', result);
      setPostData(result);
    } catch (err) {
      console.error('POST 에러:', err);
      alert(`POST 요청 에러: ${err.message}`);
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-900 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">⚡ Async/Await Demo</h1>
          <p className="text-gray-600 dark:text-gray-300">useEffect와 async/await를 활용한 API 통신 예제</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* GET 요청 결과 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-6 border dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">📥 GET 요청 (자동 로드)</h2>
            
            {loading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 dark:border-purple-400"></div>
                <span className="text-gray-600 dark:text-gray-300">API 호출 중...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400">❌ 에러: {error}</p>
              </div>
            )}

            {data && !loading && (
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-400 font-medium">✅ {data.message}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">응답 데이터:</h3>
                  <pre className="text-sm text-gray-600 dark:text-gray-300 overflow-x-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* POST 요청 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-6 border dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">📤 POST 요청 (수동 실행)</h2>
            
            <button
              onClick={handlePostRequest}
              disabled={postLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 disabled:bg-purple-300 dark:disabled:bg-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-4"
            >
              {postLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>POST 요청 중...</span>
                </span>
              ) : (
                'POST 요청 보내기'
              )}
            </button>

            {postData && (
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-400 font-medium">✅ {postData.message}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">POST 응답:</h3>
                  <pre className="text-sm text-gray-600 dark:text-gray-300 overflow-x-auto">
                    {JSON.stringify(postData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-6 border dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">💻 코드 예제</h2>
          
          <div className="bg-gray-900 dark:bg-black text-green-400 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm">{`useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch('/api/hello');
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, []);`}</pre>
          </div>
        </div>

        {/* API Endpoint Info */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-6 border dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">🛠️ API 정보</h2>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700 dark:text-gray-300"><strong>Endpoint:</strong> <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">/api/hello</code></p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Methods:</strong> GET, POST</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Response:</strong> JSON 형태의 데이터</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Delay:</strong> 1초 시뮬레이션 지연</p>
          </div>
        </div>
      </div>
    </div>
  );
} 