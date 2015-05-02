
import {Well, Row, Col, Button, Input} from "react-bootstrap"
import {RouteHandler, Navigation} from "react-router"
import React from "react"


import db from "../stores/Database"
import {Logo} from "./Antelope"
import sessionActions from "../actions/Session"
import sessionStore from "../stores/Session"



let ForceLogin = React.createClass({
  statics: {
    willTransitionTo: function (transition, params, query, callback) {
      db.getSession((err, resp) => {
        console.log(err, resp);
        if (err || !resp.userCtx.name){
            transition.redirect('loginScreen');
        }
        sessionActions.restoreSession(resp);
        callback();
      });
    }
  },

  render(){
    return (<RouteHandler {...this.props} />)
  }
});


let LoginScreen = React.createClass({
  mixins: [Navigation],
  componentDidMount() {
    sessionStore.listen(this.onChange)
  },

  componentWillUnmount() {
    sessionStore.unlisten(this.onChange)
  },

  onChange() {
    let session = sessionStore.getState();
    if (session.loggedIn){
      this.transitionTo("home")
    }
  },

  login: function(){
      sessionActions.login(this.refs.username.getValue(), this.refs.password.getValue());
  },

  render: function (argument) {
      return (
        <Row style={{marginTop: "20vh"}}>
          <Col xs={12} sm={6} smOffset={3}>
            <Well>
              <form onSubmit={this.login}>
                <h2><Logo margin='0 0.5em' maxWidth='1em' maxHeight='1em' display='inline' />Login Required</h2>
                <p>Please provide your login information</p>
                <Input bsStyle="inline" label="Username" type="input" ref="username" required />
                <Input bsStyle="inline"  label="Password" type="password" ref="password" required />
                <Button bsStyle="primary" type='submit'>Login</Button>
              </form>
            </Well>
          </Col>
        </Row>)
  }

});


export {ForceLogin, LoginScreen};