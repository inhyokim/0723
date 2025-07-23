'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function DarkModeToggle() {
  const { isDark, toggleTheme, mounted } = useTheme();

  // SSR 중에는 렌더링하지 않음
  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50 p-3 rounded-full bg-gray-200 shadow-lg w-12 h-12 opacity-50">
        <div className="w-6 h-6 relative animate-pulse bg-gray-400 rounded"></div>
      </div>
    );
  }

  const handleClick = () => {
    console.log('다크모드 버튼 클릭됨, 현재 상태:', isDark ? 'dark' : 'light');
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-lg"
      aria-label="다크모드 토글"
      title={isDark ? '라이트모드로 전환' : '다크모드로 전환'}
    >
      <div className="w-6 h-6 relative">
        {isDark ? (
          // 다크모드일 때 - 태양 아이콘
          <svg
            className="w-6 h-6 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          // 라이트모드일 때 - 달 아이콘
          <svg
            className="w-6 h-6 text-gray-700"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </div>
    </button>
  );
} 