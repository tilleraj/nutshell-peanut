import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';
import userData from '../../helpers/data/userData';
import './user.scss';

const displayNameInNavbar = (userId) => {
  userData.getUserInfoByUserId(userId)
    .then((user) => {
      console.error('user', user[0].image);
      $('.user-button').html(`<img id="user-navbar-avatar" src="${user[0].image}"></img> ${user[0].name}`);
    })
    .catch(err => console.error('can not display name in navbar', err));
};

const logoutUser = () => {
  firebase.auth().signOut();
  $('.user-button').html('');
};

const userEventHandlers = () => {
  $('#logout-nav-button').on('click', logoutUser);
};

export default { displayNameInNavbar, userEventHandlers };
