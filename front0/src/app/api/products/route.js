export async function GET() {
    const products = [
      { id: 1, title: '키보드', price: 30000 },
      { id: 2, title: '마우스', price: 15000 }
    ];
    return Response.json(products);
  }

  