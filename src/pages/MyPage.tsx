import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import * as MyPageApi from "../api/mypage/myPage.index";
import Layout from "../components/Layout";
import Footer from "../components/common/footer/Footer";
import Header from "../components/common/header/Header";
import AppliedRunItem from "../components/mypage/AppliedRunItem";
import CreatedRunItem from "../components/mypage/CreatedRunItem";
import HistoryRunItem from "../components/mypage/HistoryRunItem";
import UserProfile from "../components/mypage/UserProfile";
import UserStats from "../components/mypage/UserStats";
import {
  Container,
  ListWrapper,
  SectionTitle,
} from "../components/mypage/styles";
import { useAuthStore } from "../stores/authStore";
import type {
  UserInfoResponse,
  CreatedRunning,
  AppliedRunning,
  RecentRunning,
} from "../types/api/myPage";

export default function MyPage() {
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [myRunnings, setMyRunnings] = useState<CreatedRunning[]>([]);
  const [appliedRunnings, setAppliedRunnings] = useState<AppliedRunning[]>([]);
  const [recentRunnings, setRecentRunnings] = useState<RecentRunning[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  // 유저가 있으면 true 없으면 false
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true }); // 마이페이지가 기록에 남지 않게 하여 뒤로 가기 오류 방지
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, myRes, appliedRes, recentRes] = await Promise.all([
          MyPageApi.getUserInfo(),
          MyPageApi.getCreatedRuns(3),
          MyPageApi.getAppliedRuns(),
          MyPageApi.getRecentRuns(),
        ]);

        setUserInfo(userRes);
        setMyRunnings(myRes);
        setAppliedRunnings(appliedRes.appliedRunnings);
        setRecentRunnings(recentRes.recentRunnings);
      } catch (error) {
        console.error("마이페이지 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  // 관리 버튼 클릭 핸들러
  const handleManageClick = (sessionId: number, status: string) => {
    if (
      status === "FINISHED" ||
      status === "DONE" ||
      status === "IN_PROGRESS"
    ) {
      navigate(`/manage/${sessionId}/attendance`);
    } else {
      // 아직 시작 전(OPEN, CLOSED)이라면 -> 신청자 관리 페이지(ManagePage)로 이동
      navigate(`/manage/${sessionId}`);
    }
  };

  const handleEvaluateClick = (sessionId: number) => {
    // 호스트 평가 페이지로 이동
    navigate(`/manage/${sessionId}/hostevaluation`);
  };

  const pageHeader = <Header title="마이페이지" />;
  const pageFooter = <Footer />;

  if (loading) {
    return (
      <Layout header={pageHeader} footer={pageFooter}>
        <Container>
          <div style={{ padding: 20 }}>로딩 중...</div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout header={pageHeader} footer={pageFooter}>
      <Container>
        {/* 상단 프로필 및 통계 */}
        <SectionCard>
          {userInfo && <UserProfile data={userInfo} />}
          {userInfo && <UserStats data={userInfo} />}
        </SectionCard>

        {/* 내가 만든 러닝 */}
        {myRunnings.length > 0 && (
          <>
            <SectionTitle>내가 만든 러닝</SectionTitle>
            <ListWrapper>
              {myRunnings.map((run) => (
                <CreatedRunItem
                  key={run.id}
                  title={run.title}
                  currentParticipants={run.currentParticipants}
                  capacity={run.capacity}
                  status={run.status}
                  onClickManage={() => handleManageClick(run.id, run.status)}
                />
              ))}
            </ListWrapper>
          </>
        )}

        {/* 신청한 러닝 */}
        {appliedRunnings.length > 0 && (
          <>
            <SectionTitle>신청한 러닝</SectionTitle>
            <ListWrapper>
              {appliedRunnings.map((run) => (
                <AppliedRunItem
                  key={run.runningId}
                  title={run.title}
                  date={run.date}
                  time={run.time}
                  approveStatus={run.approveStatus}
                />
              ))}
            </ListWrapper>
          </>
        )}

        {/* 최근 참여 내역 */}
        {recentRunnings.length > 0 && (
          <>
            <SectionTitle>최근 참여 내역</SectionTitle>
            <ListWrapper>
              {recentRunnings.map((run) => (
                <HistoryRunItem
                  key={run.runningId}
                  date={run.date}
                  title={run.title}
                  isCompleted={run.resultStatus === "DONE"}
                  onClick={() => handleEvaluateClick(run.runningId)}
                />
              ))}
            </ListWrapper>
          </>
        )}

        <div style={{ height: 20 }} />
      </Container>
    </Layout>
  );
}

const SectionCard = styled.div`
  background-color: var(--color-white);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;
