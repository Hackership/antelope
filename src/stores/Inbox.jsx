import PouchStore from './PouchStore';
import alt from '../alt';

export default alt.createStore(class InboxStore extends PouchStore {
  constructor() {
    super({view: 'antelope/inbox'});
  }
});