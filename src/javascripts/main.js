import firebase from 'firebase/app';
import auth from './components/auth/auth';
import navbar from './components/navbar/navbar';
import authData from './helpers/data/authData';
import dashboard from './components/dashboard/dashboard';
import 'bootstrap';
import '../styles/main.scss';
import apiKeys from './helpers/apiKeys.json';
import eventsPage from './components/events/events';
import diaryPage from './components/entries/entries';
import messagesPage from './components/messages/messages';

const init = () => {
  firebase.initializeApp(apiKeys.firebaseConfig);
  navbar.navbarEvents();
  authData.checkLoginStatus();
  auth.authStringBuilder();
  dashboard.drawDashboard();
  eventsPage.eventPageButtonHandlers();
  diaryPage.entryPageButtonHandlers();
  messagesPage.getMessages();
};

init();
