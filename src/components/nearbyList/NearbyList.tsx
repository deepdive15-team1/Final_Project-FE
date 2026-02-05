import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import RightIcon from "../../assets/icon/right.svg?react";
import { Button } from "../common/button/Button";

export default function NearbyList() {
  const navigate = useNavigate();

  return (
    <SearchListWrapper>
      <ListHeader>
        <h2>내 주변 추천 러닝</h2>
        <Button
          variant="text"
          size="xs"
          endIcon={<RightIcon />}
          onClick={() => navigate("/search")}
        >
          전체보기
        </Button>
      </ListHeader>
    </SearchListWrapper>
  );
}

const SearchListWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  max-width: 330px;
  width: 95%;
`;

const ListHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-left: 20px;

  h2 {
    font-size: 15px;
    font-weight: 700;
    color: var(--color-text);
  }
`;
