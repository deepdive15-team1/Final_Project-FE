import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
  getSessionDetail,
  joinSession,
} from "../api/searchsession/searchSessionApi.index";
import Layout from "../components/Layout";
import Header from "../components/common/header/Header";
import HostSection from "../components/runningdetail/HostSection";
import InfoSection from "../components/runningdetail/InfoSection";
import JoinFooter from "../components/runningdetail/JoinFooter";
import MapSection from "../components/runningdetail/MapSection";
import ParticipantSection from "../components/runningdetail/ParticipantSection";
import type { SessionDetail } from "../types/api/searchSession";

export default function RunningDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageHeader = <Header title="러닝 참여하기" />;

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false); // 참여 로딩 상태
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) {
        setError("잘못된 접근입니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getSessionDetail(Number(id));
        setSession(data);
      } catch (err) {
        console.error(err);
        setError("세션 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  // 참여 신청 핸들러
  const handleJoinSession = async (message: string) => {
    if (!session) return;

    if (!message.trim()) {
      alert("메시지를 입력해주세요");
      return;
    }

    if (window.confirm(`${session.title}에 참여하시겠습니까?`)) {
      try {
        setIsJoining(true); // 로딩 시작

        // API 호출
        await joinSession(session.id, message);

        alert("참여 신청이 완료되었습니다!");
        navigate("/"); // 홈으로 이동
      } catch (err) {
        console.error("참여 신청 실패:", err);
        alert("참여 신청 중 오류가 발생했습니다.");
      } finally {
        setIsJoining(false); // 로딩 종료
      }
    }
  };

  // 로딩 및 에러 처리 UI
  if (isLoading)
    return (
      <Layout header={pageHeader}>
        <CenterText>로딩 중...</CenterText>
      </Layout>
    );
  if (error || !session)
    return (
      <Layout header={pageHeader}>
        <CenterText>{error || "존재하지 않는 세션입니다."}</CenterText>
      </Layout>
    );

  return (
    <Layout
      scrollable={true}
      header={pageHeader}
      footer={<JoinFooter onJoin={handleJoinSession} isJoining={isJoining} />}
    >
      <ContentContainer>
        {/* 지도 영역 */}
        <MapSection session={session} />

        {/* 기본 정보 영역 */}
        <InfoSection session={session} />

        <Divider />

        {/* 호스트 정보 영역 */}
        <HostSection session={session} />

        <Divider />

        {/* 참여자 목록 영역 */}
        <ParticipantSection session={session} />

        {/* 하단 여백 */}
        <div style={{ height: "20px" }} />
      </ContentContainer>
    </Layout>
  );
}

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  min-height: 100%;
  padding-bottom: 20px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-gray-200);
  margin: 24px 20px;
`;

const CenterText = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-gray-500);
`;
