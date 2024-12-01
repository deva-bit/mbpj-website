import React from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'
import { Amplify } from 'aws-amplify'
import { Provider } from 'react-redux'
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'

// @ts-ignore
import awsconfig from './aws-exports'

const queryClient = new QueryClient();

const { VITE_AWS_LOGIN_URL, VITE_AWS_REDIRECT_AFTER_SIGNIN_URL, VITE_AWS_REDIRECT_AFTER_SIGNOUT_URL } = import.meta.env

awsconfig.oauth.redirectSignIn = VITE_AWS_REDIRECT_AFTER_SIGNIN_URL
awsconfig.oauth.redirectSignOut = VITE_AWS_REDIRECT_AFTER_SIGNOUT_URL
Amplify.configure(awsconfig);


const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center' }}>
    <img src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" style={{ height: 60 }} />
    <p style={{ color: 'black' }}>Data Not Found</p>
  </div>
);

// if (location.pathname.startsWith('/qr-registration')) {
//   localStorage.setItem('pathname',location.pathname);
//   window.location.href = VITE_AWS_LOGIN_URL;
// }
// else {
  const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
              <QueryClientProvider client={queryClient}>
                <App />
              </QueryClientProvider>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </React.StrictMode>,
  );
// }
