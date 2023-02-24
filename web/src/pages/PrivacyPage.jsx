import React from 'react';
import {
  Row, Col, Button,
} from 'antd';
import { useTranslation } from 'react-i18next';

function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <div
          id="ppms_cm_privacy_settings"
          style={{ textAlign: 'left', margin: '30px 25px' }}
        >
          <h1>
            {t('Privacy settings')}
          </h1>
          <p style={{ margin: '20px 0px' }}>
            {t('We collect and process your data on this site to better understand how it is used. We always ask you for consent to do that. You can change your privacy settings here.')}
          </p>
          <Button id="ppms_cm_privacy_settings_button">
            {t('Manage settings')}
          </Button>
        </div>
      </Col>
    </Row>
  );
}

export default PrivacyPage;
