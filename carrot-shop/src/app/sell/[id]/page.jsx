'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductCard from '@/app/components/productCard';
import Header from '@/app/components/Header';
import LocationSelector from '@/app/components/LocationSelector';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [originalProduct, setOriginalProduct] = useState(null);
  
  // 기본 상품 정보
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [isFree, setIsFree] = useState(false);
  const [acceptOffersOnly, setAcceptOffersOnly] = useState(false);
  
  // 상품 세부 정보
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('서울시 강남구');
  const [images, setImages] = useState(['']);
  const [tags, setTags] = useState('');
  
  // UI 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImages, setUploadingImages] = useState([]);
  
  // 파일 입력 ref
  const fileInputRefs = useRef([]);

  // 상품 정보 로드
  useEffect(() => {
    const loadProduct = () => {
      const savedProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
      const product = savedProducts.find(p => p.id === productId);
      
      if (!product) {
        alert('상품을 찾을 수 없습니다.');
        router.push('/my-products');
        return;
      }

      // 기존 상품 정보로 폼 초기화
      setOriginalProduct(product);
      setTitle(product.title);
      setDesc(product.desc);
      
      if (product.isFree) {
        setIsFree(true);
        setPrice('0');
      } else if (product.acceptOffersOnly) {
        setAcceptOffersOnly(true);
        setPrice('');
      } else {
        setPrice(product.price?.toString() || '');
      }
      
      setOriginalPrice(product.originalPrice?.toString() || '');
      setNegotiable(product.negotiable || false);
      setCategory(product.category);
      setCondition(product.condition);
      setLocation(product.location);
      setImages(product.images || [product.image]);
      setTags(''); // 태그는 기존에 저장되지 않았으므로 빈 문자열
      
      setIsLoading(false);
    };

    loadProduct();
  }, [productId, router]);
  
  const categories = [
    '디지털기기', '생활가전', '가구/인테리어', '생활/주방', 
    '유아동', '유아도서', '여성의류', '여성잡화', '남성패션/잡화',
    '뷰티/미용', '스포츠/레저', '취미/게임/음반', '도서', '티켓/교환권',
    '가공식품', '건강기능식품', '반려동물용품', '식물', '기타 중고물품'
  ];

  const conditions = [
    { value: 'new', label: '새상품', desc: '사용하지 않은 새 상품' },
    { value: 'like-new', label: '거의 새상품', desc: '사용감이 거의 없는 상품' },
    { value: 'good', label: '상태 좋음', desc: '사용감은 있지만 깨끗한 상품' },
    { value: 'normal', label: '사용감 있음', desc: '사용감이 많이 있는 상품' },
    { value: 'damaged', label: '고장/파손', desc: '부품용이나 수리용 상품' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = '상품명을 입력해주세요';
    if (!desc.trim()) newErrors.desc = '상품 설명을 입력해주세요';
    
    if (!isFree && !acceptOffersOnly) {
      if (!price || isNaN(price) || Number(price) <= 0) {
        newErrors.price = '올바른 가격을 입력해주세요';
      }
    }
    
    if (!category) newErrors.category = '카테고리를 선택해주세요';
    if (!condition) newErrors.condition = '상품 상태를 선택해주세요';
    if (!images[0]) newErrors.images = '최소 1개의 이미지를 등록해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFreeChange = (checked) => {
    setIsFree(checked);
    if (checked) {
      setPrice('0');
      setOriginalPrice('');
      setAcceptOffersOnly(false);
    } else {
      setPrice('');
    }
  };

  const handleAcceptOffersOnlyChange = (checked) => {
    setAcceptOffersOnly(checked);
    if (checked) {
      setPrice('');
      setOriginalPrice('');
      setIsFree(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하로 업로드해주세요.');
      return;
    }

    try {
      setUploadingImages(prev => [...prev, index]);
      const base64String = await fileToBase64(file);
      const newImages = [...images];
      newImages[index] = base64String;
      setImages(newImages);
    } catch (error) {
      console.error('File upload error:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploadingImages(prev => prev.filter(i => i !== index));
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageInput = () => {
    if (images.length < 5) {
      setImages([...images, '']);
      fileInputRefs.current.push(null);
    }
  };

  const removeImageInput = (index) => {
    if (images.length > 1) {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      fileInputRefs.current.splice(index, 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const finalPrice = isFree ? 0 : (acceptOffersOnly ? null : Number(price));
      
      const updatedProduct = {
        ...originalProduct,
        title: title.trim(),
        desc: desc.trim(),
        price: finalPrice,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        image: images[0],
        images: images.filter(img => img.trim()),
        category,
        condition,
        location,
        negotiable,
        isFree,
        acceptOffersOnly,
        specifications: [
          { label: '카테고리', value: category },
          { label: '상태', value: conditions.find(c => c.value === condition)?.label },
          { label: '거래방식', value: isFree ? '나눔' : acceptOffersOnly ? '가격제안만' : negotiable ? '가격제안 가능' : '정가거래만' }
        ]
      };

      // LocalStorage 업데이트
      const existingProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
      const updatedProducts = existingProducts.map(product => 
        product.id === productId ? updatedProduct : product
      );
      localStorage.setItem('userProducts', JSON.stringify(updatedProducts));

      alert('상품이 성공적으로 수정되었습니다!');
      router.push('/my-products');

    } catch (error) {
      alert('상품 수정 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewProduct = {
    id: productId,
    title: title || '상품 제목',
    desc: desc || '상품 설명',
    price: isFree ? 0 : acceptOffersOnly ? null : (Number(price) || 0),
    image: images[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    category: category || '카테고리',
    status: originalProduct?.status || '판매중',
    location,
    createdAt: originalProduct?.createdAt || '수정됨',
    likes: originalProduct?.likes || 0,
    chats: originalProduct?.chats || 0,
    isFree,
    acceptOffersOnly
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!title || !desc) {
        alert('상품명과 설명을 입력해주세요');
        return;
      }
      if (!isFree && !acceptOffersOnly && !price) {
        alert('가격을 입력하거나 나눔/가격제안만 옵션을 선택해주세요');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return '기본 정보 수정';
      case 2: return '상세 정보 수정';
      case 3: return '수정 완료';
      default: return '상품 수정';
    }
  };

  const customActions = (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-500">{currentStep}/3 단계</span>
      <button
        onClick={() => router.push('/my-products')}
        className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
      >
        수정 취소
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={getStepTitle()} 
        showBackButton={true} 
        customActions={customActions} 
      />

      {/* 진행 단계 표시 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep >= step 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-1 mx-2 transition-colors ${
                      currentStep > step ? 'bg-blue-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <div className="flex space-x-8 text-sm text-gray-600">
              <span className={`transition-colors ${currentStep >= 1 ? 'text-blue-600 font-medium' : ''}`}>기본정보</span>
              <span className={`transition-colors ${currentStep >= 2 ? 'text-blue-600 font-medium' : ''}`}>상세정보</span>
              <span className={`transition-colors ${currentStep >= 3 ? 'text-blue-600 font-medium' : ''}`}>미리보기</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step 1: 기본 정보 수정 */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">기본 정보를 수정해주세요</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                수정 모드
              </span>
            </div>
            
            <div className="space-y-6">
              {/* 상품명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상품명 *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="상품명을 입력해주세요"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength={40}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                <p className="mt-1 text-sm text-gray-500">{title.length}/40</p>
              </div>

              {/* 나눔 옵션 */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={isFree}
                    onChange={(e) => handleFreeChange(e.target.checked)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                  />
                  <label htmlFor="isFree" className="ml-3 text-sm">
                    <span className="font-medium text-orange-800">🥕 나눔하기</span>
                    <span className="block text-orange-600 text-xs mt-1">
                      무료로 나눔합니다 (당근마켓의 따뜻한 문화!)
                    </span>
                  </label>
                </div>
              </div>

              {/* 가격 */}
              {!isFree && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      판매가격 {!acceptOffersOnly && '*'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={acceptOffersOnly ? "제안받기로 설정됨" : "0"}
                        disabled={acceptOffersOnly}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8 transition-colors ${
                          acceptOffersOnly ? 'bg-gray-100 text-gray-500' : ''
                        } ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <span className="absolute right-3 top-3 text-gray-500">원</span>
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      정가 (선택사항)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="0"
                        disabled={acceptOffersOnly}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8 transition-colors ${
                          acceptOffersOnly ? 'bg-gray-100 text-gray-500' : ''
                        }`}
                      />
                      <span className="absolute right-3 top-3 text-gray-500">원</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 가격 제안 옵션들 */}
              {!isFree && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={acceptOffersOnly}
                        onChange={(e) => handleAcceptOffersOnlyChange(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-blue-800">💰 가격 없이 제안만 받기</span>
                        <p className="text-xs text-blue-600 mt-1">가격을 정하지 않고 구매자 제안만 받습니다</p>
                      </div>
                    </label>
                  </div>

                  {!acceptOffersOnly && (
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={negotiable}
                          onChange={(e) => setNegotiable(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">가격 제안 받기</span>
                      </label>
                      <p className="mt-1 text-sm text-gray-500 ml-6">구매자가 가격을 제안할 수 있습니다</p>
                    </div>
                  )}
                </div>
              )}

              {/* 상품설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상품 설명 *
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="상품에 대해 자세히 설명해주세요"
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors ${
                    errors.desc ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength={1000}
                />
                {errors.desc && <p className="mt-1 text-sm text-red-600">{errors.desc}</p>}
                <p className="mt-1 text-sm text-gray-500">{desc.length}/1000</p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => router.push('/my-products')}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                수정 취소
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                다음 단계
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 상세 정보 수정 - 기존 코드와 동일하되 색상을 파란색으로 변경 */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">상세 정보를 수정해주세요</h2>
            
            <div className="space-y-6">
              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">카테고리를 선택해주세요</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              {/* 상품 상태 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">상품 상태 *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {conditions.map((cond) => (
                    <label
                      key={cond.value}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        condition === cond.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={cond.value}
                        checked={condition === cond.value}
                        onChange={(e) => setCondition(e.target.value)}
                        className="sr-only"
                      />
                      <div className="font-medium text-gray-900">{cond.label}</div>
                      <div className="text-sm text-gray-500 mt-1">{cond.desc}</div>
                    </label>
                  ))}
                </div>
                {errors.condition && <p className="mt-1 text-sm text-red-600">{errors.condition}</p>}
              </div>

              {/* 거래지역 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">거래 지역</label>
                <LocationSelector
                  value={location}
                  onChange={setLocation}
                />
              </div>

              {/* 상품 이미지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">상품 이미지 * (최대 5장)</label>
                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">이미지 {index + 1}</span>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeImageInput(index)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <label className="block text-xs text-gray-600 mb-1">파일 선택</label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={el => fileInputRefs.current[index] = el}
                          onChange={(e) => handleFileUpload(index, e.target.files[0])}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-colors"
                        />
                      </div>
                      
                      <div className="text-center text-gray-400 text-sm mb-3">또는</div>
                      
                      <div className="mb-3">
                        <label className="block text-xs text-gray-600 mb-1">이미지 URL</label>
                        <input
                          type="url"
                          value={image.startsWith('data:') ? '' : image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          placeholder={`이미지 URL ${index + 1}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        />
                      </div>
                      
                      {uploadingImages.includes(index) && (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                          <span className="ml-2 text-sm text-gray-600">업로드 중...</span>
                        </div>
                      )}
                      
                      {image && !uploadingImages.includes(index) && (
                        <div className="mt-3">
                          <img 
                            src={image} 
                            alt={`Preview ${index + 1}`} 
                            className="w-20 h-20 object-cover rounded-lg border"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={addImageInput}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      이미지 추가
                    </button>
                  )}
                </div>
                {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                이전 단계
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                다음 단계
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 미리보기 */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">수정 전 미리보기</h2>
              <p className="text-gray-600 mb-6">상품이 이렇게 수정됩니다. 확인 후 저장해주세요.</p>
              
              <div className="max-w-sm mx-auto">
                <ProductCard product={previewProduct} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">수정 정보 요약</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">상품명:</span>
                  <span className="ml-2 font-medium">{title}</span>
                </div>
                <div>
                  <span className="text-gray-500">가격:</span>
                  <span className="ml-2 font-medium">
                    {isFree ? '나눔' : acceptOffersOnly ? '제안받기' : `${Number(price).toLocaleString()}원`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">카테고리:</span>
                  <span className="ml-2 font-medium">{category}</span>
                </div>
                <div>
                  <span className="text-gray-500">상태:</span>
                  <span className="ml-2 font-medium">{conditions.find(c => c.value === condition)?.label}</span>
                </div>
                <div>
                  <span className="text-gray-500">이미지:</span>
                  <span className="ml-2 font-medium">{images.filter(img => img.trim()).length}장</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                이전 단계
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isSubmitting ? '수정 중...' : '상품 수정 완료'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 