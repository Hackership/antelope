// libs
import {Grid, Navbar} from 'react-bootstrap'
import {RouteHandler, Link} from "react-router"
import React from 'react'

// internals
import sessionStore from '../stores/Session'
import {Logo} from './Antelope'


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
    return (<Navbar brand={<Logo />}></Navbar>)
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
