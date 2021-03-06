import React from 'react'
import {getDocumentStore} from "../stores/SingleDocumentStore"
import {SettingsStore} from "../stores/SettingsStore"

import _ from "underscore"

export default {
  componentWillMount(){
    this.store = _.isFunction(this._getStore) ? this._getStore() : (
        getDocumentStore(this.props._id ||
          (_.isFunction(this._getStoreId) ? this._getStoreId() : '') ||
          (_.isFunction(this.getParams) ? this.getParams().docId : ''))
        )
  },
  componentDidMount() {
    this.store.listen(this._storeRefreshed)
    if (this.WITH_SETTINGS){
      SettingsStore.listen(this._storeRefreshed)
    }
  },

  saveDoc(doc){
    this.store.saveDoc(doc);
  },

  render(){
    let state = this.store.getState();

    // Add proper, system-wide loading animation
    if (state.loading) return <span>Loading</span>;

    if (state.failed){
      if (this._render_failed){
        return this._render_failed(state.failed);
      }
      console.log(state.failed);
      return <span>Failed</span>;
    }

    return this._render(state.doc);
  },

  _storeRefreshed(){
    this.forceUpdate();
  },

  componentWillUnmount() {
    this.store.unlisten(this._storeRefreshed)
    if (this.WITH_SETTINGS){
      SettingsStore.unlisten(this._storeRefreshed)
    }
  },
}