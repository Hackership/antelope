import React from "react"

import alt from '../alt';
import AppActions from "../actions/App";

import _ from "underscore";


class AppStore {
  constructor(){
    this.bindListeners({
      addAppItem: AppActions.addAppItem
    });
  }

  addAppItem({key, items}){
    var newV = {};
    newV[key] = (this[key] || []).concat(items); //_.map(items, x => React.createFactory(x));
    this.setState(newV);
  }
}

export default alt.createStore(AppStore);
