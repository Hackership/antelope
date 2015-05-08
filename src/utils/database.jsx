import db from "../stores/Database";

module.exports = {
    getAttachmentUrl: function(doc, filename){
        return db._db_name + "/" + (doc._id || doc) + "/" + filename;
    }

}