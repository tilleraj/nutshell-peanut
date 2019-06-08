import axios from 'axios';

import apiKeys from '../apiKeys.json';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

// this is the original movie array
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

export default { getEntries };
