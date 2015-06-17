module.exports['main'] = {
  path: '/',
  methods: ['get'],
  validate: function *() {
    this.checkQuery('foo').notEmpty();
  },
  handler: function *() {
    this.body = yield {
      "foo": this.api({uri: "/foo"}),
      "bar": this.api({uri: "/bar"})
    };
  }
};