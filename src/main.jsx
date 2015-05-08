import React from "react"

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

require('./styles/main.css')

bootstrap();

var appRoutes = AppStore.getState().routes;

console.log(appRoutes);

run(
  // these are just for wrapping around the app
  <Route handler={Layout} path="/">
    <Route handler={LoginScreen} name="loginScreen" path="login">
    </Route>
    <Route handler={ForceLogin} path="/">
      {appRoutes}
    </Route>
  </Route>,
  function (Handler) { React.render(<Handler/>, document.body);
});