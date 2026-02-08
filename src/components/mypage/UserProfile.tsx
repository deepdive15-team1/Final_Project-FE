import styled from "styled-components";

import type { UserInfoResponse } from "../../types/api/myPage";

// Props 타입 정의
interface UserProfileProps {
  data: UserInfoResponse;
}

export default function UserProfile({ data }: UserProfileProps) {
  // Enum -> 한글 변환
  const formatGender = (g: string) => (g === "MALE" ? "남성" : "여성");
  const formatAge = (a: string) => a.replace("S", "대"); // "20S" -> "20대"

  return (
    <Wrapper>
      <ProfileInfo>
        <Avatar>{data.name.slice(-1)}</Avatar>
        <TextInfo>
          <Name>{data.name}</Name>
          <Meta>
            {formatAge(data.ageGroup)} · {formatGender(data.gender)}
          </Meta>
        </TextInfo>
      </ProfileInfo>

      <MannerTemp>
        매너온도 <span className="temp-val">{data.mannerTemp}°C</span>
      </MannerTemp>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-main);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
`;

const TextInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
`;

const Meta = styled.div`
  font-size: 14px;
  color: var(--color-gray-600);
`;

const MannerTemp = styled.div`
  background-color: var(--color-red-light);
  color: var(--color-red);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;

  .temp-val {
    font-weight: 700;
  }
`;
