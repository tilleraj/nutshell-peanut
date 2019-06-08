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

const addMessageToDatabase = messageObj => axios.post(`${firebaseUrl}/message.json`, messageObj);

export default { addMessageToDatabase, getMessages };
