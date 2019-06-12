import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';
import userData from '../../helpers/data/userData';
import eventsData from '../../helpers/data/eventsData';
import './user.scss';
import util from '../../helpers/util';

const displayNameInNavbar = (userId) => {
  userData.getUserInfoByUserId(userId)
    .then((user) => {
      $('.user-button').html(`<img id="user-navbar-avatar" src="${user[0].image}"></img> ${user[0].name}`);
      $('#edit-profile-nav-button').attr('data-userobjectid', `${user[0].id}`);
      $('#edit-profile-nav-button').attr('data-userid', `${user[0].uid}`);
    })
    .catch(err => console.error('can not display name in navbar', err));
};

const logoutUser = () => {
  firebase.auth().signOut();
  $('.user-button').html('');
};

const deleteProfile = (e) => {
  const button = $(e.target);
  const userDataId = button.data('userobjectid');
  const userId = firebase.auth().currentUser.uid;
  console.error(userDataId, userId);
  userData.deleteUserFromDatabase(userDataId);
  eventsData.retrieveEventsByUserId(userId)
    .then((eventsResponse) => {
      for (let i = 0; i < eventsResponse.length; i += 1) {
        eventsData.removeEventFromDatabaseByEventId(eventsResponse[i].uid);
      }
    })
    .catch(err => console.error('deleteProfile events delete', err));
  $('#areYouSureDeleteModal').modal('hide');
  $('#editProfileModal').modal('hide');
  logoutUser();
};

const buildEditProfileModal = (e) => {
  const button = $(e.target);
  const userObjectId = button.data('userobjectid');
  const userId = button.data('userid');
  let domstring = '';
  domstring += `<button id="delete-profile" class="btn btn-danger" data-userobjectid="${userObjectId}"`;
  domstring += `data-userid="${userId}" data-toggle="modal" data-target="#areYouSureDeleteModal">Delete Profile</button>`;
  util.printToDom('edit-profile-modal-body', domstring);
  $('#are-you-sure-delete').attr('data-userobjectid', `${userObjectId}`);
  $('#editProfileModal').modal('show');
};

const userEventHandlers = () => {
  $('#logout-nav-button').on('click', logoutUser);
  $('#edit-profile-nav-button').on('click', buildEditProfileModal);
  $('#are-you-sure-delete').on('click', deleteProfile);
};

export default { displayNameInNavbar, userEventHandlers };
