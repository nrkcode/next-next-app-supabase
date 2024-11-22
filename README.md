
일정관리 웹 애플리케이션 프로젝트

피그마 디자인 시안을 통해 필요한 데이터베이스 구조설계 연습을 해보고 next.js와 supabase를 이용하여 기본적인 CRUD 기능을 구현하였다.

npx shadcn@latest init

필수 컴포넌트 설치
```
npx shadcn@latest add alert-dialog
npx shadcn@latest add button
npx shadcn@latest add calendar
npx shadcn@latest add card
npx shadcn@latest add checkbox
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add popover
npx shadcn@latest add progress
npx shadcn@latest add toast
npx shadcn@latest add separator
```

SASS/SCSS 설치: npm i sass

React 마크다운 에디터 설치: npm i @uiw/react-markdown-editor

Supabase 연동을 위한 라이브러리 설치: npm install @supabase/supabase-js


프로젝트 구조

-   App Router 기반 페이지 라우팅이 이루어지니 만큼 `app` 폴더 하위에는 페이지에 관련된 파일이 위치합니다.
-   `public` 폴더를 따로 생성하여 assets와 styles 폴더를 생성하였습니다.
    -   assets: 정적 자원을 관리합니다. (예: 이미지, 아이콘, 폰트 등)
    -   styles: CSS 파일을 관리합니다. (해당 프로젝트는 교육과정이니 만큼 Tailwind CSS와 SCSS를 섞어 진행합니다.)
-   `components` 폴더에서는 해당 프로젝트에서 Base UI되는 컴포넌트들이 설치되어 관리됩니다. ui 폴더 참고해주세요.

---