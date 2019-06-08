import './dashboard.scss';
import $ from 'jquery';
import util from '../../helpers/util';

const dashBoardPage = $('#dashboard-page');
const messagesPage = $('#messages-page');
const newsPage = $('#news-page');
const eventsPage = $('#events-page');
const diaryPage = $('#diary-page');

const eventListeners = () => {
  $('.dashboard-link').click((e) => {
    if (e.target.closest('.card').id === 'eventsCard') {
      dashBoardPage.addClass('hide');
      eventsPage.removeClass('hide');
    } else if (e.target.closest('.card').id === 'messagesCard') {
      dashBoardPage.addClass('hide');
      messagesPage.removeClass('hide');
    } else if (e.target.closest('.card').id === 'diaryCard') {
      dashBoardPage.addClass('hide');
      diaryPage.removeClass('hide');
    } else if (e.target.closest('.card').id === 'newsCard') {
      dashBoardPage.addClass('hide');
      newsPage.removeClass('hide');
    }
  });
};

const drawDashbaord = () => {
  let domString = '';
  domString += '<div class="container mt-4">';
  domString += '<div class="row">';
  domString += '  <div class="d-flex justify-content-around flex-wrap col-12 col-sm-10 offset-sm-1" id="dashboard-cards">';
  domString += '    <div class="card" id="eventsCard">';
  domString += '      <div class="dashboard-img-contain">';
  domString += '        <a class="dashboard-link" href="#">';
  domString += '          <img class="img-fluid dashboard-img" src="../assets/images/dashboard/events.png" alt="">';
  domString += '        </a>';
  domString += '      </div>';
  domString += '      <div class="card-body text-center">';
  domString += '        <a class="dashboard-link" href="#">';
  domString += '          <h5 class="card-title">Events</h5>';
  domString += '        </a>';
  domString += '      </div>';
  domString += '    </div>';
  domString += '    <div class="card" id="messagesCard">';
  domString += '      <div class="dashboard-img-contain">';
  domString += '        <a class="dashboard-link" href="#">';
  domString += '          <img class="img-fluid dashboard-img" src="../assets/images/dashboard/messages.jpg" alt="">';
  domString += '        </a>';
  domString += '      </div>';
  domString += '      <div class="card-body text-center">';
  domString += '        <a class="dashboard-link" href="#">';
  domString += '          <h5 class="card-title">Messages</h5>';
  domString += '        </a>';
  domString += '      </div>';
  domString += '    </div>';
  domString += '    <div class="card" id="diaryCard">';
  domString += '      <div class="dashboard-img-contain">';
  domString += '        <a class="dashboard-link" href="#">';
  domString += '          <img class="img-fluid dashboard-img" src="../assets/images/dashboard/diary.png" alt="">';
  domString += '        </a>';
  domString += '      </div>';
  domString += '      <div class="card-body text-center">';
  domString += '        <a class="dashboard-link" href="#">';
  domString += '          <h5 class="card-title">Diary</h5>';
  domString += '        </a>';
  domString += '      </div>';
  domString += '    </div>';
  domString += '    <div class="card" id="newsCard">';
  domString += '      <div class="dashboard-img-contain">';
  domString += '        <a class="dashboard-link" href="#">';
  domString += '          <img class="img-fluid dashboard-img" src="../assets/images/dashboard/news.jpg" alt="">';
  domString += '        </a>';
  domString += '      </div>';
  domString += '      <div class="card-body text-center">';
  domString += '        <a class="dashboard-link" href="#">';
  domString += '          <h5 class="card-title">News</h5>';
  domString += '        </a>';
  domString += '      </div>';
  domString += '    </div>';
  domString += '  </div>';
  domString += '</div>';
  domString += '</div>';
  util.printToDom('dashboard-page', domString);
  eventListeners();
};

export default { drawDashbaord };
