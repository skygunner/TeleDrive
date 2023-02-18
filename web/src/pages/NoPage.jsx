import { Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import React from 'react';

function NoPage() {
  const { t } = useTranslation();

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <div
          style={{
            marginTop: 50,
            textAlign: 'center',
          }}
        >
          <h1>{t('404 Not Found')}</h1>
        </div>
      </Col>
    </Row>
  );
}

export default NoPage;
