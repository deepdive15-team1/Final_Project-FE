import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import CreateIcon from "../assets/icon/create.svg?react";
import PlusIcon from "../assets/icon/plus.svg?react";
import Layout from "../components/Layout";
import { Button } from "../components/common/button/Button";
import Footer from "../components/common/footer/Footer";
import HomeHeader from "../components/common/header/HomeHeader";
import NearbyList from "../components/nearbyList/NearbyList";

export default function Home() {
  const navigate = useNavigate();
  const pageHeader = <HomeHeader />;
  const pageFooter = <Footer />;

  return (
    <Layout header={pageHeader} footer={pageFooter}>
      <Wrapper>
        <CreateBtnWrapper>
          <Button
            type="button"
            onClick={() => navigate("/create-session")}
            startIcon={<CreateIcon />}
            endIcon={<PlusIcon />}
            fullWidth
          >
            러닝 세션 개설하기
          </Button>
        </CreateBtnWrapper>

        <NearbyList />
      </Wrapper>
    </Layout>
  );
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding-top: 20px;
  background-color: var(--color-gray-100);
`;

const CreateBtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 330px;
  width: 90%;
  height: 80px;
  background-color: var(--color-main);
  border-radius: 10px;

  svg {
    width: 40px;
    height: 40px;
  }
`;
