import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row, theme } from 'antd';

const { useToken } = theme;

function FooterMenu() {
  const { t } = useTranslation();
  const { token } = useToken();

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <div style={{ textAlign: 'center', margin: '50px 0px', color: token.colorTextTertiary }}>
          {t('Copyright © 2023 teledrive.io all rights reserved.')}
        </div>
      </Col>
    </Row>
  );
}

export default FooterMenu;
