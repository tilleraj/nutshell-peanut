import axios from 'axios';
import apiKeys from '../apiKeys.json';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const addEventToDatabase = eventObj => axios.post(`${firebaseUrl}/event.json`, eventObj);

export default { addEventToDatabase };
