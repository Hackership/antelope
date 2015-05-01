
var PouchDB = require("pouchdb");

let _pathname = location.pathname.split('/'),
    _db_name = location.origin + "/" + (_pathname.length > 2 ? _pathname[1] : "antelope");

// plugin setup
PouchDB.plugin(require('pouchdb-authentication'));

export default PouchDB(_db_name);

