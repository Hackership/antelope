import React from 'react';

import ContactsByEmailStore from '../stores/ContactsByEmail';
import {getAttachmentUrl} from "../utils/database";
import {Modal, ModalTrigger, Badge, Button, Alert, Input} from "react-bootstrap";
import SimpleStoreListenMixin from "../utils/SimpleStoreListenMixin";
import SimpleDocListenMixin from "../utils/SimpleDocListenMixin";
import {Route, Navigation, State} from "react-router"

import {NavItemLink} from "react-router-bootstrap"
import _ from "underscore";

import Attachment from "./Attachment";

let ContactRow = React.createClass({
  mixins: [SimpleDocListenMixin],

  render(){
    var contact = this.props.contact.type;
    return <li>{contact.email} ({contact.type})</li>
  },
  switchIntoEdit(){
    this.setState({edit: true, contact: this.props.contact});
  },
  handleChanged(){
    this.props.onChanged(this.state.contact);
  },
})

let ManageContactsButton = React.createClass({
  mixins: [SimpleStoreListenMixin],
  store: ContactsByEmailStore,

  onChange(){
    this.forceUpdate()
    console.log("DOCS", this.store.getState().docs);
  },
  // getForEmail(email){
  //   return this.store.getState().docs.getByEmail(email);
  // },
  // foundAddresses(){
  //   var matches = [],
  //       unmatched = [],
  //       found = _.map(this._existingContacts(), c => c.email),
  //       msg = this.props.doc.msg;

  //   if (found.indexOf(msg.from_email) == -1){
  //     var contact = this.getForEmail(msg.from_email);
  //     if (contact){
  //       matches.push({type:'author', ref:contact})

  //     }
  //     matches

  //   }

  // },
  _existingContacts(){
    return (this.props.doc.contacts || []);
  },
  render(){
    let currentContacts = this._existingContacts(),
        modal = (
          <Modal bsStyle='primary' title='Modal heading' animation={false}>
            <div className='modal-body'>
              <h4>Manage Contacts</h4>
              <ul>
                {_.map(this._existingContacts(), c => <ContactRow {...c} />)}
              </ul>
            </div>
            <div className='modal-footer'>
              <Button onClick={this.props.onRequestHide}>Close</Button>
            </div>
          </Modal>);

  return (
      <ModalTrigger modal={modal}>
        <Button bsStyle='default' bsSize='normal'>Contacts <Badge>{currentContacts.length}</Badge></Button>
      </ModalTrigger>
    );
  }
});

module.exports = {ManageContactsButton: ManageContactsButton}

