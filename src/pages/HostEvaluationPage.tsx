import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";

import * as EvaluationApi from "../api/manage/manage.index";
import BadIcon from "../assets/icon/bad.svg?react";
import GoodIcon from "../assets/icon/good.svg?react";
import Layout from "../components/Layout";
import { Button } from "../components/common/button/Button";
import Header from "../components/common/header/Header";
import { FEEDBACK_KEYWORDS } from "../types/api/manage";
import type { HostInfo } from "../types/api/manage";

export default function HostEvaluationPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const currentSessionId = Number(sessionId) || 0;

  const [hostInfo, setHostInfo] = useState<HostInfo | null>(null);
  const [rating, setRating] = useState<"GOOD" | "BAD" | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 호스트 정보 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await EvaluationApi.getHostInfo(currentSessionId);
        setHostInfo(data);
      } catch (e) {
        console.error(e);
        alert("호스트 정보를 불러오지 못했습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentSessionId, navigate]);

  // 태그 토글 핸들러
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 제출 핸들러
  const handleSubmit = async () => {
    if (!rating) return;

    try {
      await EvaluationApi.submitHostEvaluation({
        sessionId: currentSessionId,
        score: rating,
        feedbackKeywords: selectedTags,
      });
      alert("평가가 완료되었습니다.");
      navigate("/my-page"); // 평가 후 마이페이지로 이동
    } catch (e) {
      console.error(e);
      alert("평가 제출 중 오류가 발생했습니다.");
    }
  };

  if (loading || !hostInfo) return <div>로딩 중...</div>;

  return (
    <Layout
      // X 버튼을 누르면 뒤로가기 혹은 마이페이지로 이동
      header={<Header title="호스트 평가" />}
      footer={
        <FooterWrapper>
          <Button
            fullWidth
            size="lg"
            disabled={!rating} // 평가를 선택해야 버튼 활성화
            onClick={handleSubmit}
          >
            평가 완료
          </Button>
        </FooterWrapper>
      }
    >
      <Container>
        {/* 프로필 섹션 */}
        <ProfileSection>
          <div className="img-wrapper">
            <div className="badge">HOST</div>
          </div>
          <h2 className="name">{hostInfo.name}</h2>
          <p className="question">{hostInfo.name}님의 진행이 만족스러웠나요?</p>
        </ProfileSection>

        {/* 좋아요/별로예요 선택 */}
        <RatingSection>
          <RatingButton
            $active={rating === "BAD"}
            onClick={() => setRating("BAD")}
          >
            <div className="circle">
              <BadIcon />
            </div>
            <span>별로예요</span>
          </RatingButton>

          <RatingButton
            $active={rating === "GOOD"}
            onClick={() => setRating("GOOD")}
          >
            <div className="circle">
              <GoodIcon />
            </div>
            <span>최고예요</span>
          </RatingButton>
        </RatingSection>

        {/* 추가 피드백 */}
        <FeedbackSection>
          <p className="sub-title">추가 피드백 (선택)</p>
          <TagsWrapper>
            {FEEDBACK_KEYWORDS.map((keyword) => (
              <TagChip
                key={keyword}
                $selected={selectedTags.includes(keyword)}
                onClick={() => handleTagToggle(keyword)}
              >
                {keyword}
              </TagChip>
            ))}
          </TagsWrapper>
        </FeedbackSection>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: var(--color-white);
  min-height: 100%;
  align-items: center;
`;

const FooterWrapper = styled.div`
  padding: 16px;
  background: white;
  border-top: 1px solid #eee;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 40px;

  .img-wrapper {
    position: relative;
    margin-bottom: 16px;

    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #eee;
    }

    .badge {
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #1d4ed8;
      color: white;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  .name {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 30px;
    color: var(--color-black);
  }

  .question {
    font-size: 16px;
    color: var(--color-gray-600);
  }
`;

const RatingSection = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 50px;
`;

const RatingButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  &:focus {
    outline: none;
  }

  .circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;

    background-color: ${(props) => (props.$active ? "#eff6ff" : "#f3f4f6")};

    display: flex;
    justify-content: center;
    align-items: center;

    border: none;

    transition: all 0.2s;

    svg {
      width: 32px;
      height: 32px;

      stroke: currentColor;

      color: ${(props) => (props.$active ? "#2563eb" : "#9ca3af")};

      transition: color 0.2s;
    }
  }

  span {
    font-size: 14px;
    font-weight: ${(props) => (props.$active ? "700" : "500")};
    color: ${(props) => (props.$active ? "#2563eb" : "#6b7280")};
  }
`;

const FeedbackSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const TagChip = styled.button<{ $selected: boolean }>`
  padding: 10px 18px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.$selected
      ? css`
          background-color: var(--color-white);
          border: 1px solid #2563eb;
          color: #2563eb;
          font-weight: 700;
        `
      : css`
          background-color: var(--color-white);
          border: 1px solid #e5e7eb;
          color: #6b7280;
        `}
`;
