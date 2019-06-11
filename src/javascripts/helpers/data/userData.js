import axios from 'axios';
import apiKeys from '../apiKeys.json';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const addUserToDatabase = userObj => axios.post(`${firebaseUrl}/user.json`, userObj);

export default { addUserToDatabase };
