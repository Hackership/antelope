import DBView from './DBView';
import alt from '../alt';

export default alt.createStore(class contactsByEmailStore extends DBView {
  constructor() {
    super({view: 'antelope/contactsByEmail', rawView: true});
  }
});
