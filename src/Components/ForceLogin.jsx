import React from "react"
import {RouteHandler} from "react-router"
import {Button} from "react-bootstrap"
import db from "../stores/Database"
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
        callback();
      });
    }
  },

  render(){
    return (<RouteHandler {...this.props} />)
  }
});


let LoginScreen = React.createClass({
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
      sessionActions.login('ben', 'test');
  },

  render: function (argument) {
      return (<Button onClick={this.login}>Login</Button>)
  }

});


export {ForceLogin, LoginScreen};