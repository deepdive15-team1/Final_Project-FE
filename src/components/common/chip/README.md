# Chip

작은 블록으로 정보나 태그를 표시하는 컴포넌트입니다. MUI Chip을 참고하여 구현되었으며, styled-components와 CSS 변수를 사용합니다.

## 설치 / Import

```tsx
// 기본 (default import)
import Chip from "@/components/common/chip";

// 타입만 사용할 때
import type { ChipProps, ChipVariant, ChipSize, ChipColor } from "@/components/common/chip";
```

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| **label** | `React.ReactNode` | (필수) | 칩에 표시할 텍스트 또는 노드 |
| **variant** | `"filled" \| "outlined"` | `"filled"` | 스타일 변형. filled는 배경만, outlined는 테두리만 |
| **size** | `"small" \| "medium"` | `"medium"` | 크기 |
| **color** | `ChipColor` | `"default"` | 색상 (아래 색상 목록 참고) |
| **clickable** | `boolean` | `onClick` 유무에 따름 | 클릭 가능한 것처럼 보이게 할지 여부 |
| **disabled** | `boolean` | `false` | 비활성화 여부 |
| **icon** | `React.ReactElement` | - | 왼쪽에 표시할 아이콘 |
| **onDelete** | `(event) => void` | - | 삭제 버튼 클릭/Backspace·Delete 키 시 호출. 설정 시 삭제 아이콘 표시 |
| **deleteIcon** | `React.ReactElement` | 기본 X 아이콘 | 삭제 아이콘 커스텀 |
| **onClick** | `(event) => void` | - | 칩 클릭 시 호출 |
| **ref** | `Ref<HTMLDivElement>` | - | 루트 div에 전달되는 ref (forwardRef) |

그 외 `className`, `style`, `data-*`, `aria-*` 등 `HTMLDivElement` 속성을 그대로 사용할 수 있습니다.

### ChipColor

`"default"` | `"primary"` | `"secondary"` | `"error"` | `"info"` | `"success"` | `"warning"` | `"green"` | `"yellow"` | `"red"`

색상은 `src/styles/variables.css`의 CSS 변수와 연동됩니다.

## 사용 예시

### 기본

```tsx
<Chip label="기본 칩" />
```

### Variant

```tsx
<Chip label="Filled" variant="filled" color="primary" />
<Chip label="Outlined" variant="outlined" color="primary" />
```

### Size

```tsx
<Chip label="Small" size="small" />
<Chip label="Medium" size="medium" />
```

### Color

```tsx
<Chip label="Primary" color="primary" />
<Chip label="Green" color="green" />
<Chip label="Red" color="red" />
```

### 클릭 가능

```tsx
<Chip label="클릭 가능" onClick={() => console.log("클릭됨")} />
```

### 삭제 가능

```tsx
<Chip
  label="삭제 가능"
  onDelete={(e) => console.log("삭제", e)}
  color="error"
/>
```

### 아이콘 + 삭제

```tsx
<Chip
  label="태그"
  icon={<span>🏷️</span>}
  onDelete={() => {}}
  color="primary"
/>
```

### ref 사용 (포커스 등)

```tsx
const chipRef = useRef<HTMLDivElement>(null);

<Chip ref={chipRef} label="포커스 가능" onClick={() => {}} />

// 포커스
chipRef.current?.focus();
```

## 키보드

- **Backspace / Delete**: `onDelete`가 있을 때 삭제 콜백 호출
- 클릭 가능 또는 삭제 가능한 칩은 `role="button"`, `tabIndex={0}`으로 포커스 가능

## 접근성

- 삭제 아이콘에 `aria-label="삭제"` 적용
- 클릭/삭제 가능 시 `role="button"` 사용
- `disabled` 시 `tabIndex={-1}`, `pointer-events: none`, `opacity` 감소

## 파일 구조

```
chip/
├── Chip.tsx   # 컴포넌트 및 스타일
├── index.ts   # export
└── README.md  # 이 문서
```
