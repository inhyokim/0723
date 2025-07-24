'use client'

import { useState, useEffect } from 'react'
import { supabaseUtils } from '@/lib/supabase'

export default function SupabaseExample() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: ''
  })

  // 컴포넌트 마운트 시 상품 목록 조회
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await supabaseUtils.products.getAll()
      setProducts(data)
    } catch (err) {
      setError(err.message)
      console.error('상품 조회 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  // 새 상품 추가
  const handleCreateProduct = async (e) => {
    e.preventDefault()
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        seller_id: '550e8400-e29b-41d4-a716-446655440000', // 고정된 테스트 사용자 ID
        created_at: new Date().toISOString()
      }
      
      await supabaseUtils.products.create(productData)
      setNewProduct({ title: '', description: '', price: '', category: '' })
      loadProducts() // 목록 새로고침
    } catch (err) {
      setError(err.message)
      console.error('상품 추가 오류:', err)
    }
  }

  // 상품 삭제
  const handleDeleteProduct = async (id) => {
    try {
      await supabaseUtils.products.delete(id)
      loadProducts() // 목록 새로고침
    } catch (err) {
      setError(err.message)
      console.error('상품 삭제 오류:', err)
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                오류가 발생했습니다
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase 연동 예시</h1>
      
      {/* 새 상품 추가 폼 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">새 상품 추가</h2>
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </label>
            <input
              type="text"
              value={newProduct.title}
              onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가격 (원)
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리
              </label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">카테고리 선택</option>
                <option value="디지털기기">디지털기기</option>
                <option value="생활가전">생활가전</option>
                <option value="패션의류">패션의류</option>
                <option value="생활/주방">생활/주방</option>
                <option value="취미게임">취미게임</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
          >
            상품 추가
          </button>
        </form>
      </div>

      {/* 상품 목록 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          상품 목록 ({products.length}개)
        </h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            등록된 상품이 없습니다.
          </p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{product.title}</h3>
                    <p className="text-gray-600 mt-1">{product.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="font-medium text-orange-600">
                        {product.price?.toLocaleString()}원
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                      <span>
                        {new Date(product.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 