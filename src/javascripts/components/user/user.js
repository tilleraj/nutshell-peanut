import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';
import userData from '../../helpers/data/userData';
import eventsData from '../../helpers/data/eventsData';
import articlesData from '../../helpers/data/articlesData';
import entriesData from '../../helpers/data/entriesData';
import messagesData from '../../helpers/data/messagesData';
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
