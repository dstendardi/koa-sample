module.exports['main'] = {
  path: '/',
  methods: ['get'],
  validate: function *() {
    this.checkQuery('foo').notEmpty();
  },
  handler: function *(api) {
    this.body = yield {
      "foo": api({uri: "/foo"}),
      "bar": api({uri: "/bar"})
    };
  }
};