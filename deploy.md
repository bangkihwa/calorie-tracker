# 🚀 칼로리 트래커 앱 배포 가이드

## 방법 1: Vercel로 배포 (추천) - 무료
1. https://vercel.com 가입
2. GitHub에 코드 업로드
3. Vercel에서 "Import Project" 클릭
4. GitHub 레포지토리 선택
5. 자동 배포 완료!
6. 생성된 URL을 핸드폰에서 접속

## 방법 2: Netlify로 배포 - 무료
1. 터미널에서 실행:
```bash
npm run build
```
2. https://app.netlify.com/drop 접속
3. build 폴더를 드래그 앤 드롭
4. 생성된 URL을 핸드폰에서 접속

## 방법 3: GitHub Pages로 배포 - 무료
1. package.json에 추가:
```json
"homepage": "https://[당신의깃헙아이디].github.io/calorie-tracker"
```
2. 설치 및 배포:
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d build
```

## 방법 4: PWA로 설치 가능하게 만들기
manifest.json과 service worker를 추가하면 앱처럼 설치 가능!

## 현재 로컬에서 접속하기
같은 와이파이 네트워크에서:
- http://192.168.219.102:3000

## 주의사항
- Google Gemini API 키는 환경변수로 관리 필요
- 배포 시 HTTPS 필요 (카메라 기능 사용)