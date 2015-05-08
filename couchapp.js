var couchapp = require('couchapp')
    , path = require('path');

  ddoc = {
      _id: '_design/antelope'
    , views: {}
    , lists: {}
    , shows: {}
  }

  module.exports = ddoc;

  ddoc.views.byType = {
    map: function(doc) {
      emit(doc.type, null);
    },
    reduce: '_count'
  }

  ddoc.views.contacts = {
    map: function(doc) {
      if(doc.type == 'contact') {
        emit(doc.name, null);
      }
    }
  }

  ddoc.views.inbox = {
    map: function(doc){
      if(doc.type === "x-email-inbound" || doc.type === 'inbox') {
        emit(doc._id, doc._attachmenqts.length);
      }
    }
  }

  ddoc.views.attachments = {
    map: function(doc) {
      if(doc._attachments && doc._id[0] != "_") {
        emit(doc._id, null);
      }
    }
  }

  ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {
    function require(field, message) {
      message = message || "Document must have a " + field;
      if (!newDoc[field]) throw({forbidden : message});
    };

    if (newDoc.type == "x-email-inbound") {
      require("msg");
    }
  }

  couchapp.loadAttachments(ddoc, path.join(__dirname, 'assets'));