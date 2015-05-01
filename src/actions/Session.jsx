import alt from '../alt';

class SessionActions {
  refresh() {
    this.dispatch();
  }
  login(username, password) {
    console.log("dispatching", arguments)
    this.dispatch({username, password});
  }
}

export default alt.createActions(SessionActions);