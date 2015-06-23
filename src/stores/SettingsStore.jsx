import {DocumentStore} from "./SingleDocumentStore"
import alt from '../alt';


export default alt.createStore(
    class SettingsStore extends DocumentStore {
      constructor() {
        super("SETTINGS", null);
      }
    }, "SETTINGS", false);