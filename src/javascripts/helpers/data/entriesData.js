import axios from 'axios';

import apiKeys from '../apiKeys.json';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const getEntries = uid => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/entry.json?orderBy="uid"&equalTo="${uid}"`)
    .then((resp) => {
      const entryResults = resp.data;
      const entries = [];
      Object.keys(entryResults).forEach((entryId) => {
        entryResults[entryId].id = entryId;
        entries.push(entryResults[entryId]);
      });
      resolve(entries);
    })
    .catch(err => reject(err));
});

const removeEntryFromDatabase = entryId => axios.delete(`${firebaseUrl}/entry/${entryId}.json`);

const addEntryToDatabase = entryObj => axios.post(`${firebaseUrl}/entry.json`, entryObj);

const editEntryOnDatabase = (newEntryObj, entryId) => axios.put(`${firebaseUrl}/entry/${entryId}.json`, newEntryObj);

export default {
  getEntries,
  addEntryToDatabase,
  removeEntryFromDatabase,
  editEntryOnDatabase,
};
