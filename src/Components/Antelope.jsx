import React from 'react'

let AntilopePath = require("../assets/images/antilope.svg"),
    CENTER = {'maxHeight': '100vh', 'maxWidth': '100vw',
              'margin': 'auto auto'};


let Logo = React.createClass({
    render(){
      var styles = Object.assign({}, this.props)
      return <img src={AntilopePath} style={styles} alt='Meeeehhh' />
    }
});

let Meeeh = React.createClass({
  render(){
    return (
      <div style={{'textAlign': 'center'}}>
        <Logo {...CENTER} />
      </div>
    )

  }
});

module.exports = {Meeeh: Meeeh, Logo: Logo}