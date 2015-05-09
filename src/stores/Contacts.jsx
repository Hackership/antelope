import DBView from './DBView';
import alt from '../alt';

export default alt.createStore(class ContactsStore extends DBView {
  constructor() {
    super({view: 'antelope/contacts'});
  }
});