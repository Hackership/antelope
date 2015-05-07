
// libs
import {Route, run, RouteHandler} from "react-router"
import {Grid, Button} from "react-bootstrap"
import React from "react"

// internals
import Layout from './Components/Layout'
import {ForceLogin, LoginScreen} from "./Components/ForceLogin"
import {Meeeh} from "./Components/Antelope"
import ShowDocs from "./Components/ShowDocs"
// import sessionStore from './stores/Session';
// import sessionActions from './actions/Session';

require('./styles/main.css')


let routes = (
  <Route handler={Layout} path="/">
    <Route handler={LoginScreen} name="loginScreen" path="login">
    </Route>
    <Route handler={ForceLogin} path="/">
      <Route handler={ShowDocs} name="home" path="/" />
    </Route>
  </Route>
);


run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});