import axios from 'axios';
import apiKeys from '../apiKeys.json';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const addArticle = article => axios.post(`${firebaseUrl}/article.json`, article);

const getArticlesByUserId = userId => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/article.json?orderBy="uid"&equalTo="${userId}"`)
    .then((results) => {
      const articleResults = results.data;
      const articles = [];
      Object.keys(articleResults).forEach((articleId) => {
        articleResults[articleId].id = articleId;
        articles.push(articleResults[articleId]);
      });
      resolve(articles);
    })
    .catch(error => reject(error));
});

const deleteArticleById = articleId => axios.delete(`${firebaseUrl}/article/${articleId}.json`);

export default { addArticle, getArticlesByUserId, deleteArticleById };
