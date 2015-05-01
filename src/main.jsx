
// libs
let React = require("react"),
    {Container, Button} = require("react-bootstrap"),
    {Route, run, RouteHandler} = require("react-router");

// internals
import {ForceLogin, LoginScreen} from "./Components/ForceLogin"
// import sessionStore from './stores/Session';
// import sessionActions from './actions/Session';

let AntilopePath = require("./assets/images/antilope.svg"),
    CENTER = {'maxHeight': '100vh', 'maxWidth': '100vw',
              'margin': 'auto auto'};

let Meeeh = React.createClass({
    render: function(){
        return (
                <div style={{'textAlign': 'center'}}>
                    <img src={AntilopePath} style={CENTER} alt='Meeeehhh' />
                </div>
        )

    }
});


let MainApp = React.createClass({
    render(){
        return (
            <div>
                <RouteHandler {...this.props} />
            </div>
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