import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';
import util from '../../helpers/util';
import userData from '../../helpers/data/userData';
import './newUser.scss';

const resetModalBody = () => {
  let domstring = '<div class="modal-body">';
  domstring += '<div id="new-user-greeting">';
  domstring += '<h4>The number one place on the internet to compartmentalize yourself!</h4>';
  domstring += '<h4>"It\'s your life in a nutshell!"</h4>';
  domstring += '</div>';
  domstring += '<div id="new-user-name">';
  domstring += '<h4>Now first we need to gather some info about you to get started:</h4>';
  domstring += '<div>';
  domstring += '<label class="sr-only" for="new-username">Username</label>';
  domstring += '<input type="text" class="form-control mb-2" id="new-username" placeholder="Username" required>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '<div class="modal-footer">';
  domstring += '<button type="button" id="nevermind" class="btn btn-secondary">Nevermind!</button>';
  domstring += '<button type="submit" id="continue" class="btn btn-primary">Continue</button>';
  domstring += '</div>';
  util.printToDom('new-user-body', domstring);
};

const nevermind = () => {
  $('#newUserModal').modal('hide');
  firebase.auth().signOut();
  resetModalBody();
};

const nextPageModal = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const newUserName = $('#new-username').val();
  let domString = '';
  domString += '<div id="avatar-selector" class="container">';
  domString += `<h2>Select your avatar, ${newUserName}:</h2>`;
  domString += '<div class="row">';
  domString += '<div class="col-4">';
  domString += '<a id="first-avatar" class="avatar-link"><img class="avatar-image selected" src="https://www.shareicon.net/download/2015/09/24/106427_man_512x512.png"></a>';
  domString += '</div>';
  domString += '<div class="col-4">';
  domString += '<a id="second-avatar" class="avatar-link"><img class="avatar-image" src="https://cdn0.iconfinder.com/data/icons/user-pictures/100/female-512.png"></a>';
  domString += '</div>';
  domString += '<div class="col-4">';
  domString += '<a id="third-avatar" class="avatar-link"><img class="avatar-image" src="https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman1-2-512.png"></a>';
  domString += '</div>';
  domString += '</div>';
  domString += '</div>';
  domString += '<div class="modal-footer">';
  domString += '<button type="button" id="go-back" class="btn btn-secondary">Go back</button>';
  domString += '<button type="button" id="nevermind" class="btn btn-secondary">Nevermind!</button>';
  domString += `<button type="submit" data-username="${newUserName}"id="save-new-user" class="btn btn-primary">Create Account</button>`;
  domString += '</div>';
  util.printToDom('new-user-body', domString);
};

const goBack = () => {
  resetModalBody();
  $('#newUserModal').modal({ backdrop: 'static', keyboard: false });
  $('#newUserModal').modal('show');
};

const selectAvatar = (e) => {
  const avatars = $('.avatar-image');
  for (let i = 0; i < avatars.length; i += 1) {
    avatars[i].classList.remove('selected');
  }
  e.target.classList.add('selected');
};

const saveNewUser = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const userId = firebase.auth().currentUser.uid;
  const button = $(e.target);
  const newUser = {
    name: button.data('username'),
    image: $('.selected')[0].src,
    uid: userId,
  };
  userData.addUserToDatabase(newUser)
    .then(() => {
      $('#newUserModal').modal('hide');
      resetModalBody();
    }).catch(err => console.error('problem adding new user', err));
};

const newUserButtonHandlers = () => {
  $('#newUserModal').on('click', '#nevermind', nevermind);
  $('#new-user-form').on('submit', nextPageModal);
  $('#newUserModal').on('click', '#go-back', goBack);
  $('#newUserModal').on('click', '.avatar-link', selectAvatar);
  $('#newUserModal').on('click', '#save-new-user', saveNewUser);
};

export default { newUserButtonHandlers };
