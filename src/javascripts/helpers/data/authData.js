import firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios';
import $ from 'jquery';
import apiKeys from '../apiKeys.json';

import dashboard from '../../components/dashboard/dashboard';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;
const authDiv = document.getElementById('auth-div');
const allPagesDiv = document.getElementById('all-pages');
const dashboardPage = document.getElementById('dashboard-page');
const dashboardNavButton = document.getElementById('dashboard-nav-button');
const eventsNavButton = document.getElementById('events-nav-button');
const messagesNavButton = document.getElementById('messages-nav-button');
const diaryNavButton = document.getElementById('diary-nav-button');
const newsNavButton = document.getElementById('news-nav-button');
const logoutNavButton = document.getElementById('logout-nav-button');

const checkLoginStatus = () => {
  // This checks login status of user
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      axios.get(`${firebaseUrl}/user.json?orderBy="uid"&equalTo="${user.uid}"`)
        .then((resp) => {
          if (Object.entries(resp.data).length === 0 && resp.data.constructor === Object) {
            // console.error('new user');
            $('#newUserModal').modal({ backdrop: 'static', keyboard: false });
            $('#newUserModal').modal('show');
            // const newUser = {
            //   uid: user.uid,
            //   image: 'https://www.w3schools.com/howto/img_avatar.png',
            //   name: 'New User',
            // };
            // axios.post(`${firebaseUrl}/user.json`, newUser);
          }
        }).catch(err => console.error('new user error', err));
      allPagesDiv.classList.remove('hide');
      authDiv.classList.add('hide');
      dashboardPage.classList.remove('hide');
      dashboard.drawDashbaord();
      dashboardNavButton.classList.remove('hide');
      eventsNavButton.classList.remove('hide');
      diaryNavButton.classList.remove('hide');
      messagesNavButton.classList.remove('hide');
      newsNavButton.classList.remove('hide');
      logoutNavButton.classList.remove('hide');
    } else {
      // If user is logged out, login button and authorization button are shown, everything else is hidden
      authDiv.classList.remove('hide');
      dashboardPage.classList.add('hide');
      dashboardNavButton.classList.add('hide');
      eventsNavButton.classList.add('hide');
      diaryNavButton.classList.add('hide');
      messagesNavButton.classList.add('hide');
      newsNavButton.classList.add('hide');
      logoutNavButton.classList.add('hide');
    }
  });
};

export default { checkLoginStatus };
