import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import * as ManageApi from "../api/manage/manage.index";
import Layout from "../components/Layout";
import { Button } from "../components/common/button/Button";
import Header from "../components/common/header/Header";
import CandidateCard from "../components/manage/CandidateCard";
import ConfirmedMemberRow from "../components/manage/ConfirmedMemberRow";
import type { Participant } from "../types/api/manage";
import type { CreatedRunning } from "../types/api/myPage";

export default function ManagePage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const currentSessionId = Number(sessionId) || 1;

  const [sessionInfo, setSessionInfo] = useState<CreatedRunning | null>(null);
  const [requests, setRequests] = useState<Participant[]>([]);
  const [members, setMembers] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [infoRes, reqRes, memRes] = await Promise.all([
          ManageApi.getSessionInfo(currentSessionId),
          ManageApi.getRequestedList(currentSessionId),
          ManageApi.getApprovedList(currentSessionId),
        ]);

        setSessionInfo(infoRes);
        setRequests(reqRes);
        setMembers(memRes);

        // 이미 종료된 러닝이면 바로 투표 페이지로 이동
        if (infoRes.status === "FINISHED") {
          navigate(`/manage/${currentSessionId}/attendance`, { replace: true });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentSessionId, navigate]);

  // 날짜 포맷팅
  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return `${date.getMonth() + 1}.${date.getDate()}`;
  };

  const handleStartAttendance = () => {
    navigate(`/manage/${currentSessionId}/attendance`);
  };

  // 수락 핸들러
  const handleApprove = async (participationId: number) => {
    try {
      await ManageApi.approveUser(currentSessionId, participationId);

      const target = requests.find((r) => r.id === participationId);

      if (target) {
        setRequests((prev) => prev.filter((r) => r.id !== participationId));

        setMembers((prev) => [...prev, { ...target, status: "APPROVED" }]);
      }
    } catch (e) {
      alert("승인 처리 중 오류가 발생했습니다.");

      console.error(e);
    }
  };

  // 거절 핸들러
  const handleReject = async (participationId: number) => {
    if (!confirm("정말 거절하시겠습니까?")) return;

    try {
      await ManageApi.rejectUser(currentSessionId, participationId);

      setRequests((prev) => prev.filter((r) => r.id !== participationId));
    } catch (e) {
      alert("거절 처리 중 오류가 발생했습니다.");

      console.error(e);
    }
  };

  if (loading)
    return (
      <Layout header={<Header title="참여자 관리" />}>
        <Container>로딩 중...</Container>
      </Layout>
    );

  return (
    <Layout
      header={<Header title="참여자 관리" />}
      footer={
        <BottomButtonGroup>
          <Button
            variant="neutral"
            size="lg"
            style={{ flex: 1, backgroundColor: "#F3F4F6" }}
          >
            모집 마감
          </Button>
          <Button
            variant="primary"
            size="lg"
            style={{ flex: 1.5 }}
            onClick={handleStartAttendance}
          >
            출석 체크 시작
          </Button>
        </BottomButtonGroup>
      }
    >
      <Container>
        <SessionInfo>
          <span className="date">{formatDate(sessionInfo?.startAt)}</span>
          <span className="divider">|</span>
          <span className="title">{sessionInfo?.title}</span>
        </SessionInfo>

        <SectionTitle>신청 대기 ({requests.length}명)</SectionTitle>
        <ListGap>
          {requests.map((req) => (
            <CandidateCard
              key={req.id}
              data={req}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </ListGap>

        <div style={{ height: 24 }} />

        <SectionTitle>확정 멤버 ({members.length}명)</SectionTitle>
        <MemberCard>
          {members.map((mem) => (
            <ConfirmedMemberRow key={mem.id} data={mem} />
          ))}
        </MemberCard>
        <div style={{ height: 20 }} />
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: var(--color-gray-100);
  min-height: 100%;
`;

const SessionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-gray-600);
  font-size: 14px;
  margin-bottom: 20px;
  .divider {
    color: #ddd;
  }
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 12px;
  padding-left: 4px;
`;

const ListGap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 확정 멤버 리스트는 하나의 흰색 카드 안에 리스트 형태
const MemberCard = styled.div`
  background-color: var(--color-white);
  border-radius: 16px;
  padding: 8px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const BottomButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--color-white);
  border-top: 1px solid var(--color-gray-200);
`;
