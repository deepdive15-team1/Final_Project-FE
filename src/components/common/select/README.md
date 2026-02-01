# Select

MUI Select 구조를 참고한 드롭다운 선택 컴포넌트입니다.

## 구성

- **Select** – 메인 래퍼 (라벨, 루트 스타일, helperText, SelectInput 포함). 옵션은 `options` 배열로만 전달.
- **SelectInput** – 내부 로직 (표시 영역, 숨김 input, 아이콘, Menu, value/onChange, renderValue 등)
- **SelectOption** – 옵션 아이템 (Select가 options로부터 내부적으로 렌더링)
- **Menu** – 드롭다운 팝오버 (portal, backdrop, listbox, placement·높이 제한)

## 사용 예시

```tsx
import { Select } from "@/components/common/select";

// 단일 선택 (options 배열)
<Select
  label="나이"
  placeholder="선택하세요"
  value={age}
  onChange={(e) => setAge(e.target.value)}
  options={[
    { value: 10, label: "10대" },
    { value: 20, label: "20대" },
    { value: 30, label: "30대" },
  ]}
/>

// 메뉴 열리는 방향 지정 (화면 하단에서 잘릴 때)
<Select
  label="나이"
  value={age}
  onChange={(e) => setAge(e.target.value)}
  options={AGE_OPTIONS}
  MenuProps={{ placement: "top" }}
/>
```

## 메뉴 배치 (Menu placement)

메뉴는 기본값 `placement: "auto"`로, 아래 공간이 부족하면 위로 열립니다. 열린 메뉴 높이는 뷰포트에 맞춰 제한되며, 옵션이 많으면 메뉴 **내부**에서 스크롤됩니다.

| placement | 동작 |
|-----------|------|
| `"auto"` (기본) | 아래 공간 부족 시 위로 열림 |
| `"bottom"` | 항상 아래로 (높이 제한 + 내부 스크롤) |
| `"top"` | 항상 위로 |

## Props (Select)

| Prop | 타입 | 설명 |
|------|------|------|
| label | ReactNode | 라벨 |
| helperText | ReactNode | 하단 안내 문구 |
| error | boolean | 에러 스타일 |
| variant | 'primary' \| 'secondary' | 스타일 변형 |
| size | 'sm' \| 'md' \| 'lg' | 크기 |
| fullWidth | boolean | 전체 너비 |
| value | Value \| "" | 선택값 (제어) |
| defaultValue | Value | 기본값 (비제어) |
| onChange | (event, child?) => void | 변경 시 콜백 |
| options | { value, label, disabled? }[] | 옵션 배열 (필수) |
| placeholder | ReactNode | 선택 전 표시 문구 |
| displayEmpty | boolean | 빈 값도 표시 |
| renderValue | (value) => ReactNode | 선택값 커스텀 렌더 |
| MenuProps | object | Menu에 전달 (placement: 'auto' \| 'bottom' \| 'top' 등) |
| name, id, disabled, required | - | 폼 속성 |

## Props (SelectOption)

| Prop | 타입 | 설명 |
|------|------|------|
| value | string \| number | 옵션 값 |
| disabled | boolean | 비활성화 |
| selected | boolean | 선택 여부 (내부 설정) |
