
import alt from '../alt';
import _ from "underscore";

class AppActions {
  addMenuItem(items) {
    this.dispatch(_.isArray(items) ? items : [items]);
  }

  addToolMenuItem(items) {
    this.dispatch(_.isArray(items) ? items : [items]);
  }

  addRoute(items) {
    this.dispatch(_.isArray(items) ? items : [items]);
  }
}

export default alt.createActions(AppActions);