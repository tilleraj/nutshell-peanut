import firebase from 'firebase/app';
import 'firebase/auth';
import util from '../../helpers/util';

import googleButton from '../../../images/google_signin.png';

// The function below tells firebase to allow the user to sign in with a google account
const signMeIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

// This adds a button to the DOM (appears on page load) that can be clicked to sign in with G
const authStringBuilder = () => {
  let domString = '';
  domString += '<div class="container">';
  domString += '<div class="row justify-content-center">';
  domString += '<div class="col-12">';
  domString += '<p id="site-header">NUTSHELL</p>';
  domString += '<p id="edition">PEANUTS EDITION</p>';
  domString += '</div>';
  domString += '<div class="col-12">';
  domString += '<p id="tagline">"The #1 site on the ENTIRE INTERNET"</p>';
  domString += '<p>- The Internet</p>';
  domString += '</div>';
  domString += '<div id="snoopy-div" class="col-12 col-md-4">';
  domString += '<img id="snoopy-left" src="https://www.stickpng.com/assets/images/580b57fbd9996e24bc43bd47.png">';
  domString += '</div>';
  domString += '<div class="col-12 col-md-4">';
  domString += '<button id="google-auth" class="btn authButton">';
  domString += `<img id="google-img" src=${googleButton} />`;
  domString += '</button>';
  domString += '</div>';
  domString += '<div id="snoopy-div" class="col-12 col-md-4">';
  domString += '<img id="snoopy" src="https://www.stickpng.com/assets/images/580b57fbd9996e24bc43bd47.png">';
  domString += '</div>';
  domString += '</div>';
  domString += '</div>';
  util.printToDom('auth-div', domString);
  document.getElementById('google-auth').addEventListener('click', signMeIn);
};

export default { authStringBuilder };
