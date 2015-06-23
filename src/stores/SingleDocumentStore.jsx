import db from "../stores/Database";
import DatabaseActions from "../actions/Database";
import alt from '../alt';

import _ from "underscore";

function getDocumentStore(id, bootstrap){
  let docStoreId =  "DOCStore_" + id;
  return alt.getStore(docStoreId) || alt.createStore(
    class DocStore extends DocumentStore {
      constructor() {
        super(id, bootstrap);
      }
    }, docStoreId, false);
}

class DocumentStore {
  constructor(key, bootstrap) {
    this.loading = !bootstrap;
    this.failed = false;
    this.saving = false;
    this.key = key;
    this.doc = bootstrap || {};
    this.refs = {};

    this.bindListeners({
      documentUpdated: DatabaseActions.documentUpdated
    });


    this.exportPublicMethods({
      fetch: this.fetch.bind(this),
      saveDoc: this.saveDoc.bind(this),
      createDoc: this.createDoc.bind(this)
    });

    if (!bootstrap) this.fetch(true);
  }

  createDoc(doc, refetch){
    return db.post(doc).then(function(x){
      this.setState({saving: false});
      refetch && this.fetch(true);
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

    db.query('antelope/with-references',
             {startkey:[this.key, 0],
              endkey: [this.key, 99],
              include_docs: true}
      ).then(function(results) {
        var doc = results["rows"][0]["doc"],
            refs = _.mapObject(
                      _.groupBy(results["rows"].slice(1), r => r.doc.type),
                      l => _.map(l, d => getDocumentStore(d.id, d.doc)));
        console.log(doc, refs);
        this.setState({doc: doc,
                       refs: refs,
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

module.exports = {getDocumentStore: getDocumentStore, DocumentStore: DocumentStore};