import React from 'react';
import {
  Row, Col, Button, theme,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileSyncOutlined } from '@ant-design/icons';
import { isUserLoggedIn } from '../api';
import LoginButton from '../components/LoginButton';

const { useToken } = theme;

function HomePage() {
  const isLoggedIn = isUserLoggedIn();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useToken();

  const topMargin = '30px 25px';
  const sectionMargin = '30px 0px';

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <div style={{
          textAlign: 'left',
          margin: topMargin,
          fontSize: token.fontSize,
          color: token.colorTextSecondary,
        }}
        >
          <div style={{ textAlign: 'center', margin: sectionMargin }}>
            <img alt="TeleDrive" src={`${process.env.PUBLIC_URL}/logo192.png`} width={150} height={150} />
            <h1 style={{ margin: '30px 0px', color: token.colorText }}>
              {t('Welcome to TeleDrive')}
            </h1>
            <h2>
              {t('The ultimate solution for managing your Telegram unlimited cloud storage')}
            </h2>
          </div>
          <div style={{ margin: sectionMargin }}>
            <p>
              {t("You've come to the right place if you're tired of constantly worrying about running out of storage space. With TeleDrive, you can enjoy Telegram unlimited cloud storage for all your files and never have to worry about running out of space again.")}
            </p>
            <p>
              {t('Our easy-to-use platform seamlessly integrates with Telegram, allowing you to manage your files, create folders, and share with others. TeleDrive is the perfect solution for all your storage needs.')}
            </p>
          </div>
          <div style={{ margin: sectionMargin }}>
            <h3>
              {t('Features of TeleDrive include:')}
            </h3>
            <p>
              <b>
                {t('Unlimited Cloud Storage: ')}
              </b>
              {t("With TeleDrive, you'll never have to worry about running out of storage space again.TeleDrive ensures you can store all your files in one place without any restrictions.")}
            </p>
            <p>
              <b>
                {t('Effortless Integration: ')}
              </b>
              {t('TeleDrive seamlessly integrates with Telegram, making it easy to manage your files directly from our platform. There is no need to switch between apps - everything is right at your fingertips.')}
            </p>
            <p>
              <b>
                {t('Easy File Management: ')}
              </b>
              {t('With TeleDrive, you can easily create folders, move folders and files, and delete unwanted files. Our intuitive platform makes it easy to keep all your files organized and easily accessible.')}
            </p>
            <p>
              <b>
                {t('Secure and Reliable: ')}
              </b>
              {t('At TeleDrive, we take security and reliability seriously. We use the latest encryption technology to ensure your files are always safe and secure.')}
            </p>
            <p>
              <b>
                {t('24/7 Customer Support: ')}
              </b>
              {t("Our customer support team is available 24/7 to answer any questions. Whether you need help getting started or have a technical issue, we're here to help.")}
            </p>
          </div>
          <div style={{ textAlign: 'center', margin: sectionMargin }}>
            <h4>
              {t('Try TeleDrive today and enjoy Telegram unlimited cloud storage for all your files')}
            </h4>
            {isLoggedIn
              ? (
                <Button
                  style={{ marginTop: 10 }}
                  size="large"
                  type="primary"
                  icon={<FileSyncOutlined />}
                  onClick={() => {
                    navigate('/files');
                  }}
                >
                  {t('My Drive')}
                </Button>
              )
              : <LoginButton />}
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default HomePage;
