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
      let domString = '<div id="diary-container" class="container">';
      domString += '<div id="newDiaryEntry" class="row d-flex justify-content-center"></div>';
      domString += '<div class="row d-flex justify-content-center">';
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
      domString += '</div>';
      util.printToDom('diary-page', domString);
    })
    .catch(err => console.error(err, 'pal your crap is broken'));
};

const addEntryToDOM = () => {
  let newEntry = '';
  newEntry += '<div class="col-12 col-md-10 col-lg-8 text-center">';
  newEntry += '<div class="card mb-4">';
  newEntry += '<h2 id="newDiaryTitle" class="editable" contenteditable="true">Entry Title</h2>';
  newEntry += '<h4 class="editable" contenteditable="true">Entry Date</h4>';
  newEntry += '<p class="editable" contenteditable="true">Write Your Entry Here</p>';
  newEntry += '<div class="d-flex justify-content-end">';
  newEntry += '<button id="addNewEntry" class="btn btn-primary col-2">Save</button>';
  newEntry += '<button id="cancelNewEntry" class="btn btn-danger col-2">Cancel</button>';
  newEntry += '</div>';
  newEntry += '</div>';
  newEntry += '</div>';
  newEntry += '</div>';
  util.printToDom('newDiaryEntry', newEntry);
  document.getElementById('newDiaryTitle').focus();
  $('#addNewEntryButton').addClass('hide');
};

// Start here you are getting ready to build object so you can add new diary to database
// const addEntryToDatabase = () => {

// };

const entryPageButtonHandlers = () => {
  document.getElementById('diary-nav-button').addEventListener('click', entriesBuilder);
  $('body').on('click', '#addNewEntryButton', addEntryToDOM);
  $('body').on('click', '#cancelNewEntry', entriesBuilder);
  // $('body').on('click', '#addNewEntry', addEntryToDatabase);
};

export default { entryPageButtonHandlers };
