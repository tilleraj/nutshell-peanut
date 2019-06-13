import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';
import userData from '../../helpers/data/usersData';
import eventsData from '../../helpers/data/eventsData';
import articlesData from '../../helpers/data/articlesData';
import entriesData from '../../helpers/data/entriesData';
import './user.scss';
import util from '../../helpers/util';

const displayNameInNavbar = (userId) => {
  userData.getUserInfoByUserId(userId)
    .then((user) => {
      $('.user-button').html(`<img id="user-navbar-avatar" src="${user[0].image}"></img> ${user[0].name}`);
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
  // this will delete events from the user
  eventsData.retrieveEventsByUserId(userId)
    .then((eventsResponse) => {
      for (let i = 0; i < eventsResponse.length; i += 1) {
        eventsData.removeEventFromDatabaseByEventId(eventsResponse[i].id);
      }
    })
    .catch(err => console.error('deleteProfile events delete', err));
  articlesData.getArticlesByUserId(userId)
    .then((articleResponse) => {
      for (let i = 0; i < articleResponse.length; i += 1) {
        articlesData.deleteArticleById(articleResponse[i].id);
      }
    });
  // this will delete entries from the user
  entriesData.getEntries(userId)
    .then((entriesResponse) => {
      for (let i = 0; i < entriesResponse.length; i += 1) {
        entriesData.removeEntryFromDatabase(entriesResponse[i].id);
      }
    });
  // this will delete messages from the user
  // this deletes the user object from database
  userData.deleteUserFromDatabase(userDataId);
  $('#areYouSureDeleteModal').modal('hide');
  $('#editProfileModal').modal('hide');
  logoutUser();
};

const buildEditProfileModal = () => {
  const usersId = firebase.auth().currentUser.uid;
  userData.getUserInfoByUserId(usersId)
    .then((userObj) => {
      let domstring = '';
      domstring += `<div id="userObjDiv" class="container" data-userobjectid="${userObj[0].id}">`;
      domstring += '<div id="avatar-in-modal" class="row justify-content-center">';
      domstring += `<img id="edit-avatar-modal" class="col-12 mb-4" src="${userObj[0].image}"></img>`;
      domstring += '<button class="btn btn-info col-auto">Change Avatar</button>';
      domstring += '</div>';
      domstring += '<div class="input-group mb-3">';
      domstring += '<div class="input-group-prepend">';
      domstring += '<span class="input-group-text" id="basic-addon1">Username</span>';
      domstring += '</div>';
      domstring += `<input type="text" id="update-username" class="form-control" value="${userObj[0].name}" aria-label="Username" aria-describedby="basic-addon1">`;
      domstring += '</div>';
      domstring += `<button id="delete-profile" class="btn btn-danger col-12" data-userobjectid="${userObj[0].id}"`;
      domstring += `data-userid="${userObj[0].uid}" data-toggle="modal" data-target="#areYouSureDeleteModal">Delete Profile</button>`;
      domstring += '</div>';
      util.printToDom('edit-profile-modal-body', domstring);
      $('#are-you-sure-delete').attr('data-userobjectid', `${userObj[0].id}`);
      $('#editProfileModal').modal('show');
    })
    .catch();
};

const updatesChanges = () => {
  const userObjId = $('#userObjDiv').data('userobjectid');
  const updatedUsername = $('#update-username').val();
  const updatedAvatar = $('#edit-avatar-modal').attr('src');
  const userId = firebase.auth().currentUser.uid;
  const updatedUserInfo = {
    name: updatedUsername,
    image: updatedAvatar,
    uid: userId,
  };
  userData.editUsersInfo(userObjId, updatedUserInfo)
    .then(() => {
      $('#editProfileModal').modal('hide');
      displayNameInNavbar(userId);
    })
    .catch();
};

const userEventHandlers = () => {
  $('#logout-nav-button').on('click', logoutUser);
  $('#edit-profile-nav-button').on('click', buildEditProfileModal);
  $('#are-you-sure-delete').on('click', deleteProfile);
  $('#user-save-updates').on('click', updatesChanges);
};

export default { displayNameInNavbar, userEventHandlers };
