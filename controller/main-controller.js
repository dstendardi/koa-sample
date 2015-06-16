module.exports['main'] = {
  path: '/',
  methods: ['get'],
  handler: function *() {
    this.body = yield {
      "foo": this.api.get("http://localhost:4000/foo"),
      "bar": this.api.get("http://localhost:4000/bar")
    };

  }
};