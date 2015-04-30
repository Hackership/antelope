
var React = require("react");

var AntilopePath = require("./assets/images/antilope.svg");
var CENTER = {'max-height': '100vh', 'max-width': '100vw', 'margin': 'auto auto'};

var Meeeh = React.createClass({
    render: function(){
        return (
            <div style={{'text-align': 'center'}}>
                <img src={AntilopePath} style={CENTER} alt="Meeeehhh" />
            </div>
        )

    }
});

React.render(<Meeeh />, document.getElementById("main"))