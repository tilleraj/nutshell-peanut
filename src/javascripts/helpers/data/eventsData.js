import axios from 'axios';
import apiKeys from '../apiKeys.json';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const addEventToDatabase = eventObj => axios.post(`${firebaseUrl}/event.json`, eventObj);
const retrieveEventsByUserId = userId => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/event.json?orderBy="uid"&equalTo="${userId}"`)
    .then((results) => {
      const eventResults = results.data;
      const events = [];
      Object.keys(eventResults).forEach((eventId) => {
        eventResults[eventId].id = eventId;
        events.push(eventResults[eventId]);
      });
      resolve(events);
    })
    .catch(err => reject(err));
});

export default { addEventToDatabase, retrieveEventsByUserId };
