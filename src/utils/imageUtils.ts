// 이미지 크기 조정 및 압축
export const compressImage = (base64String: string, maxWidth: number = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject('Canvas context not available');
        return;
      }

      // 비율 유지하면서 크기 조정
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height);

      // JPEG로 압축 (품질 0.6)
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

      // 크기 체크
      const sizeInKB = Math.round(compressedBase64.length * 0.75 / 1024);
      console.log(`Image compressed: ${sizeInKB}KB`);

      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject('Failed to load image');
    };

    img.src = base64String;
  });
};

// localStorage 사용량 체크
export const checkStorageUsage = (): { used: number; available: boolean } => {
  let totalSize = 0;

  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const itemSize = localStorage[key].length + key.length;
        totalSize += itemSize;
      }
    }

    const usedMB = (totalSize / 1024 / 1024).toFixed(2);
    console.log(`LocalStorage usage: ${usedMB}MB`);

    // 일반적으로 5MB 제한, 4MB 이상 사용시 경고
    return {
      used: parseFloat(usedMB),
      available: parseFloat(usedMB) < 4
    };
  } catch (e) {
    console.error('Storage check failed:', e);
    return { used: 0, available: false };
  }
};

// 오래된 이미지 정리 (7일 이상 된 이미지)
export const cleanOldImages = (entries: any[]): any[] => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return entries.map(entry => {
    const entryDate = new Date(entry.date);
    if (entryDate < sevenDaysAgo && entry.imageUrl) {
      console.log('Removing old image from entry:', entry.id);
      return { ...entry, imageUrl: '' };
    }
    return entry;
  });
};