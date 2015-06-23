var couchapp = require('couchapp')
    , path = require('path');

  ddoc = {
      _id: '_design/antelope'
    , views: {
      lib: {
        referenceMap: "module.exports = " + JSON.stringify({
          "invoice" : ["recipient"]
        })
      }
    }
    , lists: {}
    , shows: {}
    , updates: {}
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
      if(doc.type === 'contact') {
        emit(doc._id, null);
      }
    }
  }

  ddoc.views.contactsByEmail = {
    map: function(doc) {
      if(doc.type === 'contact' && doc.emails && doc.emails.length) {
        for (var i=0; i < doc.emails.length; i++){
          emit(doc.emails[i].email, doc.emails[i]);
        }
      }
    }
  }

  ddoc.views.inbox = {
    map: function(doc){
      if(doc.type === "x-email-inbound" || doc.type === 'inbox') {
        emit(doc._id, doc._attachments.length);
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

  ddoc.views['with-references'] = {
    map: function(doc){
      var rMap = require("views/lib/referenceMap");
      emit([doc._id, 0, doc.type, null, doc.updated_at, doc.created_at], {_id: doc._id});

      if (doc.type && rMap[doc.type]){
        var attrs = rMap[doc.type];
        for (var i=0; i < attrs.length ; i++){
          var key = attrs[i],
              refId = doc[key];
          if (refId) {
            emit([refId, 1, doc.type, key, doc.updated_at, doc.created_at], {_id: doc._id});
          }
        }
      }
    }
  }

  // sequence generator
  ddoc.updates.nextSequence = function(doc, req) {
    if (!doc) {
      doc = {
        _id: req.id,
        type: 'sequence',
        version: 1,
        count: 0
      };
    }
    doc.count++;
    var count = "" + doc.count;
    if (doc.padLeft){
      count = doc.padLeft.substring(count.length) + count;
    }
    return [doc, toJSON((doc.prefix || '') + count)];
  }


  ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {
    function require(field, message) {
      message = message || "Document must have a " + field;
      if (!newDoc[field]) throw({forbidden : message});
    };

    if (newDoc._deleted && userCtx.roles.indexOf('_admin') === -1) {
      throw({
        forbidden: 'Only admins may delete docs.'
      })
    }

    if (newDoc.type == "x-email-inbound") {
      require("msg");
    }
  }

  couchapp.loadAttachments(ddoc, path.join(__dirname, 'assets'));