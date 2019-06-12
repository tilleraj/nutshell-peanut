import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';
import util from '../../helpers/util';
import userData from '../../helpers/data/userData';
import userStuff from '../user/user';
import './newUser.scss';

// if the back button is hit, recreates the first modal page
const resetModalBody = () => {
  let domstring = '<div class="modal-body">';
  domstring += '<div id="new-user-greeting">';
  domstring += '<p>The number one place on the internet to compartmentalize yourself!</p>';
  domstring += '<p>"It\'s your life in a nutshell!"</p>';
  domstring += '</div>';
  domstring += '<div id="new-user-name">';
  domstring += '<p>Now first we need to gather some info about you to get started:</p>';
  domstring += '<div>';
  domstring += '<label class="sr-only" for="new-username">Username</label>';
  domstring += '<input type="text" class="form-control mb-2" id="new-username" placeholder="Username" required>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '<div class="modal-footer">';
  domstring += '<button type="button" id="nevermind" class="btn btn-danger">Nevermind!</button>';
  domstring += '<button type="submit" id="continue" class="btn btn-primary">Continue</button>';
  domstring += '</div>';
  util.printToDom('new-user-body', domstring);
};

// if the user cancels creating their profile at any point, logs them out and recreates the original modal for next time
const nevermind = () => {
  $('#newUserModal').modal('hide');
  firebase.auth().signOut();
  resetModalBody();
};

// recreates the modal body for the second page for avatar selection
const nextPageModal = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const newUserName = $('#new-username').val();
  let domString = '';
  domString += '<div id="avatar-selector" class="container">';
  domString += `<p>Select your avatar, ${newUserName}:</p>`;
  domString += '<div class="row">';
  domString += '<div class="avatar col-3">';
  domString += '<a id="first-avatar" class="avatar-link"><img class="avatar-image selected" src="https://image.flaticon.com/icons/svg/145/145847.svg"></a>';
  domString += '</div>';
  domString += '<div class="avatar col-3">';
  domString += '<a id="second-avatar" class="avatar-link"><img class="avatar-image" src="https://image.flaticon.com/icons/svg/145/145850.svg"></a>';
  domString += '</div>';
  domString += '<div class="avatar col-3">';
  domString += '<a id="third-avatar" class="avatar-link"><img class="avatar-image" src="https://image.flaticon.com/icons/svg/145/145843.svg"></a>';
  domString += '</div>';
  domString += '<div class="avatar col-3">';
  domString += '<a id="fourth-avatar" class="avatar-link"><img class="avatar-image" src="https://image.flaticon.com/icons/svg/145/145846.svg"></a>';
  domString += '</div>';
  domString += '<div class="avatar col-3">';
  domString += '<a id="fifth-avatar" class="avatar-link"><img class="avatar-image" src="https://image.flaticon.com/icons/svg/145/145849.svg"></a>';
  domString += '</div>';
  domString += '<div class="avatar col-3">';
  domString += '<a id="sixth-avatar" class="avatar-link"><img class="avatar-image" src="https://image.flaticon.com/icons/svg/145/145842.svg"></a>';
  domString += '</div>';
  domString += '<div class="avatar col-3">';
  domString += '<a id="seventh-avatar" class="avatar-link"><img class="avatar-image" src="https://image.flaticon.com/icons/svg/145/145845.svg"></a>';
  domString += '</div>';
  domString += '<div class="avatar col-3">';
  domString += '<a id="eigth-avatar" class="avatar-link"><img class="avatar-image" src="https://image.flaticon.com/icons/svg/145/145844.svg"></a>';
  domString += '</div>';
  domString += '</div>';
  domString += '</div>';
  domString += '<div class="modal-footer">';
  domString += '<button type="button" id="go-back" class="btn btn-secondary">Go back</button>';
  domString += '<button type="button" id="nevermind" class="btn btn-danger">Nevermind!</button>';
  domString += `<button type="submit" data-username="${newUserName}"id="save-new-user" class="btn btn-primary">Create Account</button>`;
  domString += '</div>';
  util.printToDom('new-user-body', domString);
};

// when the user presses go back, it recreates the first page for them
const goBack = () => {
  resetModalBody();
  $('#newUserModal').modal({ backdrop: 'static', keyboard: false });
  $('#newUserModal').modal('show');
};

// puts a selected class on the avatar that was clicked
const selectAvatar = (e) => {
  const avatars = $('.avatar-image');
  for (let i = 0; i < avatars.length; i += 1) {
    avatars[i].classList.remove('selected');
  }
  e.target.classList.add('selected');
};

// once the user completes the signup process, creates a new user for the database
// hides and resets the modal
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
      userStuff.displayNameInNavbar(userId);
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
