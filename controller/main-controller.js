module.exports['main'] = {
  path: '/',
  methods: ['get'],
  validate: function *() {
    this.checkQuery('foo').notEmpty();
  },
  handler: function *() {
    this.body = yield {
      "foo": this.api({method: "get", uri: "/foo"}),
      "bar": this.api({mehtod: "get", uri: "/bar"})
    };
  }
};