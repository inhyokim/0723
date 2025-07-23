import { NextResponse } from 'next/server';

// GET 요청 처리 - 게시물의 절반만 반환
export async function GET() {
  try {
    console.log('📡 JSONPlaceholder API 호출 시작...');
    
    // JSONPlaceholder API에서 모든 게시물 가져오기
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      // 캐시 설정 (1분간 캐시)
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`JSONPlaceholder API 에러: ${response.status}`);
    }

    const allPosts = await response.json();
    console.log(`📊 전체 게시물 수: ${allPosts.length}개`);

    // 절반만 자르기 (처음 50개)
    const halfPosts = allPosts.slice(0, Math.floor(allPosts.length / 2));
    console.log(`✂️ 절반으로 자른 후: ${halfPosts.length}개`);

    // 추가 메타데이터와 함께 반환
    const responseData = {
      success: true,
      message: "게시물 목록을 성공적으로 가져왔습니다",
      data: {
        posts: halfPosts,
        totalOriginal: allPosts.length,
        totalReturned: halfPosts.length,
        filtered: "처음 절반만 반환됨"
      },
      timestamp: new Date().toISOString(),
      source: "JSONPlaceholder API"
    };

    console.log('✅ API 응답 준비 완료');

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('❌ API 에러:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: "게시물을 가져오는데 실패했습니다",
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST 요청 처리 (향후 확장 가능)
export async function POST(request) {
  try {
    const body = await request.json();
    
    // 새 게시물 생성 로직 (예시)
    console.log('📝 새 게시물 생성 요청:', body);
    
    return NextResponse.json({
      success: true,
      message: "게시물이 생성되었습니다 (시뮬레이션)",
      data: {
        id: Date.now(), // 임시 ID
        ...body,
        createdAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "게시물 생성에 실패했습니다",
        message: error.message
      },
      { status: 400 }
    );
  }
} 