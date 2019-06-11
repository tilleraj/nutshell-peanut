import firebase from 'firebase/app';
import 'firebase/auth';

import $ from 'jquery';

import util from '../../helpers/util';
import articlesData from '../../helpers/data/articlesData';
import './articles.scss';

const articlesBuilder = () => {
  articlesData.getArticlesByUserId(firebase.auth().currentUser.uid)
    .then((articlesArray) => {
      let domString = '';
      domString += '<div class="articleButtonDiv mt-4 text-center">';
      domString += '  <button id="news-add-article">Add Article</button>';
      domString += '</div>';
      domString += '<div id="news-newArticle" class="container mt-4 hide">';
      domString += '  <div class="row d-flex justify-content-center">';
      domString += '    <div class="col-12 col-md-10 col-lg-8 text-center">';
      domString += '      <div class="card">';
      domString += '        <div class="container">';
      domString += '          <form>';
      domString += '            <div class="form-group d-flex mt-3">';
      domString += '              <label class="col-12 col-sm-2 col-form-label" for="articleTitle">Title</label>';
      domString += '              <input class="col-12 col-sm-10 form-control form-control" type="text" name="articleTitle" id="articleTitleInput">';
      domString += '            </div>';
      domString += '            <div class="form-group d-flex">';
      domString += '              <label class="col-12 col-sm-2 col-form-label" for="articleSynopsis">Synopsis</label>';
      domString += '              <input class="col-12 col-sm-10 form-control"type="text" name="articleSynopsis" id="articleSynopsisInput">';
      domString += '            </div>';
      domString += '            <div class="form-group d-flex">';
      domString += '              <label class="col-12 col-sm-2 col-form-label" for="articleUrl">URL</label>';
      domString += '              <input class="col-12 col-sm-10 form-control form-control" type="text" name="articleUrl" id="articleUrlInput">';
      domString += '            </div>';
      domString += '            <div class="form-group d-flex justify-content-end">';
      domString += '              <button id="news-newArticle-cancel" class="btn btn-outline-warning mr-4">Cancel</button>';
      domString += '              <button id="news-newArticle-submit" type="submit" class="btn btn-outline-primary">Submit</button>';
      domString += '            </div>';
      domString += '          </form>';
      domString += '        </div>';
      domString += '      </div>';
      domString += '    </div>';
      domString += '  </div>';
      domString += '</div>';
      domString += '<div class="container mt-4">';
      articlesArray.forEach((article) => {
        domString += '<div class="row d-flex justify-content-center">';
        domString += '  <div class="col-12 col-md-10 col-lg-8 text-center">';
        domString += `    <div id="${article.id}" class="card">`;
        domString += `      <h2>${article.title}</h2>`;
        domString += `      <h4>${article.synopsis}</h4>`;
        domString += `      <a href="${article.url}" target="_blank">Link</a>`;
        domString += '    </div>';
        domString += '  </div>';
        domString += '</div>';
      });
      domString += '</div>';
      util.printToDom('news-page', domString);
      $('#news-add-article').click(() => {
        $('#news-newArticle').removeClass('hide');
      });
      $('#news-newArticle-cancel').click(() => {
        $('#news-newArticle').addClass('hide');
      });
    })
    .catch(err => console.error(err, 'pal your crap is broken'));
};

const newsPageButtonHandlers = () => {
  $('#news-nav-button').click(articlesBuilder);
};

export default { newsPageButtonHandlers };
