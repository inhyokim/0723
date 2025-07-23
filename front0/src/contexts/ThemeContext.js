'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 컴포넌트 마운트 후에만 localStorage 접근
  useEffect(() => {
    setMounted(true);
    
    // localStorage와 시스템 설정 확인
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    
    // HTML 요소에 클래스 적용
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 테마 변경 함수
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    console.log('테마 변경:', newTheme ? 'dark' : 'light'); // 디버깅용
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('다크모드 활성화, HTML에 dark 클래스 추가됨');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('라이트모드 활성화, HTML에서 dark 클래스 제거됨');
    }
  };

  const value = {
    isDark,
    toggleTheme,
    mounted
  };

  // SSR 중에는 기본값으로 렌더링
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {}, mounted: false }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 