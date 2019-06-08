import firebase from 'firebase/app';
import 'firebase/auth';

import $ from 'jquery';

import util from '../../helpers/util';
import entriesData from '../../helpers/data/entriesData';

const entriesBuilder = () => {
  // below jquery selectors will be removed after testing branch
  $('#diary-page').removeClass('hide');
  // $('#diary-nav-button').addClass('hide');
  entriesData.getEntries(firebase.auth().currentUser.uid)
    .then((entriesArray) => {
      let domString = '<div class="row d-flex justify-content-center">';
      domString += '<button id="addNewEntryButton" class="btn btn-secondary mt-3 mb-3 col-4 col-md-3 col-lg-2">Add a New Entry</button>';
      domString += '</div>';
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

const addEntryToDOM = () => {
  let newEntry = '';
  newEntry += '<div class="row d-flex justify-content-center">';
  newEntry += '<div class="col-12 col-md-10 col-lg-8 text-center">';
  newEntry += '<div class="card mb-2">';
  newEntry += '<h2 class="editable">header</h2>';
  newEntry += '<h4 class="editable">header</h4>';
  newEntry += '<p class="editable">paragraph</p>';
  newEntry += '</div>';
  newEntry += '</div>';
  newEntry += '</div>';
  util.printToDom('diary-page', newEntry);
};

const entryPageButtonHandlers = () => {
  document.getElementById('diary-nav-button').addEventListener('click', entriesBuilder);
  $('body').on('click', '#addNewEntryButton', addEntryToDOM);
};

export default { entryPageButtonHandlers };
