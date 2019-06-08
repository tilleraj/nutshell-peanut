import firebase from 'firebase/app';
import 'bootstrap';
import '../styles/main.scss';
import apiKeys from './helpers/apiKeys.json';
import eventsPage from './components/events/events';

const init = () => {
  firebase.initializeApp(apiKeys.firebaseConfig);
  eventsPage.eventPageButtonHandlers();
};

init();
