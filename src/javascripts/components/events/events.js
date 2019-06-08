// import firebase from 'firebase/app';
// import 'firebase/auth';
// import axios from 'axios';
import $ from 'jquery';
import util from '../../helpers/util';

const moment = require('moment');

// import apiKeys from '../../helpers/apiKeys.json';

// const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const showEventPage = () => {
  $('#events-page').removeClass('hide');
  $('#event-button').addClass('hide');
  const today = moment().format('YYYY[-]MM[-]DD');
  let domstring = '<button id="add-event-button" class="btn btn-success" data-toggle="modal" data-target="#addAnEventModal">Add Event</button>';
  domstring += '<div class="modal fade" id="addAnEventModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';
  domstring += '<div class="modal-dialog" role="document">';
  domstring += '<div class="modal-content">';
  domstring += '<div class="modal-header">';
  domstring += '<h5 class="modal-title" id="addEventModalLabel">Add an Event</h5>';
  domstring += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
  domstring += '<span aria-hidden="true">&times;</span>';
  domstring += '</button>';
  domstring += '</div>';
  domstring += '<form>';
  domstring += '<div class="modal-body">';
  domstring += '<label for="event-name">Event Name:</label>';
  domstring += '<input type="text" id="event-name" name="event-name" required></input>';
  domstring += '<label for="event-date">Event Date:</label>';
  domstring += `<input type="date" id="event-date" name="event-date" value="${today}" min="${today}" max="${moment(today).add(3, 'y').format('YYYY[-]MM[-]DD')}" required>`;
  domstring += '<label for="event-time">Time:</label>';
  domstring += '<input type="time" id="event-time" name="event-time" required></input>';
  domstring += '</div>';
  domstring += '<div class="modal-footer">';
  domstring += '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
  domstring += '<button type="submit" id="submit-new-event" class="btn btn-primary">Save changes</button>';
  domstring += '</div>';
  domstring += '</form>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '<div id="events-list"></div>';
  util.printToDom('events-page', domstring);
};

const addEventToDatabase = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const newEvent = {
    title: $('#event-name')[0].value,
    time: $('#event-time')[0].value,
  };
  console.error('new Date', $('#event-date')[0].value);
  console.error('new TIme', $('#event-time')[0].value);
  console.error(newEvent);
};

const eventPageButtonHandlers = () => {
  $('#event-button').on('click', showEventPage);
  $('#events-page').on('click', '#submit-new-event', addEventToDatabase);
};

export default { eventPageButtonHandlers };
