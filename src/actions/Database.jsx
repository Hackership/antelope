
import alt from '../alt';
import _ from "underscore";

class DatabaseActions {
  documentUpdated(document){
    this.dispatch(document);
  }
}

export default alt.createActions(DatabaseActions);