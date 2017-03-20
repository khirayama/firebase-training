import * as firebase from 'firebase';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class HomePage extends Component {
  render() {
    return (
      <div
        className="login-with-twitter-button"
        onClick={() => {
          const provider = new firebase.auth.TwitterAuthProvider();
          firebase.auth().signInWithPopup(provider).then(result => {
            const user = result.user;
            console.log(user);
          });
        }}
      >Login with Twitter</div>
    );
  }
}

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(user => {
  const currentUser = {
    name: user.displayName,
    email: user.email,
    photoUrl: user.photoURL,
    uid: user.uid,
  };
  console.log(currentUser);
});

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<HomePage />, document.querySelector('.application'));
});
