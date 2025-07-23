'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Header from '@/app/components/Header';
import MannerTemperature from '@/app/components/MannerTemperature';
import { getProductById } from '@/app/data/products';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const productId = parseInt(params.productId);
  const sellerId = parseInt(params.sellerId);
  const product = getProductById(productId);
  
  // 채팅 상태
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(true);
  
  // 현재 사용자 정보 (임시)
  const currentUser = {
    id: 999,
    name: '김당근',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 37.2
  };

  // 이모티콘 데이터
  const quickEmojis = ['👋', '😊', '👍', '❤️', '😢', '😮', '😄', '🔥'];
  const emojiCategories = {
    'faces': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘'],
    'gestures': ['👍', '👎', '👌', '✌️', '🤞', '🤝', '👏', '🙌', '🤲', '🙏', '💪', '🦾', '🦿', '🦵'],
    'hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓'],
    'objects': ['🏠', '🚗', '📱', '💰', '🎁', '📦', '⭐', '🔥', '💯', '✨', '🎉', '🎊', '🏆', '🥇']
  };

  // 채팅방 ID 생성
  const chatRoomId = `chat_${productId}_${sellerId}_${currentUser.id}`;

  // LocalStorage에서 채팅 내역 로드 (초기 로드만)
  useEffect(() => {
    if (!product || sellerId === 'undefined' || !sellerId) return;
    
    const savedMessages = localStorage.getItem(chatRoomId);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // 초기 환영 메시지 - 더 친근하고 매력적으로
      const welcomeMessages = [
        {
          id: Date.now(),
          senderId: sellerId,
          senderInfo: product.seller,
          content: `안녕하세요! ${product.title}에 관심 가져주셔서 감사합니다 🥕`,
          timestamp: new Date().toISOString(),
          type: 'text',
          isRead: false,
          reactions: []
        },
        {
          id: Date.now() + 1,
          senderId: sellerId,
          senderInfo: product.seller,
          content: '궁금한 점이 있으시면 언제든 물어보세요! 빠르게 답변드릴게요 😊',
          timestamp: new Date(Date.now() + 1000).toISOString(),
          type: 'text',
          isRead: false,
          reactions: []
        }
      ];
      setMessages(welcomeMessages);
    }
    
    // 온라인 상태 시뮬레이션
    const onlineInterval = setInterval(() => {
      setOnlineStatus(Math.random() > 0.3); // 70% 확률로 온라인
    }, 30000);
    
    setIsLoading(false);
    
    return () => clearInterval(onlineInterval);
  }, [productId, sellerId]);

  // 메시지가 변경될 때마다 LocalStorage에 저장
  useEffect(() => {
    if (messages.length > 0 && sellerId !== 'undefined' && sellerId) {
      localStorage.setItem(chatRoomId, JSON.stringify(messages));
    }
  }, [messages, chatRoomId, sellerId]);

  // 메시지 스크롤을 맨 아래로 (부드러운 애니메이션)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    }
  }, [messages]);

  // 입력창 포커스 관리
  useEffect(() => {
    if (!showEmojiPanel && !showActionPanel) {
      inputRef.current?.focus();
    }
  }, [showEmojiPanel, showActionPanel]);

  // 메시지 전송
  const sendMessage = async (messageContent = message, messageType = 'text', extra = {}) => {
    if (!messageContent.trim() && messageType === 'text') return;
    if (isSending) return;
    
    setIsSending(true);
    setShowEmojiPanel(false);
    setShowActionPanel(false);
    
    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      senderInfo: currentUser,
      content: messageContent.trim() || messageContent,
      timestamp: new Date().toISOString(),
      type: messageType,
      isRead: false,
      reactions: [],
      ...extra
    };

    // 메시지 추가 (애니메이션 효과를 위해)
    setMessages(prev => [...prev, { ...newMessage, isAnimating: true }]);
    setMessage('');
    
    // 애니메이션 완료 후 상태 업데이트
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, isAnimating: false } 
            : msg
        )
      );
    }, 300);
    
    // 타이핑 상태 시뮬레이션
    setIsTyping(true);
    
    // 더 똑똑한 자동 응답 시스템
    setTimeout(() => {
      const responses = getSmartResponse(messageContent, messageType, product);
      
      responses.forEach((response, index) => {
        setTimeout(() => {
          const autoReply = {
            id: Date.now() + index + 1000,
            senderId: sellerId,
            senderInfo: product.seller,
            content: response.content,
            timestamp: new Date().toISOString(),
            type: response.type || 'text',
            isRead: false,
            reactions: [],
            ...response.extra
          };
          
          setMessages(prev => [...prev, { ...autoReply, isAnimating: true }]);
          
          // 애니메이션 완료
          setTimeout(() => {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === autoReply.id 
                  ? { ...msg, isAnimating: false } 
                  : msg
              )
            );
          }, 300);
          
          if (index === responses.length - 1) {
            setIsTyping(false);
            setIsSending(false);
          }
        }, (index + 1) * 1500);
      });
    }, 1000 + Math.random() * 2000);
  };

  // 똑똑한 응답 생성 시스템
  const getSmartResponse = (userMessage, messageType, product) => {
    const msg = userMessage.toLowerCase();
    
    // 가격 관련 응답
    if (msg.includes('가격') || msg.includes('얼마') || messageType === 'price_offer') {
      if (product.isFree) {
        return [{
          content: '나눔 상품이라 무료로 드려요! 택배비만 부담해주시면 됩니다 😊',
          type: 'text'
        }];
      } else if (product.acceptOffersOnly) {
        return [{
          content: '가격 제안 받고 있어요! 합리적인 가격으로 제안해주세요 💰',
          type: 'text'
        }];
      } else {
        return [
          {
            content: `정가는 ${product.price?.toLocaleString()}원이에요!`,
            type: 'text'
          },
          {
            content: '조금 더 저렴하게 드릴 수도 있으니 말씀해주세요 😄',
            type: 'text'
          }
        ];
      }
    }
    
    // 상태/품질 관련
    if (msg.includes('상태') || msg.includes('품질') || msg.includes('깨끗')) {
      const conditions = {
        'new': '완전 새상품이에요!',
        'like-new': '거의 새것처럼 깨끗해요!',
        'good': '상태 정말 좋아요!',
        'normal': '사용감은 있지만 깨끗하게 관리했어요',
        'damaged': '손상 부분이 있어서 저렴하게 드려요'
      };
      
      return [{
        content: `${conditions[product.condition] || '상태 좋아요!'} 직접 보시면 만족하실 거예요 ✨`,
        type: 'text'
      }];
    }
    
    // 거래 관련
    if (msg.includes('거래') || msg.includes('만나') || msg.includes('언제')) {
      return [
        {
          content: '직거래 선호해요! 편하신 시간대 알려주세요 📅',
          type: 'text'
        },
        {
          content: '보통 평일 저녁이나 주말이 좋아요!',
          type: 'text'
        }
      ];
    }
    
    // 위치 관련
    if (msg.includes('위치') || msg.includes('어디') || msg.includes('장소')) {
      return [{
        content: `${product.location} 근처에서 만나면 될 것 같아요! 지하철역 근처 어떠세요? 🚇`,
        type: 'text'
      }];
    }
    
    // 긍정적 반응
    if (msg.includes('좋') || msg.includes('감사') || msg.includes('고마')) {
      return [{
        content: '감사해요! 😊 다른 궁금한 점도 언제든 물어보세요!',
        type: 'text'
      }];
    }
    
    // 기본 응답들
    const defaultResponses = [
      '네, 맞아요! 😊',
      '궁금한 점이 더 있으시면 말씀해주세요!',
      '빠른 답변 드리겠습니다! 🚀',
      '직접 보시면 더 만족하실 거예요!',
      '언제든 연락 주세요! 📞'
    ];
    
    return [{
      content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      type: 'text'
    }];
  };

  // 이모티콘 전송
  const sendEmoji = (emoji) => {
    sendMessage(emoji, 'emoji');
    setShowEmojiPanel(false);
  };

  // 빠른 액션 실행
  const executeQuickAction = (action) => {
    switch (action.type) {
      case 'price_offer':
        const offerPrice = prompt('제안하실 가격을 입력해주세요 (원 단위)');
        if (offerPrice && !isNaN(offerPrice)) {
          sendMessage(
            `💰 ${parseInt(offerPrice).toLocaleString()}원에 거래 가능한가요?`,
            'price_offer',
            { offerPrice: parseInt(offerPrice) }
          );
        }
        break;
      case 'location':
        sendMessage('📍 만날 장소를 정해볼까요?', 'location_request');
        break;
      case 'complete':
        sendMessage('🤝 거래 완료하겠습니다!', 'transaction_complete');
        break;
      case 'question':
        const questions = [
          '더 자세한 사진 보여주실 수 있나요?',
          '언제 거래 가능하신가요?',
          '가격 조금 더 안 될까요?',
          '다른 색상도 있나요?'
        ];
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        sendMessage(`❓ ${randomQuestion}`, 'question');
        break;
    }
    setShowActionPanel(false);
  };

  // 메시지에 리액션 추가
  const addReaction = (messageId, emoji) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            // 이미 내가 누른 리액션이면 제거, 아니면 추가
            if (existingReaction.users.includes(currentUser.id)) {
              return {
                ...msg,
                reactions: msg.reactions.map(r =>
                  r.emoji === emoji
                    ? { ...r, users: r.users.filter(id => id !== currentUser.id) }
                    : r
                ).filter(r => r.users.length > 0)
              };
            } else {
              return {
                ...msg,
                reactions: msg.reactions.map(r =>
                  r.emoji === emoji
                    ? { ...r, users: [...r.users, currentUser.id] }
                    : r
                )
              };
            }
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, users: [currentUser.id] }]
            };
          }
        }
        return msg;
      })
    );
  };

  // 시간 포맷팅
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  // 날짜 포맷팅
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    }
    
    return date.toLocaleDateString('ko-KR', { 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.287 0-4.33.777-5.977 2.077l-2.175-2.175a10.024 10.024 0 0116.304 0l-2.175 2.175A7.963 7.963 0 0112 15z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">상품을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-6">요청하신 상품 정보를 불러올 수 없어요</p>
          <button 
            onClick={() => router.back()}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (sellerId === 'undefined' || !sellerId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">판매자 정보를 불러올 수 없습니다</h2>
          <p className="text-gray-600 mb-6">잠시 후 다시 시도해주세요</p>
          <button 
            onClick={() => router.push(`/products/${productId}`)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            상품으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* 헤더 - 더 매력적으로 */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={product.seller.profileImage} 
                    alt={product.seller.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                                     {onlineStatus && (
                     <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-online-pulse"></div>
                   )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">{product.seller.name}</h3>
                  <div className="flex items-center space-x-2">
                    <MannerTemperature 
                      rating={product.seller.rating} 
                      reviewCount={product.seller.reviewCount}
                      size="small"
                    />
                    <span className="text-xs text-gray-500">
                      {onlineStatus ? '온라인' : '1분 전 접속'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 상품 정보 바 - 더 세련되게 */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={product.images[0]} 
                alt={product.title}
                className="w-14 h-14 rounded-xl object-cover shadow-sm ring-1 ring-gray-200"
              />
              <div className="absolute -top-1 -right-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full text-white shadow-sm ${
                  product.status === '판매중' ? 'bg-green-500' : 
                  product.status === '예약중' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm truncate">{product.title}</h3>
              <div className="flex items-center space-x-2 text-sm mt-1">
                {product.isFree ? (
                  <span className="text-green-600 font-semibold">🥕 나눔</span>
                ) : product.acceptOffersOnly ? (
                  <span className="text-blue-600 font-semibold">💰 가격제안</span>
                ) : (
                  <span className="text-orange-600 font-semibold">
                    {product.price?.toLocaleString()}원
                  </span>
                )}
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{product.location}</span>
              </div>
            </div>
            
            <button 
              onClick={() => router.push(`/products/${productId}`)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 메시지 영역 - 완전히 새로운 디자인 */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🥕</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, index) => {
                const isMyMessage = msg.senderId === currentUser.id;
                const showDate = index === 0 || formatDate(messages[index - 1].timestamp) !== formatDate(msg.timestamp);
                const showAvatar = !isMyMessage && (index === messages.length - 1 || messages[index + 1]?.senderId !== msg.senderId);
                
                return (
                  <div key={msg.id}>
                    {/* 날짜 구분선 */}
                    {showDate && (
                      <div className="flex items-center justify-center my-8">
                        <div className="bg-white/80 backdrop-blur-sm text-gray-600 text-xs px-4 py-2 rounded-full shadow-sm border border-gray-200">
                          {formatDate(msg.timestamp)}
                        </div>
                      </div>
                    )}
                    
                    {/* 메시지 */}
                    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} ${msg.isAnimating ? 'animate-bounce' : ''}`}>
                      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isMyMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {/* 프로필 이미지 */}
                        {!isMyMessage && (
                          <div className="flex-shrink-0">
                            {showAvatar ? (
                              <img 
                                src={msg.senderInfo.profileImage} 
                                alt={msg.senderInfo.name}
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                              />
                            ) : (
                              <div className="w-8 h-8"></div>
                            )}
                          </div>
                        )}
                        
                        {/* 메시지 버블 */}
                        <div className="flex flex-col">
                          {!isMyMessage && showAvatar && (
                            <span className="text-xs text-gray-500 mb-1 ml-1">
                              {msg.senderInfo.name}
                            </span>
                          )}
                          
                                                     <div className="group relative">
                             <div className={`px-4 py-3 rounded-2xl shadow-sm message-bubble ${
                               msg.type === 'price_offer' 
                                 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-soft' 
                                 : msg.type === 'emoji'
                                 ? 'bg-transparent'
                                 : isMyMessage 
                                   ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-orange-soft' 
                                   : 'bg-white text-gray-900 border border-gray-200'
                             }`}>
                              {msg.type === 'price_offer' ? (
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-lg">💰</span>
                                    <span className="font-semibold text-sm">가격 제안</span>
                                  </div>
                                  <div className="font-medium">{msg.content}</div>
                                </div>
                              ) : msg.type === 'emoji' ? (
                                <span className="text-4xl">{msg.content}</span>
                              ) : msg.type === 'location_request' ? (
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-lg">📍</span>
                                    <span className="font-semibold text-sm">위치 공유</span>
                                  </div>
                                  <div>{msg.content}</div>
                                </div>
                              ) : msg.type === 'transaction_complete' ? (
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-lg">🤝</span>
                                    <span className="font-semibold text-sm">거래 완료</span>
                                  </div>
                                  <div>{msg.content}</div>
                                </div>
                              ) : (
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                              )}
                            </div>
                            
                            {/* 리액션 */}
                            {msg.reactions && msg.reactions.length > 0 && (
                              <div className="flex space-x-1 mt-1">
                                {msg.reactions.map((reaction, idx) => (
                                                                     <button
                                     key={idx}
                                     onClick={() => addReaction(msg.id, reaction.emoji)}
                                     className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs reaction-button ${
                                       reaction.users.includes(currentUser.id)
                                         ? 'bg-orange-100 text-orange-700'
                                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                     }`}
                                   >
                                    <span>{reaction.emoji}</span>
                                    <span>{reaction.users.length}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {/* 빠른 리액션 버튼 (호버시 표시) */}
                            <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex flex-col space-y-1">
                                {quickEmojis.slice(0, 3).map(emoji => (
                                                                     <button
                                     key={emoji}
                                     onClick={() => addReaction(msg.id, emoji)}
                                     className="w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 hover:scale-110 transition-transform flex items-center justify-center text-sm reaction-button"
                                   >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* 시간 */}
                          <div className={`text-xs text-gray-400 mt-1 ${isMyMessage ? 'text-right' : 'text-left'}`}>
                            {formatTime(msg.timestamp)}
                            {isMyMessage && (
                              <span className="ml-2 text-orange-400">✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* 타이핑 인디케이터 */}
              {(isSending || isTyping) && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={product.seller.profileImage} 
                      alt={product.seller.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                                         <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-200">
                       <div className="flex space-x-1">
                         <div className="w-2 h-2 bg-orange-400 rounded-full animate-typing-dot"></div>
                         <div className="w-2 h-2 bg-orange-400 rounded-full animate-typing-dot"></div>
                         <div className="w-2 h-2 bg-orange-400 rounded-full animate-typing-dot"></div>
                       </div>
                     </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* 이모티콘 패널 */}
      {showEmojiPanel && (
        <div className="fixed bottom-24 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 animate-slide-up">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">이모티콘</h3>
              <button 
                onClick={() => setShowEmojiPanel(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {Object.entries(emojiCategories).map(([category, emojis]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">{category}</h4>
                  <div className="grid grid-cols-8 gap-2">
                    {emojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => sendEmoji(emoji)}
                        className="w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-xl"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 액션 패널 */}
      {showActionPanel && (
        <div className="fixed bottom-24 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 animate-slide-up">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">빠른 액션</h3>
              <button 
                onClick={() => setShowActionPanel(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {!product.isFree && (
                                                 <button
                                   onClick={() => executeQuickAction({ type: 'price_offer' })}
                                   className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all action-button"
                                 >
                  <span className="text-2xl">💰</span>
                  <div className="text-left">
                    <div className="font-semibold">가격 제안</div>
                    <div className="text-sm opacity-90">원하는 가격 제안하기</div>
                  </div>
                </button>
              )}
              
                             <button
                 onClick={() => executeQuickAction({ type: 'location' })}
                 className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all action-button"
               >
                <span className="text-2xl">📍</span>
                <div className="text-left">
                  <div className="font-semibold">위치 공유</div>
                  <div className="text-sm opacity-90">만날 장소 정하기</div>
                </div>
              </button>
              
                             <button
                 onClick={() => executeQuickAction({ type: 'complete' })}
                 className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all action-button"
               >
                <span className="text-2xl">🤝</span>
                <div className="text-left">
                  <div className="font-semibold">거래 완료</div>
                  <div className="text-sm opacity-90">거래 마무리하기</div>
                </div>
              </button>
              
                             <button
                 onClick={() => executeQuickAction({ type: 'question' })}
                 className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all action-button"
               >
                <span className="text-2xl">❓</span>
                <div className="text-left">
                  <div className="font-semibold">자주 묻는 질문</div>
                  <div className="text-sm opacity-90">빠른 질문하기</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메시지 입력창 (하단 고정) - 완전히 새로운 디자인 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl z-40">
        <div className="max-w-4xl mx-auto p-4">
          {/* 빠른 이모티콘 */}
          <div className="flex space-x-2 mb-3 overflow-x-auto scrollbar-hide">
                         {quickEmojis.map(emoji => (
               <button
                 key={emoji}
                 onClick={() => sendEmoji(emoji)}
                 className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-lg emoji-button"
               >
                 {emoji}
               </button>
             ))}
          </div>
          
          {/* 메시지 입력 */}
          <div className="flex items-end space-x-3">
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowActionPanel(!showActionPanel)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  showActionPanel 
                    ? 'bg-orange-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              
              <button 
                onClick={() => setShowEmojiPanel(!showEmojiPanel)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  showEmojiPanel 
                    ? 'bg-yellow-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">😊</span>
              </button>
            </div>
            
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="메시지를 입력하세요..."
                                 className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all resize-none max-h-32 text-sm leading-relaxed chat-input"
                rows="1"
                style={{height: 'auto'}}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                disabled={isSending}
              />
              {message.trim() && (
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  {message.length}/1000
                </div>
              )}
            </div>
            
            <button
              onClick={() => sendMessage()}
              disabled={!message.trim() || isSending}
              className={`p-3 rounded-xl transition-all duration-200 transform ${
                message.trim() && !isSending
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:scale-105 hover:shadow-xl' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSending ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 