import DBView from './DBView';
import alt from '../alt';

export default alt.createStore(class AllDocsStore extends DBView {
  constructor() {
    super({view: 'antelope/attachments'});
  }
});