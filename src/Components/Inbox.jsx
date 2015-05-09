import React from 'react';
import InboxStore from '../stores/Inbox';
import {getAttachmentUrl} from "../utils/database";
import {Badge, Table, Alert, Input} from "react-bootstrap";
import SimpleStoreListenMixin from "../utils/SimpleStoreListenMixin";
import {Route} from "react-router"

import {NavItemLink} from "react-router-bootstrap"
import _ from "underscore";

import Attachment from "./Attachment";


let EmailRow = React.createClass({
  render(){
    // we expect :
    //    - props.doc -> pouchdb document
    //    - props.name -> name/id of the attachment in the doc
    //    - props.attachment -> the attachment object

    var doc = this.props.doc,
        msg = doc.msg;

    return (
      <tr key={doc._id}>
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
    var count = _.keys(this.store.getState().docs).length;
    return <NavItemLink to="inbox">Inbox <Badge>{count}</Badge></NavItemLink>;
  }
});



let InboxPage = React.createClass({
  mixins: [SimpleStoreListenMixin],
  store: InboxStore,
  getInitialState() {
    return {docs: InboxStore.getState().docs, searchterm:""};
  },

  onChange() {
    this.setState({docs: InboxStore.getState().docs});
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
    var emails = _.values(this.state.docs);
    if (this.state.searchterm) {
      var term = this.state.searchterm.toLowerCase();
      return _.filter(emails, x =>
            x.msg.subject.toLowerCase().indexOf(term) > -1 ||
            x.msg.from_name.toLowerCase().indexOf(term) > -1 ||
            x.msg.from_email.toLowerCase().indexOf(term) > -1 ||
            x.msg.text.toLowerCase().indexOf(term) > -1 ||
            _.find(x.msg.to, t => (t[0].toLowerCase().indexOf(term) > -1 || (t[1] || "" ).toLowerCase().indexOf(term) > -1) )
            )
    }

    return emails;
  },

  render(){
    if (!this.state.docs){
      return <p>No Emails found</p>
    }

    var emails = this._getEmails();

    if (!emails.length){
      emails = (<tr><td><Alert bsStyle='warning'>
        <p>No document matching the criteria found.</p>
        </Alert></td></tr>)
    } else {
      emails = _.map(emails, doc => <EmailRow doc={doc} />);
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

module.exports = {InboxPage: InboxPage, InboxMenuItem: InboxMenuItem}
