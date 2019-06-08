import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';
import util from '../../helpers/util';
import eventsData from '../../helpers/data/eventsData';
import './events.scss';

const moment = require('moment');

const eventPageDomStringBuilder = (uid) => {
  eventsData.retrieveEventsByUserId(uid)
    .then((events) => {
      const eventsToSort = events;
      eventsToSort.sort((a, b) => {
        // eslint-disable-next-line no-param-reassign
        a = new Date(a.dateTime);
        // eslint-disable-next-line no-param-reassign
        b = new Date(b.dateTime);
        // eslint-disable-next-line no-nested-ternary
        return a < b ? -1 : a > b ? 1 : 0;
      });
      let domstring = '';
      domstring += '<table id="events-table">';
      domstring += '<thead>';
      domstring += '<tr>';
      domstring += '<th colspan="4">Events</th>';
      domstring += '</tr>';
      domstring += '</thead>';
      domstring += '<tbody>';
      eventsToSort.forEach((event) => {
        const displayDate = moment(event.dateTime, 'YYYY[-]MM[-]DD[T]HH[:]mm').format('MMMM Do[,] YYYY');
        const displayTime = moment(event.dateTime, 'YYYY[-]MM[-]DD[T]HH[:]mm').format('h[:]mm a');
        domstring += '<tr>';
        domstring += `<td>${event.title}</td>`;
        domstring += `<td>${displayDate}</td>`;
        domstring += `<td>${displayTime}</td>`;
        domstring += `<td><button type="button" id="${event.id}_edit" class="mr-3 btn btn-info event-edit-button">Edit</button>`;
        domstring += `<button type="button" id="${event.id}_delete" class="btn btn-danger event-delete-button">X</button></td>`;
        domstring += '</tr>';
      });
      domstring += '</tbody>';
      domstring += '</table>';
      util.printToDom('events-list', domstring);
    }).catch(err => console.error('no events to show', err));
};

const showEventPage = () => {
  const uId = firebase.auth().currentUser.uid;
  $('#events-page').removeClass('hide');
  // $('#events-nav-button').addClass('hide');
  eventPageDomStringBuilder(uId);
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
  domstring += '<form id="events-new-form">';
  domstring += '<div class="modal-body">';
  domstring += '<div class="form-group">';
  domstring += '<label for="event-name">Event Name:</label>';
  domstring += '<input type="text" class="form-control" id="event-name" name="event-name" placeholder="Party Party Party" required></input>';
  domstring += '</div>';
  domstring += '<div id="events-date-input" class="form-row">';
  domstring += '<div class="form-group justify-content-center col-md-6">';
  domstring += '<label class="col-md-12" for="event-date">Event Date: </label>';
  domstring += `<input type="date" id="event-date" name="event-date" value="${today}" min="${today}" max="${moment(today).add(3, 'y').format('YYYY[-]MM[-]DD')}" required>`;
  domstring += '</div>';
  domstring += '<div class="form-group justify-content-center col-md-6">';
  domstring += '<label class="col-md-12" for="event-time">Time: </label>';
  domstring += '<input class="justify-self-center" type="time" id="event-time" name="event-time" value="16:20" required></input>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '<div class="modal-footer">';
  domstring += '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
  domstring += '<button type="submit" id="submit-new-event" class="btn btn-primary" data-dismiss="modal">Save changes</button>';
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
  const uId = firebase.auth().currentUser.uid;
  const newDateTime = `${$('#event-date')[0].value}T${$('#event-time')[0].value}`;
  const newEvent = {
    title: $('#event-name')[0].value,
    dateTime: newDateTime,
    uid: uId,
  };
  eventsData.addEventToDatabase(newEvent)
    .then(() => {
      eventPageDomStringBuilder(uId);
      $('#event-name')[0].value = '';
      $('#event-time')[0].value = '16:20';
      $('#event-date')[0].value = moment().format('YYYY[-]MM[-]DD');
    })
    .catch(err => console.error('wont add event', err));
};

const eventPageButtonHandlers = () => {
  $('#events-nav-button').on('click', showEventPage);
  $('#events-page').on('click', '#submit-new-event', addEventToDatabase);
};

export default { eventPageButtonHandlers };
