// libs
import {Grid, footer, Nav} from 'react-bootstrap'
import {RouteHandler, Link} from "react-router"
import React from 'react'

// internals
import sessionStore from '../stores/Session'

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
    console.log(this.state);
    if (!this.state.hasSession){ return null };

    return <Nav><p>Test</p></Nav>
  },

  render(){
    return (
      <div>
        {this.renderNav()}
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
