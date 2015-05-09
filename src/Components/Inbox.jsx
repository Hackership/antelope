import React from 'react';
import InboxStore from '../stores/Inbox';
import AppStore from '../stores/App';
import {getAttachmentUrl} from "../utils/database";
import {Grid, Row, Col, Badge, Table, Alert, Input} from "react-bootstrap";
import SimpleStoreListenMixin from "../utils/SimpleStoreListenMixin";
import {Route, Navigation, State} from "react-router"

import {NavItemLink} from "react-router-bootstrap"
import _ from "underscore";

import Attachment from "./Attachment";

let EmailHandler = React.createClass({
  mixins: [State, SimpleStoreListenMixin],
  store: InboxStore,
  getDoc(){
    return (InboxStore.getState().collection.get(this.getParams().docId) || {}).attributes;
  },
  onChange(){
    this.forceUpdate()
  },
  render(){
    let doc = this.getDoc();

    if (!doc){
      return <span>Loading</span>
    }

    let msg = doc.msg,
        actions = _.map((AppStore.getState().emailActions || []),
                         e => React.createElement(e, {doc: doc, msg:msg}));

    return (<Grid>
        <Row>
          <h2>{msg.subject}</h2>
        </Row>
        <Row>
          {actions}
        </Row>
        <Row>
          <Col md={6}>
            <h3>To</h3>
            {_.map(msg.to, t => <span>{t}</span>)}
          </Col>
          <Col md={6}>
            <h3>From</h3>
            {msg.from_name}
            <br /><span className="emailAddress">{'<'}{msg.from_email}{'>'}</span>
          </Col>
        </Row>
        <Row>
          <pre>
            {msg.text}
          </pre>
        </Row>
        <Row>
          <h4>Attachments:</h4>
          <ul>
            {_.map(
                _.pairs(doc._attachments),
                  ([name, a]) =>
                    <li><Attachment name={name} doc={doc} attachment={a} /></li>)}
          </ul>
        </Row>
        <Row>
          {actions}
        </Row>
      </Grid>)
  }
})


let EmailRow = React.createClass({
  mixins: [Navigation],
  routeToEmail(){
    this.transitionTo('inboxEmail', {docId: this.props.doc._id})
  },
  render(){
    // we expect :
    //    - props.doc -> pouchdb document
    //    - props.name -> name/id of the attachment in the doc
    //    - props.attachment -> the attachment object

    console.log(doc);
    var doc = this.props.doc,
        msg = doc.msg;

    return (
      <tr onClick={this.routeToEmail} key={doc._id}>
        <td>{msg.from_name}
          <br /><span className="emailAddress">{'<'}{msg.from_email}{'>'}</span>
        </td>
        <td>
          {_.map(msg.to, t => <span>{t}</span>)}
        </td>
        <td>{msg.subject}</td>
        <td>{_.map(
              _.pairs(doc._attachments),
                ([name, a]) =>
                  <Attachment name={name} doc={doc} attachment={a} />)}</td>
      </tr>
      )
  }
});


let InboxMenuItem = React.createClass({
  mixins: [SimpleStoreListenMixin],
  store: InboxStore,

  onChange(){
    this.forceUpdate()
  },
  render(){
    var count = this.store.getState().collection.length;
    return <NavItemLink to="inbox">Inbox <Badge>{count}</Badge></NavItemLink>;
  }
});



let InboxPage = React.createClass({
  mixins: [SimpleStoreListenMixin],
  store: InboxStore,
  getInitialState() {
    return {collection: InboxStore.getState().collection, searchterm:""};
  },

  onChange() {
    this.setState({collection: InboxStore.getState().collection});
  },

  changeSearch(evt){
    evt.defaultPrevented = true;
    this.setState({searchterm: evt.target.value})
  },

  cancelSearch(){
    this.setState({searchterm: null});
  },

  onSearchKeyUp(evt){
    // reset on ESC:
    evt.keyCode === 27 && this.cancelSearch();
  },

  _getEmails(){
    var emails = this.state.collection.models;
    if (this.state.searchterm) {
      var term = this.state.searchterm.toLowerCase();
      return _.filter(emails, x =>
            x.attributes.msg.subject.toLowerCase().indexOf(term) > -1 ||
            x.attributes.msg.from_name.toLowerCase().indexOf(term) > -1 ||
            x.attributes.msg.from_email.toLowerCase().indexOf(term) > -1 ||
            x.attributes.msg.text.toLowerCase().indexOf(term) > -1 ||
            _.find(x.attributes.msg.to, t => (t[0].toLowerCase().indexOf(term) > -1 || (t[1] || "" ).toLowerCase().indexOf(term) > -1) )
            )
    }

    return emails;
  },

  render(){
    if (!this.state.collection){
      return <p>No Emails found</p>
    }

    var emails = this._getEmails();

    console.log(emails);

    if (!emails.length){
      emails = (<tr><td><Alert bsStyle='warning'>
        <p>No document matching the criteria found.</p>
        </Alert></td></tr>)
    } else {
      emails = _.map(emails, doc => <EmailRow doc={doc.attributes} />);
    }

    return (
      <div>
        <div>
            <Input type="search"
              addonBefore="find"
              value={this.state.searchterm}
              onChange={this.changeSearch}
              onKeyUp={this.onSearchKeyUp}
              placeholder="email" />
        </div>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <td>
                From
              </td>
              <td>
                To
              </td>
              <td>
                Subject
              </td>
              <td>
                Attachments
              </td>
            </tr>
          </thead>
          <tbody>
            {emails}
          </tbody>
        </Table>
      </div>
      )
  }
});


module.exports = {InboxPage: InboxPage,
                  EmailHandler: EmailHandler,
                  InboxMenuItem: InboxMenuItem}

