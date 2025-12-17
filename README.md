# TubeRemaster AI 🎬✨

떡상한 유튜브 영상의 성공 방정식을 AI로 분석하고, 내 주제로 새로운 대본을 자동 생성하는 서비스입니다.

## 주요 기능

- 📊 **대본 구조 분석**: 성공한 영상의 구조, 톤앤매너, 후킹 전략 분석
- 💡 **주제 추천**: 동일한 성공 공식을 적용할 수 있는 4가지 새로운 주제 제안
- 📝 **자동 대본 생성**: 선택한 주제로 완성도 높은 유튜브 대본 자동 작성
- 🔐 **API 키 관리**: 로컬 스토리지 기반 안전한 API 키 저장 및 관리
- 🎨 **깔끔한 UI**: 기능 중심의 직관적인 사용자 인터페이스

## 기술 스택

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **AI**: Google Gemini 2.5 Flash API
- **Styling**: Tailwind CSS (inline)
- **Icons**: Lucide React
- **Markdown**: React Markdown

## 로컬 개발 환경 설정

### 1. 저장소 클론

```bash
git clone https://github.com/chocobb79-spec/youtube.git
cd youtube
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 4. Gemini API 키 발급

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. Google 계정으로 로그인
3. "Get API Key" 또는 "Create API Key" 클릭
4. 생성된 API 키 복사
5. 앱 실행 후 나타나는 모달에 API 키 입력 (자동 저장됨)

> **참고**: API 키는 브라우저의 로컬 스토리지에 안전하게 저장되며, 서버로 전송되지 않습니다.

## Vercel 배포

### 방법 1: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 방법 2: Vercel 웹사이트 사용

1. [Vercel](https://vercel.com) 가입/로그인
2. "New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 import
5. 자동으로 설정 감지됨 (vercel.json 기반)
6. "Deploy" 클릭

배포 후 사용자는 각자의 Gemini API 키를 입력하여 사용할 수 있습니다.

## 사용 방법

### 1단계: 대본 입력
떡상한 영상의 대본을 복사하여 붙여넣기 (최소 50자 이상)

### 2단계: 분석 결과 확인
AI가 분석한 영상의:
- 구조 (Structure)
- 톤앤매너 (Tone & Style)
- 후킹 전략 (Hook Strategy)
- 추천 주제 4가지

### 3단계: 주제 선택
마음에 드는 주제를 클릭하여 대본 생성

### 4단계: 대본 활용
생성된 대본을 복사하여 영상 제작에 활용

## 빌드

프로덕션 빌드:

```bash
npm run build
```

빌드 결과물은 `dist` 폴더에 생성됩니다.

프리뷰:

```bash
npm run preview
```

## 프로젝트 구조

```
youtube/
├── components/
│   ├── ApiKeySettings.tsx  # API 키 설정 모달
│   ├── Button.tsx          # 재사용 가능한 버튼 컴포넌트
│   └── StepIndicator.tsx   # 진행 단계 표시
├── services/
│   └── gemini.ts           # Gemini API 통신 로직
├── App.tsx                 # 메인 앱 컴포넌트
├── types.ts                # TypeScript 타입 정의
├── index.tsx               # 진입점
├── index.html              # HTML 템플릿
├── vite.config.ts          # Vite 설정
├── vercel.json             # Vercel 배포 설정
└── package.json            # 프로젝트 메타데이터
```

## 환경 변수

이 프로젝트는 클라이언트 사이드에서 동작하며, API 키는 사용자가 직접 입력하여 로컬 스토리지에 저장됩니다. 따라서 별도의 환경 변수 설정이 필요 없습니다.

## 보안

- API 키는 브라우저의 로컬 스토리지에만 저장되며 서버로 전송되지 않습니다
- 각 사용자는 자신의 API 키를 사용합니다
- API 키는 "기억하기" 기능으로 재입력 불필요

## 라이선스

MIT License

## 문의

이슈나 제안사항이 있으시면 GitHub Issues를 이용해주세요.

---

Made with ❤️ using Google Gemini 2.5 Flash
