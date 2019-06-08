import firebase from 'firebase/app';
import 'firebase/auth';

const authDiv = document.getElementById('auth-div');
const eventsNavButton = document.getElementById('events-nav-button');
const messagesNavButton = document.getElementById('messages-nav-button');
const diaryNavButton = document.getElementById('diary-nav-button');
const newsNavButton = document.getElementById('news-nav-button');
const logoutNavButton = document.getElementById('logout-nav-button');

const checkLoginStatus = () => {
  // This checks login status of user
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      authDiv.classList.add('hide');
      eventsNavButton.classList.remove('hide');
      diaryNavButton.classList.remove('hide');
      messagesNavButton.classList.remove('hide');
      newsNavButton.classList.remove('hide');
      logoutNavButton.classList.remove('hide');
    } else {
      // If user is logged out, login button and authorization button are shown, everything else is hidden
      authDiv.classList.remove('hide');
      eventsNavButton.classList.add('hide');
      diaryNavButton.classList.add('hide');
      messagesNavButton.classList.add('hide');
      newsNavButton.classList.add('hide');
      logoutNavButton.classList.add('hide');
    }
  });
};

export default { checkLoginStatus };
