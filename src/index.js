import * as firebase from 'firebase';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

// firebase
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};

firebase.initializeApp(config);

const db = firebase.database();

const provider = new firebase.auth.TwitterAuthProvider();

// create
// const task = new Task({content: 'hoge'});
//
// update
// task.update();
//
// delete
// task.destroy();

class Model {
  constructor(entity) {
    this._ref = this.constructor.ref;

    this._create(entity);

    return this;
  }
  _create(entity) {
    console.log(this._ref, entity);
    if (entity.id) {
      const createdEntity = this._ref.child(entity.id).set(entity);
    } else {
      const createdEntity = this._ref.push(entity);
    }
  }
  update(entity) {
    console.log(this, entity);
  }
  destroy() {
    console.log(this);
  }
  static fetch() {
    console.log('fetch');
  }
  static watch() {
    console.log('watch');
  }
  static added() {
    console.log('added');
  }
  static changed() {
    console.log('changed');
  }
  static removed() {
    console.log('removed');
  }
  static moved() {
    console.log('moved');
  }
}
Model.db = firebase.database();

class User extends Model {
}
User.ref = Model.db.ref('/users');

const user = new User({username: 'hoge'});
user.update({username: 'khirayama'});
user.destroy();
User.fetch(users => { // once('value')
  console.log(users);
});
User.watch(users => { // on('value')
  console.log(users);
});
User.added(users => { // on('child_add')
  console.log(users);
});
User.changed(users => { // on('child_changed')
  console.log(users);
});
User.removed(users => { // on('child_removed')
  console.log(users);
});
User.moved(users => { // on('child_moved')
  console.log(users);
});
console.log(User.ref, user);

function fetchTasks(userId) {
  const ref = db.ref('tasks');
  ref.orderByChild('userId').equalTo(userId).on('value', snapshot => {
    console.log(snapshot.val());
  });
}

function createTask(task) {
  const createdTask = db.ref().child('tasks').push(task);
}

// component
class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const currentUser = {
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
          uid: user.uid,
        };
        this.setState({user: currentUser});
        fetchTasks(user.uid);
      }
    });
  }
  render() {
    const user = this.state.user;

    return (
      <section>
        <div
          onClick={() => {
            firebase.auth().signInWithPopup(provider).then(result => {
              const user = result.user;
              console.log(user);
              if (user) {
                User.create();
              }
            });
          }}
        >Login with Twitter</div>
        {(this.state.user) ? <ul><li>{user.uid}</li><li>{user.name}</li></ul> : null}
        <div onClick={() => {
          createTask({userId: user.uid, content: 'hoge'});
        }}>add item</div>
      </section>
    );
  }
}

// index
window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<HomePage />, document.querySelector('.application'));
});
