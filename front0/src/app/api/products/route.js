import { NextResponse } from 'next/server';

// 가상의 상품 데이터베이스
const products = [
  { id: 1, title: '키보드', price: 30000, category: '컴퓨터', stock: 10 },
  { id: 2, title: '마우스', price: 15000, category: '컴퓨터', stock: 5 },
  { id: 3, title: '모니터', price: 250000, category: '컴퓨터', stock: 3 },
  { id: 4, title: '헤드셋', price: 80000, category: '오디오', stock: 0 }
];

// GET 요청 - 다양한 응답 커스터마이징
export async function GET(request) {
  try {
    // URL 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const includeOutOfStock = searchParams.get('includeOutOfStock');

    console.log('🛍️ Products API 호출:', { category, limit, includeOutOfStock });

    // 데이터 필터링
    let filteredProducts = [...products];
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (includeOutOfStock !== 'true') {
      filteredProducts = filteredProducts.filter(p => p.stock > 0);
    }

    if (limit) {
      filteredProducts = filteredProducts.slice(0, parseInt(limit));
    }

    // 성공 응답 (200)
    const response = NextResponse.json({
      success: true,
      message: "상품 목록을 성공적으로 조회했습니다",
      data: {
        products: filteredProducts,
        total: filteredProducts.length,
        filters: {
          category: category || 'all',
          limit: limit || 'no limit',
          includeOutOfStock: includeOutOfStock === 'true'
        }
      },
      timestamp: new Date().toISOString(),
      version: "v1.0"
    }, { 
      status: 200 
    });

    // 커스텀 헤더 추가
    response.headers.set('X-API-Version', '1.0');
    response.headers.set('X-Total-Products', filteredProducts.length.toString());
    response.headers.set('Cache-Control', 'public, max-age=60'); // 1분 캐시
    response.headers.set('Access-Control-Allow-Origin', '*'); // CORS
    
    return response;

  } catch (error) {
    console.error('❌ Products API 에러:', error);
    
    // 서버 에러 응답 (500)
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: "상품 조회 중 서버 오류가 발생했습니다",
      timestamp: new Date().toISOString(),
      code: "PRODUCTS_FETCH_ERROR"
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Error-Code': 'PRODUCTS_FETCH_ERROR'
      }
    });
  }
}

// POST 요청 - 새 상품 추가
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, price, category, stock } = body;

    console.log('📝 새 상품 추가 요청:', body);

    // 유효성 검사
    if (!title || !price || !category) {
      return NextResponse.json({
        success: false,
        error: "Bad Request",
        message: "필수 필드가 누락되었습니다",
        required: ["title", "price", "category"],
        received: Object.keys(body),
        timestamp: new Date().toISOString()
      }, { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'X-Validation-Error': 'MISSING_REQUIRED_FIELDS'
        }
      });
    }

    // 가격 유효성 검사
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json({
        success: false,
        error: "Bad Request",
        message: "가격은 0보다 큰 숫자여야 합니다",
        field: "price",
        value: price,
        timestamp: new Date().toISOString()
      }, { 
        status: 400,
        headers: {
          'X-Validation-Error': 'INVALID_PRICE'
        }
      });
    }

    // 새 상품 생성
    const newProduct = {
      id: Date.now(), // 실제로는 UUID나 DB auto-increment 사용
      title,
      price,
      category,
      stock: stock || 0,
      createdAt: new Date().toISOString()
    };

    // 가상으로 데이터베이스에 추가
    products.push(newProduct);

    // 성공 응답 (201 Created)
    const response = NextResponse.json({
      success: true,
      message: "상품이 성공적으로 생성되었습니다",
      data: newProduct,
      timestamp: new Date().toISOString()
    }, { 
      status: 201 
    });

    // Location 헤더 추가 (RESTful API 관례)
    response.headers.set('Location', `/api/products/${newProduct.id}`);
    response.headers.set('X-Resource-ID', newProduct.id.toString());
    
    return response;

  } catch (error) {
    console.error('❌ 상품 생성 에러:', error);
    
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: "상품 생성 중 서버 오류가 발생했습니다",
      timestamp: new Date().toISOString()
    }, { 
      status: 500 
    });
  }
}

// PUT 요청 - 상품 업데이트
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Bad Request",
        message: "상품 ID가 필요합니다",
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // 상품 찾기
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "해당 ID의 상품을 찾을 수 없습니다",
        productId: id,
        timestamp: new Date().toISOString()
      }, { 
        status: 404,
        headers: {
          'X-Error-Type': 'PRODUCT_NOT_FOUND'
        }
      });
    }

    // 상품 업데이트
    products[productIndex] = { 
      ...products[productIndex], 
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: "상품이 성공적으로 업데이트되었습니다",
      data: products[productIndex],
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: "상품 업데이트 중 오류가 발생했습니다",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// DELETE 요청 - 상품 삭제
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Bad Request",
        message: "삭제할 상품 ID가 필요합니다",
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "해당 ID의 상품을 찾을 수 없습니다",
        productId: id,
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }

    // 상품 삭제
    const deletedProduct = products.splice(productIndex, 1)[0];

    // 204 No Content (바디 없음)
    return new Response(null, { 
      status: 204,
      headers: {
        'X-Deleted-Product-ID': deletedProduct.id.toString(),
        'X-Deleted-At': new Date().toISOString()
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: "상품 삭제 중 오류가 발생했습니다",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

