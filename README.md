# 엘리그 블로그 프로젝트

## 프로젝트 설명

엘리그 블로그는 Next.js의 App Router를 사용하여 개발된 블로그 웹 애플리케이션입니다. 사용자들이 블로그 글을 작성하고 관리할 수 있으며, 카테고리별 필터링, 검색 기능 등을 제공합니다. 또한, 반응형 디자인을 적용하여 다양한 디바이스에서 최적의 사용자 경험을 제공합니다.

## 설치 및 실행방법

1. 저장소 클론

   ```bash
   git clone https://github.com/byeolee1221/l-league-blog.git
   cd l-league-blog
   ```

2. 의존성 설치

   ```bash
   npm install
   # 또는
   bun install
   # 또는
   yarn install
   ```

3. 환경 변수 설정
   `.env` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가:
   ```
   BASE_API_URL=https://api.interview.l-league.co.kr
   NEXT_PUBLIC_BASE_API_URL=https://api.interview.l-league.co.kr
   OWNER_EMAIL=user7284@l-league.co.kr
   ```
4. 개발 서버 실행

   ```bash
   npm run dev
   # 또는
   bun run dev
   # 또는
   yarn dev
   ```

5. 브라우저에서 접속
   ```
   http://localhost:3000
   ```

## 구현한 기능 목록

1. **사용자 인증**

   - 로그인/로그아웃 기능
     - 로그인 화면 구현
     - 마이페이지 아이콘 클릭 시 로그아웃 처리
   - JWT 토큰 기반 인증 (액세스 토큰/리프레시 토큰)

2. **블로그 기능**

   - 게시글 CRUD (생성, 조회, 수정, 삭제)
   - 카테고리별 게시글 필터링
   - 제목 기반 검색 기능
   - 페이지네이션 (10개씩 표시)
   - 메인화면 구현
     - 카테고리별 필터링 기능
     - 블로그 제목 검색

3. **블로그 등록**

   - 글 등록 화면 구현
   - 글 등록 완료 시 상세화면으로 페이지 이동
   - 글 등록 완료 시 페이지 히스토리 삭제(history.back을 통한 페이지 접근 제한)
   - 글 작성중 뒤로가기 시 "작성중인 내용이 삭제됩니다." 컨펌창 출력

4. **블로그 상세 조회**

   - 상세화면 구현
   - 이미지와 콘텐츠 표시

5. **블로그 수정/삭제**

   - 메인화면 글 목록 우측 더보기 버튼 클릭 시 수정/삭제 모달 구현
   - 타이틀바 우측 상단 수정 버튼 클릭 시 수정화면으로 이동
   - 수정화면 구현
   - 수정 완료 시 상세화면으로 페이지 이동
   - 글 수정 완료 시 페이지 히스토리 삭제(history.back을 통한 페이지 접근 제한)
   - 글 수정중 뒤로가기 시 "작성중인 내용이 삭제됩니다." 컨펌창 출력

6. **이미지 관리**

   - 메인 이미지 및 서브 이미지 업로드
   - 이미지 미리보기
   - 글 작성/수정 시 이미지 처리

7. **사용자 인터페이스**
   - 반응형 디자인 (모바일/태블릿/데스크톱)
   - 토스트 알림을 통한 사용자 피드백
   - 수정 중 페이지 이탈 방지 (Dirty State 관리)

## 사용한 기술 스택 및 라이브러리

- **프레임워크**:
  - Next.js v15.3.0 (App Router)
  - React v19.0.0
- **언어**: TypeScript v5
- **스타일링**:
  - Tailwind CSS v4
  - tailwind-merge v3.2.0
  - clsx v2.1.1
- **상태 관리**:
  - TanStack Query v5.72.2: 서버 상태 관리
  - Jotai v2.12.3: 전역 상태 관리
- **폼 관리**:
  - React Hook Form v7.55.0
  - @hookform/resolvers v5.0.1
- **API 통신**:
  - Server Actions: 서버 요청 처리
- **UI/UX**:
  - React Hot Toast v2.5.2: 알림 시스템
  - React Icons v5.5.0: 아이콘 컴포넌트
  - Framer Motion v12.6.3: 애니메이션
