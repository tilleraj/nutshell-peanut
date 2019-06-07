import 'bootstrap';
import '../styles/main.scss';
import eventsPage from './components/events/events';

const init = () => {
  eventsPage.eventPageButtonHandlers();
  console.error('yo yo');
};

init();
