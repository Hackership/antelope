import DBViewStore from './DBView';
import alt from '../alt';

export default alt.createStore(class InboxStore extends DBViewStore {
  constructor() {
    super({view: 'antelope/inbox'});
  }
});