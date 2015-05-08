'use strict';

// Based on olafura's PouchStore:
// originally licenced under APL
// https://github.com/olafura/PouchFlux/blob/master/src/stores/PouchStore.js

var merge = require('object-assign');
var Debug = require('debug');
var debug = Debug('store');

import db from './Database';

Debug.enable('store');

class PouchStore {
  constructor(view, key, autoSetup) {
    debug('constructor', arguments);

    this.exportPublicMethods({
        setup: this.setup
    });

    this._setup = false;
    this.docs = {};
    this.db = db;
    this.view = view;
    this.key = key;

    if (autoSetup) {
        this.setup();
        this.setup = function() {};
    } else {
        this.exportPublicMethods({
            setup: this.setup.bind(this)
        });
    }
  }

  setup(view, key) {
    if (this._setup) return;
    this._setup = true;
    var self = this,
        view = view || this.view,
        key = key || this.key,
        options = {
          since: 'now',
          live: true,
          include_docs: true
        },
        triggerChanges = function(result){
          debug('result', result);
          if(result && result.rows) {
            var newrows = result.rows.map(function(row){return row.doc;});
            self.onUpdateAll(newrows);
          }
          return result;
        },
        watchChanges = function(result) {
            // take a breath, schedule this in the next run after
            // or the system hangs until you are back ...
            window.setTimeout(function(){
                self.changes = self.db.changes(options).on('change', function(change) {
                    debug('changes change', change);
                    var doc = change.doc;
                    if(doc) {
                      self.onUpdateAll([doc]);
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

  onUpdateAll(docs) {
    debug('update', docs);
    if(Array.isArray(docs)){
      for(var i = 0; i < docs.length; i++) {
        var doc = docs[i];
        debug('doc', doc);
        var key = doc[this.key];
        debug('key', key);
        if(doc._deleted && key in this.docs) {
          delete this.docs[key];
        } else {
          this.docs[key] = doc;
        }
      }
    } else {
      for(var key2 in this.docs) {
        this.docs[key2] = merge(this.docs[key2], docs);
      }
    }
    debug('docs', this.docs);
    this.emitChange();
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
