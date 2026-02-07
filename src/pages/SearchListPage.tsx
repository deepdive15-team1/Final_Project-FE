import { useState, useEffect, type KeyboardEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { searchSessions } from "../api/searchsession/searchSessionApi.mock";
import back from "../assets/icon/back.svg";
import searchIcon from "../assets/icon/search.svg";
import Layout from "../components/Layout";
import { Button } from "../components/common/button/Button";
import { Input } from "../components/common/input/Input";
import SessionResultItem from "../components/search/SessionResultItem";
import type { SessionSummary } from "../types/api/searchSession";

export default function SearchListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 초기 검색어 가져오기
  const initialQuery = searchParams.get("q") || "";

  const [keyword, setKeyword] = useState(initialQuery);
  const [results, setResults] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!initialQuery.trim()) return;

    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const response = await searchSessions(initialQuery, undefined, 10);
        setResults(response.content);
        setTotalCount(response.numberOfElements);
      } catch (error) {
        console.error("검색 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [initialQuery]);

  const updateUrl = (keyword: string) => {
    if (!keyword.trim()) return;
    // URL을 바꾸면 useEffect가 감지하고 API 호출
    setSearchParams({ q: keyword });
  };

  // 엔터키 입력 핸들러
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateUrl(keyword);
    }
  };

  const handleBackButton = () => {
    navigate(-1);
  };

  const searchHeader = (
    <HeaderContainer>
      <Button
        iconOnly
        startIcon={<img src={back} alt="뒤로가기" />}
        variant="text"
        style={{ width: "24px", height: "24px" }}
        onClick={handleBackButton}
      />
      <SearchInputWrapper>
        <Input
          variant="neutral"
          placeholder="지역, 크루 등 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          startIcon={<img src={searchIcon} alt="검색" />}
        />
      </SearchInputWrapper>
    </HeaderContainer>
  );

  return (
    <Layout header={searchHeader}>
      <PageContent>
        {/* 검색 결과 개수 표시 */}
        <ResultHeader>
          검색 결과 <span className="highlight">{totalCount}건</span>
        </ResultHeader>

        {/* 결과 리스트 */}
        <ResultList>
          {isLoading ? (
            <StatusMessage>검색 중...</StatusMessage>
          ) : results.length > 0 ? (
            results.map((session) => (
              <SessionResultItem
                key={session.id}
                data={session}
                onClickDetail={(id) => navigate(`/search/${id}`)}
              />
            ))
          ) : (
            // 검색어가 있는데 결과가 없을 때
            initialQuery && <StatusMessage>검색 결과가 없습니다.</StatusMessage>
          )}
        </ResultList>
      </PageContent>
    </Layout>
  );
}

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background-color: white;
  border-bottom: 1px solid var(--color-gray-100);
`;

const SearchInputWrapper = styled.div`
  flex: 1;
`;

const PageContent = styled.div`
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const ResultHeader = styled.h2`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: var(--color-text);
  text-align: left;

  .highlight {
    color: var(--color-primary);
    margin-left: 4px;
  }
`;

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatusMessage = styled.div`
  padding: 40px 0;
  text-align: center;
  color: var(--color-gray-500);
  font-size: 14px;
`;
