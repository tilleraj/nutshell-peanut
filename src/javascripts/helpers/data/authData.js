import firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios';
import $ from 'jquery';
import apiKeys from '../apiKeys.json';

import dashboard from '../../components/dashboard/dashboard';
import userStuff from '../../components/user/user';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;
const authDiv = document.getElementById('auth-div');
const allPagesDiv = $('#all-pages');
const dashboardPage = document.getElementById('dashboard-page');
const dashboardNavButton = document.getElementById('dashboard-nav-button');

const checkLoginStatus = () => {
  // This checks login status of user
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      axios.get(`${firebaseUrl}/user.json?orderBy="uid"&equalTo="${user.uid}"`)
        .then((resp) => {
          if (Object.entries(resp.data).length === 0 && resp.data.constructor === Object) {
            $('#newUserModal').modal({ backdrop: 'static', keyboard: false });
            $('#newUserModal').modal('show');
          } else {
            userStuff.displayNameInNavbar(user.uid);
          }
        }).catch(err => console.error('new user error', err));
      allPagesDiv.removeClass('hide');
      authDiv.classList.add('hide');
      dashboardPage.classList.remove('hide');
      dashboard.drawDashbaord();
      $('#navbar-links').removeClass('hide');
    } else {
      // If user is logged out, login button and authorization button are shown, everything else is hidden
      authDiv.classList.remove('hide');
      allPagesDiv.addClass('hide');
      dashboardNavButton.classList.add('hide');
      $('#navbar-links').addClass('hide');
    }
  });
};

export default { checkLoginStatus };
