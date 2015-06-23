import React from 'react';
import SequencesStore from '../stores/Sequences';
import {Row, Col, Button, Input} from "react-bootstrap";
import SimpleStoreListenMixin from "./SimpleStoreListenMixin";
import Attachment from "./Attachment"

import _ from "underscore";

export default React.createClass({
  mixins: [SimpleStoreListenMixin],
  store: SequencesStore,
  getInitialState() {
    return {collection: SequencesStore.getState().collection};
  },

  onChange() {
    this.forceUpdate();
  },

  triggerUpdate(name){
    SequencesStore.nextSequence(name);
  },

  submitNew(){
    let name = this.refs['newSeq'].getValue();
    SequencesStore.nextSequence(name);
  },

  render(){
    let collection = this.state.collection.map(s => <Col xs={6} sm={4}><h2>{s.get("_id")}</h2><p>{s.get("count")}</p><Button onClick={x=>this.triggerUpdate(s.get("_id"))}>Next</Button></Col>);
    return (
      <div>
        <Row>
          <Col xs={12} sm={3} smOffset={9}>
            <form onSubmit={this.submitNew}>
              <Input type="text" ref="newSeq"
                buttonAfter={<Button type="submit">Add</Button>}
                placeholder="add new sequence" required />
            </form>
          </Col>
        </Row>
        <Row>
          {collection || <Col xs={12} sm={6} smOffset={6}><p>No Sequences created yet</p></Col> }
        </Row>
      </div>
      )
  }
});
