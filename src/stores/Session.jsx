import alt from '../alt';
import db from './Database';
import sessionActions from '../actions/Session';
import databaseActions from "../actions/Database";


class SessionStore {
  constructor(){
    this.bindListeners({
      login: sessionActions.login,
      restoreSession: sessionActions.restoreSession,
    });
  }

  _listenForChanges(){
    window.setTimeout(function(){
      db.changes({
          since: 'now',
          live: true,
          include_docs: true
        }).on('change', function(change) {
          if(change.doc) {
            databaseActions.documentUpdated(change.doc);
          }
      });
    }, 1);
  }

  restoreSession(session){
    this.setState({loaded: true, user: session.userCtx, loggedIn: !!session.userCtx.name})
    this._listenForChanges();
  }

  login({username, password}){
    console.log("triggering", username, password);
    db.login(username, password, (err, response) => {
        console.log(err, response, this)
      if (err) {
        this.setState({loaded: true, loggedIn: false, err: err})
      } else {
        this.setState({loaded: true, loggedIn: true, user: response.userCtx});
        this._listenForChanges();
      }
    });
  }
}

var store = alt.createStore(SessionStore);

export default store;