import alt from '../alt';
import db from './Database';
import sessionActions from '../actions/Session';


class SessionStore {
  constructor(){
    this.bindListeners({
      login: sessionActions.login
    });
  }

  login({username, password}){
    console.log("triggering", username, password);
    db.login(username, password, (err, response) => {
        console.log(err, response, this)
      if (err) {
        this.setState({loaded: true, loggedIn: false, err: err})
      } else {
        this.setState({loaded: true, loggedIn: true, user: response});
      }
    });
  }
}

var store = alt.createStore(SessionStore);

export default store;