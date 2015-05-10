import React from 'react';

import ContactsByEmailStore from '../stores/ContactsByEmail';
import ContactsStore from '../stores/Contacts';
import {getAttachmentUrl} from "../utils/database";
import {Modal, Table, ModalTrigger, Badge, Button, Alert, Input} from "react-bootstrap";
import SimpleStoreListenMixin from "./SimpleStoreListenMixin";
import LoadingDocumentMixin from "./LoadingDocumentMixin";
import {Route, Navigation, State} from "react-router"

import {NavItemLink} from "react-router-bootstrap"
import _ from "underscore";

import Attachment from "./Attachment";

// let DocContactRow = React.createClass({
//   mixins: [LoadingDocumentMixin],

//   render(){
//     var contact = this.props.contact.type;
//     return <li>{contact.email} ({contact.type})</li>
//   },
//   switchIntoEdit(){
//     this.setState({edit: true, contact: this.props.contact});
//   },
//   handleChanged(){
//     this.props.onChanged(this.state.contact);
//   },
// })

// let ManageContactsButton = React.createClass({
//   mixins: [SimpleStoreListenMixin],
//   store: ContactsByEmailStore,

//   onChange(){
//     this.forceUpdate()
//     console.log("DOCS", this.store.getState().docs);
//   },
//   _existingContacts(){
//     return (this.props.doc.contacts || []);
//   },
//   render(){
//     let currentContacts = this._existingContacts(),
//         modal = (
//           <Modal bsStyle='primary' title='Modal heading' animation={false}>
//             <div className='modal-body'>
//               <h4>Manage Contacts</h4>
//               <ul>
//                 {_.map(this._existingContacts(), c => <DocContactRow {...c} />)}
//               </ul>
//             </div>
//             <div className='modal-footer'>
//               <Button onClick={this.props.onRequestHide}>Close</Button>
//             </div>
//           </Modal>);

//   return (
//       <ModalTrigger modal={modal}>
//         <Button bsStyle='default' bsSize='normal'>Contacts <Badge>{currentContacts.length}</Badge></Button>
//       </ModalTrigger>
//     );
//   }
// });

let ContactPage = React.createClass({
    mixins: [State, LoadingDocumentMixin],
    _render(){
      let doc = this.store.getsState().doc;

    }
})

let ContactRow = React.createClass({
  mixins: [Navigation],
  // routeToEmail(){
  //   this.transitionTo('inboxEmail', {docId: this.props.doc._id})
  // },
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
  // ManageContactsButton: ManageContactsButton
}

