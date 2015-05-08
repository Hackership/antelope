// libs
import {Grid, Navbar, Nav, DropdownButton} from 'react-bootstrap'
import {NavItemLink, MenuItemLink} from 'react-router-bootstrap'
import {RouteHandler, Link} from "react-router"
import SimpleStoreListenMixin from "../utils/SimpleStoreListenMixin";
import InboxStore from '../stores/Inbox';

import React from 'react'
import _ from "underscore"

// internals
import sessionStore from '../stores/Session'
import {Logo} from './Antelope'

let InboxLink = React.createClass({
  mixins: [SimpleStoreListenMixin],
  store: InboxStore,
  onChange(){
    this.forceUpdate()
  },
  render(){
    var count = _.keys(this.store.getState().docs).length;
    return <NavItemLink to="inbox">Inbox ({count})</NavItemLink>;
  }
});



export default React.createClass({
  getInitialState(){
    return {hasSession: sessionStore.getState().loggedIn}
  },

  componentDidMount() {
    sessionStore.listen(this.onChange)
  },

  componentWillUnmount() {
    sessionStore.unlisten(this.onChange)
  },

  onChange() {
    this.setState(this.getInitialState())
  },

  renderNav(){
    if (!this.state.hasSession){ return null };
    return (
      <Navbar brand={<Logo />}>

        <Nav>
          <InboxLink />
        </Nav>

        <Nav right>
          <DropdownButton eventKey={3} title='Tools'>
            <MenuItemLink eventKey='1' to="attachments">Attachments search</MenuItemLink>
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
