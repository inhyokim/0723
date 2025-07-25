'use client';
import { useState, useEffect } from 'react';
import { locations } from '@/app/data/locations';

export default function LocationSelector({ 
  value = '', 
  onChange, 
  placeholder = "거래 지역을 선택해주세요",
  className = ""
}) {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  // 초기값 설정
  useEffect(() => {
    if (value) {
      const parts = value.split(' ');
      if (parts.length >= 2) {
        const province = parts[0];
        const city = parts.slice(1).join(' ');
        
        if (locations[province] && locations[province].includes(city)) {
          setSelectedProvince(province);
          setSelectedCity(city);
        }
      }
    }
  }, [value]);

  // 시도 선택 핸들러
  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
    setSelectedCity('');
    if (onChange) {
      onChange('');
    }
  };

  // 시군구 선택 핸들러
  const handleCityChange = (city) => {
    setSelectedCity(city);
    const fullLocation = `${selectedProvince} ${city}`;
    if (onChange) {
      onChange(fullLocation);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 시도 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          시도 *
        </label>
        <select
          value={selectedProvince}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        >
          <option value="">시도를 선택해주세요</option>
          {Object.keys(locations).map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* 시군구 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          시군구 *
        </label>
        <select
          value={selectedCity}
          onChange={(e) => handleCityChange(e.target.value)}
          disabled={!selectedProvince}
          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
            selectedProvince
              ? 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
              : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
          }`}
        >
          <option value="">
            {selectedProvince ? '시군구를 선택해주세요' : '먼저 시도를 선택해주세요'}
          </option>
          {selectedProvince && locations[selectedProvince]?.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* 선택된 지역 표시 */}
      {value && (
        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-orange-800">
              <span className="font-medium">선택된 지역:</span> {value}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedProvince('');
                setSelectedCity('');
                if (onChange) onChange('');
              }}
              className="text-xs text-orange-600 hover:text-orange-800"
            >
              다시 선택
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 