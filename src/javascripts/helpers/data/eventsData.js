import axios from 'axios';
import apiKeys from '../apiKeys.json';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const addEventToDatabase = eventObj => axios.post(`${firebaseUrl}/event.json`, eventObj);
const retrieveEventsByUserId = userId => axios.get(`${firebaseUrl}/event.json?orderBy="uid"&equalTo="${userId}"`);

export default { addEventToDatabase, retrieveEventsByUserId };
