import React from 'react';

import ContactsByEmailStore from '../stores/ContactsByEmail';
import {getAttachmentUrl} from "../utils/database";
import {Modal, ModalTrigger, Badge, Button, Alert, Input} from "react-bootstrap";
import SimpleStoreListenMixin from "../utils/SimpleStoreListenMixin";
import {Route, Navigation, State} from "react-router"

import {NavItemLink} from "react-router-bootstrap"
import _ from "underscore";

import Attachment from "./Attachment";

let ManageContactsButton = React.createClass({
  mixins: [SimpleStoreListenMixin],
  store: ContactsByEmailStore,

  onChange(){
    this.forceUpdate()
    console.log("DOCS", this.store.getState().docs);
  },
  // foundAddresses(){
  //   if (this.props.doc.type === "inbox" || this.props.doc.type === "inbox")
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

