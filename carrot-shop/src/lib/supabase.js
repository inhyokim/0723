import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL이 환경 변수에 설정되지 않았습니다. .env.local 파일을 확인해주세요.')
}

if (!supabaseKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY가 환경 변수에 설정되지 않았습니다. .env.local 파일을 확인해주세요.')
}

// 글로벌 싱글톤 패턴으로 Supabase 클라이언트 생성
if (typeof globalThis !== 'undefined' && !globalThis.__supabase_client) {
  globalThis.__supabase_client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      storageKey: 'carrot-shop-auth-v1',
      autoRefreshToken: true,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'x-application-name': 'carrot-shop'
      }
    }
  })
}

export const supabase = globalThis.__supabase_client || createClient(supabaseUrl, supabaseKey)

// 편의 함수들
export const supabaseUtils = {
  // 상품 관련 함수들
  products: {
    // 모든 상품 조회
    getAll: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    // 판매자 정보와 함께 모든 상품 조회
    getAllWithSeller: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          user_profiles!seller_id (
            id,
            name,
            profile_image,
            rating,
            review_count,
            response_rate,
            response_time
          ),
          product_images (
            image_url,
            sort_order
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    // 특정 상품 조회
    getById: async (id) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    // 판매자 정보와 함께 특정 상품 조회
    getByIdWithSeller: async (id) => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          user_profiles!seller_id (
            id,
            name,
            profile_image,
            rating,
            review_count,
            response_rate,
            response_time
          ),
          product_images (
            image_url,
            sort_order
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    // 상품 추가
    create: async (product) => {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    // 상품 업데이트
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    // 상품 삭제
    delete: async (id) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },

    // 카테고리별 상품 조회
    getByCategory: async (category) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    // 검색
    search: async (searchTerm) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('title', `%${searchTerm}%`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  },

  // 상품 이미지 관련 함수들
  productImages: {
    // 상품의 모든 이미지 조회
    getByProductId: async (productId) => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order', { ascending: true })
      
      if (error) throw error
      return data
    },

    // 상품 이미지 추가
    create: async (productImages) => {
      const { data, error } = await supabase
        .from('product_images')
        .insert(productImages)
        .select()
      
      if (error) throw error
      return data
    },

    // 상품 이미지 삭제
    deleteByProductId: async (productId) => {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId)
      
      if (error) throw error
    }
  },

  // 사용자 관련 함수들
  users: {
    // 현재 사용자 조회
    getCurrentUser: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },

    // 로그인
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return data
    },

    // 회원가입
    signUp: async (email, password, userData = {}) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      return data
    },

    // 로그아웃
    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    }
  },

  // 실시간 구독
  subscriptions: {
    // 상품 변경사항 구독
    subscribeToProducts: (callback) => {
      return supabase
        .channel('products')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'products' 
        }, callback)
        .subscribe()
    },

    // 채팅 메시지 구독
    subscribeToChat: (chatId, callback) => {
      return supabase
        .channel(`chat_${chatId}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        }, callback)
        .subscribe()
    }
  }
}

// localStorage 관리 유틸리티
export const localStorageUtils = {
  // localStorage 용량 확인
  getStorageSize: () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  },

  // 상품 관련 localStorage 데이터 정리
  clearProductData: (exceptProductId = null) => {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('likes_') || key.startsWith('isLiked_') || key.startsWith('comments_'))) {
          if (!exceptProductId || !key.includes(exceptProductId.toString())) {
            keysToRemove.push(key);
          }
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`${keysToRemove.length}개의 상품 데이터를 정리했습니다.`);
    } catch (error) {
      console.warn('localStorage 정리 중 오류:', error.message);
    }
  },

  // 전체 localStorage 정리 (주의!)
  clearAll: () => {
    try {
      localStorage.clear();
      console.log('모든 localStorage 데이터를 정리했습니다.');
    } catch (error) {
      console.warn('localStorage 정리 중 오류:', error.message);
    }
  }
}

export default supabase 