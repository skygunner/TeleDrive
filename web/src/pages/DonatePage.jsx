import React from 'react';
import { theme, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import cfg from '../config';

const { useToken } = theme;

function DonatePage() {
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
        {t('Donate')}
      </h1>
      <p>
        {t('If you found this project useful, please consider supporting its development with a donation in')}
        <b> ETH </b>
        {t('to the following address:')}
      </p>
      <Typography.Paragraph copyable strong style={{ lineHeight: 1 }}>
        0xcAA98CD5BA25AE1fA064813B41952d0716892381
      </Typography.Paragraph>
      <p>
        {t('Or you can donate any amount you want using ')}
        <Typography.Link target="blank" href="https://www.paypal.me/RashadAnsari" style={{ lineHeight: 1 }}>PayPal.</Typography.Link>
      </p>
      <p>
        {t('Your donation will help cover the costs of maintaining and improving this project, as well as motivate us to continue working on it.')}
      </p>
      <p>
        {t('Thank you for your support!')}
      </p>
    </div>
  );
}

export default DonatePage;
