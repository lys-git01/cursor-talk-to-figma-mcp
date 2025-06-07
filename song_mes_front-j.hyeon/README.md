# React + Vite

## 프로젝트 설명
MES 개발 프로젝트 입니다.

### 라이브러리

    공통 컴포넌트 : primereact  
    상태관리 : zustand  
    date-fns   
    dayjs  
    html2canvas  
    jspdf  
    react-router-dom  

### 폴더구조 설명  
1. assets : 폰트, style, 이미지를 넣습니다.  
2. components   
: 대메뉴명 > 페이지명 > 해당 페이지의 컴포넌트  
: 공통 컴포넌트는 대메뉴명 폴더 위치에 나란히 위치  
3. config  
: 프로젝트 설정값을 저장  
4. dialog  
: 모달이나 팝업을 저장  
: 대메뉴명 > 페이지명 > 해당 페이지의 모달 팝업  
: 공통은 대메뉴명 폴더 위치에 나란히 위치  
5. layouts  
: 레이아웃  
6. pages  
: 대메뉴명>중메뉴>소메뉴>페이지  
: 위치를 특정할 수 없는 페이지는 0-main에 위치  
7. store  
: zustand으로 관리하는 유저정보, toast, dialog를 저장  
8. utils  
: 추가예정, 공통함수가 들어감

### 브랜치명
화면 아이디가 브랜치명이 됨.  
예시) 거래처등록(BM-7102)이면 브랜치명은 BM-7102-거래처등록.

### 커밋 메시지 규칙
feat: 새로운 기능에 대한 커밋  
fix: 버그 수정  
build: 빌드 관련 파일 수정  
ci: CI 관련 설정 수정  
docs: 문서 (문서 추가, 수정, 삭제)  
style: 스타일 (코드 형식, 세미콜론 추가: 비즈니스 로직에 변경 없는 경우)  
refactor: 코드 리팩토링 
test: 테스트 (테스트 코드 추가, 수정, 삭제: 비즈니스 로직에 변경 없는 경우)  
chore: 기타 변경사항 (빌드 스크립트 수정 등)

참고 사이트  
https://github.com/SpaceStationLab/git-commit?tab=readme-ov-file

### 비고
컴펌창은 ConfirmDialog을 사용.