interface FoodRecognitionResult {
  name: string;
  confidence: number;
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
}

interface NutritionData {
  [key: string]: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
}

// 확장된 한국 음식 데이터베이스
const koreanFoodDatabase: NutritionData = {
  // 밥류
  '밥': { calories: 210, carbs: 48, protein: 4, fat: 0.5 },
  '쌀밥': { calories: 210, carbs: 48, protein: 4, fat: 0.5 },
  '현미밥': { calories: 218, carbs: 45, protein: 5, fat: 2 },
  '보리밥': { calories: 195, carbs: 44, protein: 4, fat: 0.8 },
  '잡곡밥': { calories: 200, carbs: 43, protein: 5, fat: 1.5 },
  '볶음밥': { calories: 380, carbs: 55, protein: 10, fat: 12 },
  '김치볶음밥': { calories: 400, carbs: 58, protein: 12, fat: 13 },
  '새우볶음밥': { calories: 420, carbs: 60, protein: 15, fat: 14 },

  // 국/찌개류
  '김치찌개': { calories: 120, carbs: 10, protein: 8, fat: 5 },
  '된장찌개': { calories: 120, carbs: 10, protein: 8, fat: 5 },
  '순두부찌개': { calories: 150, carbs: 12, protein: 10, fat: 7 },
  '부대찌개': { calories: 280, carbs: 20, protein: 15, fat: 16 },
  '갈비탕': { calories: 350, carbs: 15, protein: 25, fat: 20 },
  '설렁탕': { calories: 250, carbs: 12, protein: 20, fat: 12 },
  '삼계탕': { calories: 450, carbs: 30, protein: 35, fat: 20 },
  '미역국': { calories: 90, carbs: 8, protein: 6, fat: 4 },
  '콩나물국': { calories: 80, carbs: 7, protein: 5, fat: 3 },

  // 반찬류
  '김치': { calories: 15, carbs: 3, protein: 1, fat: 0.2 },
  '깍두기': { calories: 18, carbs: 4, protein: 1, fat: 0.2 },
  '나물': { calories: 40, carbs: 6, protein: 2, fat: 1 },
  '멸치볶음': { calories: 120, carbs: 8, protein: 15, fat: 3 },
  '계란말이': { calories: 150, carbs: 2, protein: 12, fat: 10 },
  '두부조림': { calories: 130, carbs: 6, protein: 10, fat: 8 },
  '어묵볶음': { calories: 140, carbs: 12, protein: 8, fat: 6 },

  // 고기류
  '불고기': { calories: 250, carbs: 8, protein: 22, fat: 15 },
  '삼겹살': { calories: 330, carbs: 0, protein: 20, fat: 28 },
  '돼지고기': { calories: 300, carbs: 0, protein: 22, fat: 24 },
  '갈비': { calories: 350, carbs: 5, protein: 25, fat: 26 },
  '제육볶음': { calories: 280, carbs: 10, protein: 20, fat: 18 },
  '닭갈비': { calories: 260, carbs: 15, protein: 23, fat: 12 },
  '치킨': { calories: 350, carbs: 20, protein: 25, fat: 20 },
  '양념치킨': { calories: 380, carbs: 28, protein: 23, fat: 20 },
  '후라이드치킨': { calories: 340, carbs: 15, protein: 26, fat: 20 },

  // 면류
  '라면': { calories: 500, carbs: 65, protein: 10, fat: 20 },
  '짜장면': { calories: 550, carbs: 75, protein: 15, fat: 20 },
  '짬뽕': { calories: 480, carbs: 60, protein: 18, fat: 15 },
  '비빔면': { calories: 520, carbs: 70, protein: 12, fat: 20 },
  '냉면': { calories: 420, carbs: 70, protein: 12, fat: 8 },
  '물냉면': { calories: 400, carbs: 68, protein: 10, fat: 6 },
  '비빔냉면': { calories: 450, carbs: 72, protein: 14, fat: 10 },
  '잔치국수': { calories: 380, carbs: 65, protein: 10, fat: 8 },
  '칼국수': { calories: 420, carbs: 68, protein: 14, fat: 10 },
  '우동': { calories: 400, carbs: 70, protein: 12, fat: 8 },

  // 한식 메인
  '비빔밥': { calories: 490, carbs: 65, protein: 15, fat: 16 },
  '김밥': { calories: 320, carbs: 45, protein: 10, fat: 10 },
  '떡볶이': { calories: 380, carbs: 65, protein: 8, fat: 10 },
  '순대': { calories: 350, carbs: 40, protein: 12, fat: 15 },
  '전': { calories: 200, carbs: 15, protein: 8, fat: 12 },
  '파전': { calories: 250, carbs: 25, protein: 8, fat: 13 },
  '김치전': { calories: 230, carbs: 22, protein: 7, fat: 12 },
  '감자전': { calories: 220, carbs: 28, protein: 5, fat: 10 },

  // 탕수육/중식
  '탕수육': { calories: 450, carbs: 40, protein: 20, fat: 25 },
  '깐풍기': { calories: 420, carbs: 35, protein: 25, fat: 20 },
  '양장피': { calories: 380, carbs: 30, protein: 18, fat: 22 },
  '마파두부': { calories: 280, carbs: 15, protein: 15, fat: 18 },

  // 분식
  '떡국': { calories: 350, carbs: 55, protein: 10, fat: 10 },
  '라볶이': { calories: 450, carbs: 60, protein: 12, fat: 18 },
  '쫄면': { calories: 400, carbs: 65, protein: 10, fat: 12 },
  '만두': { calories: 280, carbs: 35, protein: 10, fat: 11 },
  '군만두': { calories: 300, carbs: 35, protein: 10, fat: 13 },
  '물만두': { calories: 260, carbs: 35, protein: 10, fat: 9 },

  // 해산물
  '회': { calories: 120, carbs: 2, protein: 23, fat: 3 },
  '초밥': { calories: 180, carbs: 25, protein: 12, fat: 3 },
  '생선구이': { calories: 200, carbs: 0, protein: 30, fat: 8 },
  '고등어구이': { calories: 250, carbs: 0, protein: 28, fat: 15 },
  '갈치구이': { calories: 220, carbs: 0, protein: 26, fat: 12 },
  '조기구이': { calories: 180, carbs: 0, protein: 25, fat: 8 },

  // 양식
  '스테이크': { calories: 450, carbs: 5, protein: 35, fat: 32 },
  '파스타': { calories: 380, carbs: 50, protein: 12, fat: 14 },
  '피자': { calories: 280, carbs: 35, protein: 12, fat: 10 },
  '햄버거': { calories: 450, carbs: 40, protein: 20, fat: 22 },
  '샌드위치': { calories: 350, carbs: 35, protein: 15, fat: 16 },
  '샐러드': { calories: 150, carbs: 10, protein: 5, fat: 10 },

  // 간식/디저트
  '빵': { calories: 260, carbs: 50, protein: 8, fat: 4 },
  '케이크': { calories: 350, carbs: 45, protein: 5, fat: 18 },
  '도넛': { calories: 300, carbs: 35, protein: 4, fat: 16 },
  '과자': { calories: 180, carbs: 25, protein: 2, fat: 8 },
  '초콜릿': { calories: 200, carbs: 24, protein: 2, fat: 12 },
  '아이스크림': { calories: 250, carbs: 30, protein: 4, fat: 13 },

  // 음료
  '커피': { calories: 5, carbs: 1, protein: 0, fat: 0 },
  '라떼': { calories: 120, carbs: 10, protein: 6, fat: 6 },
  '주스': { calories: 110, carbs: 26, protein: 1, fat: 0 },
  '콜라': { calories: 140, carbs: 35, protein: 0, fat: 0 },
  '맥주': { calories: 150, carbs: 13, protein: 1, fat: 0 },
  '소주': { calories: 60, carbs: 0, protein: 0, fat: 0 },

  // 기타
  '족발': { calories: 380, carbs: 5, protein: 30, fat: 27 },
  '보쌈': { calories: 350, carbs: 8, protein: 28, fat: 24 },
  '곱창': { calories: 420, carbs: 3, protein: 18, fat: 38 },
  '막창': { calories: 400, carbs: 2, protein: 16, fat: 36 }
};

