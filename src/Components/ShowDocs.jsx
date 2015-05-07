import React from 'react';
import AllDocsStore from '../stores/AllDocs';


let SimpleDoc = React.createClass({
  render(){
    return (
      <li>{this.props.doc._id}</li>
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
    return (
      <ul>
        {Object.keys(this.state.docs).map(x => <SimpleDoc key={x} doc={this.state.docs[x]} />)}
      </ul>
      )
  }
});
