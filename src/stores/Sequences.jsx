import DBViewStore from './DBView';
import alt from '../alt';
import db from './Database';
import ajax from 'pouchdb/extras/ajax';

console.log(ajax);

export default alt.createStore(class SequenceStore extends DBViewStore {
  constructor() {
    super({view: 'antelope/byType', params: {key: 'sequence'}});
    this.exportPublicMethods({
      nextSequence: this.nextSequence.bind(this)
    });
  }

  nextSequence(name){
    if (db.adapter != 'http' && db.adapter != "https"){
      throw "Need a remote server!";
    }

    return ajax({
        url: db.getUrl() + '/_design/antelope/_update/nextSequence/' + name,
        method: 'POST'}
      );
  }

});