# Input Component

프로젝트 전반에서 사용되는 재사용 가능한 공통 Input 컴포넌트입니다.
라벨, 유효성 검사(Error), 아이콘 배치 및 다양한 레이아웃 옵션을 `props`로 쉽게 제어할 수 있습니다.

## ✨ 주요 기능

- **표준 Ref 지원**: `forwardRef`를 적용하여 표준 `<input>` 태그와 동일하게 `ref`를 사용할 수 있습니다.
- **자동 접근성 연결**: `useId`를 사용하여 라벨과 인풋이 자동으로 연결되어 웹 접근성을 준수합니다.
- **3가지 사이즈**: `sm`(40px), `md`(44px), `lg`(52px)
- **유연한 아이콘 배치**: `ReactNode` 타입을 지원하여 이미지(`img`)나 SVG 컴포넌트 등을 인풋 앞/뒤에 자유롭게 배치 가능
- **유효성 검사 UI**: `errorMessage` 전달 시 테두리 색상 변경(Red) 및 에러 메시지 자동 노출
- **UX 최적화**: 인풋 주변 여백(Container)을 클릭해도 내부 인풋에 포커스가 이동 (내부 Ref 연동)
- **레이아웃 안정성**: Flexbox 환경에서도 인풋 너비가 깨지지 않도록(`min-width: 0`) 설계됨

---

## 🚀 사용 방법 (Usage)

### 1. 기본 사용 (Basic)

`label`과 `placeholder`를 사용하여 기본적인 입력 폼을 구성합니다.

```tsx
import { Input } from '@/components/common/Input';

<Input 
  label="닉네임" 
  placeholder="닉네임을 입력하세요" 
  name="nickname"
  onChange={(e) => console.log(e.target.value)}
/>
```

### 2. 디자인 테마 (Variants)

`variant` props를 사용하여 인풋의 배경색 스타일을 결정합니다.

* **`primary` (기본값)**: 흰색(white) 배경. 로그인, 회원가입 등 대부분의 입력 폼에 사용됩니다.
* **`neutral`**: 연한 회색(gray-100) 배경. 검색바, 필터, 혹은 강조가 덜 필요한 보조 입력창에 사용됩니다.

```tsx
// 1. 기본형 (White Background)
<Input variant="primary" label="아이디" placeholder="아이디 입력" />

// 2. 중립형 (Gray Background)
<Input variant="neutral" placeholder="검색어를 입력하세요" />
```

### 3. 크기 조절 (Sizes)

`size` props로 높이와 패딩을 조절합니다. (`sm`, `md`, `lg`)

```tsx
<Input size="sm" placeholder="Small (40px) - 모바일/좁은 영역" />
<Input size="md" placeholder="Medium (44px) - 기본값" />
<Input size="lg" placeholder="Large (52px) - 강조 영역" />
```

### 4. 유효성 검사 (Validation State)

`errorMessage` props에 문자열을 전달하면 테두리가 붉은색으로 변하고 하단에 메시지가 표시됩니다.

```tsx
<Input 
  label="이메일" 
  value="wrong-email"
  errorMessage="이메일 형식이 올바르지 않습니다." 
/>
```

### 5. 아이콘과 함께 사용 (With Icons)

`startIcon` 또는 `endIcon` props에 **ReactNode(엘리먼트)**를 전달합니다.
(`img` 태그나 SVG 컴포넌트를 직접 전달해야 합니다.)

```tsx
import SearchIcon from '@/assets/icons/search.svg';
import EyeIcon from '@/assets/icons/eye.svg';

// 1. 앞쪽에 검색 아이콘 (img 태그 전달)
<Input 
  startIcon={<img src={SearchIcon} alt="검색" />}
  placeholder="검색어를 입력하세요" 
/>

// 2. 뒤쪽에 버튼 (컴포넌트 전달)
<Input 
  label="비밀번호"
  type="password"
  endIcon={
    <button type="button" onClick={togglePassword}>
      <img src={EyeIcon} alt="보기" />
    </button>
  }
/>
```

### 6. 레이아웃 옵션 (Width Control)

기본적으로 부모 너비를 꽉 채우며(`fullWidth={true}`), 필요시 해제할 수 있습니다.

```tsx
// 기본값 (width: 100%)
<Input label="꽉 찬 인풋" />

// 컨텐츠 크기만큼만 차지
<Input fullWidth={false} placeholder="Auto width" />
```

### 7. DOM 접근 (Ref Handling)

`forwardRef`가 적용되어 있어 표준 `ref` 속성을 통해 내부 `<input>` 요소에 직접 접근할 수 있습니다.

```tsx
import { useRef } from 'react';

const emailRef = useRef<HTMLInputElement>(null);

const handleFocus = () => {
  // 버튼 클릭 시 인풋으로 포커스 이동
  emailRef.current?.focus();
};

<Input label="이메일" ref={emailRef} />
```

---

## 📋 Props 상세 (API Reference)

| Prop Name | Type | Default | Description |
|---|---|---|---|
| `ref` | `Ref<HTMLInputElement>` | - | 내부 `<input>` DOM 요소에 접근하기 위한 표준 ref입니다. |
| `label` | `string` | - | 인풋 상단에 표시될 라벨 텍스트입니다. |
| `type` | `string` | `"text"` | HTML input type (text, password, email, number 등)입니다. |
| `errorMessage` | `string` | - | 에러 발생 시 표시할 메시지입니다. (존재 시 에러 스타일 적용) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 인풋의 높이(`40px`, `44px`, `52px`)를 결정합니다. |
| `variant` | `'primary' \| 'neutral'` | `'primary'` | **primary**: 흰색 배경(메인), **neutral**: 회색 배경(보조) |
| `fullWidth` | `boolean` | `true` | `true`일 경우 가로 너비를 100%로 설정합니다. |
| `startIcon` | `ReactNode` | - | 인풋 내부 **좌측**에 렌더링할 요소입니다. (`<img />`, `<svg />` 등) |
| `endIcon` | `ReactNode` | - | 인풋 내부 **우측**에 렌더링할 요소입니다. |
| `disabled` | `boolean` | `false` | 인풋을 비활성화합니다. (배경색 변경 및 클릭 방지) |
| `className` | `string` | - | 외부 스타일 적용을 위한 클래스명입니다. |
| `...props` | `InputHTMLAttributes` | - | 기타 HTML `<input>` 속성을 그대로 전달받습니다. (`onChange`, `value`, `placeholder` 등) |