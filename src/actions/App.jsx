
import alt from '../alt';
import _ from "underscore";

class AppActions {
  addAppItem(key, items){
    this.dispatch({
        key: key,
        items: _.isArray(items) ? items : [items]});
  }
}

export default alt.createActions(AppActions);