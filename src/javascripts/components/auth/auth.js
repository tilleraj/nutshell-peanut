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
  domString += '<button id="google-auth" class="btn authButton">';
  domString += `<img src=${googleButton} />`;
  domString += '</button>';
  util.printToDom('auth-div', domString);
  document.getElementById('google-auth').addEventListener('click', signMeIn);
};

export default { authStringBuilder };
