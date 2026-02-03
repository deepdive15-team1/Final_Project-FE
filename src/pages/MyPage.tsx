import Layout from "../components/Layout";
import Footer from "../components/common/footer/Footer";
import Header from "../components/common/header/Header";

export default function MyPage() {
  const pageHeader = <Header title="마이 페이지" />;
  const pageFooter = <Footer />;

  return (
    <Layout header={pageHeader} footer={pageFooter}>
      <p>MyPage</p>
    </Layout>
  );
}
