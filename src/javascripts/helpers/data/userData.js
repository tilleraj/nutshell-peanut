import axios from 'axios';
import apiKeys from '../apiKeys.json';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const addUserToDatabase = userObj => axios.post(`${firebaseUrl}/user.json`, userObj);
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

export default { addUserToDatabase, getUserInfoByUserId };
