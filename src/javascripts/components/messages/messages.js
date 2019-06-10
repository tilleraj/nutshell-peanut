import firebase from 'firebase/app';
import 'firebase/auth';
import './messages.scss';

import util from '../../helpers/util';
import messagesData from '../../helpers/data/messagesData';
import usersData from '../../helpers/data/usersData';
import smash from '../../helpers/smash';

// const moment = require('moment');

const addMessage = (e) => {
  e.preventDefault();
  const newMessage = {
    uid: firebase.auth().currentUser.uid,
    message: document.getElementById('messageInputField').value,
    // timestamp:
  };
  messagesData.addMessageToDatabase(newMessage)
    .then(() => {
      document.getElementById('messageInputField').value = '';
    })
    .catch(err => console.error('no new message added', err));
};

const addEvents = () => {
  const timestamps = document.getElementsByClassName('full-message-div');
  const timestampsArray = Array.from(timestamps);
  timestampsArray.forEach((timestamp) => {
    timestamp.addEventListener('mouseover', timestamp.classList.remove('hide'));
  });
  document.getElementById('messageSubmitBtn').addEventListener('click', addMessage);
};

const messagesBuilder = (messagesArray) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const currentUserId = firebase.auth().currentUser.uid;
      let userType = '';
      let domString = '';
      domString += '<div id="messageBoard">';
      messagesArray.forEach((message) => {
        if (message.uid === currentUserId) {
          userType = 'from-me';
        } else {
          userType = 'from-them';
        }
        domString += '<div class="col-12 text-center">';
        domString += `<div class="full-message-div ${userType}-message" id="${message.id}">`;
        domString += `<p class="userName">${message.userName}</p>`;
        domString += `<p class="message ${userType}">${message.message}</p>`;
        domString += `<p class="timestamp hide">${message.timestamp}</p>`;
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
    } else {
      console.error('not logged in');
    }
  });
};

const getMessages = () => {
  messagesData.getMessages()
    .then((messages) => {
      usersData.getUsers()
        .then((users) => {
          const finalMessages = smash.messagesWithUserInfo(messages, users);
          console.error('smashed messages', finalMessages);
          messagesBuilder(finalMessages);
        });
    });
};

export default { getMessages };
