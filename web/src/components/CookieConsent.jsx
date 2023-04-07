import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { theme, Typography } from 'antd';
import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent';
import ReactGA from 'react-ga4';
import cfg from '../config';

const { useToken } = theme;

function FooterMenu() {
  const { t } = useTranslation();
  const { token } = useToken();

  const cookieName = 'cookie_consent';

  const handleAcceptCookie = () => {
    if (cfg.googleAnalyticsId) {
      ReactGA.initialize(cfg.googleAnalyticsId);
    }
  };

  useEffect(() => {
    const isConsent = getCookieConsentValue(cookieName);
    if (isConsent === 'true') {
      handleAcceptCookie();
    }
  }, []);

  const fontSettings = {
    fontSize: token.fontSize,
    fontFamily: token.fontFamily,
  };

  return (
    <CookieConsent
      enableDeclineButton
      buttonText={t('Accept')}
      declineButtonText={t('Decline')}
      cookieName={cookieName}
      buttonStyle={{ ...fontSettings }}
      declineButtonStyle={{ ...fontSettings }}
      onAccept={handleAcceptCookie}
      style={{
        ...fontSettings,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {t("Our website uses cookies to improve your browsing experience and analyze site traffic. By clicking 'Accept', you consent to our use of cookies to understand how our site is used and improve it. For more information, please see our ")}
      <Typography.Link href="/privacy" style={{ lineHeight: 1 }}>
        {t('Privacy Policy')}
      </Typography.Link>
      .
    </CookieConsent>
  );
}

export default FooterMenu;
