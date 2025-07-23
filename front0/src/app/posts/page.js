'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiInfo, setApiInfo] = useState(null);

  useEffect(() => {
    // 새로운 내부 API 호출
    fetch('/api/posts')
      .then(res => {
        if (!res.ok) {
          throw new Error(`API 호출 실패: ${res.status}`);
        }
        return res.json();
      })
      .then(response => {
        console.log('API 응답:', response);
        
        if (response.success) {
          // 새로운 응답 구조에 맞게 데이터 추출
          setPosts(response.data.posts);
          setApiInfo({
            totalOriginal: response.data.totalOriginal,
            totalReturned: response.data.totalReturned,
            filtered: response.data.filtered,
            source: response.source,
            timestamp: response.timestamp
          });
        } else {
          throw new Error(response.error || '알 수 없는 에러');
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error('API 호출 에러:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">API에서 포스트를 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 text-lg mb-4">❌ API 에러: {error}</p>
          <Link 
            href="/" 
            className="inline-block bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            🏠 홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📝 Blog Posts (API 처리)</h1>
          <p className="text-gray-600 dark:text-gray-300">
            내부 API에서 가져온 {posts.length}개의 포스트
          </p>
          
          {/* API 정보 표시 */}
          {apiInfo && (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <strong className="text-blue-800 dark:text-blue-400">📊 데이터 정보:</strong>
                  <p className="text-blue-700 dark:text-blue-300">원본: {apiInfo.totalOriginal}개</p>
                  <p className="text-blue-700 dark:text-blue-300">반환: {apiInfo.totalReturned}개</p>
                </div>
                <div>
                  <strong className="text-blue-800 dark:text-blue-400">🔧 처리 방식:</strong>
                  <p className="text-blue-700 dark:text-blue-300">{apiInfo.filtered}</p>
                  <p className="text-blue-700 dark:text-blue-300">출처: {apiInfo.source}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div 
              key={post.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:shadow-gray-700 dark:hover:shadow-gray-600 transition-all duration-300 p-6 border dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-blue-500 dark:text-blue-400 font-medium">Post #{post.id}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">User {post.userId}</span>
              </div>
              
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                {post.title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                {post.body}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors">
                  더 보기 →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            데이터 출처: <span className="text-blue-500 dark:text-blue-400">내부 API (/api/posts)</span>
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
            💡 API 서버에서 절반 처리 후 반환
          </p>
        </div>
      </div>
    </div>
  );
} 