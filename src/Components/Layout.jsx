// libs
import React from "react"

import {Grid, Navbar, Nav, DropdownButton} from 'react-bootstrap'
import {NavItemLink, MenuItemLink} from 'react-router-bootstrap'
import {RouteHandler, Link} from "react-router"
import SimpleStoreListenMixin from "./SimpleStoreListenMixin";
import AppStore from '../stores/App';

import _ from "underscore"

// internals
import sessionStore from '../stores/Session'
import {Logo} from './Antelope'

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

    return (
      <Navbar brand={<Logo />}>

        <Nav>
          {_.map(AppStore.getState().menu, x => _.isFunction(x) ? x() : x)}
        </Nav>

        <Nav right>
          <DropdownButton eventKey={3} title='Tools'>
            {_.map(AppStore.getState().tools, x => _.isFunction(x) ? x() : x)}
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