- **유효성 검사**:
  - Zod v3.24.2: 데이터 유효성 검증
- **유틸리티**:
  - nanoid v5.1.5: 고유 ID 생성

## 개발하면서 고려한 부분이나 어려웠던 점

### 1. 서버에서의 에러처리 부분

- 지금까지 해왔던 프로젝트에서는 상태코드에 따라 나올 수 있는 예상되는 에러에 대한 에러처리만 했었는데, 이렇게 했을 경우 놓치게 되는 에러가 있었습니다. 그래서 이번에는 주요 상태코드별로 에러 케이스를 만들어서 에러처리를 해서 그러한 애로사항을 방지하고자 했습니다.

```typescript
switch (response.status) {
  case 400:
    return { error: "요청 형식이 올바르지 않습니다." };
  case 401:
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  case 403:
    return { error: "계정이 차단되었거나 접근 권한이 없습니다." };
  case 404:
    return { error: "요청한 서비스를 찾을 수 없습니다." };
  case 422:
    return { error: "입력하신 정보가 유효하지 않습니다." };
  case 429:
    return { error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요." };
  case 500:
    return { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  case 503:
    return { error: "서비스가 일시적으로 이용 불가합니다. 잠시 후 다시 시도해주세요." };
  default:
    // 서버에서 에러 메시지를 전송한 경우 해당 메시지 사용
    return {
      error: errorData?.message || errorData?.error || "로그인 중 오류가 발생했습니다.",
    };
}
```

### 2. 사용자 경험 최적화 부분

- 수정 페이지에서 변경 사항이 있을 때 페이지 이탈 방지 기능 구현
  - 이 기능을 처음 구현했을 때는 뒤로가기를 눌러도 컨펌창이 안뜨기도 하고 뒤로가기를 몇 번씩 눌러야 이전페이지로 돌아가는 등의 문제가 있었습니다. 이는 이탈 방지 로직이 진행되면서 history가 인위적으로 조정되는 부분이 문제였고, history에 따라 popstate 이벤트가 반복 발생하는 게 원인이었습니다. 그래서 최대한 단순하게 만들기 위해 로직 초기에 뒤로가기를 감지하여 컨펌창에서 확인을 누르면 popstate 이벤트를 먼저 제거하고, 곧바로 이전페이지로 이동하도록 수정했습니다.

```typescript
export const usePreventLeave = () => {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isDirty) {
      const handlePopState = () => {
        const shouldLeave = window.confirm("작성중인 내용이 삭제됩니다.");

        if (shouldLeave) {
          setIsDirty(false);

          // 히스토리 문제로 인해 이벤트 리스너 먼저 제거
          window.removeEventListener("popstate", handlePopState);
          window.history.go(-1);
        } else {
          window.history.pushState(null, "", window.location.href);
        }
      };

      // 현재 상태를 히스토리에 추가
      window.history.pushState(null, "", window.location.href);

      // 이벤트 리스너 등록
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isDirty]);

  return {
    setDirty: setIsDirty,
    resetDirty: () => setIsDirty(false),
  };
};
```  

- 검색 및 카테고리 필터링의 사용자 경험 개선
  - 처음에 검색기능을 구현했을 때 검색해도 결과가 나오지 않았었는데, 이는 해당 검색결과가 검색된 게시글이 있는 카테고리에서만 나오기 때문이었습니다. 그래서 사용자가 편하게 검색된 게시글을 볼 수 있도록 카테고리 ID를 따로 전송하지 않는 전체 카테고리를 만들었습니다.

```typescript
{/* 전체 카테고리 추가 */}
  <Link
    href={`/?category=0`}
    scroll={false}
    className={cn(
      "group relative flex min-w-fit flex-col items-center px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors sm:px-4 sm:py-2",
      activeCategory === 0 ? "text-orange-500" : "text-gray-600 hover:text-orange-500",
    )}
  >
    <span>전체</span>
    <span
      className={cn(
        "absolute -bottom-0.5 left-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full",
        activeCategory === 0 ? "w-full" : "",
      )}
    />
  </Link>
```

### 3. 모바일 상단 navbar 부분

