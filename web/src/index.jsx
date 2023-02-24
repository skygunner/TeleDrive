import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as StoreProvider } from 'react-redux';
import PiwikPro from '@piwikpro/react-piwik-pro';

import App from './App';
import store from './store';
import config from './config';
import './i18n';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

if (config.piwikProContainerId) {
  PiwikPro.initialize(
    config.piwikProContainerId,
    'https://teledrive.containers.piwik.pro',
  );
}

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
