import React from "react"
import _ from "underscore"

// libs
import {Route, run, RouteHandler} from "react-router"
import {Grid, Button} from "react-bootstrap"


// internals
import Layout from './Components/Layout'
import {ForceLogin, LoginScreen} from "./Components/ForceLogin"
import AppStore from "./stores/App"
import bootstrap from "./setup/_setup"

// import sessionStore from './stores/Session';
// import sessionActions from './actions/Session';

require('react-select/dist/default.css');
require('./styles/main.css');

bootstrap();

run(
  // these are just for wrapping around the app
  <Route handler={Layout} path="/">
    <Route handler={LoginScreen} name="loginScreen" path="login">
    </Route>
    <Route handler={ForceLogin} path="/">
      {_.flatten(_.map(AppStore.getState().routes, x => _.isFunction(x) ? x() : x))}
    </Route>
  </Route>,
  function (Handler) { React.render(<Handler/>, document.body);
});