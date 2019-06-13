import axios from 'axios';
import apiKeys from '../apiKeys.json';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const getMessages = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/message.json`)
    .then((resp) => {
      const messageResults = resp.data;
      const messages = [];
      Object.keys(messageResults).forEach((messageId) => {
        messageResults[messageId].id = messageId;
        messages.push(messageResults[messageId]);
      });
      resolve(messages);
    })
    .catch(err => reject(err));
});

const getMessagesByUid = userId => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/message.json?orderBy="uid"&equalTo="${userId}"`)
    .then((results) => {
      const messageResults = results.data;
      const messages = [];
      Object.keys(messageResults).forEach((messageId) => {
        messageResults[messageId].id = messageId;
        messages.push(messageResults[messageId]);
      });
      resolve(messages);
    })
    .catch(err => reject(err));
});

const addMessageToDatabase = messageObj => axios.post(`${firebaseUrl}/message.json`, messageObj);

const editMessageInDatabase = (newMessageObj, messageId) => axios.put(`${firebaseUrl}/message/${messageId}.json`, newMessageObj);

const deleteMessageFromDatabase = messageId => axios.delete(`${firebaseUrl}/message/${messageId}.json`);

export default {
  addMessageToDatabase,
  getMessages,
  editMessageInDatabase,
  deleteMessageFromDatabase,
  getMessagesByUid,
};
