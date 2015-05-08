import PouchStore from './PouchStore';
import alt from '../alt';

export default alt.createStore(class AllDocsStore extends PouchStore {
  constructor() {
    super('antelope/attachments');
  }
});