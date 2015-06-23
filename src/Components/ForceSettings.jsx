import React from 'react'
import {Well, Row, Col, Button, Input, Alert} from "react-bootstrap"
import {RouteHandler, Navigation} from "react-router"

import LoadingDocumentMixin from "./LoadingDocumentMixin"
import SettingsStore from "../stores/SettingsStore"
import {Logo} from "./Antelope"

import _ from "underscore"

let Wizzard = React.createClass({

  submit(evt){
    this.props.store.createDoc({
      '_id': 'SETTINGS',
      'name': this.refs['name'].getValue(),
      'address': this.refs['address'].getValue()
    }, true);
  },

  render(){
    return (<Row style={{marginTop: "20vh"}}>
      <Col xs={12} sm={6} smOffset={3}>
        <Well>
          <h2>Welcome to <Logo margin='0 0.15em' maxWidth='1em' maxHeight='1em' display='inline' />!</h2>
          <p>This wizzard will help you, create the initial setup. Let's get you started right away...</p>

          <form onSubmit={this.submit} className='form-horizontal'>
            <hr />
            <h3>Your company info:</h3>
            <Input bsStyle="inline" label="Name" labelClassName='col-xs-3' wrapperClassName='col-xs-9' type="input" ref="name" required />
            <Input bsStyle="inline"  label="Full Address (incl. Company Name)" labelClassName='col-xs-3' wrapperClassName='col-xs-9' type="textarea" ref="address" required />

            <hr />
            <Button bsStyle="primary" type='submit'>Save</Button>
          </form>
        </Well>
      </Col>
    </Row>);
  }
});

let ForceSettings = React.createClass({
  mixins: [LoadingDocumentMixin],

  _getStore(){
    return SettingsStore;
  },

  _render(state){
    return (<RouteHandler {...this.props} />)
  },

  _render_failed(){
    return (<Wizzard store={this.store}/>)
  }

});


module.exports = {ForceSettings: ForceSettings}
