import React from 'react';
import { Row, Col, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import colors from '../styles/colors';

function SupportPage() {
  const { t } = useTranslation();

  const topMargin = '30px 25px';
  const sectionMargin = '20px 0px';

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <div
          style={{
            fontSize: 14,
            textAlign: 'left',
            margin: topMargin,
            color: colors.colorTextSecondary,
          }}
        >
          <h1 style={{ color: colors.colorText }}>
            {t('Support')}
          </h1>
          <div style={{ margin: sectionMargin }}>
            <p>
              {t("Welcome to the TeleDrive Support Page! We're here to assist you with any questions or concerns you may have about our service. Our goal is to ensure that you have the best experience using TeleDrive and that all your needs are met.")}
            </p>
          </div>
          <div style={{ margin: sectionMargin }}>
            <h3>
              {t('Contacting Support')}
            </h3>
            <p>
              {t("If you have questions, don't hesitate to contact our support team. We offer 24/7 support via email, and our team is always happy to help. When contacting support, please provide as much detail as possible about your issue or concern. This will help us resolve your issue quickly and efficiently.")}
            </p>
            <p>
              <b>
                {t('Support email: ')}
              </b>
              <Typography.Link href="mailto: support@teledrive.io">
                support@teledrive.io
              </Typography.Link>
            </p>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default SupportPage;
