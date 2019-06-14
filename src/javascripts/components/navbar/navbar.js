import $ from 'jquery';

const navLinks = $('.link');
const pages = $('.page');

const navbarEvents = () => {
  navLinks.on('click', (e) => {
    const target = $(e.target);
    const pageToLoad = (target.data('page'));
    pages.addClass('hide');
    $(`#${pageToLoad}`).removeClass('hide');
  });
};

export default { navbarEvents };
