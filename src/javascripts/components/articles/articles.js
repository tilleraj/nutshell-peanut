import firebase from 'firebase/app';
import 'firebase/auth';

// import $ from 'jquery';

import util from '../../helpers/util';
import articlesData from '../../helpers/data/articlesData';
import './articles.scss';

const articlesBuilder = () => {
  articlesData.getArticlesByUserId(firebase.auth().currentUser.uid)
    .then((articlesArray) => {
      let domString = '';
      domString += '<div class="container mt-4">';
      articlesArray.forEach((article) => {
        domString += '<div class="row d-flex justify-content-center">';
        domString += '  <div class="col-12 col-md-10 col-lg-8 text-center">';
        domString += `    <div id="${article.id}" class="card">`;
        domString += `      <h2>${article.title}</h2>`;
        domString += `      <h4>${article.synopsis}</h4>`;
        domString += `      <a href="${article.url}">Link</a>`;
        domString += '    </div>';
        domString += '  </div>';
        domString += '</div>';
      });
      domString += '</div>';
      util.printToDom('news-page', domString);
    })
    .catch(err => console.error(err, 'pal your crap is broken'));
};

const newsPageButtonHandlers = () => {
  document.getElementById('news-nav-button').addEventListener('click', articlesBuilder);
};

export default { newsPageButtonHandlers };
