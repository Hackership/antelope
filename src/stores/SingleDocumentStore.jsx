import db from "../stores/Database";
import DatabaseActions from "../actions/Database";
import alt from '../alt';

import _ from "underscore";

class DocumentStore {
  constructor(key) {
    this.loading = true;
    this.failed = false;
    this.saving = false;
    this.key = key;
    this.doc = {};

    this.bindListeners({
      documentUpdated: DatabaseActions.documentUpdated
    });


    this.exportPublicMethods({
      fetch: this.fetch.bind(this),
      saveDoc: this.saveDoc.bind(this),
      createDoc: this.createDoc.bind(this)
    });

    this.fetch(true);
  }

  createDoc(doc){
    return db.post(doc).then(function(x){
      this.setState({saving: false});
    }.bind(this)).catch( err =>
      this.setState({saving: false, failed: err})
    );
  }

  saveDoc(doc){
    this.setState({saving: true, err: false});
    return db.put(doc).then(function(x){
      this.setState({saving: false});
    }.bind(this)).catch( err =>
      this.setState({saving: false, failed: err})
    );
  }

  fetch(force){
    if (this.loading && !force) return

    db.get(this.key
      ).then(function(doc) {
        this.setState({doc: doc,
                       loading: false,
                       failed: false});
      }.bind(this)).catch(err =>
        this.setState({loading: false, failed: err})
      );
  }

  documentUpdated(doc){
    if (doc._id != this.key) return
    this.setState({doc: doc});
  }
}

export default function getDocumentStore(id){
  let docStoreId =  "DOCStore_" + id;
  return alt.getStore(docStoreId) || alt.createStore(
    class DocStore extends DocumentStore {
      constructor() {
        super(id);
      }
    }, docStoreId, false);
}