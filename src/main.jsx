
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

let appRoutes = [
  <Route handler={Meeeh} name="home" path="/" />,
  <Route handler={ShowDocs} name="attachments" path="/search" />
]


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