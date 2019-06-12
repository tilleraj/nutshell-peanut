import firebase from 'firebase/app';
import 'firebase/auth';

import $ from 'jquery';
import moment from 'moment';

import util from '../../helpers/util';
import entriesData from '../../helpers/data/entriesData';
// import moment = require('moment');

let userEntries = [];

const setUserEntries = (newArray) => {
  userEntries = [...newArray];
};

const entriesBuilder = () => {
  // below jquery selectors will be removed after testing branch
  $('#diary-page').removeClass('hide');
  // $('#diary-nav-button').addClass('hide');
  entriesData.getEntries(firebase.auth().currentUser.uid)
    .then((entriesArray) => {
      const entriesToSort = entriesArray;
      setUserEntries(entriesArray);
      entriesToSort.sort((a, b) => {
        const dateA = a.date;
        const dateB = b.date;
        // eslint-disable-next-line no-nested-ternary
        return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
      });
      let domString = '<div id="diary-container" class="container">';
      domString += '<div id="newDiary" class="row d-flex justify-content-center"></div>';
      domString += '<div class="row d-flex justify-content-center">';
      domString += '<button id="addNewEntryButton" class="btn btn-secondary mt-3 mb-3 col-4 col-md-3 col-lg-2">Add a New Entry</button>';
      domString += '</div>';
      entriesToSort.forEach((entry) => {
        domString += '<div class="row d-flex justify-content-center">';
        domString += '<div class="col-12 col-md-10 col-lg-8 text-center">';
        domString += `<div id="${entry.id}" class="card mb-2">`;
        domString += `<h2>${entry.title}</h2>`;
        domString += `<h4>${moment(entry.date, 'YYYY[-]MM[-]DD[T]HH[:]mm').format('MMMM Do[,] YYYY')}</h4>`;
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
  $(targetedEntry).addClass('editEntryTarget');
  console.error(targetedEntry);
  const title = $(targetedEntry).find('h2');
  // const date = $(targetedEntry).find('h4');
  const entry = $(targetedEntry).find('p');
  title.addClass('editable');
  title.attr('contenteditable', 'true');
  // date.innerHTML = moment.creea
  entry.addClass('editable');
  entry.attr('contenteditable', 'true');
  $(targetedEntry).find('.saveEntryButton').removeClass('hide');
  $(targetedEntry).find('.cancelEntryButton').removeClass('hide');
  $(targetedEntry).find('.editEntryButton').addClass('hide');
  $(targetedEntry).find('.deleteEntryButton').addClass('hide');
  // date.innerHTML = moment().format()
  title.focus();
};

const updateEntryToDatabase = () => {
  const target = $('.editEntryTarget')[0];
  const targetId = target.id;
  const originalEntryObject = userEntries.filter(entry => entry.id === targetId);
  console.error('look here pal!!!!', originalEntryObject);
  const updatedObject = {
    date: originalEntryObject[0].date,
    entry: $(target).find('p')[0].innerHTML,
    title: $(target).find('h2')[0].innerHTML,
    uid: firebase.auth().currentUser.uid,
  };
  console.error(updatedObject);
  $(target).removeClass('editEntryTarget');
  entriesData.editEntryOnDatabase(updatedObject, targetId)
    .then(() => {
      entriesBuilder();
    })
    .catch(err => console.error(err));
};

const addEntryToDOM = () => {
  let newEntry = '';
  newEntry += '<div class="col-12 col-md-10 col-lg-8 text-center">';
  newEntry += '<div class="card mb-4">';
  newEntry += '<h2 id="newDiaryTitle" class="editable" contenteditable="true">Entry Title</h2>';
  newEntry += '<p id="newDiaryEntry" class="editable" contenteditable="true">Write Your Entry Here</p>';
  newEntry += '<div class="d-flex justify-content-end">';
  newEntry += '<button id="addNewEntry" class="btn btn-primary col-2">Save</button>';
  newEntry += '<button id="cancelNewEntry" class="btn btn-danger col-2">Cancel</button>';
  newEntry += '</div>';
  newEntry += '</div>';
  newEntry += '</div>';
  newEntry += '</div>';
  util.printToDom('newDiary', newEntry);
  document.getElementById('newDiaryTitle').focus();
  $('#addNewEntryButton').addClass('hide');
};

// Start here you are getting ready to build object so you can add new diary to database
const addEntryToDatabase = () => {
  const usr = firebase.auth().currentUser.uid;
  const newEntryObject = {
    // date: document.getElementById('newDiaryDate').textContent,
    date: moment().format('YYYY[-]MM[-]DD[T]HH[:]mm'),
    title: document.getElementById('newDiaryTitle').textContent,
    entry: document.getElementById('newDiaryEntry').textContent,
    uid: usr,
  };
  entriesData.addEntryToDatabase(newEntryObject)
    .then(() => {
      entriesBuilder();
    })
    .catch(err => console.error(err, 'bad'));
};

const entryPageButtonHandlers = () => {
  document.getElementById('diary-nav-button').addEventListener('click', entriesBuilder);
  $('body').on('click', '.editEntryButton', updateEntryToDom);
  $('body').on('click', '#addNewEntryButton', addEntryToDOM);
  $('body').on('click', '#cancelNewEntry', entriesBuilder);
  $('body').on('click', '.cancelEntryButton', entriesBuilder);
  $('body').on('click', '#addNewEntry', addEntryToDatabase);
  $('body').on('click', '.saveEntryButton', updateEntryToDatabase);
};

export default { entryPageButtonHandlers };
