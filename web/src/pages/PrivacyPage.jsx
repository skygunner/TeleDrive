import React from 'react';
import { theme, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import cfg from '../config';

const { useToken } = theme;

function PrivacyPage() {
  const { t } = useTranslation();
  const { token } = useToken();

  return (
    <div
      style={{
        textAlign: 'left',
        margin: cfg.pageMargin,
        fontSize: token.fontSize,
        color: token.colorTextSecondary,
      }}
    >
      <h1 style={{ color: token.colorText }}>
        {t('Privacy Policy')}
      </h1>
      <p style={{ color: token.colorText }}>
        {t('Effective date: 01-04-2023')}
      </p>
      <p>
        {t('Our website (TeleDrive | teledrive.io) respects the privacy of our users and is committed to protecting their personal information. This Privacy Policy outlines the types of personal information that we may collect from users when they visit our website, and how we may use and disclose that information.')}
      </p>
      <p>
        <span style={{ color: token.colorText }}>
          {t('1. Information We Collect')}
        </span>
        <br />
        <span>
          {t('We may collect personal information that users provide to us, such as their name, email address, phone number, or other contact information. We may also collect non-personal information such as browser type, IP address, device type, and operating system.')}
        </span>
      </p>
      <p>
        <span style={{ color: token.colorText }}>
          {t('2. How We Use Your Information')}
        </span>
        <br />
        {t('We may use the information we collect from users to:')}
        <br />
        <br />
        {t('- Improve our website and the services we offer')}
        <br />
        {t('- Respond to inquiries and requests from users')}
        <br />
        {t('- Send users information about our products or services')}
        <br />
        {t('- Send periodic emails related to our website and services')}
        <br />
        {t('- Monitor and analyze website usage and trends')}
        <br />
        <br />
        {t('We may also use non-personal information for statistical purposes, to analyze trends, and to improve our website and services.')}
      </p>
      <p>
        <span style={{ color: token.colorText }}>
          {t('3. How We Share Your Information')}
        </span>
        <br />
        {t("We do not sell, trade, or rent users' personal information to others. We may share users' personal information with third-party service providers who assist us in operating our website or providing services to users. We may also disclose personal information when required by law or to protect our legal rights.")}
      </p>
      <p>
        <span style={{ color: token.colorText }}>
          {t('4. Cookies and Other Tracking Technologies')}
        </span>
        <br />
        {t("We may use cookies and other tracking technologies to improve users' experience on our website. Users may choose to set their web browser to refuse cookies, or to alert them when cookies are being sent. However, if they do so, some parts of the website may not function properly.")}
      </p>
      <p>
        <span style={{ color: token.colorText }}>
          {t('5. Security')}
        </span>
        <br />
        {t("We take reasonable measures to protect users' personal information from unauthorized access, disclosure, alteration, and destruction.")}
      </p>
      <p>
        <span style={{ color: token.colorText }}>
          {t('6. Links to Other Websites')}
        </span>
        <br />
        {t('Our website may contain links to other websites. We are not responsible for the privacy practices or content of these third-party sites.')}
      </p>
      <p>
        <span style={{ color: token.colorText }}>
          {t("7. Children's Privacy")}
        </span>
        <br />
        {t('Our website is not directed to children under the age of 13. We do not knowingly collect personal information from children under the age of 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so that we can delete the information.')}
      </p>
      <p>
        <span style={{ color: token.colorText }}>
          {t('8. Changes to This Privacy Policy')}
        </span>
        <br />
        {t('We reserve the right to update or modify this Privacy Policy at any time. The updated version will be posted on our website and will be effective as of the date of posting.')}
      </p>
      <p>
        <span style={{ color: token.colorText }}>
          {t('9. Contact Us')}
        </span>
        <br />
        {t('If you have any questions or concerns about our Privacy Policy or our practices, please contact us at ')}
        <Typography.Link href="mailto: support@teledrive.io" style={{ lineHeight: 1 }}>
          support@teledrive.io
        </Typography.Link>
        .
      </p>
    </div>
  );
}

export default PrivacyPage;
