import React from 'react'
import LoadingDocumentMixin from "./LoadingDocumentMixin"

import _ from "underscore"
import {Well, Row, Col, Button, Input, Alert} from "react-bootstrap"
import {RouteHandler, Navigation} from "react-router"

let Wizzard = React.createClass({
  render(){
    return (<Row style={{marginTop: "20vh"}}>
      <Col xs={12} sm={6} smOffset={3}>
        <Well>
          <h2>Welcome to Antelope!</h2>
          <h3>Let's get you started right away...</h3>
        </Well>
      </Col>
    </Row>);
  }
});

let ForceSettings = React.createClass({
  mixins: [LoadingDocumentMixin],
  _getStoreId(){
    return 'SETTINGS';
  },

  _render(state){
    return (<RouteHandler {...this.props} />)
  },

  _render_failed(){
    return (<Wizzard />)
  }

});


module.exports = {ForceSettings: ForceSettings}
