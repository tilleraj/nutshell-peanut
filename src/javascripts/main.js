import firebase from 'firebase/app';
import auth from './components/auth/auth';
import navbar from './components/navbar/navbar';
import authData from './helpers/data/authData';
import dashboard from './components/dashboard/dashboard';

import apiKeys from './helpers/apiKeys.json';

import 'bootstrap';
import '../styles/main.scss';

const init = () => {
  firebase.initializeApp(apiKeys.firebaseConfig);
  navbar.navbarEvents();
  authData.checkLoginStatus();
  auth.authStringBuilder();
  dashboard.drawDashbaord();
};

init();
