import React from 'react';
import {getAttachmentUrl} from "../utils/database";


export default React.createClass({
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