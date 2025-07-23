'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import MannerTemperature from '@/app/components/MannerTemperature';

export default function ChatsPage() {
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 현재 사용자 정보 (임시)
  const currentUser = {
    id: 999,
    name: '김당근',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 37.2
  };

  // LocalStorage에서 모든 채팅방 정보 로드
  useEffect(() => {
    const loadChatRooms = () => {
      const allKeys = Object.keys(localStorage);
      const chatKeys = allKeys.filter(key => key.startsWith('chat_'));
      
      const rooms = chatKeys.map(key => {
        const messages = JSON.parse(localStorage.getItem(key) || '[]');
        if (messages.length === 0) return null;

        const keyParts = key.split('_');
        const productId = parseInt(keyParts[1]);
        const sellerId = parseInt(keyParts[2]);
        const buyerId = parseInt(keyParts[3]);
        
        const lastMessage = messages[messages.length - 1];
        const unreadCount = messages.filter(msg => !msg.isRead && msg.senderId !== currentUser.id).length;
        
        // 상대방 정보 결정
        const isUserSeller = currentUser.id === sellerId;
        const otherUser = isUserSeller 
          ? { id: buyerId, name: '김당근', profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 36.8 }
          : lastMessage.senderInfo;
        
        // 임시 상품 정보 (실제로는 productId로 조회해야 함)
        const productInfo = {
          id: productId,
          title: '아이폰 15 Pro 256GB',
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
          price: productId === 1 ? 1200000 : productId === 2 ? null : 850000,
          isFree: false,
          acceptOffersOnly: productId === 2
        };

        return {
          key,
          productId,
          sellerId,
          buyerId,
          otherUser,
          productInfo,
          lastMessage,
          unreadCount,
          updatedAt: lastMessage.timestamp
        };
      }).filter(Boolean);

      // 최신 메시지 순으로 정렬
      rooms.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      
      setChatRooms(rooms);
      setIsLoading(false);
    };

    loadChatRooms();
  }, [currentUser.id]);

  // 시간 포맷팅
  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  // 채팅방 입장
  const enterChatRoom = (room) => {
    router.push(`/chat/${room.productId}/${room.sellerId}`);
  };

  // 메시지 미리보기 텍스트
  const getPreviewText = (message) => {
    if (message.type === 'price_offer') {
      return `💰 ${message.offerPrice?.toLocaleString()}원 가격제안`;
    }
    return message.content;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <Header 
        title="채팅" 
        showBackButton={true}
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : chatRooms.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">아직 채팅이 없어요</h3>
            <p className="text-gray-500 mb-6">관심 있는 상품에서 채팅을 시작해보세요!</p>
            <button 
              onClick={() => router.push('/products')}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              상품 둘러보기
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {chatRooms.map((room) => (
              <div
                key={room.key}
                onClick={() => enterChatRoom(room)}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border"
              >
                <div className="flex items-center space-x-4">
                  {/* 상대방 프로필 */}
                  <div className="relative">
                    <img 
                      src={room.otherUser.profileImage} 
                      alt={room.otherUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {room.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                        {room.unreadCount > 99 ? '99+' : room.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* 채팅 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {room.otherUser.name}
                        </h3>
                        <MannerTemperature 
                          rating={room.otherUser.rating} 
                          reviewCount={0}
                          size="small"
                        />
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(room.lastMessage.timestamp)}
                      </span>
                    </div>
                    
                    <p className={`text-sm truncate ${room.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {getPreviewText(room.lastMessage)}
                    </p>

                    {/* 상품 정보 */}
                    <div className="flex items-center space-x-2 mt-2 p-2 bg-gray-50 rounded-lg">
                      <img 
                        src={room.productInfo.image} 
                        alt={room.productInfo.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 truncate">
                          {room.productInfo.title}
                        </p>
                        <div className="text-xs">
                          {room.productInfo.isFree ? (
                            <span className="text-green-600 font-semibold">나눔</span>
                          ) : room.productInfo.acceptOffersOnly ? (
                            <span className="text-blue-600 font-semibold">가격제안</span>
                          ) : (
                            <span className="text-orange-600 font-semibold">
                              {room.productInfo.price?.toLocaleString()}원
                            </span>
                          )}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 