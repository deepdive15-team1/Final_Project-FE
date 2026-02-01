# TextField

여러 줄 입력을 위한 공통 TextField(textarea) 컴포넌트입니다. MUI TextField API를 참고하여 구현되었으며, styled-components와 CSS 변수를 사용합니다.

## 설치 / Import

```tsx
// named import
import { TextField } from "@/components/common/textfield";

// 타입만 사용할 때
import type { TextFieldProps, VariantType, SizeType } from "@/components/common/textfield";
```

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| **label** | `React.ReactNode` | - | 상단에 표시할 라벨 |
| **helperText** | `React.ReactNode` | - | 하단 도움말. `error`가 true일 때 에러 스타일 적용 |
| **error** | `boolean` | `false` | 에러 상태 (테두리·helperText 빨간색) |
| **variant** | `"primary" \| "secondary"` | `"primary"` | 배경 스타일. primary는 흰색+테두리, secondary는 회색+테두리 없음 |
| **size** | `"sm" \| "md" \| "lg"` | `"md"` | 크기 (min-height 80/100/120px) |
| **fullWidth** | `boolean` | `true` | 너비 100% 여부 |
| **minRows** | `number` | - | 최소 행 수 |
| **maxRows** | `number` | - | 최대 행 수 (참고용) |
| **rows** | `number` | - | 표시 행 수 (미지정 시 minRows 사용) |
| **inputProps** | `TextareaHTMLAttributes` | - | textarea에 넘길 추가 HTML 속성 |
| **readOnly** | `boolean` | `false` | 읽기 전용. true면 수정 불가, 선택/복사만 가능 |
| **ref** | `Ref<HTMLTextAreaElement>` | - | 내부 textarea에 전달되는 ref (forwardRef) |

그 외 `disabled`, `placeholder`, `value`, `onChange`, `className` 등 `HTMLTextAreaElement` 속성을 그대로 사용할 수 있습니다.

## 사용 예시

### 기본

```tsx
<TextField label="내용" placeholder="입력하세요" />
```

### Variant

```tsx
<TextField label="Primary" variant="primary" placeholder="입력" />
<TextField label="Secondary" variant="secondary" placeholder="입력" />
```

### Size

```tsx
<TextField label="Small" size="sm" placeholder="sm" />
<TextField label="Medium" size="md" placeholder="md (기본값)" />
<TextField label="Large" size="lg" placeholder="lg" />
```

### 도움말 / 에러

```tsx
// 도움말만
<TextField label="설명" helperText="100자 이내로 입력하세요" />

// 에러 상태
<TextField label="내용" error helperText="필수 입력입니다" />
```

### 행 수 (rows)

```tsx
<TextField label="코멘트" minRows={3} />
<TextField label="긴 글" rows={5} maxRows={10} />
```

### fullWidth

```tsx
<TextField label="전체 너비" fullWidth />
<TextField label="자동 너비" fullWidth={false} />
```

### 읽기 전용 (readOnly)

```tsx
<TextField label="내용" value="수정 불가 텍스트" readOnly />
```

### ref 사용 (포커스 등)

```tsx
const textareaRef = useRef<HTMLTextAreaElement>(null);

<TextField ref={textareaRef} label="내용" />

// 포커스
textareaRef.current?.focus();
```

## 접근성

- `useId`로 라벨(`htmlFor`)과 textarea(`id`) 자동 연결
- `helperText` 존재 시 `aria-describedby`로 연결
- `error` 시 `aria-invalid` 적용
- `readOnly` 시 `aria-readonly` 적용

## 파일 구조

```
textfield/
├── TextField.tsx  # 컴포넌트 및 스타일
├── index.ts        # export
└── README.md       # 이 문서
```
