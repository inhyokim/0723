'use client';

export default function MannerTemperature({ rating, reviewCount, size = 'normal' }) {
  // 별점을 매너온도로 변환 (0-5 별점 → 0-100°C)
  const temperature = Math.round((rating / 5) * 100);
  
  // 온도에 따른 색상 결정
  const getTemperatureColor = (temp) => {
    if (temp >= 90) return 'text-red-500';       // 매우 뜨거움
    if (temp >= 80) return 'text-orange-500';    // 뜨거움  
    if (temp >= 70) return 'text-yellow-500';    // 따뜻함
    if (temp >= 60) return 'text-green-500';     // 적당함
    if (temp >= 50) return 'text-blue-500';      // 시원함
    return 'text-gray-500';                      // 차가움
  };

  // 온도에 따른 배경색 결정
  const getTemperatureBackground = (temp) => {
    if (temp >= 90) return 'bg-red-100';
    if (temp >= 80) return 'bg-orange-100';
    if (temp >= 70) return 'bg-yellow-100';
    if (temp >= 60) return 'bg-green-100';
    if (temp >= 50) return 'bg-blue-100';
    return 'bg-gray-100';
  };

  // 온도에 따른 캐릭터 얼굴 이모지
  const getCharacterFace = (temp) => {
    if (temp >= 90) return '😄';      // 매우 행복
    if (temp >= 80) return '😊';      // 행복
    if (temp >= 70) return '🙂';      // 미소
    if (temp >= 60) return '😐';      // 보통
    if (temp >= 50) return '😕';      // 약간 슬픔
    return '😞';                      // 슬픔
  };

  // 온도에 따른 설명 텍스트
  const getTemperatureDescription = (temp) => {
    if (temp >= 90) return '최고예요!';
    if (temp >= 80) return '훌륭해요!';
    if (temp >= 70) return '좋아요!';
    if (temp >= 60) return '보통이에요';
    if (temp >= 50) return '아쉬워요';
    return '더 노력해요';
  };

  // size에 따른 스타일 결정
  const getSizeStyles = () => {
    if (size === 'small') {
      return {
        container: 'inline-flex items-center space-x-1 px-2 py-1 rounded',
        face: 'text-sm',
        label: 'text-xs font-medium text-gray-700',
        temperature: 'font-bold text-sm',
        bar: 'w-8 h-1',
        description: 'text-xs text-gray-600',
        review: 'text-xs text-gray-500'
      };
    }
    
    return {
      container: 'inline-flex items-center space-x-2 px-3 py-2 rounded-lg',
      face: 'text-lg',
      label: 'text-sm font-medium text-gray-700',
      temperature: 'font-bold text-lg',
      bar: 'w-16 h-2',
      description: 'text-xs text-gray-600',
      review: 'text-xs text-gray-500'
    };
  };

  const styles = getSizeStyles();

  return (
    <div className={`${styles.container} ${getTemperatureBackground(temperature)}`}>
      {/* 캐릭터 얼굴 */}
      <span className={styles.face}>{getCharacterFace(temperature)}</span>
      
      {/* 매너온도 */}
      <div className="flex items-center space-x-1">
        <span className={styles.label}>매너온도</span>
        <span className={`${styles.temperature} ${getTemperatureColor(temperature)}`}>
          {temperature}°C
        </span>
      </div>
      
      {/* 온도계 바 - small 사이즈일 때는 설명 숨김 */}
      <div className="flex items-center space-x-1">
        <div className={`${styles.bar} bg-gray-200 rounded-full overflow-hidden`}>
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              temperature >= 90 ? 'bg-red-500' :
              temperature >= 80 ? 'bg-orange-500' :
              temperature >= 70 ? 'bg-yellow-500' :
              temperature >= 60 ? 'bg-green-500' :
              temperature >= 50 ? 'bg-blue-500' : 'bg-gray-500'
            }`}
            style={{ width: `${temperature}%` }}
          />
        </div>
        {size !== 'small' && (
          <span className={styles.description}>{getTemperatureDescription(temperature)}</span>
        )}
      </div>

      {/* 리뷰 개수 */}
      {reviewCount && (
        <span className={styles.review}>
          ({reviewCount}개 평가)
        </span>
      )}
    </div>
  );
} 