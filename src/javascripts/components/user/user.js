import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';
import userData from '../../helpers/data/usersData';
import eventsData from '../../helpers/data/eventsData';
import articlesData from '../../helpers/data/articlesData';
import entriesData from '../../helpers/data/entriesData';
import messagesData from '../../helpers/data/messagesData';
import './user.scss';
import util from '../../helpers/util';

// this should pull from avatars.json but i'm too lazy to do it right now
const avatars = [
  'https://image.flaticon.com/icons/svg/145/145847.svg',
  'https://image.flaticon.com/icons/svg/145/145850.svg',
  'https://image.flaticon.com/icons/svg/145/145843.svg',
  'https://image.flaticon.com/icons/svg/145/145846.svg',
  'https://image.flaticon.com/icons/svg/145/145849.svg',
  'https://image.flaticon.com/icons/svg/145/145842.svg',
  'https://image.flaticon.com/icons/svg/145/145845.svg',
  'https://image.flaticon.com/icons/svg/145/145844.svg',
];

// this highlights whatever avatar was clicked and puts that image in the main box of the edit profile modal
const selectAvatar = (e) => {
  const updatedAvatars = $('.avatar-image');
  for (let i = 0; i < updatedAvatars.length; i += 1) {
    updatedAvatars[i].classList.remove('selected');
  }
  e.target.classList.add('selected');
  const newAvatar = e.target.src;
  $('#edit-avatar-modal').attr('src', newAvatar);
};

// does exactly what you would think, takes the username and avatar and displays it in the top of the navbar
const displayNameInNavbar = (userId) => {
  userData.getUserInfoByUserId(userId)
    .then((user) => {
      $('.user-button').html(`<img id="user-navbar-avatar" src="${user[0].image}"></img> ${user[0].name}`);
    })
    .catch(err => console.error('can not display name in navbar', err));
};

// logs...out...the...user...and resets the user button
const logoutUser = () => {
  firebase.auth().signOut();
  $('.user-button').html('');
};

// deletes EVERYTHING related to the user from the database
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
  // this will delete articles from the user
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
  messagesData.getMessagesByUid(userId)
    .then((messagesResponse) => {
      for (let i = 0; i < messagesResponse.length; i += 1) {
        messagesData.deleteMessageFromDatabase(messagesResponse[i].id);
      }
    });
  // this deletes the user object from database
  userData.deleteUserFromDatabase(userDataId);
  $('#areYouSureDeleteModal').modal('hide');
  $('#editProfileModal').modal('hide');
  logoutUser();
  // bye bitch
};

// this will build out the body of the editProfileModal
const buildEditProfileModal = () => {
  $('.navbar-collapse').collapse('hide');
  const usersId = firebase.auth().currentUser.uid;
  userData.getUserInfoByUserId(usersId)
    .then((userObj) => {
      let domstring = '';
      domstring += `<div id="userObjDiv" class="container" data-userobjectid="${userObj[0].id}">`;
      domstring += '<div id="avatar-in-modal" class="row justify-content-center">';
      domstring += `<img id="edit-avatar-modal" class="col-12 mb-4" src="${userObj[0].image}"></img>`;
      domstring += '<button class="btn btn-info col-auto mb-2" data-toggle="collapse" data-target="#avatarSelection" aria-expanded="false" aria-controls="avatarSelection">Change Avatar</button>';
      domstring += '<div class="collapse col-12 mb-3" id="avatarSelection">';
      domstring += '<div id="avatar-selector" class="container mt-2">';
      domstring += '<div class="row">';
      for (let i = 0; i < avatars.length; i += 1) {
        domstring += '<div class="avatar col-3 mt-2">';
        domstring += `<a id="${i}-avatar" class="avatar-link"><img class="avatar-image`;
        if (avatars[i] === userObj[0].image) {
          domstring += ' selected';
        }
        domstring += `" src="${avatars[i]}"></a>`;
        domstring += '</div>';
      }
      domstring += '</div>';
      domstring += '</div>';
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

// after the user changes their profile info this changes their object in the database
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

// all the fun user event handlers
const userEventHandlers = () => {
  $('#logout-nav-button').on('click', logoutUser);
  $('#edit-profile-nav-button').on('click', buildEditProfileModal);
  $('#are-you-sure-delete').on('click', deleteProfile);
  $('#user-save-updates').on('click', updatesChanges);
  $('#edit-profile-modal-body').on('click', '.avatar-link', selectAvatar);
};

export default { displayNameInNavbar, userEventHandlers };
