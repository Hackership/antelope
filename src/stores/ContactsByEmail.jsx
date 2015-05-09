import PouchStore from './PouchStore';
import alt from '../alt';

export default alt.createStore(class contactsByEmailStore extends PouchStore {
  constructor() {
    super({view: 'antelope/contactsByEmail', rawView: true});
  }
});
