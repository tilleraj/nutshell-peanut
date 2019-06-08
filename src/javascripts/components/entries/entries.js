import firebase from 'firebase/app';
import 'firebase/auth';

import $ from 'jquery';

import util from '../../helpers/util';
import entriesData from '../../helpers/data/entriesData';

const entriesBuilder = () => {
  // $('#diary-page').removeClass('hide');
  // $('#diary-nav-button').addClass('hide');
  entriesData.getEntries(firebase.auth().currentUser.uid)
    .then((entriesArray) => {
      let domString = '';
      entriesArray.forEach((entry) => {
        domString += '<div class="row d-flex justify-content-center">';
        domString += '<div class="col-12 col-md-10 col-lg-8 text-center">';
        domString += `<div id="${entry.id}" class="card mb-2">`;
        domString += `<h2>${entry.title}</h2>`;
        domString += `<h4>${entry.date}</h4>`;
        domString += `<p>${entry.entry}</p>`;
        domString += '</div>';
        domString += '</div>';
        domString += '</div>';
      });
      util.printToDom('diary-page', domString);
    })
    .catch(err => console.error(err, 'pal your crap is broken'));
};

const entryPageButtonHandlers = () => {
  document.getElementById('diary-nav-button').addEventListener('click', entriesBuilder);
};

export default { entryPageButtonHandlers };
