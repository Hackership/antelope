import React from 'react';
import AllDocsStore from '../stores/AllDocs';
import {getAttachmentUrl} from "../utils/database";
import {Table, Alert, Input} from "react-bootstrap";
import SimpleStoreListenMixin from "../utils/SimpleStoreListenMixin";
import Attachment from "./Attachment"

import _ from "underscore";

export default React.createClass({
  mixins: [SimpleStoreListenMixin],
  store: AllDocsStore,
  getInitialState() {
    return {docs: AllDocsStore.getState().docs, searchterm:""};
  },

  onChange() {
    this.setState({docs: AllDocsStore.getState().docs});
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

  _getAttachments(){
    var files = _.flatten(_.map(_.pairs(this.state.docs), function([id, doc]){
      return _.map(_.pairs(doc._attachments), function([name, a]){
        return {doc: doc, name: name, attachment: a};
      })
    }));
    if (this.state.searchterm) {
      var term = this.state.searchterm.toLowerCase();
      return _.filter(files, x => x.name.toLowerCase().indexOf(term) > -1)
    }

    return files;
  },

  render(){
    if (!this.state.docs){
      return <p>No Docs found</p>
    }

    var attachments = _.map(this._getAttachments(),
                            props => <tr><td><Attachment {...props} /></td></tr> );

    if (!attachments.length){
      attachments = (<tr><td><Alert bsStyle='warning'>
        <p>No document matching the criteria found.</p>
        </Alert></td></tr>)
    }

    return (
      <div>
        <div>
            <Input type="search"
              addonBefore="Type to search:"
              value={this.state.searchterm}
              onChange={this.changeSearch}
              onKeyUp={this.onSearchKeyUp}
              placeholder="filename" />
        </div>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <td>
                Filename
              </td>
            </tr>
          </thead>
          <tbody>
            {attachments}
          </tbody>
        </Table>
      </div>
      )
  }
});
