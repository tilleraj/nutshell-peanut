import axios from 'axios';
import apiKeys from '../apiKeys.json';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const getUsers = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/user.json`)
    .then((resp) => {
      const userResults = resp.data;
      const users = [];
      Object.keys(userResults).forEach((uid) => {
        users.push(userResults[uid]);
      });
      resolve(users);
    })
    .catch(err => reject(err));
});

const addUserToDatabase = userObj => axios.post(`${firebaseUrl}/user.json`, userObj);

export default { addUserToDatabase, getUsers };
