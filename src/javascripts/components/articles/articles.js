import firebase from 'firebase/app';
import 'firebase/auth';

import $ from 'jquery';

import util from '../../helpers/util';
import articlesData from '../../helpers/data/articlesData';
import './articles.scss';

const toggleEdit = (e) => {
  e.preventDefault();
  e.target.closest('.card').getElementsByTagName('form')[0].classList.toggle('hide');
  e.target.closest('.card').getElementsByClassName('news-articleDisplay')[0].classList.toggle('hide');
  e.target.closest('.card').getElementsByClassName('news-edit-delete')[0].classList.toggle('hide');
};

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
      domString += '              <input class="col-12 col-sm-10 form-control form-control" type="text" name="articleTitle" id="news-articleTitleInput">';
      domString += '            </div>';
      domString += '            <div class="form-group d-flex">';
      domString += '              <label class="col-12 col-sm-2 col-form-label" for="articleSynopsis">Synopsis</label>';
      domString += '              <input class="col-12 col-sm-10 form-control"type="text" name="articleSynopsis" id="news-articleSynopsisInput">';
      domString += '            </div>';
      domString += '            <div class="form-group d-flex">';
      domString += '              <label class="col-12 col-sm-2 col-form-label" for="articleUrl">URL</label>';
      domString += '              <input class="col-12 col-sm-10 form-control form-control" type="text" name="articleUrl" id="news-articleUrlInput">';
      domString += '            </div>';
      domString += '            <div class="form-group d-flex justify-content-end">';
      domString += '              <button id="news-newArticle-submit" type="submit" class="btn btn-primary">Submit</button>';
      domString += '              <button id="news-newArticle-cancel" class="btn btn-warning mr-3">Cancel</button>';
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
        domString += `      <div class="news-articleDisplay" id="news-display.${article.id}">`;
        domString += `        <h2 class="mt-3">${article.title}</h2>`;
        domString += `        <h4>${article.synopsis}</h4>`;
        domString += `        <a href="${article.url}" target="_blank">Link</a>`;
        domString += '      </div>';
        domString += `      <div class="container" id="news-editForm.${article.id}">`;
        domString += '      <form class="hide">';
        domString += '        <div class="form-group d-flex mt-3">';
        domString += '          <label class="col-12 col-sm-2 col-form-label" for="articleTitle">Title</label>';
        domString += `          <input class="col-12 col-sm-10 form-control form-control" type="text" name="articleTitle" id="news-articleTitleInput-edit.${article.id}" value="${article.title}">`;
        domString += '        </div>';
        domString += '        <div class="form-group d-flex">';
        domString += '          <label class="col-12 col-sm-2 col-form-label" for="articleSynopsis">Synopsis</label>';
        domString += `          <input class="col-12 col-sm-10 form-control"type="text" name="articleSynopsis" id="news-articleSynopsisInput-edit.${article.id}" value="${article.synopsis}">`;
        domString += '        </div>';
        domString += '        <div class="form-group d-flex">';
        domString += '          <label class="col-12 col-sm-2 col-form-label" for="articleUrl">URL</label>';
        domString += `          <input class="col-12 col-sm-10 form-control form-control" type="text" name="articleUrl" id="news-articleUrlInput-edit.${article.id}" value="${article.url}">`;
        domString += '        </div>';
        domString += '        <div class="form-group d-flex justify-content-end">';
        domString += `          <button id="news-submit-edit.${article.id}" type="submit" class="btn btn-primary mr-3 news-edit-submit">Save</button>`;
        domString += `          <button id="news-cancel-edit.${article.id}" class="btn btn-danger news-edit-cancel">Cancel</button>`;
        domString += '        </div>';
        domString += '      </form>';
        domString += '      </div>';
        domString += '        <div class="container news-edit-delete">';
        domString += '          <div class="form-group d-flex justify-content-end">';
        domString += `            <button id="news-edit.${article.id}" class="btn btn-primary news-editArticle mr-3">Edit</button>`;
        domString += `            <button id="news-delete.${article.id}" class="btn btn-danger news-deleteArticle">Delete</button>`;
        domString += '          </div>';
        domString += '        </div>';
        domString += '    </div>';
        domString += '  </div>';
        domString += '</div>';
      });
      domString += '</div>';
      util.printToDom('news-page', domString);

      // add new article listener
      $('#news-add-article').click(() => {
        $('#news-newArticle').removeClass('hide');
      });
      // submit new article listener
      $('#news-newArticle-submit').click((e) => {
        // eslint-disable-next-line no-use-before-define
        createArticle(e);
      });
      // cancel new article listener
      $('#news-newArticle-cancel').click((e) => {
        e.preventDefault();
        $('#news-newArticle').addClass('hide');
        $('#news-articleTitleInput')[0].value = '';
        $('#news-articleSynopsisInput')[0].value = '';
        $('#news-articleUrlInput')[0].value = '';
      });
      // delete buttons listeners
      const deleteButtons = Array.from($('.news-deleteArticle'));
      deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const articleId = button.id.split('.')[1];
          articlesData.deleteArticleById(articleId)
            .then(() => {
              articlesBuilder();
            })
            .catch(error => console.error('can\t deleteArticleById', error));
        });
      });
      // edit buttons listeners
      const editButtons = Array.from($('.news-editArticle'));
      editButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          toggleEdit(e);
        });
      });
      // edit cancel buttons listeners
      const editCancelButtons = Array.from($('.news-edit-cancel'));
      editCancelButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          toggleEdit(e);
        });
      });
      // edit submit buttons listeners
      const editSubmit = Array.from($('.news-edit-submit'));
      editSubmit.forEach((button) => {
        button.addEventListener('click', (e) => {
          toggleEdit(e);
          const articleId = button.id.split('.')[1];
          const newArticleObject = {
            uid: firebase.auth().currentUser.uid,
            title: e.target.closest('.card').getElementsByTagName('form')[0].getElementsByTagName('input')[0].value,
            synopsis: e.target.closest('.card').getElementsByTagName('form')[0].getElementsByTagName('input')[1].value,
            url: e.target.closest('.card').getElementsByTagName('form')[0].getElementsByTagName('input')[2].value,
          };
          articlesData.editArticle(newArticleObject, articleId)
            .then(() => {
              articlesBuilder();
            })
            .catch(error => console.error('can\t updateArticleById', error));
        });
      });
    })
    .catch(error => console.error('can\'t getArticleByUserId', error));
};

const createArticle = (e) => {
  e.preventDefault();
  const newArticle = {
    uid: firebase.auth().currentUser.uid,
    title: $('#news-articleTitleInput')[0].value,
    synopsis: $('#news-articleSynopsisInput')[0].value,
    url: $('#news-articleUrlInput')[0].value,
  };
  articlesData.addArticle(newArticle)
    .then(() => {
      articlesBuilder();
    })
    .catch(error => console.error('can\'t add article', error));
};

const newsPageButtonHandlers = () => {
  $('body').on('click', '.news-nav-button', articlesBuilder);
};

export default { newsPageButtonHandlers };