- navbar 변경 전용 커스텀훅 구현
  - 모바일용 상단 navbar는 페이지별로 달라야하기에 navbar 관련 컴포넌트에서 작업하면 상태관리가 복잡해지고 가독성이 떨어지는 문제가 있었습니다. 그래서 페이지별로 표출되는 게 달라야하는 부분을 useNavbarConfig이라는 커스텀훅을 만들어서 boolean 값으로 관리했고, navbar 컴포넌트의 복잡성을 늘리지 않도록 했습니다.

```typescript
// 관련 코드 일부분
const isEditPage = pathname.includes("/posts/edit/");
const isWritePage = pathname === "/posts/write";
const isAuthPage = pathname === "/signin";
const isPostDetailPage = /\/posts\/[^/]+\/\d+$/.test(pathname);

if (isWritePage || isEditPage) {
  return {
    type: "editor",
    title: isEditPage ? "글 수정" : "글 등록",
    showBackButton: true,
    showLogo: true,
    showMenu: false,
    showAuthButtons: true,
    showMobileNav: false,
  };
}

if (isPostDetailPage) { 
  return {
    type: "detail",
    showBackButton: true,
    showLogo: false,
    showMenu: true,
    showAuthButtons: true,
    showMobileNav: true,
  }
}
```

### 4. 조회수 랭킹 부분

- 조회수 대신 서버에서 기본으로 제공하는 created_at 기준 정렬
  - UI 예시에서 조회수 랭킹 부분을 구현하기 위해선 게시글별로 조회수 카운트값이 있어야하는데, 제공되는 값에 따라 created_at을 기준으로 10개의 게시글이 정렬되도록 했습니다.

```typescript
// ViewRanking.tsx의 일부
useEffect(() => {
  const fetchTopPosts = async () => {
    setLoading(true);
    try {
      const result = await getPosts({ page: 1, page_size: 10 });
      
      if (result.success) {
        setPosts(result.data.data || []);
      }
    } catch (error) {
      console.error("조회수 TOP 10 게시글 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTopPosts();
}, []);
```

### 5. 이미지 업로드 부분

- string만 전달해야 하는 구현점에 따른 로직 구현
  - 백엔드에서 string인 file_name만 받는 구조로 인해 File로 전달이 되지 않고, blob 객체를 보내기에는 백엔드에서 multipart 형식으로는 받지 않아서 파일객체를 base64 문자열로 변환하고, 이를 그대로 업로드하려고 했습니다. 하지만 255자가 넘어서 null 값이 반환되어 임의 ID를 생성하는 nanoId를 설치하여 서버 업로드 전 임시 문자열을 생성 후 업로드하여 S3 업로드용 URL을 받고, S3에 직접 blob 객체를 PUT 메서드로 직접 업로드하는 presigned URL 패턴을 이용하여 이미지가 업로드되지 않던 문제를 해결했습니다.

```typescript
export const uploadImage = async (base64Image: string): Promise<UploadResponse> => {
  try {
    // ... 인증 토큰 확인 등의 코드 생략 ...

    // MIME 타입과 확장자 추출
    const mimeMatch = base64Image.match(/data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";
    const extension = mimeType.split("/")[1] || "jpg";

    // nanoid로 랜덤 파일명 생성 (확장자 포함)
    const fileName = `${nanoid(10)}.${extension}`;

    // API 서버에 파일명만 전송하여 업로드 URL 요청
    const response = await fetch(`${process.env.BASE_API_URL}/api/v1/aws/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        file_name: fileName,
      }),
    });

    // ... 응답 처리 코드 생략 ...

    const { uploadURL, imageURL } = await response.json();

    // base64 이미지 데이터를 Blob으로 변환
    const base64Data = base64Image.split(",")[1];
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    // ... Blob 변환 코드 생략 ...

    const blob = new Blob(byteArrays, { type: mimeType });

    // S3에 직접 업로드 (PUT 요청)
    const uploadResponse = await fetch(uploadURL, {
      method: "PUT",
      body: blob,
    });

    // ... 결과 반환 코드 생략 ...
  } catch (error) {
    // ... 에러 처리 코드 생략 ...
  }
};
```  
