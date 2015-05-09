import PouchStore from './PouchStore';
import alt from '../alt';

export default alt.createStore(class ContactsStore extends PouchStore {
  constructor() {
    super({view: 'antelope/contacts'});
  }
});