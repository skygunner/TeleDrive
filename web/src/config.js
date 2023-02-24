export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  telegramBotName: process.env.REACT_APP_TELEGRAM_BOT_NAME || 'BotName',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  listLoadLimit: 20,
  piwikProContainerId: process.env.REACT_APP_PIWIK_PRO_CONTAINER_ID,
};
