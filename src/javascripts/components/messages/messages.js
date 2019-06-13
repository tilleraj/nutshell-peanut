import firebase from 'firebase/app';
import 'firebase/auth';
import './messages.scss';

import $ from 'jquery';
import util from '../../helpers/util';
import messagesData from '../../helpers/data/messagesData';
import usersData from '../../helpers/data/usersData';
import smash from '../../helpers/smash';

const moment = require('moment');

const scrollPosition = () => {
  const container = document.getElementById('messageBoard');
  const containerHeight = container.clientHeight;
  const contentHeight = container.scrollHeight;
  container.scrollTop = contentHeight - containerHeight;
};

let userMessages = [];

const setMessages = (newArray) => {
  userMessages = [...newArray];
};

const deleteMessage = (e) => {
  e.preventDefault();
  const targetId = e.target.id;
  messagesData.deleteMessageFromDatabase(targetId)
    .then(() => {
      // eslint-disable-next-line no-use-before-define
      getMessages();
    })
    .catch(err => console.error('no message delete for you', err));
};

const addMessage = (e) => {
  e.preventDefault();
  const currentTime = moment().toISOString();
  const newMessage = {
    uid: firebase.auth().currentUser.uid,
    message: document.getElementById('messageInputField').value,
    timestamp: currentTime,
  };
  messagesData.addMessageToDatabase(newMessage)
    .then(() => {
      document.getElementById('messageInputField').value = '';
      // eslint-disable-next-line no-use-before-define
      getMessages();
    })
    .catch(err => console.error('no new message added', err));
  // scrollPosition();
};

const listenForEnter = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    document.getElementById('messageSubmitBtn').click();
  }
};

const listenForSaveEnter = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    const selectedEditBtn = document.getElementById(e.target.id).getElementsByClassName('editMessageBtn')[0];
    selectedEditBtn.click();
  }
};

const editMessage = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const targetId = e.target.id;
  const messageText = document.getElementById(e.target.id).getElementsByClassName('messageText')[0];
  $(`#${targetId}.messageText`).toggle(100);
  $(`#${targetId}.editMessageBtn`).toggle(100);
  $(`#${targetId}.saveMessageBtn`).toggle(100);
  $(`#${targetId}.cancelChangeBtn`).toggle(100);
  $(`#${targetId}.deleteMessageBtn`).toggle(100);
  messageText.contentEditable = 'true';
  messageText.classList.add('editable');
  messageText.addEventListener('keyup', listenForSaveEnter);
};

const saveMessageUpdate = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const targetId = e.target.id;
  const messageText = document.getElementById(e.target.id).getElementsByClassName('messageText')[0];
  const originalMessageObject = userMessages.filter(message => message.id === targetId);
  $(`#${targetId}.editMessageBtn`).toggle(300);
  $(`#${targetId}.saveMessageBtn`).toggle(300);
  $(`#${targetId}.cancelChangeBtn`).toggle(300);
  $(`#${targetId}.deleteMessageBtn`).toggle(300);
  messageText.contentEditable = 'true';
  messageText.classList.remove('editable');
  const userId = firebase.auth().currentUser.uid;
  const messageTextContent = messageText.textContent;
  const originalTimestamp = originalMessageObject[0].timestamp;
  const newMessageObject = {
    message: messageTextContent,
    uid: userId,
    timestamp: originalTimestamp,
  };
  messagesData.editMessageInDatabase(newMessageObject, e.target.id)
    .then(() => {
      // eslint-disable-next-line no-use-before-define
      getMessages();
    })
    .catch(err => console.error('no message delete for you', err));
};

const showButtonsAndTimestamp = (e) => {
  const targetId = e.target.id;
  $(`#${targetId}.editMessageBtn`).toggle(1000);
  $(`#${targetId}.deleteMessageBtn`).toggle(1000);
  $(`#${targetId}.timestamp`).toggle(1000);
};

const cancelChanges = (e) => {
  const targetId = e.target.id;
  $(`#${targetId}.saveMessageBtn`).toggle(1000);
  $(`#${targetId}.cancelChangeBtn`).toggle(1000);
  $(`#${targetId}.timestamp`).toggle(1000);
  const messageText = document.getElementById(e.target.id).getElementsByClassName('messageText')[0];
  messageText.contentEditable = 'false';
  messageText.classList.remove('editable');
};

