'use strict';

import Model from "../models/BaseModel";
import {Collection} from 'backbone-collection';

import db from './Database';

class DBViewStore {
  constructor({view, autoSetup, rawView}) {

    this._setup = false;
    this.collection = this._createCollection();
    this.docs = this.collection; // backwards compatibility
    this.db = db;
    this.view = view;
    this.rawView = rawView;

    if (autoSetup) {
        this.setup();
        this.setup = function() {};
    } else {
      this.exportPublicMethods({
        setup: this.setup.bind(this)
      });
    }
  }

  _createCollection(){
    if (this.backboneCollection){
      return new this.backboneCollection;
    }
    return new (Collection.extend({
      model: (this.backboneModel || Model)
    }));
  }

  setup() {
    let self = this;
    if (this._setup) return;
    this._setup = true;

    this.collection.on("all", function(){
      this.emitChange();
    }.bind(this));

    this.db.query(this.view, {include_docs: true}
          ).then(function(result){
            if(result && result.rows) {
              self.collection.reset(self.rawView ? result.rows : result.rows.map(row => row.doc));
            }
            return result;
          }).then(function(result) {
            // take a breath, schedule this in the next run after
            // or the system hangs until you are back ...
            window.setTimeout(function(){
                self.changes = self.db.changes({
                    since: 'now',
                    filter: "_view",
                    view: self.view,
                    live: true,
                    include_docs: true}
                ).on('change', function(change) {
                    var doc = self.rawView ? change : change.doc;
                    if(!doc) return

                    self.collection.add(doc, {merge: true});
                });
            }, 1)
          });
  }

}

module.exports = DBViewStore;
