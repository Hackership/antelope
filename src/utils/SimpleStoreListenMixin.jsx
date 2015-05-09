export default {
  componentWillMount(){
    this.store.setup({});
  },
  componentDidMount() {
    this.store.listen(this.onChange)
  },

  componentWillUnmount() {
    this.store.unlisten(this.onChange)
  },
}