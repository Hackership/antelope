// libs
import React from "react"

import {Grid, Navbar, Nav, DropdownButton} from 'react-bootstrap'
import {NavItemLink, MenuItemLink} from 'react-router-bootstrap'
import {RouteHandler, Link} from "react-router"
import SimpleStoreListenMixin from "../utils/SimpleStoreListenMixin";
import AppStore from '../stores/App';

import _ from "underscore"

// internals
import sessionStore from '../stores/Session'
import {Logo} from './Antelope'

let ContextWrap = React.createClass({

  childContextTypes: {
    router: React.PropTypes.func
  },
  getChildContext () {
    console.log(this.context.router);
    return {
      router: this.context.router
    }
  },
  render(){
    return this.props.children[0];
  }

})

export default React.createClass({
  getInitialState(){
    return {hasSession: sessionStore.getState().loggedIn,}
  },

  componentDidMount() {
    sessionStore.listen(this.onChange)
    AppStore.listen(this._refresh)
  },

  componentWillUnmount() {
    sessionStore.unlisten(this.onChange)
    AppStore.unlisten(this._refresh)
  },

  onChange() {
    this.setState(this.getInitialState())
  },

  _refresh(){
    this.forceUpdate();
  },

  renderNav(){
    if (!this.state.hasSession){ return null };
    console.log(AppStore.getState().menu, AppStore.getState().toolmenu)
    _.map(AppStore.getState().menu, x => _.isFunction(x) ? x() : x)
    _.map(AppStore.getState().toolmenu, x => _.isFunction(x) ? x() : x)
    return (
      <Navbar brand={<Logo />}>

        <Nav>
          {_.map(AppStore.getState().menu, x => _.isFunction(x) ? x() : x)}
        </Nav>

        <Nav right>
          <DropdownButton eventKey={3} title='Tools'>
            {_.map(AppStore.getState().toolmenu, x => _.isFunction(x) ? x() : x)}
          </DropdownButton>
        </Nav>
      </Navbar>)
  },

  render(){
    return (
      <div>
        <header>
          {this.renderNav()}
        </header>
        <Grid fluid={true}>
          <RouteHandler {...this.props} />
        </Grid>
        <footer>
          <p>You are riding the <a href="https://www.github.com/hackership/antelope" target="_blank">Antelope</a>!</p>
        </footer>
      </div>
    )
  }
});
