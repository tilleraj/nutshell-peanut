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
        const aDate = a.dateTime;
        const bDate = b.dateTime;
        // eslint-disable-next-line no-nested-ternary
        return aDate < bDate ? -1 : aDate > bDate ? 1 : 0;
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
        domstring += `<td id="event-title">${event.title}</td>`;
        domstring += `<td id="event-date">${displayDate}</td>`;
        domstring += `<td id="event-time">${displayTime}</td>`;
        domstring += `<td><button type="button" id="edit_${event.id}" data-toggle="modal"`;
        domstring += `data-eventid="${event.id}" data-purpose="Edit" data-target="#eventModal" class="mr-3 btn btn-info event-edit-button">Edit</button>`;
        domstring += `<button type="button" id="delete_${event.id}" class="btn btn-danger event-delete-button">X</button></td>`;
        domstring += '</tr>';
      });
      domstring += '</tbody>';
      domstring += '</table>';
      util.printToDom('events-list', domstring);
    }).catch(err => console.error('no events to show', err));
};

const showEventPage = () => {
  const uId = firebase.auth().currentUser.uid;
  eventPageDomStringBuilder(uId);
  const today = moment().format('YYYY[-]MM[-]DD');
  let domstring = '<button id="add-event-button" class="btn btn-success" data-eventid="submit-new-event" data-toggle="modal" data-target="#eventModal" data-purpose="Add">Add Event</button>';
  domstring += '<div class="modal fade" id="eventModal" tabindex="-1" role="dialog" aria-labelledby="eventModalLabel" aria-hidden="true">';
  domstring += '<div class="modal-dialog" role="document">';
  domstring += '<div class="modal-content">';
  domstring += '<div class="modal-header">';
  domstring += '<h5 class="modal-title" id="eventModalLabel"></h5>';
  domstring += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
  domstring += '<span aria-hidden="true">&times;</span>';
  domstring += '</button>';
  domstring += '</div>';
  domstring += '<form id="">';
  domstring += '<div class="modal-body" id="">';
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
  domstring += '<button type="submit" id="" class="btn btn-primary change-button">Save changes</button>';
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
  $('#eventModal').modal('hide');
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

const deleteEventFromDatabase = (e) => {
  const userId = firebase.auth().currentUser.uid;
  const eventId = e.target.id.split(/_(.+)/)[1];
  eventsData.removeEventFromDatabaseByEventId(eventId)
    .then(() => {
      eventPageDomStringBuilder(userId);
    })
    .catch(err => console.error('problem deleting event', err));
};

const editEventFromDatabase = (e) => {
  e.preventDefault();
  e.stopPropagation();
  $('#eventModal').modal('hide');
  const userId = firebase.auth().currentUser.uid;
  const eventId = e.currentTarget.firstElementChild.id;
  const newDateTime = `${$('#event-date')[0].value}T${$('#event-time')[0].value}`;
  const newEventObj = {
    title: $('#event-name')[0].value,
    dateTime: newDateTime,
    uid: userId,
  };
  eventsData.editEventOnDatabase(newEventObj, eventId)
    .then(() => {
      eventPageDomStringBuilder(userId);
    })
    .catch(err => console.error('problem editing event', err));
};

const addOrEditModalDisplay = (e) => {
  const button = $(e.relatedTarget);
  const modalPurpose = button.data('purpose');
  let eventName = '';
  let eventTime = '16:20';
  let eventDate = moment().format('YYYY[-]MM[-]DD');
  const eventId = button.data('eventid');
  if (modalPurpose === 'Edit') {
    eventName = button.parent().prev().prev().prev()
      .text();
    eventTime = button.parent().prev().text();
    eventDate = button.parent().prev().prev().text();
    eventDate = moment(eventDate, 'MMMM Do[,] YYYY').format('YYYY[-]MM[-]DD');
    eventTime = moment(eventTime, 'h[:]mm a').format('HH[:]mm');
  }
  const modal = $('#eventModal');
  modal.find('.modal-title').text(`${modalPurpose} an Event`);
  modal.find('#event-name').val(eventName);
  modal.find('#event-date').val(eventDate);
  modal.find('#event-time').val(eventTime);
  modal.find('.change-button').text(`Save ${modalPurpose}ed Event`);
  modal.find('.modal-body').attr('id', eventId);
  modal.find('.change-button').addClass(modalPurpose);
  modal.find('form').attr('id', modalPurpose);
};

const eventPageButtonHandlers = () => {
  $('#events-nav-button').on('click', showEventPage);
  $('#events-page').on('show.bs.modal', '#eventModal', addOrEditModalDisplay);
  $('#events-page').on('submit', '#Add', addEventToDatabase);
  $('#events-page').on('click', '.event-delete-button', deleteEventFromDatabase);
  $('#events-page').on('submit', '#Edit', editEventFromDatabase);
};

export default { eventPageButtonHandlers };
