import firebase from 'firebase/app';
import 'firebase/auth';
import './messages.scss';

import util from '../../helpers/util';
import messagesData from '../../helpers/data/messagesData';

const messagesBuilder = () => {
  const currentUserId = firebase.auth().currentUser.uid;
  console.error(currentUserId);
  messagesData.getMessages(firebase.auth().currentUser.uid)
    .then((entriesArray) => {
      let userType = '';
      let domString = '';
      domString += '<div id="messageBoard">';
      entriesArray.forEach((message) => {
        if (message.uid === currentUserId) {
          userType = 'from-me';
        } else {
          userType = 'from-them';
        }
        domString += '<div class="col-12 text-center">';
        domString += `<div class="full-message-div ${userType}-message" id="${message.id}">`;
        // domString += `<p>${message.uid}</p>`;
        domString += `<p class="userName">${message.uid}</p>`;
        domString += `<p class="message ${userType}">${message.message}</p>`;
        // domString += `<p>${message.timestamp}</p>`;
        domString += '</div>';
        domString += '</div>';
      });
      domString += '</div>';
      util.printToDom('messages-page', domString);
    })
    .catch(err => console.error(err, 'messages not working'));
};

const messagePageButtonHandlers = () => {
  document.getElementById('messages-nav-button').addEventListener('click', messagesBuilder);
};

export default { messagePageButtonHandlers };
