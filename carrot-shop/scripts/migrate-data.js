const { createClient } = require('@supabase/supabase-js')

// 샘플 데이터 직접 정의 (import 대신)
const sampleProducts = [
  // 몇 개의 테스트 데이터만 포함
  { 
    id: 101, 
    title: '🥕 아이 옷 나눔 (90-100 사이즈)', 
    desc: '아이가 커서 입지 못하는 옷들 나눔해요!', 
    price: 0, 
    isFree: true,
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400',
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400'
    ],
    status: '판매중',
    location: '서울시 송파구',
    category: '유아동',
    condition: 'good',
    likes: 28,
    chats: 12,
    views: 89,
    seller: {
      id: 201,
      name: '따뜻한엄마',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      rating: 4.9,
      reviewCount: 34,
      responseRate: '100%',
      responseTime: '보통 30분 이내'
    },
    specifications: [
      { label: '카테고리', value: '유아동 의류' },
      { label: '사이즈', value: '90-100' },
      { label: '상태', value: '깨끗함 (세탁완료)' }
    ]
  },
  { 
    id: 1, 
    title: '아이폰 14 Pro 128GB', 
    desc: '깨끗하게 사용했습니다. 케이스, 필름 부착상태로 판매해요!', 
    price: 950000, 
    originalPrice: 1290000,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
    ],
    status: '판매중',
    location: '서울시 강남구',
    category: '디지털기기',
    condition: 'good',
    likes: 12,
    chats: 3,
    views: 156,
    seller: {
      id: 101,
      name: '당근이',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 4.8,
      reviewCount: 23,
      responseRate: '95%',
      responseTime: '보통 1시간 이내'
    },
    specifications: [
      { label: '브랜드', value: 'Apple' },
      { label: '모델명', value: 'iPhone 14 Pro' },
      { label: '용량', value: '128GB' },
      { label: '색상', value: '딥 퍼플' },
      { label: '상태', value: '중고 (상태 좋음)' }
    ]
  }
]

// Supabase 클라이언트 설정
const supabaseUrl = 'https://terrepndmyhvbbghxwbt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcnJlcG5kbXlodmJiZ2h4d2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTU4NzAsImV4cCI6MjA2ODg5MTg3MH0.Zw0d7IFTDLqnNnEg6Wt8qynkLxeZFNxh3-aogkAXRPs'

const supabase = createClient(supabaseUrl, supabaseKey)

// 상태 매핑
const conditionMapping = {
  'new': 'new',
  'like-new': 'like-new', 
  'good': 'good',
  'normal': 'normal',
  'damaged': 'damaged'
}

async function migrateData() {
  console.log('🚀 데이터 마이그레이션을 시작합니다...')
  
  try {
    // 1. 기존 데이터 삭제 (선택사항)
    console.log('📝 기존 데이터 정리 중...')
    await supabase.from('product_specifications').delete().neq('id', 0)
    await supabase.from('product_images').delete().neq('id', 0)
    await supabase.from('products').delete().neq('id', 0)
    await supabase.from('user_profiles').delete().neq('id', 0)

    // 2. 사용자 프로필 생성
    console.log('👤 사용자 프로필 생성 중...')
    const uniqueSellers = []
    const sellerMap = new Map()

    sampleProducts.forEach(product => {
      if (product.seller && !sellerMap.has(product.seller.id)) {
        const sellerId = `550e8400-e29b-41d4-a716-44665544${String(product.seller.id).padStart(4, '0')}`
        uniqueSellers.push({
          id: sellerId,
          name: product.seller.name,
          profile_image: product.seller.profileImage,
          rating: product.seller.rating,
          review_count: product.seller.reviewCount,
          response_rate: product.seller.responseRate,
          response_time: product.seller.responseTime
        })
        sellerMap.set(product.seller.id, sellerId)
      }
    })

    if (uniqueSellers.length > 0) {
      const { error: userError } = await supabase
        .from('user_profiles')
        .insert(uniqueSellers)
      
      if (userError) throw userError
      console.log(`✅ ${uniqueSellers.length}명의 사용자 프로필이 생성되었습니다.`)
    }

    // 3. 상품 생성
    console.log('📦 상품 데이터 생성 중...')
    const products = sampleProducts.map(product => ({
      id: product.id,
      title: product.title,
      description: product.desc || product.description,
      price: product.price,
      is_free: product.isFree || false,
      accept_offers_only: product.acceptOffersOnly || false,
      original_price: product.originalPrice || null,
      main_image: product.image,
      status: product.status || '판매중',
      location: product.location,
      category: product.category,
      condition: conditionMapping[product.condition] || 'good',
      likes: product.likes || 0,
      chats: product.chats || 0,
      views: product.views || 0,
      seller_id: product.seller ? sellerMap.get(product.seller.id) : null
    }))

    const { error: productError } = await supabase
      .from('products')
      .insert(products)
    
    if (productError) throw productError
    console.log(`✅ ${products.length}개의 상품이 생성되었습니다.`)

    // 4. 상품 이미지 생성
    console.log('🖼️ 상품 이미지 생성 중...')
    const productImages = []
    
    sampleProducts.forEach(product => {
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach((imageUrl, index) => {
          productImages.push({
            product_id: product.id,
            image_url: imageUrl,
            sort_order: index
          })
        })
      }
    })

    if (productImages.length > 0) {
      const { error: imageError } = await supabase
        .from('product_images')
        .insert(productImages)
      
      if (imageError) throw imageError
      console.log(`✅ ${productImages.length}개의 상품 이미지가 생성되었습니다.`)
    }

    // 5. 상품 사양 생성
    console.log('📋 상품 사양 생성 중...')
    const productSpecs = []
    
    sampleProducts.forEach(product => {
      if (product.specifications && Array.isArray(product.specifications)) {
        product.specifications.forEach((spec, index) => {
          productSpecs.push({
            product_id: product.id,
            label: spec.label,
            value: spec.value,
            sort_order: index
          })
        })
      }
    })

    if (productSpecs.length > 0) {
      const { error: specError } = await supabase
        .from('product_specifications')
        .insert(productSpecs)
      
      if (specError) throw specError
      console.log(`✅ ${productSpecs.length}개의 상품 사양이 생성되었습니다.`)
    }

    console.log('🎉 데이터 마이그레이션이 완료되었습니다!')
    console.log(`
📊 마이그레이션 요약:
- 사용자 프로필: ${uniqueSellers.length}개
- 상품: ${products.length}개  
- 상품 이미지: ${productImages.length}개
- 상품 사양: ${productSpecs.length}개
    `)

  } catch (error) {
    console.error('❌ 마이그레이션 중 오류가 발생했습니다:', error)
  }
}

// 스크립트 실행
migrateData() 