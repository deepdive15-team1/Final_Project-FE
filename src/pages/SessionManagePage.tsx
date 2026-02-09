import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

import * as ManageApi from "../api/manage/manage.index";
import * as MyPageApi from "../api/mypage/myPage.index";
import Layout from "../components/Layout";
import { Button } from "../components/common/button/Button";
import Header from "../components/common/header/Header";
import AttendanceRow from "../components/manage/AttendanceRow";
import EvaluationCard from "../components/manage/EvaluationCard";
import type { AttendanceMember, EvaluationMember } from "../types/api/manage";
import type { CreatedRunning } from "../types/api/myPage";

type RunStep = "ATTENDANCE" | "EVALUATION";

export default function SessionManagePage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const currentSessionId = Number(sessionId) || 1;

  // 초기값을 ATTENDANCE로 설정하여 중복 로딩 방지
  const [step, setStep] = useState<RunStep>("ATTENDANCE");
  const [sessionInfo, setSessionInfo] = useState<CreatedRunning | null>(null);

  const [attendanceList, setAttendanceList] = useState<AttendanceMember[]>([]);
  const [evalList, setEvalList] = useState<EvaluationMember[]>([]);
  const [loading, setLoading] = useState(true);

  // 데이터 로드
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const myRuns = await MyPageApi.getCreatedRuns();

        const targetSession = myRuns.find((run) => run.id === currentSessionId);

        if (!targetSession) {
          alert("해당 세션 정보를 찾을 수 없습니다.");
          navigate(-1);
          return;
        }

        setSessionInfo(targetSession);

        // 이미 완료된 러닝이면 바로 평가 화면으로
        if (targetSession.status === "FINISHED") {
          setStep("EVALUATION");
          const evals = await ManageApi.getEvaluationList(currentSessionId);
          setEvalList(evals);
        } else if (targetSession.status === "CANCELED") {
          alert("취소된 세션입니다.");
          navigate(-1);
        } else {
          // OPEN, CLOSED 등
          setStep("ATTENDANCE");
          const list = await ManageApi.getAttendanceList(currentSessionId);
          setAttendanceList(list);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [currentSessionId, navigate]);

  const handleAttendanceUpdate = async (
    id: number,
    status: "ATTENDED" | "ABSENT",
  ) => {
    setAttendanceList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, attendanceStatus: status } : m)),
    );
    await ManageApi.updateAttendance(currentSessionId, id, status);
  };

  const handleFinishAttendance = async () => {
    if (!confirm("출석을 완료 하고 러닝 시작 하시겠습니까?")) return;
    try {
      await ManageApi.startRunningSession(currentSessionId);
      const evals = await ManageApi.getEvaluationList(currentSessionId);
      setEvalList(evals);
      setStep("EVALUATION");
    } catch (e) {
      alert("오류 발생");
      console.error(e);
    }
  };

  const handleSubmitEvaluation = () => {
    alert("제출 완료");
    navigate("/");
  };

  if (loading)
    return (
      <Layout header={<Header title="로딩 중" />}>
        <Container>로딩 중...</Container>
      </Layout>
    );

  return (
    <Layout
      header={
        <Header title={step === "ATTENDANCE" ? "출석 체크" : "멤버 평가"} />
      }
      footer={
        <FooterWrapper>
          {step === "ATTENDANCE" ? (
            <Button fullWidth size="lg" onClick={handleFinishAttendance}>
              출석 완료 및 러닝 시작
            </Button>
          ) : (
            <Button
              fullWidth
              size="lg"
              variant="neutral"
              onClick={handleSubmitEvaluation}
            >
              평가 제출하기
            </Button>
          )}
        </FooterWrapper>
      }
    >
      <Container>
        {/* 평가 화면 아닐 때만 세션 정보 */}
        {step !== "EVALUATION" && (
          <SessionInfo>
            <span className="title">{sessionInfo?.title}</span>
          </SessionInfo>
        )}

        {step === "ATTENDANCE" && (
          <>
            <SectionTitle>
              참여 예정 멤버 ({attendanceList.length}명)
            </SectionTitle>
            <MemberCard>
              {attendanceList.map((m) => (
                <AttendanceRow
                  key={m.id}
                  member={m}
                  onUpdate={handleAttendanceUpdate}
                />
              ))}
            </MemberCard>
            <InfoBox>💡 출석 완료 버튼을 눌러주세요.</InfoBox>
          </>
        )}

        {step === "EVALUATION" && (
          <>
            <EvalTitle>
              <h3>오늘 러닝은 어떠셨나요?</h3>
            </EvalTitle>
            <ListGap>
              {evalList.map((m) => (
                <EvaluationCard key={m.userId} member={m} />
              ))}
            </ListGap>
          </>
        )}
        <div style={{ height: 20 }} />
      </Container>
    </Layout>
  );
}

const FooterWrapper = styled.div`
  padding: 16px;
  background: white;
  border-top: 1px solid #eee;
`;

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
  margin-bottom: 12px;
  padding-left: 4px;
`;

const ListGap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--color-text);
`;

const MemberCard = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 8px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

const InfoBox = styled.div`
  margin-top: 20px;
  background-color: #eff6ff;
  color: #1e40af;
  padding: 16px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
`;

const EvalTitle = styled.div`
  text-align: center;
  margin: 20px 0 30px;

  h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--color-text);
  }
  p {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }
`;
