import React, { useState, useRef } from 'react';
import { Camera, Plus, Users, Loader, Sparkles, Smartphone } from 'lucide-react';
import { FoodEntry } from '../types';
import { addFoodEntry } from '../utils/storage';
import { recognizeFoodFromImage, estimateNutritionByName } from '../services/aiService';
import { format } from 'date-fns';
import CameraCapture from './CameraCapture';
import { compressImage, checkStorageUsage } from '../utils/imageUtils';

interface FoodEntryFormProps {
  onEntryAdded: () => void;
}

const FoodEntryForm: React.FC<FoodEntryFormProps> = ({ onEntryAdded }) => {
  const [foodName, setFoodName] = useState('');
  const [servings, setServings] = useState(1);
  const [calories, setCalories] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<any[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (imageBase64: string, file?: File) => {
    try {
      // 이미지 압축
      console.log('Compressing image...');
      const compressedImage = await compressImage(imageBase64);
      console.log('Image compressed successfully');

      setImageUrl(compressedImage);
      setIsAnalyzing(true);

      try {
        // Google Gemini API를 사용한 음식 인식
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyBXwz6MIv-Td4-50z_XPW4uBL81HzZMkhY'
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: '이 이미지에서 음식을 분석해주세요. 각 음식의 이름(한국어), 예상 칼로리, 탄수화물(g), 단백질(g), 지방(g)을 JSON 형식으로 응답해주세요. 형식: [{"name":"음식명","calories":숫자,"carbs":숫자,"protein":숫자,"fat":숫자}]'
              },
              {
                inlineData: {
                  mimeType: file?.type || 'image/jpeg',
                  data: compressedImage.split(',')[1]
                }
              }
            ]
          }]
        })
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        try {
          const textContent = data.candidates[0].content.parts[0].text;
          // JSON 부분 추출
          const jsonMatch = textContent.match(/\[.*\]/s);
          if (jsonMatch) {
            const foods = JSON.parse(jsonMatch[0]);
            if (foods.length > 0) {
              setDetectedFoods(foods);
              // 첫 번째 음식을 자동 선택
              const firstFood = foods[0];
              setFoodName(firstFood.name);
              setCalories(firstFood.calories);
              setCarbs(firstFood.carbs);
              setProtein(firstFood.protein);
              setFat(firstFood.fat);
            }
          }
        } catch (parseError) {
          console.error('JSON 파싱 에러:', parseError);
          // 파싱 실패 시 기본 추정값 사용
          const nutrition = estimateNutritionByName(foodName || '음식', servings);
          setCalories(nutrition.calories);
          setCarbs(nutrition.carbs);
          setProtein(nutrition.protein);
          setFat(nutrition.fat);
        }
      }
      } catch (error) {
        console.error('이미지 분석 에러:', error);
        // API 호출 실패 시 로컬 데이터베이스 사용
        const results = await recognizeFoodFromImage(compressedImage);
        if (results.length > 0) {
          setDetectedFoods(results);
          const firstFood = results[0];
          setFoodName(firstFood.name);
          setCalories(firstFood.calories || 0);
          setCarbs(firstFood.carbs || 0);
          setProtein(firstFood.protein || 0);
          setFat(firstFood.fat || 0);
        }
      } finally {
        setIsAnalyzing(false);
      }
    } catch (compressionError) {
      console.error('Image processing error:', compressionError);
      alert('이미지 처리 중 오류가 발생했습니다.');
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageBase64 = reader.result as string;
        await processImage(imageBase64, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async (imageData: string) => {
    await processImage(imageData);
  };

  const handleFoodNameChange = (name: string) => {
    setFoodName(name);
    if (name && !detectedFoods.length) {
      const nutrition = estimateNutritionByName(name, servings);
      setCalories(nutrition.calories);
      setCarbs(nutrition.carbs);
      setProtein(nutrition.protein);
      setFat(nutrition.fat);
    }
  };

  const selectDetectedFood = (food: any) => {
    setFoodName(food.name);
    setCalories(Math.round(food.calories * servings));
    setCarbs(Math.round(food.carbs * servings));
    setProtein(Math.round(food.protein * servings));
    setFat(Math.round(food.fat * servings));
  };

  const handleServingsChange = (newServings: number) => {
    if (foodName && servings > 0) {
      const ratio = newServings / servings;
      setCalories(Math.round(calories * ratio));
      setCarbs(Math.round(carbs * ratio));
      setProtein(Math.round(protein * ratio));
      setFat(Math.round(fat * ratio));
    }
    setServings(newServings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodName.trim()) {
      alert('음식명을 입력해주세요.');
      return;
    }

    // 유니크한 ID 생성 (timestamp + random)
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const entry: FoodEntry = {
      id: uniqueId,
      date: date,
      time: time,
      foodName: foodName.trim(),
      servings,
      calories: Math.max(0, calories),
      carbs: Math.max(0, carbs),
      protein: Math.max(0, protein),
      fat: Math.max(0, fat),
      imageUrl
    };

    // 저장 전 스토리지 체크
    const storage = checkStorageUsage();
    if (!storage.available) {
      alert('저장 공간이 부족합니다. 오래된 기록을 삭제해주세요.');
      return;
    }

    console.log('Saving entry:', entry);

    try {
      addFoodEntry(entry);
      console.log('Entry saved successfully');
      alert('음식이 성공적으로 기록되었습니다!');
    } catch (error) {
      console.error('Failed to save entry:', error);

      // 더 구체적인 에러 메시지
      if (error && error.toString().includes('QuotaExceeded')) {
        alert('저장 공간이 가득 찼습니다. 오래된 기록을 삭제한 후 다시 시도해주세요.');
      } else {
        alert('저장에 실패했습니다. 이미지 크기를 줄이거나 이미지 없이 저장해보세요.');
      }
      return;
    }

    // 폼 초기화
    setFoodName('');
    setServings(1);
    setCalories(0);
    setCarbs(0);
    setProtein(0);
    setFat(0);
    setImageUrl('');
    setDetectedFoods([]);
    // 날짜와 시간은 유지 (연속 입력 편의성)
    setTime(format(new Date(), 'HH:mm'));

    // 부모 컴포넌트에 알림
    setTimeout(() => {
      onEntryAdded();
    }, 100);
  };

  return (
    <>
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <div className="food-entry-form">
        <h2>음식 기록하기</h2>
        <form onSubmit={handleSubmit}>
          <div className="image-upload-section">
            {imageUrl ? (
              <div className="image-preview">
                <img src={imageUrl} alt="Food" />
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    setDetectedFoods([]);
                  }}
                  className="remove-image"
                >
                  ✕
                </button>
                {isAnalyzing && (
                  <div className="analyzing-overlay">
                    <Loader className="spinner" size={24} />
                    <span>AI가 음식을 분석하고 있습니다...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="upload-buttons">
                <button
                  type="button"
                  className="upload-button camera-button"
                  onClick={() => setShowCamera(true)}
                >
                  <Smartphone size={24} />
                  <span>카메라로 촬영</span>
                  <div className="ai-badge">
                    <Sparkles size={16} />
                    <span>AI 자동 인식</span>
                  </div>
                </button>
                <button
                  type="button"
                  className="upload-button gallery-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={24} />
                  <span>갤러리에서 선택</span>
                </button>
              </div>
            )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        {detectedFoods.length > 0 && (
          <div className="detected-foods">
            <h4>
              <Sparkles size={16} />
              AI가 감지한 음식
            </h4>
            <div className="food-suggestions">
              {detectedFoods.map((food, index) => (
                <button
                  key={index}
                  type="button"
                  className={`food-suggestion ${foodName === food.name ? 'selected' : ''}`}
                  onClick={() => selectDetectedFood(food)}
                >
                  <span className="food-name">{food.name}</span>
                  <span className="food-calories">{food.calories} kcal</span>
                  {food.confidence && (
                    <span className="confidence">{Math.round(food.confidence * 100)}%</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>날짜</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>시간</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>음식명</label>
          <input
            type="text"
            value={foodName}
            onChange={(e) => handleFoodNameChange(e.target.value)}
            placeholder="예: 비빔밥, 치킨, 샐러드"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <Users size={16} />
            인분 (몇 명이서 먹나요?)
          </label>
          <input
            type="number"
            value={servings}
            onChange={(e) => handleServingsChange(Number(e.target.value))}
            min="0.5"
            step="0.5"
            required
          />
        </div>

        <div className="nutrition-inputs">
          <div className="form-group">
            <label>칼로리 (kcal)</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>탄수화물 (g)</label>
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(Number(e.target.value))}
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>단백질 (g)</label>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(Number(e.target.value))}
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>지방 (g)</label>
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(Number(e.target.value))}
              min="0"
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          <Plus size={20} />
          기록하기
        </button>
      </form>
    </div>
    </>
  );
};

export default FoodEntryForm;