import React from 'react';

import {Modal, Button, ModalTrigger} from 'react-bootstrap';
import {Navigation} from 'react-router';

import {ContactSelector} from "./Contacts";
import SimpleStoreListenMixin from "./SimpleStoreListenMixin";
import getDocumentStore from "../stores/SingleDocumentStore";
import ContactsStore from '../stores/Contacts';
import deepcopy from "../utils/deepcopy";

import _ from "underscore";

let emailRegExp = /([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)/gi;

let MakeInvoiceButton = React.createClass({
  mixins: [Navigation],

  greppedEmails(){
    // would be cool, if we could find email addresses in the content, too
    let doc = this.props.doc,
        emails = [];
    if (doc.msg.text.trim().slice(0, 3) === '---'){
      // forward of some sort? Let's see if we can find a cool address
      var res;
      while(res = emailRegExp.exec(doc.msg.text)){
        emails.push(res[0].toLowerCase());
      }
    }
    _.extend(emails, doc.msg.to)
    emails.push(doc.msg.from_email)
    return emails;
  },

  selectContact(id){
    var doc = deepcopy(this.props.doc);
    doc.recipient = id;
    doc.type = "invoice";
    getDocumentStore(doc._id).saveDoc(doc).then(x => this.transitionTo("invoice", {docId: doc._id}));
  },

  render(){
    let clsName = this.props.doc.msg.subject.toLowerCase().indexOf("invoice") > -1 ? "primary" : "default",
        modal = (
          <Modal bsStyle='primary' title='Who was invoiced?' animation={true}>
            <div className='modal-body'>
              <ContactSelector onSelect={this.selectContact} foundEmails={this.greppedEmails()}></ContactSelector>
            </div>
            <div className='modal-footer'>
              <Button onClick={this.props.onRequestHide}>cancel</Button>
            </div>
          </Modal>);
    return (
      <ModalTrigger modal={modal}>
        <Button bsStyle={clsName} bsSize='normal'>Convert to Invoice</Button>
      </ModalTrigger>
    );
  }
});

export default {
  MakeInvoiceButton: MakeInvoiceButton,
}