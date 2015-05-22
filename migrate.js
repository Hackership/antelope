if (process.argv.length < 3){
  throw "You need to specify the URL to the couchdb server"
}

var PouchDB = require('pouchdb');

PouchDB.plugin(require('pouchdb-migrate'));

var db = new PouchDB(process.argv[2]),
    now = (new Date()).toJSON();


// we load all migrations in here
var migrations = {};


//
//  Start migrations
//

// Migrate our contacts!
migrations.contact = {};
migrations.contact[0] = function(doc){
  //
  doc.created_at = now;
  doc.created_at = now;
  doc.created_by = null;
  doc.updated_by = null;
}


//
//  Careful with code hereafter!
//

db.migrate(function(doc){
  var changed = false;
  if (doc.type){
    if (!doc.version){
      if (doc.version !== 0) changed = true;
      doc.version = 0;
    }
    while(migrations[doc.type] && migrations[doc.type][doc.version]){
      console.log(doc._id + " : migrating " + doc.type + " from v" + doc.version)
      migrations[doc.type][doc.version](doc)
      doc.version++;
      changed = true;
    }

  }

  if (changed) return [doc];

}).then(function(){
  console.log("Migrations all went fine, hurray!");
})


