import DatabaseActions from "../actions/Database";
import db from "../stores/Database";
import {Model} from "backbone-model";

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

function makeStore(id){
    return alt.createStore(class DocStore extends DocumentStore {
      constructor() {
        super(id);
      }
    }, "DOCStore_" + id, false);
}

export default {
  componentWillMount(){
    this.store = makeStore(this.props._id || this._getStoreId())

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