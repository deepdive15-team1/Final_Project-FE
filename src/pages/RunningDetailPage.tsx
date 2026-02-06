import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

// 컴포넌트 & 데이터
import { getSessionDetail } from "../api/searchsession/searchSessionApi.index";
import Layout from "../components/Layout";
import { Button } from "../components/common/button/Button";
import Chip from "../components/common/chip";
import Header from "../components/common/header/Header";
import { KaKaoMap } from "../components/common/kakaomap/KaKaoMap";
import type { SessionDetail } from "../types/api/searchSession";
import { GENDER_LABEL } from "../types/api/searchSession";
import { secondsToPaceString } from "../utils/pace";

export default function RunningDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageHeader = <Header title="러닝 참여하기" />;

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  // 경로 데이터 준비 (없으면 빈 배열)
  const routePath = useMemo(() => session?.routeNodes || [], [session]);
  const hasRoute = routePath.length > 0;

  // 마커 생성 로직
  const mapMarkers = useMemo(() => {
    if (!hasRoute) return [];
    // 시작점과 끝점 정의
    const startNode = routePath[0];
    const endNode = routePath[routePath.length - 1];
    const markers = [
      {
        id: "start",
        lat: startNode.lat,
        lng: startNode.lng,
      },
    ];

    // 시작점과 끝점의 좌표가 다를 때만 '도착' 마커 추가 (겹침 방지)
    const isSamePoint =
      startNode.lat === endNode.lat && startNode.lng === endNode.lng;

    if (!isSamePoint) {
      mapMarkers.push({
        id: "end",
        lat: endNode.lat,
        lng: endNode.lng,
      });
    }
    return markers;
  }, [routePath, hasRoute]); //routePath가 바뀌면 다시 계산

  // 로딩 및 에러 처리 UI
  if (isLoading)
    return (
      <Layout header={pageHeader}>
        <div>로딩 중...</div>
      </Layout>
    );
  if (error || !session)
    return (
      <Layout header={pageHeader}>
        <div>{error || "존재하지 않는 세션입니다."}</div>
      </Layout>
    );

  const MAX_VISIBLE_PARTICIPANTS = 5;
  const totalCount = session.participants.length;

  // 5명까지만 자르기
  const visibleParticipants = session.participants.slice(
    0,
    MAX_VISIBLE_PARTICIPANTS,
  );

  // 남은 인원 계산 (음수 방지)
  const remainingCount = Math.max(0, totalCount - MAX_VISIBLE_PARTICIPANTS);

  return (
    <Layout
      scrollable={true}
      header={pageHeader}
      footer={
        <FooterContainer>
          <Button
            size="lg"
            variant="primary"
            fullWidth
            onClick={() => navigate("/")}
          >
            참여 신청하기
          </Button>
        </FooterContainer>
      }
    >
      <Container>
        {/* 지도 (경로 뷰어) */}
        <MapSection>
          {hasRoute ? (
            <KaKaoMap
              height="100%"
              showCurrentLocationMarker={false}
              isCreateMode={false}
              routePath={routePath}
              level={5}
              center={routePath[0]} // 시작점을 중심좌표로
              // 시작점에 마커 찍기
              markers={mapMarkers}
            />
          ) : (
            <NoMapPlaceholder>
              <span>러닝 루트가 등록되지 않았습니다.</span>
            </NoMapPlaceholder>
          )}
        </MapSection>

        {/* 상세 정보 영역 */}
        <InfoSection>
          <Title>{session.title}</Title>
          <SubText>{session.runType} 러닝</SubText>

          <InfoGrid>
            <InfoItem>
              <Label>일정</Label>
              <Value>
                {session.startAt.split("T")[0]}{" "}
                {session.startAt.split("T")[1].slice(0, 5)}
              </Value>
            </InfoItem>
            <InfoItem>
              <Label>모임 장소</Label>
              <Value>{session.locationName}</Value>
            </InfoItem>
            <InfoItem>
              <Label>평균 페이스</Label>
              <Value>{secondsToPaceString(session.avgPaceSec)} /km</Value>
            </InfoItem>
            <InfoItem>
              <Label>참여 성별</Label>
              <Value>{GENDER_LABEL[session.genderPolicy]}</Value>
            </InfoItem>
          </InfoGrid>

          <Divider />

          {/* 호스트 정보 */}
          <SectionTitle>호스트</SectionTitle>
          <HostCard>
            <ProfileCircle>{session.hostName[0]}</ProfileCircle>
            <HostInfo>
              <div className="name">{session.hostName}</div>
              <Chip
                label={`매너온도 ${session.hostMannerTemp}°C`}
                size="small"
                color="green"
                variant="filled"
              />
            </HostInfo>
          </HostCard>

          <Divider />

          {/* 참여자 목록 */}
          <SectionTitle>
            참여자 <span className="count">({totalCount}명)</span>
          </SectionTitle>
          <ParticipantList>
            {visibleParticipants.map((name, idx) => (
              <ParticipantBubble
                key={idx}
                color={idx % 2 === 0 ? "#A685FA" : "#FF85C0"}
              >
                {name[0]}
              </ParticipantBubble>
            ))}
            {/* 5명을 초과하는 경우에만 +N 표시 */}
            {remainingCount > 0 && (
              <ParticipantBubble className="more">
                +{remainingCount}
              </ParticipantBubble>
            )}
          </ParticipantList>
          {/* 하단 여백 확보 (버튼에 가려지지 않게) */}
          <div style={{ height: "20px" }} />
        </InfoSection>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  min-height: 100%;
`;

const MapSection = styled.div`
  width: 100%;
  height: 240px;
  background-color: var(--color-gray-100);
`;

const NoMapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-gray-100);

  span {
    font-size: 14px;
    color: var(--color-gray-400);
    font-weight: 500;
  }
`;

const InfoSection = styled.div`
  padding: 24px 20px;
  text-align: left;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--color-text);
`;

const SubText = styled.p`
  font-size: 14px;
  color: var(--color-gray-600);
  margin-bottom: 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-size: 12px;
  color: var(--color-gray-400);
`;

const Value = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-gray-200);
  margin: 24px 0;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--color-text);

  .count {
    font-size: 14px;
    font-weight: 400;
    color: var(--color-gray-600);
    margin-left: 4px;
  }
`;

const HostCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--color-main);
  color: var(--color-white);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
`;

const HostInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  .name {
    font-weight: 600;
    font-size: 15px;
    color: var(--color-text);
  }
`;

const ParticipantList = styled.div`
  display: flex;
  gap: -8px;
`;

const ParticipantBubble = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.color || "var(--color-gray-200)"};
  color: var(--color-white);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid var(--color-white);
  margin-right: -8px;

  &.more {
    background-color: var(--color-gray-100);
    color: var(--color-gray-600);
    font-size: 12px;
  }
`;

const FooterContainer = styled.div`
  padding: 12px 16px;
  background: var(--color-bg);
  border-top: 1px solid var(--color-gray-200);
`;
