import React from 'react';
import AllDocsStore from '../stores/AllDocs';
import {getAttachmentUrl} from "../utils/database";

import _ from "underscore";


let Attachment = React.createClass({
  render(){
    // we expect :
    //    - props.doc -> pouchdb document
    //    - props.name -> name/id of the attachment in the doc
    //    - props.attachment -> the attachment object

    var {doc, name, attachment} = this.props,
        key = doc._id + "/" + name,
        size = Math.round(attachment.length / 10240),
        url = getAttachmentUrl(doc, name);

    return (
      <span key={key} {...this.props}><a target="_blank" href={url}>{name}</a> ({size}mb)</span>
      )
  }
});


export default React.createClass({
  getInitialState() {
    return {docs: AllDocsStore.getState().docs};
  },
  componentDidMount() {
    AllDocsStore.listen(this.onChange)
  },

  componentWillUnmount() {
    AllDocsStore.unlisten(this.onChange)
  },

  onChange() {
    this.setState(this.getInitialState());
  },

  render(){
    if (!this.state.docs){
      return <p>No Docs found</p>
    }

    var attachments = _.flatten(_.map(_.pairs(this.state.docs), function([id, doc]){
      return _.map(_.pairs(doc._attachments), function([name, a]){
        return (<Attachment doc={doc} name={name} attachment={a} />)
      })
    }));
    console.log(attachments);
    return (
      <ul>
        {attachments}
      </ul>
      )
  }
});
