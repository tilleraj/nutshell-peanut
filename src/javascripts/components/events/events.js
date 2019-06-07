// import firebase from 'firebase/app';
// import 'firebase/auth';
// import axios from 'axios';
import $ from 'jquery';
import util from '../../helpers/util';

// import apiKeys from '../../helpers/apiKeys.json';

// const firebaseUrl = apiKeys.firebaseKeys.databaseURL;

const showEventPage = () => {
  $('#events-page').removeClass('hide');
  $('#event-button').addClass('hide');
  let domstring = '<button id="add-event-button" class="btn btn-success">Add Event</button>';
  domstring += '<div id="events-list">';
  util.printToDom('events-page', domstring);
};

// const addEventToDatabase = (e) => {

// };

const eventPageButtonHandlers = () => {
  $('#event-button').on('click', showEventPage);
};

export default { eventPageButtonHandlers };
