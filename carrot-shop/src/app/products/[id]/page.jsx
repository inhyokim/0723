'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import MannerTemperature from '@/app/components/MannerTemperature';
import { supabaseUtils } from '@/lib/supabase';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // 좋아요 기능 개선
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  // 댓글 기능
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Supabase에서 상품 데이터 로드
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 판매자 정보와 함께 조회 시도
        let data;
        try {
          data = await supabaseUtils.products.getByIdWithSeller(productId);
        } catch (joinError) {
          console.warn('조인 쿼리 실패, 기본 쿼리로 대체:', joinError);
          data = await supabaseUtils.products.getById(productId);
        }
        
        // 데이터 변환 (기존 구조와 호환되도록)
        const transformedProduct = {
          ...data,
          desc: data.description,
          image: data.main_image,
          images: data.product_images && data.product_images.length > 0 
            ? data.product_images
                .sort((a, b) => a.sort_order - b.sort_order)
                .map(img => img.image_url)
            : data.main_image ? [data.main_image] : [],
          createdAt: new Date(data.created_at).toLocaleDateString(),
          seller: data.user_profiles ? {
            id: data.user_profiles.id,
            name: data.user_profiles.name,
            profileImage: data.user_profiles.profile_image,
            rating: data.user_profiles.rating || 4.5,
            reviewCount: data.user_profiles.review_count || 0,
            responseRate: data.user_profiles.response_rate || '95%',
            responseTime: data.user_profiles.response_time || '보통 1시간 이내'
          } : {
            id: data.seller_id,
            name: '판매자',
            profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
            rating: 4.5,
            reviewCount: 0,
            responseRate: '95%',
            responseTime: '보통 1시간 이내'
          },
          specifications: [
            { label: '카테고리', value: data.category },
            { label: '상태', value: data.condition || 'good' },
            { label: '거래방식', value: data.is_free ? '나눔' : data.accept_offers_only ? '가격제안만' : '직거래' },
            { label: '등록일', value: new Date(data.created_at).toLocaleDateString() }
          ]
        };
        
        setProduct(transformedProduct);
      } catch (err) {
        setError(err.message);
        console.error('상품 로딩 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  // LocalStorage에서 데이터 로드 (초기 로드만)
  useEffect(() => {
    if (!product) return;
    
    try {
      const savedLikes = localStorage.getItem(`likes_${productId}`);
      const savedIsLiked = localStorage.getItem(`isLiked_${productId}`);
      const savedComments = localStorage.getItem(`comments_${productId}`);
      
      if (savedLikes) {
        setLikes(parseInt(savedLikes));
      } else if (product.likes) {
        setLikes(product.likes);
      }
      
      if (savedIsLiked) {
        setIsLiked(JSON.parse(savedIsLiked));
      }
      
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    } catch (error) {
      console.warn('localStorage 읽기 중 오류:', error.message);
      // localStorage 읽기 실패 시 기본값 사용
      if (product.likes) {
        setLikes(product.likes);
      }
    }
  }, [product, productId]);

  // LocalStorage에 데이터 저장 (상태 변경시에만)
  useEffect(() => {
    if (!product || likes === 0 && comments.length === 0 && !isLiked) return; // 초기 상태는 저장 안함
    
    try {
      localStorage.setItem(`likes_${productId}`, likes.toString());
      localStorage.setItem(`isLiked_${productId}`, JSON.stringify(isLiked));
      // 댓글은 용량이 클 수 있으므로 최대 10개만 저장
      const limitedComments = comments.slice(0, 10);
      localStorage.setItem(`comments_${productId}`, JSON.stringify(limitedComments));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage 용량이 부족합니다. 기존 데이터를 정리합니다.');
        // localStorage 정리
        try {
          // 오래된 상품 데이터 정리 (현재 상품 제외하고 모두 삭제)
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('likes_') || key.startsWith('isLiked_') || key.startsWith('comments_')) && !key.includes(productId.toString())) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
          
          // 다시 저장 시도
          localStorage.setItem(`likes_${productId}`, likes.toString());
          localStorage.setItem(`isLiked_${productId}`, JSON.stringify(isLiked));
          localStorage.setItem(`comments_${productId}`, JSON.stringify(limitedComments));
        } catch (secondError) {
          console.warn('localStorage 저장에 실패했습니다:', secondError.message);
          // localStorage 저장 실패해도 앱 동작에는 문제없음
        }
      } else {
        console.warn('localStorage 저장 중 오류:', error.message);
      }
    }
  }, [likes, isLiked, comments, productId]);

  // 좋아요 토글 함수
  const toggleLike = () => {
    if (isLiked) {
      setLikes(prev => Math.max(0, prev - 1));
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  // 댓글 추가 함수 (고도화)
  const addComment = () => {
    if (!comment.trim()) {
      alert('댓글을 입력해주세요.');
      return;
    }
    
    if (comment.length > 500) {
      alert('댓글은 500자까지 입력 가능합니다.');
      return;
    }

    setIsSubmitting(true);
    
    // 실제 사용자 정보 (임시)
    const newComment = {
      id: Date.now(),
      content: comment.trim(),
      author: {
        name: '김당근',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        rating: 37.2
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    setTimeout(() => {
      setComments(prev => [newComment, ...prev]);
      setComment('');
      setIsSubmitting(false);
    }, 300);
  };

  // 댓글 삭제 함수
  const removeComment = (commentId) => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      setComments(prev => prev.filter(c => c.id !== commentId));
    }
  };

  // 댓글 좋아요 토글
  const toggleCommentLike = (commentId) => {
    setComments(prev => 
      prev.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: c.isLiked ? c.likes - 1 : c.likes + 1,
            isLiked: !c.isLiked
          };
        }
        return c;
      })
    );
  };

  // 시간 포맷팅 함수
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  // 카테고리 클릭 시 해당 카테고리로 필터링된 상품 페이지로 이동
  const handleCategoryClick = (category) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="상품 상세" showBackButton={true} />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-80 md:h-96 bg-gray-200"></div>
              </div>
              <div className="md:w-1/2 p-6 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">상품을 불러올 수 없습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              새로고침
            </button>
            <button 
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 상품이 없는 경우
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h2>
          <button 
            onClick={() => router.back()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 공유 및 좋아요 액션
  const customActions = (
    <div className="flex items-center space-x-3">
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>
      <button 
        onClick={toggleLike}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 사용 (뒤로가기 버튼 활성화) */}
      <Header 
        title={product.title} 
        showBackButton={true} 
        customActions={customActions} 
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* 이미지 섹션 */}
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src={product.images[selectedImageIndex]} 
                  alt={product.title}
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    product.status === '판매중' 
                      ? 'bg-orange-500 text-white' 
                      : product.status === '예약중'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
              
              {/* 이미지 썸네일 */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 p-4 bg-gray-50">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 상품 정보 섹션 */}
            <div className="md:w-1/2 p-6">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <button 
                    onClick={() => handleCategoryClick(product.category)}
                    className="text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors"
                  >
                    #{product.category}
                  </button>
                  <span>•</span>
                  <span>{product.createdAt}</span>
                  <span>•</span>
                  <span>조회 {product.views}</span>
                </div>
              </div>

              {/* 가격 */}
              <div className="mb-6">
                {/* 나눔 상품 */}
                {product.isFree ? (
                  <div className="mb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-4xl font-bold text-green-600">나눔</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        🥕 무료나눔
                      </span>
                    </div>
                    <p className="text-lg text-green-700 font-medium">따뜻한 나눔으로 드려요!</p>
                  </div>
                ) : product.acceptOffersOnly || product.price === null ? (
                  /* 가격제안만 받기 상품 */
                  <div className="mb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-4xl font-bold text-blue-600">제안받기</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        💰 가격제안
                      </span>
                    </div>
                    <p className="text-lg text-blue-700 font-medium">원하시는 가격을 제안해주세요!</p>
                  </div>
                ) : (
                  /* 일반 상품 */
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-orange-600">
                      {product.price.toLocaleString()}원
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                    )}
                  </div>
                )}
                
                <div className="text-sm text-gray-600">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {product.location}
                </div>
              </div>

              {/* 상품 설명 */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">상품 설명</h3>
                <p className="text-gray-700 leading-relaxed">{product.desc}</p>
              </div>

              {/* 상품 정보 */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">상품 정보</h3>
                <div className="space-y-2">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600">{spec.label}</span>
                      <span className="font-medium text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 관심 표시 */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-1">
                  <svg className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>관심 {likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>댓글 {comments.length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>채팅 {product.chats}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 판매자 정보 */}
          <div className="border-t bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">판매자 정보</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={product.seller.profileImage} 
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900 mb-2">{product.seller.name}</div>
                  {/* 매너온도 컴포넌트 */}
                  <div className="mb-2">
                    <MannerTemperature 
                      rating={product.seller.rating} 
                      reviewCount={product.seller.reviewCount}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    응답률 {product.seller.responseRate} • {product.seller.responseTime}
                  </div>
                </div>
              </div>
              <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                판매자 상품 더보기
              </button>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="border-t p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                댓글 {comments.length}개
              </h3>
            </div>

            {/* 댓글 입력 폼 */}
            <div className="mb-6">
              <div className="flex space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
                  alt="내 프로필"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="댓글을 남겨보세요..."
                      className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows="3"
                      maxLength="500"
                      disabled={isSubmitting}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {comment.length}/500
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                      매너있는 댓글로 따뜻한 거래문화를 만들어요 🥕
                    </div>
                    <button
                      onClick={addComment}
                      disabled={isSubmitting || !comment.trim()}
                      className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? '등록중...' : '등록'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>아직 댓글이 없어요</p>
                  <p className="text-sm mt-1">첫 번째 댓글을 남겨보세요!</p>
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={c.author.profileImage}
                      alt={c.author.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{c.author.name}</span>
                        <MannerTemperature rating={c.author.rating} reviewCount={0} size="small" />
                        <span className="text-xs text-gray-500">{formatTimeAgo(c.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 mb-2 leading-relaxed">{c.content}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <button
                          onClick={() => toggleCommentLike(c.id)}
                          className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                            c.isLiked ? 'text-red-500' : 'text-gray-500'
                          }`}
                        >
                          <svg className={`w-4 h-4 ${c.isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{c.likes > 0 ? c.likes : '좋아요'}</span>
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">답글</button>
                        <button 
                          onClick={() => removeComment(c.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <button 
            onClick={toggleLike}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              isLiked 
                ? 'border-red-500 bg-red-50 scale-110' 
                : 'border-gray-300 bg-white hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <svg className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likes > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {likes}
              </span>
            )}
          </button>
          <button 
            onClick={() => {
              const sellerId = product.seller?.id || (200 + productId);
              router.push(`/chat/${productId}/${sellerId}`);
            }}
            className={`flex-1 text-white py-4 rounded-lg font-semibold text-lg transition-colors ${
              product.isFree 
                ? 'bg-green-500 hover:bg-green-600' 
                : product.acceptOffersOnly || product.price === null
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {product.isFree 
              ? '🥕 나눔 문의하기' 
              : product.acceptOffersOnly || product.price === null
              ? '💰 가격 제안하기'
              : '채팅하기'
            }
          </button>
        </div>
      </div>

      {/* 하단 여백 (고정 버튼 때문에) */}
      <div className="h-20"></div>
    </div>
  );
} 