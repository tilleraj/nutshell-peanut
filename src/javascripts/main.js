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
import newsPage from './components/articles/articles';
import newUser from './components/newUser/newUser';
import userStuff from './components/user/user';

const init = () => {
  firebase.initializeApp(apiKeys.firebaseConfig);
  navbar.navbarEvents();
  authData.checkLoginStatus();
  newUser.newUserButtonHandlers();
  auth.authStringBuilder();
  dashboard.drawDashboard();
  eventsPage.eventPageButtonHandlers();
  diaryPage.entryPageButtonHandlers();
  messagesPage.getMessages();
  newsPage.newsPageButtonHandlers();
  userStuff.userEventHandlers();
};

init();
