// import firebase from 'firebase/app';
// import 'firebase/auth';
// import axios from 'axios';
import $ from 'jquery';
import util from '../../helpers/util';

// import apiKeys from '../../helpers/apiKeys.json';

// const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const showEventPage = () => {
  $('#events-page').removeClass('hide');
  $('#event-button').addClass('hide');
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
  domstring += '<div class="modal-body">';
  domstring += '<label for="event-date">Event Date:</label>';
  domstring += '<input type="date" id="event-date" name="event-date" value="2018-07-22" min="2018-01-01" max="2018-12-31">';
  domstring += '</div>';
  domstring += '<div class="modal-footer">';
  domstring += '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
  domstring += '<button type="button" class="btn btn-primary">Save changes</button>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '<div id="events-list"></div>';
  util.printToDom('events-page', domstring);
};

// const addEventToDatabase = (e) => {

// };

const eventPageButtonHandlers = () => {
  $('#event-button').on('click', showEventPage);
};

export default { eventPageButtonHandlers };
