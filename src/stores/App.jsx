import React from "react"

import alt from '../alt';
import AppActions from "../actions/App";

import _ from "underscore";


class AppStore {
  constructor(){
    this.menu = [];
    this.toolmenu = [];
    this.routes = [];
    this.bindListeners({
      addMenuItem: AppActions.addMenuItem,
      addToolMenuItem: AppActions.addToolMenuItem,
      addRoute: AppActions.addRoute,
    });
  }

  _add_to(key, items){
    var newV = {};
    newV[key] = this[key].concat(items); //_.map(items, x => React.createFactory(x));
    this.setState(newV);
  }

  addRoute(items){
    this._add_to('routes', items);
  }

  addMenuItem(items){
    this._add_to('menu', items);
  }

  addToolMenuItem(items){
    this._add_to('toolmenu', items);
  }
}

export default alt.createStore(AppStore);
