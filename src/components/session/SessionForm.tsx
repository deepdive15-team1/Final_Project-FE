import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { createSession } from "../../api/session/sessionApi.index";
import MarkerIcon from "../../assets/icon/marker.svg?react";
import type { GenderPolicy, RunType } from "../../types/models/session";
import { secondsToPaceString } from "../../utils/pace";
import { isEmpty } from "../../utils/validation";
import { Button } from "../common/button/Button";
import SingleSelectButtonSet from "../common/buttonSet/SingleSelectButtonSet";
import Stepper from "../common/buttonSet/Stepper";
import DateTimePicker from "../common/calendar/DateTimePicker";
import { Input } from "../common/input/Input";
import Slider from "../common/slider/Slider";

/** CreateSession에서 관리하는 위치·경로 데이터 (폼 제출 시 사용) */
export interface LocationFormData {
  locationName: string;
  locationX: number;
  locationY: number;
  routePolyline: { x: number; y: number }[];
  targetDistanceKm: number;
}

function validateSessionForm(
  fd: FormData,
  locationFormData?: LocationFormData | null,
): Record<string, string> {
  const next: Record<string, string> = {};
  const title = fd.get("title");
  const locationName =
    locationFormData?.locationName ?? String(fd.get("locationName") ?? "");

  if (isEmpty(title)) next.title = "세션 타이틀을 입력해주세요.";
  if (isEmpty(locationName)) next.locationName = "모임장소를 입력해주세요.";

  // locationFormData 사용 시: 경로·좌표 빈 데이터 방지, 최소 2점 이상
  if (locationFormData) {
    const { routePolyline, locationX, locationY } = locationFormData;
    if (routePolyline.length < 2) {
      next.form =
        "지도에서 경로를 2점 이상 찍어주세요.\n(출발지와 한 점 이상 필요)";
    } else if (
      locationX === 0 &&
      locationY === 0 &&
      routePolyline.every((p) => p.x === 0 && p.y === 0)
    ) {
      next.form = "유효한 경로를 지도에 찍어주세요.";
    }
  }

  // 일정: 현재 시간으로부터 20분 이후만 허용
  const startAtRaw = fd.get("startAt");
  if (startAtRaw && typeof startAtRaw === "string") {
    const startAtDate = new Date(startAtRaw);
    const minAllowed = Date.now() + 20 * 60 * 1000;
    if (startAtDate.getTime() < minAllowed) {
      const prev = next.form ?? "";
      next.form = prev
        ? `${prev}\n일정은 현재 시간으로부터 20분 이후로 선택해 주세요.`
        : "일정은 현재 시간으로부터 20분 이후로 선택해 주세요.";
    }
  }

  return next;
}

export interface SessionFormProps {
  /** 지도에서 선택한 위치·경로 (CreateSession 상태에서 내려옴) */
  locationFormData?: LocationFormData | null;
}

