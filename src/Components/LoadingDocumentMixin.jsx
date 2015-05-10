import React from 'react'
import getStore from "../stores/SingleDocumentStore"

import _ from "underscore"

export default {
  componentWillMount(){
    this.store = getStore(this.props._id ||
          (_.isFunction(this._getStoreId) ? this._getStoreId() : '') ||
          (_.isFunction(this.getParams) ? this.getParams().docId : ''))
  },
  componentDidMount() {
    this.store.listen(this._storeRefreshed)
  },

  saveDoc(doc){
    this.store.saveDoc(doc);
  },

  render(){
    let state = this.store.getState();

    // Add proper, system-wide loading animation
    if (state.loading) return <span>Loading</span>;

    if (state.failed){
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
  },
}