const addEvents = () => {
  // The code below is not working for hiding and showing timestamps!
  // const timestamps = document.getElementsByClassName('full-message-div');
  // const timestampsArray = Array.from(timestamps);
  // timestampsArray.forEach((timestamp) => {
  //   timestamp.addEventListener('mouseover', timestamp.classList.remove('hide'));
  // });
  const messageEditBtns = Array.from(document.getElementsByClassName('editMessageBtn'));
  messageEditBtns.forEach((button) => {
    button.addEventListener('click', editMessage);
  });
  const saveMessageEditsBtns = Array.from(document.getElementsByClassName('saveMessageBtn'));
  saveMessageEditsBtns.forEach((button) => {
    button.addEventListener('click', saveMessageUpdate);
  });
  const messageOptionsBtns = Array.from(document.getElementsByClassName('messageOptionsBtn'));
  messageOptionsBtns.forEach((button) => {
    button.addEventListener('click', showButtonsAndTimestamp);
  });
  const cancelChangeBtns = Array.from(document.getElementsByClassName('cancelChangeBtn'));
  cancelChangeBtns.forEach((button) => {
    button.addEventListener('click', cancelChanges);
  });
  const deleteBtns = Array.from(document.getElementsByClassName('deleteMessageBtn'));
  deleteBtns.forEach((button) => {
    button.addEventListener('click', deleteMessage);
  });
  document.getElementById('messageSubmitBtn').addEventListener('click', addMessage);
  document.getElementById('messageInputField').addEventListener('keyup', listenForEnter);
};

const messagesBuilder = (messagesArray) => {
  const currentUserId = firebase.auth().currentUser.uid;
  const messagesToSort = messagesArray;
  setMessages(messagesArray);
  messagesToSort.sort((a, b) => {
    // eslint-disable-next-line no-param-reassign
    a = new Date(a.timestamp);
    // eslint-disable-next-line no-param-reassign
    b = new Date(b.timestamp);
    // eslint-disable-next-line no-nested-ternary
    return a < b ? -1 : a > b ? 1 : 0;
  });
  let userType = '';
  let domString = '';
  domString += '<div id="messageBoard">';
  messagesToSort.forEach((message) => {
    const timeToDisplay = moment(message.timestamp).format('dddd, MMMM Do YYYY, h:mm a');
    if (message.uid === currentUserId) {
      userType = 'from-me';
    } else {
      userType = 'from-them';
    }
    domString += `<div class="col-12 text-center ${userType}-message">`;
    domString += `<div class="full-message-div" id="${message.id}">`;
    domString += `<p class="userName">${message.userName}</p>`;
    domString += `<span class="message messageText ${userType}">${message.message}</span>`;
    if (message.uid === currentUserId) {
      domString += `<button id="${message.id}" class="btn btn-outline-primary editMessageBtn hide">Edit</button>`;
      domString += `<button id="${message.id}" class="btn btn-outline-primary saveMessageBtn hide">Save</button>`;
      domString += `<button id="${message.id}" class="btn btn-outline-danger deleteMessageBtn hide">Delete</button>`;
      domString += `<button id="${message.id}" class="btn btn-outline-danger cancelChangeBtn hide">Cancel</button>`;
      domString += `<input type="image" id="${message.id}" class="messageOptionsBtn" src="https://image.flaticon.com/icons/svg/483/483345.svg" alt="See Message Options">`;
    }
    domString += `<p id="${message.id}" class="timestamp hide">${timeToDisplay}</p>`;
    domString += '</div>';
    domString += '</div>';
  });
  domString += '</div>';
  domString += '<div id="messageInputDiv">';
  domString += '<div class="col-12 text-center">';
  domString += '<input id="messageInputField" type="text" placeholder="Type message here"></input>';
  domString += '<button id="messageSubmitBtn" class="btn btn-primary">Submit</button>';
  domString += '</div>';
  domString += '</div>';
  util.printToDom('messages-page', domString);
  addEvents();
  scrollPosition();
  // scrollPosition();
};

const getMessages = () => {
  messagesData.getMessages()
    .then((messages) => {
      usersData.getUsers()
        .then((users) => {
          const finalMessages = smash.messagesWithUserInfo(messages, users);
          messagesBuilder(finalMessages);
        });
    });
};

const messagePageButtonHandlers = () => {
  $('body').on('click', '.messages-nav-button', getMessages);
};

export default { getMessages, messagePageButtonHandlers };
