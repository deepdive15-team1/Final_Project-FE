# Button Component

프로젝트 전반에서 사용되는 **확장 가능한 공통 버튼 컴포넌트**입니다.
`forwardRef`를 지원하며, 아이콘 확장성(`ReactNode`)과 다양한 상태(`isSelected`, `rounded` 등)를 처리할 수 있도록 설계되었습니다.

## ✨ 주요 기능

- **6가지 스타일 Variant**: `primary`, `outline`, `outlinePrimary`, `neutral`, `text`, `textPrimary`
- **5가지 사이즈**: `xs`, `sm`, `md`, `lg`, `xl`
- **유연한 아이콘**: `<img>` 태그, SVG 컴포넌트, 이모지 등 **모든 형태의 아이콘** 지원 (`startIcon`, `endIcon`)
- **다양한 형태**: `rounded` (알약/원형), `iconOnly` (아이콘 전용), `fullWidth` (꽉 찬 너비)
- **상태 관리**: `isSelected` (토글 상태), `disabled` (비활성화)
- **접근성 & 제어**: `forwardRef` 지원으로 DOM 제어(포커스 등) 가능

---

## 🚀 사용 방법 (Usage)

### 1. 기본 사용 (Basic)

```tsx
import { Button } from '@/components/common/Button';

// 기본형 (Primary, Large)
<Button onClick={() => alert('클릭!')}>
  로그인
</Button>
```

### 2. 스타일 변형 (Variants)

`variant` props를 통해 버튼의 스타일(색상 테마)을 변경합니다.

```tsx
// 1. 메인 액션 (배경색 있음)
<Button variant="primary">로그인</Button>

// 2. 보조 액션 (회색 배경) - 관리, 취소 등
<Button variant="neutral">관리</Button>

// 3. 테두리 버튼 (회색 테두리) - 거절, 미출석
<Button variant="outline">거절</Button>

// 4. 강조 테두리 (메인색 테두리) - 평가하기
<Button variant="outlinePrimary">평가하기</Button>

// 5. 텍스트 버튼
<Button variant="text">비밀번호 찾기</Button>
<Button variant="textPrimary">회원가입</Button>
```

### 3. 크기 조절 (Sizes)

`size` props로 크기를 조절합니다. (`xs` ~ `xl`)

```tsx
<Button size="xs">Extra Small (36px)</Button>
<Button size="sm">Small (40px)</Button>
<Button size="md">Medium (46px)</Button>
<Button size="lg">Large (56px) - Default</Button>
<Button size="xl">X-Large (96px)</Button>
```

### 4. 아이콘과 함께 사용 (With Icons) 🔥 중요

`startIcon` 또는 `endIcon`에 **ReactNode(태그 형태)**를 전달합니다.
> **주의:** 이미지 경로(`string`)만 넣지 말고, 반드시 `<img />` 태그나 SVG 컴포넌트 형태로 넣어주세요.

```tsx
import { ReactComponent as HeartIcon } from '@/assets/icons/heart.svg';
import CheckIcon from '@/assets/icons/check.png';

// 1. 이미지 태그 사용 (경로인 경우)
<Button 
  startIcon={<img src={CheckIcon} alt="check" width={16} />}
>
  확인
</Button>

// 2. SVG 컴포넌트 사용 (권장 - 색상 제어 용이)
<Button 
  endIcon={<HeartIcon fill="currentColor" />}
>
  좋아요
</Button>

// 3. 이모지 사용
<Button startIcon="🚀">시작하기</Button>
```

### 5. 형태 및 레이아웃 (Shape & Layout)

#### Rounded (알약 / 원형 모양)
`rounded` props를 사용하면 모서리가 완전히 둥글게 변합니다. (`border-radius: 9999px`)

```tsx
// 출석 버튼 (작고 둥근 모양)
<Button variant="primary" size="xs" rounded>
  출석
</Button>
```

#### Icon Only (아이콘 전용 버튼)
`iconOnly`를 사용하면 패딩이 제거되고, 정사각형(혹은 정원) 비율이 맞춰집니다.
`rounded`와 함께 사용하여 **원형 플로팅 버튼**을 만들 수 있습니다.

```tsx
// 지도 위 플로팅 버튼 (원형)
<Button 
  variant="neutral" 
  size="xl" 
  iconOnly 
  rounded
>
  <img src="/icons/plus.svg" alt="추가" />
</Button>
```

#### Full Width (너비 꽉 채우기)
```tsx
<Button fullWidth>화면 하단 고정 버튼</Button>
```

### 6. 선택 상태 (Selected State)

좋아요/싫어요, 필터 버튼 등 **ON/OFF 상태**가 필요할 때 `isSelected`를 사용합니다.
`variant`와 관계없이 선택되면 **메인 컬러(파란색)** 스타일이 우선 적용됩니다.

```tsx
const [isLiked, setIsLiked] = useState(false);

<Button 
  variant="outline" 
  isSelected={isLiked} // true면 파란색 테두리/글씨로 변경됨
  onClick={() => setIsLiked(!isLiked)}
  startIcon={<HeartIcon />}
>
  좋아요
</Button>
```

### 7. 고급 기능: DOM 제어 (ref)

`forwardRef`가 적용되어 있어 부모 컴포넌트에서 버튼을 직접 제어할 수 있습니다.

```tsx
const buttonRef = useRef<HTMLButtonElement>(null);

// 강제로 포커스 주기
buttonRef.current?.focus();

<Button ref={buttonRef}>포커스 타겟</Button>
```

---

## 📋 Props 상세 (API Reference)

| Prop Name | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'outline' \| 'outlinePrimary' \| 'neutral' \| 'text' \| 'textPrimary'` | `'primary'` | 버튼의 색상 테마를 결정합니다. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'lg'` | 버튼의 크기를 결정합니다. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML 버튼의 동작 타입을 설정합니다. |
| `fullWidth` | `boolean` | `false` | `true`일 경우 가로 너비를 100%로 채웁니다. |
| `iconOnly` | `boolean` | `false` | 텍스트 없이 아이콘만 있을 때 사용하며, 1:1 비율을 유지합니다. |
| `rounded` | `boolean` | `false` | `true`일 경우 모서리를 완전한 원형(Pill shape)으로 만듭니다. |
| `isSelected` | `boolean` | `false` | 버튼이 선택된 상태(Active)임을 표시합니다. 메인 컬러 스타일이 강제 적용됩니다. |
| `startIcon` | `ReactNode` | - | 텍스트 **앞**에 들어갈 요소입니다. (`<img />`, SVG, 이모지 등) |
| `endIcon` | `ReactNode` | - | 텍스트 **뒤**에 들어갈 요소입니다. |
| `disabled` | `boolean` | `false` | 버튼을 비활성화하고 반투명하게 만듭니다. |
| `onClick` | `MouseEventHandler` | - | 클릭 이벤트 핸들러입니다. |
| `ref` | `Ref<HTMLButtonElement>` | - | DOM 요소 접근을 위한 ref입니다. |