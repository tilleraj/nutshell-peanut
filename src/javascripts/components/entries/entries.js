import firebase from 'firebase/app';
import 'firebase/auth';

import entriesData from '../../helpers/data/entriesData';

const entriesBuilder = () => {
  entriesData.getEntries(firebase.auth().currentUser.uid)
    .then((entriesArray) => {
      let domString = '';
      entriesArray.forEach((entry) => {
        domString += '<div class="col">';
        domString += `<div id="${entry.id}"class="card">`;
        domString += '</div>';
      })
    })
    .catch(err => console.error(err, 'pal you crap is broken'));
};

const entriesEvent = () => {
  document.getElementById('navbar-button-watchlist').addEventListener('click', entriesBuilder);
};

export default { entriesEvent };
