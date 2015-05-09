'use strict';

// Based on olafura's PouchStore:
// originally licenced under APL
// https://github.com/olafura/PouchFlux/blob/master/src/stores/PouchStore.js

import merge from 'object-assign';
import Debug from 'debug';
import Model from "../models/BaseModel";
import {Collection} from 'backbone-collection';


var debug = Debug('store');

import db from './Database';

Debug.enable('store');

class PouchStore {
  constructor({view, key, autoSetup, rawView}) {
    debug('constructor', arguments);

    this.exportPublicMethods({
        setup: this.setup
    });

    this._setup = false;
    this.collection = this._createCollection();
    this.docs = this.collection; // backwards compatibility
    this.db = db;
    this.view = view;
    this.key = key;
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

  setup({view, key, rawView}) {
    if (this._setup) return;
    this._setup = true;

    this.collection.on("all", function(){
      this.emitChange();
    }.bind(this));

    var self = this,
        view = view || this.view,
        key = key || this.key,
        rawView = rawView || this.rawView,
        options = {
          since: 'now',
          live: true,
          include_docs: true
        },
        triggerChanges = function(result){
          debug('result', result);
          if(result && result.rows) {
            self.collection.reset(rawView ? result.rows : result.rows.map(row => row.doc));
          }
          return result;
        },
        watchChanges = function(result) {
            // take a breath, schedule this in the next run after
            // or the system hangs until you are back ...
            window.setTimeout(function(){
                self.changes = self.db.changes(options).on('change', function(change) {
                    debug('changes change', change);
                    var doc = rawView ? change : change.doc;
                    if(doc) {
                      self.collection.add(doc, {merge:true});
                    }
                });
            }, 1)
        };

    if(view) {
      this.db.query(view, {include_docs: true}).then(triggerChanges).then(watchChanges);
      options.filter = '_view';
      options.view = view;
    } else {
      this.db.allDocs({include_docs: true}).then(triggerChanges).then(watchChanges);
    }


    if(key) {
      this.key = key;
    } else {
      this.key = '_id';
    }

  }

  onPut(doc) {
    debug('put', doc);
    this.db.put(doc).then(function(result) {
        debug('put result', result);
    }).catch(function(err) {
        debug('put error: ', err);
    });
  }

  onRemove(doc) {
    debug('remove', doc);
    this.db.remove(doc).then(function(result) {
          debug('remove result', result);
    }).catch(function(err) {
          debug('remove error: ', err);
    });
  }

  onSync(destination) {
    PouchDB.sync(this.name, destination);
  }
}

module.exports = PouchStore;