// Clarifai API를 사용한 음식 인식 (무료 버전)
export async function recognizeFoodFromImage(imageBase64: string): Promise<FoodRecognitionResult[]> {
  try {
    // Clarifai Community API (무료)
    const API_KEY = 'YOUR_CLARIFAI_API_KEY'; // 실제 사용 시 API 키 필요

    // 이미지 분석 시뮬레이션 (실제 구현 시 Clarifai API 호출)
    // 데모용으로 이미지에서 랜덤하게 음식을 감지하는 시뮬레이션
    const simulatedResults = await simulateFoodRecognition(imageBase64);

    return simulatedResults;
  } catch (error) {
    console.error('Food recognition error:', error);
    throw error;
  }
}

// 실제 API 없이 시뮬레이션 (데모용)
async function simulateFoodRecognition(imageBase64: string): Promise<FoodRecognitionResult[]> {
  return new Promise((resolve) => {
    // 1-2초 지연 시뮬레이션
    setTimeout(() => {
      // 랜덤하게 1-3개의 음식 감지
      const foodItems = Object.keys(koreanFoodDatabase);
      const numItems = Math.floor(Math.random() * 3) + 1;
      const results: FoodRecognitionResult[] = [];

      const selectedIndices = new Set<number>();
      while (selectedIndices.size < numItems) {
        selectedIndices.add(Math.floor(Math.random() * foodItems.length));
      }

      Array.from(selectedIndices).forEach(index => {
        const foodName = foodItems[index];
        const nutrition = koreanFoodDatabase[foodName];
        results.push({
          name: foodName,
          confidence: 0.7 + Math.random() * 0.3, // 70-100% 신뢰도
          ...nutrition
        });
      });

      // 신뢰도 순으로 정렬
      results.sort((a, b) => b.confidence - a.confidence);

      resolve(results);
    }, 1500);
  });
}

// 음식 이름으로 영양 정보 추정
export function estimateNutritionByName(foodName: string, servings: number = 1): {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
} {
  const normalizedName = foodName.toLowerCase();

  // 정확한 매칭 찾기
  for (const [food, nutrition] of Object.entries(koreanFoodDatabase)) {
    if (normalizedName.includes(food.toLowerCase()) || food.toLowerCase().includes(normalizedName)) {
      return {
        calories: Math.round(nutrition.calories * servings),
        carbs: Math.round(nutrition.carbs * servings),
        protein: Math.round(nutrition.protein * servings),
        fat: Math.round(nutrition.fat * servings)
      };
    }
  }

  // 기본값 (일반 한식 평균)
  return {
    calories: Math.round(300 * servings),
    carbs: Math.round(40 * servings),
    protein: Math.round(15 * servings),
    fat: Math.round(10 * servings)
  };
}

// TensorFlow.js를 사용한 로컬 AI 모델 (선택사항)
export async function initializeLocalAIModel() {
  // TensorFlow.js 모델 로드 (추후 구현 가능)
  // const model = await tf.loadLayersModel('/model/food-recognition-model.json');
  // return model;
}

// 음식 이미지 전처리
export function preprocessImage(imageBase64: string): string {
  // Base64에서 data URL 부분 제거
  const base64Data = imageBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
  return base64Data;
}