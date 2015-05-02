
// libs
import {Route, run, RouteHandler} from "react-router"
import {Grid, Button} from "react-bootstrap"
import React from "react"

// internals
import {ForceLogin, LoginScreen} from "./Components/ForceLogin"
import {Meeeh} from "./Components/Antelope"
// import sessionStore from './stores/Session';
// import sessionActions from './actions/Session';



let MainApp = React.createClass({
    render(){
        return (
            <Grid fluid={true}>
                <RouteHandler {...this.props} />
            </Grid>
        );
    }
});

let routes = (
  <Route handler={MainApp} path="/">
    <Route handler={LoginScreen} name="loginScreen" path="login">
    </Route>
    <Route handler={ForceLogin} path="/">
        <Route handler={Meeeh} name="home" path="/" />
    </Route>
  </Route>
);


run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});