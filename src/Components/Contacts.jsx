import React from 'react';

import ContactsByEmailStore from '../stores/ContactsByEmail';
import ContactsStore from '../stores/Contacts';
import {getAttachmentUrl} from "../utils/database";
import AppStore from '../stores/App';
import {Grid, Row, Col, TabbedArea, TabPane, Modal, Table, ModalTrigger, Badge, Button, Alert, Input} from "react-bootstrap";
import SimpleStoreListenMixin from "./SimpleStoreListenMixin";
import LoadingDocumentMixin from "./LoadingDocumentMixin";
import {Route, Navigation, State} from "react-router"
import Select from 'react-select';
import {NavItemLink} from "react-router-bootstrap"
import _ from "underscore";

import Attachment from "./Attachment";


let ContactSelect = React.createClass({
  mixins: [SimpleStoreListenMixin],
  store: ContactsStore,
  onChange: function(){
    this.forceUpdate();
  },
  getSelection(){
    return this.refs.select.state.value;
  },
  render(){
    let options = ContactsStore.getState().collection.map(function(c){
                        return { value: c.get("_id"),
                          label: (c.get("name") || c.get("emails")[0].email)
                        }})
    if (!options.length){
      return <span><em>No contacts in Database yet</em></span>;
    }
    return <Select
            name="contact"
            ref="select"
            searchable={true}
            options={options}
            {... this.props.value}
            />
  }
})

let ContactSelector = React.createClass({
  mixins: [State, LoadingDocumentMixin],
  createNew(evt){
    evt.preventDefault();
    var new_doc = {'type': 'contact'};
    if (this.refs.name.getValue()){
      new_doc.name = this.refs.name.getValue();
    }

    if (this.refs.emails){
      // email selector
      new_doc.emails = _.map(this.refs.emails.state.values, function(e){ return {email: e.value}})
    } else if (this.refs.email) {
      let val = this.refs.email.getValue();
      if (val) new_doc.emails = [{email: val}]
    }
    this.store.createDoc(new_doc).then(x => this.selectContact(x.id))
  },
  submitExisting(evt){
    evt.preventDefault();
    if (!this.refs.existingContact.getSelection()) return;
    this.selectContact(this.refs.existingContact.getSelection());
  },
  selectContact(id){
    this.props.onSelect(id);
  },
  _render(){
    let emailsSelector = this.props.foundEmails ?
          <Select
              name="email"
              ref="emails"
              multi={true}
              delimiter=','
              options={_.map(this.props.foundEmails, function(e){return{value: e, label: e}})}
            /> : <Input type="email" ref="email" />,
      prefound = this.props.foundEmails ? _.map(
                    ContactsStore.getState().collection.filter(
                          c => _.find( c.get("emails"),
                              e => _.contains(this.props.foundEmails, e.email)
                              )
                          ),
                      c => <Button onClick={a=>this.selectContact(c.get("_id"))}>{c.get("name") || c.get("emails")[0].email }</Button>) : null;

    return (
      <TabbedArea>
        <TabPane eventKey={1} tab='Existing'>
          <Grid fluid>
            <Row>
              {prefound}
              {this.props.children}
            </Row>
            <Row>
              <form onSubmit={this.submitExisting}>
                <Col md={9}>
                  <ContactSelect ref="existingContact" onChange={this.selectContact} />
                </Col>
                <Col md={3}>
                  <Button disabled={this.store.getState().saving} bsStyle="primary" type="submit">{this.props.selectLabel || "Select"}</Button>
                </Col>
              </form>
            </Row>
          </Grid>
        </TabPane>
        <TabPane eventKey={2} tab='Create New'>
          <h3>Create New Contact</h3>
          <form onSubmit={this.createNew}>
            <Input type="text" ref="name" label="Name" required />
            {emailsSelector}
            <Button disabled={this.store.getState().saving} bsStyle="primary" type="submit">Create</Button>
          </form>
        </TabPane>
      </TabbedArea>
    );
  }
})


let ContactPage = React.createClass({
  mixins: [State, LoadingDocumentMixin],
  _render(){
    let doc = this.store.getState().doc,
        refs = this.store.getState().refs,
        refItems = _.map((AppStore.getState().contactReferences || []),
                          e => React.createElement(e, {doc: doc, refs:refs}));
    return (<div>
          <h1>{doc.name}</h1>
          {refItems}
          </div>);
  }
})

let ContactRow = React.createClass({
  mixins: [Navigation],
  // routeToEmail(){
  //   this.transitionTo('inboxEmail', {docId: this.props.doc._id})
  // },

  routeToContact: function(){
    this.transitionTo('contact', {docId: this.props.contact._id});
  },

  render(){

    var contact = this.props.contact;
    return (
      <tr onClick={this.routeToContact} key={contact._id}>
        <td>{contact.name}
          <br />{_.map(contact.emails, e => e.email).join(", ")}
        </td>
      </tr>
      )
  }
});


let ContactsItem = React.createClass({
  render(){
    return <NavItemLink to="contacts">Contacts</NavItemLink>;
  }
});

let ContactsPage = React.createClass({
  mixins: [SimpleStoreListenMixin],
  store: ContactsStore,
  getInitialState() {
    return {collection: ContactsStore.getState().collection, searchterm:""};
  },

  onChange() {
    this.setState({collection: ContactsStore.getState().collection});
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

  _getContacts(){
    var contacts = this.state.collection.models;
    if (this.state.searchterm) {
      var term = this.state.searchterm.toLowerCase();
      return _.filter(contacts, x =>
            (x.get("name") || "").toLowerCase().indexOf(term) > -1 ||
            _.find((x.get("emails") || []), e => e.email.toLowerCase().indexOf(term) > -1 )
            )
    }

    return contacts;
  },

  render(){
    if (!this.state.collection){
      return <p>No Contacts found</p>
    }

    var contacts = this._getContacts();

    if (!contacts.length){
      contacts = (<tr><td><Alert bsStyle='warning'>
        <p>No document matching the criteria found.</p>
        </Alert></td></tr>)
    } else {
      contacts = _.map(contacts, doc => <ContactRow contact={doc.attributes} />);
    }

    return (
      <div>
        <div>
            <Input type="search"
              addonBefore="find"
              value={this.state.searchterm}
              onChange={this.changeSearch}
              onKeyUp={this.onSearchKeyUp}
              placeholder="contact" />
        </div>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <td>
                Name
              </td>
            </tr>
          </thead>
          <tbody>
            {contacts}
          </tbody>
        </Table>
      </div>
      )
  }
});

module.exports = {ContactsPage: ContactsPage,
    ContactSelector: ContactSelector,
    ContactSelect: ContactSelect,
    ContactPage: ContactPage,
  // ManageContactsButton: ManageContactsButton
}

