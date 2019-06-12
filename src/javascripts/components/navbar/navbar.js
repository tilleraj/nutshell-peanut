const dashBoardPage = document.getElementById('dashboard-page');
const messagesPage = document.getElementById('messages-page');
const newsPage = document.getElementById('news-page');
const eventsPage = document.getElementById('events-page');
const diaryPage = document.getElementById('diary-page');

const navbarEvents = () => {
  const navLinks = document.getElementsByClassName('nav-link');
  for (let i = 0; i < navLinks.length; i += 1) {
    navLinks[i].addEventListener('click', (e) => {
      if (e.target.id === 'dashboard-nav-button') {
        dashBoardPage.classList.remove('hide');
        messagesPage.classList.add('hide');
        newsPage.classList.add('hide');
        eventsPage.classList.add('hide');
        diaryPage.classList.add('hide');
      } else if (e.target.id === 'messages-nav-button') {
        dashBoardPage.classList.add('hide');
        messagesPage.classList.remove('hide');
        newsPage.classList.add('hide');
        eventsPage.classList.add('hide');
        diaryPage.classList.add('hide');
      } else if (e.target.id === 'news-nav-button') {
        dashBoardPage.classList.add('hide');
        messagesPage.classList.add('hide');
        newsPage.classList.remove('hide');
        eventsPage.classList.add('hide');
        diaryPage.classList.add('hide');
      } else if (e.target.id === 'events-nav-button') {
        dashBoardPage.classList.add('hide');
        messagesPage.classList.add('hide');
        newsPage.classList.add('hide');
        eventsPage.classList.remove('hide');
        diaryPage.classList.add('hide');
      } else if (e.target.id === 'diary-nav-button') {
        dashBoardPage.classList.add('hide');
        messagesPage.classList.add('hide');
        newsPage.classList.add('hide');
        eventsPage.classList.add('hide');
        diaryPage.classList.remove('hide');
      }
    });
  }
};

export default { navbarEvents };
