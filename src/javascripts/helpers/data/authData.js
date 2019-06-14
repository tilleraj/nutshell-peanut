import firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios';
import $ from 'jquery';
import apiKeys from '../apiKeys.json';

import dashboard from '../../components/dashboard/dashboard';
import userStuff from '../../components/user/user';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const checkLoginStatus = () => {
  // This checks login status of user
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      axios.get(`${firebaseUrl}/user.json?orderBy="uid"&equalTo="${user.uid}"`)
        .then((resp) => {
          // if user doesn't exist in database then prompts newuser modal
          if (Object.entries(resp.data).length === 0 && resp.data.constructor === Object) {
            $('#newUserModal').modal({ backdrop: 'static', keyboard: false });
            $('#newUserModal').modal('show');
          } else {
            userStuff.displayNameInNavbar(user.uid);
          }
        }).catch(err => console.error('new user error', err));
      $('#auth-div').addClass('hide');
      dashboard.drawDashboard();
      $('#dashboard-page').removeClass('hide');
      $('#navbar-links').removeClass('hide');
    } else {
      // If user is logged out, login button is shown, everything else is cleared and hidden
      $('#auth-div').removeClass('hide');
      $('.page').addClass('hide');
      $('.page').html('');
      $('#navbar-links').addClass('hide');
    }
  });
};

export default { checkLoginStatus };