export default function SessionForm({
  locationFormData,
}: SessionFormProps = {}) {
  const navigate = useNavigate();

  const markerIcon = <MarkerIcon />;
  const [error, setError] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = validateSessionForm(fd, locationFormData);
    setError(next);
    if (Object.keys(next).length > 0) return;

    const requestBody = {
      title: String(fd.get("title") ?? ""),
      runType: (fd.get("runType") as RunType) ?? "LSD",
      locationName:
        locationFormData?.locationName ?? String(fd.get("locationName") ?? ""),
      locationX:
        locationFormData?.locationX ?? (Number(fd.get("locationX")) || 0),
      locationY:
        locationFormData?.locationY ?? (Number(fd.get("locationY")) || 0),
      routePolyline: locationFormData?.routePolyline ?? [],
      targetDistanceKm:
        locationFormData?.targetDistanceKm ??
        (Number(fd.get("targetDistanceKm")) || 0),
      avgPaceSec: Number(fd.get("avgPaceSec")) || 5 * 60,
      startAt: String(fd.get("startAt") ?? ""),
      capacity: Number(fd.get("capacity")) || 1,
      genderPolicy: (fd.get("genderPolicy") as GenderPolicy) ?? "MALE_ONLY",
    };

    try {
      await createSession(requestBody);
      navigate("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "세션 생성에 실패했습니다.";
      setError((prev) => ({ ...prev, form: message }));
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FormControlWrapper>
          {/* 러닝 세션 타이틀 폼 컨트롤 */}
          <Input
            label="러닝 세션명"
            name="title"
            variant="neutral"
            size="sm"
            className="title"
            disabled={false}
            defaultValue=""
            placeholder="세션 타이틀을 입력해주세요"
            errorMessage={error.title}
          />

          {/* 러닝 유형 폼 컨트롤 */}
          <SingleSelectButtonSet
            label="러닝 유형"
            name="runType"
            options={[
              { value: "LSD", label: "장거리 조깅" },
              { value: "INTERVAL", label: "인터벌" },
              { value: "RECOVERY", label: "리커버리 런" },
            ]}
            size="xs"
            className="runType"
            disabled={false}
            defaultValue="LSD"
          />

          {/* 모임장소 폼 컨트롤 - locationName (CreateSession 상태에서 내려옴) */}
          <Input
            label="모임장소"
            name="locationName"
            variant="neutral"
            size="sm"
            className="locationName"
            disabled={false}
            value={locationFormData?.locationName ?? ""}
            readOnly
            placeholder="모임장소를 선택해주세요"
            startIcon={markerIcon}
            errorMessage={error.locationName}
          />

          {/* 목표거리 폼 컨트롤 - targetDistanceKm (경로 길이 자동 계산) */}
          <Input
            label="목표거리"
            name="targetDistanceKm"
            variant="neutral"
            size="sm"
            className="targetDistanceKm"
            disabled={true}
            value={
              locationFormData
                ? `${locationFormData.targetDistanceKm.toFixed(2)} km`
                : ""
            }
            placeholder="목표거리는 자동으로 설정됩니다."
          />

          {/* 평균페이스 폼 컨트롤 - avgPaceSec */}
          <Slider
            label="평균페이스"
            valueLabelFormat={secondsToPaceString}
            unit="/km"
            name="avgPaceSec"
            className="avgPaceSec"
            disabled={false}
            min={2 * 60}
            max={15 * 60}
            step={30}
            defaultValue={5 * 60}
          />

          {/* 일정 폼 컨트롤 - startAt */}
          <DateTimePicker label="일정" name="startAt" />

          {/* 모집인원 폼 컨트롤 - capacity */}
          <Stepper
            label="모집인원"
            name="capacity"
            size="xs"
            className="capacity"
            disabled={false}
            min={2}
            max={10}
            defaultValue={1}
          />

          {/* 성별 폼 컨트롤 - genderPolicy */}
          <SingleSelectButtonSet
            label="참여 성별"
            name="genderPolicy"
            options={[
              { value: "MALE_ONLY", label: "남성" },
              { value: "FEMALE_ONLY", label: "여성" },
              { value: "MIXED", label: "혼성" },
            ]}
            size="xs"
            className="genderPolicy"
            disabled={false}
            defaultValue="MALE_ONLY"
          />
        </FormControlWrapper>

        <SubmitBtnWrapper>
          <Button type="submit" variant="primary" size="md" fullWidth>
            세션 등록하기
          </Button>
        </SubmitBtnWrapper>
      </Form>

      {error.form && (
        <ErrorModalOverlay
          onClick={() => {
            setError((prev) => {
              const next = { ...prev };
              delete next.form;
              return next;
            });
          }}
        >
          <ErrorModalBox onClick={(e) => e.stopPropagation()}>
            <ErrorModalMessage>{error.form}</ErrorModalMessage>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                setError((prev) => {
                  const next = { ...prev };
                  delete next.form;
                  return next;
                });
              }}
            >
              확인
            </Button>
          </ErrorModalBox>
        </ErrorModalOverlay>
      )}
    </>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 400px;
  box-sizing: border-box;
  background-color: var(--color-bg);
  overflow: hidden;
`;

const FormControlWrapper = styled.div`
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  gap: 30px;
  padding: 0 20px;
  box-shadow: 0 4px 2px 0 rgba(0, 0, 0, 0.02);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE, Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const SubmitBtnWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 10px 0 10px;
  box-sizing: border-box;
`;

const ErrorModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ErrorModalBox = styled.div`
  max-width: 320px;
  width: calc(100% - 32px);
  padding: 24px;
  background-color: var(--color-bg);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ErrorModalMessage = styled.p`
  margin: 0;
  font-size: 15px;
  color: var(--color-text);
  text-align: center;
  line-height: 1.5;
  white-space: pre-line;
`;
