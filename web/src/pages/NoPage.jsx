import { Row, Col, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import React from 'react';

function NoPage() {
  const { t } = useTranslation();

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <Result
          status="404"
          title="404 Not Found"
          subTitle={t('Sorry, the page you visited does not exist.')}
        />
      </Col>
    </Row>
  );
}

export default NoPage;
