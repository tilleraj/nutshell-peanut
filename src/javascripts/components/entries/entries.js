import firebase from 'firebase/app';
import 'firebase/auth';

import $ from 'jquery';
// import moment from 'moment';

import util from '../../helpers/util';
import entriesData from '../../helpers/data/entriesData';
// import moment = require('moment');

const entriesBuilder = () => {
  // below jquery selectors will be removed after testing branch
  $('#diary-page').removeClass('hide');
  // $('#diary-nav-button').addClass('hide');
  entriesData.getEntries(firebase.auth().currentUser.uid)
    .then((entriesArray) => {
      let domString = '';
      domString += '<div class="container">';
      entriesArray.forEach((entry) => {
        domString += '<div class="row d-flex justify-content-center">';
        domString += '<div class="col-12 col-md-10 col-lg-8 text-center">';
        domString += `<div id="${entry.id}" class="card mb-2">`;
        domString += `<h2>${entry.title}</h2>`;
        domString += `<h4>${entry.date}</h4>`;
        domString += `<p>${entry.entry}</p>`;
        domString += '<div class="d-flex justify-content-end">';
        domString += '<button class="btn btn-primary col-2 saveEntryButton hide">Save</button>';
        domString += '<button class="btn btn-primary col-2 editEntryButton">Edit</button>';
        domString += '<button class="btn btn-danger col-2 deleteEntryButton">Delete</button>';
        domString += '<button class="btn btn-danger col-2 cancelEntryButton hide">Cancel</button>';
        domString += '</div>';
        domString += '</div>';
        domString += '</div>';
        domString += '</div>';
      });
      domString += '</div>';
      util.printToDom('diary-page', domString);
    })
    .catch(err => console.error(err, 'pal your crap is broken'));
};

const updateEntryToDom = (e) => {
  const targetedEntry = e.target.parentNode.parentNode;
  console.error(targetedEntry);
  const title = $(targetedEntry).find('h2');
  // const date = $(targetedEntry).find('h4');
  const entry = $(targetedEntry).find('p');
  title.addClass('editable');
  title.attr('contenteditable', 'true');
  // date.innerHTML = moment.creea
  entry.find('p').addClass('editable');
  entry.find('p').attr('contenteditable', 'true');
  $(targetedEntry).find('.saveEntryButton').removeClass('hide');
  $(targetedEntry).find('.cancelEntryButton').removeClass('hide');
  $(targetedEntry).find('.editEntryButton').addClass('hide');
  $(targetedEntry).find('.deleteEntryButton').addClass('hide');
  // date.innerHTML = moment().format()
  title.focus();
};

const entryPageButtonHandlers = () => {
  document.getElementById('diary-nav-button').addEventListener('click', entriesBuilder);
  $('body').on('click', '.editEntryButton', updateEntryToDom);
};

export default { entryPageButtonHandlers };
