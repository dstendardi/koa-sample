module.exports = function(validator) {

  return {
    'main': {
      path: '/',
      methods: ['get'],
      before: [
        validator(function *() {
          this.checkQuery('foo').notEmpty();
        })
      ],
      handler: function *(api) {
        this.body = yield {
          "foo": api({uri: "/foo"}),
          "bar": api({uri: "/bar"})
        };
      }
    },
    'exception': {
      path: '/exception',
      methods: ['get'],
      handler: function *() {
        throw new Error("error message");
      }
    }
  }
};