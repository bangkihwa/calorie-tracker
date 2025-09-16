@echo off
echo GitHub 저장소에 푸시 및 배포를 시작합니다...

git remote remove origin 2>nul
git remote add origin https://github.com/bangkihwa/calorie-tracker.git
git push -u origin main

echo.
echo 빌드 및 GitHub Pages 배포를 시작합니다...
npm run deploy

echo.
echo ====================================
echo 배포가 완료되었습니다!
echo.
echo 앱 주소: https://bangkihwa.github.io/calorie-tracker
echo.
echo 핸드폰에서 위 주소로 접속하세요!
echo ====================================
pause