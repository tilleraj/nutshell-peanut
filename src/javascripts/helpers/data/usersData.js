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

const getUserInfoByUserId = userId => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/user.json?orderBy="uid"&equalTo="${userId}"`)
    .then((resp) => {
      const user = resp.data;
      const userArray = [];
      Object.keys(user).forEach((usersId) => {
        user[usersId].id = usersId;
        userArray.push(user[usersId]);
      });
      resolve(userArray);
    })
    .catch(err => reject(err));
});

const addUserToDatabase = userObj => axios.post(`${firebaseUrl}/user.json`, userObj);

const deleteUserFromDatabase = userId => axios.delete(`${firebaseUrl}/user/${userId}.json`);

const editUsersInfo = (userId, userObj) => axios.put(`${firebaseUrl}/user/${userId}.json`, userObj);

export default {
  addUserToDatabase,
  getUsers,
  getUserInfoByUserId,
  deleteUserFromDatabase,
  editUsersInfo,
};
