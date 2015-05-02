import alt from '../alt';

class SessionActions {
  login(username, password) {
    this.dispatch({username, password});
  }
  restoreSession (session){
    this.dispatch(session);
  }
}

export default alt.createActions(SessionActions);