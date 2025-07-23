import { NextResponse } from 'next/server';

// GET 요청 처리
export async function GET() {
  try {
    // 약간의 지연을 시뮬레이션 (실제 API 호출을 흉내)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data = {
      message: "안녕하세요! Hello API입니다! 👋",
      timestamp: new Date().toISOString(),
      status: "success",
      data: {
        user: "김인효",
        project: "front0",
        technology: ["Next.js", "React", "JavaScript"],
        description: "async/await과 API route 예제"
      }
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "서버 에러가 발생했습니다", message: error.message },
      { status: 500 }
    );
  }
}

// POST 요청 처리
export async function POST(request) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      message: "POST 요청을 받았습니다!",
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: "POST 요청 처리 중 에러 발생", message: error.message },
      { status: 400 }
    );
  }
} 