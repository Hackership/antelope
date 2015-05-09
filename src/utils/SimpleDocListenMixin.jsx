import DatabaseActions from "../actions/Database";
import db from "../stores/Database";
import {Model} from "backbone-model";
import alt from '../alt';

import _ from "underscore";

class DocumentStore {
  constructor(key) {
    this.loading = true;
    this.failed = false;
    this.key = key;
    this.model = new Model();
    db.get(key
      ).then(function(doc) {
        this.model.set(doc);
        this.setState({loading: false, failed: false});
      }.bind(this)).catch(err =>
        this.setState({loading: false, failed: err})
      );
  }
}

function getStore(id){
  let docStoreId =  "DOCStore_" + id;
  return alt.getStore(docStoreId) || alt.createStore(
    class DocStore extends DocumentStore {
      constructor() {
        super(id);
      }
    }, docStoreId, false);
}

export default {
  componentWillMount(){
    this.store = getStore(this.props._id ||
          (_.isFunction(this._getStoreId) ? this._getStoreId() : '') ||
          (_.isFunction(this.getParams) ? this.getParams().docId : ''))
  },
  componentDidMount() {
    this.store.listen(this._storeRefreshed)
  },

  _storeRefreshed(){
    this.forceUpdate();
  },

  componentWillUnmount() {
    this.store.unlisten(this._storeRefreshed)
  },
}