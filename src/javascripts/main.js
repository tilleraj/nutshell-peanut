import firebase from 'firebase/app';
import auth from './components/auth/auth';
import navbar from './components/navbar/navbar';
import authData from './helpers/data/authData';
import 'bootstrap';
import '../styles/main.scss';
import apiKeys from './helpers/apiKeys.json';
import eventsPage from './components/events/events';
import diaryPage from './components/entries/entries';

const init = () => {
  firebase.initializeApp(apiKeys.firebaseConfig);
  navbar.navbarEvents();
  authData.checkLoginStatus();
  auth.authStringBuilder();
  eventsPage.eventPageButtonHandlers();
  diaryPage.entryPageButtonHandlers();
};

init();
