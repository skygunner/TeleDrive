import React from 'react';
import { theme, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import config from '../config';

const { useToken } = theme;

function DonatePage() {
  const { t } = useTranslation();
  const { token } = useToken();

  return (
    <div
      style={{
        textAlign: 'left',
        margin: config.pageMargin,
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
      <Typography.Paragraph copyable strong>
        0xcAA98CD5BA25AE1fA064813B41952d0716892381
      </Typography.Paragraph>
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
