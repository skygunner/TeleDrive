import React from 'react';
import { Row, Col, Result } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

function OfflinePage() {
  const { t } = useTranslation();

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <Result
          icon={<FrownOutlined />}
          title={t('Offline')}
          subTitle={t('You are offline!')}
        />
      </Col>
    </Row>
  );
}

export default OfflinePage;
