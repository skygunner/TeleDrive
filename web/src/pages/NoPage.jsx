import { Row } from "antd";
import { useTranslation } from "react-i18next";

const NoPage = () => {
  const { t } = useTranslation();

  return (
    <Row align="middle" style={{ justifyContent: "center", marginTop: 50 }}>
      <h1>{t("404 Not Found")}</h1>
    </Row>
  );
};

export default NoPage;
